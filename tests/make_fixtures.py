"""Ajan testi icin ornek akislari uretir (tarihler bugune gore)."""
import json, os, sys, urllib.parse
from datetime import datetime, timedelta, timezone
from email.utils import format_datetime

out = sys.argv[1]
os.makedirs(out, exist_ok=True)
now = datetime.now(timezone.utc)
d = lambda h: now - timedelta(hours=h)
idx = {}

def put(url, name, body):
    with open(os.path.join(out, name), "w", encoding="utf-8") as f:
        f.write(body)
    idx[url] = name

# Substack: resim content:encoded icinde
put("https://www.oneusefulthing.org/feed", "mollick.xml", f"""<?xml version="1.0"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/"><channel><title>OUT</title>
<item><title>Post A</title><link>https://www.oneusefulthing.org/p/a</link><pubDate>{format_datetime(d(5))}</pubDate>
<description>Short &amp; sweet description of A.</description>
<content:encoded><![CDATA[<p><img src="https://substackcdn.com/image/a.png"/> Body A</p>]]></content:encoded></item>
<item><title>Old post</title><link>https://www.oneusefulthing.org/p/old</link><pubDate>{format_datetime(d(24*90))}</pubDate><description>x</description></item>
</channel></rss>""")

# WordPress: media:content resmi
put("https://punyamishra.com/feed/", "mishra.xml", f"""<?xml version="1.0"?>
<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/"><channel><title>PM</title>
<item><title>Blog B</title><link>https://punyamishra.com/b/</link><pubDate>{format_datetime(d(30))}</pubDate>
<description><![CDATA[<p>Text of B &#8230;</p>]]></description><media:content url="https://punyamishra.com/b.jpg" medium="image"/></item>
</channel></rss>""")

# Resimsiz RSS -> og:image sayfadan
put("https://oecdedutoday.com/feed/", "oecd.xml", f"""<?xml version="1.0"?>
<rss version="2.0"><channel><title>OECD</title>
<item><title>Blog C</title><link>https://oecdedutoday.com/c/</link><pubDate>{format_datetime(d(50))}</pubDate><description>C text</description></item>
</channel></rss>""")
put("https://oecdedutoday.com/c/", "oecd_c.html", '<html><head><meta property="og:image" content="https://oecdedutoday.com/c.png"></head></html>')

# Atom (ozel)
put("https://deepmind.google/blog/rss.xml", "deepmind.xml", f"""<?xml version="1.0"?>
<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/"><channel><title>DM</title>
<item><title>DM post</title><link>https://deepmind.google/blog/dm/</link><pubDate>{format_datetime(d(70))}</pubDate>
<description>DM desc</description><media:thumbnail url="https://lh3.googleusercontent.com/dm.png"/></item></channel></rss>""")

# OpenAI: hatali (fixture yok) -> durum ok:false olmali

# Crossref
since = (now - timedelta(days=30)).strftime("%Y-%m-%d")
for sid, issn in (("cae", "0360-1315"), ("bjet", "1467-8535"), ("ijaied", "1560-4292")):
    q = {"filter": f"from-pub-date:{since}", "sort": "published", "order": "desc", "rows": "20",
         "select": "title,DOI,URL,published,published-online,created,abstract,type"}
    url = f"https://api.crossref.org/journals/{issn}/works?" + urllib.parse.urlencode(q)
    dd = d(48)
    body = {"message": {"items": [
        {"title": [f"Study in {sid}"], "DOI": f"10.1/{sid}.1", "published": {"date-parts": [[dd.year, dd.month, dd.day]]},
         "abstract": "<jats:p>An abstract about AI tutoring.</jats:p>", "type": "journal-article"},
        {"title": ["Issue Information"], "DOI": f"10.1/{sid}.2", "published": {"date-parts": [[dd.year, dd.month, dd.day]]}},
        {"title": [f"Month-only {sid}"], "DOI": f"10.1/{sid}.3", "published": {"date-parts": [[dd.year, dd.month]]}, "type": "journal-article"},
        {"title": [f"Future print {sid}"], "DOI": f"10.1/{sid}.4", "published": {"date-parts": [[2027, 2]]}, "created": {"date-time": dd.strftime("%Y-%m-%dT%H:%M:%SZ")}, "type": "journal-article"},
    ]}}
    put(url, f"crossref_{sid}.json", json.dumps(body))

# YouTube Shorts (Atom)
for ch, vid in (("LGTx8RPgoB7DpsfQz8aBcA", "vidC1"), ("6E0xxW6o3QacO-rx71x26Q", "vidE1")):
    url = "https://www.youtube.com/feeds/videos.xml?playlist_id=UUSH" + ch
    put(url, f"yt_{vid}.xml", f"""<?xml version="1.0"?>
<feed xmlns:yt="http://www.youtube.com/xml/schemas/2015" xmlns:media="http://search.yahoo.com/mrss/" xmlns="http://www.w3.org/2005/Atom">
<title>Short videos</title>
<entry><id>yt:video:{vid}</id><yt:videoId>{vid}</yt:videoId><title>Short {vid}</title>
<link rel="alternate" href="https://www.youtube.com/watch?v={vid}"/><published>{d(10).isoformat()}</published>
<media:group><media:title>Short {vid}</media:title><media:content url="https://www.youtube.com/v/{vid}" type="application/x-shockwave-flash"/>
<media:thumbnail url="https://i2.ytimg.com/vi/{vid}/hqdefault.jpg" width="480" height="360"/><media:description>Desc {vid}</media:description></media:group></entry>
</feed>""")

with open(os.path.join(out, "index.json"), "w") as f:
    json.dump(idx, f, indent=1)
print(len(idx), "fixtures")
