# Technical Decisions (ADR ringkas)

## ADR-001 — Baseline Astro + EmDash dari template Starter (Node.js)

**Status:** diterima (Phase 0)

**Konteks:** Proyek baru; `docs/02-ARCHITECTURE.md` belum tersedia di repo. README meminta scaffold dari template resmi EmDash yang sesuai target deployment. Cloudflare Workers + D1 + R2 disebut sebagai *kandidat*, bukan keputusan final.

**Keputusan:** Memakai template resmi **Starter** varian **Node.js** (SQLite + storage lokal) melalui file resmi `emdash-cms/templates/starter`, karena `create-emdash` hanya interaktif dan tidak bisa dijalankan non-interaktif di lingkungan ini.

**Konsekuensi:**
- Development lokal tanpa akun cloud.
- Deployment final belum dikunci; migrasi ke Cloudflare nanti memerlukan varian `starter-cloudflare` atau penyesuaian adapter/D1/R2.
- Struktur sengaja minimal agar desain dan content model dibangun pada fase berikutnya.

## ADR-002 — Versi dependency

**Status:** diterima

- Astro `^7.4.2` (rilis stabil terbaru per 2026-10-21).
- EmDash `^1.3.0` (CLI melaporkan v1.3.1 saat dijalankan).
- `@astrojs/node` `^11.1.5`, React/ReactDOM `^19.2.4` (diperlukan admin EmDash).
- TypeScript strict di `tsconfig.json`.

**Catatan:** Node.js minimum **v22.23.4** (dari Astro/EmDash). Mesin pengembangan sudah memakai v22.23.4 sejak 2026-10-26 (lihat ADR-014); CI/deployment tetap harus memakai versi tersebut.

## ADR-003 — Konten DEMO, bukan data bisnis

**Status:** diterima

Seed hanya berisi dua entri bertanda `(DEMO)`. Tidak ada produk, harga, SKU, stok, merek, nomor kontak, domain, atau konfigurasi pembayaran. Semua data bisnis menunggu input owner. Catatan: `docs/12-OPEN-DECISIONS.md` yang disebut di `docs/README.md` belum ada di repo, sehingga daftar keputusan terbuka sementara dicatat di `docs/TODO.md`.

## ADR-004 — SEO: pakai bawaan EmDash dulu

**Status:** diterima

EmDash menyimpan field SEO per entri (`title`, `description`, `image`, `canonical`, `noIndex`) dan menyediakan `getSeoMeta()` + `EmDashHead`. Phase 0 hanya memakai jalur ini. SEO Review UI kustom (SERP preview + audit) dikerjakan terpisah di Phase 5 dan tidak boleh menduplikasi tag head.

## ADR-005 — Bahasa dan locale awal

**Status:** diterima

Konten publik Bahasa Indonesia (`<html lang="id">`, format tanggal `id-ID`). Multi-bahasa di luar MVP.

## ADR-006 — Tidak ada patch paksa untuk audit

**Status:** diterima

`npm audit` menemukan 6 high severity pada `zod` transitive milik `emdash`. Perbaikan otomatis menurunkan `emdash` ke 0.36.0 (breaking). Tidak diterapkan; pantau rilis upstream dan evaluasi ulang sebelum launch.

## ADR-007 — Design token provisional & system font stack

**Status:** diterima (Phase 1)

**Konteks:** Brand guideline ASATECHID belum tersedia. Halaman harus tetap tampil rapi dan mudah diganti.

**Keputusan:**
- Semua warna, font, spacing, radius, dan bayangan berada di `src/styles/tokens.css`.
- Font memakai system stack (`system-ui`, `Segoe UI`, dst.) agar tidak ada dependensi jaringan dan tidak mengklaim font brand resmi.
- Palet netral hangat + satu aksen hijau gelap, semuanya ditandai *provisional*.

