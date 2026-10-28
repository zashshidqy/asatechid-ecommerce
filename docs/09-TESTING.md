# Strategi Pengujian

Status: Phase 7, 2026-10-28.

Tujuan: memberi satu sumber perintah dan cakupan pengujian yang benar-benar
dijalankan, serta mencatat apa yang **belum** diverifikasi.

## 1. Perintah utama

```bash
npm run typecheck   # astro check (TypeScript strict)
npm test            # unit test src/lib/**/*.test.ts
npm run build       # build produksi
npm run audit:site -- --base http://127.0.0.1:4328 --production
npm run check:launch
```

Untuk staging (DEMO masih ada, kontak belum final):

```bash
npm run check:launch:staging
```

`audit:site` memerlukan server yang sedang berjalan. `check:launch` membaca
`.env` dan `process.env`; script ini sengaja gagal bila data produksi belum
lengkap.

## 2. Lapisan pengujian

| Lapisan | Cakupan | Tidak mencakup |
|---|---|---|
| `astro check` | Tipe Astro/TS, import, props komponen, env schema | Perilaku runtime, tampilan |
| Unit test (`node:test`) | Audit SEO Review, normalisasi kontak, pembentukan tautan, kontras token | DOM, browser, database |
| Build | Bundling, integrasi EmDash, route server, aset | Login passkey nyata, CDN |
| `audit:site` | Status, title/description/canonical/robots, OG, JSON-LD, heading, alt, ID, link, label dasar, header keamanan, sitemap, robots, admin surface | Visual, keyboard, screen reader, Core Web Vitals lapangan |
| `check:launch` | Secret/placeholder, site URL, kontak, DEMO, file sensitif terlacak, dokumen wajib | Isi database live, backup restore penuh |
| Pemeriksaan manual | Screenshot responsif, keyboard/focus CSS, kontras token | Uji screen reader formal |

## 3. Unit test saat ini

`npm test` menjalankan 33 test:

- **21 test SEO Review** (`src/lib/seo-review/audit.test.ts`): ekstraksi
  Portable Text, heading, tautan, alt, canonical, robots, skor, gate.
- **10 test inquiry** (`src/lib/inquiry/contact.test.ts`): nomor internasional,
  nomor lokal/terlalu pendek/terlalu panjang, email, konfigurasi kosong,
  encoding `wa.me`/`mailto:`.
- **2 test kontras** (`src/lib/design/contrast.test.ts`): pasangan warna teks
  memenuhi WCAG AA 4.5:1 dan focus indicator ≥ 3:1.

Test kontras membaca `src/styles/tokens.css`, jadi perubahan token yang
menurunkan kontras akan menggagalkan test.

## 4. Audit situs (`scripts/site-audit.mjs`)

Perintah:

```bash
npm run audit:site -- --base http://127.0.0.1:4328 --production
```

Yang diperiksa:

- Status route inti: `/`, `/products`, `/posts`, `/about`, detail produk,
  detail artikel, kategori/tag artikel, kategori produk, 404.
- Tepat satu `<title>`, meta description, dan canonical pada halaman
  indexable; canonical harus sama dengan origin+path.
- `noindex, nofollow` dan **tanpa canonical** pada 404.
- `og:type`, `og:url` konsisten dengan canonical, `lang="id"`.
- Satu `<h1>`, tidak ada lompatan level heading.
- Semua `<img>` punya atribut `alt`; tidak ada ID duplikat.
- Link punya nama aksesibel; `target="_blank"` memakai `rel="noopener"`;
  link internal unik dicek statusnya (tidak boleh 4xx/5xx).
- Input/button punya label/nama aksesibel (dengan pengecualian LiveSearch,
  lihat bagian 6).
- JSON-LD valid.
- Header `Content-Security-Policy`, `X-Content-Type-Options`,
  `Referrer-Policy`, `X-Frame-Options`.
- Sitemap: setiap URL mengembalikan 200 dan canonical-nya cocok.
- `robots.txt` memuat `Disallow: /_emdash/` dan `Sitemap:`.
- Mode `--production`: dev-bypass 403, API tanpa auth 401, admin redirect ke
  login.

