# Keputusan Terbuka

Status: Phase 7, 2026-10-28.

Daftar hal yang **belum diputuskan atau datanya belum tersedia**. Sampai ada
keputusan resmi, proyek memakai default aman di kolom kanan. Jangan mengarang
nilai untuk mengisi kolom yang kosong.

| # | Topik | Status | Default aman saat ini | Dibutuhkan untuk |
|---|---|---|---|---|
| 1 | Domain produksi | Belum ada | Canonical mengikuti `EMDASH_SITE_URL`/request origin; tidak ada klaim domain | Canonical, OG, sitemap, Search Console |
| 2 | Nomor WhatsApp resmi | Belum ada | CTA WhatsApp tidak dirender | CTA produk aktif |
| 3 | Email kontak resmi | Belum ada | CTA email tidak dirender | CTA produk aktif |
| 4 | Produk, SKU, harga, stok, kategori, merek | Belum ada | Hanya produk DEMO; harga/stok tidak ditampilkan | Katalog produksi |
| 5 | Brand guideline (warna/font/logo) | Belum ada | Token provisional di `src/styles/tokens.css` | Identitas visual final |
| 6 | Foto/aset produk | Belum ada | Placeholder “Gambar belum tersedia” | Halaman produk final |
| 7 | Target deployment | Belum dikunci | Node standalone + SQLite + storage lokal | Infrastruktur, backup, biaya |
| 8 | Provider pembayaran | Belum ada | Tidak ada checkout/pembayaran | Phase 8 |
| 9 | Ongkir, pajak, retur | Belum ada | Tidak ada klaim kebijakan | Phase 8, halaman kebijakan |
| 10 | Halaman legal (privasi, syarat, retur) | Belum ada | Tidak ada form/lead; belum ada halaman legal final | Publikasi produksi |
| 11 | Kode verifikasi Search Console/Bing | Belum ada | Tidak ada file/kode verifikasi palsu | Submit sitemap |
| 12 | Analytics/tracking | Belum diputuskan | Tidak ada analytics/pihak ketiga | Pengukuran traffic |
| 13 | Locale konten EmDash | Masih `en` | Konten ditulis Indonesia; locale CMS tidak diubah | Konsistensi i18n |
| 14 | Data DEMO | Masih ada | Semua ditandai DEMO; `check:launch` gagal | Publikasi produksi |
| 15 | Backup/retensi | Belum diputuskan | Prosedur di `docs/10-DEPLOYMENT.md`; retensi contoh 7 harian + 4 mingguan | Operasi produksi |
| 16 | Admin users & role | Hanya user dev/lokal | Passkey admin; akses dibatasi | Operasi produksi |
| 17 | Storage media produksi | Belum diputuskan | Local `uploads/` | Skala/CDN/backup |
| 18 | Email pengiriman server-side | Belum ada | Tidak ada pengiriman email | Form/notifikasi |
| 19 | Git history `data.db` | Ada di history + remote | File di-untrack; history belum dipurge | Repo aman/publik |
| 20 | Rotasi `EMDASH_ENCRYPTION_KEY` | Belum | Kunci lokal ada; rotasi belum | Jika history dianggap bocor |
| 21 | Kebijakan privasi CTA | Belum final | CTA menyatakan situs tidak menyimpan pesan | Publikasi produksi |
| 22 | Nama merek/legal entity | Belum ada | “ASATECHID Commerce” (placeholder) | Footer/legal/SEO |

## Keputusan yang sudah diambil

Lihat `docs/DECISIONS.md` (ADR-001…ADR-029). Yang paling relevan untuk launch:

- ADR-026/027: CTA kontak config-driven, tanpa form/lead.
- ADR-028: CSP publik + nonce, HSTS, header keamanan.
- ADR-029: audit situs & launch check sebagai gerbang rilis.

## Cara menutup keputusan

1. Pemilik memberi nilai/keputusan resmi (bukan contoh).
2. Update `.env`/seed/konten, lalu jalankan `npm run check:launch`.
3. Jalankan `npm run audit:site -- --base <origin> --production`.
4. Catat keputusan di `docs/DECISIONS.md` dan perubahan di
   `docs/CHANGELOG.md`.
5. Hapus baris terkait dari tabel ini atau tandai selesai.
