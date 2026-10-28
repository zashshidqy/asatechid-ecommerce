# DESIGN.md — Technova (E-commerce Gadget Homepage)

## 1. Overview
**Technova** adalah homepage toko e-commerce gadget/elektronik dengan gaya **clean, modern, light, dan airy**. Latar belakang putih kebiruan (lavender-white) dengan aksen biru sebagai warna utama dan oranye sebagai aksen sekunder. Kartu putih dengan sudut membulat dan bayangan sangat lembut. Produk difoto/dirender dengan latar putih bersih.

- **Platform:** Web, desktop (lebar konten ± 1100px, lebar canvas 736px pada referensi)
- **Mood:** Fresh, teknologi, tepercaya, ramah, minimalis
- **Vibe kata kunci:** soft gradient, rounded cards, white space lega, biru elektrik

### Preview implementasi (2026-10-28)

Screenshot beranda hasil implementasi di `src/pages/index.astro` (data DEMO,
dev server lokal):

| Viewport | File |
|---|---|
| Desktop 1440px | [`screenshots/home-desktop-2026-10-28.png`](screenshots/home-desktop-2026-10-28.png) |
| Mobile 390px (2x) | [`screenshots/home-mobile-2026-10-28.png`](screenshots/home-mobile-2026-10-28.png) |

Screenshot ini dokumentasi visual, bukan aset produksi. Perbarui bila
komponen/beranda berubah signifikan.

---

## 2. Color Palette

| Peran | Nama | Hex (perkiraan) | Penggunaan |
|---|---|---|---|
| Primary | Electric Blue | `#2F5FD9` | Tombol CTA, logo, link, aksen judul ("15% off"), tab aktif |
| Primary Dark | Royal Blue | `#1F4BB8` | Hover tombol, teks logo |
| Primary Light | Sky Blue | `#5B9BF0` | Ikon kategori, gradient banner |
| Accent | Orange | `#F59A3B` | Badge BESTSELLER, ikon kategori (Best Sellers, On Sale), badge keranjang |
| Background | Lavender White | `#EEF1FA` | Latar halaman & hero |
| Surface | Pure White | `#FFFFFF` | Kartu, header, input |
| Text Primary | Ink Navy | `#1A1D2E` | Judul, nama produk, harga |
| Text Secondary | Slate Gray | `#6B7280` | Subjudul, deskripsi, teks kecil |
| Text Muted | Light Gray | `#A0A6B5` | Harga coret, label kecil |
| Border | Soft Border | `#E5E8F0` | Garis tipis kartu, tab |
| Promo Gradient | Blue Gradient | `#7FB0F5 → #4F86EA → #A9C8F8` | Banner promo (MacBook Air, Save up to 35%) |
| Hero Gradient | Mist | `#F4F6FD → #E6EBFA` | Background hero dengan sparkle |

---

## 3. Typography

**Font family:** Sans-serif geometris modern — *Inter* / *Plus Jakarta Sans* / *Poppins* (fallback: system-ui, sans-serif)

| Elemen | Ukuran | Weight | Catatan |
|---|---|---|---|
| Logo "Technova" | 24px | 700 | Biru tua, huruf "T" kapital |
| Hero headline | 36–40px | 600–700 | 2 baris, "15% off" berwarna biru |
| Hero subtitle | 13–14px | 400 | Abu-abu |
| Section title (Featured Products, Just Arrived) | 18–20px | 600 | Navy |
| Nav link | 13px | 500 | Dengan caret dropdown |
| Card title (kategori) | 15px | 600 | |
| Nama produk | 11–12px | 500–600 | Maks 2 baris |
| Harga | 14–15px | 700 | Navy |
| Harga coret | 11px | 400 | Abu muted, strikethrough |
| Badge | 8–9px | 700 | Uppercase, putih di atas warna |
| Tombol CTA | 11–12px | 600 | Uppercase |
| Link "SHOP NOW >" kecil | 8–9px | 700 | Biru, uppercase |
| Top bar | 8px | 400 | Uppercase, abu |

---

## 4. Layout & Spacing

- **Grid:** Container tengah, margin kiri-kanan ± 44px (pada canvas 736px)
- **Spacing antar section:** 40–56px vertikal
- **Gap antar kartu:** 12–16px
- **Border radius:** kartu 12px, tombol 6–8px, badge 3px, pill/tab 999px, banner 14px
- **Shadow kartu:** `0 2px 12px rgba(40, 60, 120, 0.06)`
- **Padding kartu produk:** 12–14px
- **Aspek gambar produk:** ± 4:3, objek terpusat di atas latar putih

---

## 5. Struktur Halaman (Urutan Section)

