# TODO — ASATECHID Commerce

Status per 2026-10-28.

## Phase 0 — Discovery & scaffold  ✅ SELESAI

- [x] Periksa repo (hanya `docs/`, tidak ada kode).
- [x] Verifikasi versi Astro (7.4.2) dan EmDash (1.3.0 / CLI 1.3.1).
- [x] Scaffold dari template resmi EmDash **Starter (Node.js)** — `create-emdash` bersifat interaktif, sehingga file template diambil dari `emdash-cms/templates/starter` dan dipasang manual.
- [x] Admin UI dapat dibuka (`/_emdash/admin/` → setup → dev bypass `dev@emdash.local`). **2026-10-28:** wizard setup diselesaikan di browser dan admin memakai passkey asli; dev-bypass hanya fallback (lihat ADR-032).
- [x] Konten dapat dibuat/disimpan (draft), dipublikasikan, dan dirender publik; draft tidak tampil (404).
- [x] `npm run typecheck` lulus (0 error).
- [x] `npm run build` lulus.
- [x] `npm run start` menyajikan build produksi (HTTP 200).
- [x] `npx emdash doctor` lulus.
- [x] Catat versi dependency & keputusan (lihat `DECISIONS.md`).

### Catatan/blocker Phase 0
- Node.js sistem saat Phase 0 masih v22.22.2 (< minimum v22.23.4). **Sudah diperbaiki pada 2026-10-26**: Node v22.23.4 dipasang di level user dan `node_modules` dipasang ulang dengan `npm ci` (lihat ADR-014).
- `npm audit` melaporkan 6 high severity dari transitive `zod` di `emdash`; saran fix menurunkan `emdash` ke 0.36.0 (breaking). **Tidak diterapkan saat Phase 0.** Phase 7 menambahkan override `zod@4.6.7` dan audit menjadi 0 vulnerability (lihat ADR-029).
- Setup wizard passkey tidak dapat diselesaikan headless; verifikasi tulis memakai dev bypass CLI. **2026-10-28:** wizard diselesaikan di browser dengan passkey; jalur headless tetap memakai dev-bypass untuk uji otomatis.
- **Operasional dev:** setelah `setup/dev-reset` atau menyelesaikan setup passkey, **restart dev server** (`npx astro dev stop` lalu jalankan ulang). Proses lama dapat menyimpan state yang membuat `POST /_emdash/api/content/{collection}` gagal `401 NOT_AUTHENTICATED` padahal GET/PUT tetap berhasil (lihat ADR-032).
- Warning chunk > 500 kB dari bundle admin EmDash (bukan halaman publik).

## Phase 1 — Design system & public shell  ✅ SELESAI

- [x] Logo/brand placeholder yang jelas bisa diganti (`src/components/Logo.astro`, memakai site logo EmDash jika ada).
- [x] Token desain terpusat (`src/styles/tokens.css`) + reset & primitif (`src/styles/global.css`).
- [x] Container, grid, stack/cluster, button, badge, card, breadcrumb, field, empty state.
- [x] Header responsif (nav desktop, disclosure mobile + search), footer, skip link.
- [x] 404, 500, dan empty state pada daftar artikel/kategori/tag.
- [x] Mobile (390px), tablet (834px), desktop (1440px) diperiksa lewat screenshot headless.
- [x] Focus ring keyboard diverifikasi (Tab pada menu mobile), kontras teks ≥ AA.
- [x] `npm run typecheck` dan `npm run build` lulus.

Catatan Phase 1:
- Sidebar widget EmDash tidak dirender di halaman artikel; konten terkait akan dibuat eksplisit pada Phase 3 agar tidak memakai widget berbahasa Inggris.
- Label menu/taxonomy seed diubah ke Bahasa Indonesia.

## Phase 2 — Content model + storefront  ✅ SELESAI

- [x] Koleksi `products` (routable `/products/{slug}`) dan `brands` (non-routable) sesuai kapabilitas EmDash.
- [x] Taxonomy `product_category` (hierarkis, hanya untuk `products`).
- [x] Listing produk (`/products`), arsip kategori (`/products/category/{slug}`), detail produk (`/products/{slug}`).
- [x] Pagination cursor yang crawlable (`?cursor=`) pada listing dan arsip kategori.
- [x] Pencarian produk melalui LiveSearch EmDash + `routeMap` (`products`/`posts`/`pages`).
- [x] Related products dari relasi `related_products`, dengan fallback produk sekategori.
- [x] Beranda: kategori produk (dengan jumlah) dan produk `featured`.
- [x] Kartu produk menampilkan gambar/placeholder, kategori, nama, ringkasan, serta harga/ketersediaan hanya bila valid.
- [x] Harga dan ketersediaan yang kosong ditampilkan jujur ("Harga belum tersedia", "Ketersediaan belum tersedia").
- [x] Konten DEMO ditandai jelas dan hanya ada di `seed/seed.json` (lihat catatan).
- [x] `npm run typecheck` 0 error, `npm run build` sukses, build produksi diuji.

