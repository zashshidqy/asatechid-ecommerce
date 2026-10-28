/**
 * Small progressive-enhancement behaviour for the public site header.
 *
 * Kept in a module (instead of inline code) so Astro bundles it as a
 * same-origin script, allowing the public Content-Security-Policy to use
 * `script-src 'self'` without `'unsafe-inline'`.
 */

export function initSiteHeader(): void {
	// EmDash's LiveSearch input has no label prop. Add an accessible name.
	for (const input of document.querySelectorAll<HTMLInputElement>(
		".emdash-live-search-input",
	)) {
		if (!input.getAttribute("aria-label")) {
			input.setAttribute("aria-label", "Cari di situs");
		}
	}

	// Close the mobile menu with Escape.
	document.addEventListener("keydown", (event) => {
		if (event.key !== "Escape") return;
		const open = document.querySelector<HTMLDetailsElement>(
			".nav-disclosure[open]",
		);
		if (open) {
			open.open = false;
			open.querySelector("summary")?.focus();
		}
	});
}
