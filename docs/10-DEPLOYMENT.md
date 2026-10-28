# Deployment, Environment & Backup

Status: Phase 7, 2026-10-28. **Target deployment belum dikunci.**

Konfigurasi yang benar-benar ada saat ini: **Astro 7 + adapter Node
(standalone) + EmDash + SQLite + storage lokal**. Cloudflare Workers + D1 + R2
masih kandidat, bukan keputusan final; konfigurasi tersebut belum diuji.

## 1. Prasyarat

- Node.js **22.23.4+** (versi lebih lama ditolak Astro/EmDash).
- npm 10+.
- Reverse proxy HTTPS (Caddy/Nginx) bila tidak memakai platform yang
  menyediakan TLS.
- Volume persisten untuk database dan upload.

## 2. Environment

| Variabel | Wajib | Contoh | Catatan |
|---|---|---|---|
| `EMDASH_ENCRYPTION_KEY` | Ya | hasil `npx emdash secrets generate` | Jangan commit. Backup terpisah. Tanpa kunci, secret plugin tidak bisa didekripsi. |
| `EMDASH_SITE_URL` | Produksi | `https://www.domain-final` | Origin tanpa path. Dipakai canonical, OG, sitemap, robots. |
| `INQUIRY_WHATSAPP_NUMBER` | Untuk CTA | `+62 8xx xxxx xxxx` | Format internasional, tanpa awalan `0`. |
| `INQUIRY_EMAIL` | Untuk CTA | `halo@domain-final` | Alamat resmi. |
| `HOST` | Opsional | `127.0.0.1` | Adapter Node; default biasanya `0.0.0.0`. |
| `PORT` | Opsional | `4321` | Port internal. |

`SITE_URL` juga dibaca sebagai fallback, tetapi gunakan `EMDASH_SITE_URL` agar
konsisten dengan dokumentasi EmDash.

Jangan mengisi nilai contoh ke production. `npm run check:launch` akan menolak
placeholder, origin non-HTTPS, dan kontak yang tidak valid.

## 3. Build & jalankan

```bash
npm ci
npm run typecheck
npm test
npm run build
HOST=127.0.0.1 PORT=4321 EMDASH_SITE_URL=https://www.domain-final \
  node ./dist/server/entry.mjs
```

`npm start` menjalankan `node ./dist/server/entry.mjs` dengan environment
proses saat ini.

Health check manual:

```bash
curl -I https://www.domain-final/
curl -I https://www.domain-final/_emdash/admin   # harus 302 ke login
curl -s https://www.domain-final/sitemap.xml
```

## 4. Reverse proxy & TLS

Aplikasi menetapkan HSTS hanya bila request HTTPS atau ada
`X-Forwarded-Proto: https`. Pastikan proxy mengirim header tersebut.

Contoh Nginx:

```nginx
server {
  listen 443 ssl http2;
  server_name www.domain-final;

  location / {
    proxy_pass http://127.0.0.1:4321;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Real-IP $remote_addr;
  }
}
```

Catatan:

- Jangan menambahkan header keamanan duplikat di proxy tanpa meninjau
  `src/middleware.ts`; CSP publik memakai nonce per request.
- Batasi akses `/_emdash/` bila memungkinkan (IP allowlist/VPN), selain tetap
  mengandalkan autentikasi EmDash.
- Jangan pernah menjalankan `npm run dev` di server publik.

## 5. Data persisten

Simpan di volume di luar direktori build:

| Path | Isi | Backup |
|---|---|---|
| `data.db` | Database SQLite | Ya, konsisten |
| `data.db-wal`, `data.db-shm` | State WAL | Ikut proses backup DB |
| `uploads/` | Media lokal | Ya |
| `.env` | Secret/env | Ya, terenkripsi |
| `.emdash/` | State migrasi/plugin | Ya bila ada konfigurasi lokal |
| `dist/` | Hasil build | Tidak; dapat dibangun ulang |

`data.db*` dan `uploads/` sudah di-gitignore. Jangan menyimpannya di repo.

## 6. Backup

Backup database **jangan** hanya `cp data.db` saat aplikasi menulis; WAL bisa
terlewat. Gunakan backup konsisten:

```bash
mkdir -p /var/backups/asatechid
STAMP=$(date -u +%Y%m%dT%H%M%SZ)

# Opsi A: sqlite3 CLI
sqlite3 data.db ".backup '/var/backups/asatechid/data-$STAMP.db'"

# Opsi B: Node 22 (tanpa sqlite3 CLI)
node --experimental-sqlite -e "
  const { DatabaseSync } = require('node:sqlite');
  const db = new DatabaseSync('data.db');
  db.exec(\"VACUUM INTO '/var/backups/asatechid/data-$STAMP.db'\");
  db.close();
"

tar -czf "/var/backups/asatechid/uploads-$STAMP.tar.gz" uploads
cp .env "/var/backups/asatechid/env-$STAMP.txt"   # enkripsi file ini
```

Verifikasi:

