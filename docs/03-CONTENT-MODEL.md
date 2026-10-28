# 03 — Content Model

> Dokumen ini diturunkan dari `docs/01-PRD.md` (F-02, F-03, F-04, F-06) dan
> `docs/11-ROADMAP.md` Phase 2–3 karena `docs/02-ARCHITECTURE.md` dan dokumen
> spesifikasi lain belum tersedia di repo. Model ini **belum final** dan harus
> ditinjau saat dokumen arsitektur/brand lengkap.

## Prinsip

- Gunakan collections, taxonomies, relations, drafts, preview, search, dan SEO
  bawaan EmDash.
- Jangan mengarang harga, mata uang, SKU, stok, merek, atau kategori final.
  Harga/ketersediaan hanya dirender bila datanya valid.
- Semua entri contoh diberi label **DEMO** pada judul/ringkasan dan tidak boleh
  dianggap data bisnis.

## Collections

### `products` — `/products/{slug}`

Supports: `drafts`, `revisions`, `preview`, `scheduling`, `search`, `seo`.

| Field | Type | Catatan |
|---|---|---|
| `title` | string, required, searchable | Nama produk. |
| `excerpt` | text, searchable | Ringkasan kartu dan halaman detail. |
| `description` | portableText, searchable | Deskripsi faktual. |
| `featured_image` | image | Satu gambar utama; galeri menyusul. |
| `brand` | reference → `brands`, satu | Ditampilkan di halaman detail. |
| `related_products` | reference → `products`, banyak | Opsional; fallback ke kategori yang sama. |
| `specifications` | repeater `{label, value}` | Maksimal 20 baris. |
| `price` | number ≥ 0 | Opsional. Hanya dirender bersama `currency`. |
| `currency` | string, maksimal 3 | Kode ISO 4217; tanpa default. |
| `availability` | select | `Tersedia`, `Tidak tersedia`, `Pre-order`; tanpa default. |
| `sku` | string | Opsional; hanya dirender bila diisi. |
| `featured` | boolean, indexed | Untuk bagian “Produk pilihan” di beranda. |

### `brands` — non-routable

Supports: `drafts`, `revisions`. Belum ada halaman publik merek pada Phase 2.

| Field | Type | Catatan |
|---|---|---|
| `name` | string, required, searchable | Nama merek. |
| `description` | text | Deskripsi singkat. |
| `logo` | image | Opsional. |
| `website` | url | Opsional; belum dirender sebagai tautan publik. |

### `posts` — `/posts/{slug}`

Supports: `drafts`, `revisions`, `preview`, `scheduling`, `search`, `seo`.

| Field | Type | Catatan |
|---|---|---|
| `title` | string, required, searchable | Judul artikel. |
| `featured_image` | image | Opsional. Alt text diambil dari media EmDash. |
| `content` | portableText, searchable | Isi artikel; `h2`/`h3` menjadi daftar isi. |
| `excerpt` | text, searchable | Ringkasan kartu dan lead artikel. |
| `related_posts` | reference → `posts`, banyak | Opsional; fallback ke kategori yang sama. |

Penulis memakai **bylines** EmDash (lihat ADR-015), bukan collection terpisah.
`publishedAt`/`updatedAt` diisi EmDash; tanggal tampil dalam format `id-ID`.

## Taxonomies

### `product_category` — kategori produk

Hierarchical, hanya untuk `products`. Istilah DEMO:

- `perangkat-demo` — “Perangkat (DEMO)”
- `aksesori-demo` — “Aksesori (DEMO)”

Kategori final menunggu keputusan owner. URL kategori:
`/products/category/{slug}`.

### `category` — kategori artikel

Hierarkis, hanya untuk `posts`. Istilah DEMO: `general` — “Umum”,
`updates` — “Pembaruan”. URL arsip: `/category/{slug}`.

### `tag` — tag artikel

Non-hierarkis, hanya untuk `posts`. Istilah DEMO: `starter` — “Pemula”,
`example` — “Contoh”, `panduan` — “Panduan”. URL arsip: `/tag/{slug}`.

## Relations

- `products.brand` → `brands` (satu merek per produk).
- `products.related_products` → `products` (relasi diri, banyak). Bila kosong,
  halaman detail memakai produk lain dalam kategori yang sama.
- `posts.related_posts` → `posts` (relasi diri, banyak). Bila kosong,
  halaman detail memakai artikel lain dalam kategori yang sama.
- `product_category` menghubungkan produk ke kategori.
- `category`/`tag` menghubungkan artikel ke taksonominya.
- Bylines menghubungkan artikel ke penulis (kredit bawaan EmDash).

## Routes

| Route | Isi |
|---|---|
| `/products` | Daftar produk publik, pagination cursor, filter kategori. |
| `/products/[slug]` | Detail produk, merek, spesifikasi, produk terkait. |
| `/products/category/[slug]` | Arsip kategori, pagination cursor. |
| `/posts` | Daftar artikel publik, pagination cursor, navigasi kategori. |
| `/posts/[slug]` | Detail artikel, byline, daftar isi, tag, artikel terkait. |
| `/category/[slug]` | Arsip kategori artikel, pagination cursor. |
| `/tag/[slug]` | Arsip tag artikel, pagination cursor. |

