# Changelog

Format ringkas per fase. Tanggal memakai ISO (YYYY-MM-DD).

## 2026-11-07 — Ikon kategori dapat dikelola lewat EmDash

### Added
- Collection non-routable `product_category_profiles` dengan field nama, slug taxonomy unik, dan image untuk unggah ikon/foto melalui EmDash Media Library.
- `src/utils/category-profile.ts` memetakan profil CMS ke taxonomy berdasarkan slug.

### Changed
- `src/components/CategoryTile.astro` memprioritaskan image dari CMS dan memakai ikon SVG kontekstual sebagai fallback.
- `src/pages/index.astro` dan `src/pages/products/index.astro` memuat profil ikon beserta cache hint-nya.
- Schema lokal aktif dan `seed/seed.json` disinkronkan tanpa memodifikasi tabel internal EmDash.

### Verified
- `npx emdash seed seed/seed.json --validate` lulus.
- `npm run typecheck` lulus.
- `npm test` → 35/35 lulus.
- `npm run build` sukses; warning chunk admin >500 kB tetap ada.

## 2026-11-07 — Ikon kontekstual kategori pilihan

### Added
- `src/components/CategoryIcon.astro` — ikon SVG orisinal untuk kategori CCTV/kamera, DVR, NVR, switch, monitor, power supply, PoE/midspan, aksesori, dan fallback perangkat umum.

### Changed
- `src/components/CategoryTile.astro` memilih ikon berdasarkan nama/slug kategori, menggantikan ikon grid generik yang sama pada seluruh kategori. Ikon mengikuti `currentColor`, token, hover, dan tidak memakai aset pihak ketiga.

### Verified
- `npm run typecheck` lulus.
- `npm test` → 35/35 lulus.
- `npm run build` sukses; warning chunk admin >500 kB tetap ada.

## 2026-11-07 — Pelunakan visual storefront

### Changed
- `src/styles/tokens.css` — permukaan dibuat lebih hangat, header navy dilunakkan, radius diperbesar, dan shadow dibuat lebih natural.
- `src/styles/global.css` — heading lebih ekspresif, jarak section lebih lega, page/section heading mendapat aksen vertikal, dan kartu memakai radius serta hover lift yang lebih halus.
- `src/pages/index.astro` — intro mendapat depth dekoratif ringan dan visual card sedikit miring tanpa animasi berat.
- `src/components/CategoryTile.astro` dan `BrandTile.astro` — hover lebih responsif dengan lift kecil dan perubahan aksen.
- `src/components/InquiryCta.astro` — CTA memakai surface hangat dan aksen sekunder agar tidak terasa seperti panel administratif.

### Verified
- `npm run typecheck` lulus.
- `npm test` → 35/35 lulus, termasuk kontras WCAG AA.
- `npm run build` sukses; warning chunk admin >500 kB tetap ada.

## 2026-11-07 — Realignment seluruh konsep halaman publik

### Changed
- `src/components/SiteHeader.astro` — navigasi desktop mendapat menu kategori berbasis taxonomy CMS dengan jumlah produk dan tautan katalog; search tetap dominan, mobile tetap disclosure keyboard-native.
- `src/components/SiteFooter.astro` — footer commerce memakai permukaan navy industrial, aksen oranye, dan struktur link faktual tanpa payment/courier/contact palsu.
- `src/pages/products/[slug].astro` — detail produk memakai komposisi galeri 45% / ringkasan 55%, media 1:1, summary card sticky desktop, commerce panel beraksen, dan section informasi terpisah.
- `src/pages/posts/index.astro` — listing editorial mendapat panel hasil dengan heading dan jumlah artikel.
- `src/pages/[slug].astro` — halaman informasi memakai surface card industrial dengan heading beraksen.
- `src/pages/404.astro` — state 404 diperjelas dengan kode visual dan aksi pemulihan valid.
- Pola seluruh halaman mengikuti konsep dense technical commerce; identitas, aset, data, dan source code Vins Teknik tidak disalin.

### Verified
- `npm run typecheck` lulus.
- `npm test` → 35/35 lulus.
- `npm run build` sukses; warning chunk admin >500 kB tetap ada.

## 2026-11-07 — Katalog product-first terinspirasi pola Vins Teknik

### Added
- `src/components/CatalogLayout.astro`, `CatalogFilters.astro`, dan `CatalogFilterList.astro` — layout katalog reusable dengan sidebar kategori desktop, disclosure mobile keyboard-native, toolbar jumlah hasil, active chip, dan reset.

### Changed
- `src/pages/products/index.astro` — listing lebih padat: kategori populer, 20 produk per cursor page, filter kategori, toolbar hasil, dan grid 2/3/4/5 kolom yang sudah ada.
- `src/pages/products/category/[slug].astro` — memakai layout katalog sama, active filter, reset, serta empty state pemulihan.
- Adaptasi hanya pola discovery katalog. Brand, aset, produk, harga, rating, promo, cart, dan source code Vins Teknik tidak disalin.

