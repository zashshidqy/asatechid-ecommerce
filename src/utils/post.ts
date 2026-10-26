import type {
	ContentBylineCredit,
	ImageValue,
	PortableTextBlock,
	TaxonomyTerm,
} from "emdash";

/** Taxonomy name used by the article categories. */
export const POST_CATEGORY_TAXONOMY = "category";

/** Taxonomy name used by the article tags. */
export const POST_TAG_TAXONOMY = "tag";

/**
 * Minimal shape an article card needs. Keeping it structural avoids importing
 * the generated `emdash-env.d.ts` types into presentational components.
 */
export interface PostCardEntry {
	id: string;
	data: {
		/** Stable content ID used for taxonomy and reference lookups. */
		id: string;
		title: string;
		excerpt?: string | null;
		content?: PortableTextBlock[] | null;
		featured_image?: ImageValue | null;
		publishedAt?: Date | null;
		bylines?: ContentBylineCredit[] | null;
		terms?: Record<string, TaxonomyTerm[]> | null;
	};
	edit?: Record<string, Partial<{ "data-emdash-ref": string }>>;
}

export interface PostHeading {
	id: string;
	text: string;
	level: 2 | 3;
}

export type TocBlock = PortableTextBlock & { _tocId?: string };

export function getPostCategories(
	terms?: Record<string, TaxonomyTerm[]> | null,
): TaxonomyTerm[] {
	return terms?.[POST_CATEGORY_TAXONOMY] ?? [];
}

export function getPostTags(
	terms?: Record<string, TaxonomyTerm[]> | null,
): TaxonomyTerm[] {
	return terms?.[POST_TAG_TAXONOMY] ?? [];
}

/** Formats a publish date in Indonesian. Returns null when no date exists. */
export function formatPostDate(
	date?: Date | null,
	style: "long" | "short" = "long",
): string | null {
	if (!date) return null;
	return date.toLocaleDateString("id-ID", {
		year: "numeric",
		month: style === "long" ? "long" : "short",
		day: "numeric",
	});
}

/**
 * True when an entry was materially updated on a later day than it was
 * published. Comparing calendar days (not timestamps) avoids showing
 * "Diperbarui" for the routine save that accompanies publishing on the same
 * day, which would be noise rather than information.
 */
export function wasUpdated(updatedAt?: Date | null, publishedAt?: Date | null): boolean {
	if (!updatedAt || !publishedAt) return false;
	if (updatedAt.getTime() <= publishedAt.getTime()) return false;
	return formatPostDate(updatedAt, "short") !== formatPostDate(publishedAt, "short");
}

function nodeText(node: unknown): string {
	if (!node || typeof node !== "object") return "";
	const record = node as { text?: unknown; children?: unknown };
	if (typeof record.text === "string") return record.text;
	if (Array.isArray(record.children)) {
		return record.children.map(nodeText).join("");
	}
	return "";
}

/** Plain text of a Portable Text block, used for headings and reading time. */
export function portableTextToPlainText(block: unknown): string {
	return nodeText(block).replace(/\s+/g, " ").trim();
}

/**
 * Casual reading estimate. Counts words in block text only and never returns
 * less than one minute. This is an editorial aid, not a measured metric.
 */
export function getReadingTime(
	content?: PortableTextBlock[] | null,
	wordsPerMinute = 200,
): number {
	if (!content || content.length === 0) return 0;
	const words = content
		.map((block) => portableTextToPlainText(block))
		.join(" ")
		.split(/\s+/)
		.filter(Boolean).length;
	if (words === 0) return 0;
	return Math.max(1, Math.round(words / wordsPerMinute));
}

function slugify(text: string): string {
	return (
		text
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "")
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-+|-+$/g, "")
			.slice(0, 60) || "bagian"
	);
}

/**
 * Adds stable anchor ids to h2/h3 blocks and returns the matching table of
 * contents. Ids are generated on the server so the TOC works without
 * JavaScript; duplicates within one document get a numeric suffix.
 */
export function annotateHeadings(blocks?: PortableTextBlock[] | null): {
	blocks: TocBlock[];
	headings: PostHeading[];
} {
	const headings: PostHeading[] = [];
	const usedIds = new Set<string>();

	const annotated = (blocks ?? []).map((block) => {
		if (block._type !== "block") return block;
		const style = (block as { style?: string }).style;
		if (style !== "h2" && style !== "h3") return block;

		const text = portableTextToPlainText(block);
		if (!text) return block;

		const base = slugify(text);
		let id = base;
		let counter = 1;
		while (usedIds.has(id)) {
			counter += 1;
			id = `${base}-${counter}`;
		}
		usedIds.add(id);

		headings.push({ id, text, level: style === "h2" ? 2 : 3 });
		return { ...block, _tocId: id };
	});

	return { blocks: annotated, headings };
}
