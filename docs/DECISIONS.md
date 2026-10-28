# Technical Decisions (ADR ringkas)

## ADR-001 — Baseline Astro + EmDash dari template Starter (Node.js)

**Status:** diterima (Phase 0)

**Konteks:** Proyek baru; `docs/02-ARCHITECTURE.md` belum tersedia di repo. README meminta scaffold dari template resmi EmDash yang sesuai target deployment. Cloudflare Workers + D1 + R2 disebut sebagai *kandidat*, bukan keputusan final.

**Keputusan:** Memakai template resmi **Starter** varian **Node.js** (SQLite + storage lokal) melalui file resmi `emdash-cms/templates/starter`, karena `create-emdash` hanya interaktif dan tidak bisa dijalankan non-interaktif di lingkungan ini.

**Konsekuensi:**
- Development lokal tanpa akun cloud.
- Deployment final belum dikunci; migrasi ke Cloudflare nanti memerlukan varian `starter-cloudflare` atau penyesuaian adapter/D1/R2.
- Struktur sengaja minimal agar desain dan content model dibangun pada fase berikutnya.

## ADR-002 — Versi dependency

**Status:** diterima

- Astro `^7.4.2` (rilis stabil terbaru per 2026-10-21).
- EmDash `^1.3.0` (CLI melaporkan v1.3.1 saat dijalankan).
- `@astrojs/node` `^11.1.5`, React/ReactDOM `^19.2.4` (diperlukan admin EmDash).
- TypeScript strict di `tsconfig.json`.

**Catatan:** Node.js minimum **v22.23.4** (dari Astro/EmDash). Mesin pengembangan sudah memakai v22.23.4 sejak 2026-10-26 (lihat ADR-014); CI/deployment tetap harus memakai versi tersebut.

## ADR-003 — Konten DEMO, bukan data bisnis

**Status:** diterima

Seed hanya berisi dua entri bertanda `(DEMO)`. Tidak ada produk, harga, SKU, stok, merek, nomor kontak, domain, atau konfigurasi pembayaran. Semua data bisnis menunggu input owner. Catatan: `docs/12-OPEN-DECISIONS.md` yang disebut di `docs/README.md` belum ada di repo, sehingga daftar keputusan terbuka sementara dicatat di `docs/TODO.md`.

## ADR-004 — SEO: pakai bawaan EmDash dulu

**Status:** diterima

EmDash menyimpan field SEO per entri (`title`, `description`, `image`, `canonical`, `noIndex`) dan menyediakan `getSeoMeta()` + `EmDashHead`. Phase 0 hanya memakai jalur ini. SEO Review UI kustom (SERP preview + audit) dikerjakan terpisah di Phase 5 dan tidak boleh menduplikasi tag head.

## ADR-005 — Bahasa dan locale awal

**Status:** diterima

Konten publik Bahasa Indonesia (`<html lang="id">`, format tanggal `id-ID`). Multi-bahasa di luar MVP.

## ADR-006 — Tidak ada patch paksa untuk audit

**Status:** diterima

`npm audit` menemukan 6 high severity pada `zod` transitive milik `emdash`. Perbaikan otomatis menurunkan `emdash` ke 0.36.0 (breaking). Tidak diterapkan; pantau rilis upstream dan evaluasi ulang sebelum launch.

## ADR-007 — Design token provisional & system font stack

**Status:** diterima (Phase 1)

**Konteks:** Brand guideline ASATECHID belum tersedia. Halaman harus tetap tampil rapi dan mudah diganti.

**Keputusan:**
- Semua warna, font, spacing, radius, dan bayangan berada di `src/styles/tokens.css`.
- Font memakai system stack (`system-ui`, `Segoe UI`, dst.) agar tidak ada dependensi jaringan dan tidak mengklaim font brand resmi.
- Palet netral hangat + satu aksen hijau gelap, semuanya ditandai *provisional*.

**Konsekuensi:** Mengganti brand cukup mengubah token; komponen tidak menyimpan nilai warna mentah. Perlu audit ulang kontras setelah token final.

## ADR-008 — Shell tanpa sidebar widget bawaan

**Status:** diterima (Phase 1)

**Konteks:** `WidgetArea` EmDash merender UI bawaan (judul/placeholder berbahasa Inggris) dan menduplikasi input pencarian di halaman artikel.

**Keputusan:** Halaman artikel memakai layout satu kolom. Konten terkait akan dibangun eksplisit pada Phase 3 dari relasi konten, bukan dari widget generik.

**Konsekuensi:** `sidebar` widget area tetap ada di seed tetapi belum dipakai; dapat dihapus pada Phase 3 bila tidak diperlukan.

## ADR-009 — Aksesibilitas baseline

**Status:** diterima (Phase 1)