### Verified
- `npm run typecheck` lulus.
- `npm test` → 35/35 lulus.
- `npm run build` sukses; warning chunk admin >500 kB tetap ada.

## 2026-11-07 — Spesifikasi desain ASATECHID Commerce

### Changed
- `docs/DESIGN.md` ditulis ulang sebagai spesifikasi desain ASATECHID yang ringkas dan implementable: arah visual industrial, token provisional, information architecture aktual, app shell, homepage, product card, katalog, detail produk, artikel, state, aksesibilitas, performa, SEO, dan acceptance checklist.
- `docs/TODO.md` mendapat Phase 10 terperinci: audit baseline, token/primitif, app shell, homepage, product card, katalog/filter, detail produk, fitur kondisional, serta quality gate. Full checkout digeser menjadi Phase 11.
- Vins Teknik tetap menjadi referensi pola pengalaman e-commerce, bukan sumber brand, aset, data, source code, atau desain pixel-perfect.
- Route canonical proyek (`/products`, `/products/category/*`, `/posts`) dan inquiry-first MVP dipertahankan; cart/checkout, promo, rating, tracking, dan fitur lain tetap kondisional pada data/backend nyata.

### Added
- `src/components/ProductCardSkeleton.astro` — skeleton katalog 1:1 dengan grid responsif dan fallback reduced-motion.
- Token status `--color-info` beserta pasangan test kontras pada surface.

### Changed
- `src/components/SiteHeader.astro` — search mobile kini selalu terlihat pada baris kedua; menu disclosure tidak lagi menyembunyikan search; header utama memakai permukaan navy industrial yang kontras dengan nav putih.
- `src/pages/index.astro` — intro katalog dirombak menjadi hero industrial navy-oranye dengan headline baru, dua CTA valid, dan visual wordmark ASATECHID berbasis CSS.
- `src/styles/global.css` — kartu mendapat hover lift ringan dan border aksen, tetap tunduk pada reduced motion global.
- `src/components/SiteFooter.astro` — kelompok “Kontak & layanan” disembunyikan sampai data resmi tersedia.
- `src/components/ProductCard.astro` — fallback visual berada di belakang media sehingga URL gambar rusak tetap punya state stabil tanpa handler inline.
- `docs/TODO.md` — Phase 10.0–10.4 dan quality gate diperbarui sesuai hasil slice pertama.

### Verified
- `npm run typecheck` → 59 file, 0 error / 0 warning / 0 hint.
- `npm test` → 35/35 lulus.
- `npm run build` → sukses; warning chunk admin >500 kB tetap ada.

## 2026-11-02 — Phase 9 P0: realignment storefront katalog

### Added
- `src/components/BrandTile.astro` dan `CategoryTile.astro` — tile data-driven untuk merek dan kategori.
- `docs/DECISIONS.md` ADR-035 — route Inggris dipertahankan, hero/banner lama dihapus, realignment dikerjakan sebagai vertical slice P0.

### Changed
- `src/styles/tokens.css` — token semantik katalog provisional, container 1280px, gutter 16/24px, radius 6/10/16px, status colors, dan palet kontras AA.
- `src/components/SiteHeader.astro` — shell catalog-first dengan search dominan, tautan semua produk, nav desktop, dan menu mobile; cart palsu dihapus.
- `src/components/SiteFooter.astro` — struktur katalog/perusahaan/kontak; layanan yang belum dikonfigurasi tidak diklaim tersedia.
- `src/components/ProductCard.astro` — media 1:1 `object-contain`, judul dua baris, harga tabular, diskon turunan, dan state opsional rating/sold/out-of-stock tanpa data karangan.
- `src/pages/index.astro` — hero carousel dan banner DEMO dihapus; homepage menjadi merek, kategori, produk terbaru, rekomendasi, semua produk, dan artikel.
- `src/pages/products/index.astro` — category tiles dan heading hasil katalog.
- `src/pages/products/[slug].astro` — gambar utama memakai `object-fit: contain`.
- `src/scripts/public-client.ts` — initializer carousel dilepas.
- Komponen/script homepage lama yang tak lagi dipakai dihapus: `HeroCarousel.astro`, `PromoBanner.astro`, `QuickCategoryCard.astro`, `FilterTabs.astro`, dan `hero-carousel.ts`.
- `scripts/site-audit.mjs` — route produk inti ditemukan dari homepage, bukan slug seed lama yang sudah tidak ada di database.
- `docs/TODO.md` dan `docs/12-OPEN-DECISIONS.md` diperbarui sesuai status serta keputusan Phase 9.

