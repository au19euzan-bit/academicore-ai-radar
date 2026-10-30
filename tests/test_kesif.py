"""Yonetim panelinden eklenen kaynaklarin ajan tarafindan okunmasini test eder.

Calistirma:  python tests/test_kesif.py
"""
import json
import os
import subprocess
import sys
import tempfile
import urllib.parse
from datetime import datetime, timedelta, timezone
from email.utils import format_datetime

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
now = datetime.now(timezone.utc)
d = lambda h: now - timedelta(hours=h)


def rss(title, link, hours):
    return f"""<?xml version="1.0"?><rss version="2.0"><channel><title>x</title>
<item><title>{title}</title><link>{link}</link><pubDate>{format_datetime(d(hours))}</pubDate><description>d</description></item>
</channel></rss>"""


def main():
    tmp = tempfile.mkdtemp()
    fx, data = os.path.join(tmp, "fx"), os.path.join(tmp, "data")
    os.makedirs(fx), os.makedirs(data)
    idx = {}

    def put(url, body):
        name = f"f{len(idx)}"
        with open(os.path.join(fx, name), "w", encoding="utf-8") as f:
            f.write(body)
        idx[url] = name

    # A: site adresi -> <link rel=alternate> ile akis
    put("https://blog.example/", '<html><head><link rel="alternate" type="application/rss+xml" title="Yorumlar" href="/comments/feed/">'
        '<link rel="alternate" type="application/rss+xml" href="/feed/"></head></html>')
    put("https://blog.example/feed/", rss("Blog yazisi", "https://blog.example/p1", 5))
    # B: adresin kendisi akis
    put("https://news.example/rss.xml", rss("Haber", "https://news.example/n1", 6))
    # C: YouTube @kullanici -> kanal kimligi
    put("https://www.youtube.com/@demo", '<html><link rel="canonical" href="https://www.youtube.com/channel/UCabcdefghijklmnopqrstuv"></html>')
    put("https://www.youtube.com/feeds/videos.xml?playlist_id=UUSHabcdefghijklmnopqrstuv",
        f"""<?xml version="1.0"?><feed xmlns:yt="http://www.youtube.com/xml/schemas/2015" xmlns="http://www.w3.org/2005/Atom">
<entry><yt:videoId>vid123</yt:videoId><title>Kisa video</title><link rel="alternate" href="https://www.youtube.com/watch?v=vid123"/>
<published>{d(3).isoformat()}</published></entry></feed>""")
    # D: tiresiz ISSN
    since = (now - timedelta(days=30)).strftime("%Y-%m-%d")
    q = {"filter": f"from-pub-date:{since}", "sort": "published", "order": "desc", "rows": "20",
         "select": "title,DOI,URL,published,published-online,created,abstract,type"}
    put("https://api.crossref.org/journals/0360-1315/works?" + urllib.parse.urlencode(q),
        json.dumps({"message": {"items": [{"title": ["Makale"], "DOI": "10.1/x", "type": "journal-article",
                                           "published-online": {"date-parts": [[d(30).year, d(30).month, d(30).day]]}}]}}))
    # E: akisi olmayan site
    put("https://nofeed.example/", "<html><head><title>Akis yok</title></head></html>")
    with open(os.path.join(fx, "index.json"), "w") as f:
        json.dump(idx, f)

    sources = {"folders": [{"id": "aka", "name": "A"}], "sources": [
        {"id": "a", "name": "Blog", "folder": "aka", "method": "rss", "home": "https://blog.example/"},
        {"id": "b", "name": "Haber", "folder": "aka", "method": "rss", "home": "https://news.example/rss.xml"},
        {"id": "c", "name": "Kanal", "folder": "aka", "method": "youtube", "kind": "shorts", "home": "https://www.youtube.com/@demo?si=abc"},
        {"id": "d", "name": "Dergi", "folder": "aka", "method": "crossref", "issn": "03601315"},
        {"id": "e", "name": "Akissiz", "folder": "aka", "method": "rss", "home": "https://nofeed.example/"},
        {"id": "f", "name": "Pasif", "folder": "aka", "method": "rss", "home": "https://blog.example/", "enabled": False},
    ]}
    src_path = os.path.join(tmp, "sources.json")
    with open(src_path, "w") as f:
        json.dump(sources, f)
    old = {"id": "gone-1", "sourceId": "gone", "title": "Silinen kaynak", "url": "https://x/", "published": now.strftime("%Y-%m-%dT%H:%M:%SZ")}
    old_f = dict(old, id="f-1", sourceId="f", title="Pasif kaynak")
    with open(os.path.join(data, "items.json"), "w") as f:
        json.dump({"items": [old, old_f]}, f)

    env = dict(os.environ)
    env.pop("ANTHROPIC_API_KEY", None)
    subprocess.run([sys.executable, "-I", os.path.join(ROOT, "radar_ajan.py"), "--fixtures", fx, "--data", data, "--sources", src_path],
                   check=True, env=env, capture_output=True)
    items = json.load(open(os.path.join(data, "items.json")))["items"]
    status = json.load(open(os.path.join(data, "status.json")))["sources"]
    by_src = {}
    for i in items:
        by_src.setdefault(i["sourceId"], []).append(i)

    checks = [
        ("site adresinden akis bulundu", by_src.get("a", [{}])[0].get("title") == "Blog yazisi" and status["a"].get("feed") == "https://blog.example/feed/"),
        ("adresin kendisi akis", "b" in by_src),
        ("YouTube @kullanici cozuldu", by_src.get("c", [{}])[0].get("url") == "https://www.youtube.com/shorts/vid123"),
        ("tiresiz ISSN", "d" in by_src),
        ("akissiz site acik hata verdi", status["e"] == {"ok": False, "note": "Bu adreste RSS akışı bulunamadı", "count": 0}),
        ("pasif kaynak okunmadi ve icerigi cikti", "f" not in status and "f" not in by_src),
        ("silinen kaynagin icerigi cikti", "gone" not in by_src),
    ]
    ok = True
    for name, passed in checks:
        print(("TAMAM " if passed else "HATA  ") + name)
        ok &= passed
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