### Verifikasi acceptance Phase 2
- Produk dibuat lewat API CMS (draft) → `/products/produk-uji-cms` **404**, tidak muncul di listing, arsip kategori, sitemap, dan pencarian.
- Setelah `publish` → route canonical **200**, muncul di listing/arsip/sitemap/pencarian, `<title>` dan canonical benar.
- Setelah `delete` + `permanent delete` → **404** lagi; tidak ada entri uji tersisa.
- Produk draft seed `produk-demo-draf` tetap **404**; kategori tidak dikenal → **404**.

### Catatan/limitasi Phase 2
- `docs/02-ARCHITECTURE.md` dan `docs/04`–`10`, `docs/12`–`17` belum tersedia; model konten diturunkan konservatif dari PRD (lihat `03-CONTENT-MODEL.md`).
- `featured` tidak bisa dipakai di `where` pada EmDash 1.3.x (tipe `WhereValue` tidak menerima boolean), jadi filter `featured` dilakukan di memori atas satu halaman kandidat. Perlu ditinjau ulang bila katalog membesar.
- `getEmDashCollection` tidak mendukung `references`, sehingga nama merek hanya tampil di halaman detail (bukan di kartu listing).
- Label `availability` disimpan sebagai teks Indonesia (`Tersedia`, `Tidak tersedia`, `Pre-order`); perubahan opsi harus disertai migrasi data.
- Relasi/brand belum punya halaman publik; brand sengaja non-routable sampai ada kebutuhan nyata.
- **Data DEMO:** seed masih berisi 2 merek + 3 produk terbit + 1 produk draft DEMO. Belum ada guard yang mencegah seed diterapkan ke production; seed harus diganti/dihapus manual sebelum publikasi.
- Belum ada CTA inquiry/beli (Phase 6) dan belum ada JSON-LD Product/Offer (Phase 4).

## Phase 3 — Editorial/blog  ✅ SELESAI

- [x] Koleksi `posts` memakai dukungan bawaan EmDash: `drafts`, `revisions`, `preview`, `scheduling`, `search`, `seo`.
- [x] Field `title`, `featured_image`, `content` (portableText), `excerpt`, dan relasi diri `related_posts`.
- [x] Penulis memakai **bylines** EmDash (bukan collection kustom); 1 byline DEMO di seed.
- [x] Taxonomy `category` (hierarkis) dan `tag` untuk artikel, label Indonesia, termasuk tag `panduan`.
- [x] Listing `/posts` dengan pagination cursor dan navigasi kategori ber-count.
- [x] Detail `/posts/{slug}`: judul, ringkasan, gambar utama, penulis, tanggal, estimasi waktu baca, daftar isi, isi, tag, kotak penulis, dan artikel terkait.
- [x] Arsip `/category/{slug}` dan `/tag/{slug}` (pagination cursor, empty state).
- [x] Beranda memakai komponen kartu artikel yang sama (`PostGrid`).
- [x] Daftar isi dirender server (rail di desktop, disclosure di mobile) dengan anchor `id` yang dibuat dari teks heading; tanpa JavaScript.
- [x] Artikel terkait: relasi `related_posts`; bila kosong, fallback ke artikel lain dalam kategori yang sama.
- [x] Banner pratinjau + `Cache-Control: private, no-store` pada tautan preview.
- [x] Entri DEMO bahasa Inggris lama (`welcome`) dihapus (trash + permanent).
- [x] `npm run typecheck` 0 error, `npm run build` sukses, build produksi diuji di port 4322.

### Verifikasi acceptance Phase 3
- `/posts` dan 3 detail artikel → **200**; `/category/general`, `/category/updates`, `/tag/panduan` → **200**; tag tak dikenal → **404**.
- Anchor TOC (`#mulai-dari-kebutuhan`, dst.) cocok dengan `id` heading dan dapat diklik; TOC ganda tidak muncul (rail disembunyikan di <64rem, disclosure disembunyikan di ≥64rem).
- Byline tampil di kartu, header artikel, dan kotak “Tentang penulis”; tanggal dan estimasi baca tampil.
- Artikel terkait: entri dengan `related_posts` menampilkan relasi eksplisit; entri tanpa relasi memakai fallback kategori (tanpa menampilkan dirinya sendiri).
- Alur pratinjau: artikel uji dibuat sebagai draft → publik **404**; `POST .../preview-url` → halaman **200** dengan banner pratinjau dan `no-store`; setelah publish → publik **200** tanpa banner; entri uji dihapus permanen.
- Sitemap `/sitemap-posts.xml` hanya memuat 3 artikel terbit (entri uji dan `welcome` tidak ada).