Draft tidak pernah diminta dari route publik. `getEmDashCollection` dan
`getEmDashEntry` default ke `status: "published"`, sehingga entri draft
menghasilkan 404 di publik. Pratinjau hanya terbuka lewat tautan bertanda
tangan dari EmDash.

## Aturan tampilan data bisnis

- Harga hanya tampil jika `price` **dan** `currency` valid.
- Ketersediaan hanya tampil jika nilainya salah satu opsi select.
- Bila salah satu tidak ada, halaman detail menampilkan “Harga belum tersedia”
  dan/atau “Ketersediaan belum tersedia” beserta catatan singkat.
- Tidak ada tombol beli, checkout, atau CTA kontak palsu. CTA inquiry masuk
  Phase 6 setelah nomor/kanal dikonfigurasi.
- Product/Offer JSON-LD belum dirender; Phase 4 akan memutuskan syaratnya.

## Aturan tampilan editorial

- Daftar isi dibuat di server dari heading `h2`/`h3`; anchor berupa slug teks
  dengan sufiks untuk duplikat. Tidak ada JavaScript untuk TOC.
- Tanggal terbit memakai `publishedAt`; label “Diperbarui” hanya muncul bila
  `updatedAt` berbeda hari kalender.
- Estimasi waktu baca dihitung 200 kata/menit dari teks blok dan ditandai
  sebagai estimasi, bukan metrik terukur.
- Bila artikel tidak punya `related_posts`, tampilkan artikel lain di kategori
  yang sama (maksimal 3, tanpa dirinya sendiri).
- Halaman pratinjau menampilkan banner “Pratinjau” dan tidak di-cache
  (`Cache-Control: private, no-store`).

## Aturan SEO rendering

- Satu sumber head: `getSeoMeta()` + `EmDashHead`; template tidak menulis tag
  title/description/canonical/JSON-LD manual.
- Canonical absolut untuk semua halaman indexable, memakai origin publik
  terkonfigurasi (`EMDASH_SITE_URL` / site setting `url`), tanpa query string.
- `noindex` (404, 500, preview, SEO panel `noIndex`) tidak mengeluarkan
  canonical.
- Artikel: `og:type=article`, `article:*`, dan JSON-LD `BlogPosting`.
  Halaman lain: `og:type=website` dan JSON-LD `WebSite`.
- Gambar sosial: gambar entri → `seo.defaultOgImage` → placeholder DEMO
  `public/og-default-demo.png`.
- Sitemap hanya memuat entri terbit yang tidak `noIndex`; arsip taxonomy
  belum terenumerasi (lihat catatan Phase 4 di `TODO.md`).
- Redirect memakai redirect manager EmDash; aturan DEMO di seed adalah
  `/posts/welcome` → `/posts` (301).

## SEO Review (Phase 5)

- Panel editor native `seo-review` tersedia untuk `posts`, `products`, dan
  `pages`; panel membaca revisi draf terakhir yang tersimpan, bukan hanya
  baris terbit.
- Metadata pratinjau dihitung dengan `getSeoMeta()` dan fallback yang sama
  dengan `Base.astro`, sehingga judul/deskripsi/canonical panel konsisten
  dengan `<head>` publik.
- Publish gate hanya memblokir judul kosong, konten utama kosong, dan slug
  kosong. Temuan lain berupa peringatan/saran.
- Skor dan checklist adalah panduan editorial internal, bukan prediksi
  peringkat Google.

## Inquiry CTA (Phase 6)

- Halaman detail produk menampilkan CTA WhatsApp dan/atau email hanya untuk
  kanal yang dikonfigurasi lewat `INQUIRY_WHATSAPP_NUMBER` dan `INQUIRY_EMAIL`.
- Pesan memuat judul dan URL canonical produk; tidak ada form atau penyimpanan
  isi pesan.
- Bila tidak ada kanal valid, CTA diganti tombol nonaktif dengan pesan jelas.
- Nomor WhatsApp wajib format internasional tanpa awalan `0`; nomor lokal
  ditolak agar tidak menghasilkan tautan ke nomor yang salah.

## Data DEMO pada seed

`seed/seed.json` berisi:

- 2 merek DEMO (`Merek Demo Satu`, `Merek Demo Dua`).
- 3 produk publik DEMO (`Produk Demo Alpha`, `Beta`, `Gamma`).
- 1 produk draft DEMO (`Produk Demo Draf`) untuk memverifikasi 404.
- 1 byline DEMO (`Tim Demo ASATECHID`).
- 3 artikel publik DEMO (`Panduan Memilih Produk`, `Catatan Ketersediaan
  Produk`, `Cara Membaca Spesifikasi Produk`) dengan kategori/tag, daftar isi
  `h2`/`h3`, byline, dan relasi artikel terkait.
- Tanpa harga, mata uang, SKU, atau ketersediaan.

Semua harus diganti atau dihapus sebelum produksi.
