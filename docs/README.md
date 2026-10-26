# ASATECHID Commerce — Agent Documentation Pack

Paket dokumentasi Markdown untuk membangun website kedua ASATECHID dengan Astro + EmDash. Paket ini ditujukan untuk AI coding agent di editor seperti OpenCode, Cursor, VS Code agents, atau alat sejenis.

## Cara menggunakan paket

1. Ekstrak folder ini ke root repository proyek baru atau salin `AGENTS.md` dan folder `docs/` ke root repository yang sudah ada.
2. Pastikan `AGENTS.md` berada di root agar agent membaca batasan dan proses kerja proyek.
3. Minta agent membaca `AGENTS.md`, `README.md`, lalu dokumen pada urutan di bagian *Urutan kerja*.
4. Minta agent menjalankan discovery dan membuat scaffold dari template resmi EmDash yang sesuai dengan deployment target; jangan mulai dengan menulis ulang CMS sendiri.
5. Jalankan proyek lokal, audit hasil, dan lanjutkan fase roadmap satu per satu.

## Dokumen dalam paket

| File | Tujuan |
|---|---|
| `AGENTS.md` | Aturan wajib untuk coding agent |
| `docs/00-PROJECT-BRIEF.md` | Ringkasan tujuan, konteks, asumsi dan batasan |
| `docs/01-PRD.md` | Requirement produk dan acceptance criteria |
| `docs/02-ARCHITECTURE.md` | Arsitektur Astro, EmDash, SEO dan commerce |
| `docs/03-CONTENT-MODEL.md` | Collection editorial/katalog dan relasi data |
| `docs/04-SEO-STRATEGY.md` | Strategi technical SEO, konten, dan tautan antar-situs |
| `docs/05-SEO-EDITOR.md` | Spesifikasi SEO editor seperti Yoast |
| `docs/06-COMMERCE.md` | Alur katalog, inquiry, dan evolusi checkout |
| `docs/07-UX-UI.md` | Design system dan aturan pengalaman pengguna |
| `docs/08-SECURITY.md` | Persyaratan keamanan dan privasi |
| `docs/09-TESTING.md` | Strategi QA dan pengujian |
| `docs/10-DEPLOYMENT.md` | Environment, deployment, backup, observability |
| `docs/11-ROADMAP.md` | Urutan fase implementasi |
| `docs/12-OPEN-DECISIONS.md` | Data yang belum dipastikan beserta default yang aman |
| `docs/13-TODO.md` | Checklist kerja dan acceptance per fase |
| `docs/14-DECISIONS.md` | Catatan keputusan teknis/ADR |
| `docs/15-CONTENT-PLAN.md` | Model editorial dan topic-cluster planning |
| `docs/16-REFERENCES.md` | Link sumber resmi dan kebijakan SEO |
| `docs/17-CHANGELOG.md` | Catatan perubahan proyek |

## Keputusan awal yang sengaja dibuat konservatif

- Bahasa konten awal: Bahasa Indonesia; bahasa lain ditambahkan hanya jika ada kebutuhan nyata.
- Semua kategori/produk masih generik sampai inventaris produk ASATECHID diberikan.
- Fase rilis awal mengutamakan katalog produk dan alur permintaan pembelian/penawaran melalui kanal kontak terkonfigurasi. Pembayaran online otomatis belum dianggap siap produksi sampai provider, fulfillment, dan aturan transaksi diputuskan.
- Astro menangani halaman publik dan rendering; EmDash mengelola editorial content/admin. Jangan menganggap EmDash otomatis menyediakan full e-commerce checkout.
- Cloudflare Workers + D1 + R2 adalah kandidat deployment, bukan keputusan final. Agent wajib memvalidasi template dan kebutuhan sebenarnya sebelum mengunci konfigurasi.
- Domain produksi, nomor WhatsApp, brand colors/font, daftar produk, payment gateway, ongkir, pajak, dan kebijakan retur belum diketahui. Jangan mengarang data tersebut.

## Definition of Done proyek awal

- Situs bisa dijalankan lokal dengan instruksi yang jelas.
- Admin bisa membuat draft, preview, mengatur metadata SEO, dan memublikasikan konten.
- Halaman kategori, produk, blog, pencarian, navigasi, kontak, kebijakan, serta halaman 404 berfungsi.
- SEO metadata, canonical, sitemap, robots, structured data yang sesuai, dan redirect dasar telah diverifikasi.
- Form/inquiry tidak mengklaim pesanan atau pembayaran berhasil sebelum proses benar-benar terjadi.
- Tes relevan, build, keamanan dasar, dan panduan deployment telah diperiksa.

## Referensi

Lihat `docs/16-REFERENCES.md` untuk dokumentasi resmi EmDash, Astro, Google Search Central, dan panduan e-commerce structured data.
