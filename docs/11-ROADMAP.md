# 11 — Implementation Roadmap

Kerjakan berurutan. Jangan mulai fase berikutnya sebelum acceptance criteria fase berjalan dipenuhi atau blocker ditulis eksplisit.

## Phase 0 — Discovery & scaffold

Tasks:
- Periksa apakah repo sudah memiliki kode; identifikasi package manager, branch, tests, dan docs yang sudah ada.
- Baca dokumentasi EmDash/Astro terkini dan bandingkan opsi template.
- Buat scaffold melalui CLI resmi EmDash jika repo masih kosong.
- Verifikasi admin dapat dibuka, konten dapat disimpan, dan satu page dapat merender entry.
- Catat versi dependencies dan keputusan awal.

Acceptance:
- Proyek berjalan lokal.
- Admin/content query proof-of-concept bekerja.
- `build` dan type check yang tersedia lulus atau masalah upstream terdokumentasi.

## Phase 1 — Design system & public shell

Tasks:
- Logo/brand placeholder yang jelas bisa diganti.
- CSS tokens, typography, container, grid, buttons, badges, forms, cards, breadcrumbs.
- Responsive header/footer/nav/search shell.
- 404, error, empty states.

Acceptance:
- Mobile/tablet/desktop dicek.
- Keyboard focus dan semantic structure memenuhi baseline.

## Phase 2 — Content model + storefront

Tasks:
- Definisikan product/category/brand collections sesuai EmDash capabilities.
- Implement listing, category, product detail dan search.
- Tambahkan related products/content dari relasi yang benar.
- Gunakan data DEMO hanya di development.

Acceptance:
- CMS-created product muncul pada route canonical setelah publish.
- Produk draft tidak tampil di publik.
- Missing price/stock ditampilkan jujur.

## Phase 3 — Editorial/blog

Tasks:
- `posts` collection dengan title/slug/excerpt/body/author/category/image/related links.
- Blog index, category/topic listing bila relevan, article page.
- TOC, breadcrumbs, related articles bila bermanfaat.
- Preview and publish workflow.

Acceptance:
- Admin dapat membuat artikel, preview, publish, dan melihat hasil publik.

## Phase 4 — SEO foundation

Tasks:
- Integrasikan built-in EmDash SEO panel and page head output.
- Test titles/descriptions/canonical/Open Graph/JSON-LD/sitemap/robots/redirects.
- Setup site URL and default social image.

Acceptance:
- Tidak ada duplikasi head metadata.
- Preview/noindex/draft handling benar.

## Phase 5 — SEO Review UI

Tasks:
- Build SERP preview desktop/mobile.
- Build audit checks, labels, score explainability, publish gates.
- Add unit and integration tests.

Acceptance:
- UI memakai draft entry data dan konsisten dengan output final.
- Skor diberi label sebagai internal guidance.

## Phase 6 — Inquiry MVP

Tasks:
- Configured WhatsApp/contact CTA.
- Optional server inquiry form and protected lead management if owner wants storage.
- Spam protection and privacy requirements.

Acceptance:
- No fake success, no broken links, server validation works.

## Phase 7 — Launch hardening

Tasks:
- Security review, responsive/accessibility check, SEO route audit, performance review.
- Setup deployment, env, backup/restore, Search Console readiness.

Acceptance:
- Production checklist passed; no unknown demo secrets/data.

## Phase 8 — Full checkout (conditional)

Only start after provider/payment/shipping/tax/return policy decisions are approved.

Tasks:
- Commerce persistence and migrations.
- Cart/checkout/order management.
- Payment adapter and verified webhooks.
- Fulfillment/shipping integration, notifications and order admin.
- Idempotency, race-condition and refund tests.

Acceptance:
- Successful and failed payment paths are verified in provider sandbox and production launch checklist is approved.
