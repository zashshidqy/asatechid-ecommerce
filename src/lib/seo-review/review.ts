/**
 * Bridges EmDash content rows to the pure SEO Review audit engine.
 *
 * The resolved metadata is produced with the same `getSeoMeta()` call and the
 * same fallbacks as `Base.astro`, so the preview and checklist describe the
 * final public output rather than an approximation.
 */

import { getSeoMeta, type SiteSettings } from "emdash";
import { resolveStarterSiteIdentity } from "../../utils/site-identity";
import { absoluteSiteUrl, resolveSiteOrigin } from "../../utils/site-url";
import {
	auditSeoReview,
	type AuditInput,
	type AuditResult,
	type AuditSeoFields,
} from "./audit";

export interface ReviewContentLike {
	slug?: unknown;
	data?: unknown;
	seo?: unknown;
}

export interface ReviewSchemaLike {
	urlPattern: string | null;
	routable: boolean;
}

export interface BuildReviewInputOptions {
	collection: string;
	content: ReviewContentLike;
	schema: ReviewSchemaLike | null;
	settings: Partial<SiteSettings>;
	siteOrigin: string;
	knownLocalPaths: ReadonlySet<string> | null;
}

export interface ReviewContextOptions {
	collection: string;
	content: ReviewContentLike;
	schema: ReviewSchemaLike | null;
	settings: Partial<SiteSettings>;
	/**
	 * Request URL used only when neither settings nor config provide an origin.
	 * Publish hooks have no request object; they rely on `settings.url` or
	 * `configUrl` and fall back to a local placeholder.
	 */
	requestUrl?: URL | null;
	configUrl?: string | null;
	knownLocalPaths: ReadonlySet<string> | null;
}

const DEFAULT_URL_PATTERNS: Record<string, string> = {
	posts: "/posts/{slug}",
	products: "/products/{slug}",
	pages: "/{slug}",
};

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asString(value: unknown): string | null {
	return typeof value === "string" ? value : null;
}

/**
 * Builds the public path for an entry. Mirrors the seed collection patterns;
 * `schema.urlPattern` is used when the collection declares one.
 */
export function resolveContentPath(
	urlPattern: string | null,
	slug: string | null,
	collection: string,
): string | null {
	if (!slug) return null;
	const template = urlPattern ?? DEFAULT_URL_PATTERNS[collection] ?? null;
	if (!template) return null;
	const path = template.replaceAll("{slug}", encodeURIComponent(slug));
	return path.replace(/\/+$/, "") || "/";
}

function toImage(value: unknown): { url: string | null; alt: string | null } | null {
	if (!isRecord(value)) return null;
	const url =
		asString(value.url) ??
		asString(value.src) ??
		asString(value.previewUrl) ??
		null;
	const alt = asString(value.alt);
	if (!url && !alt) return null;
	return { url, alt };
}

function toSeoFields(value: unknown): AuditSeoFields {
	const record = isRecord(value) ? value : {};
	return {
		title: asString(record.title),
		description: asString(record.description),
		image: asString(record.image),
		canonical: asString(record.canonical),
		noIndex: record.noIndex === true,
	};
}

/**
 * Builds the audit input from a content row and site settings.
 */
export function buildReviewInput(options: BuildReviewInputOptions): AuditInput {
	const data = isRecord(options.content.data) ? options.content.data : {};
	const seo = toSeoFields(options.content.seo ?? data.seo);
	const title = asString(data.title);
	const excerpt = asString(data.excerpt);
	const slug =
		asString(options.content.slug) ?? asString(data.slug) ?? null;

	const { siteTitle, siteTagline } = resolveStarterSiteIdentity(options.settings);
	const path = resolveContentPath(
		options.schema?.urlPattern ?? null,
		slug,
		options.collection,
	);
	const expectedCanonical = path
		? absoluteSiteUrl(options.siteOrigin, path)
		: null;
	const defaultOgImage =
		options.settings.seo?.defaultOgImage?.url ??
		`${options.siteOrigin}/og-default-demo.png`;

	const meta = getSeoMeta(
		{ data, seo },
		{
			siteTitle,
			siteUrl: options.siteOrigin,
			titleSeparator: options.settings.seo?.titleSeparator ?? " — ",
			path: path ?? undefined,
			defaultOgImage,
		},
	);

	const noIndex = meta.robots?.includes("noindex") ?? false;

	return {
		document: {
			collection: options.collection,
			slug,
			body: data.content ?? data.description ?? null,
			contentTitle: title,
			excerpt,
			seo,
			featuredImage: toImage(data.featured_image),
		},
		resolved: {
			title: meta.title,
			pageTitle: meta.ogTitle,
			description: meta.description ?? siteTagline,
			canonical: noIndex ? null : meta.canonical,
			ogImage: meta.ogImage,
			robots: meta.robots,
			noIndex,
		},
		site: {
			siteTitle,
			siteTagline,
			expectedCanonical,
			knownLocalPaths: options.knownLocalPaths,
		},
	};
}

/**
 * Resolves the public origin exactly like the public pages do.
 */
export function resolveReviewOrigin(
	options: ReviewContextOptions,
	settings: Partial<SiteSettings>,
): string {
	return resolveSiteOrigin({
		url: options.requestUrl ?? new URL("http://localhost"),
		settingsUrl: settings.url,
		configUrl: options.configUrl ?? null,
	});
}

/**
 * Convenience wrapper for callers that already loaded settings.
 */
export function reviewContent(
	options: ReviewContextOptions,
	settings: Partial<SiteSettings>,
): AuditResult {
	const siteOrigin = resolveReviewOrigin(options, settings);
	return auditSeoReview(
		buildReviewInput({
			collection: options.collection,
			content: options.content,
			schema: options.schema,
			settings,
			siteOrigin,
			knownLocalPaths: options.knownLocalPaths,
		}),
	);
}