### Catatan/limitasi Phase 3
- `docs/02-ARCHITECTURE.md` dan dokumen `04`–`10`, `12`–`17` masih belum tersedia; model editorial diturunkan konservatif dari PRD (F-04) dan didokumentasikan di `03-CONTENT-MODEL.md`.
- Anchor heading berasal dari teks heading. Mengubah judul heading akan mengubah anchor, sehingga tautan lama ke bagian tersebut bisa putus. Belum ada mekanisme anchor manual.
- Daftar isi hanya mencakup `h2`/`h3`; heading di dalam blok kustom (mis. embed) tidak ikut.
- Estimasi waktu baca memakai 200 kata/menit atas teks blok, bukan pengukuran nyata.
- “Diperbarui” hanya tampil bila `updatedAt` jatuh pada hari kalender yang berbeda dari `publishedAt`, agar penyuntingan rutin di hari yang sama tidak menjadi noise.
- Tautan preview tetap valid sampai kedaluwarsa meskipun artikel sudah dipublikasikan (perilaku bawaan EmDash).
- Arsip kategori/tag belum masuk sitemap; keputusan dan alasannya dicatat pada catatan Phase 4.
- Belum ada RSS feed, komentar, atau widget sidebar; tidak termasuk lingkup Phase 3.
- Locale default CMS masih `en` meskipun konten Indonesia; perubahan locale memerlukan migrasi konten (open item).
- **Data DEMO:** 3 artikel + 1 byline DEMO masih ada di seed dan database; harus diganti/dihapus sebelum publikasi.

## Phase 4 — SEO foundation  ✅ SELESAI

- [x] Head metadata tetap memakai `getSeoMeta()` + `EmDashHead` (satu sumber, tanpa duplikasi `<title>`/description/canonical).
- [x] Canonical untuk **semua** route indexable, memakai origin publik terkonfigurasi dan membuang query string.
- [x] Halaman `noindex` (404, 500, preview, entri dengan SEO `noIndex`) tidak mengeluarkan canonical.
- [x] Open Graph: `og:type=article` + `article:published_time`/`article:modified_time`/`article:author` untuk artikel; `og:image` absolut untuk semua halaman.
- [x] JSON-LD `BlogPosting` untuk artikel (headline, description, image, URL, tanggal, penulis, publisher) dan `WebSite` untuk halaman non-artikel.
- [x] Gambar sosial default `public/og-default-demo.png` (1200×630, ditandai DEMO) sebagai fallback; site setting `seo.defaultOgImage` tetap menang bila diisi admin.
- [x] Site URL publik dibaca dari `EMDASH_SITE_URL`/`SITE_URL` (runtime `process.env`) → config → origin request, konsisten untuk canonical, sitemap, robots, dan OG.
- [x] `robots.txt` bawaan EmDash: allow publik, disallow `/_emdash/`, `Sitemap:` memakai origin terkonfigurasi.
- [x] Sitemap otomatis hanya memuat entri terbit dan tidak `noIndex`; draft dan entri uji tidak muncul.
- [x] Redirect bawaan EmDash diuji lewat seed: `/posts/welcome` → `/posts` (301).
- [x] SEO panel EmDash diuji: title/description/canonical/noIndex dari panel menimpa default dan konsisten di `<head>`, serta `noIndex` mengeluarkan entri dari sitemap.
- [x] `npm run typecheck` 0 error, `npm run build` sukses, build produksi diuji dengan `EMDASH_SITE_URL` berbeda dari origin request.

### Verifikasi acceptance Phase 4
- Tidak ada duplikasi: tepat 1 `<title>`, 1 `meta[name=description]`, 1 `link[rel=canonical]`, 1 `og:title`, dan 1 `og:image` per halaman yang diperiksa.
- `/`, `/posts`, `/products`, arsip kategori/tag, dan halaman konten → canonical absolut; `/posts?ref=abc` → canonical `.../posts`.
- 404 → `noindex, nofollow` tanpa canonical; preview draft → `noindex, nofollow`, tanpa canonical, banner pratinjau tetap tampil; draft tanpa token → 404.
- Artikel → `og:type=article`, `twitter:card=summary_large_image`, JSON-LD `BlogPosting`; headline/description/image/url/datePublished/dateModified/author/publisher terisi.
- Entri uji dengan SEO panel `noIndex=true` → `noindex` + tanpa canonical + **tidak** ada di `/sitemap-posts.xml`; setelah `noIndex=false` dan canonical eksplisit → canonical mengikuti nilai panel dan entri kembali ke sitemap. Entri uji dihapus permanen.
- Produksi di port 4322 dengan `EMDASH_SITE_URL=http://localhost:4321`: canonical, `og:image`, JSON-LD, `robots.txt`, dan seluruh sitemap memakai `http://localhost:4321`, bukan origin request.
- `/og-default-demo.png` → 200 `image/png`; `/products/produk-demo-draf` → 404 dan absen dari sitemap; `/about` ada di `sitemap-pages.xml`.

