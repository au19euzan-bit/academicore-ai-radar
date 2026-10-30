#!/usr/bin/env python3
"""kaynaklar/ klasorundeki kaynak dosyalarindan uygulamanin ve ajanin dosyalarini uretir.

Her kaynak tek dosyadir: kaynaklar/<kisa-ad>.json (gorseli kaynaklar/gorseller/ altinda).
Ortak ayarlar: kaynaklar/_katalog.json.

Uretilen dosyalar (elle duzenlenmez):
  sources.js       EDUMIND_CATALOG (BASE, META, DX, EXTRA) + EDUMIND_GEN (radar gruplari,
                   kisaltmalar, gorseller, ust kurumlar, baglanti denetimi, akis eslesmesi)
  source-areas.js  ilgi alani eslesmeleri
  sources.json     gunluk ajanin kaynak listesi

Uretilen dosyalar degistiyse uygulama surumu otomatik artirilir (surum_artir.py).
Calistirma:  python build_katalog.py           (degisiklik yoksa hicbir dosyaya dokunmaz)
             python build_katalog.py --kontrol (yalnizca dogrular, yazmaz)
"""
import glob
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))
KDIR = os.path.join(ROOT, "kaynaklar")
BASLIK = "/* OTOMATIK URETILIR: kaynaklar/ klasorunden build_katalog.py ile. Elle duzenlemeyin. */\n"
ZORUNLU = ("n", "s", "p", "r", "t", "l")


def oku_json(yol):
    with open(yol, encoding="utf-8") as f:
        return json.load(f)


def kaynaklari_oku():
    ayar = oku_json(os.path.join(KDIR, "_katalog.json"))
    kaynaklar, hatalar = [], []
    for yol in sorted(glob.glob(os.path.join(KDIR, "*.json"))):
        ad = os.path.basename(yol)
        if ad.startswith("_"):
            continue
        try:
            k = oku_json(yol)
        except ValueError as e:
            hatalar.append(f"{ad}: JSON hatali ({e})")
            continue
        k["_dosya"] = ad
        kat = k.get("katalog") or {}
        for alan in ZORUNLU:
            if alan not in kat:
                hatalar.append(f"{ad}: katalog.{alan} eksik")
        if "sira" not in k:
            hatalar.append(f"{ad}: sira eksik")
        r = k.get("radar") or {}
        if r.get("bolum") not in ayar["radar_sirasi"] or r.get("alt") not in ayar["radar_sirasi"].get(r.get("bolum"), []):
            hatalar.append(f"{ad}: radar.bolum/alt _katalog.json'daki radar_sirasi ile eslesmiyor ({r})")
        g = k.get("gorsel")
        if g and not os.path.exists(os.path.join(KDIR, g)):
            hatalar.append(f"{ad}: gorsel dosyasi yok ({g})")
        kaynaklar.append(k)
    adlar = [k["katalog"]["n"] for k in kaynaklar if k.get("katalog", {}).get("n")]
    for n in {x for x in adlar if adlar.count(x) > 1}:
        hatalar.append(f"ayni ad iki kez: {n}")
    sira = [k.get("sira") for k in kaynaklar]
    for s in {x for x in sira if sira.count(x) > 1}:
        hatalar.append(f"ayni sira iki kez: {s}")
    ajan_id = [k["ajan"]["id"] for k in kaynaklar if k.get("ajan")]
    for i in {x for x in ajan_id if ajan_id.count(x) > 1}:
        hatalar.append(f"ayni ajan id iki kez: {i}")
    kaynaklar.sort(key=lambda k: k.get("sira", 10 ** 6))
    return ayar, kaynaklar, hatalar


