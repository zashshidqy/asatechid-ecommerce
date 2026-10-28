#!/usr/bin/env node
/**
 * Dependency-free launch audit for the public site.
 *
 * Usage:
 *   node scripts/site-audit.mjs --base http://127.0.0.1:4328
 *   node scripts/site-audit.mjs --base https://example.com --production
 *
 * Checks status codes, metadata/canonical/robots, JSON-LD, heading order,
 * image alt text, duplicate IDs, link safety, basic form labelling, security
 * headers, sitemap entries, and robots.txt. Exits non-zero on FAIL.
 */

const args = process.argv.slice(2);
const baseArg = args.find((arg) => arg.startsWith("--base="))?.split("=")[1]
	?? (args.includes("--base") ? args[args.indexOf("--base") + 1] : undefined);
const base = (baseArg ?? process.env.SITE_AUDIT_BASE ?? "http://localhost:4321").replace(/\/+$/, "");
const production = args.includes("--production");

const failures = [];
const warnings = [];
const passes = [];
const internalLinks = new Set();

function fail(message) {
	failures.push(message);
}
function warn(message) {
	warnings.push(message);
}
function pass(message) {
	passes.push(message);
}

function decodeEntities(value) {
	return value
		.replace(/&amp;/g, "&")
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/&nbsp;/g, " ");
}

