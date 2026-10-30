# AcademiCore AI Radar

Eğitimde yapay zekâ kaynaklarını her sabah okuyan ve tek akışta gösteren okuyucu.

- **Okuyucu:** `index.html` — GitHub Pages'te yayınlanır, telefonda "Ana Ekrana Ekle" ile uygulama gibi açılır.
- **Ajan:** `radar_ajan.py` — her sabah 07:47'de GitHub Actions'ta çalışır, `sources.json`'daki kaynakları okur ve `data/items.json` dosyasını günceller.
- **Kaynaklar:** `sources.json` — kaynak eklemek ya da çıkarmak için bu dosyayı düzenleyin.

## Kurulum

1. **Pages:** Settings → Pages → *Deploy from a branch* → `main` / `(root)`.
2. **İlk çalıştırma:** Actions → *Radar günlük güncelleme* → *Run workflow*.
3. **Türkçe özetler (isteğe bağlı):** Settings → Secrets and variables → Actions → *New repository secret* → ad `ANTHROPIC_API_KEY`. Anahtar yoksa özet yerine kaynağın kendi açıklaması gösterilir; "Sayfa" yöntemli kaynaklar (UNESCO, Anthropic) da anahtar gerektirir.
4. **Crossref (önerilir):** Settings → Secrets and variables → Actions → *Variables* → ad `RADAR_MAILTO`, değer e-posta adresiniz.

## Kaynak yöntemleri

| Yöntem | Ne yapar |
| --- | --- |
| `rss` | RSS/Atom akışını okur; kapak resmi akıştan ya da sayfanın og:image etiketinden gelir |
| `crossref` | Derginin son makalelerini ISSN ile Crossref'ten alır |
| `youtube` | Kanalın Shorts (`kind: shorts`) ya da uzun videolarını (`kind: long`) okur |
| `page` | RSS'i olmayan haber sayfasını yapay zekâyla okur (API anahtarı gerekir) |

## Test

```
python tests/make_fixtures.py /tmp/fx
python radar_ajan.py --fixtures /tmp/fx --data /tmp/out
python tests/test_kesif.py
```
