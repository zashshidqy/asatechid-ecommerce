/**
 * SEO Review audit engine.
 *
 * Pure functions only: the caller resolves the final page metadata (mirroring
 * `getSeoMeta()` + `Base.astro`) and passes it in. That keeps the audit
 * consistent with what the public page actually emits and makes it testable
 * without a database or a CMS request.
 *
 * The score is an internal editorial guide. It is not a Google ranking
 * prediction and must be labelled as such wherever it is displayed.
 */

export type IssueSeverity = "error" | "warning" | "suggestion" | "info";

export const SEVERITY_ORDER: readonly IssueSeverity[] = [
	"error",
	"warning",
	"suggestion",
	"info",
];

export const SEVERITY_LABELS: Record<IssueSeverity, string> = {
	error: "Wajib",
	warning: "Peringatan",
	suggestion: "Saran",
	info: "Info",
};

/**
 * Internal weights. Errors are also publish gates; the weights only affect the
 * guidance score, never the gate itself.
 */
export const SEVERITY_WEIGHTS: Record<IssueSeverity, number> = {
	error: 25,
	warning: 8,
	suggestion: 2,
	info: 0,
};

export const SCORE_EXPLANATION =
	"Skor = 100 dikurangi total bobot temuan. Bobot internal: wajib 25, peringatan 8, saran 2, info 0. " +
	"Skor ini adalah panduan editorial internal, bukan prediksi peringkat Google.";

export interface AuditIssue {
	id: string;
	severity: IssueSeverity;
	/** Short label shown in the checklist. */
	label: string;
	/** One-sentence explanation of why this matters. */
	message: string;
	/** Optional concrete value, count, or path. */
	detail?: string;
}

export interface ResolvedSeoOutput {
	/** Full `<title>` emitted by the page head. */
	title: string;
	/** Title without the site-name suffix (`og:title`). */
	pageTitle: string;
	/** Description actually emitted by the page head. */
	description: string | null;
	/** Canonical emitted by the page head, or null when suppressed. */
	canonical: string | null;
	/** Social image emitted by the page head. */
	ogImage: string | null;
	/** Robots directive, or null when the default applies. */
	robots: string | null;
	noIndex: boolean;
}

export interface AuditSeoFields {
	title: string | null;
	description: string | null;
	image: string | null;
	canonical: string | null;
	noIndex: boolean;
}

export interface AuditDocumentInput {
	collection: string;
	slug: string | null;
	/** Raw Portable Text (or a plain string) for the main body. */
	body: unknown;
	/** Content title field, used only for explanation text. */
	contentTitle: string | null;
	excerpt: string | null;
	/** Raw SEO panel values, used to explain fallbacks. */
	seo: AuditSeoFields;
	featuredImage: { url: string | null; alt: string | null } | null;
}

export interface AuditSiteContext {
	siteTitle: string;
	siteTagline: string | null;
	/** Absolute canonical the public page would emit for this entry. */
	expectedCanonical: string | null;
	/**
	 * Published local paths plus known static routes. `null` disables local
	 * link resolution (used by the publish hook to keep publishing fast).
	 */
	knownLocalPaths: ReadonlySet<string> | null;
}

export interface AuditInput {
	document: AuditDocumentInput;
	resolved: ResolvedSeoOutput;
	site: AuditSiteContext;
}

export interface AuditMetrics {
	wordCount: number;
	headingCount: number;
	imageCount: number;
	missingAltCount: number;
	internalLinkCount: number;
	externalLinkCount: number;
}

export interface AuditBreakdown {
	severity: IssueSeverity;
	count: number;
	points: number;
	deduction: number;
}

export interface AuditGate {
	blocked: boolean;
	reasons: string[];
}

export interface AuditSerpPreview {
	title: string;
	displayUrl: string;
	description: string;
}

export interface AuditResult {
	score: number;
	scoreLabel: string;
	scoreExplanation: string;
	issues: AuditIssue[];
	counts: Record<IssueSeverity, number>;
	breakdown: AuditBreakdown[];
	gate: AuditGate;
	resolved: ResolvedSeoOutput;
	serp: AuditSerpPreview;
	metrics: AuditMetrics;
}

