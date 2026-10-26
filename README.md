# ASATECHID Commerce

Website kedua ASATECHID: storefront/katalog produk dan pusat konten edukasi.
Dibangun dengan **Astro** + **TypeScript** + **EmDash CMS**.

> **Status: Phase 5 — SEO Review UI.** Konten saat ini adalah DEMO/SEED.
> Katalog produk, artikel, metadata SEO, sitemap, robots, redirect, serta panel
> SEO Review (pratinjau SERP, checklist, skor panduan, dan publish gate) sudah
> berjalan di atas EmDash. Data produk, harga, domain, nomor kontak, dan
> konfigurasi pembayaran belum tersedia dan tidak boleh dikarang.

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

`.env` sudah di-gitignore. Backup kunci ini sebelum deploy — tanpa kunci,
secret plugin terenkripsi tidak bisa didekripsi. Domain produksi belum
ditentukan, jadi jangan mengisi nilai contoh di atas ke production.

## Perintah

```bash
npm run dev        # dev server (Astro + EmDash)
npm run build      # build production
npm run preview    # preview hasil build
npm run start      # jalankan server produksi (dist/server/entry.mjs)
npm run typecheck  # astro check (TypeScript)
npm test           # unit test engine audit SEO Review
```

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
| `src/pages/` | Halaman publik (server-rendered) |
| `src/lib/seo-review/` | Engine audit murni + adapter metadata SEO Review |
| `src/plugins/seo-review/` | Plugin native: panel editor + publish gate |
| `emdash-env.d.ts` | Tipe koleksi (di-regenerate saat `dev`) |
| `docs/` | Dokumentasi proyek & roadmap |

## Batasan saat ini

- Token desain masih provisional; brand final belum ada.
- Panel SEO Review hanya mengaudit revisi draf terakhir yang tersimpan; ketikan yang belum disimpan belum terlihat.
- Skor SEO Review adalah panduan internal, bukan prediksi peringkat Google.
- Belum ada CTA inquiry/WhatsApp terkonfigurasi (Phase 6).
- Data DEMO di seed/database harus diganti sebelum publikasi.
- `docs/02-ARCHITECTURE.md` dan dokumen `04`–`10`, `12`–`17` belum tersedia.

Lihat `docs/11-ROADMAP.md` untuk urutan fase dan acceptance criteria.

## Dokumentasi

- EmDash: https://docs.emdashcms.com/
- Astro: https://docs.astro.build/
- Aturan kerja agent: `docs/AGENTS.md`
- PRD: `docs/01-PRD.md`
