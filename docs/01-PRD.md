# 01 — Product Requirements Document (PRD)

## 1. Visi produk

Membangun website katalog dan commerce ASATECHID yang cepat, kredibel, mudah dikelola, dan memiliki pusat konten edukasi yang mendorong keputusan pembelian. Astro menangani pengalaman publik; EmDash menyediakan administrasi konten.

## 2. User stories

### Pengunjung
- Sebagai pengunjung, saya dapat menemukan produk melalui navigasi kategori, pencarian, dan filter yang masuk akal.
- Saya dapat melihat halaman detail berisi informasi, gambar, spesifikasi, harga/status yang valid, dan langkah berikutnya untuk membeli atau meminta penawaran.
- Saya dapat membaca artikel, memahami penulis/tanggal, menavigasi heading, dan membuka produk atau panduan terkait.
- Saya dapat menghubungi bisnis melalui kanal kontak yang benar-benar dikonfigurasi.
- Saya mendapat halaman 404 yang berguna ketika URL tidak tersedia.

### Admin/editor
- Saya dapat login ke panel admin yang dilindungi autentikasi.
- Saya dapat membuat dan mengedit draft artikel/halaman, melihat preview, dan memublikasikan sesuai izin.
- Saya dapat mengatur SEO title, meta description, gambar sosial, canonical, dan noindex sesuai dukungan EmDash.
- Saya melihat simulasi SERP dan checklist SEO tambahan sebelum publish.
- Saya dapat mengelola kategori, merek, produk, gambar, spesifikasi, dan status katalog.
- Saya dapat meninjau permintaan pembelian/penawaran yang masuk bila fitur inquiry digunakan.
- Saya dapat mengoreksi typo/slug dan membuat redirect apabila URL publik berubah.

## 3. Ruang lingkup MVP

### Termasuk
- Beranda dengan hero/CTA, kategori produk, pilihan produk, dan konten editorial.
- Halaman daftar produk dan kategori.
- Detail produk dengan image gallery, deskripsi, spesifikasi, kondisi ketersediaan, CTA pembelian/inquiry, related products.
- Halaman blog, daftar kategori/tag yang relevan, detail artikel, artikel terkait, penulis, tanggal publikasi dan pembaruan bila tersedia.
- Halaman panduan dan halaman kepercayaan: Tentang, Kontak, Pengiriman, Pengembalian/Garansi jika kebijakannya telah disediakan, Privasi, Ketentuan.
- Pencarian katalog dasar dengan empty state yang jelas.
- Admin EmDash untuk konten, media, metadata, preview, drafts/revisions, dan publishing.
- SEO technical essentials: metadata, canonical, sitemap, robots.txt, structured data yang sesuai, redirect dan 404.
- SEO review UI tambahan: SERP preview, audit checklist, penjelasan warning, gate publish berdasarkan aturan wajib yang ditetapkan.
- Form/inquiry atau CTA WhatsApp/kanal kontak dari konfigurasi, bukan hard-coded.
- Responsive design dan basic accessibility.
- Setup tests, environment config, security checks, deployment guide, backups.

### Di luar MVP sampai keputusan disepakati
- Pembayaran online produksi.
- Perhitungan ongkir live dan integrasi kurir.
- Sinkronisasi stok dari sistem eksternal/ERP.
- Akun pelanggan, loyalty, kupon, ulasan publik, multi-warehouse.
- Marketplace/feed integration dan multi-vendor.
- Multi-bahasa.
- Fitur otomatis AI untuk membuat dan memublikasikan artikel.

## 4. E-commerce release strategy

**Default MVP:** storefront/katalog dengan harga/status produk jika datanya tersedia, serta CTA beli/minta penawaran yang membuka WhatsApp atau mengirim inquiry ke endpoint yang benar-benar dikonfigurasi. Tidak boleh ada UI checkout palsu.

**Release 2:** cart, checkout, order management, payment gateway, ongkir, dan notifikasi setelah owner memberikan provider, detail fulfillment, dan kebijakan transaksi. Implementasi payment harus memiliki webhook verification dan state machine yang benar.

Jika owner secara eksplisit meminta transaksi penuh sejak rilis pertama, agent harus menyelesaikan `docs/12-OPEN-DECISIONS.md` terlebih dahulu dan tidak boleh menebak penyedia pembayaran atau aturan pengiriman.

## 5. Persyaratan fungsional

### F-01 Navigation
- Header desktop dan mobile, menu kategori, tautan blog/panduan, CTA kontak/keranjang sesuai fase.
- Semua tautan harus valid dan dapat diakses dengan keyboard.

### F-02 Product catalogue
- Daftar produk memiliki pagination atau pola load-more yang crawlable.
- Kategori dan filter utama punya URL yang stabil jika memang berguna sebagai landing page.
- Filter kombinasi yang tidak layak diindeks tidak menghasilkan ratusan URL indexable.
- Product card menampilkan gambar, nama, kategori/brand jika ada, ringkasan, dan harga/status hanya bila valid.

