import assert from "node:assert/strict";
import test from "node:test";

import {
	auditSeoReview,
	extractDocument,
	normalizeLocalPath,
	SEVERITY_WEIGHTS,
	type AuditInput,
} from "./audit.ts";

const SITE_TITLE = "ASATECHID Commerce";
const SITE_TAGLINE = "Katalog produk dan pusat edukasi";
const CANONICAL = "https://example.com/posts/panduan-memilih-produk";
const OG_IMAGE = "https://example.com/uploads/og.jpg";
const GOOD_DESCRIPTION =
	"Panduan ringkas untuk memilih produk yang sesuai kebutuhan, lengkap dengan pertimbangan sebelum membeli.";

function paragraph(text: string): unknown {
	return {
		_type: "block",
		style: "normal",
		children: [{ _type: "span", text }],
	};
}

function heading(text: string, level = 2): unknown {
	return {
		_type: "block",
		style: `h${level}`,
		children: [{ _type: "span", text }],
	};
}

function linkBlock(text: string, href: string): unknown {
	return {
		_type: "block",
		style: "normal",
		markDefs: [{ _key: "link-1", _type: "link", href }],
		children: [
			{ _type: "span", text: "Baca " },
			{ _type: "span", text, marks: ["link-1"] },
		],
	};
}

function imageBlock(alt?: string): unknown {
	return {
		_type: "image",
		asset: { _ref: "image-demo" },
		...(alt === undefined ? {} : { alt }),
	};
}

interface InputOverrides {
	body?: unknown;
	title?: string;
	pageTitle?: string;
	description?: string | null;
	slug?: string | null;
	seoTitle?: string | null;
	seoDescription?: string | null;
	excerpt?: string | null;
	ogImage?: string | null;
	canonical?: string | null;
	expectedCanonical?: string | null;
	noIndex?: boolean;
	knownLocalPaths?: ReadonlySet<string> | null;
	featuredImage?: { url: string | null; alt: string | null } | null;
}

function makeInput(overrides: InputOverrides = {}): AuditInput {
	const pageTitle = overrides.pageTitle ?? "Panduan memilih produk";
	const title = overrides.title ?? `${pageTitle} — ${SITE_TITLE}`;
	const description =
		overrides.description === undefined ? GOOD_DESCRIPTION : overrides.description;
	const slug = overrides.slug === undefined ? "panduan-memilih-produk" : overrides.slug;
	const canonical =
		overrides.canonical === undefined
			? overrides.noIndex
				? null
				: CANONICAL
			: overrides.canonical;

	return {
		document: {
			collection: "posts",
			slug,
			body:
				overrides.body ??
				[
					heading("Pertimbangan utama"),
					paragraph(`Panduan ini menjelaskan ${"kata ".repeat(120).trim()}.`),
				],
			contentTitle: pageTitle,
			excerpt: overrides.excerpt ?? null,
			seo: {
				title: overrides.seoTitle ?? pageTitle,
				description:
					overrides.seoDescription === undefined
						? GOOD_DESCRIPTION
						: overrides.seoDescription,
				image: OG_IMAGE,
				canonical: null,
				noIndex: overrides.noIndex ?? false,
			},
			featuredImage: overrides.featuredImage ?? null,
		},
		resolved: {
			title,
			pageTitle,
			description,
			canonical,
			ogImage: overrides.ogImage === undefined ? OG_IMAGE : overrides.ogImage,
			robots: overrides.noIndex ? "noindex, nofollow" : null,
			noIndex: overrides.noIndex ?? false,
		},
		site: {
			siteTitle: SITE_TITLE,
			siteTagline: SITE_TAGLINE,
			expectedCanonical:
				overrides.expectedCanonical === undefined
					? CANONICAL
					: overrides.expectedCanonical,
			knownLocalPaths: overrides.knownLocalPaths ?? null,
		},
	};
}

test("a complete document scores 100 and does not block publishing", () => {
	const result = auditSeoReview(makeInput());

	assert.equal(result.score, 100);
	assert.equal(result.scoreLabel, "Baik");
	assert.equal(result.gate.blocked, false);
	assert.deepEqual(result.gate.reasons, []);
	assert.equal(result.issues.length, 0);
	assert.equal(result.metrics.wordCount > 100, true);
});

