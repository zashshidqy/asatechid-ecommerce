const AUTOPLAY_MS = 5000;

/**
 * Hero carousel: scroll-snap + dots + arrows, dengan autoplay yang berhenti
 * saat hover/fokus, saat tab tidak terlihat, dan saat pengguna menekan kontrol.
 * Tanpa JS, slide pertama tetap terlihat dan track bisa digulir manual.
 */
export function initHeroCarousels(root: ParentNode = document): void {
	for (const carousel of root.querySelectorAll<HTMLElement>("[data-hero]")) {
		initCarousel(carousel);
	}
}

function initCarousel(root: HTMLElement): void {
	const track = root.querySelector<HTMLElement>("[data-hero-track]");
	if (!track) return;
	const trackEl = track;

	const slides = Array.from(track.children).filter(
		(child): child is HTMLElement => child instanceof HTMLElement,
	);
	if (slides.length < 2) return;

	const dots = Array.from(
		root.querySelectorAll<HTMLButtonElement>("[data-hero-dot]"),
	);
	const prev = root.querySelector<HTMLButtonElement>("[data-hero-prev]");
	const next = root.querySelector<HTMLButtonElement>("[data-hero-next]");
	const toggle = root.querySelector<HTMLButtonElement>("[data-hero-toggle]");
	const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

	let index = 0;
	let timer: number | null = null;
	let disposed = false;
	let userPaused = false;

	function syncToggle(): void {
		if (!toggle) return;
		toggle.setAttribute("aria-pressed", String(userPaused));
		toggle.textContent = userPaused ? "Mainkan" : "Jeda";
	}

	function pauseByUser(): void {
		userPaused = true;
		syncToggle();
		stopAutoplay();
	}

	function syncDots(): void {
		for (const [dotIndex, dot] of dots.entries()) {
			if (dotIndex === index) dot.setAttribute("aria-current", "true");
			else dot.removeAttribute("aria-current");
		}
	}

	function scrollToIndex(target: number, smooth = true): void {
		index = (target + slides.length) % slides.length;
		const left =
			slides[index].getBoundingClientRect().left -
			trackEl.getBoundingClientRect().left +
			trackEl.scrollLeft;
		trackEl.scrollTo({
			left,
			behavior: smooth && !reducedMotion.matches ? "smooth" : "auto",
		});
		syncDots();
	}

	let frame = 0;
	trackEl.addEventListener(
		"scroll",
		() => {
			if (frame) return;
			frame = window.requestAnimationFrame(() => {
				frame = 0;
				const trackLeft = trackEl.getBoundingClientRect().left;
				let nearest = 0;
				let smallest = Number.POSITIVE_INFINITY;
				for (const [slideIndex, slide] of slides.entries()) {
					const distance = Math.abs(
						slide.getBoundingClientRect().left - trackLeft,
					);
					if (distance < smallest) {
						smallest = distance;
						nearest = slideIndex;
					}
				}
				if (nearest !== index) {
					index = nearest;
					syncDots();
				}
			});
		},
		{ passive: true },
	);

	function stopAutoplay(): void {
		if (timer !== null) {
			window.clearInterval(timer);
			timer = null;
		}
	}

	function startAutoplay(): void {
		stopAutoplay();
		if (disposed || userPaused || reducedMotion.matches || document.hidden) return;
		timer = window.setInterval(() => {
			scrollToIndex(index + 1);
		}, AUTOPLAY_MS);
	}

	toggle?.addEventListener("click", () => {
		userPaused = !userPaused;
		syncToggle();
		if (userPaused) stopAutoplay();
		else startAutoplay();
	});

	prev?.addEventListener("click", () => {
		pauseByUser();
		scrollToIndex(index - 1);
	});

	next?.addEventListener("click", () => {
		pauseByUser();
		scrollToIndex(index + 1);
	});

	for (const [dotIndex, dot] of dots.entries()) {
		dot.addEventListener("click", () => {
			pauseByUser();
			scrollToIndex(dotIndex);
		});
	}

	root.addEventListener("pointerenter", stopAutoplay);
	root.addEventListener("pointerleave", startAutoplay);
	root.addEventListener("focusin", stopAutoplay);
	root.addEventListener("focusout", (event) => {
		if (!root.contains(event.relatedTarget as Node | null)) startAutoplay();
	});

	document.addEventListener("visibilitychange", () => {
		if (document.hidden) stopAutoplay();
		else startAutoplay();
	});

	reducedMotion.addEventListener("change", () => {
		if (reducedMotion.matches) stopAutoplay();
		else startAutoplay();
	});

	window.addEventListener(
		"pagehide",
		() => {
			disposed = true;
			stopAutoplay();
		},
		{ once: true },
	);

	startAutoplay();
}