### Verified
- `npm run typecheck` → 58 file, 0 error / 0 warning / 0 hint.
- `npm test` → 35/35 lulus, termasuk pasangan token dan normalisasi PortableText.
- `npm run build` sukses; warning chunk admin >500 kB tetap ada.
- `npm run audit:site -- --base http://localhost:4323 --production` → PASS; 7 URL sitemap, 20 link internal, 16 warning label LiveSearch yang sudah dikenal.
- `npm run check:launch:staging` dijalankan dan gagal sesuai blocker: `EMDASH_ENCRYPTION_KEY` serta `EMDASH_SITE_URL`; warning kontak, DEMO, OG image, dan history DB tetap ada.

### Fixed
- Homepage kini mengembalikan error server saat query CMS gagal, bukan menyamarkan kegagalan sebagai collection kosong.
- Produk terbaru, rekomendasi, dan semua produk tidak lagi menduplikasi entry; rekomendasi disembunyikan bila tidak ada produk pilihan tersisa.
- Field kartu yang belum ada di schema (`compare_at_price`, stok numerik, rating, review count, sold count) dihapus dari kontrak/UI.
- Nested array PortableText lama diratakan di seed dan dinormalisasi defensif saat render artikel.
- Audit route dinamis kini memakai sitemap, bukan slug DEMO atau kecocokan markup homepage.
- Cache SSR memakai provider memory Astro agar `cache.set()` tidak menghasilkan warning pada deployment Node tunggal.

### Notes
- Filter desktop/drawer mobile, brand directory, route search penuh, skeleton/image-error, dan galeri multi-gambar belum dikerjakan pada slice ini.
- `git diff --check` terhalang trailing whitespace yang sudah ada pada perubahan pengguna di `docs/DESIGN.md`; file implementasi tidak dilaporkan punya whitespace error.

## 2026-11-02 — Realignment TODO untuk DESIGN.md baru

### Changed
- `docs/TODO.md` — status Phase 8 dikoreksi menjadi baseline versi lama yang perlu realignment setelah `docs/DESIGN.md` berubah dari mockup gadget "Technova" menjadi blueprint katalog alat teknik berbasis audit Vins Teknik.
- `docs/TODO.md` — Phase 9 baru memetakan audit C01–C59, keputusan route/canonical, token dan shell katalog, komponen reusable, discovery/filter/search, detail produk, fitur P1/P2, serta verifikasi.
- Full checkout digeser menjadi Phase 10 karena realignment storefront harus selesai lebih dahulu.
- Blocker diperluas untuk strategi URL, nasib hero/banner lama, data katalog tambahan, aset berizin, promo, tracking, chat, aplikasi, payment, dan courier.

### Notes
- Tidak ada kode aplikasi yang berubah. Test/typecheck/build tidak dijalankan karena perubahan hanya dokumentasi.
- `docs/DECISIONS.md` belum diubah; ADR-033 perlu diperbarui setelah keputusan realignment disetujui, bukan ditebak saat perencanaan.

## 2026-10-28 — Dokumentasi visual beranda

### Added
- `docs/screenshots/home-desktop-2026-10-28.png` dan `home-mobile-2026-10-28.png` — screenshot beranda hasil implementasi `src/pages/index.astro` (desktop 1440px, mobile 390px @2x) sebagai bukti visual di repo.
- `docs/DESIGN.md` — bagian "Preview implementasi" menautkan kedua screenshot.

## 2026-10-28 — Phase 8: storefront homepage sesuai DESIGN.md

### Added
- `src/components/HeroCarousel.astro` + `src/scripts/hero-carousel.ts` — carousel 3 slide dengan scroll-snap, dot, panah, autoplay 5s, tombol Jeda/Mainkan, hormati `prefers-reduced-motion`.
- `src/components/QuickCategoryCard.astro`, `SectionHead.astro`, `FilterTabs.astro`, `PromoBanner.astro`, `MediaPlaceholder.astro`.
- `src/scripts/public-client.ts` — satu entry point untuk inisialisasi klien publik (header + carousel).
- `docs/TODO.md` Phase 8 dan `docs/DECISIONS.md` ADR-033/ADR-034.

### Changed
- `src/pages/index.astro` disusun ulang: top bar/header, hero, kategori cepat, produk pilihan + tab filter + banner promo, baru masuk, banner kategori, rail katalog, artikel.
- `src/styles/tokens.css` — palet provisional dari DESIGN.md, gradient hero/promo, radius dan shadow kartu.
- `src/styles/global.css` — radius/shadow kartu, badge varian baru, `.icon-btn`, `.rail`, spacing section `clamp()`.
- `src/components/ProductCard.astro` — badge, harga coret kondisional, placeholder gambar, "Harga belum tersedia".
- `src/components/Badge.astro` — tone `highlight`/`soft`; `src/utils/product.ts` — tipe `compare_at_price`.
- `src/components/SiteHeader.astro` + `src/layouts/Base.astro` — top bar, tagline, tombol keranjang nonaktif, script klien dipindah ke bundel eksternal.
- `astro.config.mjs` — `vite.build.assetsInlineLimit: 0` (ADR-034).
- `scripts/site-audit.mjs` — slug kategori ditemukan dari beranda, bukan hardcoded.

