#!/usr/bin/env python3
"""AcademyAI Radar - gunluk ajan.

sources.json'daki kaynaklari okur (RSS/Atom, Crossref, YouTube, sayfa),
son 30 gunun yeni iceriklerini bulur, kapak resimlerini akistan ya da
sayfanin og:image etiketinden alir, istege bagli olarak Turkce ozet yazar
ve data/items.json ile data/status.json dosyalarini gunceller.

Yalnizca Python standart kutuphanesi. Ortam degiskenleri (istege bagli):
  ANTHROPIC_API_KEY  Turkce ozetler ve "page" yontemli kaynaklar icin
  RADAR_MODEL        varsayilan: claude-haiku-5-5
  RADAR_MAILTO       Crossref'e iletisim adresi (onerilir)

Calistirma:  python radar_ajan.py
Test:        python radar_ajan.py --fixtures tests/fixtures --data /tmp/out
"""

import argparse
import gzip
import hashlib
import html
import json
import os
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timedelta, timezone
from email.utils import parsedate_to_datetime

ROOT = os.path.dirname(os.path.abspath(__file__))
UA = "Mozilla/5.0 (compatible; AcademyAI-Radar/1.0)"
NEW_WINDOW_DAYS = 30      # bu kadar gunden eski icerik yeni sayilmaz
KEEP_DAYS = 60            # listede tutma suresi
MAX_NEW_PER_SOURCE = 10
MAX_ITEMS = 600
OG_IMAGE_LIMIT = 30       # bir calismada en fazla bu kadar sayfadan kapak resmi aranir
MODEL = os.environ.get("RADAR_MODEL", "claude-haiku-5-5")
API_KEY = os.environ.get("ANTHROPIC_API_KEY", "").strip()
MAILTO = os.environ.get("RADAR_MAILTO", "").strip()
UTC = timezone.utc


def now_utc():
    return datetime.now(UTC)


def iso(dt):
    return dt.astimezone(UTC).strftime("%Y-%m-%dT%H:%M:%SZ")


def item_id(source_id, url):
    return f"{source_id}-{hashlib.sha1(url.encode('utf-8')).hexdigest()[:12]}"


# ---------------------------------------------------------------- ag
class Fetcher:
    """Internetten ya da (test icin) yerel bir klasorden okur."""

    def __init__(self, fixtures=None):
        self.fixtures = fixtures
        self.index = {}
        if fixtures:
            with open(os.path.join(fixtures, "index.json"), encoding="utf-8") as f:
                self.index = json.load(f)

    def get(self, url, accept=None, attempts=3):
        if self.fixtures:
            name = self.index.get(url)
            if not name:
                raise RuntimeError("fixture yok: " + url)
            with open(os.path.join(self.fixtures, name), "rb") as f:
                return f.read()
        last = None
        for i in range(attempts):
            try:
                headers = {"User-Agent": UA}
                if accept:
                    headers["Accept"] = accept
                req = urllib.request.Request(url, headers=headers)
                with urllib.request.urlopen(req, timeout=25) as resp:
                    data = resp.read()
                if data[:2] == b"\x1f\x8b":
                    data = gzip.decompress(data)
                return data.lstrip(b"\xef\xbb\xbf \t\r\n")
            except (urllib.error.URLError, TimeoutError, ConnectionError) as e:
                last = e
                code = getattr(e, "code", None)
                if code in (400, 401, 403, 404, 410):
                    break
                time.sleep(4 * (i + 1))
        raise RuntimeError(f"{url} okunamadi: {last}")


# ---------------------------------------------------------------- yardimcilar
TAG_RE = re.compile(r"<[^>]+>")
WS_RE = re.compile(r"\s+")


def strip_html(s):
    if not s:
        return ""
    s = re.sub(r"(?is)<(script|style)[^>]*>.*?</\1>", " ", s)
    s = TAG_RE.sub(" ", s)
    return WS_RE.sub(" ", html.unescape(s)).strip()


def clip(s, n=280):
    s = (s or "").strip()
    if len(s) <= n:
        return s
    cut = s[:n].rsplit(" ", 1)[0]
    return cut.rstrip(",;:.-") + "…"


def first_img(markup):
    if not markup:
        return None
    m = re.search(r"<img[^>]+src=[\"']([^\"']+)[\"']", markup, re.I)
    return m.group(1) if m else None


