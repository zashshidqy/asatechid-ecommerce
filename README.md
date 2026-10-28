# ASATECHID Commerce

Website kedua ASATECHID: storefront/katalog produk dan pusat konten edukasi.
Dibangun dengan **Astro** + **TypeScript** + **EmDash CMS**.

> **Status: Phase 7 — Launch hardening.** Konten saat ini adalah DEMO/SEED.
> Katalog produk, artikel, metadata SEO, sitemap, robots, redirect, panel SEO
> Review, CTA WhatsApp/email, serta header keamanan (CSP publik + nonce, HSTS)
> sudah berjalan di atas EmDash. Data produk, harga, domain, nomor kontak
> resmi, dan konfigurasi pembayaran belum tersedia dan tidak boleh dikarang.

## Prasyarat

- Node.js 22.23.4 atau lebih baru (wajib; v22.22.2 ditolak oleh Astro/EmDash)
- npm

## Setup lokal

```bash
npm install
cp .env.example .env        # jika ada; jika tidak, buat lewat perintah di bawah
npx emdash secrets generate --write .env
npm run dev
```

Buka:

- Situs publik: http://localhost:4321/
- Admin EmDash: http://localhost:4321/_emdash/admin

Setup wizard pertama kali akan membuat database SQLite (`data.db`), menjalankan
migrasi, dan menerapkan seed DEMO.

### Variabel environment

| Variabel | Wajib | Keterangan |
|---|---|---|
| `EMDASH_ENCRYPTION_KEY` | Ya (lokal & produksi) | Kunci enkripsi secret plugin. Jangan commit `.env`. |
| `EMDASH_SITE_URL` | Produksi | Origin publik (tanpa path), mis. `https://www.example.com`. Dipakai untuk canonical, OG URL, sitemap, dan robots.txt. Bila kosong, dipakai origin request (cukup untuk lokal). |
| `INQUIRY_WHATSAPP_NUMBER` | Opsional | Nomor WhatsApp format internasional (tanpa awalan `0`), mis. `+62 8xx xxxx xxxx`. Bila kosong/tidak valid, CTA WhatsApp tidak dirender. |
| `INQUIRY_EMAIL` | Opsional | Alamat email kontak. Bila kosong/tidak valid, CTA email tidak dirender. |

`.env` sudah di-gitignore. Backup kunci ini sebelum deploy — tanpa kunci,
secret plugin terenkripsi tidak bisa didekripsi. Domain produksi belum
ditentukan, jadi jangan mengisi nilai contoh di atas ke production.

### CTA inquiry

Halaman detail produk menampilkan CTA WhatsApp dan/atau email hanya untuk kanal
yang dikonfigurasi. Pesan otomatis memuat judul dan URL produk. Bila kedua
kanal kosong, CTA diganti tombol nonaktif dengan pesan yang jelas — tidak ada
tautan rusak atau status sukses palsu. Tidak ada form atau penyimpanan lead
pada fase ini; situs tidak menyimpan isi pesan.

## Perintah

```bash
npm run dev        # dev server (Astro + EmDash)
npm run build      # build production
npm run preview    # preview hasil build
npm run start      # jalankan server produksi (dist/server/entry.mjs)
npm run typecheck  # astro check (TypeScript)
npm test           # unit test SEO Review + inquiry + kontras
npm run audit:site -- --base http://localhost:4321
npm run check:launch           # gerbang data produksi (gagal bila DEMO/env belum siap)
npm run check:launch:staging   # versi longgar untuk staging
```

`audit:site` memerlukan server yang berjalan. Tambahkan `--production` saat
mengaudit build produksi agar dev-bypass/API admin ikut diperiksa.

## Stack

| Komponen | Versi |
|---|---|
| Astro | ^7.4.2 |
| EmDash | ^1.3.0 |
| @astrojs/node | ^11.1.5 |
| @emdash-cms/blocks | ^1.3.1 |
| React (admin EmDash) | ^19.2.4 |

