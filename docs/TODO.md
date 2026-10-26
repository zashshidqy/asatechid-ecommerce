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
- Arsip kategori/tag belum masuk sitemap; keputusan indexing-nya masuk Phase 4 (SEO foundation).
- Belum ada RSS feed, komentar, atau widget sidebar; tidak termasuk lingkup Phase 3.
- Locale default CMS masih `en` meskipun konten Indonesia; perubahan locale memerlukan migrasi konten (open item).
- **Data DEMO:** 3 artikel + 1 byline DEMO masih ada di seed dan database; harus diganti/dihapus sebelum publikasi.

## Phase 4 — SEO foundation  ⬜
## Phase 5 — SEO Review UI  ⬜
## Phase 6 — Inquiry MVP  ⬜
## Phase 7 — Launch hardening  ⬜
## Phase 8 — Full checkout (conditional)  ⬜

## Blocker data yang belum tersedia (jangan dikarang)

- Nama produk, SKU, harga, stok, kategori final, merek.
- Domain produksi, nomor WhatsApp, email/alamat kontak.
- Brand guideline (warna/font/logo resmi).
- Provider pembayaran, ongkir, pajak, kebijakan retur.
- Target deployment final (Node vs Cloudflare).