### F-03 Product detail
- Setiap produk punya slug unik, title, deskripsi faktual, image alt, kategori, dan metadata SEO.
- Harga dan stok tidak boleh dibuat-buat. Jika tidak tersedia, gunakan CTA untuk meminta informasi.
- Structured data Product/Offer hanya dirender ketika data dan jenis halaman memenuhi syarat.

### F-04 Editorial
- Draft, preview, revisions, publish dan scheduled publishing menggunakan kemampuan EmDash jika tersedia di versi scaffold.
- Artikel mempunyai judul, slug, body, penulis, kategori/taxonomy bila relevan, tanggal, featured image dan alt text.
- Hindari artikel yang dibuat hanya untuk mengulang kata kunci/backlink.

### F-05 SEO fields & editor
- Gunakan SEO panel EmDash bawaan untuk metadata yang tersedia.
- SERP preview merespons perubahan title/description/URL secara langsung dan jelas ditandai sebagai simulasi.
- Checklist mendeteksi metadata kosong, judul terlalu panjang/pendek sebagai saran, H1/heading, konten kosong, tautan internal, gambar tanpa alt, dan broken URL yang dapat diperiksa secara lokal.
- SEO score adalah indikator kualitas internal, bukan skor Google atau prediksi ranking.
- Publish gate hanya memblokir isu yang ditetapkan wajib; panjang title/description, keyword density, atau skor tidak boleh dijadikan gate absolut secara membabi buta.

### F-06 Search
- Search katalog hanya menampilkan produk publik.
- Sanitasi input dan batas hasil; empty/error state tersedia.
- Query string tidak otomatis membentuk landing page SEO indexable.

### F-07 Inquiry
- CTA memuat produk/slug atau reference yang jelas agar admin tahu konteks permintaan.
- Nomor/URL tujuan dibaca dari environment/site setting; jika belum diisi, tampilkan kontak alternatif yang valid atau nonaktifkan CTA dengan pesan jelas.
- Bila disimpan sebagai lead, terapkan spam controls, persetujuan/pemberitahuan privasi, validasi server, dan akses admin terbatas.

### F-08 SEO rendering
- HTML server-rendered untuk halaman konten penting.
- Title, description, canonical, Open Graph, Twitter card dan robots directives konsisten.
- Tidak ada dua sumber yang menghasilkan tag title/description/canonical ganda.
- Sitemap hanya menyertakan URL publik canonical yang layak diindeks.

### F-09 Admin & permissions
- Gunakan sistem autentikasi/otorisasi EmDash yang didokumentasikan untuk versi terpasang.
- Pengunjung publik tidak dapat mengakses draft, data order, leads pribadi atau API admin.
- Hak akses diperiksa server-side; menyembunyikan tombol di UI tidak dianggap kontrol akses.

## 6. Non-functional requirements

- Mobile-first; dukung lebar ponsel, tablet dan desktop.
- Fokus pada HTML yang semantik dan rendering sisi server/on-demand sesuai kebutuhan.
- TypeScript strict dan no console errors yang diketahui pada alur inti.
- Basic target performa: tidak mengirim JavaScript besar tanpa alasan; optimalkan gambar; hindari layout shift; evaluasi Core Web Vitals pada data lapangan setelah traffic tersedia.
- WCAG 2.2 AA sebagai target desain aksesibilitas yang realistis, termasuk contrast, keyboard, focus, label form, alt text, dan reduced motion.
- Error message aman, mudah dimengerti, tidak membocorkan detail internal.
- Logging tidak mencatat password, token, payment data, atau data personal yang tidak diperlukan.
- Backup dan recovery harus terdokumentasi serta pernah diuji sebelum production.

## 7. Acceptance criteria MVP

1. Fresh install berhasil mengikuti README dan perintah CLI resmi yang cocok.
2. Build production sukses serta pemeriksaan tipe/lint/test terkait lulus.
3. Admin dapat login, membuat draft artikel, preview, mengatur SEO, dan publish.
4. Artikel dan produk publik tampil pada route canonical yang stabil.
5. Update konten CMS dapat terlihat sesuai rendering/caching strategy tanpa prosedur manual yang tidak terdokumentasi.
6. Metadata, sitemap, robots, JSON-LD dan redirect telah diuji pada output actual.
7. Produk tanpa harga/stok tetap memiliki UI valid dan tidak mengarang informasi.
8. Inquiry/CTA berjalan hanya jika konfigurasi kontak ada; tidak ada transaksi palsu.
9. Tidak ada credential default/insecure demo login yang masuk production.
10. README/docs berisi setup, env, test, deployment, backup, serta keputusan yang belum terselesaikan.