def og_image(page_html):
    for prop in ("og:image", "twitter:image", "og:image:url"):
        m = re.search(r"<meta[^>]+(?:property|name)=[\"']%s[\"'][^>]*content=[\"']([^\"']+)[\"']" % re.escape(prop), page_html, re.I) \
            or re.search(r"<meta[^>]+content=[\"']([^\"']+)[\"'][^>]*(?:property|name)=[\"']%s[\"']" % re.escape(prop), page_html, re.I)
        if m:
            return html.unescape(m.group(1))
    return None


def parse_date(s):
    if not s:
        return None
    s = s.strip()
    try:
        dt = parsedate_to_datetime(s)
        if dt:
            return dt if dt.tzinfo else dt.replace(tzinfo=UTC)
    except (TypeError, ValueError, IndexError):
        pass
    try:
        dt = datetime.fromisoformat(s.replace("Z", "+00:00"))
        return dt if dt.tzinfo else dt.replace(tzinfo=UTC)
    except ValueError:
        return None


def absolute(url, base):
    if not url:
        return None
    return urllib.parse.urljoin(base, html.unescape(url.strip()))


def is_http(u):
    return bool(u) and u.startswith(("http://", "https://"))


def local(tag):
    return tag.rsplit("}", 1)[-1]


# ---------------------------------------------------------------- RSS / Atom
def parse_feed(raw, base_url):
    root = ET.fromstring(raw)
    out = []
    for e in root.iter():
        if local(e.tag) not in ("item", "entry"):
            continue
        title = link = date_s = desc = content = image = video_id = None
        for c in e.iter():
            name = local(c.tag)
            if c is e:
                continue
            if name == "title" and title is None:
                title = (c.text or "").strip()
            elif name == "link":
                href = c.get("href")
                if href and c.get("rel", "alternate") == "alternate" and not link:
                    link = href
                elif not href and c.text and not link:
                    link = c.text.strip()
            elif name in ("pubDate", "published", "date") and not date_s:
                date_s = c.text
            elif name == "updated" and not date_s:
                date_s = c.text
            elif name in ("description", "summary") and desc is None:
                desc = c.text or ""
            elif name == "encoded" or (name == "content" and c.get("type") in (None, "html", "xhtml", "text") and c.get("url") is None):
                content = content or (c.text or "")
            elif name == "thumbnail" and not image:
                image = c.get("url")
            elif name == "content" and c.get("url") and not image:
                if (c.get("medium") == "image") or (c.get("type") or "").startswith("image/"):
                    image = c.get("url")
            elif name == "enclosure" and not image and (c.get("type") or "").startswith("image/"):
                image = c.get("url")
            elif name == "videoId":
                video_id = (c.text or "").strip()
            elif name == "description" and desc is None:
                desc = c.text or ""
        if not title or not link:
            continue
        markup = content or desc or ""
        out.append({
            "title": strip_html(title),
            "url": absolute(link, base_url),
            "date": parse_date(date_s),
            "precision": "time",
            "excerpt": clip(strip_html(desc or content)),
            "image": absolute(image or first_img(markup), base_url),
            "videoId": video_id,
        })
    return out


# ---------------------------------------------------------------- Crossref
JATS_RE = re.compile(r"</?jats:[^>]+>")


def crossref(fetcher, src, since):
    q = {
        "filter": f"from-pub-date:{since.strftime('%Y-%m-%d')}",
        "sort": "published", "order": "desc", "rows": "20",
        "select": "title,DOI,URL,published,published-online,created,abstract,type",
    }
    if MAILTO:
        q["mailto"] = MAILTO
    url = f"https://api.crossref.org/journals/{src['issn']}/works?" + urllib.parse.urlencode(q)
    data = json.loads(fetcher.get(url, accept="application/json"))
    out = []
    for w in data.get("message", {}).get("items", []):
        title = " ".join(w.get("title") or []).strip()
        if not title or title.lower() in ("issue information", "editorial board", "table of contents") or w.get("type") == "journal-issue":
            continue
        # Basili sayi tarihi cogu zaman ileri bir ay olur; once cevrimici yayin, sonra kayit tarihi
        parts = ((w.get("published-online") or {}).get("date-parts") or [[None]])[0]
        if parts and parts[0] and len(parts) == 3:
            y, m, d = parts
            dt, precision = datetime(y, m, d, 9, 0, tzinfo=UTC), "day"
        elif (w.get("created") or {}).get("date-time"):
            dt, precision = parse_date(w["created"]["date-time"]), "day"
        else:
            parts = ((w.get("published") or {}).get("date-parts") or [[None]])[0]
            if not parts or not parts[0]:
                continue
            y, m, d = (parts + [None, None])[:3]
            precision = "day" if d else "month"
            dt = datetime(y, m or 1, d or 1, 9, 0, tzinfo=UTC)
        if not dt:
            continue
        doi = w.get("DOI")
        out.append({
            "title": strip_html(title),
            "url": f"https://doi.org/{doi}" if doi else w.get("URL"),
            "date": dt, "precision": precision,
            "excerpt": clip(strip_html(JATS_RE.sub(" ", w.get("abstract") or ""))),
            "image": None, "videoId": None,
        })
    return out


