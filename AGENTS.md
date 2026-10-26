# AGENTS.md

Aturan kerja lengkap untuk agent ada di **[`docs/AGENTS.md`](docs/AGENTS.md)** — baca itu terlebih dahulu, lalu `docs/README.md`, `docs/01-PRD.md`, dan `docs/11-ROADMAP.md`.

## Ringkasan cepat

- Stack: Astro 7 + TypeScript + EmDash CMS (Node.js + SQLite + local storage untuk development).
- Bahasa konten: Bahasa Indonesia.
- Jangan mengarang API, data produk, harga, domain, nomor kontak, atau konfigurasi pembayaran.
- Data contoh harus ditandai **DEMO/SEED**.
- Gunakan fitur bawaan EmDash lebih dulu (collections, drafts, preview, SEO, sitemap, robots, redirects).
- Untuk setiap fase: baca acceptance criteria → rencana singkat → implementasi kecil → jalankan typecheck/build/test → perbarui `docs/TODO.md`, `docs/CHANGELOG.md`, `docs/DECISIONS.md` → laporkan hasil jujur.

## Perintah proyek

```bash
npm run dev        # Astro + EmDash dev server (http://localhost:4321)
npm run typecheck  # astro check
npm run build      # production build
npm run start      # jalankan build (dist/server/entry.mjs)
```

Dev server membutuhkan Node.js >= 22.23.4.

## Struktur penting

| Path | Fungsi |
|---|---|
| `astro.config.mjs` | Integrasi EmDash, adapter Node, SQLite, storage lokal |
| `seed/seed.json` | Schema + konten DEMO |
| `src/layouts/Base.astro` | Layout publik & head |
| `src/pages/` | Route publik (server-rendered) |
| `docs/` | PRD, roadmap, TODO, changelog, keputusan |