export interface ExtractedDocument {
	plainText: string;
	wordCount: number;
	headings: Array<{ level: number; text: string }>;
	images: Array<{ alt: string | null }>;
	links: Array<{ href: string; text: string }>;
	/** Blocks that carry media or embeds rather than text. */
	mediaBlockCount: number;
}

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const STATIC_PATHS = new Set([
	"/",
	"/posts",
	"/products",
	"/search",
	"/404",
	"/500",
	"/robots.txt",
	"/sitemap.xml",
	"/rss.xml",
	"/feed.xml",
	"/favicon.ico",
	"/og-default-demo.png",
]);

const STATIC_PATH_PREFIXES = [
	"/category/",
	"/tag/",
	"/products/category/",
	"/_emdash/",
	"/uploads/",
	"/sitemap-",
];

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asString(value: unknown): string | null {
	return typeof value === "string" ? value : null;
}

function nodeText(node: unknown): string {
	if (typeof node === "string") return node;
	if (Array.isArray(node)) return node.map(nodeText).join("");
	if (!isRecord(node)) return "";
	if (typeof node.text === "string") return node.text;
	if (Array.isArray(node.children)) return node.children.map(nodeText).join("");
	return "";
}

function normalizeText(value: string): string {
	return value.replace(/\s+/g, " ").trim();
}

/**
 * Extracts headings, links, images, and readable text from Portable Text.
 *
 * Unknown block types (embeds, tables, callouts) count as media/content so a
 * body made only of embeds is not reported as empty. Link marks are read from
 * `markDefs`; a direct `link.href` on a span is also accepted for imported
 * content.
 */
export function extractDocument(value: unknown): ExtractedDocument {
	const headings: Array<{ level: number; text: string }> = [];
	const images: Array<{ alt: string | null }> = [];
	const links: Array<{ href: string; text: string }> = [];
	const textParts: string[] = [];
	let mediaBlockCount = 0;

	const walk = (node: unknown): void => {
		if (Array.isArray(node)) {
			for (const child of node) walk(child);
			return;
		}
		if (!isRecord(node)) return;

		const type = asString(node._type);

		if (type === "image") {
			images.push({ alt: asString(node.alt) });
			mediaBlockCount += 1;
			return;
		}

		if (type === "block") {
			const style = asString(node.style);
			const text = normalizeText(nodeText(node));
			if (text) textParts.push(text);
			if (style && /^h[1-6]$/.test(style)) {
				headings.push({ level: Number(style.slice(1)), text });
			}

			const markDefs = Array.isArray(node.markDefs) ? node.markDefs : [];
			const hrefs = new Map<string, string>();
			for (const definition of markDefs) {
				if (!isRecord(definition)) continue;
				const key = asString(definition._key);
				const href = asString(definition.href);
				if (key && href) hrefs.set(key, href);
			}

			const children = Array.isArray(node.children) ? node.children : [];
			for (const child of children) {
				if (!isRecord(child)) continue;
				const childText = normalizeText(nodeText(child));
				const marks = Array.isArray(child.marks) ? child.marks : [];
				for (const mark of marks) {
					if (typeof mark !== "string") continue;
					const href = hrefs.get(mark);
					if (href) links.push({ href, text: childText });
				}
				if (isRecord(child.link)) {
					const href = asString(child.link.href);
					if (href) links.push({ href, text: childText });
				}
			}
			return;
		}

		if (type) {
			// Embed, table, figure, or another custom block. Count it as content
			// and keep any readable text without descending into its children
			// (which could double-count the same text).
			mediaBlockCount += 1;
			const text = normalizeText(nodeText(node));
			if (text) textParts.push(text);
			return;
		}

		if (Array.isArray(node.children)) walk(node.children);
	};

	walk(value);

	const plainText = normalizeText(textParts.join(" "));
	const wordCount = plainText ? plainText.split(/\s+/).filter(Boolean).length : 0;

	return { plainText, wordCount, headings, images, links, mediaBlockCount };
}

function decodePath(path: string): string {
	try {
		return decodeURIComponent(path);
	} catch {
		return path;
	}
}