**Konsekuensi:** Mengganti brand cukup mengubah token; komponen tidak menyimpan nilai warna mentah. Perlu audit ulang kontras setelah token final.

## ADR-008 — Shell tanpa sidebar widget bawaan

**Status:** diterima (Phase 1)

**Konteks:** `WidgetArea` EmDash merender UI bawaan (judul/placeholder berbahasa Inggris) dan menduplikasi input pencarian di halaman artikel.

**Keputusan:** Halaman artikel memakai layout satu kolom. Konten terkait akan dibangun eksplisit pada Phase 3 dari relasi konten, bukan dari widget generik.

**Konsekuensi:** `sidebar` widget area tetap ada di seed tetapi belum dipakai; dapat dihapus pada Phase 3 bila tidak diperlukan.

## ADR-009 — Aksesibilitas baseline

**Status:** diterima (Phase 1)

- Skip link ke `#main`.
- Satu `<h1>` per halaman, landmark `header`/`nav`/`main`/`footer` dengan label.
- `:focus-visible` global 3px; target sentuh minimum 2.75rem untuk kontrol utama.
- Menu mobile memakai `<details>/<summary>` (tanpa JS untuk membuka), ditutup dengan Escape, dan input pencarian EmDash diberi `aria-label` lewat skrip kecil.
- `prefers-reduced-motion` menonaktifkan transisi/animasi.
- Kontras teks diuji ≥ 4.5:1 untuk teks normal.

**Konsekuensi:** Skrip kecil bergantung pada class internal EmDash (`.emdash-live-search-input`); perlu dicek ulang saat upgrade EmDash.

## ADR-010 — Model konten Phase 2: `products` + `brands` + taxonomy `product_category`

**Status:** diterima (Phase 2), menunggu tinjauan setelah `02-ARCHITECTURE.md` tersedia

**Konteks:** `docs/02-ARCHITECTURE.md` dan dokumen `04`–`10`, `12`–`17` belum ada. PRD hanya menetapkan kebutuhan fungsional (F-02, F-03, F-06) tanpa skema final.

**Keputusan:**
- `products` routable di `/products/{slug}` dengan field: `title`, `excerpt`, `description` (portableText), `featured_image`, `brand` (reference), `related_products` (reference diri), `specifications` (repeater), `price`, `currency`, `availability`, `sku`, `featured`.
- `brands` dibuat sebagai collection **non-routable** (tanpa `urlPattern`) karena belum ada kebutuhan halaman merek dan belum ada data merek nyata.
- Kategori memakai taxonomy bawaan `product_category` (hierarkis) alih-alih collection terpisah, agar arsip kategori memakai mekanisme EmDash (`getTaxonomyTermsWithCacheHint`, filter `where`).

**Konsekuensi:**
- Menambah halaman merek nanti cukup memberi `urlPattern` pada `brands` + route baru; tidak perlu migrasi data.
- Kategori tidak punya body/SEO sendiri; bila nanti butuh konten kategori, perlu collection terpisah.
- `sku` belum unik secara constraint; validasi keunikan harus ditambahkan sebelum dipakai untuk transaksi.

## ADR-011 — Kebijakan harga & ketersediaan yang jujur

**Status:** diterima (Phase 2)

**Konteks:** Tidak ada data harga, mata uang, atau stok nyata. Menampilkan angka placeholder berisiko menyesatkan.

**Keputusan:**
- Harga hanya dirender bila `price` berupa angka valid **dan** `currency` berisi kode non-kosong. Format memakai `Intl.NumberFormat("id-ID")`; kode mata uang tak dikenal tetap ditampilkan agar tidak ambigu.
- Ketersediaan hanya dirender bila nilainya salah satu opsi select (`Tersedia`, `Tidak tersedia`, `Pre-order`).
- Bila kosong, halaman detail menampilkan “Harga belum tersedia” / “Ketersediaan belum tersedia” plus catatan singkat; kartu listing menyembunyikan baris meta.
- Tidak ada tombol beli/checkout/CTA kontak sampai kanal inquiry dikonfigurasi (Phase 6).
- Product/Offer JSON-LD ditunda ke Phase 4 dengan syarat data valid.