function stripTags(value) {
	return decodeEntities(value.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
}

function parseAttributes(source) {
	const attrs = new Map();
	const re = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
	for (const match of source.matchAll(re)) {
		attrs.set(
			match[1].toLowerCase(),
			decodeEntities(match[2] ?? match[3] ?? match[4] ?? ""),
		);
	}
	return attrs;
}

function tags(html, name) {
	const re = new RegExp(`<${name}\\b([^>]*)>`, "gi");
	return [...html.matchAll(re)].map((match) => parseAttributes(match[1]));
}

function elementText(html, name) {
	const re = new RegExp(`<${name}\\b[^>]*>([\\s\\S]*?)</${name}>`, "gi");
	return [...html.matchAll(re)].map((match) => stripTags(match[1]));
}

async function fetchPage(path) {
	const url = new URL(path, `${base}/`);
	let response;
	try {
		response = await fetch(url, { redirect: "manual" });
	} catch (error) {
		fail(`${path}: request failed (${error.message})`);
		return null;
	}
	const body = await response.text();
	return { url, response, body };
}

function expectedCanonical(pathname) {
	return new URL(pathname.replace(/\/+$/, "") || "/", `${base}/`).href;
}

function auditPage(path, page, options = {}) {
	const { response, body } = page;
	const expectedStatus = options.status ?? 200;
	if (response.status !== expectedStatus) {
		fail(`${path}: expected HTTP ${expectedStatus}, got ${response.status}`);
	}

	const isNoindex = options.noindex === true;
	const robots = tags(body, "meta")
		.filter((meta) => meta.get("name")?.toLowerCase() === "robots")
		.map((meta) => meta.get("content") ?? "");
	const title = elementText(body, "title");
	const descriptions = tags(body, "meta")
		.filter((meta) => meta.get("name")?.toLowerCase() === "description")
		.map((meta) => meta.get("content") ?? "");
	const canonicals = tags(body, "link")
		.filter((link) => link.get("rel")?.toLowerCase() === "canonical")
		.map((link) => link.get("href") ?? "");

	if (title.length !== 1 || !title[0]) fail(`${path}: expected exactly one non-empty <title>`);
	if (descriptions.length !== 1 || !descriptions[0]) {
		fail(`${path}: expected exactly one non-empty meta description`);
	}
	if (isNoindex) {
		if (!robots.some((value) => value.includes("noindex"))) {
			fail(`${path}: expected noindex robots directive`);
		}
		if (canonicals.length > 0) fail(`${path}: noindex page must not emit a canonical`);
	} else {
		if (robots.some((value) => value.includes("noindex"))) {
			fail(`${path}: indexable page unexpectedly has noindex`);
		}
		if (canonicals.length !== 1) {
			fail(`${path}: expected exactly one canonical, got ${canonicals.length}`);
		} else if (canonicals[0] !== expectedCanonical(path)) {
			fail(`${path}: canonical is ${canonicals[0]}, expected ${expectedCanonical(path)}`);
		}
	}

	const ogUrl = tags(body, "meta").find((meta) => meta.get("property") === "og:url")?.get("content");
	if (!isNoindex && canonicals[0] && ogUrl && ogUrl !== canonicals[0]) {
		fail(`${path}: og:url does not match canonical`);
	}
	const ogType = tags(body, "meta").find((meta) => meta.get("property") === "og:type")?.get("content");
	if (!ogType) fail(`${path}: missing og:type`);

	if (!/<html[^>]*\blang="id"/i.test(body)) fail(`${path}: <html lang="id"> missing`);

	const headings = [...body.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi)].map(
		(match) => ({ level: Number(match[1]), text: stripTags(match[2]) }),
	);
	const h1s = headings.filter((heading) => heading.level === 1);
	if (h1s.length !== 1) fail(`${path}: expected exactly one <h1>, got ${h1s.length}`);
	let previousLevel = 0;
	for (const heading of headings) {
		if (previousLevel > 0 && heading.level > previousLevel + 1) {
			fail(
				`${path}: heading level jumps from h${previousLevel} to h${heading.level} ("${heading.text.slice(0, 40)}")`,
			);
		}
		previousLevel = heading.level;
	}

	for (const image of tags(body, "img")) {
		if (!image.has("alt")) fail(`${path}: <img> without alt attribute (${image.get("src") ?? "?"})`);
	}

	const ids = [...body.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
	const seen = new Set();
	for (const id of ids) {
		if (seen.has(id)) fail(`${path}: duplicate id="${id}"`);
		seen.add(id);
	}

	for (const match of body.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)) {
		const attrs = parseAttributes(match[1]);
		// EmDash LiveSearch renders an empty result template inside a hidden
		// container. It is not a real link until JS fills it.
		if ((attrs.get("class") ?? "").includes("emdash-live-search-result")) continue;
		const href = attrs.get("href") ?? "";
		if (href.startsWith("/") && !href.startsWith("//")) {
			const url = new URL(href, `${base}/`);
			if (url.origin === new URL(base).origin && !url.pathname.startsWith("/_emdash")) {
				internalLinks.add(url.pathname);
			}
		}
		if (attrs.get("target") === "_blank" && !(attrs.get("rel") ?? "").includes("noopener")) {
			fail(`${path}: target="_blank" link without rel="noopener"`);
		}
		const name = attrs.get("aria-label") ?? stripTags(match[2]);
		if (!name) fail(`${path}: link without accessible name (${href || "?"})`);
	}

	for (const input of tags(body, "input")) {
		const type = (input.get("type") ?? "text").toLowerCase();
		if (["hidden", "submit", "button", "reset"].includes(type)) continue;
		const labelled =
			Boolean(input.get("aria-label")) ||
			Boolean(input.get("aria-labelledby")) ||
			(input.has("id") && new RegExp(`<label[^>]*\\bfor="${input.get("id")}"`, "i").test(body));
		if (!labelled) {
			if ((input.get("class") ?? "").includes("emdash-live-search-input")) {
				warn(`${path}: LiveSearch input has no server-rendered label (client script adds aria-label)`);
			} else {
				fail(`${path}: input without label/aria-label`);
			}
		}
	}

	for (const button of [...body.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/gi)]) {
		const attrs = parseAttributes(button[1]);
		const name = attrs.get("aria-label") ?? stripTags(button[2]);
		if (!name) fail(`${path}: button without accessible name`);
	}

	for (const match of body.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)) {
		try {
			JSON.parse(match[1]);
		} catch {
			fail(`${path}: invalid JSON-LD`);
		}
	}

	const headers = response.headers;
	if (!headers.get("content-security-policy")) fail(`${path}: missing Content-Security-Policy`);
	if (!headers.get("x-content-type-options")) fail(`${path}: missing X-Content-Type-Options`);
	if (!headers.get("referrer-policy")) fail(`${path}: missing Referrer-Policy`);
	if (headers.get("x-frame-options") !== "SAMEORIGIN") {
		fail(`${path}: expected X-Frame-Options: SAMEORIGIN`);
	}
}