Runtime lokal: Node.js + SQLite (`./data.db`) + local file storage (`./uploads`).
Deployment target belum dikunci (Node vs Cloudflare Workers + D1 + R2).

## Struktur proyek

| Path | Fungsi |
|---|---|
| `astro.config.mjs` | Integrasi EmDash, adapter Node, database SQLite, storage lokal |
| `src/live.config.ts` | Registrasi EmDash loader (boilerplate) |
| `seed/seed.json` | Definisi schema + konten DEMO |
| `src/styles/tokens.css` | Token desain provisional (warna, font, spacing) |
| `src/styles/global.css` | Reset + primitif shell (button, card, form, prose, dll.) |
| `src/components/` | Header, footer, logo, card, badge, breadcrumb, empty state, field |
| `src/layouts/Base.astro` | Layout publik: head, skip link, header/footer, `main` |
| `src/middleware.ts` | CSP publik + nonce, HSTS, header keamanan |
| `src/scripts/site-header.ts` | Progressive enhancement header (label LiveSearch, Escape menu) |
| `src/pages/` | Halaman publik (server-rendered) |
| `src/lib/seo-review/` | Engine audit murni + adapter metadata SEO Review |
| `src/lib/inquiry/` | Normalisasi kontak + pembentuk tautan WhatsApp/email |
| `src/lib/design/` | Helper kontras WCAG + test token |
| `src/plugins/seo-review/` | Plugin native: panel editor + publish gate |
| `scripts/site-audit.mjs` | Audit SEO/a11y/header/sitemap tanpa dependency |
| `scripts/launch-check.ts` | Gerbang env, DEMO, file sensitif, dokumen |
| `emdash-env.d.ts` | Tipe koleksi (di-regenerate saat `dev`) |
| `docs/` | PRD, keamanan, testing, deployment, roadmap, keputusan |

## Batasan saat ini

- Token desain masih provisional; brand final belum ada.
- Panel SEO Review hanya mengaudit revisi draf terakhir yang tersimpan; ketikan yang belum disimpan belum terlihat.
- Skor SEO Review adalah panduan internal, bukan prediksi peringkat Google.
- CTA WhatsApp/email nonaktif sampai `INQUIRY_WHATSAPP_NUMBER`/`INQUIRY_EMAIL` diisi dengan nilai resmi.
- Belum ada form inquiry, penyimpanan lead, atau halaman kontak khusus (Phase 6 memilih CTA saja).
- Data DEMO di seed/database harus diganti sebelum publikasi; `npm run check:launch` sengaja gagal sampai itu dilakukan.
- `data.db.bak-20261026` sudah di-untrack, tetapi masih ada di history Git/remote. Purge history dan rotasi kunci sebelum repo dianggap aman/publik.
- Dua input LiveSearch mendapat `aria-label` dari script klien karena komponen EmDash tidak menyediakan label server-side.
- Bundle admin EmDash > 500 kB memicu warning Vite; halaman publik hanya memuat CSS + LiveSearch kecil.
- Target deployment belum dikunci; konfigurasi saat ini Node + SQLite + storage lokal.
- `docs/00-PROJECT-BRIEF.md`, `docs/02-ARCHITECTURE.md`, `docs/04`–`07`, dan `docs/13`–`17` belum dibuat.

Lihat `docs/11-ROADMAP.md` untuk urutan fase dan acceptance criteria.

## Dokumentasi

- EmDash: https://docs.emdashcms.com/
- Astro: https://docs.astro.build/
- Aturan kerja agent: `docs/AGENTS.md`
- PRD: `docs/01-PRD.md`
- Keamanan: `docs/08-SECURITY.md`
- Testing: `docs/09-TESTING.md`
- Deployment & backup: `docs/10-DEPLOYMENT.md`
- Keputusan terbuka: `docs/12-OPEN-DECISIONS.md`