def uret(ayar, kaynaklar):
    base, meta, dx, extra = [], {}, {}, {}
    ini, av, av_ad, ust, denetim, akis, alanlar = {}, {}, {}, {}, {}, {}, {}
    gruplar = {b: {a: [] for a in alts} for b, alts in ayar["radar_sirasi"].items()}
    for k in kaynaklar:
        kat = k["katalog"]
        n = kat["n"]
        base.append(kat)
        if "kunye" in k:
            meta[n] = k["kunye"]
        if "aciklama" in k:
            dx[n] = k["aciklama"]
        if k.get("ek_baglantilar"):
            extra[n] = k["ek_baglantilar"]
        if k.get("kisaltma"):
            ini[n] = k["kisaltma"]
        if k.get("gorsel"):
            yol = "kaynaklar/" + k["gorsel"]
            av_ad[n] = yol
            if kat.get("x"):
                av[kat["x"].lower()] = yol
        if k.get("ust_kurum"):
            ust[n] = k["ust_kurum"]
        if k.get("baglanti_denetimi"):
            denetim[n] = k["baglanti_denetimi"]
        if k.get("ajan"):
            akis[k["ajan"]["id"]] = n
        if "ilgi_alanlari" in k:
            alanlar[n] = k["ilgi_alanlari"]
        r = k["radar"]
        gruplar[r["bolum"]][r["alt"]].append((r.get("sira", 10 ** 6), k["sira"], n))
    for h, yol in (ayar.get("ek_gorseller") or {}).items():
        av.setdefault(h, "kaynaklar/" + yol)
    groups = {b: {a: "|".join(n for _, _, n in sorted(lst)) for a, lst in alts.items()} for b, alts in gruplar.items()}

    catalog = {"BASE": base, "DX": dx, "META": meta, "EXTRA": extra,
               "schema": ayar.get("schema", "edumind-catalog-v1"), "version": ayar.get("version", "")}
    gen = {"groups": groups, "ini": ini, "av": av, "avByName": av_ad, "parent": ust,
           "linkAudit": denetim, "feedMap": akis,
           "files": {k["katalog"]["n"]: "kaynaklar/" + k["_dosya"] for k in kaynaklar},
           "labels": ayar.get("etiket_sozlugu", {})}
    sources_js = (BASLIK + "const EDUMIND_CATALOG=" + json.dumps(catalog, ensure_ascii=False, separators=(",", ":"))
                  + ";\nconst EDUMIND_GEN=" + json.dumps(gen, ensure_ascii=False, separators=(",", ":")) + ";\n")
    areas_js = BASLIK + "window.ACADEMIC_SOURCE_AREAS=" + json.dumps(alanlar, ensure_ascii=False, separators=(",", ":")) + ";\n"

    ajanlar = sorted((k for k in kaynaklar if k.get("ajan")), key=lambda k: k["ajan"].get("sira", 10 ** 6))
    ajan_listesi = []
    for k in ajanlar:
        a = {key: v for key, v in k["ajan"].items() if key != "sira"}
        ajan_listesi.append(a)
    sources_json = json.dumps({"folders": ayar["ajan"]["folders"], "sources": ajan_listesi,
                               "x_streams": ayar["ajan"]["x_streams"]}, ensure_ascii=False, indent=2) + "\n"
    return {"sources.js": sources_js, "source-areas.js": areas_js, "sources.json": sources_json}


def main():
    kontrol = "--kontrol" in sys.argv
    ayar, kaynaklar, hatalar = kaynaklari_oku()
    if hatalar:
        print("Kaynak dosyalarinda hata var, hicbir sey yazilmadi:")
        for h in hatalar:
            print("  - " + h)
        return 1
    ciktilar = uret(ayar, kaynaklar)
    degisen = []
    for ad, metin in ciktilar.items():
        yol = os.path.join(ROOT, ad)
        eski = open(yol, encoding="utf-8").read() if os.path.exists(yol) else None
        if eski != metin:
            degisen.append(ad)
            if not kontrol:
                with open(yol, "w", encoding="utf-8") as f:
                    f.write(metin)
    print(f"{len(kaynaklar)} kaynak. Degisen: {', '.join(degisen) or 'yok'}")
    if kontrol:
        return 0
    if any(d in degisen for d in ("sources.js", "source-areas.js")):
        sys.path.insert(0, ROOT)
        import surum_artir
        e, y = surum_artir.artir()
        print(f"Uygulama surumu: {e} -> {y}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