test("missing title is a mandatory gate", () => {
	const result = auditSeoReview(
		makeInput({ title: "", pageTitle: "", seoTitle: null }),
	);

	assert.equal(result.gate.blocked, true);
	assert.equal(result.counts.error, 1);
	assert.equal(result.issues[0]?.id, "title-missing");
	assert.equal(result.score, 100 - SEVERITY_WEIGHTS.error);
});

test("empty body is a mandatory gate", () => {
	const result = auditSeoReview(makeInput({ body: [] }));

	assert.equal(result.gate.blocked, true);
	assert.equal(result.issues.some((issue) => issue.id === "content-empty"), true);
});

test("media-only body is not treated as empty", () => {
	const result = auditSeoReview(makeInput({ body: [imageBlock("Produk demo")] }));

	assert.equal(result.issues.some((issue) => issue.id === "content-empty"), false);
	assert.equal(result.metrics.imageCount, 1);
});

test("missing slug is a mandatory gate", () => {
	const result = auditSeoReview(makeInput({ slug: null }));

	assert.equal(result.gate.blocked, true);
	assert.equal(result.issues.some((issue) => issue.id === "slug-missing"), true);
});

test("tagline fallback is a warning, not a gate", () => {
	const result = auditSeoReview(
		makeInput({
			description: SITE_TAGLINE,
			seoDescription: null,
			excerpt: null,
		}),
	);

	assert.equal(result.gate.blocked, false);
	assert.equal(
		result.issues.some((issue) => issue.id === "description-from-tagline"),
		true,
	);
	assert.equal(result.counts.warning, 1);
});

test("excerpt fallback is informational", () => {
	const result = auditSeoReview(
		makeInput({
			description: "Ringkasan singkat dari kolom excerpt.",
			seoDescription: null,
			excerpt: "Ringkasan singkat dari kolom excerpt.",
		}),
	);

	assert.equal(result.issues.some((issue) => issue.id === "description-from-excerpt"), true);
	assert.equal(result.counts.warning, 0);
});

test("long title and description become suggestions", () => {
	const longTitle = `${"Judul panjang ".repeat(6).trim()} — ${SITE_TITLE}`;
	const result = auditSeoReview(
		makeInput({
			title: longTitle,
			pageTitle: "Judul panjang ".repeat(6).trim(),
			description: "Deskripsi sangat panjang. ".repeat(10),
			seoDescription: "Deskripsi sangat panjang. ".repeat(10),
		}),
	);

	assert.equal(result.gate.blocked, false);
	assert.equal(result.issues.some((issue) => issue.id === "title-too-long"), true);
	assert.equal(result.issues.some((issue) => issue.id === "description-too-long"), true);
});

test("duplicate site suffix is flagged", () => {
	const result = auditSeoReview(
		makeInput({
			pageTitle: `Panduan memilih produk — ${SITE_TITLE}`,
			title: `Panduan memilih produk — ${SITE_TITLE} — ${SITE_TITLE}`,
		}),
	);

	assert.equal(result.issues.some((issue) => issue.id === "title-duplicate-site"), true);
});

test("images without alt text are counted", () => {
	const result = auditSeoReview(
		makeInput({
			body: [
				heading("Gambar"),
				imageBlock(),
				imageBlock("Ada teks alt"),
				paragraph("Isi pendukung."),
			],
		}),
	);

	assert.equal(result.metrics.imageCount, 2);
	assert.equal(result.metrics.missingAltCount, 1);
	assert.equal(result.issues.some((issue) => issue.id === "images-missing-alt"), true);
});

test("an H1 inside the body is flagged", () => {
	const result = auditSeoReview(
		makeInput({
			body: [heading("Judul ganda", 1), paragraph("Isi pendukung.")],
		}),
	);

	assert.equal(result.issues.some((issue) => issue.id === "content-h1"), true);
});