### Catatan/limitasi Phase 4
- **Product/Offer JSON-LD belum dirender** karena belum ada harga, mata uang, atau ketersediaan valid (ADR-019). Halaman produk saat ini memakai JSON-LD `WebSite` bawaan EmDash untuk halaman non-artikel; ini akan diganti saat data penawaran tersedia.
- Sitemap bawaan EmDash hanya mengenumerasi collection, sehingga arsip `/category/*` dan `/tag/*` belum masuk sitemap meskipun indexable dan punya canonical. Keputusan: dibiarkan sampai Phase 7 (route audit) atau sampai ada plugin sitemap; jangan menambah daftar manual yang mudah basi.
- Halaman hasil pagination (`?cursor=`) dikanonikalkan ke halaman pertama; halaman kedua dan seterusnya tidak diindeks. Ini disengaja untuk menghindari duplikasi.
- Gambar sosial default adalah placeholder DEMO; ganti melalui Site Settings (`seo.defaultOgImage`) atau ganti `public/og-default-demo.png` sebelum publikasi.
- Verifikasi Google Search Console / Bing belum bisa dilakukan karena kode verifikasi dan domain belum tersedia.
- `EMDASH_SITE_URL` **wajib** diisi di produksi. Tanpa itu canonical/OG/sitemap mengikuti origin request, yang bisa salah di balik reverse proxy.
- Redirect masih berupa satu aturan DEMO di seed; aturan produksi harus ditambahkan lewat admin/seed saat URL lama diketahui.

## Phase 5 — SEO Review UI  ✅ SELESAI

- [x] Panel editor native EmDash (`seo-review`) untuk koleksi `posts`, `products`, dan `pages`, terdaftar lewat `admin.editorPanels` di `astro.config.mjs`.
- [x] Pratinjau SERP desktop dan mobile (simulasi, diberi label) memakai judul, URL tampilan, dan deskripsi final.
- [x] Audit checks: judul/deskripsi ada, panjang judul/deskripsi (saran), heading H2/H3, H1 di konten, urutan heading, konten kosong, konten tipis, tautan internal, tautan lokal rusak, gambar tanpa alt, alt gambar utama, gambar sosial (termasuk peringatan placeholder DEMO), konsistensi canonical, info noindex, nama situs berulang.
- [x] Skor dengan rincian bobot (wajib 25, peringatan 8, saran 2, info 0) dan label eksplisit “panduan internal, bukan prediksi peringkat Google”.
- [x] Publish gate `content:beforePublish` memblokir **hanya** temuan wajib: judul kosong, konten utama kosong, slug kosong. Peringatan/saran tidak memblokir.
- [x] Panel membaca **revisi draf terakhir yang tersimpan** (baris live + revisi draf + `_slug` terstaging), bukan hanya baris terbit.
- [x] Audit engine murni + adapter yang meniru `getSeoMeta()` dan fallback `Base.astro`, sehingga pratinjau konsisten dengan output publik.
- [x] Unit test engine audit (21 test) memakai `node --experimental-strip-types --test` tanpa menambah Vitest/tsx.
- [x] Aksi panel “Periksa ulang” memuat ulang blok dan mengembalikan toast.
- [x] `npm run typecheck` 0 error/0 warning/0 hint (42 file), `npm test` 21/21 lulus, `npm run build` sukses, `npx emdash doctor` semua cek lulus.

### Verifikasi acceptance Phase 5
- Manifest dev dan build produksi menampilkan plugin `seo-review` dengan `enabled: true`, `adminMode: "blocks"`, dan editor panel untuk `posts`/`products`/`pages`.
- Panel berhasil dibuka untuk entri `posts`, `products` (termasuk produk draf), dan `pages`.
- **Data draf:** draf tersimpan dengan konten kosong membuat panel menampilkan “Publikasi akan diblokir” / “Konten utama kosong”, sementara halaman publik tetap menyajikan konten terbit. `POST .../publish` mengembalikan `PUBLISH_REJECTED` dengan alasan gate. Draf kemudian dibuang (`discard-draft`).
- Entri uji valid berhasil dipublikasikan lewat API, lalu di-trash dan dihapus permanen; route publik kembali **404**.
- Aksi `block_action` `refresh` mengembalikan toast “Pemeriksaan diperbarui.” dan blok yang dirender ulang.
- **Konsistensi output:** setelah SEO override diisi, judul, deskripsi, dan canonical pada panel sama persis dengan `<head>` halaman publik; override dikembalikan.
- **noindex:** halaman publik mengeluarkan `noindex` tanpa canonical; panel menampilkan “Halaman noindex” dan **tidak** menampilkan “Canonical kosong”.
- Build produksi di port 4322 dengan `EMDASH_SITE_URL=http://localhost:4321` menyajikan manifest dan panel; canonical panel sama dengan halaman publik.