1. Top Bar
2. Header / Navbar
3. Hero Carousel
4. Quick Category Cards (4 kartu)
5. Featured Products + Promo Banner (MacBook Air)
6. Just Arrived + Promo Banner (Save up to 35%)
7. Category Banners (3 kartu)
8. Featured Products (baris kedua, carousel)

---

## 6. Komponen & Elemen Lengkap

### 6.1 Top Bar
- Latar putih tipis, tinggi ± 20px, teks sangat kecil uppercase.
- **Kiri:** ikon + "WELCOME TO WORLDWIDE GADGETS STORE"
- **Kanan:** ikon + link kecil (lokasi/bahasa, "FREE SHIPPING & RETURNS", ikon mata uang/wishlist dengan aksen oranye)

### 6.2 Header / Navbar
- Latar putih, tinggi ± 44px, shadow tipis di bawah.
- **Kiri:** Logo teks **Technova** (biru tua, bold).
- **Tengah:** Menu — `Home ⌄`, `Shop ⌄`, `Blog ⌄`, `Contact`
- **Kanan:** ikon Search, ikon User, ikon Cart dengan **badge oranye (0)** dan teks total **$0**

### 6.3 Hero Carousel
- Latar gradient lavender-white dengan **partikel sparkle/bintang** kecil dan gelombang halus.
- **Kiri (teks):**
  - Headline: **"Hot Gadgets Deals"** / **"Up to 15% off"** (15% off = biru)
  - Subjudul: "The hottest tech. The coolest offers."
  - Tombol primer **SHOP NOW** (biru solid, teks putih uppercase, radius 6px, ikon panah kecil)
- **Kanan (visual):** Mockup monitor desktop putih-perak dengan wallpaper bukit pasir oranye; teks pada layar "Our first ever desktop mockup"; keyboard putih, mouse putih, dan mug/cangkir putih sebagai dekorasi di sisi kiri & kanan.
- **Kontrol:** Panah kiri `‹` dan kanan `›` (ikon bulat/outline di tepi), **3 dot pagination** (aktif = dot terisi gelap, lainnya outline) di kiri bawah.

### 6.4 Quick Category Cards (4 kolom)
Kartu putih horizontal, ikon bulat berwarna di kiri, judul + link di kanan.

| Judul | Warna Ikon | Link |
|---|---|---|
| Best Sellers | Oranye | SHOP NOW › |
| New Arrivals | Biru | SHOP NOW › |
| Top Rated | Biru (ikon bintang) | SHOP NOW › |
| On Sale | Oranye | SHOP NOW › |

### 6.5 Section "Featured Products" (baris 1)
- **Header:** Judul "Featured Products" + **filter tab pill**: `All` (aktif, biru solid, teks putih), `Laptops`, `Smartphones`, `Headphones`, `On Sale` + tombol panah kecil `‹ ›` di kanan.
- **Grid:** 3 kartu produk + 1 banner promo vertikal di kanan.

**Product Card (komponen):**
- Latar putih, radius 12px, shadow lembut
- Badge di kiri atas (warna per kategori)
- Ikon hati (wishlist) outline di kanan atas
- Gambar produk di tengah
- Nama produk (maks 2 baris), harga tebal, harga coret (opsional)

| # | Badge | Produk | Harga |
|---|---|---|---|
| 1 | BESTSELLER (oranye) | 4K Samsung Yamablash Expo (monitor lengkung warna-warni) | $1,150 |
| 2 | NEW (biru) | AppIDe Xlbe (earbuds putih + case) | $249 ~~$349~~ |
| 3 | HOT (biru) | XR-2977 Closed-Back Wireless Headphones (hitam) | $700 |
| 4* | — | Taka Altra 5G Smartphone (layar biru-oranye) | $949 ~~$960~~ |

\* Kartu ke-4 berada di dalam rangkaian carousel / sejajar dengan banner promo.

**Promo Banner — MacBook Air**
- Gradient biru, radius 14px
- Judul besar putih: **MacBook Air**
- Subjudul uppercase kecil: "WITH M4 CHIP & LIQUID RETINA DISPLAY"
- Label: "Starting at" + harga besar **$950**
- Gambar: dua laptop terbuka dengan wallpaper warna-warni (biru/oranye)
- Dekorasi: sparkle halus

### 6.6 Section "Just Arrived"
- **Header:** "Just Arrived" + link biru uppercase **VIEW ALL**
- **Grid:** 4 kartu produk kecil + 1 banner promo.

| Produk | Harga |
|---|---|
| NOZO Smartwatch (jam hitam layar bulat) | $350 |
| Galaxy Tab Pro Z10 (tablet layar warna-warni) | $699 |
| PHX-900 Wireless Gaming Mouse (hitam) | $89 |
| EpoMax Bluetooth Speaker (silinder hitam) | $150 |

