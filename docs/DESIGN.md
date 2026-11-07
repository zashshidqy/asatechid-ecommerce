# DESIGN — ASATECHID Commerce

> **Status:** acuan desain provisional
>
> **Versi:** 1.0 — 2026-11-07
>
> **Referensi pengalaman:** [vinsteknik.id](https://vinsteknik.id)
>
> **Cakupan:** storefront publik Astro + EmDash CMS

## 1. Tujuan

Membangun storefront ASATECHID yang terasa seperti toko alat teknik modern: padat produk, mudah dipindai, cepat dicari, dan jelas mengarahkan pengguna ke inquiry. Vins Teknik dipakai sebagai referensi pola pengalaman e-commerce, bukan sumber desain untuk disalin.

Desain ASATECHID wajib:

- orisinal dan dapat dibedakan dari Vins Teknik;
- product-first, cepat, ringan, dan berorientasi konversi;
- menggabungkan katalog dengan konten edukasi;
- responsif, aksesibel, dan dapat dipakai dengan keyboard;
- menampilkan harga, stok, rating, promo, kontak, dan layanan hanya bila data nyata tersedia;
- memakai komponen serta token terpusat agar mudah diubah setelah brand guideline resmi tersedia.

## 2. Batasan penggunaan referensi

### Boleh diadaptasi

- hierarki katalog: pencarian, kategori, merek, produk, promo, dan artikel;
- pola kartu produk padat;
- filter desktop dan drawer filter mobile;
- galeri serta ringkasan produk;
- heading section dengan tautan “Lihat semua”;
- struktur footer commerce.

### Tidak boleh disalin

- logo, nama, slogan, ikon, QR, foto, banner, deskripsi, atau aset Vins Teknik;
- nilai warna, tipografi, ukuran, dan susunan halaman secara pixel-perfect;
- data produk, harga, rating, jumlah terjual, kategori, merek, promo, kontak, pembayaran, atau kurir;
- source code, stylesheet, dan perilaku internal milik situs referensi.

Semua data contoh harus bertanda **DEMO/SEED**. UI tidak boleh membuat fitur transaksi palsu.

## 3. Karakter visual

Lima kata kunci:

1. **Industrial** — kokoh, fungsional, tegas.
2. **Rapi** — grid stabil dan whitespace terukur.
3. **Padat** — banyak produk terlihat tanpa terasa sesak.
4. **Tepercaya** — informasi faktual, status jelas, tanpa klaim palsu.
5. **Modern** — tipografi bersih, interaksi ringan, tanpa dekorasi berlebihan.

### Arah gaya

- Latar halaman abu-abu sangat terang; permukaan kartu putih.
- Warna utama provisional oranye industrial untuk CTA dan state aktif.
- Teks utama navy gelap agar lebih lembut daripada hitam murni.
- Border tipis lebih dominan daripada shadow.
- Radius sedang, bukan kartu bulat berlebihan.
- Foto produk memakai ruang putih dan `object-fit: contain`.
- Tidak memakai glassmorphism, neon, gradien dekoratif acak, sparkle, atau animasi berat.

## 4. Prinsip UX

### 4.1 Product-first

Urutan perhatian utama:

`Pencarian → kategori/merek → produk → harga/ketersediaan → CTA inquiry`

Artikel tetap penting, tetapi ditempatkan setelah kebutuhan discovery katalog terpenuhi.

### 4.2 Progressive disclosure

- Header menampilkan aksi inti saja.
- Filter kompleks masuk sidebar desktop atau drawer mobile.
- Spesifikasi panjang dapat dikelompokkan.
- Konten tambahan tidak mengganggu CTA utama.

### 4.3 Jujur terhadap data

- Tanpa harga: tampilkan “Harga belum tersedia”.
- Tanpa stok: tampilkan “Ketersediaan belum tersedia”.
- Tanpa rating: sembunyikan rating atau tampilkan “Belum ada ulasan”.
- Tanpa gambar: gunakan placeholder ASATECHID bertanda DEMO bila aset masih seed.
- Tanpa kanal kontak: CTA dinonaktifkan dengan penjelasan.
- Tanpa backend cart: jangan tampilkan tombol keranjang/beli sekarang aktif.

### 4.4 Satu pola, banyak konteks

`ProductCard`, `SectionHead`, `CategoryTile`, `BrandTile`, `ProductGrid`, dan `EmptyState` dipakai ulang. Variasi hanya ditambah bila punya alasan fungsi.

## 5. Design tokens provisional

Token berikut bukan identitas resmi ASATECHID. Implementasi utama berada di `src/styles/tokens.css`.

### 5.1 Warna

```css
:root {
  --color-brand-primary: #c44a1a;
  --color-brand-primary-hover: #9f3913;
  --color-brand-primary-soft: #fff1e8;

  --color-page: #f6f7f9;
  --color-surface: #ffffff;
  --color-surface-subtle: #eef1f4;

  --color-text-primary: #15212e;
  --color-text-secondary: #465465;
  --color-text-muted: #687586;
  --color-border: #dce2e8;
  --color-border-strong: #b9c3ce;

  --color-success: #19733b;
  --color-warning: #9a5b00;
  --color-danger: #b42318;
  --color-info: #175cd3;
  --color-focus: #175cd3;
}
```

Aturan:

- teks normal harus mencapai rasio kontras minimal 4.5:1;
- warna bukan satu-satunya penanda status;
- merah untuk error atau potongan valid, bukan dekorasi;
- warna utama dipakai hemat pada CTA, link penting, dan state aktif;
- setiap perubahan token wajib diuji ulang melalui test kontras proyek.

### 5.2 Tipografi

Font provisional:

```css
--font-sans: system-ui, -apple-system, "Segoe UI", sans-serif;
```

Tidak memuat font jaringan sebelum lisensi dan brand guideline tersedia.

| Gaya | Desktop | Mobile | Bobot | Penggunaan |
|---|---:|---:|---:|---|
| Display | 40px | 30px | 750 | intro beranda singkat |
| H1 | 32px | 26px | 750 | judul halaman |
| H2 | 24px | 21px | 700 | judul section |
| H3 | 19px | 18px | 650 | subbagian/kartu besar |
| Body | 16px | 15px | 400 | isi utama |
| Product title | 14px | 13px | 550 | nama produk |
| Price card | 18px | 16px | 750 | harga kartu |
| Price detail | 30px | 24px | 750 | harga detail |
| Metadata | 13px | 12px | 400 | kategori, rating, stok |
| Button | 14px | 14px | 650 | CTA |

- Heading: line-height `1.2–1.35`.
- Body: line-height `1.55–1.7`.
- Harga: `font-variant-numeric: tabular-nums`.
- Nama produk pada kartu: maksimal dua baris.

### 5.3 Layout dan spacing

```css
:root {
  --container-max: 1280px;
  --gutter-mobile: 16px;
  --gutter-desktop: 24px;

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-7: 48px;
  --space-8: 64px;

  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-pill: 999px;

  --shadow-card: 0 2px 10px rgb(21 33 46 / 0.06);
  --shadow-overlay: 0 16px 40px rgb(21 33 46 / 0.18);
}
```

- Jarak section: `40–64px`.
- Gap product grid: `10px` mobile, `16px` tablet/desktop.
- Target sentuh minimum: `44 × 44px`.
- Border kartu default: `1px solid var(--color-border)`.

### 5.4 Breakpoint

| Nama | Lebar | Fungsi |
|---|---:|---|
| Mobile | `<640px` | 2 kolom produk, filter drawer |
| Tablet | `640–1023px` | 3 kolom produk |
| Desktop | `1024–1279px` | 4 kolom produk, filter sidebar |
| Wide | `≥1280px` | 5 kolom produk |

Breakpoint mengikuti kebutuhan konten, bukan tipe perangkat tertentu.

### 5.5 Motion

- Transisi dasar: `160ms ease`.
- Hover kartu: perubahan border/shadow, maksimal `translateY(-2px)`.
- Tidak ada autoplay carousel pada baseline.
- `prefers-reduced-motion: reduce` menonaktifkan animasi dan smooth scroll.

## 6. Information architecture

Route canonical saat ini tetap memakai struktur proyek yang sudah berjalan:

```text
/
├── /products
│   ├── /products/category/[slug]
│   └── /products/[slug]
├── /posts
│   └── /posts/[slug]
├── /category/[slug]
├── /tag/[slug]
├── /[slug]
└── /404
```

Route Indonesia dari situs referensi tidak disalin. Alias baru hanya dibuat bila ada kebutuhan bisnis dan strategi redirect/canonical yang disetujui.

### Route berikut belum menjadi kontrak

- directory merek publik;
- hasil pencarian penuh;
- promo;
- wishlist;
- cart/checkout;
- tracking pengiriman;
- akun pelanggan.

Jangan menampilkan navigasi menuju route tersebut sebelum tersedia dan berfungsi.

## 7. App shell

### 7.1 Header desktop

Struktur:

```text
[Logo ASATECHID] [Search dominan........................] [Katalog] [Artikel] [Tentang]
```

Ketentuan:

- tinggi visual sekitar `68–76px`;
- sticky opsional hanya bila tidak mengganggu viewport kecil;
- logo tidak menyusut sampai sulit dibaca;
- search mendapat ruang terbesar;
- tidak ada cart, wishlist, login, atau notifikasi palsu;
- active state memiliki teks/indikator selain warna.

### 7.2 Header mobile

```text
[Logo] [Menu]
[Search........................]
```

- Menu memakai disclosure/drawer yang dapat ditutup dengan Escape.
- Search tetap mudah ditemukan, bukan disembunyikan dalam menu.
- Fokus kembali ke trigger setelah drawer ditutup.

### 7.3 Search

Placeholder: `Cari produk atau artikel...`

State wajib:

- idle;
- focus;
- loading;
- hasil tersedia;
- tanpa hasil;
- error aman.

Query pencarian tidak otomatis menjadi landing page SEO indexable.

### 7.4 Footer

Kolom baseline:

1. Identitas singkat ASATECHID.
2. Katalog: semua produk dan kategori.
3. Informasi: artikel, tentang, kontak/kebijakan bila sudah tersedia.
4. Kanal kontak resmi bila sudah dikonfigurasi.

Pembayaran, kurir, alamat, sosial, badge aplikasi, dan sertifikasi hanya ditampilkan dari data resmi.

## 8. Homepage

Urutan baseline:

1. Intro katalog ringkas.
2. Merek pilihan, bila ada data.
3. Kategori populer/pilihan.
4. Produk terbaru.
5. Produk rekomendasi, bila ada kurasi nyata.
6. Semua produk atau pintasan ke katalog.
7. Artikel edukasi terbaru.

### 8.1 Intro katalog

Bukan hero promosi besar. Gunakan:

- satu H1 yang menjelaskan fungsi situs;
- satu paragraf pendek;
- CTA menuju `/products`;
- pencarian tetap berada di header.

Banner promo hanya ditambahkan setelah model promo dan aset resmi tersedia.

### 8.2 Brand section

`BrandTile`:

- logo `object-fit: contain` bila berizin;
- fallback nama teks;
- permukaan putih, border ringan;
- belum menjadi link bila halaman merek belum tersedia;
- section disembunyikan bila data kosong.

Grid: 3 kolom mobile, 5 tablet, 8–10 desktop tergantung panjang nama/logo.

### 8.3 Category section

`CategoryTile` berisi:

- ikon generik atau gambar resmi;
- nama kategori maksimal dua baris;
- jumlah produk nyata bila tersedia;
- link menuju route kategori canonical.

Grid: 2 kolom mobile, 3–4 tablet, 5–6 desktop.

### 8.4 Product sections

Semua section memakai `ProductGrid` dan `ProductCard` yang sama. Perbedaan hanya sumber data dan heading.

- Produk terbaru: urutan waktu publish/update yang didefinisikan backend.
- Rekomendasi: field kurasi nyata seperti `featured`.
- Semua produk: sampel terbatas dengan CTA “Lihat semua produk”, bukan seluruh katalog panjang bila mengganggu performa.

### 8.5 Editorial section

Artikel diletakkan setelah katalog. Kartu artikel menampilkan judul, excerpt, penulis/tanggal bila tersedia, dan gambar. Desain lebih lapang daripada kartu produk agar katalog dan editorial mudah dibedakan.

## 9. Product card

### 9.1 Anatomi

```text
┌──────────────────────┐
│ badge valid          │
│                      │
│     gambar 1:1       │
│                      │
├──────────────────────┤
│ kategori/merek       │
│ Nama produk 2 baris  │
│ Harga/status         │
│ rating • terjual     │
└──────────────────────┘
```

### 9.2 Aturan data

- Gambar rasio `1:1`, `object-fit: contain`.
- Alt menjelaskan produk; gambar dekoratif memakai alt kosong.
- Harga lama hanya tampil bila lebih besar dari harga sekarang.
- Persentase diskon dihitung dari data, bukan disimpan sebagai copy visual.
- Rating hanya tampil bila sumber rating nyata ada.
- Jumlah terjual hanya tampil bila definisi dan sumber datanya jelas.
- Badge “baru”, “promo”, dan “stok habis” berasal dari data/state.
- Kartu tanpa harga tetap stabil tinggi dan tidak mengarang angka.

### 9.3 State

| State | Tampilan |
|---|---|
| Default | surface putih, border ringan |
| Hover | border/shadow sedikit kuat, tanpa layout shift |
| Focus | focus ring 3px terlihat |
| Loading | skeleton dengan rasio gambar tetap |
| Image error | fallback gambar + alt tetap benar |
| Tanpa harga | “Harga belum tersedia” |
| Tanpa stok | “Ketersediaan belum tersedia” |
| Stok habis | badge teks + CTA terkait nonaktif |

Seluruh kartu boleh menjadi link, tetapi jangan menaruh link/tombol interaktif bertumpuk yang membuat event ambigu.

## 10. Catalog listing

### 10.1 Desktop

```text
[Breadcrumb]
[H1 + deskripsi]
┌──────────────────┬────────────────────────────────────┐
│ Filter           │ Toolbar: hasil, sort bila tersedia │
│ - kategori       │ Active filter chips               │
│ - merek          │ Product grid 4–5 kolom            │
│ - harga valid    │                                    │
│ [Reset]          │ Pagination                         │
└──────────────────┴────────────────────────────────────┘
```

### 10.2 Mobile

```text
[Breadcrumb]
[H1]
[Filter] [Urutkan bila tersedia]
[Active chips................]
[Product grid 2 kolom]
[Pagination]
```

Filter dibuka dalam drawer. Drawer wajib punya heading, tombol tutup, focus trap, Escape, dan pengembalian fokus.

### 10.3 URL dan SEO filter

- Filter penting memperbarui query URL.
- Perubahan filter mereset pagination.
- Kombinasi filter biasa tidak otomatis indexable.
- Canonical mengikuti strategi SEO proyek, bukan semua query string.
- Pagination tetap berupa link yang dapat digunakan tanpa JavaScript.
- Setelah update dinamis, fokus diarahkan ke heading hasil dan jumlah hasil diumumkan lewat `aria-live="polite"`.

### 10.4 Empty state

Isi:

- judul `Produk tidak ditemukan`;
- penjelasan singkat;
- tombol hapus filter atau kembali ke semua produk;
- tanpa ilustrasi besar yang memperlambat halaman.

## 11. Product detail

### 11.1 Desktop

```text
[Breadcrumb]
┌────────────────────┬──────────────────────────────┐
│ Galeri 45%         │ Ringkasan produk 55%         │
│ gambar + thumbnail │ brand/kategori               │
│                    │ H1                            │
│                    │ harga/ketersediaan            │
│                    │ CTA inquiry                   │
└────────────────────┴──────────────────────────────┘
[Spesifikasi]
[Deskripsi]
[Produk terkait]
[Artikel terkait bila relevan]
```

### 11.2 Mobile

Urutan:

`Breadcrumb → galeri → judul → harga/status → CTA → spesifikasi → deskripsi → produk terkait`

### 11.3 Galeri

- Jika satu gambar, jangan tampilkan thumbnail, counter, atau tombol palsu.
- Jika banyak gambar, sediakan thumbnail, counter, keyboard, swipe progresif, dan state gambar aktif.
- Seluruh media memakai dimensi/rasio tetap untuk mencegah CLS.
- Zoom/lightbox hanya ditambah bila benar-benar berfungsi dan aksesibel.

### 11.4 Ringkasan dan CTA

MVP memakai inquiry WhatsApp/email dari konfigurasi server.

- CTA memuat judul dan URL produk.
- Kanal invalid tidak dirender.
- Tidak ada pesan “pesanan berhasil”.
- Quantity, cart, dan buy-now tidak ditampilkan sebelum backend transaksi siap.
- CTA inquiry utama memakai warna brand; email dapat memakai gaya sekunder.

### 11.5 Spesifikasi

Gunakan pasangan key/value yang mudah dipindai:

```text
Merek             [nilai]
Kategori          [nilai]
SKU               [nilai]
Ketersediaan      [nilai]
[spesifikasi CMS] [nilai]
```

Field kosong tidak perlu ditampilkan. Jangan mengarang berat, minimum order, garansi, atau sertifikasi.

## 12. Artikel dan konten edukasi

Desain artikel lebih editorial, tetap memakai shell commerce.

- lebar baca ideal `720–800px`;
- H1 jelas, metadata ringkas;
- daftar isi untuk artikel panjang;
- body line-height minimal `1.65`;
- tabel dapat digulir horizontal dalam kontainernya, bukan halaman;
- produk terkait hanya bila relasi relevan;
- tidak ada banner CTA berulang yang mengganggu pembacaan.

## 13. Komponen dan prioritas

### P0 — wajib

- `Container`
- `SiteHeader`
- `Logo`
- `LiveSearch`
- `SiteFooter`
- `SectionHead`
- `Button` / `IconButton`
- `Badge`
- `Breadcrumbs`
- `BrandTile`
- `CategoryTile`
- `ProductCard`
- `ProductGrid`
- `Pagination`
- `EmptyState`
- `InquiryCta`
- loading skeleton dan image fallback

### P1 — setelah data/model tersedia

- filter sidebar + drawer;
- active filter chips;
- directory merek;
- halaman hasil pencarian penuh;
- galeri multi-gambar;
- promo section/detail;
- native share + copy URL;
- halaman kontak dan kebijakan.

### P2 — kondisional

- wishlist dengan penyimpanan user/session;
- cart dan checkout;
- review publik;
- tracking pengiriman dengan provider nyata;
- chat provider;
- aplikasi, QR, dan app-store badges;
- flash sale dengan waktu/stok server yang valid.

## 14. Component contracts

Kontrak mengikuti model EmDash aktual; contoh berikut bukan schema final:

```ts
type ProductCardView = {
  id: string;
  slug: string;
  href: string;
  title: string;
  excerpt?: string;
  image?: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
  category?: { name: string; href: string };
  brand?: { name: string };
  formattedPrice?: string;
  formattedCompareAtPrice?: string;
  availability?: "Tersedia" | "Tidak tersedia" | "Pre-order";
};

type SectionHeadProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
};

type TileProps = {
  name: string;
  href?: string;
  imageUrl?: string;
  count?: number;
};
```

Jangan menambah field produk ke schema hanya demi menyamai referensi. Tambahkan setelah sumber data dan kebutuhan bisnis disetujui.

## 15. Struktur frontend

Gunakan struktur proyek aktual dan konsolidasikan komponen berdasarkan domain:

```text
src/
├── components/
│   ├── SiteHeader.astro
│   ├── SiteFooter.astro
│   ├── Logo.astro
│   ├── SectionHead.astro
│   ├── BrandTile.astro
│   ├── CategoryTile.astro
│   ├── ProductCard.astro
│   ├── ProductGrid.astro
│   ├── InquiryCta.astro
│   └── ...
├── layouts/
│   └── Base.astro
├── pages/
│   ├── index.astro
│   ├── products/
│   └── posts/
├── styles/
│   ├── tokens.css
│   └── global.css
├── scripts/
│   └── public-client.ts
└── utils/
```

Jangan membuat abstraksi folder baru bila komponen belum cukup banyak untuk membutuhkannya.

## 16. Accessibility

Target: WCAG 2.2 AA.

Checklist minimum:

- satu H1 per halaman;
- heading tidak melompat tanpa alasan;
- landmark `header`, `nav`, `main`, `footer` berlabel jelas;
- skip link ke konten utama;
- focus ring terlihat pada semua kontrol;
- semua fungsi dapat dijalankan dengan keyboard;
- icon-only button memiliki `aria-label`;
- target sentuh minimum 44px;
- dialog/drawer memiliki focus trap, Escape, dan focus return;
- form memiliki label dan error yang terhubung;
- status dinamis memakai `aria-live` secukupnya;
- gambar informatif memiliki alt; gambar dekoratif memakai alt kosong;
- tidak mengandalkan warna saja;
- reduced motion dihormati.

## 17. Performance

- Server-render HTML untuk katalog, produk, dan artikel.
- JavaScript hanya untuk search, drawer, galeri, dan interaksi yang membutuhkan state.
- Gunakan Astro islands hanya bila manfaat jelas.
- Tetapkan `width`, `height`, atau `aspect-ratio` pada media.
- Gunakan format WebP/AVIF dan `srcset` bila pipeline media mendukung.
- Lazy-load media di bawah fold; jangan lazy-load gambar LCP.
- Hindari carousel dan library UI besar untuk fungsi kecil.
- Tidak ada request font pihak ketiga pada baseline.
- Pertahankan halaman tanpa overflow horizontal di semua viewport target.

## 18. SEO visual dan konten

- Title, description, canonical, OG, dan JSON-LD tetap dikelola dari jalur EmDash/proyek yang sudah ada.
- Product structured data hanya dirender bila harga, currency, availability, dan field wajib valid.
- Filter/search tidak membuat halaman massal tanpa nilai.
- Breadcrumb terlihat dan semantik bila tersedia.
- Nama produk tetap teks HTML, bukan bagian dari gambar.
- Copy fokus pada manfaat serta spesifikasi faktual, bukan keyword stuffing.

## 19. State matrix

Setiap halaman/komponen data wajib mempertimbangkan:

| State | Perilaku |
|---|---|
| Loading | skeleton stabil, bukan spinner penuh halaman |
| Empty | penjelasan + aksi pemulihan |
| Error | pesan aman + coba lagi bila masuk akal |
| Partial data | tampilkan field valid saja |
| Offline/provider error | jangan klaim aksi berhasil |
| Draft/preview | banner preview + noindex |
| Unavailable | CTA yang terdampak nonaktif |

## 20. Acceptance checklist desain

### Visual

- [ ] Tampilan terasa sebagai ASATECHID, bukan salinan Vins Teknik.
- [ ] Token terpusat; tidak ada warna mentah berulang di komponen.
- [ ] Grid produk stabil pada 375, 390, 768, 1024, 1280, dan 1440px.
- [ ] Tidak ada overflow horizontal.
- [ ] Kartu tanpa gambar/harga tetap rapi.

### Fungsi

- [ ] Semua link dan tombol terlihat punya aksi nyata.
- [ ] Search, pagination, filter, dan CTA inquiry punya state error/empty.
- [ ] Tidak ada cart, wishlist, promo, rating, atau checkout palsu.
- [ ] Draft tidak tampil ke publik.

### Accessibility

- [ ] Navigasi inti selesai hanya dengan keyboard.
- [ ] Focus ring dan skip link terlihat.
- [ ] Kontras teks lulus AA.
- [ ] Target sentuh minimal 44px.
- [ ] Reduced motion aktif.

### Performance dan SEO

- [ ] Gambar memiliki dimensi/rasio tetap.
- [ ] LCP tidak di-lazy-load.
- [ ] Metadata tidak duplikat.
- [ ] Canonical dan robots benar.
- [ ] Structured data hanya memakai data valid.

### Verifikasi proyek

- [ ] `npm run typecheck`
- [ ] `npm test`
- [ ] `npm run build`
- [ ] `npm run audit:site -- --base <origin> --production`
- [ ] Screenshot dan keyboard audit pada viewport target.

## 21. Keputusan yang masih dibutuhkan

Sebelum visual final atau fitur commerce lanjutan:

- brand guideline resmi: logo, warna, font, gaya foto;
- produk, kategori, merek, SKU, harga, stok, dan aset resmi;
- domain dan kontak;
- model promo;
- data rating/review/jumlah terjual;
- galeri, berat, dan minimum order;
- halaman merek dan strategi filter;
- pembayaran, pengiriman, pajak, retur, dan checkout;
- provider chat, tracking, dan aplikasi.

Sumber status utama: `docs/12-OPEN-DECISIONS.md`.

## 22. Referensi implementasi

- Requirement: `docs/01-PRD.md`
- Roadmap: `docs/11-ROADMAP.md`
- Status kerja: `docs/TODO.md`
- Keputusan teknis: `docs/DECISIONS.md`
- Model konten: `docs/03-CONTENT-MODEL.md`
- Security: `docs/08-SECURITY.md`
- Testing: `docs/09-TESTING.md`

Dokumen ini menjadi acuan desain. Jika bertentangan dengan PRD, aturan keamanan, aksesibilitas, atau larangan data karangan, dokumen dengan batasan lebih ketat menang.