Hasil Phase 7 pada build produksi: **PASS** untuk semua pemeriksaan di atas,
dengan 22 peringatan LiveSearch (dua input per halaman) dan 5 URL sitemap.

## 5. Pemeriksaan visual/responsif

Dilakukan dengan Firefox headless (`firefox --headless --window-size=...`)
pada:

- 390×844 (mobile)
- 768×1024 (tablet)
- 1280×900 (desktop)

Halaman: beranda, katalog, detail produk, daftar artikel, detail artikel,
kategori/tag, dan footer. Tidak ditemukan overflow horizontal, teks terpotong,
atau tombol keluar viewport pada screenshot. Ini bukan pengganti uji perangkat
nyata.

## 6. Aksesibilitas

Sudah diperiksa:

- Skip link ke `#main`, `lang="id"`, satu `h1`, urutan heading tanpa lompatan.
- Fokus keyboard memakai `:focus-visible` outline 3px; target tombol minimal
  2.75rem (44px).
- `prefers-reduced-motion: reduce` mematikan smooth scroll/transisi.
- Kontras token teks diuji otomatis; `--color-muted` digelapkan dari `#676d72`
  ke `#63696e` agar lulus 4.5:1 di atas `--color-surface-muted`.
- Semua gambar harus punya `alt` (saat ini halaman demo tidak memuat gambar
  nyata; placeholder berupa teks/CSS).
- `target="_blank"` memakai `rel="noopener noreferrer"`.

Keterbatasan:

- **LiveSearch EmDash tidak menyediakan label server-side.** Dua input
  pencarian (desktop & mobile) diberi `aria-label` oleh script klien. Tanpa
  JavaScript, pencarian memang tidak berfungsi. Ini tercatat sebagai warning
  di `audit:site`.
- Belum ada uji screen reader formal (NVDA/JAWS/VoiceOver) atau uji keyboard
  end-to-end di browser nyata pada fase ini.
- `style-src 'unsafe-inline'` masih diperlukan untuk scoped style Astro; ini
  bukan risiko script tetapi melemahkan perlindungan CSS injection.
- Tidak ada automated axe/Lighthouse di CI.

## 7. Performa

- Halaman publik hanya memuat CSS gabungan ~26 KB dan LiveSearch ~6 KB; script
  header di-inline dengan nonce (ukur build Phase 7).
- Aset `/_astro/*` memakai `Cache-Control: public, max-age=31536000, immutable`.
- Bundle admin > 500 kB tetap memicu warning Vite; aset admin tidak dimuat di
  halaman publik.
- Gambar memakai `Image` EmDash dengan layout constrained + responsive styles.
- Belum ada data Core Web Vitals lapangan; evaluasi setelah traffic tersedia.
- Belum ada pengukuran TTFB di luar lokal.

## 8. Uji produksi minimum sebelum rilis

1. `npm run typecheck` → 0 error.
2. `npm test` → semua lulus.
3. `npm run build` → sukses.
4. Jalankan `node ./dist/server/entry.mjs` dengan env produksi.
5. `npm run audit:site -- --base https://domain-final --production` → PASS.
6. `npm run check:launch` → PASS (bukan staging).
7. Login admin via passkey; buat draft, preview, publish, unpublish.
8. Cek CTA WhatsApp/email dengan nilai resmi; pastikan tidak ada tautan rusak.
9. Cek 404/500, sitemap, robots, redirect.
10. Backup database + upload; uji restore di lingkungan terpisah.

## 9. Menambah test

- Logika murni → `src/lib/<area>/*.test.ts` memakai `node:test` dan
  `node:assert/strict`.
- Jangan mengimpor `astro:env` atau modul browser di unit test; inject nilai
  lewat parameter.
- Perubahan route/SEO/header → tambahkan route ke `scripts/site-audit.mjs`.
- Perubahan token warna → perbarui `TEXT_PAIRS` di test kontras.