**Promo Banner — Weekly Discounts**
- Gradient biru muda, radius 14px
- Pill putih kecil di kanan atas: **SHOP ALL!**
- Judul: **Save up to 35%** (putih, besar)
- Subjudul: "on Weekly Discounts"
- Tombol biru **SHOP NOW** (dengan panah)
- Gambar: speaker/perangkat bulat hitam di kanan bawah

### 6.7 Category Banners (3 kolom)
Kartu putih lebar; teks di kiri, gambar produk di kanan.

| Judul | Sub | Tombol | Gambar |
|---|---|---|---|
| Game Controllers | From $160 | SHOP NOW › (pill biru muda) | Gamepad hitam |
| Smartphones | From $650 | SHOP NOW › | 2 smartphone + sepatu/objek biru |
| Smart Home | From $160 | SHOP NOW › | Speaker/hub putih + perangkat |

### 6.8 Section "Featured Products" (baris 2 — Carousel)
- Header sama dengan baris 1 (judul + tombol panah `‹ ›`)
- Panah besar `‹` `›` di tepi kiri/kanan seluruh carousel
- 4 kartu dengan label kecil (mis. "Back: $50") di kiri atas dan ikon kecil di kanan atas:

| Produk | Harga |
|---|---|
| Neuled CrooiCam OC GPS (action camera hitam) | $120 |
| YOS Wireless Noise Canceling Headphone (headset putih-hitam) | $140 |
| Largo 8B Smart TV Yamablash Expo (TV dengan pemandangan matahari terbenam) | $799 |
| Bobos 2-460 Smart Vacuum (robot vacuum hitam bulat) | $999 |

---

## 7. Komponen UI Reusable

### Buttons
- **Primary:** bg `#2F5FD9`, teks putih uppercase 11px/600, padding `10px 20px`, radius 6px, ikon panah opsional. Hover: `#1F4BB8`.
- **Secondary / Pill kecil:** bg `#E4ECFB`, teks biru, radius 6px, padding `4px 12px`.
- **Text link:** biru, uppercase, 9px/700, diikuti `›`.
- **Icon button (carousel):** lingkaran/kotak putih 22–28px, border `#E5E8F0`, ikon chevron abu.

### Badges
- Bentuk persegi kecil radius 3px, teks putih uppercase 8px/700.
- Warna: **Oranye** (BESTSELLER), **Biru** (NEW, HOT).

### Filter Tabs (Pill)
- Aktif: bg biru, teks putih. Tidak aktif: transparan, teks abu, border tipis.

### Cards
- bg putih, radius 12px, shadow lembut, hover: naik 2px + shadow lebih kuat.

### Icons
- Gaya outline tipis (1.5px stroke), ukuran 16–20px (Lucide/Feather style).
- Ikon kategori berada dalam lingkaran 32–36px berwarna solid (oranye/biru) dengan ikon putih.

### Pagination Dots
- 3 dot, 6px; aktif solid navy, nonaktif outline navy.

---

## 8. Interaksi & Motion
- Hero: auto-slide 5 detik, transisi fade/slide 400ms.
- Kartu produk: hover lift (`translateY(-2px)`), ikon hati berubah merah saat aktif.
- Tab filter: transisi warna 200ms, grid produk fade saat filter berganti.
- Tombol: hover darken + scale 1.02.
- Carousel: scroll-snap + tombol panah, swipe di mobile.

---

## 9. Responsif (Rekomendasi)
- **Desktop (≥1024px):** layout seperti referensi (4 kolom).
- **Tablet (768–1023px):** grid 2–3 kolom, banner promo turun di bawah baris produk.
- **Mobile (<768px):** 1–2 kolom, menu menjadi hamburger, hero teks di atas visual, quick category jadi scroll horizontal.

---

## 10. Prompt Ringkas untuk Stitch

> Design a clean, modern e-commerce homepage for a gadget store called **Technova**. Light lavender-white background, electric blue (#2F5FD9) primary and orange (#F59A3B) accent, white rounded cards with soft shadows, sans-serif typography (Inter/Poppins). Include: top bar, navbar (Home, Shop, Blog, Contact, search/user/cart icons), hero carousel "Hot Gadgets Deals Up to 15% off" with a desktop monitor mockup and SHOP NOW button, four quick category cards (Best Sellers, New Arrivals, Top Rated, On Sale), Featured Products with filter tabs (All, Laptops, Smartphones, Headphones, On Sale) and a MacBook Air promo banner ($950), a Just Arrived row (smartwatch, tablet, gaming mouse, speaker) with a "Save up to 35%" banner, three category banners (Game Controllers, Smartphones, Smart Home), and a second Featured Products carousel (action camera, headphones, smart TV, robot vacuum). Product cards have badges, wishlist heart, name, price, and optional strikethrough price. Airy spacing, rounded corners, subtle blue gradients.