**Konsekuensi:** Data bisnis yang belum lengkap tidak pernah dirender sebagai fakta. Perubahan opsi `availability` harus disertai migrasi nilai lama.

## ADR-012 — Produk terkait eksplisit, fallback kategori, `featured` difilter di memori

**Status:** diterima (Phase 2)

**Konteks:** Relasi `related_products` bisa kosong; tipe `WhereValue` pada EmDash 1.3.x tidak menerima boolean sehingga `featured` tidak bisa difilter di query.

**Keputusan:**
- Halaman detail memakai `references.related_products` bila ada. Bila kosong, mengambil produk terbit lain dalam kategori yang sama (kecuali dirinya), maksimal 3.
- Reference lookup tidak menghidrasi taxonomy; `getTermsForEntries("products", ids, "product_category")` dipanggil untuk melengkapi badge kategori pada kartu terkait.
- Beranda mengambil 12 produk terbaru lalu memfilter `featured === true` di memori (maksimal 3 tampil).

**Konsekuensi:** Fallback kategori bisa menampilkan produk yang tidak dikurasi; ini disengaja agar halaman tidak kosong. Filter `featured` di memori perlu diganti query terindeks bila katalog melewati satu halaman kandidat.

## ADR-013 — Verifikasi alur konten memakai HTTP API EmDash + session dev-bypass

**Status:** diterima (Phase 2, khusus development)

**Konteks:** Setup passkey tidak dapat diselesaikan headless dan `emdash content` CLI memerlukan token yang tidak dikeluarkan oleh dev-bypass. Admin UI butuh browser.

**Keputusan:** Verifikasi tulis dilakukan dengan memanggil API internal EmDash memakai cookie session dari `GET /_emdash/api/auth/dev-bypass` dan header `X-EmDash-Request: 1`: `POST /_emdash/api/content/{collection}`, `POST .../{id}/publish`, `DELETE .../{id}`, `DELETE .../{id}/permanent`.

**Konsekuensi:** Endpoint dev-bypass hanya aktif saat `import.meta.env.DEV`. Prosedur ini tidak boleh dipakai di production dan bukan pengganti uji UI admin manual. Entri uji selalu dihapus permanen setelah verifikasi.

## ADR-014 — Upgrade Node.js ke v22.23.4 (user-level)

**Status:** diterima (2026-10-26)

**Konteks:** Astro 7 menolak berjalan di Node v22.22.2 dan mensyaratkan `>=22.23.4`. Mesin pengembangan memakai Fedora 43 dengan Node dari paket sistem; `sudo` tidak tersedia tanpa kata sandi dan tidak ada Node version manager.

**Keputusan:**
- Mengunduh tarball resmi `node-v22.23.4-linux-x64` dari `nodejs.org`, memverifikasi checksum SHA-256 terhadap `SHASUMS256.txt`, lalu mengekstrak ke `~/.local/opt/`.
- Membuat symlink `node`, `npm`, `npx`, `corepack` di `~/.local/bin` (sudah lebih awal di `PATH` daripada `/usr/bin`).
- Memasang ulang dependency dengan `npm ci` memakai Node baru, termasuk native binding (`@libsql`, `sharp`, `lightningcss`, `@astrojs/compiler`).

**Konsekuensi:**
- Shell baru otomatis memakai Node v22.23.4; tidak perlu mengubah paket sistem.
- Upgrade Node di masa depan cukup mengganti symlink `~/.local/opt/node` dan menjalankan `npm ci`.
- CI dan server produksi harus dipasangi versi yang sama; versi ini belum diuji pada runtime deployment final.
- Perubahan tidak tercatat di repository (di luar proyek) sehingga harus didokumentasikan di `README`/pipeline saat deployment disiapkan.