- Skip link ke `#main`.
- Satu `<h1>` per halaman, landmark `header`/`nav`/`main`/`footer` dengan label.
- `:focus-visible` global 3px; target sentuh minimum 2.75rem untuk kontrol utama.
- Menu mobile memakai `<details>/<summary>` (tanpa JS untuk membuka), ditutup dengan Escape, dan input pencarian EmDash diberi `aria-label` lewat skrip kecil.
- `prefers-reduced-motion` menonaktifkan transisi/animasi.
- Kontras teks diuji ≥ 4.5:1 untuk teks normal.

**Konsekuensi:** Skrip kecil bergantung pada class internal EmDash (`.emdash-live-search-input`); perlu dicek ulang saat upgrade EmDash.

## ADR-010 — Model konten Phase 2: `products` + `brands` + taxonomy `product_category`

**Status:** diterima (Phase 2), menunggu tinjauan setelah `02-ARCHITECTURE.md` tersedia

**Konteks:** `docs/02-ARCHITECTURE.md` dan dokumen `04`–`10`, `12`–`17` belum ada. PRD hanya menetapkan kebutuhan fungsional (F-02, F-03, F-06) tanpa skema final.

**Keputusan:**
- `products` routable di `/products/{slug}` dengan field: `title`, `excerpt`, `description` (portableText), `featured_image`, `brand` (reference), `related_products` (reference diri), `specifications` (repeater), `price`, `currency`, `availability`, `sku`, `featured`.
- `brands` dibuat sebagai collection **non-routable** (tanpa `urlPattern`) karena belum ada kebutuhan halaman merek dan belum ada data merek nyata.
- Kategori memakai taxonomy bawaan `product_category` (hierarkis) alih-alih collection terpisah, agar arsip kategori memakai mekanisme EmDash (`getTaxonomyTermsWithCacheHint`, filter `where`).

**Konsekuensi:**
- Menambah halaman merek nanti cukup memberi `urlPattern` pada `brands` + route baru; tidak perlu migrasi data.
- Kategori tidak punya body/SEO sendiri; bila nanti butuh konten kategori, perlu collection terpisah.
- `sku` belum unik secara constraint; validasi keunikan harus ditambahkan sebelum dipakai untuk transaksi.

## ADR-011 — Kebijakan harga & ketersediaan yang jujur

**Status:** diterima (Phase 2)

**Konteks:** Tidak ada data harga, mata uang, atau stok nyata. Menampilkan angka placeholder berisiko menyesatkan.

**Keputusan:**
- Harga hanya dirender bila `price` berupa angka valid **dan** `currency` berisi kode non-kosong. Format memakai `Intl.NumberFormat("id-ID")`; kode mata uang tak dikenal tetap ditampilkan agar tidak ambigu.
- Ketersediaan hanya dirender bila nilainya salah satu opsi select (`Tersedia`, `Tidak tersedia`, `Pre-order`).
- Bila kosong, halaman detail menampilkan “Harga belum tersedia” / “Ketersediaan belum tersedia” plus catatan singkat; kartu listing menyembunyikan baris meta.
- Tidak ada tombol beli/checkout/CTA kontak sampai kanal inquiry dikonfigurasi (Phase 6).
- Product/Offer JSON-LD ditunda ke Phase 4 dengan syarat data valid.

**Konsekuensi:** Data bisnis yang belum lengkap tidak pernah dirender sebagai fakta. Perubahan opsi `availability` harus disertai migrasi nilai lama.

## ADR-012 — Produk terkait eksplisit, fallback kategori, `featured` difilter di memori

**Status:** diterima (Phase 2)

**Konteks:** Relasi `related_products` bisa kosong; tipe `WhereValue` pada EmDash 1.3.x tidak menerima boolean sehingga `featured` tidak bisa difilter di query.

**Keputusan:**
- Halaman detail memakai `references.related_products` bila ada. Bila kosong, mengambil produk terbit lain dalam kategori yang sama (kecuali dirinya), maksimal 3.
- Reference lookup tidak menghidrasi taxonomy; `getTermsForEntries("products", ids, "product_category")` dipanggil untuk melengkapi badge kategori pada kartu terkait.
- Beranda mengambil 12 produk terbaru lalu memfilter `featured === true` di memori (maksimal 3 tampil).

**Konsekuensi:** Fallback kategori bisa menampilkan produk yang tidak dikurasi; ini disengaja agar halaman tidak kosong. Filter `featured` di memori perlu diganti query terindeks bila katalog melewati satu halaman kandidat.

## ADR-013 — Verifikasi alur konten memakai HTTP API EmDash + session dev-bypass

**Status:** diterima (Phase 2, khusus development)

**Konteks:** Setup passkey tidak dapat diselesaikan headless dan `emdash content` CLI memerlukan token yang tidak dikeluarkan oleh dev-bypass. Admin UI butuh browser.

