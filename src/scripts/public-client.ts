/**
 * Progressive enhancement untuk halaman publik.
 * Diimpor sekali dari `Base.astro` agar Astro membundelnya menjadi modul
 * eksternal `/_astro/*.js` (diizinkan CSP `script-src 'self'` tanpa nonce).
 */
import { initHeroCarousels } from "./hero-carousel";
import { initSiteHeader } from "./site-header";

function start(): void {
	initSiteHeader();
	initHeroCarousels();
}

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", start, { once: true });
} else {
	start();
}
