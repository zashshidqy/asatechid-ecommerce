/**
 * Progressive enhancement untuk halaman publik.
 * Diimpor sekali dari `Base.astro` agar Astro membundelnya menjadi modul
 * eksternal `/_astro/*.js` (diizinkan CSP `script-src 'self'` tanpa nonce).
 */
import { initSiteHeader } from "./site-header";

function start(): void {
	initSiteHeader();
}

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", start, { once: true });
} else {
	start();
}