**Keputusan:** Verifikasi tulis dilakukan dengan memanggil API internal EmDash memakai cookie session dari `GET /_emdash/api/auth/dev-bypass` dan header `X-EmDash-Request: 1`: `POST /_emdash/api/content/{collection}`, `POST .../{id}/publish`, `DELETE .../{id}`, `DELETE .../{id}/permanent`.

**Konsekuensi:** Endpoint dev-bypass hanya aktif saat `import.meta.env.DEV`. Prosedur ini tidak boleh dipakai di production dan bukan pengganti uji UI admin manual. Entri uji selalu dihapus permanen setelah verifikasi.

## ADR-014 — Upgrade Node.js ke v22.23.4 (user-level)

**Status:** diterima (2026-10-26)

**Konteks:** Astro 7 menolak berjalan di Node v22.22.2 dan mensyaratkan `>=22.23.4`. Mesin pengembangan memakai Fedora 43 dengan Node dari paket sistem; `sudo` tidak tersedia tanpa kata sandi dan tidak ada Node version manager.

**Keputusan:**
- Mengunduh tarball resmi `node-v22.23.4-linux-x64` dari `nodejs.org`, memverifikasi checksum SHA-256 terhadap `SHASUMS256.txt`, lalu mengekstrak ke `~/.local/opt/`.
- Membuat symlink `node`, `npm`, `npx`, `corepack` di `~/.local/bin` (sudah lebih awal di `PATH` daripada `/usr/bin`).
- Memasang ulang dependency dengan `npm ci` memakai Node baru, termasuk native binding (`@libsql`, `sharp`, `lightningcss`, `@astrojs/compiler`).

**Konsekuensi:**
- Shell baru otomatis memakai Node v22.23.4; tidak perlu mengubah paket sistem.
- Upgrade Node di masa depan cukup mengganti symlink `~/.local/opt/node` dan menjalankan `npm ci`.
- CI dan server produksi harus dipasangi versi yang sama; versi ini belum diuji pada runtime deployment final.
- Perubahan tidak tercatat di repository (di luar proyek) sehingga harus didokumentasikan di `README`/pipeline saat deployment disiapkan.

## ADR-015 — Penulis artikel memakai bylines EmDash

**Status:** diterima (Phase 3)

**Konteks:** PRD F-04 meminta artikel memiliki penulis. EmDash 1.3 menyediakan entitas **bylines** yang terhubung ke kredit konten, lengkap dengan nama tampilan, bio, avatar, dan label peran. Membuat collection `authors` sendiri akan menduplikasi fitur bawaan dan memutus integrasi admin.

**Keputusan:**
- Penulis artikel menggunakan bylines EmDash (`bylines` di root seed + `bylines` pada entri konten), bukan collection kustom.
- Seed berisi satu byline DEMO (`tim-demo`) dengan bio yang menyatakan dirinya fiktif.
- Halaman detail menampilkan byline inline di header dan kotak “Tentang penulis” dengan bio; kartu artikel menampilkan nama penulis.

**Konsekuensi:**
- Avatar byline dirender dari `avatarStorageKey` melalui endpoint media EmDash, dengan fallback inisial bila tidak ada avatar.
- Bila nanti butuh halaman penulis publik, route dapat dibangun di atas byline yang sudah ada tanpa migrasi model.
- Bio/avatar adalah data DEMO sampai penulis sungguhan diisi melalui admin.

## ADR-016 — Daftar isi dirender server dengan anchor hasil generate

**Status:** diterima (Phase 3)

**Konteks:** Artikel panjang membutuhkan daftar isi, tetapi menambah JavaScript untuk scroll-spy/TOC memperbesar bundle dan tidak perlu untuk kebutuhan dasar. Editor EmDash tidak menjamin setiap heading memiliki anchor manual.

**Keputusan:**
- `annotateHeadings()` memindai blok Portable Text `h2`/`h3`, membuat slug stabil dari teks (dengan sufiks numerik untuk duplikat), menempelkan `_tocId`, dan mengembalikan daftar heading.
- `PortableBlock.astro` merender elemen heading dengan `id` tersebut; `TableOfContents.astro` merender tautan anchor dari data yang sama.
- Desktop memakai rail sticky; di bawah 64rem rail disembunyikan dan diganti `<details>` di atas isi artikel. Tidak ada JavaScript.

**Konsekuensi:**
- Anchor berubah bila teks heading diedit; tautan lama ke bagian tersebut bisa putus. Belum ada mekanisme override anchor manual.
- Hanya `h2`/`h3` yang masuk daftar isi; heading di dalam blok kustom tidak terdeteksi.
- Bila nanti butuh penanda bagian aktif saat scroll, JavaScript progresif dapat ditambahkan tanpa mengubah markup dasar.

## ADR-017 — Urutan referensi pada seed harus menunjuk entri lebih awal

