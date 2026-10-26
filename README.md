# ASATECHID Commerce

Website kedua ASATECHID: storefront/katalog produk dan pusat konten edukasi.
Dibangun dengan **Astro** + **TypeScript** + **EmDash CMS**.

> **Status: Phase 1 — design system & public shell.** Konten saat ini adalah
> DEMO/SEED yang hanya membuktikan alur EmDash bekerja (buat draft → simpan →
> render publik). Katalog produk belum ada. Data produk, harga, domain, nomor
> kontak, dan konfigurasi pembayaran belum tersedia dan tidak boleh dikarang.

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

`.env` sudah di-gitignore. Backup kunci ini sebelum deploy — tanpa kunci,
secret plugin terenkripsi tidak bisa didekripsi.

## Perintah

```bash
npm run dev        # dev server (Astro + EmDash)
npm run build      # build production
npm run preview    # preview hasil build
npm run start      # jalankan server produksi (dist/server/entry.mjs)
npm run typecheck  # astro check (TypeScript)
```

## Stack

| Komponen | Versi |
|---|---|
| Astro | ^7.4.2 |
| EmDash | ^1.3.0 |
| @astrojs/node | ^11.1.5 |
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
| `emdash-env.d.ts` | Tipe koleksi (di-regenerate saat `dev`) |
| `docs/` | Dokumentasi proyek & roadmap |

## Batasan saat ini

- Content model masih `posts` + `pages`; koleksi produk/kategori/brand masuk Phase 2.
- Token desain masih provisional; brand final belum ada.
- Belum ada SEO review UI kustom (Phase 5).
- Belum ada CTA inquiry/WhatsApp terkonfigurasi (Phase 6).
- Sidebar widget EmDash tidak dipakai; konten terkait menyusul di Phase 3.

Lihat `docs/11-ROADMAP.md` untuk urutan fase dan acceptance criteria.

## Dokumentasi

- EmDash: https://docs.emdashcms.com/
- Astro: https://docs.astro.build/
- Aturan kerja agent: `docs/AGENTS.md`
- PRD: `docs/01-PRD.md`