```bash
node --experimental-sqlite -e "
  const { DatabaseSync } = require('node:sqlite');
  const db = new DatabaseSync('/var/backups/asatechid/data-$STAMP.db', { readOnly: true });
  console.log(db.prepare('PRAGMA integrity_check').get());
  db.close();
"
```

Simpan minimal 7 backup harian + 4 mingguan (sesuaikan kebutuhan), terenkripsi,
di lokasi berbeda dari server. Backup tanpa kunci enkripsi tidak cukup untuk
memulihkan secret plugin.

## 7. Restore (sudah diuji)

Uji Phase 7 (2026-10-28): backup `VACUUM INTO` dibuat, `PRAGMA
integrity_check` = `ok`, lalu aplikasi dijalankan dari salinan database di
direktori terpisah; halaman `/products/produk-demo-alpha` mengembalikan **200**
dengan konten yang sama.

Langkah restore produksi:

```bash
# 1. Hentikan proses aplikasi
systemctl stop asatechid   # atau hentikan proses node

# 2. Amankan state lama
mv data.db "data.db.broken-$(date -u +%Y%m%dT%H%M%SZ)"
rm -f data.db-wal data.db-shm

# 3. Salin backup
cp /var/backups/asatechid/data-<STAMP>.db data.db

# 4. Pulihkan upload (opsional)
tar -xzf /var/backups/asatechid/uploads-<STAMP>.tar.gz

# 5. Jalankan ulang
HOST=127.0.0.1 PORT=4321 EMDASH_SITE_URL=https://www.domain-final \
  node ./dist/server/entry.mjs
```

Setelah restore:

- `npx emdash doctor` (butuh akses proyek) atau minimal cek halaman publik,
  admin, sitemap.
- Pastikan `data.db-wal`/`-shm` tidak tersisa dari state lama.
- Catat waktu restore dan versi backup.

## 8. Search Console & Bing

Kesiapan teknis sudah ada: `robots.txt`, `sitemap.xml` (index + sitemap per
koleksi), canonical, 404 noindex, redirect 301. Yang belum tersedia:

- Domain final.
- Kode verifikasi Google Search Console / Bing Webmaster.
- Akses DNS atau file verifikasi.

Langkah setelah data tersedia:

1. Verifikasi domain via DNS TXT (disarankan) atau file HTML di `public/`.
2. Submit `https://www.domain-final/sitemap.xml`.
3. Periksa laporan Pages/Coverage; pastikan tidak ada DEMO/404/noindex tak
   sengaja.
4. Pastikan `robots.txt` tidak memblokir halaman publik.
5. Ulangi untuk Bing Webmaster Tools bila diinginkan.

Jangan menambahkan file verifikasi palsu atau mengklaim situs terverifikasi
sebelum kode nyata tersedia.

## 9. Monitoring & log

- Kirim stdout/stderr ke log collector; jangan menulis secret/data pribadi.
- Pantau status 5xx, error database, dan kegagalan backup.
- Uptime check eksternal untuk `/` dan `/products`.
- Belum ada APM/analytics. Core Web Vitals lapangan dievaluasi setelah traffic.

## 10. Rollback

1. Simpan `dist/` versi sebelumnya atau build ulang dari commit yang diketahui.
2. Hentikan proses, restore database dari backup sebelum deploy bila migrasi
   mengubah data, lalu jalankan build sebelumnya.
3. Verifikasi halaman publik + admin.
4. Jangan rollback database tanpa backup; migrasi EmDash bisa maju satu arah.

## 11. Checklist produksi

- [ ] Target deployment final dipilih dan didokumentasikan.
- [ ] Node 22.23.4+ dan `npm ci` berhasil.
- [ ] `EMDASH_ENCRYPTION_KEY` produksi baru + backup terenkripsi.
- [ ] `EMDASH_SITE_URL` HTTPS final.
- [ ] `INQUIRY_*` resmi (atau CTA sengaja nonaktif dan disetujui).
- [ ] Data DEMO dihapus/diganti; `npm run check:launch` PASS.
- [ ] `npm run audit:site -- --base https://domain-final --production` PASS.
- [ ] Backup database + upload dibuat dan **restore diuji**.
- [ ] Admin passkey dibuat; akses admin dibatasi.
- [ ] Sitemap disubmit ke Search Console/Bing setelah verifikasi.
- [ ] Monitoring 5xx/uptime aktif.
- [ ] Rollback plan dan kontak penanggung jawab tersedia.

## 12. Cloudflare (belum divalidasi)

Cloudflare Workers + D1 + R2 adalah kandidat, tetapi konfigurasi saat ini
memakai adapter Node, SQLite lokal, dan storage lokal. Memindahkan ke
Cloudflare memerlukan:

- adapter/konfigurasi Workers yang sesuai versi Astro/EmDash,
- database D1 dan migrasi data,
- object storage R2 untuk media,
- penyesuaian backup/restore (D1 export, R2 versioning),
- pengujian ulang header, CSP, auth, dan sitemap.

Jangan menganggap konfigurasi Node saat ini otomatis berjalan di Cloudflare.