test("broken local links are suggestions when the path set is available", () => {
	const result = auditSeoReview(
		makeInput({
			body: [
				heading("Tautan"),
				linkBlock("halaman yang tidak ada", "/posts/tidak-ada"),
				paragraph("Isi pendukung."),
			],
			knownLocalPaths: new Set(["/", "/posts", "/posts/panduan-memilih-produk"]),
		}),
	);

	assert.equal(result.gate.blocked, false);
	assert.equal(result.issues.some((issue) => issue.id === "broken-local-link"), true);
	assert.equal(result.metrics.internalLinkCount, 1);
});

test("known local links are not flagged", () => {
	const result = auditSeoReview(
		makeInput({
			body: [
				heading("Tautan"),
				linkBlock("halaman yang ada", "/posts/panduan-memilih-produk"),
				paragraph("Isi pendukung."),
			],
			knownLocalPaths: new Set(["/", "/posts", "/posts/panduan-memilih-produk"]),
		}),
	);

	assert.equal(result.issues.some((issue) => issue.id === "broken-local-link"), false);
});

test("noindex suppresses the canonical warning and adds info", () => {
	const result = auditSeoReview(makeInput({ noIndex: true }));

	assert.equal(result.resolved.canonical, null);
	assert.equal(result.issues.some((issue) => issue.id === "noindex"), true);
	assert.equal(result.issues.some((issue) => issue.id === "canonical-missing"), false);
});

test("a different canonical is a suggestion", () => {
	const result = auditSeoReview(
		makeInput({ canonical: "https://example.com/posts/lain" }),
	);

	assert.equal(result.issues.some((issue) => issue.id === "canonical-different"), true);
});

test("the DEMO social image is flagged", () => {
	const result = auditSeoReview(
		makeInput({ ogImage: "https://example.com/og-default-demo.png" }),
	);

	assert.equal(result.issues.some((issue) => issue.id === "og-image-demo"), true);
});

test("thin content and missing subheadings are suggestions", () => {
	const result = auditSeoReview(
		makeInput({ body: [paragraph("Hanya beberapa kata saja.")] }),
	);

	assert.equal(result.issues.some((issue) => issue.id === "thin-content"), true);
	assert.equal(result.issues.some((issue) => issue.id === "no-subheadings"), false);
});

test("long content without subheadings is flagged", () => {
	const result = auditSeoReview(
		makeInput({ body: [paragraph("kata ".repeat(120).trim())] }),
	);

	assert.equal(result.issues.some((issue) => issue.id === "no-subheadings"), true);
});

test("score deductions add up from the internal weights", () => {
	const result = auditSeoReview(
		makeInput({
			body: [heading("Gambar"), imageBlock(), paragraph("kata ".repeat(120).trim())],
			ogImage: null,
		}),
	);

	// One warning (image alt) + one warning (missing OG) + one suggestion
	// (no H2? no — the heading is H2, so not) = 2 warnings.
	assert.equal(result.counts.warning, 2);
	assert.equal(result.score, 100 - 2 * SEVERITY_WEIGHTS.warning);
});

test("extractDocument reads headings, links, and image alt text", () => {
	const document = extractDocument([
		heading("Bagian", 2),
		linkBlock("tautan", "/produk"),
		imageBlock("Deskripsi gambar"),
		imageBlock(),
	]);

	assert.deepEqual(document.headings, [{ level: 2, text: "Bagian" }]);
	assert.equal(document.links.length, 1);
	assert.equal(document.links[0]?.href, "/produk");
	assert.equal(document.images.length, 2);
	assert.equal(document.images[0]?.alt, "Deskripsi gambar");
	assert.equal(document.images[1]?.alt, null);
});

test("normalizeLocalPath keeps local paths and rejects external links", () => {
	assert.equal(normalizeLocalPath("/posts/abc/?q=1#bagian"), "/posts/abc");
	assert.equal(normalizeLocalPath("/"), "/");
	assert.equal(normalizeLocalPath("https://example.com/posts/abc"), null);
	assert.equal(normalizeLocalPath("#bagian"), null);
	assert.equal(normalizeLocalPath("mailto:halo@example.com"), null);
	assert.equal(normalizeLocalPath("posts/abc"), null);
});
