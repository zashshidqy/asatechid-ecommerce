# AGENTS.md — Instruksi Utama AI Coding Agent

Dokumen ini adalah aturan kerja utama untuk seluruh agent yang mengerjakan proyek ASATECHID Commerce. Baca file ini sebelum mengubah kode apa pun.

## 1. Konteks proyek

Bangun website kedua ASATECHID berupa storefront/katalog produk dan pusat konten edukasi. Website harus memiliki tujuan bisnis mandiri; tautan ke website utama ASATECHID hanya ditambahkan saat relevan bagi pengguna. Website tidak boleh dibangun sebagai doorway site, content farm, atau jaringan backlink manipulatif.

Stack target: Astro + TypeScript + EmDash CMS. Desain harus orisinal, modern, ringan, rapi, dan berorientasi konversi; situs Rabit hanya referensi kategori/jenis pengalaman, bukan untuk disalin.

## 2. Urutan baca wajib

1. `README.md`
2. `docs/00-PROJECT-BRIEF.md`
3. `docs/01-PRD.md`
4. `docs/02-ARCHITECTURE.md`
5. Dokumen relevan dari `docs/03` sampai `docs/15`
6. Dokumentasi resmi EmDash/Astro terkini sebelum memakai API, konfigurasi, integrasi, atau plugin.

## 3. Aturan implementasi

- **Periksa repository terlebih dahulu.** Jangan menimpa implementasi atau scaffold yang sudah ada tanpa memeriksa keadaan aktual.
- Untuk proyek baru, gunakan jalur starter resmi EmDash yang sesuai dengan target deployment, misalnya `npm create emdash@latest`. Ikuti opsi CLI aktual; jangan mengasumsikan template atau versi tanpa mengeceknya.
- Gunakan TypeScript dan pertahankan pemeriksaan tipe yang ketat. Hindari `any` kecuali ada alasan teknis yang terdokumentasi.
- Jangan mengarang API, nama fungsi, konfigurasi, field CMS, adapter, plugin, atau perintah CLI. Periksa dokumentasi resmi dan versi dependency yang benar-benar terpasang.
- Gunakan built-in EmDash untuk collections, editorial workflow, media, preview, SEO metadata, sitemap, robots, dan redirects jika memenuhi kebutuhan. Jangan membangun ulang fitur bawaan tanpa alasan.
- SERP preview dan SEO audit ala Yoast adalah fitur tambahan yang perlu diverifikasi/diimplementasikan terpisah. Jangan menyatakan fitur mockup sudah terhubung ke data sungguhan.
- Jangan memodifikasi tabel internal EmDash dengan SQL langsung. Untuk data commerce transaksional, gunakan lapisan repository dan schema/migration yang eksplisit; pisahkan database commerce jika dibutuhkan atau jika dokumentasi adapter tidak menjamin integrasi aman.
- Jangan memasukkan secret/token/password ke repository, source frontend, screenshot, seed, atau log.
- Jangan mengimplementasikan pembayaran produksi menggunakan mock yang seolah-olah nyata. Jika provider pembayaran belum dipilih, gunakan alur inquiry/WhatsApp yang dikonfigurasi dan dokumentasikan batasannya.
- Jangan hard-code nomor WhatsApp, domain produksi, harga, SKU, stok, data pelanggan, kategori final, atau informasi bisnis yang belum diberikan.
- Data contoh harus jelas ditandai DEMO/SEED dan tidak boleh terlihat seolah-olah data produk sungguhan di production.
- Jangan mengimpor atau menyalin konten, foto, deskripsi, desain, maupun brand asset dari Rabit atau website lain tanpa hak.
- Jangan melakukan strategi SEO spam: doorway pages, keyword stuffing, halaman massal tanpa nilai, tautan footer lintas situs untuk memanipulasi ranking, atau backlink berbayar yang tidak dikualifikasi.
- Semua halaman publik harus responsif, aksesibel, dan bisa digunakan dengan keyboard.
- Setiap interaksi UI yang tampil harus benar-benar berfungsi; jangan meninggalkan tombol palsu atau placeholder aksi yang tidak dijelaskan.

## 4. Cara bekerja

Untuk setiap fase:

1. Baca tujuan, acceptance criteria, dan dependency.
2. Tulis rencana singkat serta daftar file yang akan disentuh.
3. Implementasikan satu irisan fitur yang kecil dan lengkap.
4. Jalankan formatter/linter, TypeScript check, build, dan tes terkait sesuai script yang tersedia.
5. Periksa hasil aktual; jangan menyimpulkan tes sukses jika tidak dijalankan.
6. Perbarui `docs/TODO.md`, `docs/CHANGELOG.md`, dan `docs/DECISIONS.md` jika relevan.
7. Laporkan file yang berubah, perintah yang dijalankan, hasil tes, keterbatasan, dan keputusan yang masih dibutuhkan.

Jangan mengerjakan semua fase sekaligus jika hal itu meningkatkan risiko. Dahulukan vertical slice yang bisa dijalankan dan diuji.

## 5. Aturan desain

- Utamakan layout editorial-commerce yang bersih, tajam, premium, dan mudah dipindai.
- Jangan gunakan glassmorphism, neon berlebihan, gradien dekoratif acak, animasi berat, atau pola generik yang tampak seperti template AI.
- Gunakan token desain terpusat; hindari nilai warna/spacing duplikat di banyak komponen.
- Jangan memilih warna atau font yang diklaim sebagai identitas resmi jika brand guideline ASATECHID belum tersedia. Gunakan token provisional yang dapat diganti.
- Hormati `prefers-reduced-motion`, fokus keyboard, contrast, dan ukuran target sentuh.

## 6. Definition of Done

Pekerjaan belum dianggap selesai hanya karena kode dibuat. Minimal:

- Acceptance criteria tugas terpenuhi.
- Error TypeScript/build yang disebabkan perubahan tidak ada.
- Tes relevan lulus atau kegagalan dijelaskan.
- Metadata dasar, loading/empty/error states, responsivitas, dan aksesibilitas diperiksa untuk fitur terkait.
- Tidak ada secret atau data pribadi yang terekspos.
- Dokumentasi dan TODO diperbarui.
- Laporan akhir jujur tentang apa yang sudah dan belum diverifikasi.
