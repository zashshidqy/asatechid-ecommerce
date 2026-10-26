# TODO — ASATECHID Commerce

Status per 2026-10-26.

## Phase 0 — Discovery & scaffold  ✅ SELESAI

- [x] Periksa repo (hanya `docs/`, tidak ada kode).
- [x] Verifikasi versi Astro (7.4.2) dan EmDash (1.3.0 / CLI 1.3.1).
- [x] Scaffold dari template resmi EmDash **Starter (Node.js)** — `create-emdash` bersifat interaktif, sehingga file template diambil dari `emdash-cms/templates/starter` dan dipasang manual.
- [x] Admin UI dapat dibuka (`/_emdash/admin/` → setup → dev bypass `dev@emdash.local`).
- [x] Konten dapat dibuat/disimpan (draft), dipublikasikan, dan dirender publik; draft tidak tampil (404).
- [x] `npm run typecheck` lulus (0 error).
- [x] `npm run build` lulus.
- [x] `npm run start` menyajikan build produksi (HTTP 200).
- [x] `npx emdash doctor` lulus.
- [x] Catat versi dependency & keputusan (lihat `DECISIONS.md`).

### Catatan/blocker Phase 0
- Node.js sistem saat Phase 0 masih v22.22.2 (< minimum v22.23.4). **Sudah diperbaiki pada 2026-10-26**: Node v22.23.4 dipasang di level user dan `node_modules` dipasang ulang dengan `npm ci` (lihat ADR-014).
- `npm audit` melaporkan 6 high severity dari transitive `zod` di `emdash`; saran fix menurunkan `emdash` ke 0.36.0 (breaking). **Tidak diterapkan** — pantau upstream.
- Setup wizard passkey tidak dapat diselesaikan headless; verifikasi tulis memakai dev bypass CLI.
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

## Phase 6 — Inquiry MVP  ⬜
## Phase 7 — Launch hardening  ⬜
## Phase 8 — Full checkout (conditional)  ⬜

## Blocker data yang belum tersedia (jangan dikarang)

- Nama produk, SKU, harga, stok, kategori final, merek.
- Domain produksi, nomor WhatsApp, email/alamat kontak.
- Brand guideline (warna/font/logo resmi).
- Provider pembayaran, ongkir, pajak, kebijakan retur.
- Target deployment final (Node vs Cloudflare).