# ---------------------------------------------------------------- YouTube
def youtube(fetcher, src):
    prefix = {"shorts": "UUSH", "long": "UULF"}.get(src.get("kind"), "UU")
    feed = "https://www.youtube.com/feeds/videos.xml?playlist_id=" + prefix + src["channel"][2:]
    items = parse_feed(fetcher.get(feed), feed)
    for it in items:
        vid = it.get("videoId")
        if vid:
            it["url"] = (f"https://www.youtube.com/shorts/{vid}" if src.get("kind") == "shorts"
                         else f"https://www.youtube.com/watch?v={vid}")
            it["image"] = it.get("image") or f"https://i.ytimg.com/vi/{vid}/hqdefault.jpg"
    return items


# ---------------------------------------------------------------- Claude API
def claude(prompt, max_tokens=2000):
    body = json.dumps({
        "model": MODEL, "max_tokens": max_tokens,
        "messages": [{"role": "user", "content": prompt}],
    }).encode("utf-8")
    req = urllib.request.Request("https://api.anthropic.com/v1/messages", data=body, headers={
        "x-api-key": API_KEY, "anthropic-version": "2023-06-01", "content-type": "application/json",
    })
    with urllib.request.urlopen(req, timeout=90) as resp:
        data = json.loads(resp.read())
    return "".join(b.get("text", "") for b in data.get("content", []) if b.get("type") == "text")


def json_array(text):
    m = re.search(r"\[.*\]", text, re.S)
    return json.loads(m.group(0)) if m else []


def page_to_text(markup, base):
    markup = re.sub(r"(?is)<(script|style|svg|noscript)[^>]*>.*?</\1>", " ", markup)

    def link(m):
        href = absolute(m.group(1), base)
        text = strip_html(m.group(2))
        return f" [{text}]({href}) " if text else " "
    markup = re.sub(r"(?is)<a[^>]+href=[\"']([^\"']+)[\"'][^>]*>(.*?)</a>", link, markup)
    return clip(strip_html(markup), 60000)


def page_source(fetcher, src):
    if not API_KEY:
        raise RuntimeError("Bu kaynak için API anahtarı gerekiyor")
    raw = fetcher.get(src["page"]).decode("utf-8", "replace")
    text = page_to_text(raw, src["page"])
    prompt = (
        "Below is the text of a news/articles listing page, with links as [text](url).\n"
        "List the 10 most recent news posts or articles shown, newest first, as a JSON array of objects "
        "with keys title, url (absolute), date (YYYY-MM-DD). Use only what the page shows; skip items "
        "without a visible date. Output only the JSON.\n\n" + text)
    out = []
    for x in json_array(claude(prompt)):
        dt = parse_date((x.get("date") or "") + "T09:00:00Z") if x.get("date") else None
        if x.get("title") and is_http(x.get("url")) and dt:
            out.append({"title": x["title"].strip(), "url": x["url"], "date": dt, "precision": "day",
                        "excerpt": "", "image": None, "videoId": None})
    return out


def summarize(items):
    """Yeni ogeler icin 1-2 cumlelik Turkce ozet (API anahtari varsa)."""
    if not API_KEY or not items:
        return
    lines = [{"n": i, "title": it["title"], "text": it.get("excerpt", "")} for i, it in enumerate(items)]
    prompt = (
        "For each item, write a Turkish summary of 1-2 short sentences (max 35 words) in your own words, "
        "using only the given title and text. Do not quote. If the text is empty, describe what the title "
        "says. Return a JSON array of objects {\"n\": number, \"ozet\": string}. Output only the JSON.\n\n"
        + json.dumps(lines, ensure_ascii=False))
    try:
        for x in json_array(claude(prompt, max_tokens=3000)):
            n = x.get("n")
            if isinstance(n, int) and 0 <= n < len(items) and x.get("ozet"):
                items[n]["summary"] = str(x["ozet"]).strip()
    except Exception as e:  # ozet olmadan devam
        print(f"  ozet yazilamadi: {e}", file=sys.stderr)