### Catatan/limitasi Phase 5
- Panel hanya mengaudit **revisi draf terakhir yang tersimpan**. Ketikan yang belum disimpan di editor tidak terlihat; ini disebutkan di dalam panel.
- Pemeriksaan tautan lokal rusak hanya berjalan di panel (memakai daftar path terbit); publish hook melewatinya agar publikasi tetap cepat.
- Gate hanya memblokir tiga masalah wajib. Kualitas editorial lain (deskripsi kosong, alt gambar, konten tipis, dsb.) tetap berupa peringatan/saran.
- Skor adalah panduan internal dengan bobot tetap, bukan prediksi peringkat Google dan bukan audit teknis menyeluruh (Core Web Vitals, crawlability, dsb.).
- Pratinjau SERP adalah simulasi dengan pemotongan karakter tetap; tampilan Google berbeda per perangkat dan waktu.
- Plugin memakai `@emdash-cms/blocks` (dependency baru) untuk Block Kit; bundle admin tetap memicu warning chunk > 500 kB (sudah ada sejak Phase 0, bukan halaman publik).
- Locale CMS masih `en`; audit memakai teks Indonesia tetapi tidak mengubah locale konten.
- `docs/02-ARCHITECTURE.md` dan dokumen `04`–`10`, `12`–`17` masih belum tersedia.

## Phase 6 — Inquiry MVP  ✅ SELESAI — CTA aktif setelah env diisi

- [x] CTA WhatsApp + email pada halaman detail produk, hanya dirender bila kanal dikonfigurasi.
- [x] Nomor/URL tujuan dibaca dari environment server (`INQUIRY_WHATSAPP_NUMBER`, `INQUIRY_EMAIL`), bukan hard-code.
- [x] Validasi nomor WhatsApp (format internasional, 8–15 digit, menolak awalan 0) dan email sebelum membentuk tautan.
- [x] Pesan WhatsApp/email memuat judul produk dan URL canonical produk, sehingga admin tahu konteks permintaan.
- [x] WhatsApp membuka tab baru dengan `rel="noopener noreferrer"`; email memakai `mailto:` dengan subjek dan body terisi.
- [x] Bila tidak ada kanal valid, CTA diganti tombol nonaktif + pesan jelas; tidak ada tautan rusak atau status sukses palsu.
- [x] Catatan privasi: situs tidak menyimpan isi pesan; tidak ada form, tabel lead, atau endpoint inquiry pada fase ini.
- [x] Unit test untuk normalisasi nomor/email, penanganan konfigurasi tidak valid, dan pembentukan tautan (10 test baru; total 31).
- [x] `npm run typecheck` 0 error/0 warning/0 hint (45 file), `npm test` 31/31 lulus, `npm run build` sukses.

### Verifikasi acceptance Phase 6
- Build produksi dijalankan dengan `INQUIRY_WHATSAPP_NUMBER=+1 555 010 0000` dan `INQUIRY_EMAIL=uji@example.com`: halaman produk menampilkan **Chat WhatsApp** dan **Kirim email**; `wa.me` memuat nomor ternormalisasi + pesan ter-encode, `mailto:` memuat subjek/body, dan tautan WhatsApp memakai `target="_blank"` + `rel="noopener noreferrer"`.
- Tanpa env: halaman produk menampilkan “Kanal kontak belum tersedia” dan tombol **Hubungi penjual** dalam keadaan `disabled`; tidak ada tautan eksternal.
- Dengan WhatsApp tidak valid (`0812-...`) tetapi email valid: hanya **Kirim email** yang tampil; server mencatat peringatan konfigurasi tanpa membocorkan nilai ke halaman.
- Halaman produk tetap **200** pada ketiga skenario; tidak ada error server.

### Catatan/limitasi Phase 6
- **Nilai kontak sebenarnya belum diberikan.** CTA di produksi tetap nonaktif sampai `INQUIRY_WHATSAPP_NUMBER` dan/atau `INQUIRY_EMAIL` diisi. Jangan mengisi nomor/email contoh ke production.
- Tidak ada inquiry form, penyimpanan lead, atau pengiriman email server-side. Karena itu belum ada spam control/rate limit; menambah form nanti memerlukan validasi server, persetujuan privasi, dan akses admin terbatas.
- CTA hanya ada di halaman detail produk. Halaman kontak khusus dan CTA site-wide (header/footer) belum dibuat; dapat ditambahkan pada Phase 7 atau saat kontak resmi tersedia.
- Nomor WhatsApp wajib format internasional tanpa awalan 0 karena situs tidak mengetahui kode negara. Nomor lokal akan ditolak dan dianggap tidak dikonfigurasi.
- Nilai `INQUIRY_*` adalah konfigurasi server; mengubahnya memerlukan restart proses. Nilai ini tidak dirahasiakan (dipakai di tautan publik), tetapi tidak dikirim ke bundle client.
- Tidak ada janji waktu respons atau ketersediaan stok dalam pesan; konten pesan hanya konteks produk.