### Fixed
- Script Astro yang di-inline ke HTML diblokir CSP (`script-src` nonce) sehingga carousel dan menu header tidak berfungsi di build produksi.

### Verified
- `npm run typecheck` → 59 file, 0 error / 0 warning / 0 hint.
- `npm test` → 33/33 lulus.
- `npm run build` sukses; `npm run audit:site -- --base http://127.0.0.1:4322 --production` → PASS.
- CDP: klik panah memindahkan slide (scrollLeft 0 → 1048), dot aktif ikut berubah, autoplay berhenti setelah interaksi, tanpa error CSP.
- Screenshot 390/768/1280 tanpa overflow horizontal (`scrollWidth === innerWidth`).
- Tidak ada string produk/harga contoh dari DESIGN.md di `src/`.

### Notes
- Banner promo masih placeholder (belum ada model data promo); kartu harga memakai "Harga belum tersedia".
- `compare_at_price` belum ada di schema `products`, jadi harga coret belum bisa diisi dari admin.

## 2026-10-28 — Perencanaan Phase 8: storefront homepage sesuai DESIGN.md

### Added
- `docs/TODO.md` — Phase 8 baru (homepage sesuai `docs/DESIGN.md`) dengan keputusan 8.0, token, komponen, section, a11y, dan verifikasi; Phase 8 lama (full checkout) digeser menjadi Phase 9.
- `docs/TODO.md` — blocker data baru: brand guideline provisional dan konten promo banner.
- `docs/DECISIONS.md` — ADR-033: DESIGN.md sebagai acuan visual, bukan brand/data.

### Changed
- Brand storefront ditetapkan **ASATECHID**; nama "Technova" pada DESIGN.md tidak dipakai.
- Nama produk, merek, harga, dan angka promo dari DESIGN.md dinyatakan placeholder; kartu memakai `MediaPlaceholder` dan harga “belum tersedia”.

### Verified
- Hanya dokumentasi yang berubah; belum ada kode aplikasi yang disentuh. `npm run typecheck` / `npm test` / `npm run build` tidak dijalankan ulang karena tidak ada perubahan kode.

## 2026-10-28 — Admin lokal: passkey asli + perbaikan 401 saat menyimpan konten

### Changed
- Admin lokal kini memakai akun **passkey asli** (wizard setup selesai, `emdash:setup_complete=true`, `credentials` berisi 1 passkey). `dev@emdash.local` tetap ada sebagai fallback dev-bypass.
- User dev lama dihapus lewat `POST /_emdash/api/setup/dev-reset` setelah snapshot `VACUUM INTO data.db.bak-20261026`; koleksi `ec_products` (4), `ec_posts` (4), `ec_pages` (1) tidak berubah oleh reset.

### Fixed
- `POST /_emdash/api/content/{collection}` mengembalikan `401 NOT_AUTHENTICATED` meski sesi valid — GET, PUT, publish, dan endpoint admin lain tetap 200. Penyebabnya state proses dev server lama (dijalankan sebelum reset user + setup passkey). Tindakan: `npx astro dev stop` lalu jalankan ulang; create produk kembali `201`.
- Tidak ada perubahan kode aplikasi. Instrumentasi debug sementara di `node_modules/emdash` sudah dikembalikan ke isi asli (diverifikasi 0 baris debug).

### Verified
- Create + permanent-delete produk lewat HTTP API (`201`/`200`); entri uji tidak tersisa (`ec_products` = 4 produk DEMO).
- `/api/auth/me` → 200 dengan sesi baru; dev-bypass tetap 200 hanya di mode dev.
- `npx astro dev logs` menunjukkan `POST /_emdash/api/content/products → 201` setelah restart.

## 2026-10-28 — Phase 7: Launch hardening

### Added
- `src/middleware.ts` — CSP publik dengan nonce per request, `X-Frame-Options`, dan HSTS saat HTTPS; CSP admin EmDash tidak ditimpa.
- `src/scripts/site-header.ts` — progressive enhancement header (label LiveSearch, Escape menu), dipanggil dengan nonce.
- `src/env.d.ts` — tipe `App.Locals.cspNonce`.
- `src/lib/design/contrast.ts` + `contrast.test.ts` — helper kontras WCAG dan 2 test token.
- `scripts/site-audit.mjs` + `npm run audit:site` — audit status, metadata, canonical, robots, OG, JSON-LD, heading, alt, ID, link, label dasar, header, sitemap, robots, admin surface.
- `scripts/launch-check.ts` + `npm run check:launch`/`check:launch:staging` — gerbang env, kontak, DEMO, file sensitif, dokumen.
- `docs/08-SECURITY.md`, `docs/09-TESTING.md`, `docs/10-DEPLOYMENT.md`, `docs/12-OPEN-DECISIONS.md`.