**Status:** diterima (Phase 3)

**Konteks:** Seed EmDash menyelesaikan `$ref:` saat entri target sudah dibuat. Referensi ke entri yang muncul **setelah** entri sumber akan dilewati dengan peringatan, dan pada `--on-conflict update` referensi tersebut hilang.

**Keputusan:**
- Semua nilai `$ref:` di `seed.json` hanya menunjuk entri yang posisinya lebih awal di array `content`.
- Artikel pertama (`panduan-memilih-produk-demo`) sengaja tidak memiliki `related_posts` eksplisit; halaman detail memakai fallback kategori yang sama. Artikel lain menunjuk artikel pertama.
- Seed diverifikasi dengan menerapkannya berulang (`--on-conflict update`) tanpa peringatan referensi.

**Konsekuensi:**
- Menambah relasi baru harus memperhatikan urutan array; dokumentasi ini menjadi pengingat.
- Relasi dua arah memerlukan salah satu sisi memakai fallback atau dipasang setelah kedua entri ada.
- Bila seed dijalankan pada database kosong, fallback kategori memastikan halaman artikel pertama tetap memiliki bacaan lanjutan.

## ADR-018 — Satu origin publik untuk canonical, OG, sitemap, dan robots

**Status:** diterima (Phase 4)

**Konteks:** Metadata yang dibangun dari `Astro.url.origin` mengikuti host request. Di balik reverse proxy TLS, origin internal (`http://...`) berbeda dari origin publik (`https://...`), sehingga canonical dan sitemap bisa salah. EmDash sendiri punya `getPublicOrigin()` internal dengan urutan: `config.siteUrl` → `EMDASH_SITE_URL`/`SITE_URL` → origin request.

**Keputusan:**
- `src/utils/site-url.ts` menjadi satu-satunya tempat resolusi origin, dengan urutan: site setting `url` → `config.siteUrl` → `process.env.EMDASH_SITE_URL`/`SITE_URL` → `import.meta.env` (build-time) → origin request.
- `Base.astro` memakai helper ini untuk canonical, `siteUrl` JSON-LD, dan gambar sosial absolut.
- `getSeoMeta()` pada halaman konten menerima origin yang sama, sehingga canonical dari SEO panel tetap konsisten.
- Canonical membuang query string; halaman `noindex` tidak mengeluarkan canonical sama sekali.

**Konsekuensi:**
- Produksi wajib mengisi `EMDASH_SITE_URL` (atau site setting `url`). Tanpa itu perilaku kembali ke origin request.
- Halaman pagination (`?cursor=`) dikanonikalkan ke halaman pertama.
- Redirect bawaan EmDash tetap memakai origin request pada header `Location`; ini tidak memengaruhi canonical.

## ADR-019 — JSON-LD artikel via page context, Product ditunda

**Status:** diterima (Phase 4)

**Konteks:** `EmDashHead` membangun JSON-LD dari `PublicPageContext`. `pageType: "article"` + `canonical` + `articleMeta` menghasilkan `BlogPosting`; tipe lain menghasilkan `WebSite`. Product/Offer membutuhkan harga, mata uang, dan ketersediaan yang belum tersedia.

**Keputusan:**
- Artikel mengirim `pageType="article"`, `articleMeta` (published, modified, author), dan canonical sehingga `BlogPosting` dirender lengkap dengan `image`, `url`, tanggal, penulis, dan publisher.
- Produk dan halaman statis tetap `pageType="website"`; tidak ada `Product`/`Offer` JSON-LD sampai data penawaran valid tersedia.
- Tidak menulis JSON-LD manual di template.

**Konsekuensi:**
- Halaman produk saat ini mendapat JSON-LD `WebSite` bawaan EmDash (bukan `Product`). Ini bukan markup yang salah, tetapi belum memberi rich result produk.
- Saat harga/stok tersedia, tambahkan `Product` JSON-LD lewat kontribusi page metadata/plugin dan uji dengan validator; jangan menduplikasi tag.
- Author JSON-LD berupa `Person` dengan nama tampilan; URL profil belum ada.

## ADR-020 — Gambar sosial default berupa placeholder DEMO

**Status:** diterima (Phase 4)

**Konteks:** Belum ada brand guideline atau aset sosial resmi. Halaman tanpa gambar utama tetap membutuhkan `og:image` agar tautan yang dibagikan tidak kosong.

**Keputusan:**
- Menyediakan `public/og-default-demo.png` (1200×630) yang secara eksplisit menulis “DEMO — ganti gambar sosial sebelum publikasi”.
- `Base.astro` memakai urutan: gambar entri/SEO panel → `settings.seo.defaultOgImage.url` → placeholder DEMO.
- Admin dapat mengganti default melalui Site Settings tanpa mengubah kode.