/**
 * Returns a normalized local path for a link, or null when the href is not a
 * local absolute path (external URL, mailto/tel, fragment, or relative link).
 */
export function normalizeLocalPath(href: string): string | null {
	const trimmed = href.trim();
	if (!trimmed || trimmed.startsWith("#")) return null;
	if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(trimmed)) return null;
	if (!trimmed.startsWith("/")) return null;

	const [rawPath] = trimmed.split(/[?#]/);
	if (!rawPath) return null;

	const decoded = decodePath(rawPath);
	return decoded.length > 1 ? decoded.replace(/\/+$/, "") : "/";
}

function isKnownNonContentPath(path: string): boolean {
	if (STATIC_PATHS.has(path)) return true;
	return STATIC_PATH_PREFIXES.some((prefix) => path.startsWith(prefix));
}

function classifyLink(href: string): "internal" | "external" | "other" {
	const trimmed = href.trim();
	if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith("//")) return "external";
	if (trimmed.startsWith("/") && !trimmed.startsWith("//")) return "internal";
	return "other";
}

function formatDisplayUrl(url: string | null): string {
	if (!url) return "URL belum tersedia";
	try {
		const parsed = new URL(url);
		const host = parsed.hostname || "situs-anda";
		const segments = parsed.pathname.split("/").filter(Boolean);
		const path = segments.length > 0 ? ` › ${segments.join(" › ")}` : "";
		return `${host}${path}`;
	} catch {
		return url;
	}
}

function scoreLabel(score: number, blocked: boolean): string {
	if (blocked) return "Publikasi diblokir";
	if (score >= 85) return "Baik";
	if (score >= 70) return "Cukup";
	return "Perlu perbaikan";
}

function sortIssues(issues: AuditIssue[]): AuditIssue[] {
	return [...issues].sort(
		(a, b) => SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity),
	);
}

/**
 * Runs every audit check and returns the score, checklist, SERP preview, and
 * publish gate. Gate reasons contain only `error` severity findings, so
 * warnings and suggestions never block publishing.
 */
