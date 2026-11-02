DESIGN.md — Reference UI System dari Vins Teknik
> **Jenis dokumen:** Design system, component inventory, layout blueprint, interaction specification, dan aturan implementasi frontend.
>
> **Website referensi:** https://vinsteknik.id  
> **Tanggal audit:** 2 November 2026  
> **Tujuan:** Mengambil pola UI/UX dan struktur komponen dari website referensi untuk **membangun desain website milik sendiri**—bukan menyalin source code, branding, ilustrasi, atau aset berlisensi milik Vins Teknik.
---
0. Cara Membaca Dokumen dan Tingkat Kepastian
Dokumen ini disusun dengan menginspeksi konten publik yang dapat diekstraksi dari beberapa URL website referensi. Ada batasan: hasil ekstraksi web tidak memberikan screenshot desktop/mobile, stylesheet CSS, hasil `getComputedStyle()`, font asli, atau pengujian klik/interaksi langsung.
[TERVERIFIKASI] = keberadaan atau konten komponen terlihat jelas pada halaman yang diperiksa.
[TERINDIKASI] = muncul dari konteks atau representasi HTML yang diekstraksi, tetapi tampilan atau perilakunya belum diverifikasi secara langsung.
[REKOMENDASI] = aturan praktis yang kami rancang untuk implementasi yang konsisten. Bukan klaim bahwa ini nilai asli Vins Teknik.
[KONDISIONAL] = ditemukan pada varian/hasil indeks lain; belum tentu sedang aktif di homepage hari ini.
Penting: Semua angka warna HEX, ukuran, tinggi header, radius, bayangan, breakpoint, animasi, dan font di bagian design tokens adalah baseline rekomendasi, bukan pixel-perfect extraction. Untuk mencapai hasil 1:1, bandingkan dengan screenshot asli di browser dan koreksi token.
1. DNA Desain dan Pola UX
Kategori produk: ecommerce / online retail alat teknik, power tools, dan kebutuhan industri.
Pola utama yang terlihat [TERVERIFIKASI]:
Product-first: pengguna melihat merek, kategori, promo, produk baru, rekomendasi, dan semua produk.
Dense catalog: banyak kartu produk dapat ditelusuri dalam satu halaman; data paling menonjol adalah nama, harga, diskon, rating, dan jumlah terjual.
Multi-entry discovery: pengguna dapat masuk melalui merek, kategori, etalase, promosi, atau pencarian.
Commerce-oriented detail: halaman produk berisi galeri foto, rating, harga, hadiah promo, detail barang, review, stok, kuantitas, dan CTA pembelian.
Trust & fulfillment: metode pembayaran, kurir, alamat perusahaan, informasi pengembalian, pelacakan resi, dan layanan pelanggan tersedia.
Reusable sections: produk baru, rekomendasi, promo, dan katalog memakai pola produk yang mirip.
Prinsip untuk website baru [REKOMENDASI]
Prioritaskan hierarki informasi: kategori → produk → harga → tindakan.
Gunakan maksimal 1 gaya kartu utama agar seluruh katalog terasa konsisten.
Jangan membuat setiap komponen menggunakan warna mencolok; penekanan utama ada pada harga, diskon, active filter, dan CTA.
Struktur UI boleh mengikuti referensi, tetapi gunakan identitas brand, foto, konten, dan logo sendiri.
Hindari meniru kekurangan informasi di halaman sumber; utamakan UX yang aksesibel dan rapi.
---
2. Inventaris Komponen UI
Tabel berikut adalah daftar tipe komponen, bukan daftar semua ribuan item produk/brand/kategori.
Kode	Komponen	Terlihat di	Status	Prioritas
C01	Global site header / navigasi utama	Semua halaman	[TERINDIKASI]	P0
C02	Identitas brand / logo pada header	Site-wide	[TERINDIKASI]	P0
C03	Global product search	Pencarian/katalog	[TERINDIKASI]	P0
C04	Category menu / mega-navigation	Beranda/katalog	[TERINDIKASI]	P1
C05	Tombol/ikon aksi akun, wishlist, cart	Detail produk	[TERINDIKASI]	P1
C06	Download App trigger	Semua halaman	[TERVERIFIKASI]	P2
C07	Download App popover/dialog	Semua halaman	[TERVERIFIKASI]	P2
C08	QR code dan marketplace app badges	Download App	[TERVERIFIKASI]	P2
C09	Hero / promotional banner	Beranda	[TERINDIKASI]	P2
C10	Brand logo strip / grid	Beranda	[TERVERIFIKASI]	P0
C11	Featured category grid	Beranda	[TERVERIFIKASI]	P0
C12	Section title + Lihat Semua	Beranda/promo	[TERVERIFIKASI]	P0
C13	Promotion group/card	Beranda	[TERVERIFIKASI]	P1
C14	Promotion metadata (hadiah, minimum, berlaku)	Promo	[TERVERIFIKASI]	P1
C15	Product grid	Beranda/kategori/pencarian	[TERVERIFIKASI]	P0
C16	Product card	Banyak halaman	[TERVERIFIKASI]	P0
C17	Product image / aspect ratio box	Product card/detail	[TERVERIFIKASI]	P0
C18	Product name link	Product card	[TERVERIFIKASI]	P0
C19	Primary current price	Product card/detail	[TERVERIFIKASI]	P0
C20	Original price (strikethrough)	Product card/detail	[TERVERIFIKASI]	P0
C21	Discount percent badge	Product card/detail	[TERVERIFIKASI]	P0
C22	Rating & units sold	Product card/detail	[TERVERIFIKASI]	P0
C23	New arrivals section	Beranda	[TERVERIFIKASI]	P0
C24	Recommendations section	Beranda	[TERVERIFIKASI]	P0
C25	All products section	Beranda	[TERVERIFIKASI]	P0
C26	Brand / Etalase filter	Beranda/kategori	[TERVERIFIKASI]	P0
C27	Brand filter selector/search	Etalase	[TERVERIFIKASI]	P1
C28	Category filter	Katalog/pencarian	[TERVERIFIKASI]	P0
C29	Selected filter state	Etalase/kategori	[TERINDIKASI]	P0
C30	Items-per-page selector	Katalog/pencarian	[TERVERIFIKASI]	P1
C31	Pagination	Katalog/pencarian	[TERVERIFIKASI]	P0
C32	Product image gallery & counter	Detail	[TERVERIFIKASI]	P0
C33	Wishlist action	Detail	[TERVERIFIKASI]	P1
C34	Product share action & share dialog	Detail	[TERVERIFIKASI]	P1
C35	Chat action	Detail	[TERVERIFIKASI]	P2
C36	Product heading + rating summary	Detail	[TERVERIFIKASI]	P0
C37	Free gift / promotional attachment	Detail	[TERVERIFIKASI]	P1
C38	Product specification/key-value rows	Detail	[TERVERIFIKASI]	P0
C39	Expandable long product description	Detail	[TERVERIFIKASI]	P1
C40	Product reviews / empty state	Detail	[TERVERIFIKASI]	P1
C41	Stock / availability indicator	Detail	[TERVERIFIKASI]	P0
C42	Quantity stepper	Detail	[TERVERIFIKASI]	P0
C43	Add to cart CTA	Detail	[TERVERIFIKASI]	P0
C44	Buy now CTA	Detail	[TERVERIFIKASI]	P0
C45	Address entry modal/form	Global/detail	[TERVERIFIKASI]	P2
C46	Promo detail page and included products	Promo	[TERVERIFIKASI]	P1
C47	Flash sale timer	Varian beranda terindeks	[KONDISIONAL]	P2
C48	Low-stock / urgency label	Flash sale	[KONDISIONAL]	P2
C49	Search results page	`/pencarian`	[TERVERIFIKASI]	P0
C50	Brand listing page	`/merek`	[TERVERIFIKASI]	P1
C51	Category listing page	`/produk-kategori/`	[TERVERIFIKASI]	P0
C52	About / company profile	`/tentang-kami`	[TERVERIFIKASI]	P1
C53	Shipping tracking form	`/cek-resi`	[TERVERIFIKASI]	P1
C54	Company contact block	Footer	[TERVERIFIKASI]	P0
C55	Footer navigation/help/policies	Footer	[TERVERIFIKASI]	P0
C56	Payment method logo group	Footer	[TERVERIFIKASI]	P1
C57	Courier/delivery logo group	Footer	[TERVERIFIKASI]	P1
C58	App badges in footer	Footer pada detail	[TERVERIFIKASI]	P2
C59	Copyright footer row	Footer	[TERVERIFIKASI]	P0
Catatan: Tidak ada bukti yang cukup untuk mengklaim struktur login/register, checkout lengkap, menu cart, tipe sorting, sticky header, sticky purchase card, breakpoint asli, ataupun efek hover persisnya. Jika diperlukan, itu harus dianggap fitur tambahan yang dirancang, bukan hasil ekstraksi situs referensi.
---
3. Arsitektur Halaman (Information Architecture)
```text
App Shell
├── Global Header / Search / Navigation
├── Optional App Download Trigger + Popover
├── Route Content
│   ├── Homepage (/)
│   │   ├── [Opsional] Hero Banner
│   │   ├── Brand Strip / Brand Grid
│   │   ├── Featured Category Grid
│   │   ├── Promotions
│   │   ├── [Kondisional] Flash Sale
│   │   ├── New Arrivals
│   │   ├── Recommended Products
│   │   └── All Products + Filters + Pagination
│   ├── Category Listing (/produk-kategori/[slug])
│   │   ├── Title
│   │   ├── Brand/Etalase Filter
│   │   ├── Category Filter
│   │   └── Product Grid + Items Per Page + Pagination
│   ├── Categories Directory (/produk-kategori/)
│   ├── Brand Directory (/merek)
│   ├── Search Results (/pencarian)
│   ├── Product Detail (/produk/[slug])
│   │   ├── Product Gallery
│   │   ├── Product Header / Share / Wishlist / Chat
│   │   ├── Product Pricing / Gift Promotion
│   │   ├── Specs + Expandable Description
│   │   ├── Reviews
│   │   └── Stock + Quantity + Add to Cart / Buy Now
│   ├── Promotion Detail (/promo/[id])
│   ├── About Us (/tentang-kami)
│   └── Shipment Tracking (/cek-resi)
├── Address Form/Modal
└── Global Footer
    ├── Business/contact details
    ├── Company/help/legal links
    ├── Social links
    ├── Payment providers
    ├── Delivery partners
    └── Copyright
```
Urutan homepage yang pasti terlihat dalam ekstraksi: `Brands → Kategori Pilihan → Promosi → Produk Terbaru → Produk Rekomendasi → Semua Produk`. `Flash Sale` ditemukan pada representasi beranda lain dan hanya ditampilkan jika datanya aktif. Hero banner tidak boleh dianggap pasti ada hanya karena umum pada ecommerce.
---
4. Design Tokens — Baseline Implementasi [REKOMENDASI]
4.1 Palet warna
Warna asli Vins Teknik tidak dapat diukur dari hasil pembacaan halaman. Gunakan token semantik ini agar mudah di-rebrand. Nilai di kanan adalah contoh netral-modern, bukan hasil sampling warna Vins Teknik.
Token	Nilai baseline	Tujuan
`--color-brand-primary`	`#E4572E`	CTA utama, aktif, link aksen (ganti dengan brand website sendiri)
`--color-brand-primary-hover`	`#C74723`	Hover CTA
`--color-bg-page`	`#F8FAFC`	Background halaman
`--color-bg-surface`	`#FFFFFF`	Card, navbar, dialog
`--color-bg-subtle`	`#F1F5F9`	Sidebar, control sekunder
`--color-text-primary`	`#0F172A`	Heading, harga, teks utama
`--color-text-secondary`	`#475569`	Metadata
`--color-text-muted`	`#94A3B8`	Placeholder, harga lama
`--color-border-default`	`#E2E8F0`	Border kartu/input
`--color-success`	`#15803D`	Ready stock/sukses
`--color-warning`	`#D97706`	Hampir habis
`--color-danger`	`#DC2626`	Error/potongan harga/urgensi
`--color-focus-ring`	`#2563EB`	Indikator aksesibilitas keyboard
Aturan: jangan gunakan banyak warna aksen berbeda untuk CTA yang fungsi dan prioritasnya sama. Jika ada warna promosi khusus, hanya terapkan pada banner/badge promosi.
4.2 Typography
Font yang digunakan situs referensi belum teridentifikasi secara teknis. Untuk implementasi frontend gunakan `Inter` atau `Plus Jakarta Sans` sebagai rekomendasi, dengan fallback `system-ui, sans-serif`.
Style	Desktop	Mobile	Weight	Fungsi
Display	36–40px	28–32px	700	Hero opsional
H1	28–32px	24–28px	700	Judul halaman/detail
H2	22–24px	20–22px	700	Judul section
H3	18–20px	17–18px	600	Judul sub-section
Body	14–16px	14px	400	Deskripsi dan konten
Product title	13–14px	12–14px	500	Nama produk 2–3 baris
Price large	26–32px	22–28px	700	Harga di detail
Price card	16–18px	15–17px	700	Harga di kartu
Metadata	11–13px	11–12px	400	Rating, jumlah terjual
Button	14px	14px	600	CTA
Line height heading: `1.2–1.35`; body: `1.5–1.65`.
Truncate nama produk dengan `line-clamp: 2` atau `3`; jangan memaksa tinggi kartu yang berbeda-beda.
Harga wajib memakai tabular numerals: `font-variant-numeric: tabular-nums`.
Format rupiah sesuai locale `id-ID`: `Rp 1.250.000`.
4.3 Grid, layout, spacing, radius
Token	Baseline	Keterangan
`--container-max`	`1280px`	Lebar maksimum konten
`--page-gutter-desktop`	`24px`	Ruang kiri-kanan
`--page-gutter-mobile`	`16px`	Ruang mobile
`--section-gap`	`40–56px`	Jarak antar section
`--grid-gap`	`12–20px`	Antar produk
`--spacing-scale`	`4, 8, 12, 16, 24, 32, 48, 64px`	Skala 4/8 pt
`--radius-sm`	`6px`	Badge/input kecil
`--radius-md`	`10px`	Button/kartu
`--radius-lg`	`16px`	Promo/modal
`--radius-pill`	`9999px`	Chip/filter tertentu
`--shadow-card`	`0 2px 12px rgb(15 23 42 / 0.05)`	Elevasi lembut
`--header-height`	`72px`	Placeholder, ukur ulang
Batasan: tidak satu pun angka di tabel ini mengklaim ukuran asli di situs sumber.
4.4 Breakpoints [REKOMENDASI]
`sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`.
Product grid: mobile `<640px` = 2 kolom; tablet `640–1023px` = 3 kolom; desktop `>=1024px` = 4–5 kolom berdasarkan lebar aktual.
Brand/kategori: 2–3 kolom mobile, 4–6 tablet, 6–10 desktop jika tile ringkas.
Filter: sidebar pada desktop; drawer pada mobile.
Detail produk: 1 kolom mobile, galeri + informasi (+ card pembelian jika perlu) pada desktop.
Tidak boleh ada horizontal scrolling halaman akibat grid, carousel, atau teks produk.
---
5. Komponen Global
C01–C05 — Header, navigation, search, actions
Konsep [TERINDIKASI]: site memiliki pencarian, navigasi menuju listing, dan aksi perdagangan. Namun urutan persis ikon/header tidak dapat direkonstruksi dari ekstraksi.
Spesifikasi rekomendasi:
Baris header utama: logo di kiri, kategori / pencarian yang dominan di tengah, ikon wishlist/cart/akun di kanan.
Di mobile: logo + search + menu/cart minimal; navigasi kategori masuk ke drawer.
Search memiliki ikon, placeholder contoh `Cari produk, merek, atau kategori…`, clear action, Enter untuk submit.
Navigasi punya active state dan keyboard support; jumlah item tidak perlu hardcoded.
Pencarian diarahkan ke `/pencarian?q=...` sebagai route usulan; jangan mengklaim query param itu milik situs sumber.
Aksesibilitas: setiap icon-only button wajib `aria-label`; tinggi target sentuh ≥44px.
States: default, hover, focus-visible, search-typing, search-empty, search-loading, menu-expanded, mobile-menu-open.
C06–C08 — Download App popover
Terlihat: trigger `Download Vins Teknik App`, panel dengan judul `Pindai barcode ini`, QR, Google Play, App Store.
Spesifikasi: trigger button/link → popover di desktop atau dialog/bottom sheet di mobile; display QR 1:1, dua badge marketplace, close button, dan dukungan Escape. Jangan salin logo maupun QR pihak lain untuk website sendiri.
C12 — Section Heading
Props yang direkomendasikan:
```ts
type SectionHeadingProps = {
  title: string;
  subtitle?: string;
  actionLabel?: string; // contoh: Lihat Semua
  actionHref?: string;
  icon?: React.ReactNode;
};
```
Layout: judul kiri, action kanan; heading tidak boleh lebih kecil dari judul card; pada mobile boleh wrap dua baris.
C54–C59 — Global Footer
Struktur [TERVERIFIKASI]:
Nama/alamat/kontak perusahaan.
Link perusahaan: Tentang, Cek Resi, Pengiriman & Pengembalian.
Bantuan: customer care, syarat/ketentuan, privasi.
Social links.
Logos/labels pembayaran (contoh: bank transfer, e-wallet, QRIS, kartu, COD).
Kurir pengiriman (contoh: SiCepat, KiriminAja, JNE, J&T).
Copyright.
Spesifikasi: 3–5 kolom desktop, 1–2 kolom mobile. Kelompokkan ikon/logo dengan nama yang terbaca; semua link mempunyai hover/focus. Jangan mencantumkan pembayaran/kurir yang tidak didukung bisnis website sendiri.
---
6. Homepage — Komponen Per Section
C09 — Hero/banner [TERINDIKASI/OPSIONAL]
Banner visual tidak dapat dipastikan dari teks halaman yang diekstraksi. Jika ditambahkan:
Desktop aspect ratio sekitar `2.5:1` hingga `3.5:1`; mobile siapkan artwork khusus.
Teks singkat, satu CTA primer, maksimal satu CTA sekunder.
Gunakan aset asli website sendiri, lazy load untuk banner di bawah fold dan preload hanya hero utama.
C10 — Brands
Terlihat: baris/kelompok brand, antara lain KING TONY, BOSCH, Pro-Quip, TIGER, SUPRA, DONGCHENG, DCA, DCK, DEWALT, STANLEY, BLACK+DECKER, BRITOOL, KARCHER, MULTIPRO, STARKE, MORRIS, TOTAL TOOLS, WEST LAKE, HONDA, SATA.
Komponen: `BrandSection → BrandTile[]`.
Setiap tile: logo brand (jika tersedia), nama alternatif, link ke produk brand.
Gunakan `object-fit: contain`; beri ruang putih agar logo proporsional.
Alternatif: horizontal rail dengan scroll-snap atau grid responsif.
Logo pihak ketiga hanya dipakai bila tersedia hak penggunaan yang sesuai.
C11 — Kategori Pilihan
Kategori yang terlihat: Generator & Genset, Mesin Bor, Mesin Gerinda, Perlengkapan Las, Impact Wrench, Impact Driver, Mesin Gergaji, Miter Saw, Vacuum Cleaners, High Pressure Cleaner, Mesin Poles, Pompa Air, Tang, Obeng, Mata Bor, Tool Box, Spare Part, Pemotong Rumput, Gembok, Pisau.
Komponen: `FeaturedCategoryGrid → CategoryTile[]`.
Isi tile: ikon/gambar kategori, nama singkat, link kategori.
Produk kategorinya tidak perlu langsung ditampilkan di tile.
Untuk nama panjang, gunakan 2 baris dan ketinggian tile konsisten.
C13–C14 — Promotion Section
Terlihat: heading `Promosi`, action `Lihat Semua`, entri promosi dengan nama hadiah, indikator `+1` atau `+5`, syarat minimum belanja, batas berlaku, dan produk-produk yang termasuk.
Anatomi `PromotionGroup`:
```text
┌──────────────────────────────────────────────────┐
│ Judul promo / hadiah             [Lihat Semua]    │
│ Badge hadiah • Minimal belanja • Tanggal akhir    │
│ ┌───────────┐ ┌───────────┐ ┌───────────┐        │
│ │ Product   │ │ Product   │ │ Product   │        │
│ │ Card      │ │ Card      │ │ Card      │        │
│ └───────────┘ └───────────┘ └───────────┘        │
└──────────────────────────────────────────────────┘
```
States: active, expired, minimum requirement satisfied/not satisfied, empty eligible products.
C47–C48 — Flash Sale [KONDISIONAL]
Pada salah satu representasi beranda terindeks ditemukan `Flash Sale`, `Berakhir dalam`, penghitung hari/jam/menit/detik, dan `Segera habis`. Ini bukan bukti blok sedang ada pada homepage yang baru diaudit.
Jika dipakai: `FlashSaleSection` dengan countdown dari timestamp server, bukan angka statis; saat kedaluwarsa, sembunyikan atau ganti label. Badge `Segera habis` hanya ketika stok benar-benar rendah.
C23–C24 — New Arrivals dan Recommendations
Terlihat: judul `Produk Terbaru`, `Produk Rekomendasi`, masing-masing menampilkan kumpulan `ProductCard`.
Implementasi ideal: data difilter dari backend; satu komponen `ProductRail` bisa digunakan pada semua section berbeda.
C25–C31 — All Products / Catalog di homepage
Terlihat: judul `Semua Produk`, filter `Etalase` menurut brand, filter kategori, daftar produk, `Jumlah produk per halaman`, serta pagination berbentuk `1/79` (nilai berubah sesuai data).
Desktop: panel filter di sisi kiri + grid utama di kanan.
Mobile: tombol filter membuka drawer; tampilkan filter aktif sebagai chip di atas grid.
Filter `Etalase` mendukung banyak pilihan brand dan pencarian di dalam daftar (`Cari etalase...` terlihat di sumber).
Pagination harus memperbarui URL/query state dan mengembalikan fokus ke heading produk.
Halaman berbeda memperlihatkan pilihan page-size berbeda (contoh `20/40/80` dan `30/60/90`), sehingga jangan hardcode satu pilihan sebagai fakta universal.
---
7. Product Card — Spesifikasi Paling Penting
C16–C22 — Anatomi
```text
┌────────────────────────────┐
│ [Badge diskon]             │
│                            │
│       FOTO PRODUK          │
│       object-contain       │
│                            │
├────────────────────────────┤
│ Nama produk hingga 2–3 baris│
│ Rp 1.234.000               │
│ Rp 1.999.000   -32%        │
│ ★ 5.0    12 Terjual        │
└────────────────────────────┘
```
Diverifikasi: foto/link produk, nama, harga baru, harga lama dicoret, persentase diskon, rating, jumlah terjual. Contoh nilai tersebut adalah ilustrasi, bukan data statis untuk website baru.
Rekomendasi aturan:
`ProductCard` sepenuhnya dapat dinavigasi ke detail; button lain di dalam card tidak boleh memicu navigasi ganda.
Foto dengan background netral; aspect ratio `1/1` agar katalog stabil.
Nama dipotong konsisten, tidak boleh menabrak harga.
Harga aktual tampil lebih menonjol daripada harga lama.
Tampilkan strike-through hanya saat `originalPrice > price`.
Hitung diskon dari data, jangan hardcode `32%`.
Rating kosong harus berupa `Belum ada ulasan` atau disembunyikan, bukan 5.0 otomatis.
Jumlah terjual `0` berbeda dengan tidak ada data; hindari label `- Terjual` jika tidak bermakna.
Dukung placeholder/skeleton dan fallback gambar produk.
Data contract:
```ts
type Product = {
  id: string;
  slug: string;
  name: string;
  brand?: { id: string; name: string; logoUrl?: string };
  category?: { id: string; name: string };
  imageUrl: string;
  price: number; // rupiah, integer
  originalPrice?: number | null;
  ratingAverage?: number | null;
  reviewCount?: number;
  soldCount?: number | null;
  stock?: number | null;
  labels?: Array<'new' | 'promo' | 'flash-sale' | 'gift'>;
  href: string;
};
```
Discount derivation:
```ts
const discountPercent =
  originalPrice && originalPrice > price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : null;

const formatRupiah = (value: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', maximumFractionDigits: 0,
  }).format(value);
```
Visual states
State	Perilaku yang direkomendasikan
Default	Border ringan, card putih, judul/harga jelas
Hover	Shadow/border sedikit meningkat, tanpa lompatan layout
Focus	`focus-visible` ring jelas
Loading	Skeleton rasio tetap
Out of stock	Label `Stok habis`, CTA disabled
Price without discount	Tidak render harga lama/badge
Image error	Fallback image, tetap ada alt text
Review unavailable	Jangan tampilkan rating palsu
---
8. Catalog, Category, Brand & Search
8.1 Reusable catalog layout
```text
[Page title / hasil pencarian]
┌──────────────────────┬─────────────────────────────────────┐
│ FILTER               │ Control bar / active filter chips   │
│ Etalase / brand      ├─────────────────────────────────────┤
│ Search brand         │ ProductCard ProductCard ProductCard│
│ Kategori             │ ProductCard ProductCard ProductCard│
│ Reset filter         │ ProductCard ProductCard ProductCard│
│                      ├─────────────────────────────────────┤
│                      │ Per page selector • Pagination      │
└──────────────────────┴─────────────────────────────────────┘
```
Komponen: `CatalogLayout`, `FilterSidebar`, `BrandFilterList`, `CategoryFilterList`, `FilterSearchInput`, `ActiveFilterChips`, `CatalogToolbar`, `ProductGrid`, `PageSizeSelect`, `Pagination`, `EmptyResults`.
Detail perilaku [REKOMENDASI]:
Filter berubah → reset halaman ke 1; update URL tanpa kehilangan konteks.
Sidebar brand menyertakan search kecil; daftar kategori sangat panjang perlu `max-height` + scroll internal.
Tombol `Hapus filter` tersedia ketika ada filter aktif.
Tampilkan skeleton saat load dan empty-state jika data habis.
Terapkan debounce 200–300ms untuk input pencarian interaktif bila menyentuh API.
Paginasi selalu memakai link yang bisa dikunjungi keyboard dan dapat diindeks bila cocok.
Bila ada sort tambahan, label sebagai fitur baru, karena tidak terverifikasi pada sumber.
8.2 Perbedaan halaman
Route	Headline/purpose	Notes
`/produk-kategori/`	Semua Kategori	Directory + katalog
`/produk-kategori/[slug]`	Nama kategori	Selected category + produk terkait
`/merek`	Semua Merek	Brand browse + daftar produk
`/pencarian`	Hasil Pencarian	Search/filter/listing, zero-results perlu dibuat
`/?showcase=...`	Beranda dengan etalase	Contoh state filter pada sumber; bukan kontrak wajib bagi implementasi baru
---
9. Product Detail Page
Halaman yang dianalisis: produk DEWALT DWS727. Komponen berikut memang tampak dalam hasil ekstraksi.
9.1 Layout
```text
Desktop: 
┌─────────────────┬────────────────────────┬──────────────────┐
│ Galeri gambar   │ Nama, rating, harga    │ Stok + kuantitas │
│ Counter 1/5     │ Gift / metadata        │ Keranjang / Beli │
│ Thumbnail       │ Detail & deskripsi     │ Sekarang         │
└─────────────────┴────────────────────────┴──────────────────┘
[Ulasan pembeli]

Mobile:
[Gallery] → [Nama & rating] → [Harga & promo]
→ [Stok + jumlah + CTA] → [Spesifikasi] → [Deskripsi] → [Ulasan]
```
Posisi 3 kolom dan sticky behavior di atas adalah rekomendasi layout, bukan pengukuran posisi asli.
C32 — Image gallery
Counter galeri (`1/5` terlihat), gambar utama, thumbnail/preview.
Klik thumbnail → mengubah gambar aktif.
Support swipe pada mobile dan tombol navigasi keyboard.
Gambar menggunakan `object-fit: contain`.
C33–C35 — Wishlist, share, chat
Aksi wishlist, `Share Produk` dan chat ditemukan.
Share dialog berisi preview gambar/nama produk dan tautan kanal berbagi.
Gunakan native share pada browser yang mendukung; fallback salin tautan.
Status wishlist harus terkait user/session jika fitur diimplementasikan.
Fitur chat perlu provider/channel sendiri.
C36–C37 — Product summary & gift
Nama produk yang lengkap.
Rating dan unit terjual.
Harga utama, harga sebelum diskon, persentase potongan.
Pesan hadiah gratis bila memenuhi syarat dan ringkasan hadiah.
Hindari mengikat promo hanya dari tampilan; syarat harus divalidasi oleh backend/checkout.
C38–C39 — Product details
Field yang terlihat: `Kategori`, `Brand`, `Etalase`, `K3L`, `Minimal Pemesanan`, `Berat`. Deskripsi panjang dapat di-expand melalui `Baca Selengkapnya` dan dilipat melalui `Sembunyikan`.
Komponen: `ProductMetaList` dan `ExpandableDescription`.
Label kiri, value kanan pada desktop; tetap terbaca mobile.
Jangan hilangkan informasi berat dan minimum order karena penting untuk transaksi.
Expand text memakai tombol semantik yang menjelaskan state.
Render long-form description sebagai paragraf/list yang aman, hindari HTML mentah dari server.
C40 — Reviews
Section `Ulasan Pembeli`.
Sumber menampilkan empty state `Belum ada ulasan untuk produk ini` dan ajakan pembeli memberi ulasan.
Rekomendasi: masukkan komponen `ReviewSummary`, `ReviewList`, `EmptyReviews`, `ReviewPagination` (yang terakhir belum terverifikasi).
C41–C44 — Purchase actions
Status: `Ready Stock`.
Kuantitas: `Atur Jumlah` dengan input/stepper.
CTA: `Keranjang` serta `Beli Sekarang`.
Kontrak stepper: minimum 1, maksimum stok jika diketahui, nilai tidak boleh NaN, tombol minus disabled saat min, selalu sinkron dengan form.
PurchaseCard state: ready, out-of-stock, adding-to-cart, added, error, unauthenticated (jika perlu), quantity-invalid.
Perbedaan CTA: `Keranjang` menyimpan ke cart; `Beli Sekarang` memulai checkout. Logika transaksi sesungguhnya bukan bagian dari UI reference ini.
---
10. Promo Detail Page
Data yang terverifikasi: label `Hadiah`, judul promosi, minimum belanja, batas waktu, kode promo, penjelasan cara pakai, dan daftar produk yang termasuk.
Komponen:
```text
PromoDetailPage
├── BackToAllPromos
├── PromotionHero / PromoImage
├── PromoTypeBadge (Hadiah)
├── PromotionTitle
├── PromoBenefits
├── PromoConditions (min. belanja, deadline)
├── PromoCode (optional copy)
├── HowToUse
└── EligibleProductGrid
```
Tanggal berakhir harus diformat zona waktu yang jelas.
Kode promo diberi tombol copy hanya bila ada kode yang relevan.
Bila hadiah otomatis, nyatakan bahwa syaratnya dipenuhi di checkout.
Promo expired tidak boleh menampilkan CTA menyesatkan.
---
11. Information Pages
About Us `/tentang-kami`
Struktur terverifikasi: `About Us`, pengantar profil perusahaan, `Visi`, `Misi`, serta sejumlah poin misi dengan penjelasan.
Gunakan `ContentContainer` dengan lebar baca sekitar `760–860px`, heading bertingkat, spasi paragraf memadai, dan komponen misi berupa list/card. Panjang/lebar adalah rekomendasi.
Shipping Tracking `/cek-resi`
Terlihat: heading `Cek Resi Pengiriman`, deskripsi singkat, label `Nomor Resi`, input dengan contoh AWB, action `Lacak`, bantuan informasi sumber nomor resi.
Komponen: `TrackingForm`, `AWBInput`, `SubmitButton`, `TrackingStatus`, `TrackingTimeline` (dua terakhir direkomendasikan; respons aktual belum diamati).
States: idle, empty error, invalid format, loading, found, not found, provider error. Jangan mengaku status pengiriman bila API belum memberikan hasil.
Address Form/Dialog
Teks `Tambah Alamat` dan `Simpan` terlihat pada beberapa halaman. Isi field lengkap tidak dapat diverifikasi. Jika dibangun, rekomendasi: nama penerima, nomor telepon, provinsi/kota/kecamatan, alamat rinci, kode pos, label alamat, dan validasi.
---
12. Reusable Component API / Contract
Gunakan component APIs berikut sebagai titik mulai, bukan kode yang diekstrak dari sumber.
```ts
type BrandTileProps = { name: string; logoUrl?: string; href: string };
type CategoryTileProps = { name: string; iconUrl?: string; href: string };
type ProductCardProps = { product: Product; showWishlist?: boolean };
type ProductGridProps = { products: Product[]; loading?: boolean; columns?: number };
type ProductRailProps = { title: string; products: Product[]; seeAllHref?: string };
type FilterOption = { label: string; value: string; count?: number };
type CatalogFiltersProps = {
  brands: FilterOption[];
  categories: FilterOption[];
  selectedBrand?: string;
  selectedCategory?: string;
  onChange: (next: { brand?: string; category?: string }) => void;
};
type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};
type QuantityStepperProps = {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
};
type Promotion = {
  id: string;
  title: string;
  type: 'gift' | 'discount' | 'bundle';
  description?: string;
  minimumSpend?: number;
  promoCode?: string;
  expiresAt?: string;
  eligibleProductIds: string[];
};
```
Catatan framework: TypeScript interface di atas untuk komunikasi dan konsistensi. Bisa diimplementasi sebagai komponen React/Next.js, Astro (`.astro` dengan islands untuk interaksi), Vue, ataupun HTML biasa. Tidak ada bukti framework asli situs referensi.
---
13. Component Tree / Struktur Folder Usulan
```text
src/
├── components/
│   ├── layout/
│   │   ├── Header
│   │   ├── Navigation
│   │   ├── SearchBar
│   │   ├── AppDownloadPopover
│   │   ├── Footer
│   │   └── Container
│   ├── ui/
│   │   ├── Button / IconButton
│   │   ├── Badge / Chip
│   │   ├── Input / Select
│   │   ├── Drawer / Modal / Popover
│   │   ├── Skeleton / EmptyState
│   │   ├── SectionHeading
│   │   └── Pagination
│   ├── product/
│   │   ├── ProductCard
│   │   ├── ProductGrid
│   │   ├── ProductRail
│   │   ├── ProductImageGallery
│   │   ├── ProductPrice
│   │   ├── ProductRating
│   │   ├── ProductMetaList
│   │   ├── ProductDescription
│   │   ├── ProductReviews
│   │   └── PurchaseCard
│   ├── catalog/
│   │   ├── BrandTile / BrandGrid
│   │   ├── CategoryTile / CategoryGrid
│   │   ├── FilterSidebar / FilterDrawer
│   │   ├── BrandFilter / CategoryFilter
│   │   └── CatalogToolbar
│   ├── promo/
│   │   ├── PromotionGroup
│   │   ├── PromotionDetails
│   │   ├── FlashSaleTimer
│   │   └── GiftBadge
│   └── forms/
│       ├── AddressForm
│       └── TrackingForm
├── layouts/
│   └── BaseLayout
├── pages/
│   ├── index
│   ├── pencarian
│   ├── merek
│   ├── produk-kategori/[slug]
│   ├── produk/[slug]
│   ├── promo/[id]
│   ├── tentang-kami
│   └── cek-resi
├── styles/
│   ├── tokens.css
│   ├── global.css
│   └── utilities.css
└── lib/
    ├── currency
    ├── product
    └── catalog-params
```
Nama file dan extension disesuaikan dengan framework final; contoh di atas sengaja framework-agnostic.
---
14. Contoh CSS Tokens Siap Pakai [REKOMENDASI]
```css
:root {
  --color-brand-primary: #e4572e;
  --color-brand-primary-hover: #c74723;
  --color-bg-page: #f8fafc;
  --color-bg-surface: #fff;
  --color-bg-subtle: #f1f5f9;
  --color-text-primary: #0f172a;
  --color-text-secondary: #475569;
  --color-text-muted: #94a3b8;
  --color-border-default: #e2e8f0;
  --color-success: #15803d;
  --color-warning: #d97706;
  --color-danger: #dc2626;
  --color-focus-ring: #2563eb;

  --font-sans: 'Inter', 'Plus Jakarta Sans', system-ui, sans-serif;
  --container-max: 1280px;
  --page-gutter: 24px;
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --shadow-card: 0 2px 12px rgb(15 23 42 / 0.05);
  --transition-fast: 160ms ease;
}

*, *::before, *::after { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  background: var(--color-bg-page);
  color: var(--color-text-primary);
  font-family: var(--font-sans);
  line-height: 1.5;
}
button, input, select, textarea { font: inherit; }
a { color: inherit; text-decoration: none; }
img { display: block; max-width: 100%; }
:focus-visible { outline: 3px solid var(--color-focus-ring); outline-offset: 2px; }

.container {
  width: min(calc(100% - var(--page-gutter) * 2), var(--container-max));
  margin-inline: auto;
}
.product-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 16px;
}
.product-card {
  min-width: 0;
  overflow: hidden;
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-md);
  transition: box-shadow var(--transition-fast), border-color var(--transition-fast);
}
.product-card:hover { box-shadow: var(--shadow-card); }
.product-card__image {
  width: 100%;
  aspect-ratio: 1;
  object-fit: contain;
  background: #fff;
}
.product-card__title {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.product-card__price {
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

@media (max-width: 1023px) {
  .product-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}
@media (max-width: 639px) {
  :root { --page-gutter: 16px; }
  .product-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { scroll-behavior: auto !important; transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; }
}
```
---
15. Interaction Rules
Event	UI behavior yang direkomendasikan	Catatan
Klik brand	Navigasi/filter produk brand	Brand dan etalase terlihat
Klik kategori	Masuk listing kategori	Kategori terlihat
Ketik global search	Submit query / tampilkan suggestion opsional	Autosuggest belum diverifikasi
Klik `Lihat Semua` promo	Navigasi daftar/halaman promo	Action terlihat
Klik `ProductCard`	Buka detail produk	Produk punya link
Klik thumbnail	Ganti gambar utama	Galeri terlihat; aksi spesifik rekomendasi
Klik `Wishlist`	Toggle saved state	Aksi terlihat
Klik `Share`	Buka dialog share	Dialog terlihat
Klik `Baca Selengkapnya`	Expand deskripsi	Terverifikasi
Quantity +/-	Kurang/tambah dengan batas	Atur Jumlah terlihat
Klik `Keranjang`	Add-to-cart	CTA terverifikasi; hasil tidak diuji
Klik `Beli Sekarang`	Mulai pembelian	CTA terverifikasi; hasil tidak diuji
Pilih page-size	Ubah jumlah produk per halaman	Terverifikasi
Klik pagination	Pindah halaman listing	Terverifikasi
Submit AWB	Cari pelacakan resi	Form terverifikasi; hasil tidak diuji
Klik `Simpan` alamat	Validasi dan simpan alamat	Dialog/form terlihat; field tidak diuji
Global rules: tampilkan feedback loading/success/error, gunakan skeleton saat fetch, jangan menghilangkan focus ring, close modal dengan Escape, trap focus pada modal, dan kosongkan listener ketika komponen unmount.
---
16. Accessibility, SEO, Performance
Accessibility [REKOMENDASI]
Kontras teks minimal WCAG AA; target `4.5:1` untuk teks normal.
Tidak hanya warna untuk menyatakan diskon/stok/filter aktif.
Heading `h1` satu per halaman; urutan `h2/h3` konsisten.
Semua gambar punya `alt` deskriptif, kecuali dekoratif.
`aria-live="polite"` untuk hasil search, sukses add-to-cart, dan update jumlah.
Navigasi, filter, galeri, modal, dan pagination bisa dipakai via keyboard.
Touch target ≥44×44px di mobile.
SEO [REKOMENDASI]
Set title/meta description berbeda untuk homepage, kategori, produk, merek, dan promo.
Canonical URL untuk varian filter/pagination bila diperlukan sesuai strategi SEO.
Structured data `Product`, `Offer`, `AggregateRating` hanya saat datanya benar-benar tersedia dan valid.
Breadcrumbs boleh ditambahkan sebagai peningkatan UX; tidak diklaim terverifikasi pada sumber.
Tidak membuat teks nama produk sekadar gambar.
Performance [REKOMENDASI]
Prioritaskan LCP gambar hero/produk di atas fold; lainnya lazy load.
`width/height` dan `aspect-ratio` untuk cegah CLS.
Kompres gambar ke WebP/AVIF bila kompatibel, gunakan `srcset`.
Virtualize hanya daftar filter yang luar biasa panjang; hindari bundle React besar untuk halaman statis.
Untuk Astro: interaktif seperti search, filter drawer, quantity, modal dapat menjadi islands; sisanya server-rendered/static.
Untuk Next.js: gunakan Server Components untuk layout, katalog, dan data; Client Components hanya untuk kontrol interaktif.
---
17. Checklist Implementasi
P0 — Wajib agar tampilan dan alur dasar terbentuk
[ ] Implementasikan `Header`, `SearchBar`, `Footer`, `Container`.
[ ] Implementasikan tokens warna/font/spacing yang dapat diganti brand sendiri.
[ ] Buat `BrandGrid`, `CategoryGrid`, `SectionHeading`.
[ ] Buat satu `ProductCard` reusable dengan harga, diskon, rating, sold.
[ ] Buat `ProductGrid`, `ProductRail`, dan katalog homepage.
[ ] Buat filter kategori + etalase, pagination, dan state kosong.
[ ] Buat halaman pencarian, listing kategori, dan detail produk.
[ ] Buat `ProductImageGallery`, detail/specs, stok, quantity, CTA.
[ ] Uji desktop/tablet/mobile dan navigasi keyboard.
P1 — Lengkap seperti cakupan referensi
[ ] Buat promo group, detail promo, minimum belanja, hadiah.
[ ] Buat `Wishlist`, `ShareDialog`, `ExpandableDescription`, reviews.
[ ] Buat directory merek, halaman Tentang Kami, pelacakan resi.
[ ] Tambahkan logo pembayaran/kurir milik layanan yang benar-benar didukung.
[ ] Buat state loading, error, disabled, out-of-stock, empty-state.
P2 — Opsional/kondisional
[ ] `AppDownloadPopover` dengan QR dan store badges milik website sendiri.
[ ] Hero/banner jika cocok dengan brand.
[ ] Flash Sale + countdown jika kampanye aktif.
[ ] Chat provider integration.
[ ] Address dialog dan integrasi alamat pelanggan.
[ ] Tambahkan sorting, autosuggest, breadcrumb atau sticky purchase card sebagai improvement, bukan hasil peniruan.
---
18. Instruksi untuk AI Coding Agent
Salin instruksi berikut bersama `DESIGN.md` jika memakai OpenCode/AI coding assistant:
> Baca `DESIGN.md` sepenuhnya sebelum menulis UI. Jadikan Vins Teknik sebagai referensi pola e-commerce dan inventaris komponen, **bukan** sebagai brand yang akan disalin. Gunakan token dan struktur yang ditetapkan sebagai baseline rekomendasi. Bangun reusable, responsive, accessible components dengan prioritas P0 → P1 → P2. Jangan mengarang harga/rating/stok; gunakan data/placeholder yang diberi label demo. Jangan meng-hardcode warna, font, kategori, atau brand ke tiap komponen. Pastikan setiap tombol punya aksi nyata, termasuk search, filter, pagination, quantity, share, add-to-cart (jika backend tersedia). Jika backend belum tersedia, berikan mock adapter yang jelas dan jangan menampilkan keberhasilan transaksi palsu. Jangan mengklaim pixel-perfect dari referensi karena CSS dan screenshot belum diekstrak. Tidak boleh memakai aset/logo/copy berlisensi milik website referensi tanpa izin.
---
19. Source Map dan Batasan Audit
Berikut halaman publik yang dijadikan sumber inventaris:
Halaman	URL	Informasi utama
Homepage	https://vinsteknik.id/	Brands, Kategori Pilihan, Promosi, Produk Terbaru, Rekomendasi, Semua Produk, filter, page-size, footer
Listing kategori	https://vinsteknik.id/produk-kategori/generator-genset	Brand/Etalase, daftar kategori, listing produk
Kategori directory	https://vinsteknik.id/produk-kategori/	Directory kategori
Brand directory	https://vinsteknik.id/merek	Directory merek
Search	https://vinsteknik.id/pencarian	Filter & hasil pencarian
Product detail	https://vinsteknik.id/produk/mitre-saw-sliding-10-double-bevel-sliding-mitre-saw-250mm-dewalt-dws727-WT7FobAzKw	Galeri, wishlist, share, chat, harga, hadiah, specs, review, quantity, CTA
Promotion detail	https://vinsteknik.id/promo/GSNK5C5PKK	Hadiah, syarat promo, kode, periode, eligible products
About	https://vinsteknik.id/tentang-kami	Profil, visi, misi
Tracking	https://vinsteknik.id/cek-resi	AWB input & Lacak
Beranda terindeks varian lain	https://www.vinsteknik.id/?showcase=dca	Bukti kondisional Flash Sale / countdown
Yang belum terverifikasi sehingga membutuhkan audit manual tambahan:
Warna brand asli, HEX seluruh state, gradient, font family/weight asli.
Pixel-level dimensions (header, margin, grid, border radius, button height) dan motion/easing asli.
Tata letak visual persis homepage dan mobile, termasuk banner/hero jika ada.
Respons interaksi klik untuk user login, wishlist, cart, checkout, sorting, dan tracking response.
Kondisi tampilan animasi, hover, lightbox, sticky elements, dan breakpoint sebenarnya.
Prosedur untuk pengukuran pixel-perfect: buka referensi pada Chrome desktop + mobile; gunakan DevTools `Inspect → Computed` untuk setiap komponen, `Network → Fonts` untuk font, color picker untuk warna, penggaris layout untuk dimensi, dan screenshot di lebar 375px/768px/1440px. Ganti nilai baseline pada `tokens.css` setelah pengukuran. Dokumentasi ini tetap menjadi blueprint komponen dan arsitektur yang bisa langsung dipakai sebelum tahap tersebut.
---
End of DESIGN.md