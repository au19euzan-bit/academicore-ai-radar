# AcademiCore AI Radar – çalışma kuralları

Bu depo GitHub Pages'te yayınlanır: https://au19euzan-bit.github.io/academicore-ai-radar/

## Az token, küçük değişiklik
- Büyük dosyaları (`app.js` ~250 KB, `app-ortak.css` ~110 KB, `sources.js`) baştan sona okuma. Önce `grep -n` ile ilgili satırı bul, yalnızca o bölümü oku/değiştir.
- Kaynak değişikliği yalnızca `kaynaklar/<kisa-ad>.json` (ve gerekirse `kaynaklar/gorseller/`) dosyasında yapılır. `sources.js`, `source-areas.js`, `sources.json` ÜRETİLİR; elle düzenlenmez.
- Kaynak değiştirdikten sonra: `python build_katalog.py` (doğrular, üretir, sürümü artırır).
- Tasarım/kod değiştirdikten sonra: `python surum_artir.py` (yoksa telefonlar eski sürümde kalır).
- Kaynak adını (`katalog.n`) değiştirme: kullanıcıların Listem'i ada bağlı. Gerekirse önce sor; `app.js` içindeki `DEF_LISTS` da adla eşleşir.
- `sira` alanı uygulamadaki sıra ve kimliklerdir; mevcut kaynaklarda değiştirme, yeni kaynak en büyük sıra + 1 alır.

## Onay
- Kullanıcıya önce değişikliği (fark/taslak) göster, onay gelmeden `git push` yapma.
- Commit yalnızca değişen dosyaları içersin; mesaj Türkçe ve ne değiştiğini söylesin.

## Dosya haritası
- Uygulama: `index.html` + `app.js` (ana mantık) + `academy-radar.js` (radar çizimi) + `takip.js` (takip turu, günlük akış) + `discover.js`, `design.js`, `responsive-layout.js`, `ios-experiment.js`, `device.js`, `update.js`, `badge.js`, `phone-display.js`, `disciplines.js`.
- Stiller: `tokens.css` (renk/yazı değişkenleri), `app-*.css` (ekran başına), `academy-radar.css`, `takip.css`, `discover.css`, `responsive-layout.css`, `ios-experiment.css`, `release.css`.
- Günlük ajan: `radar_ajan.py` + `.github/workflows/radar.yml` (her sabah ve `kaynaklar/` değişince). Veri: `data/items.json`, `data/status.json`.
- Basit akış okuyucu: `akis.html`. Katalog sayfası: `kaynaklar.html`.