## ADR-015 — Penulis artikel memakai bylines EmDash

**Status:** diterima (Phase 3)

**Konteks:** PRD F-04 meminta artikel memiliki penulis. EmDash 1.3 menyediakan entitas **bylines** yang terhubung ke kredit konten, lengkap dengan nama tampilan, bio, avatar, dan label peran. Membuat collection `authors` sendiri akan menduplikasi fitur bawaan dan memutus integrasi admin.

**Keputusan:**
- Penulis artikel menggunakan bylines EmDash (`bylines` di root seed + `bylines` pada entri konten), bukan collection kustom.
- Seed berisi satu byline DEMO (`tim-demo`) dengan bio yang menyatakan dirinya fiktif.
- Halaman detail menampilkan byline inline di header dan kotak “Tentang penulis” dengan bio; kartu artikel menampilkan nama penulis.

**Konsekuensi:**
- Avatar byline dirender dari `avatarStorageKey` melalui endpoint media EmDash, dengan fallback inisial bila tidak ada avatar.
- Bila nanti butuh halaman penulis publik, route dapat dibangun di atas byline yang sudah ada tanpa migrasi model.
- Bio/avatar adalah data DEMO sampai penulis sungguhan diisi melalui admin.

## ADR-016 — Daftar isi dirender server dengan anchor hasil generate

**Status:** diterima (Phase 3)

**Konteks:** Artikel panjang membutuhkan daftar isi, tetapi menambah JavaScript untuk scroll-spy/TOC memperbesar bundle dan tidak perlu untuk kebutuhan dasar. Editor EmDash tidak menjamin setiap heading memiliki anchor manual.

**Keputusan:**
- `annotateHeadings()` memindai blok Portable Text `h2`/`h3`, membuat slug stabil dari teks (dengan sufiks numerik untuk duplikat), menempelkan `_tocId`, dan mengembalikan daftar heading.
- `PortableBlock.astro` merender elemen heading dengan `id` tersebut; `TableOfContents.astro` merender tautan anchor dari data yang sama.
- Desktop memakai rail sticky; di bawah 64rem rail disembunyikan dan diganti `<details>` di atas isi artikel. Tidak ada JavaScript.

**Konsekuensi:**
- Anchor berubah bila teks heading diedit; tautan lama ke bagian tersebut bisa putus. Belum ada mekanisme override anchor manual.
- Hanya `h2`/`h3` yang masuk daftar isi; heading di dalam blok kustom tidak terdeteksi.
- Bila nanti butuh penanda bagian aktif saat scroll, JavaScript progresif dapat ditambahkan tanpa mengubah markup dasar.

## ADR-017 — Urutan referensi pada seed harus menunjuk entri lebih awal

**Status:** diterima (Phase 3)

**Konteks:** Seed EmDash menyelesaikan `$ref:` saat entri target sudah dibuat. Referensi ke entri yang muncul **setelah** entri sumber akan dilewati dengan peringatan, dan pada `--on-conflict update` referensi tersebut hilang.

**Keputusan:**
- Semua nilai `$ref:` di `seed.json` hanya menunjuk entri yang posisinya lebih awal di array `content`.
- Artikel pertama (`panduan-memilih-produk-demo`) sengaja tidak memiliki `related_posts` eksplisit; halaman detail memakai fallback kategori yang sama. Artikel lain menunjuk artikel pertama.
- Seed diverifikasi dengan menerapkannya berulang (`--on-conflict update`) tanpa peringatan referensi.

**Konsekuensi:**
- Menambah relasi baru harus memperhatikan urutan array; dokumentasi ini menjadi pengingat.
- Relasi dua arah memerlukan salah satu sisi memakai fallback atau dipasang setelah kedua entri ada.
- Bila seed dijalankan pada database kosong, fallback kategori memastikan halaman artikel pertama tetap memiliki bacaan lanjutan.