## Phase 7 — Launch hardening  🟡 KODE SELESAI — BLOCKER DATA/OPERASIONAL

- [x] Security review: auth admin, dev-bypass, API/CSRF, cookie, header, XSS, secret, upload, redirect, dependency.
- [x] `src/middleware.ts`: CSP publik + nonce per request, `X-Frame-Options`, HSTS saat HTTPS; CSP admin EmDash tidak ditimpa.
- [x] Inline script header dipindah ke modul + nonce; `script-src 'self' 'nonce-…'` tanpa `'unsafe-inline'`.
- [x] Verifikasi produksi: `/_emdash/admin` → 302 login; API tanpa auth → 401; POST tanpa `X-EmDash-Request` → 403 CSRF; dev-bypass → 403.
- [x] SEO route audit: status, title, description, canonical, robots, OG, JSON-LD, heading, alt, duplicate ID, link safety, sitemap, robots, redirect.
- [x] `scripts/site-audit.mjs` + `npm run audit:site`; hasil produksi PASS (5 URL sitemap, 13 link internal unik, 22 warning LiveSearch).
- [x] Responsive check Firefox headless 390/768/1280 pada beranda, katalog, produk, artikel, kategori/tag.
- [x] A11y: skip link, lang, satu h1, urutan heading, focus-visible, target 44px, reduced motion, alt, `rel="noopener"`.
- [x] Kontras token diuji otomatis (2 test); `--color-muted` digelapkan ke `#63696e` agar lulus 4.5:1 di `surface-muted`.
- [x] Performance review: halaman publik ~26 KB CSS + ~6 KB LiveSearch; aset `_astro` immutable; bundle admin >500 kB hanya admin.
- [x] Backup/restore diuji: `VACUUM INTO`, `integrity_check=ok`, server dijalankan dari salinan DB, halaman produk 200.
- [x] Dokumentasi baru: `docs/08-SECURITY.md`, `docs/09-TESTING.md`, `docs/10-DEPLOYMENT.md`, `docs/12-OPEN-DECISIONS.md`.
- [x] `scripts/launch-check.ts` + `npm run check:launch` (dan `:staging`) untuk env, kontak, DEMO, file sensitif, dokumen.
- [x] Override `zod@4.6.7`; `npm audit` → 0 vulnerability; build/test tetap lulus.
- [x] `data.db.bak-20261026` di-untrack dari Git dan pola `data.db.*` ditambahkan ke `.gitignore`.
- [x] Typecheck 52 file 0 error/0 warning/0 hint; `npm test` 33/33; build sukses; `npx emdash doctor` lulus.
- [ ] Hapus/ganti seluruh data DEMO dan aset `og-default-demo.png` sebelum publikasi.
- [ ] Isi domain final, `EMDASH_SITE_URL` HTTPS, dan kontak resmi; CTA saat ini nonaktif.
- [ ] Purge `data.db.bak-20261026` dari history Git + remote, lalu rotasi `EMDASH_ENCRYPTION_KEY` dan sesi admin.
- [ ] Verifikasi Search Console/Bing dengan kode nyata dan submit sitemap.
- [ ] Pilih target deployment final (Node vs Cloudflare) dan selesaikan backup retensi.
- [ ] `npm run check:launch` harus PASS (saat ini sengaja FAIL karena blocker di atas).