**Konsekuensi:**
- Placeholder tidak boleh dipakai di produksi; ganti melalui Site Settings atau ganti file dan perbarui dokumentasi.
- Placeholder memakai token warna provisional, bukan identitas brand final.

## ADR-021 — Redirect lama memakai fitur bawaan EmDash + seed

**Status:** diterima (Phase 4)

**Konteks:** Entri DEMO `welcome` dihapus permanen; tautan lama ke `/posts/welcome` sebaiknya tidak berakhir 404. EmDash menyediakan redirect manager dan dukungan `redirects` di seed.

**Keputusan:**
- Menambahkan redirect 301 `/posts/welcome` → `/posts` di seed, sehingga dapat direproduksi di environment baru.
- Redirect produksi berikutnya ditambahkan lewat admin atau seed setelah URL lama diketahui; tidak ada daftar manual di kode.

**Konsekuensi:**
- Redirect seed diberi `groupName: "DEMO"` agar mudah dikenali dan dihapus.
- Redirect mengembalikan `Location` absolut berdasarkan origin request; canonical tetap memakai origin publik terkonfigurasi.

## ADR-022 — SEO Review dibangun sebagai plugin native EmDash dengan Block Kit

**Status:** diterima (Phase 5)

**Konteks:** Roadmap Phase 5 meminta UI pratinjau SERP, audit, skor, dan publish gate. EmDash 1.3 menyediakan `editorPanels` untuk panel di editor konten, route plugin untuk data panel, Block Kit (`@emdash-cms/blocks`) untuk UI deklaratif, dan hook `content:beforePublish` untuk kebijakan publikasi. Membangun UI React kustom atau halaman admin terpisah akan menduplikasi mekanisme editor dan gate.

**Keputusan:**
- SEO Review adalah plugin native `definePlugin` dengan entrypoint `src/plugins/seo-review/index.ts`, didaftarkan di `astro.config.mjs` sebagai `format: "native"`.
- Panel didaftarkan lewat `admin.editorPanels` untuk `posts`, `products`, dan `pages`; route `panel` mengembalikan blok Block Kit, bukan HTML/React.
- Kapabilitas plugin dibatasi: `content:read`, `content:revisions:read`, `schema:read`, `hooks.content-policy:register`.
- Route panel memakai permission `content:read_drafts`; dispatch editor EmDash tetap menegakkan kepemilikan entri (`content:edit_own`/`edit_any`).
- Logika audit dan adapter dipisahkan ke `src/lib/seo-review/` sebagai modul murni yang dapat diuji tanpa CMS.

**Konsekuensi:**
- Panel mengikuti gaya dan batasan Block Kit (teks biasa, bukan Markdown); pratinjau SERP adalah simulasi, bukan render HTML Google.
- Plugin berjalan in-process dengan akses penuh host; kapabilitas tetap ditegakkan oleh `PluginContextFactory`, tetapi tidak ada isolasi sandbox.
- Menambah koleksi yang diaudit cukup mengubah daftar `REVIEWED_COLLECTIONS` dan panel; gate mengikuti daftar yang sama.
- Dependency `@emdash-cms/blocks` menambah ukuran bundle admin; warning chunk > 500 kB tetap ada dan tidak memengaruhi halaman publik.

## ADR-023 — Panel mengaudit revisi draf terakhir yang tersimpan

**Status:** diterima (Phase 5)

**Konteks:** Acceptance Phase 5 mensyaratkan UI memakai data draf dan konsisten dengan output final. Baris konten EmDash menyimpan data live dan `draftRevisionId`; slug yang diedit distaging sebagai `_slug` di revisi draf. Membaca hanya baris live akan menampilkan konten terbit, bukan yang sedang diedit.

**Keputusan:**
- Panel memuat baris konten (`ctx.content.get`) lalu menggabungkannya dengan revisi draf (`ctx.content.getRevision`) bila `draftRevisionId` ada.
- Kunci berawalan `_` dibuang dari data revisi; `_slug` dipakai sebagai slug efektif bila ada, meniru `hydrateDraftData()` milik EmDash.
- Publish hook memakai data yang sudah dihidrasi EmDash (`event.content`), sehingga gate menilai data yang benar-benar akan diterbitkan.
- Panel menyatakan secara eksplisit bahwa perubahan yang belum disimpan tidak terlihat.

**Konsekuensi:**
- Pengguna harus menyimpan draf sebelum panel menampilkan perubahan terbaru.
- Bila revisi draf hilang/rusak, panel jatuh ke data live; publish gate tetap memakai hidrasi ketat EmDash dan dapat menolak jika hidrasi gagal.
- Perilaku ini bergantung pada bentuk internal revisi EmDash (`_slug`); perlu ditinjau saat upgrade mayor.

## ADR-024 — Publish gate hanya memblokir masalah wajib

**Status:** diterima (Phase 5)

