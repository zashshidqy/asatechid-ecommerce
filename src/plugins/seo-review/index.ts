/**
 * SEO Review — a native EmDash plugin.
 *
 * Provides:
 * - an editor panel for posts/products/pages that audits the latest saved
 *   draft revision and previews the final SERP metadata;
 * - a `content:beforePublish` policy gate that blocks only mandatory issues
 *   (missing title, empty body, missing slug).
 *
 * The audit engine and adapter are pure modules under `src/lib/seo-review/`.
 */

import {
	definePlugin,
	getSiteSettings,
	PluginRouteError,
	type PluginContext,
	type SiteSettings,
} from "emdash";
import {
	resolveContentPath,
	reviewContent,
	type ReviewContentLike,
} from "../../lib/seo-review/review";
import { renderPanel } from "./panel";

const REVIEWED_COLLECTIONS = ["posts", "products", "pages"] as const;
const REVIEWED_COLLECTION_SET: ReadonlySet<string> = new Set(REVIEWED_COLLECTIONS);

export interface SeoReviewOptions {
	/** Reserved for future configuration; the plugin currently has no options. */
	readonly enabled?: boolean;
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function loadSettings(ctx: PluginContext): Promise<Partial<SiteSettings>> {
	try {
		return await getSiteSettings();
	} catch (error) {
		ctx.log.warn(
			"SEO Review tidak dapat membaca pengaturan situs; memakai nilai bawaan.",
			{ error: error instanceof Error ? error.message : String(error) },
		);
		return ctx.site.name ? { title: ctx.site.name } : {};
	}
}

/**
 * Reads the working draft revision and overlays it on the live row, mirroring
 * EmDash's own draft hydration (live data first, revision data second, staged
 * slug from `_slug`). The panel must audit draft data, not the published row.
 */
async function loadDraftContent(
	ctx: PluginContext,
	collection: string,
	id: string,
): Promise<ReviewContentLike> {
	if (!ctx.content) {
		throw new PluginRouteError(
			"INTERNAL_ERROR",
			"Plugin tidak memiliki akses konten.",
			500,
		);
	}

	const item = await ctx.content.get(collection, id);
	if (!item) {
		throw new PluginRouteError("NOT_FOUND", "Konten tidak ditemukan.", 404);
	}

	let data: Record<string, unknown> = item.data;
	let slug = item.slug;

	if (item.draftRevisionId && ctx.content.getRevision) {
		const revision = await ctx.content.getRevision(
			collection,
			id,
			item.draftRevisionId,
		);
		if (revision) {
			const revisionData: Record<string, unknown> = {};
			for (const [key, value] of Object.entries(revision.data)) {
				if (!key.startsWith("_")) revisionData[key] = value;
			}
			data = { ...data, ...revisionData };
			const stagedSlug =
				typeof revision.data._slug === "string" ? revision.data._slug : null;
			if (stagedSlug) slug = stagedSlug;
		}
	}

	return { slug, data, seo: item.seo };
}

/**
 * Collects published paths so the panel can point out internal links that do
 * not resolve. The publish hook skips this to keep publishing fast.
 */
async function collectKnownLocalPaths(
	ctx: PluginContext,
): Promise<ReadonlySet<string>> {
	const paths = new Set<string>(["/", "/posts", "/products", "/search"]);
	if (!ctx.content || !ctx.schema) return paths;

	for (const collection of REVIEWED_COLLECTIONS) {
		try {
			const schema = await ctx.schema.getCollection(collection);
			if (!schema?.urlPattern) continue;
			const result = await ctx.content.list(collection, {
				where: { status: "published" },
				limit: 200,
			});
			for (const item of result.items) {
				const path = resolveContentPath(schema.urlPattern, item.slug, collection);
				if (path) paths.add(path);
			}
		} catch (error) {
			ctx.log.warn("SEO Review gagal memuat daftar tautan lokal.", {
				collection,
				error: error instanceof Error ? error.message : String(error),
			});
		}
	}

	return paths;
}

export function createPlugin(_options: SeoReviewOptions = {}) {
	return definePlugin({
		id: "seo-review",
		version: "1.0.0",
		capabilities: [
			"content:read",
			"content:revisions:read",
			"schema:read",
			"hooks.content-policy:register",
		],
		admin: {
			editorPanels: [
				{
					id: "seo-review",
					title: "SEO Review",
					route: "panel",
					collections: [...REVIEWED_COLLECTIONS],
					order: 50,
				},
			],
		},
		routes: {
			panel: {
				permission: "content:read_drafts",
				handler: async (ctx) => {
					const ui = ctx.ui;
					if (!ui || ui.surface !== "content-editor-panel") {
						throw new PluginRouteError(
							"BAD_REQUEST",
							"Panel SEO Review hanya dapat dibuka dari editor konten.",
							400,
						);
					}

					const { collection, id } = ui.entry;
					if (!REVIEWED_COLLECTION_SET.has(collection)) {
						throw new PluginRouteError(
							"BAD_REQUEST",
							"Koleksi ini tidak mendukung SEO Review.",
							400,
						);
					}

					const [content, schema, settings, knownLocalPaths] =
						await Promise.all([
							loadDraftContent(ctx, collection, id),
							ctx.schema
								? ctx.schema.getCollection(collection)
								: Promise.resolve(null),
							loadSettings(ctx),
							collectKnownLocalPaths(ctx),
						]);

					const result = reviewContent(
						{
							collection,
							content,
							schema,
							settings,
							requestUrl: new URL(ctx.request.url),
							configUrl: ctx.site.url || null,
							knownLocalPaths,
						},
						settings,
					);

					const isRefresh =
						isRecord(ctx.input) &&
						ctx.input.type === "block_action" &&
						ctx.input.action_id === "refresh";

					return {
						blocks: renderPanel(result, { collection, entryId: id }),
						...(isRefresh
							? {
									toast: {
										message: "Pemeriksaan diperbarui.",
										type: "success" as const,
									},
								}
							: {}),
					};
				},
			},
		},
		hooks: {
			"content:beforePublish": async (event, ctx) => {
				if (!REVIEWED_COLLECTION_SET.has(event.collection)) return;

				try {
					const schema = ctx.schema
						? await ctx.schema.getCollection(event.collection)
						: null;
					const settings = await loadSettings(ctx);

					const result = reviewContent(
						{
							collection: event.collection,
							content: {
								slug: event.content.slug,
								data: event.content.data,
								seo: event.content.seo,
							},
							schema,
							settings,
							configUrl: ctx.site.url || null,
							knownLocalPaths: null,
						},
						settings,
					);

					if (result.gate.blocked) {
						const reason = `SEO Review memblokir publikasi: ${result.gate.reasons.join(" ")}`;
						return { cancel: true, reason: reason.slice(0, 400) };
					}
				} catch (error) {
					ctx.log.error(
						"SEO Review gagal memeriksa konten sebelum publikasi.",
						{
							collection: event.collection,
							error: error instanceof Error ? error.message : String(error),
						},
					);
				}
			},
		},
	});
}