async function auditSitemap() {
	const index = await fetchPage("/sitemap.xml");
	if (!index) return;
	if (index.response.status !== 200) {
		fail(`/sitemap.xml: expected 200, got ${index.response.status}`);
		return;
	}
	const children = [...index.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
	if (children.length === 0) fail("/sitemap.xml: no child sitemaps");
	const urls = [];
	for (const child of children) {
		const response = await fetch(child);
		if (response.status !== 200) {
			fail(`${child}: sitemap returned ${response.status}`);
			continue;
		}
		const body = await response.text();
		for (const match of body.matchAll(/<loc>([^<]+)<\/loc>/g)) urls.push(match[1]);
	}
	for (const url of urls) {
		const parsed = new URL(url);
		const page = await fetchPage(parsed.pathname + parsed.search);
		if (!page) continue;
		if (page.response.status !== 200) {
			fail(`${parsed.pathname}: sitemap entry returned ${page.response.status}`);
			continue;
		}
		const canonical = tags(page.body, "link")
			.filter((link) => link.get("rel")?.toLowerCase() === "canonical")
			.map((link) => link.get("href") ?? "")[0];
		if (canonical !== url) fail(`${parsed.pathname}: sitemap URL does not match canonical`);
	}
	pass(`sitemap: ${urls.length} URL(s) checked`);
}

async function auditRobots() {
	const robots = await fetchPage("/robots.txt");
	if (!robots) return;
	if (robots.response.status !== 200) {
		fail(`/robots.txt: expected 200, got ${robots.response.status}`);
		return;
	}
	if (!robots.body.includes("Disallow: /_emdash/")) fail("/robots.txt: missing admin disallow");
	if (!robots.body.includes("Sitemap:")) fail("/robots.txt: missing Sitemap line");
	pass("robots.txt: admin disallow + sitemap present");
}

async function auditInternalLinks() {
	let checked = 0;
	for (const path of internalLinks) {
		if (path === "/404") continue;
		const page = await fetchPage(path);
		if (!page) continue;
		checked += 1;
		if (page.response.status >= 400) {
			fail(`${path}: internal link returned ${page.response.status}`);
		}
	}
	pass(`internal links: ${checked} unique path(s) checked`);
}

async function auditAdminSurface() {
	if (!production) return;
	for (const [path, expected] of [
		["/_emdash/api/auth/dev-bypass", 403],
		["/_emdash/api/setup/dev-bypass", 403],
		["/_emdash/api/content/posts", 401],
	]) {
		const response = await fetch(new URL(path, `${base}/`), { redirect: "manual" });
		if (response.status !== expected) {
			fail(`${path}: expected ${expected}, got ${response.status}`);
		}
	}
	const admin = await fetch(new URL("/_emdash/admin", `${base}/`), { redirect: "manual" });
	if (![301, 302, 303, 307, 308].includes(admin.status)) {
		fail(`/_emdash/admin: expected auth redirect, got ${admin.status}`);
	}
	pass("admin surface: dev bypass disabled, API requires auth, admin redirects to login");
}

const coreRoutes = [
	["/", 200],
	["/products", 200],
	["/posts", 200],
	["/about", 200],
	["/products/produk-demo-alpha", 200],
	["/posts/panduan-memilih-produk-demo", 200],
	["/category/general", 200],
	["/tag/starter", 200],
	["/products/category/perangkat-demo", 200],
	["/404", 404, true],
	["/tidak-ada-halaman", 404, true],
];

for (const [path, status, noindex] of coreRoutes) {
	const page = await fetchPage(path);
	if (page) auditPage(path, page, { status, noindex });
}

await auditSitemap();
await auditRobots();
await auditInternalLinks();
await auditAdminSurface();

const redirect = await fetchPage("/posts/welcome");
if (redirect && redirect.response.status !== 301) {
	warn(`/posts/welcome: expected seeded 301, got ${redirect.response.status}`);
}

if (failures.length > 0) {
	console.error(`\nFAIL (${failures.length})`);
	for (const message of failures) console.error(`  ✗ ${message}`);
} else {
	console.log(`\nPASS (${passes.length + 1} checks)`);
	for (const message of passes) console.log(`  ✓ ${message}`);
	console.log("  ✓ page checks: status, metadata, canonical, robots, headings, alt, IDs, links, JSON-LD, headers");
}
if (warnings.length > 0) {
	console.warn(`\nWARN (${warnings.length})`);
	for (const message of warnings) console.warn(`  ! ${message}`);
}
process.exitCode = failures.length > 0 ? 1 : 0;