**Konteks:** Gate yang memblokir semua temuan akan menghambat alur editorial normal (misalnya konten pendek atau deskripsi memakai tagline). Sebaliknya, gate yang tidak memblokir apa pun tidak memenuhi tujuan Phase 5.

**Keputusan:**
- Gate `content:beforePublish` hanya memblokir tiga kondisi: judul halaman kosong, konten utama kosong (tanpa teks dan tanpa blok media), dan slug kosong.
- Deskripsi yang jatuh ke tagline situs, panjang judul/deskripsi, alt gambar, konten tipis, tautan rusak, dan canonical berbeda tetap berupa peringatan/saran dan **tidak** memblokir.
- Bila audit gate sendiri gagal (error tak terduga), hook mencatat error dan **tidak** membatalkan publikasi; kegagalan plugin tidak boleh mengunci CMS.
- Alasan penolakan dikembalikan sebagai pesan `PUBLISH_REJECTED` yang menyebut temuan wajib.

**Konsekuensi:**
- Konten yang lolos gate belum tentu “baik” secara SEO; skor dan checklist tetap menjadi panduan.
- Perubahan cakupan gate harus disertai pembaruan unit test dan dokumentasi.
- Gate berjalan untuk ketiga koleksi; koleksi lain tidak terpengaruh.

## ADR-025 — Skor audit memakai bobot tetap dan dilabeli panduan internal

**Status:** diterima (Phase 5)

**Konteks:** Skor numerik mudah disalahartikan sebagai prediksi peringkat Google. Bobot arbitrer juga dapat menyesatkan bila tidak dijelaskan.

**Keputusan:**
- Skor = 100 dikurangi total bobot temuan, dibatasi 0–100.
- Bobot tetap: wajib 25, peringatan 8, saran 2, info 0.
- Panel menampilkan rincian bobot dan teks “panduan editorial internal, bukan prediksi peringkat Google”.
- Label skor: “Publikasi diblokir” bila gate aktif, “Baik” ≥ 85, “Cukup” ≥ 70, selain itu “Perlu perbaikan”.
- Pemeriksaan tautan lokal rusak hanya berjalan di panel karena memerlukan daftar path terbit; publish hook melewatinya (`knownLocalPaths: null`) agar tetap cepat.

**Konsekuensi:**
- Skor tidak membandingkan antar-situs dan tidak mengukur Core Web Vitals, kecepatan, atau crawlability.
- Menambah pemeriksaan baru mengubah skor; bobot harus ditinjau agar tidak menumpuk hukuman untuk masalah sejenis.
- Pemeriksaan tautan di panel memakai maksimal 200 entri terbit per koleksi; katalog yang jauh lebih besar dapat melewatkan path lama (tidak ada positif palsu, tetapi bisa ada negatif palsu).

## ADR-026 — CTA kontak config-driven, tanpa form atau penyimpanan lead

**Status:** diterima (Phase 6)

**Konteks:** Phase 6 meminta CTA WhatsApp/kontak yang benar-benar dikonfigurasi, dengan opsi form hanya bila pemilik menginginkan penyimpanan lead. Pemilik memilih WhatsApp + email dan **tidak** memilih form. Nomor/email sebenarnya belum diberikan, sehingga CTA tidak boleh memakai nilai karangan atau menampilkan tautan rusak.

**Keputusan:**
- Nomor dan email dibaca dari env server `INQUIRY_WHATSAPP_NUMBER` dan `INQUIRY_EMAIL`, dideklarasikan lewat `env.schema` Astro dengan `context: "server"`, `access: "secret"`, dan `optional: true`.
- Halaman produk meresolusi konfigurasi sekali, mencatat peringatan bila nilai tidak valid, dan meneruskan hasilnya ke `InquiryCta`.
- Hanya kanal valid yang dirender. Bila tidak ada kanal valid, CTA diganti tombol `disabled` dan pesan “Kanal kontak belum tersedia”; tidak ada tautan eksternal atau status sukses palsu.
- Pesan WhatsApp/email memuat judul produk dan URL canonical produk, sehingga admin mengetahui konteks permintaan.
- Tidak ada form, endpoint inquiry, tabel lead, atau pengiriman email server-side. Situs tidak menyimpan isi pesan; catatan privasi ditampilkan di CTA.
- WhatsApp membuka tab baru dengan `rel="noopener noreferrer"`; email memakai `mailto:`.

**Konsekuensi:**
- CTA produksi tetap nonaktif sampai env diisi. Ini disengaja dan harus dilaporkan sebagai blocker data, bukan diisi dengan nomor contoh.
- Mengubah nilai kontak memerlukan restart proses; nilai tidak dirahasiakan tetapi tidak dikirim ke bundle client.
- Karena tidak ada penyimpanan, belum ada spam control/rate limit. Bila form ditambahkan nanti, diperlukan validasi server, persetujuan privasi, dan akses admin terbatas (sesuai PRD F-07).
- CTA hanya ada di halaman detail produk; halaman kontak khusus dan CTA site-wide ditunda.