### Verifikasi acceptance Phase 7
- **Security:** header publik terverifikasi (`CSP` + nonce, `X-Frame-Options: SAMEORIGIN`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`); HSTS muncul dengan `X-Forwarded-Proto: https`; CSP admin tetap memakai policy EmDash. `npm audit` 0 vulnerability setelah override zod.
- **SEO:** `npm run audit:site -- --base http://127.0.0.1:4328 --production` → PASS; canonical/robots/OG/JSON-LD konsisten, 404 noindex tanpa canonical, sitemap 5 URL cocok canonical, robots memblokir `/_emdash/`.
- **A11y/responsive:** screenshot 390/768/1280 tanpa overflow; satu h1 tanpa lompatan heading; tidak ada ID duplikat/gambar tanpa alt; kontras teks lulus AA. Warning tersisa: dua input LiveSearch baru mendapat label dari script klien.
- **Performance:** halaman publik hanya memuat CSS gabungan + LiveSearch; tidak ada JS admin di halaman publik; aset hashed immutable.
- **Backup/restore:** backup konsisten + integrity check + restore ke direktori terpisah berhasil (produk 200).
- **Docs/scripts:** empat dokumen Phase 7 dibuat; `check:launch` dan `audit:site` dapat dijalankan ulang.

### Blocker/limitasi Phase 7
- **Data produksi belum ada:** domain, kontak resmi, produk/harga/stok, brand, deployment target, kode Search Console. `check:launch` sengaja gagal (3 blocker saat dijalankan: `EMDASH_SITE_URL`, kontak, dan 73 marker DEMO).
- **Data DEMO masih ada** di `seed/seed.json` (73 marker) dan database; belum boleh publikasi.
- **Backup DB pernah terlacak** dan sudah ada di remote `main`. File di-untrack, tetapi history belum dipurge; rotasi kunci wajib bila repo dianggap bocor.
- CSP publik masih memakai `style-src 'unsafe-inline'` untuk scoped style Astro; `script-src` sudah nonce-based.
- LiveSearch EmDash tidak punya label server-side; label ditambahkan script klien. Tanpa JS, pencarian tidak berfungsi.
- Tidak ada uji screen reader formal, axe/Lighthouse CI, atau E2E browser.
- Bundle admin >500 kB tetap warning Vite; bukan halaman publik.
- Target Cloudflare belum divalidasi; konfigurasi saat ini Node + SQLite + storage lokal.

## Phase 8 — Storefront homepage sesuai `docs/DESIGN.md`  ✅ KODE SELESAI (2026-10-28)

`docs/DESIGN.md` dipakai sebagai **acuan visual** (palet, tipografi, spacing, urutan section), **bukan** sumber brand maupun data. Lihat ADR-033 dan ADR-034.

### 8.0 Keputusan yang mengikat

- [x] Brand storefront: **ASATECHID**. Nama "Technova" pada `docs/DESIGN.md` **tidak dipakai** di UI, metadata, `package.json`, atau nama komponen.
- [x] Nama produk, harga, SKU, merek, dan angka promo dari DESIGN.md **tidak boleh masuk kode** (Samsung, AppIDe, Taka Altra, MacBook Air, Neuled, YOS, Largo, Bobos, `$1,150`, `$950`, "Save up to 35%", dll.).
- [x] Semua kartu memakai placeholder jujur: gambar `MediaPlaceholder` bertanda DEMO (rasio 4:3), harga `—` / "Harga belum tersedia", harga coret hanya bila nilainya valid.
- [x] Seed `seed/seed.json` **tidak ditambah** entri demo baru pada fase ini.
- [x] 4 quick category diturunkan dari taxonomy `product_category` (maks. 4 teratas); section disembunyikan bila kosong. Tidak ada label kurasi karangan.
- [x] Sumber konten promo banner: **belum ada**. `PromoBanner` dirender dengan label DEMO dan CTA nonaktif ("Lihat promo belum tersedia"). Model data promo (site setting vs collection) tetap open item.
- [x] Cart & wishlist: cart berupa tombol `disabled` berlabel "Keranjang belum tersedia"; ikon hati **tidak** dirender (tidak ada tombol palsu).
- [x] Font display tetap system stack; tidak ada font yang di-self-host (menghindari request jaringan tanpa aset resmi).

### 8.1 Token desain

- [x] `src/styles/tokens.css`: palet provisional dari DESIGN.md — `accent #2f5fd9`, `accent-hover #1f4bb8`, `accent-light #5b9bf0`, `highlight #f59a3b`, `bg #eef1fa`, `surface-muted #f4f6fd`, ink 3 level, border `#e5e8f0`, `--gradient-hero`, `--gradient-promo`, `--gradient-promo-soft`.
- [x] Token baru: `--radius-xl` (14px), `--shadow-card`, `--shadow-card-hover`, spacing section `clamp()`.
- [x] `src/lib/design/contrast.test.ts`: 18 pasangan teks/latar diuji ≥ 4.5:1 (termasuk `ink` di `highlight` dan `accent` di `surface`).
- [x] Tidak ada nilai warna duplikat di komponen baru; semua memakai token.

### 8.2 Primitif komponen

- [x] `Badge` varian `highlight` dan `soft`; `Button` memakai radius 8px; `.icon-btn` untuk panah/paginasi.
- [x] `SectionHead` dengan slot aksi (link "Lihat semua" + tab filter).
- [x] `FilterTabs` berbasis tautan `?kategori=` (crawlable, berfungsi tanpa JS).
- [x] `PromoBanner` + `QuickCategoryCard`.
- [x] `MediaPlaceholder` bertanda DEMO dengan rasio tetap 4:3 / 16:9 / 1:1.

### 8.3 Section beranda (urutan DESIGN.md §5)

- [x] Top bar (tagline situs + tautan Katalog/Artikel + status keranjang) dan header dengan search bawaan EmDash serta tombol cart nonaktif.
- [x] Hero carousel 3 slide (gradient + sparkle CSS): dot pagination, panah, auto-slide 5s, tombol **Jeda/Mainkan**, berhenti saat hover/fokus/tab tersembunyi, `prefers-reduced-motion`, slide pertama tetap tampil tanpa JS.
- [x] Quick category cards dari taxonomy (2–4 kartu sesuai data).
- [x] Featured Products + tab filter + slot banner promo.
- [x] Just Arrived ("Baru masuk", 3 produk terbaru) + slot banner promo.
- [x] Category banners 3 kolom dari kategori nyata (menampilkan jumlah produk).
- [x] Baris produk kedua diganti **"Lainnya dari katalog"** (rail scroll-snap) agar tidak menduplikasi produk yang sama persis seperti pada mockup.
- [x] Section "Artikel terbaru" dipertahankan sebagai bagian editorial-commerce.

### 8.4 Product card

- [x] Badge kategori/“Pilihan” + harga coret hanya bila `compare_at_price` ada dan lebih besar dari `price`.
- [x] Wishlist dihapus sesuai keputusan 8.0.
- [x] Hover lift `translateY(-2px)` dengan `prefers-reduced-motion`, fokus keyboard tetap terlihat.
- [ ] Field `compare_at_price` **belum ada** di schema `products`; kartu sudah mendukungnya, tetapi nilainya belum bisa diisi dari admin.

### 8.5 Kualitas

- [x] Responsif 390 / 768 / 1280 tanpa overflow horizontal (diverifikasi via CDP: `scrollWidth === innerWidth`).
- [x] A11y: satu `h1`, kontrol carousel berlabel, target sentuh tombol ikon 44px, kontras AA, reduced-motion, urutan heading h1→h2→h3.
- [x] Placeholder memakai `aspect-ratio` tetap sehingga tidak ada layout shift.

### 8.6 Verifikasi & dokumentasi

- [x] `npm run typecheck` → 60 file, 0 error / 0 warning / 0 hint.
- [x] `npm test` → 33/33 lulus.
- [x] `npm run build` sukses; `npm run audit:site -- --base http://127.0.0.1:4322 --production` → **PASS** (warning LiveSearch label tetap seperti Phase 7).
- [x] Grep `src/` bersih dari `Technova`, `MacBook`, `Samsung`, `AppIDe`, `Taka Altra`, `Neuled`, `YOS`, `Largo`, `Bobos`, `$1,150`, `$950`, `35%`.
- [x] Screenshot 390/768/1280 diperiksa (desktop, tablet, mobile) dan interaksi carousel diuji lewat CDP.
- [x] `docs/CHANGELOG.md` dan `docs/DECISIONS.md` diperbarui (ADR-034).

### Catatan/limitasi Phase 8

- DESIGN.md belum menjadi brand guideline resmi; token tetap provisional dan dapat diganti.
- DESIGN.md melanggar sebagian aturan desain `docs/AGENTS.md` §5 (gradient dekoratif, sparkle). Implementasi membatasi gradient hanya pada hero/promo banner dan tidak memakai animasi berat.
- **Konten promo masih placeholder.** Belum ada model data promo; banner menampilkan label DEMO dan CTA nonaktif sampai sumber konten dipilih.
- **Jumlah produk/kategori masih data DEMO** (kategori `dvr`/`nvr`, 3 produk). Hitungan "0 produk" pada banner kategori berasal dari data taxonomy saat ini, bukan bug tampilan.
- Field `compare_at_price` belum ada di schema `products`; harga coret belum bisa diisi.
- Cart, checkout, dan pembayaran tetap di luar lingkup (Phase 9 dan seterusnya).
- Jika data produk belum ada, section menampilkan empty state, bukan kartu palsu.
- Astro meng-inline chunk script < 4 KB sehingga bertabrakan dengan CSP nonce; `vite.build.assetsInlineLimit` disetel 0 agar script diemisi sebagai modul eksternal (ADR-034).

## Phase 9 — Full checkout (conditional)  ⬜

## Blocker data yang belum tersedia (jangan dikarang)

- Nama produk, SKU, harga, stok, kategori final, merek.
- Domain produksi, nomor WhatsApp, email/alamat kontak.
- Brand guideline (warna/font/logo resmi). Nilai pada `docs/DESIGN.md` masih provisional.
- Konten promo (judul, gambar, angka diskon) untuk banner beranda.
- Provider pembayaran, ongkir, pajak, kebijakan retur.
- Target deployment final (Node vs Cloudflare).
