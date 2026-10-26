# Changelog

Format ringkas per fase. Tanggal memakai ISO (YYYY-MM-DD).

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