## ADR-027 — Validasi nomor WhatsApp dan pembentukan tautan inquiry

**Status:** diterima (Phase 6)

**Konteks:** `wa.me` membutuhkan nomor internasional tanpa `+`, spasi, atau tanda baca. Situs tidak mengetahui kode negara pengguna/pemilik, sehingga nomor lokal berawalan `0` tidak dapat dikonversi dengan aman. Tautan `mailto:` juga bisa rusak bila alamat mengandung karakter query.

**Keputusan:**
- Normalisasi WhatsApp menerima `+`, digit, spasi, titik, tanda hubung, dan tanda kurung; hanya digit yang disimpan. Nomor harus 8–15 digit dan tidak boleh berawalan `0`.
- Nomor yang tidak valid dianggap tidak dikonfigurasi; kanal lain tetap dirender. Peringatan server tidak mencantumkan nilai mentah.
- Email divalidasi dengan pola konservatif (karakter umum, tanpa spasi/`?`/`&`/`#`), maksimal 254 karakter.
- Judul, URL, subjek, dan body di-encode dengan `encodeURIComponent` sebelum dimasukkan ke tautan.
- Unit test mencakup nomor internasional valid, nomor lokal/terlalu pendek/terlalu panjang/berisi huruf, email valid/tidak valid, konfigurasi kosong, dan encoding pesan.

**Konsekuensi:**
- Pemilik wajib memberi nomor format internasional (mis. `+62 ...`); nomor lokal akan ditolak dengan peringatan.
- Tidak ada inferensi kode negara atau konversi otomatis, sehingga tidak ada tebakan yang bisa menghasilkan tautan ke nomor salah.
- Perubahan aturan validasi harus disertai pembaruan test dan dokumentasi env.

## ADR-028 — CSP publik dengan nonce, CSP admin EmDash tidak ditimpa

**Status:** diterima (Phase 7)

**Konteks:** EmDash sudah memasang baseline header dan CSP ketat untuk `/_emdash/*`, tetapi halaman publik belum punya CSP. Astro punya fitur `security.csp`, tetapi fitur itu global dan dapat bentrok dengan CSP/inline bootstrap admin EmDash. Halaman publik memuat satu inline script header dan beberapa blok `<style>` scoped Astro.

