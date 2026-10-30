#!/usr/bin/env python3
"""Uygulama surumunu uc yerde birlikte artirir: index.html, version.json, sw.js.

Surum artmazsa telefonlardaki uygulama eski dosyalari onbellekten gostermeye devam eder.
Calistirma:  python surum_artir.py          -> 1.3.353-test  ->  1.3.354-test
"""
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))


def oku(ad):
    with open(os.path.join(ROOT, ad), encoding="utf-8") as f:
        return f.read()


def yaz(ad, metin):
    with open(os.path.join(ROOT, ad), "w", encoding="utf-8") as f:
        f.write(metin)


def mevcut():
    return json.loads(oku("version.json"))["version"]


def artir():
    eski = mevcut()
    m = re.match(r"^(\d+)\.(\d+)\.(\d+)(.*)$", eski)
    if not m:
        sys.exit(f"Surum anlasilamadi: {eski}")
    yeni = f"{m.group(1)}.{m.group(2)}.{int(m.group(3)) + 1}{m.group(4)}"
    html = oku("index.html")
    html2 = re.sub(r'(<meta name="edumind-version" content=")[^"]*(")', r"\g<1>" + yeni + r"\g<2>", html, count=1)
    sw = oku("sw.js")
    sw2 = re.sub(r"const CACHE='edumind-[^']*';", f"const CACHE='edumind-{yeni}-github';", sw, count=1)
    if html2 == html or sw2 == sw:
        sys.exit("Surum satiri bulunamadi (index.html ya da sw.js)")
    yaz("index.html", html2)
    yaz("sw.js", sw2)
    yaz("version.json", json.dumps({"version": yeni}))
    return eski, yeni


if __name__ == "__main__":
    e, y = artir()
    print(f"{e} -> {y}")