export function auditSeoReview(input: AuditInput): AuditResult {
	const issues: AuditIssue[] = [];
	const document = extractDocument(input.document.body);
	const resolved = input.resolved;
	const slug = input.document.slug?.trim() || null;
	const seo = input.document.seo;

	const add = (issue: AuditIssue): void => {
		issues.push(issue);
	};

	// Mandatory checks -----------------------------------------------------
	if (!resolved.pageTitle.trim()) {
		add({
			id: "title-missing",
			severity: "error",
			label: "Judul halaman kosong",
			message: "Isi judul konten atau judul SEO sebelum menerbitkan.",
		});
	}

	if (!slug) {
		add({
			id: "slug-missing",
			severity: "error",
			label: "Slug kosong",
			message: "Slug diperlukan untuk membentuk URL halaman.",
		});
	}

	if (document.wordCount === 0 && document.mediaBlockCount === 0) {
		add({
			id: "content-empty",
			severity: "error",
			label: "Konten utama kosong",
			message: "Tambahkan teks atau media ke konten utama sebelum menerbitkan.",
		});
	}

	// Slug format ----------------------------------------------------------
	if (slug && !SLUG_PATTERN.test(slug)) {
		add({
			id: "slug-format",
			severity: "suggestion",
			label: "Format slug tidak standar",
			message: "Gunakan huruf kecil, angka, dan tanda hubung tanpa spasi.",
			detail: slug,
		});
	}

	// Description ----------------------------------------------------------
	const description = resolved.description?.trim() || null;
	if (!description) {
		add({
			id: "description-missing",
			severity: "warning",
			label: "Deskripsi meta kosong",
			message: "Hasil pencarian akan memakai deskripsi bawaan atau tanpa deskripsi.",
		});
	} else {
		if (!seo.description) {
			if (input.document.excerpt?.trim()) {
				add({
					id: "description-from-excerpt",
					severity: "info",
					label: "Deskripsi memakai ringkasan",
					message: "Deskripsi meta diambil dari kolom ringkasan (excerpt).",
				});
			} else {
				add({
					id: "description-from-tagline",
					severity: "warning",
					label: "Deskripsi memakai tagline situs",
					message: "Isi deskripsi meta khusus halaman agar cuplikan lebih relevan.",
				});
			}
		}

		if (description.length > 160) {
			add({
				id: "description-too-long",
				severity: "suggestion",
				label: "Deskripsi terlalu panjang",
				message: `${description.length} karakter; mesin pencari umumnya menampilkan sekitar 160.`,
				detail: `${description.length}/160`,
			});
		} else if (description.length < 50) {
			add({
				id: "description-too-short",
				severity: "suggestion",
				label: "Deskripsi terlalu pendek",
				message: `${description.length} karakter; pertimbangkan 50–160 karakter.`,
				detail: `${description.length}/160`,
			});
		}
	}

	// Title ----------------------------------------------------------------
	const title = resolved.title.trim();
	const pageTitle = resolved.pageTitle.trim();
	if (title.length > 60) {
		add({
			id: "title-too-long",
			severity: "suggestion",
			label: "Judul tampilan panjang",
			message: `${title.length} karakter termasuk nama situs; mesin pencari dapat memotongnya.`,
			detail: `${title.length}/60`,
		});
	} else if (pageTitle.length > 0 && pageTitle.length < 15) {
		add({
			id: "title-too-short",
			severity: "suggestion",
			label: "Judul terlalu pendek",
			message: "Judul pendek kurang menjelaskan isi halaman.",
			detail: `${pageTitle.length} karakter`,
		});
	}

	if (
		pageTitle.length > 0 &&
		input.site.siteTitle.length > 0 &&
		pageTitle.endsWith(input.site.siteTitle)
	) {
		add({
			id: "title-duplicate-site",
			severity: "warning",
			label: "Nama situs berulang",
			message:
				"Judul halaman sudah berakhir dengan nama situs, sehingga akhiran situs akan tampil dua kali.",
		});
	}

	// Headings -------------------------------------------------------------
	const h1s = document.headings.filter((heading) => heading.level === 1);
	if (h1s.length > 0) {
		add({
			id: "content-h1",
			severity: "warning",
			label: "H1 di dalam konten",
			message: "Judul halaman sudah menjadi H1. Gunakan H2/H3 untuk subjudul di konten.",
		});
	}

	const subheadings = document.headings.filter(
		(heading) => heading.level === 2 || heading.level === 3,
	);
	if (subheadings.length === 0 && document.wordCount >= 100) {
		add({
			id: "no-subheadings",
			severity: "suggestion",
			label: "Belum ada subjudul",
			message: "Tambahkan H2/H3 agar konten lebih mudah dipindai.",
		});
	}

	const firstHeading = document.headings[0];
	if (firstHeading && firstHeading.level === 3) {
		add({
			id: "heading-order",
			severity: "suggestion",
			label: "Urutan subjudul",
			message: "Subjudul pertama adalah H3; mulai dengan H2.",
		});
	}

	// Thin content ---------------------------------------------------------
	if (document.wordCount > 0 && document.wordCount < 100) {
		add({
			id: "thin-content",
			severity: "suggestion",
			label: "Konten tipis",
			message: `${document.wordCount} kata; pertimbangkan konten yang lebih lengkap.`,
			detail: `${document.wordCount} kata`,
		});
	}

	// Images ---------------------------------------------------------------
	const missingAlt = document.images.filter((image) => !image.alt?.trim()).length;
	if (missingAlt > 0) {
		add({
			id: "images-missing-alt",
			severity: "warning",
			label: "Gambar tanpa teks alt",
			message: `${missingAlt} gambar di konten belum memiliki teks alt.`,
			detail: `${missingAlt} gambar`,
		});
	}

	const featured = input.document.featuredImage;
	if (featured?.url && !featured.alt?.trim()) {
		add({
			id: "featured-image-missing-alt",
			severity: "warning",
			label: "Gambar utama tanpa teks alt",
			message: "Isi teks alt pada gambar utama.",
		});
	}

	// Social image ---------------------------------------------------------
	if (!resolved.ogImage) {
		add({
			id: "og-image-missing",
			severity: "warning",
			label: "Gambar sosial kosong",
			message: "Atur gambar SEO atau gambar sosial default situs.",
		});
	} else if (resolved.ogImage.includes("og-default-demo")) {
		add({
			id: "og-image-demo",
			severity: "warning",
			label: "Gambar sosial masih DEMO",
			message: "Gambar sosial memakai placeholder DEMO; ganti sebelum peluncuran.",
		});
	} else if (!seo.image) {
		add({
			id: "og-image-default",
			severity: "info",
			label: "Gambar sosial default",
			message: "Memakai gambar sosial default situs.",
		});
	}

	// Canonical and indexability ------------------------------------------
	if (resolved.noIndex) {
		add({
			id: "noindex",
			severity: "info",
			label: "Halaman noindex",
			message: "Halaman tidak akan diindeks dan canonical tidak dipancarkan.",
		});
	} else if (!resolved.canonical) {
		add({
			id: "canonical-missing",
			severity: "warning",
			label: "Canonical kosong",
			message: "Halaman tidak memiliki URL canonical.",
		});
	} else if (
		input.site.expectedCanonical &&
		resolved.canonical !== input.site.expectedCanonical
	) {
		add({
			id: "canonical-different",
			severity: "suggestion",
			label: "Canonical berbeda",
			message: "Canonical menunjuk ke URL lain. Pastikan ini disengaja.",
			detail: resolved.canonical,
		});
	}

	// Local links ----------------------------------------------------------
	const internalLinks = document.links.filter(
		(link) => classifyLink(link.href) === "internal",
	);
	const externalLinks = document.links.filter(
		(link) => classifyLink(link.href) === "external",
	);

	if (input.site.knownLocalPaths) {
		const checked = new Set<string>();
		for (const link of internalLinks) {
			const path = normalizeLocalPath(link.href);
			if (!path || checked.has(path)) continue;
			checked.add(path);
			if (isKnownNonContentPath(path)) continue;
			if (!input.site.knownLocalPaths.has(path)) {
				add({
					id: "broken-local-link",
					severity: "suggestion",
					label: "Tautan lokal tidak ditemukan",
					message:
						"Tautan menunjuk ke halaman yang tidak ada di konten terbit saat ini.",
					detail: link.href,
				});
			}
		}
	}

	// Score ----------------------------------------------------------------
	const sortedIssues = sortIssues(issues);
	const counts: Record<IssueSeverity, number> = {
		error: 0,
		warning: 0,
		suggestion: 0,
		info: 0,
	};
	for (const issue of sortedIssues) counts[issue.severity] += 1;

	const breakdown: AuditBreakdown[] = SEVERITY_ORDER.map((severity) => ({
		severity,
		count: counts[severity],
		points: SEVERITY_WEIGHTS[severity],
		deduction: counts[severity] * SEVERITY_WEIGHTS[severity],
	}));

	const totalDeduction = breakdown.reduce((sum, item) => sum + item.deduction, 0);
	const score = Math.max(0, Math.min(100, 100 - totalDeduction));

	const gateReasons = sortedIssues
		.filter((issue) => issue.severity === "error")
		.map((issue) => `${issue.label}: ${issue.message}`);
	const blocked = gateReasons.length > 0;

	return {
		score,
		scoreLabel: scoreLabel(score, blocked),
		scoreExplanation: SCORE_EXPLANATION,
		issues: sortedIssues,
		counts,
		breakdown,
		gate: { blocked, reasons: gateReasons },
		resolved,
		serp: {
			title: resolved.title || "(judul belum diisi)",
			displayUrl: formatDisplayUrl(
				resolved.canonical ?? input.site.expectedCanonical,
			),
			description: resolved.description ?? "(deskripsi belum diisi)",
		},
		metrics: {
			wordCount: document.wordCount,
			headingCount: subheadings.length,
			imageCount: document.images.length,
			missingAltCount: missingAlt,
			internalLinkCount: internalLinks.length,
			externalLinkCount: externalLinks.length,
		},
	};
}