**Keputusan:**
- `src/middleware.ts` menambahkan CSP hanya untuk path non-`/_emdash`.
- Nonce acak per request dibuat dengan `node:crypto`, disimpan di `Astro.locals.cspNonce`, dan dipakai inline script header.
- `script-src 'self' 'nonce-…'`; tidak ada `'unsafe-inline'` untuk script.
- `style-src 'self' 'unsafe-inline'` karena Astro merender scoped style sebagai `<style>` inline.
- `frame-ancestors 'self'`, `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, `connect-src 'self'`.
- `X-Frame-Options: SAMEORIGIN` disetel eksplisit untuk publik; CSP admin EmDash dibiarkan.
- HSTS hanya ditambahkan bila request HTTPS langsung atau `X-Forwarded-Proto: https`.
- Header memakai pola set-if-absent agar kebijakan host/CDN yang lebih ketat tetap menang.
- Saat `astro dev` saja, `script-src` menambah `'unsafe-eval'` dan `connect-src` menambah `ws:`/`wss:` untuk Vite HMR; build produksi tidak memuatnya.

**Konsekuensi:**
- Inline script baru di halaman publik wajib memakai nonce atau dipindah ke modul same-origin; jika tidak, akan diblokir.
- `style-src 'unsafe-inline'` melemahkan perlindungan CSS injection, tetapi tidak mengeksekusi script.
- Reverse proxy wajib meneruskan `X-Forwarded-Proto` agar HSTS aktif di balik TLS termination.
- Astro CSP global tidak diaktifkan agar admin tetap berfungsi.

## ADR-029 — Audit situs dan launch check sebagai gerbang rilis

**Status:** diterima (Phase 7)

**Konteks:** Pemeriksaan SEO, aksesibilitas, header, sitemap, dan data produksi sebelumnya manual dan mudah terlewat. Sebagian pemeriksaan memerlukan server berjalan; sebagian lain cukup membaca file/env.

**Keputusan:**
- `scripts/site-audit.mjs` (tanpa dependency) mengaudit route inti + URL sitemap: status, title/description/canonical/robots, OG, JSON-LD, heading, alt, ID duplikat, link safety, label dasar, header keamanan, robots, dan admin surface. Mode `--production` memeriksa dev-bypass/API admin.
- `scripts/launch-check.ts` memeriksa `EMDASH_ENCRYPTION_KEY`, `EMDASH_SITE_URL`, kontak, marker DEMO di seed, file sensitif terlacak, dan keberadaan dokumen wajib. Mode `--staging` menurunkan DEMO/kontak menjadi warning.
- Keduanya dijalankan manual/CI; `check:launch` sengaja gagal sampai data produksi tersedia.
- `audit:site` memerlukan server; `check:launch` tidak.

**Konsekuensi:**
- Audit statis tidak menggantikan browser/E2E, screen reader, atau Core Web Vitals lapangan.
- Menambah route/header/metadata baru harus disertai pembaruan audit.
- `check:launch` akan gagal selama DEMO/domain/kontak belum final; ini disengaja, bukan regresi.

## ADR-030 — Override zod 4.6.7 untuk menutup advisory memory exhaustion

**Status:** diterima (Phase 7)

**Konteks:** `npm audit` melaporkan 6 high dari `zod@4.5.4` (GHSA-mrhx-c7xc-m3w5, CWE-770). EmDash dan paket `@emdash-cms/*` mem-pin `zod` tepat 4.5.4, sehingga `npm audit fix` tidak menawarkan perbaikan tanpa perubahan breaking.

**Keputusan:**
- Tambahkan `"overrides": { "zod": "4.6.7" }` di `package.json`.
- Verifikasi ulang: `npm ls zod` (semua 4.6.7), `npm audit` (0), typecheck, 33 test, build, dan `emdash doctor` semuanya lulus.

**Konsekuensi:**
- Override berada di luar jaminan versi EmDash; tinjau ulang setiap upgrade EmDash.
- Bila EmDash membutuhkan perilaku spesifik 4.5.4, override harus dilepas dan risiko didokumentasikan.
- Advisory ini adalah DoS memory, bukan eksekusi kode; tetap ditutup karena murah dan kompatibel.

## ADR-031 — Backup database di-untrack; history lama masih menjadi blocker

**Status:** diterima (Phase 7)

**Konteks:** `data.db.bak-20261026` terlacak di Git dan sudah ada di remote `main`. File berisi user dev dan konten demo; pemeriksaan tidak menemukan token/kredensial aktif. Database dan upload tidak boleh berada di repository.

**Keputusan:**
- Jalankan `git rm --cached data.db.bak-20261026` (file lokal tetap ada).
- Tambahkan `data.db.*` ke `.gitignore` di samping `data.db` dan `data.db-*`.
- Dokumentasikan prosedur backup/restore di `docs/10-DEPLOYMENT.md`.
- Catat bahwa purge history dan rotasi kunci adalah blocker operasional sebelum repo dianggap aman/publik.

**Konsekuensi:**
- Menghapus dari commit terbaru tidak menghapus data dari history/remote.
- Jika repo pernah publik, `EMDASH_ENCRYPTION_KEY` dan sesi admin harus dianggap perlu rotasi.
- Backup produksi harus disimpan terenkripsi di luar repository dan diuji restore.

## ADR-032 — Admin lokal memakai passkey; dev-bypass hanya fallback

**Status:** diterima (2026-10-28)

**Konteks:** EmDash 1.x tidak memakai username/password; autentikasi admin berbasis **passkey (WebAuthn)**. Wizard setup menolak membuat admin bila `users` sudah berisi baris (`ADMIN_EXISTS`, HTTP 400), sehingga akun sisa `dev@emdash.local` dari dev-bypass memblokir setup permanen. Saat pengujian, `POST /_emdash/api/content/{collection}` juga mengembalikan `401 NOT_AUTHENTICATED` meski sesi valid (GET/PUT/publish 200) pada proses dev server yang dijalankan sebelum reset + setup.

**Keputusan:**
- Akun admin lokal adalah akun passkey asli yang didaftarkan lewat wizard `/_emdash/admin` di browser.
- Untuk mereset jalur setup, gunakan `POST /_emdash/api/setup/dev-reset` (dev-only) setelah snapshot `VACUUM INTO`; jangan menghapus tabel EmDash dengan SQL langsung.
- Setelah reset/setup (atau setelah mengubah konfigurasi/plugin), **restart dev server** sebelum menguji tulis. Gejala state basi: create konten 401 `NOT_AUTHENTICATED` sementara endpoint lain normal.
- `dev-bypass` tetap dipakai untuk uji otomatis/headless dan bukan pengganti uji UI admin; endpoint ini 403 di production.

**Konsekuensi:**
- Passkey terikat ke origin (`localhost:4321`); mengganti host/port memerlukan pendaftaran passkey baru.
- Reset user menghapus seluruh baris `users` (termasuk passkey), tetapi tidak menyentuh koleksi/konten/media.
- Diagnosis 401 pada create tidak boleh disimpulkan sebagai bug otorisasi kode sebelum dev server di-restart dan sesi diuji ulang.

