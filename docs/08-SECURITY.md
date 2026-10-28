# Keamanan & Privasi

Status: Phase 7 (launch hardening), 2026-10-28.

Dokumen ini mencatat kontrol keamanan yang **sudah diverifikasi**, risiko yang
masih terbuka, dan hal yang wajib dilakukan sebelum situs dipublikasikan.
Jangan menganggap dokumen ini sebagai jaminan keamanan menyeluruh.

## 1. Lingkup & model ancaman

Aset yang dilindungi:

- Akun admin EmDash dan sesi login.
- Database SQLite (`data.db`) dan file upload (`uploads/`).
- Secret plugin (`EMDASH_ENCRYPTION_KEY`) dan nilai environment server.
- Konten draft/preview yang belum boleh dibaca publik.
- Integritas halaman publik (XSS, clickjacking, open redirect).

Di luar lingkup saat ini: pembayaran, data order, data pelanggan, form lead,
dan pengiriman email server-side. Fitur-fitur itu belum ada.

Ancaman utama yang relevan untuk fase ini:

- Akses tidak sah ke admin/API.
- XSS melalui konten CMS atau parameter URL.
- Clickjacking dan pemuatan resource pihak ketiga.
- Kebocoran secret/data lokal ke repository.
- Akses ke database/backup oleh pihak yang tidak berhak.
- Penyalahgunaan endpoint development.

## 2. Autentikasi & otorisasi admin

- Admin memakai sistem autentikasi EmDash (passkey). Tidak ada implementasi
  login kustom di aplikasi.
- `/_emdash/admin` tanpa sesi mengembalikan **302** ke halaman login.
- `GET /_emdash/api/content/posts` tanpa sesi mengembalikan **401
  `NOT_AUTHENTICATED`**.
- `POST /_emdash/api/content/posts` tanpa header `X-EmDash-Request: 1`
  mengembalikan **403 `CSRF_REJECTED`**; dengan header tersebut tetapi tanpa
  sesi tetap **401**.
- Endpoint development `/_emdash/api/auth/dev-bypass` dan
  `/_emdash/api/setup/dev-bypass` hanya aktif saat `astro dev`. Pada build
  produksi keduanya mengembalikan **403 `FORBIDDEN`** (diverifikasi).
- Cookie sesi Astro disetel dengan `httpOnly: true`, `sameSite: "lax"`, dan
  `secure: true` pada runtime produksi (dibaca dari implementasi sesi Astro
  yang terpasang). Login passkey penuh tidak diuji ulang di fase ini karena
  memerlukan browser/authenticator.
- Hak akses diperiksa di server oleh EmDash, bukan hanya dengan
  menyembunyikan tombol di UI.

**Aturan operasional:** jangan pernah menjalankan `npm run dev` pada interface
publik. Dev server membuka dev-bypass dan memakai cookie non-secure.

## 3. Header keamanan

EmDash memasang baseline pada semua respons:

- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()`
- `X-Frame-Options: SAMEORIGIN`
- CSP ketat khusus `/_emdash/*` (admin + API).

`src/middleware.ts` menambahkan untuk halaman publik:

- `Content-Security-Policy` dengan `default-src 'self'`, `script-src 'self'
  'nonce-…'`, `object-src 'none'`, `frame-ancestors 'self'`,
  `form-action 'self'`, `base-uri 'self'`, dan `connect-src 'self'`.
- Nonce per request untuk satu inline bootstrap header; script lain
  same-origin. `style-src` masih memakai `'unsafe-inline'` karena Astro
  merender scoped style sebagai blok `<style>` inline.
- **Hanya saat `astro dev`**, CSP menambah `'unsafe-eval'` pada `script-src`
  dan `ws:`/`wss:` pada `connect-src` agar Vite HMR tidak diblokir. Build
  produksi tidak memuat keduanya (diverifikasi dari header build produksi).
- `X-Frame-Options: SAMEORIGIN` untuk halaman publik.
- `Strict-Transport-Security: max-age=31536000; includeSubDomains` hanya bila
  request HTTPS (langsung atau `X-Forwarded-Proto: https`).

CSP admin EmDash sengaja tidak ditimpa agar panel admin tetap berfungsi.
CSP publik tidak memakai `report-uri`/`report-to`; pelanggaran hanya terlihat
di console browser.

## 4. XSS, HTML, dan tautan

- Tidak ada `set:html`, `innerHTML`, `dangerouslySetInnerHTML`, `<iframe>`,
  `<object>`, atau `<embed>` di kode aplikasi.
- Konten Portable Text dirender lewat `PortableText`/`PortableBlock` EmDash;
  atribut class memakai allowlist. URL menu disanitasi oleh EmDash
  (`sanitizeHref`).
- Semua teks CMS di-escape oleh Astro secara default.
- JSON-LD dibangun dari data situs/konten yang dikendalikan admin, bukan input
  pengguna.
- Tautan WhatsApp memakai `target="_blank"` + `rel="noopener noreferrer"`.
- Redirect publik memakai redirect manager EmDash; aturan seed hanya
  `/posts/welcome` → `/posts` (301). Tidak ada endpoint redirect buatan sendiri.
- Query string tidak dipantulkan ke HTML kecuali sebagai parameter paginasi
  yang di-encode.

## 5. Secret & data lokal

- `.env` di-gitignore; hanya `.env.example` yang dilacak.
- `EMDASH_ENCRYPTION_KEY` wajib ada dan bukan placeholder. Kunci yang hilang
  membuat secret plugin terenkripsi tidak bisa didekripsi.
- Nilai `INQUIRY_*` adalah konfigurasi server; tidak dikirim ke bundle client.
- `data.db`, `data.db-*`, `data.db.*`, dan `uploads/` di-gitignore.
- **Temuan Phase 7:** `data.db.bak-20261026` sebelumnya terlacak di Git dan
  sudah ada di remote `main`. File berisi user dev (`dev@emdash.local`) dan
  konten demo; tidak ada API token/kredensial aktif saat diperiksa. File sudah
  di-untrack secara lokal dan pola backup ditambahkan ke `.gitignore`.
- **Tindakan wajib sebelum repo dianggap aman/publik:** purge file tersebut
  dari seluruh history Git (termasuk remote), lalu rotasi
  `EMDASH_ENCRYPTION_KEY` dan sesi admin. Menghapus dari commit terbaru saja
  tidak menghapus data dari history.
- Backup database/upload harus disimpan di luar repository dan dienkripsi.

## 6. Privasi

- Tidak ada form inquiry, tabel lead, atau penyimpanan isi pesan. CTA membuka
  WhatsApp/email di aplikasi pengunjung.
- Tidak ada analytics, cookie iklan, atau tracking pihak ketiga.
- Log server hanya mencatat error/peringatan konfigurasi; tidak mencetak
  password, token, atau nilai kontak mentah. Nilai `INQUIRY_*` yang tidak valid
  dilaporkan sebagai pesan aturan, bukan nilainya.
- Halaman error 404/500 memakai pesan generik dan `noindex, nofollow`.
- Bila form/lead ditambahkan nanti, wajib ada validasi server, persetujuan
  privasi, pembatasan akses admin, dan kontrol spam/rate limit.

## 7. Upload & media

- Development memakai storage lokal `./uploads` (di-gitignore).
- EmDash menyajikan file media dengan `X-Content-Type-Options: nosniff` dan CSP
  sandbox untuk artefak yang tidak dipercaya.
- Belum ada pemindaian malware, pembatasan tipe file kustom, atau CDN.
- Untuk produksi, gunakan storage persisten dengan backup, batasi akses tulis,
  dan pertimbangkan object storage (S3/R2) bila target deployment mendukung.

## 8. Dependensi

- `npm audit` pada Phase 7 semula melaporkan **6 high** dari `zod@4.5.4`
  (GHSA-mrhx-c7xc-m3w5, memory exhaustion saat validasi collection besar).
- `package.json` memakai override `zod: 4.6.7`; setelah `npm install`,
  `npm audit` melaporkan **0 vulnerabilities** dan `npm ls zod` menunjukkan
  seluruh pohon memakai 4.6.7.
- Override ini harus ditinjau ulang saat EmDash merilis versi baru. Jalankan
  `npm audit` dan `npm run typecheck`/`npm test` setelah setiap upgrade.
- Tidak ada WAF, rate limiting aplikasi, atau monitoring keamanan terpusat.

## 9. Checklist keamanan produksi

- [ ] `EMDASH_ENCRYPTION_KEY` produksi dibuat baru, disimpan di secret manager,
      dan dibackup terpisah.
- [ ] `EMDASH_SITE_URL` = origin HTTPS final.
- [ ] HTTPS aktif di reverse proxy; HSTS terverifikasi.
- [ ] `/_emdash/admin` hanya dapat diakses lewat HTTPS dan (bila memungkinkan)
      dibatasi IP/VPN.
- [ ] Dev-bypass tidak dapat diakses (build produksi, bukan `astro dev`).
- [ ] Database dan upload berada di volume persisten dengan permission ketat.
- [ ] Backup terenkripsi diuji restore.
- [ ] History Git bersih dari `data.db*`; kunci dirotasi bila pernah terekspos.
- [ ] Data DEMO dihapus/diganti; `npm run check:launch` lulus.
- [ ] `npm audit` ditinjau; override zod masih sesuai.
- [ ] Log tidak memuat secret/data pribadi.
- [ ] Kebijakan privasi/kontak final tersedia bila form ditambahkan.

## 10. Pelaporan insiden

Jika secret atau database diduga bocor:

1. Nonaktifkan situs/admin atau batasi akses.
2. Rotasi `EMDASH_ENCRYPTION_KEY`, sesi admin, dan kredensial terkait.
3. Pulihkan dari backup yang bersih; periksa log akses.
4. Perbarui dependensi dan header bila penyebabnya diketahui.
5. Catat kronologi di `docs/CHANGELOG.md` tanpa menulis secret.
