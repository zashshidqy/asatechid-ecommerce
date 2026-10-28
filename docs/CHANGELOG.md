# Changelog

Format ringkas per fase. Tanggal memakai ISO (YYYY-MM-DD).

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