### Changed
- `src/components/SiteHeader.astro` memakai modul eksternal + nonce, bukan inline script tanpa nonce.
- `src/styles/tokens.css` — `--color-muted` `#676d72` → `#63696e` agar kontras ≥ 4.5:1 di `surface-muted`.
- `package.json` — script audit/launch check dan override `zod: 4.6.7`; `package-lock.json` ikut berubah.
- `.gitignore` — tambah `data.db.*` untuk backup database.
- `README.md`, `docs/README.md`, `docs/TODO.md` diperbarui untuk Phase 7 dan status blocker.

### Verified
- `npm run typecheck` → 52 file, 0 error / 0 warning / 0 hint.
- `npm test` → 33/33 lulus (21 SEO Review + 10 inquiry + 2 kontras).
- `npm run build` → sukses (warning chunk admin >500 kB tetap ada).
- `npm audit` → 0 vulnerability setelah override zod (sebelumnya 6 high).
- `npx emdash doctor` → semua cek lulus.
- `npm run audit:site -- --base http://127.0.0.1:4328 --production` → PASS; sitemap 5 URL; 13 link internal unik; 22 warning LiveSearch.
- Produksi: CSP + nonce, `X-Frame-Options: SAMEORIGIN`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`; HSTS muncul dengan `X-Forwarded-Proto: https`.
- Produksi: admin redirect 302, API tanpa auth 401, POST tanpa CSRF header 403, dev-bypass 403.
- Backup/restore: `VACUUM INTO` + `PRAGMA integrity_check=ok`; aplikasi dijalankan dari salinan DB dan halaman produk mengembalikan 200.
- Responsive: screenshot Firefox headless 390/768/1280 pada beranda, katalog, produk, artikel, kategori/tag.

### Notes
- `npm run check:launch` sengaja **FAIL** saat ini: `EMDASH_SITE_URL` belum diisi, kontak resmi belum ada, dan 73 marker DEMO masih ada. Ini adalah gerbang produksi, bukan regresi.
- `data.db.bak-20261026` di-untrack, tetapi masih ada di history Git/remote; purge history + rotasi kunci adalah blocker operasional.
- CSP publik masih memakai `style-src 'unsafe-inline'` karena scoped style Astro; `script-src` sudah nonce-based.
- LiveSearch EmDash belum menyediakan label server-side; label ditambahkan script klien.

## 2026-10-28 — Phase 6: Inquiry MVP

### Added
- `src/lib/inquiry/contact.ts` — resolusi konfigurasi kontak dari env, normalisasi nomor WhatsApp/email, validasi, dan pembentuk tautan `wa.me`/`mailto:` dengan konteks produk.
- `src/lib/inquiry/contact.test.ts` — 10 unit test untuk normalisasi, konfigurasi tidak valid, dan encoding tautan.
- `src/components/InquiryCta.astro` — CTA produk yang hanya merender kanal valid; menampilkan tombol nonaktif + pesan jelas bila belum dikonfigurasi.
- Schema env server `INQUIRY_WHATSAPP_NUMBER` dan `INQUIRY_EMAIL` di `astro.config.mjs`.

### Changed
- `src/pages/products/[slug].astro` meresolusi konfigurasi kontak, mencatat peringatan konfigurasi tidak valid, dan menempatkan CTA di ringkasan produk.
- `src/components/Button.astro` mendukung `target`/`rel` (default `noopener noreferrer` untuk `_blank`).
- `package.json` menjalankan seluruh test di `src/lib/*/*.test.ts`.
- `.env.example` mendokumentasikan dua variabel kontak opsional.

### Verified
- `npm run typecheck` → 45 file, 0 error / 0 warning / 0 hint.
- `npm test` → 31/31 lulus (21 SEO Review + 10 inquiry).
- `npm run build` → sukses.
- Produksi dengan WhatsApp + email: kedua CTA tampil, pesan memuat judul + URL produk, tautan WhatsApp memakai `target="_blank"` dan `rel="noopener noreferrer"`.
- Tanpa env: tombol nonaktif + pesan “Kanal kontak belum tersedia”; tidak ada tautan rusak.
- WhatsApp tidak valid + email valid: hanya email yang tampil; peringatan dicatat server tanpa membocorkan nilai ke halaman.

### Notes
- Tidak ada form, penyimpanan lead, atau pengiriman email server-side pada fase ini.
- Nilai kontak sebenarnya belum tersedia; CTA produksi tetap nonaktif sampai env diisi (ADR-026, ADR-027).

## 2026-10-26 — Phase 5: SEO Review UI

### Added
- `src/lib/seo-review/audit.ts` — engine audit murni: ekstraksi Portable Text (heading, tautan, gambar, teks), pemeriksaan SEO, bobot skor, pratinjau SERP, dan keputusan publish gate.
- `src/lib/seo-review/review.ts` — adapter konten EmDash → input audit; meniru `getSeoMeta()` dan fallback `Base.astro` agar pratinjau sama dengan output publik.
- `src/lib/seo-review/audit.test.ts` — 21 unit test (`node --experimental-strip-types --test`).
- `src/plugins/seo-review/index.ts` — plugin native `definePlugin`: editor panel untuk `posts`/`products`/`pages`, route panel, pemuatan revisi draf, dan hook `content:beforePublish`.
- `src/plugins/seo-review/panel.ts` — renderer Block Kit: banner skor/gate, statistik, pratinjau SERP desktop/mobile, checklist per tingkat, metrik konten, rincian skor, dan aksi refresh.
- Dependency `@emdash-cms/blocks ^1.3.1` dan script `npm test`.

### Changed
- `astro.config.mjs` mendaftarkan plugin `seo-review` (`entrypoint: "/src/plugins/seo-review/index.ts"`, `format: "native"`).
- `package.json`/`package-lock.json` memuat dependency dan script test baru.

### Verified
- `npm run typecheck` → 42 file, 0 error / 0 warning / 0 hint.
- `npm test` → 21/21 lulus.
- `npm run build` → sukses (warning chunk admin > 500 kB tetap ada); `npx emdash doctor` → semua cek lulus.
- Manifest dev dan produksi menampilkan plugin aktif dengan editor panel untuk tiga koleksi.
- Panel berfungsi untuk `posts`, `products` (termasuk draf), dan `pages`.
- Draf kosong: panel memblokir, halaman publik tetap memakai konten terbit, dan `publish` API mengembalikan `PUBLISH_REJECTED`.
- Entri uji valid berhasil dipublikasikan lalu dihapus permanen; route publik 404.
- Aksi refresh mengembalikan toast dan blok baru.
- Judul/deskripsi/canonical panel sama dengan `<head>` publik; perilaku `noindex` konsisten (tanpa canonical, panel menampilkan info noindex).
- Produksi port 4322 dengan `EMDASH_SITE_URL` berbeda menyajikan manifest dan panel dengan canonical yang benar.

### Notes
- Panel mengaudit revisi draf tersimpan; ketikan yang belum disimpan tidak terlihat.
- Pemeriksaan tautan lokal hanya di panel; gate hanya memblokir judul/konten/slug kosong.
- Skor adalah panduan internal, bukan prediksi peringkat Google (ADR-022 s.d. ADR-025).

## 2026-10-26 — Phase 4: SEO foundation

### Added
- `src/utils/site-url.ts` — resolusi origin publik (site setting → config → `EMDASH_SITE_URL`/`SITE_URL` runtime → origin request) dan pembentuk URL absolut.
- `public/og-default-demo.png` — gambar sosial default 1200×630 bertanda DEMO.
- `seed/seed.json` — `settings.seo.titleSeparator` (` — `) dan redirect 301 `/posts/welcome` → `/posts`.
- Dukungan `pageType`, `articleMeta`, dan `robots` pada `Base.astro`.

### Changed
- `Base.astro` sekarang selalu mengeluarkan canonical absolut untuk halaman indexable, membuang query string, memakai origin publik terkonfigurasi, dan tidak mengeluarkan canonical saat `noindex`.
- `og:type` artikel menjadi `article`; `article:published_time`, `article:modified_time`, dan `article:author` ikut dirender.
- JSON-LD artikel menjadi `BlogPosting` (sebelumnya `WebSite`); halaman non-artikel tetap `WebSite`.
- `og:image`/`twitter:image` selalu terisi: gambar entri → site default → placeholder DEMO.
- `getSeoMeta()` pada artikel/produk/halaman memakai origin publik dan separator judul dari site settings.
- 404 dan 500 mengirim `noindex, nofollow` tanpa canonical.
- Deskripsi `/posts` tidak lagi memakai tagline situs.
- `.env.example` dan `README.md` mendokumentasikan `EMDASH_SITE_URL`.

### Verified
- `npm run typecheck` 0 error; `npm run build` sukses.
- Audit `<head>`: tidak ada duplikasi title/description/canonical/OG; 404 dan preview `noindex` tanpa canonical.
- SEO panel diuji lewat API: override title/description/canonical/noIndex berlaku; `noIndex` mengeluarkan entri dari sitemap; entri uji dihapus permanen.
- Redirect `/posts/welcome` → 301 `/posts`.
- Produksi dengan `EMDASH_SITE_URL=http://localhost:4321` di port 4322: canonical, OG, JSON-LD, robots, dan sitemap memakai origin terkonfigurasi.
- Sitemap hanya memuat konten terbit dan tidak `noIndex`; draft produk dan entri uji tidak muncul.

### Notes
- Product/Offer JSON-LD ditunda sampai data harga/ketersediaan tersedia (ADR-019).
- Arsip taxonomy belum masuk sitemap (keterbatasan enumerasi EmDash); dicatat di `docs/TODO.md`.

## 2026-10-26 — Phase 3: Editorial/blog

### Added
- `seed/seed.json` — field `related_posts`, dukungan byline, 1 byline DEMO, 3 artikel DEMO berbahasa Indonesia (`panduan-memilih-produk-demo`, `catatan-ketersediaan-produk-demo`, `cara-membaca-spesifikasi-demo`), label taxonomy Indonesia, tag `panduan`.
- `src/utils/post.ts` — tipe kartu artikel, helper kategori/tag, format tanggal `id-ID`, estimasi waktu baca, `annotateHeadings()` untuk anchor + TOC, dan `wasUpdated()` per hari kalender.
- `src/components/PostCard.astro`, `PostGrid.astro`, `AuthorByline.astro`, `TableOfContents.astro`, `PortableBlock.astro`, `TaxonomyNav.astro` (generik, menggantikan `ProductCategoryNav`).
- Halaman `/posts/[slug]` ditulis ulang: byline, tanggal, waktu baca, TOC rail + disclosure, prose, tag, kotak penulis, artikel terkait, banner pratinjau.
- Arsip `/category/[slug]` dan `/tag/[slug]` dengan pagination cursor.

### Changed
- `/posts` memakai `PostGrid`, navigasi kategori ber-count, dan pagination cursor.
- Beranda memakai `PostGrid` untuk artikel terbaru.
- `/products` dan beranda memakai `TaxonomyNav` generik.
- `src/styles/global.css` memberi `scroll-margin-top` pada heading prose agar anchor TOC tidak tertutup header.
- `PortableBlock` merender blok sendiri (h1–h6, blockquote, paragraf) karena `Block` dari `emdash/ui` hanya tersedia sebagai tipe; kelas `has-text-align-*` tetap memakai allowlist EmDash.

### Removed
- `src/components/ProductCategoryNav.astro` (digantikan `TaxonomyNav`).
- Entri DEMO `welcome` dari database (trash + permanent).

### Verified
- `npm run typecheck` → 0 error / 0 warning / 0 hint; `npm run build` → sukses.
- Build produksi (port 4322): `/posts`, 3 detail artikel, `/category/general`, `/category/updates`, `/tag/panduan` → 200; tag tak dikenal dan `/posts/welcome` → 404.
- TOC: anchor `id` pada heading cocok dengan tautan; di 1440px hanya rail yang tampil, di 390px hanya disclosure.
- Alur pratinjau via API: draft → publik 404; preview-url → 200 + banner + `no-store`; publish → publik 200 tanpa banner; entri uji dihapus permanen.
- Sitemap artikel hanya memuat 3 artikel terbit.
- Screenshot headless Firefox 1440×1900 dan 390×2400 untuk listing dan detail.

### Notes
- Keputusan dan limitasi baru: ADR-015 (bylines), ADR-016 (TOC server-rendered), ADR-017 (urutan referensi seed). Rincian limitasi ada di `docs/TODO.md`.

## 2026-10-26 — Node.js v22.23.4

### Changed
- Node.js user-level dipasang di `~/.local/opt/node-v22.23.4-linux-x64` (tarball resmi, checksum SHA-256 diverifikasi) dan di-symlink ke `~/.local/bin` (`node`, `npm`, `npx`, `corepack`).
- `node_modules` dihapus dan dipasang ulang dengan `npm ci` memakai Node v22.23.4.

### Verified
- `node -v` → v22.23.4; `npm -v` → 10.9.9.
- `npm run typecheck` 0 error, `npm run build` sukses, `npx emdash doctor` semua cek lulus.

## 2026-10-26 — Phase 2: Content model + storefront

### Added
- `seed/seed.json` — collection `products` (`/products/{slug}`), collection `brands` (non-routable), taxonomy `product_category`, item menu **Produk**, dan konten DEMO (2 merek, 3 produk terbit, 1 produk draft).
- `docs/03-CONTENT-MODEL.md` — model konten, route, aturan tampilan harga/ketersediaan, dan daftar data DEMO.
- `src/utils/product.ts` — tipe kartu produk, helper kategori, format harga (hanya bila `price` + `currency` valid), validasi label ketersediaan.
- `src/components/ProductCard.astro`, `ProductGrid.astro`, `ProductCategoryNav.astro`.
- Route `/products` (pagination cursor), `/products/[slug]` (merek, spesifikasi, produk terkait), `/products/category/[slug]`.
- Sitemap produk otomatis (`/sitemap-products.xml`) hanya memuat produk terbit.

### Changed
- Beranda: hero diarahkan ke katalog, bagian kategori produk (dengan count) dan produk `featured`.
- `SiteHeader`/`Base`: LiveSearch mencakup `products`, `posts`, `pages` dengan `routeMap`; placeholder "Cari produk atau artikel...".
- Footer dan 404 menautkan ke `/products`.
- `seed/seed.json`: field `featured` diberi `indexed`.

### Verified
- `npm run typecheck` → 0 error / 0 warning / 0 hint; `npm run build` → sukses.
- Build produksi: `/`, `/products`, 3 detail produk, 2 arsip kategori → 200; draft dan kategori tak dikenal → 404.
- Alur CMS: produk dibuat via `POST /_emdash/api/content/products` (draft) → 404 dan absen dari listing/kategori/sitemap/search; setelah publish → 200, muncul di semua permukaan, canonical benar; setelah delete permanen → 404.
- Screenshot headless 1440 dan 390 untuk beranda, listing, detail, kategori.

### Notes
- Keterbatasan model dan data DEMO tercatat di `docs/TODO.md` dan `docs/DECISIONS.md` (ADR-010 s.d. ADR-013).

## 2026-10-26 — Phase 1: Design system & public shell

### Added
- `src/styles/tokens.css` — token warna, tipografi, spacing, radius, bayangan, container (provisional).
- `src/styles/global.css` — reset, base typography, layout, button, badge, card, breadcrumb, form field, empty state, prose, reduced motion, skip link.
- Komponen: `Container`, `Button`, `Badge`, `Card`, `Breadcrumbs`, `EmptyState`, `Field`, `Logo`, `SiteHeader`, `SiteFooter`.
- Halaman `500.astro`.
- Empty state pada daftar artikel, kategori, dan tag; breadcrumb pada halaman konten.
- Label Bahasa Indonesia untuk menu, kategori, dan tag seed.

### Changed
- `src/layouts/Base.astro` memakai header/footer baru, skip link, landmark `main`, dan mengimpor stylesheet global.
- Semua halaman publik memakai container, grid kartu, breadcrumb, dan tipografi baru.
- Halaman artikel kini satu kolom (tanpa sidebar widget bawaan) agar konsisten dan tidak menampilkan UI berbahasa Inggris.
- Seed `primary` menu: Beranda / Artikel / Tentang.

### Verified
- Screenshot headless Chromium pada 390×900, 834×1112, 1440×2200.
- Menu mobile: panel terbuka, input pencarian berlabel, focus ring terlihat saat Tab.
- Kontras teks: muted/bg 4.81, accent/bg 7.63, white/accent 8.32 (AA lulus).
- `npm run typecheck` 0 error; `npm run build` sukses.

## 2026-10-26 — Phase 0: Discovery & scaffold

### Added
- Scaffold proyek Astro + EmDash (template resmi **Starter / Node.js**).
- `package.json` (Astro ^7.4.2, EmDash ^1.3.0, @astrojs/node ^11.1.5, React ^19.2.4).
- `astro.config.mjs` — output server, adapter Node standalone, SQLite `./data.db`, storage lokal `./uploads`.
- `tsconfig.json` — strict TypeScript.
- `src/live.config.ts`, `src/layouts/Base.astro`, `src/utils/site-identity.ts`.
- Route publik: `/`, `/posts`, `/posts/[slug]`, `/[slug]`, `/category/[slug]`, `/tag/[slug]`, `404`.
- `seed/seed.json` — schema `posts`/`pages` + konten **DEMO** (Welcome, About).
- `emdash-env.d.ts`, `.mcp.json`, `.gitignore`, `.env.example`, `README.md`, `AGENTS.md`.
- `docs/TODO.md`, `docs/CHANGELOG.md`, `docs/DECISIONS.md`.

### Verified
- `npm run typecheck` → 0 error.
- `npm run build` → sukses (warning chunk admin > 500 kB).
- `npm run start` → HTTP 200.
- `npx emdash doctor` → semua cek lulus.
- Draft tidak tampil publik (404); setelah publish tampil 200; setelah delete kembali 404.

### Notes
- `create-emdash` tidak punya mode non-interaktif; template dipasang manual dari repo resmi.
- Node.js minimum v22.23.4; mesin saat ini v22.22.2.
- 6 high severity transitive `zod` dari `emdash`; tidak di-patch karena butuh downgrade breaking.