# ---------------------------------------------------------------- ana akis
def load_json(path, default):
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    except (OSError, ValueError):
        return default


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--fixtures", help="test: internete cikmadan bu klasordeki dosyalari kullan")
    ap.add_argument("--data", default=os.path.join(ROOT, "data"))
    ap.add_argument("--sources", default=os.path.join(ROOT, "sources.json"))
    args = ap.parse_args()

    fetcher = Fetcher(args.fixtures)
    catalog = load_json(args.sources, {})
    os.makedirs(args.data, exist_ok=True)
    items_path = os.path.join(args.data, "items.json")
    existing = load_json(items_path, {}).get("items", [])
    by_id = {it["id"]: it for it in existing}

    now = now_utc()
    window = now - timedelta(days=NEW_WINDOW_DAYS)
    status = {}
    og_budget = OG_IMAGE_LIMIT

    for src in catalog.get("sources", []):
        sid, method = src["id"], src["method"]
        print(f"- {src['name']} ({method})")
        try:
            if method == "rss":
                found = parse_feed(fetcher.get(src["feed"]), src["feed"])
            elif method == "crossref":
                found = crossref(fetcher, src, window)
            elif method == "youtube":
                found = youtube(fetcher, src)
            elif method == "page":
                found = page_source(fetcher, src)
            else:
                raise RuntimeError("bilinmeyen yöntem " + method)
        except Exception as e:
            note = str(e)
            if "API anahtarı" not in note:
                note = "Okunamadı: " + note[:160]
            status[sid] = {"ok": False, "note": note, "count": sum(1 for i in existing if i["sourceId"] == sid)}
            print(f"  HATA: {note}", file=sys.stderr)
            continue

        new = []
        for f in found:
            if not f.get("date") or not is_http(f.get("url")) or f["date"] < window or f["date"] > now + timedelta(days=2):
                continue
            iid = item_id(sid, f["url"])
            if iid in by_id or any(n["id"] == iid for n in new):
                continue
            new.append({
                "id": iid, "sourceId": sid, "title": f["title"], "url": f["url"],
                "published": iso(f["date"]), "precision": f.get("precision", "time"),
                "excerpt": f.get("excerpt") or "", "summary": "",
                "image": f.get("image") if is_http(f.get("image")) else None,
                "videoId": f.get("videoId"), "addedAt": iso(now),
            })
        new.sort(key=lambda x: x["published"], reverse=True)
        new = new[:MAX_NEW_PER_SOURCE]

        # kapak resmi: akista yoksa makale sayfasindaki og:image
        for it in new:
            if it["image"] or method in ("crossref", "youtube") or og_budget <= 0:
                continue
            og_budget -= 1
            try:
                img = og_image(fetcher.get(it["url"], attempts=1).decode("utf-8", "replace"))
                if img:
                    img = absolute(img, it["url"])
                    it["image"] = img if is_http(img) else None
            except Exception:
                pass

        summarize(new)
        for it in new:
            by_id[it["id"]] = it
        status[sid] = {"ok": True, "new": len(new), "count": sum(1 for i in by_id.values() if i["sourceId"] == sid)}
        print(f"  {len(new)} yeni")

    keep_after = iso(now - timedelta(days=KEEP_DAYS))
    items = [i for i in by_id.values() if i["published"] >= keep_after]
    items.sort(key=lambda i: i["published"], reverse=True)
    items = items[:MAX_ITEMS]
    for sid, st in status.items():
        st["count"] = sum(1 for i in items if i["sourceId"] == sid)

    with open(items_path, "w", encoding="utf-8") as f:
        json.dump({"generatedAt": iso(now), "items": items}, f, ensure_ascii=False, indent=1)
    with open(os.path.join(args.data, "status.json"), "w", encoding="utf-8") as f:
        json.dump({"lastRun": iso(now), "summaries": bool(API_KEY), "sources": status}, f, ensure_ascii=False, indent=1)
    print(f"Toplam {len(items)} içerik yazıldı.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
