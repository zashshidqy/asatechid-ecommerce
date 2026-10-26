import type { ImageValue, TaxonomyTerm } from "emdash";

/** Taxonomy name used by the product catalogue. */
export const PRODUCT_CATEGORY_TAXONOMY = "product_category";

/**
 * Minimal shape a product card needs. Keeping it structural avoids importing
 * the generated `emdash-env.d.ts` types into presentational components.
 */
export interface ProductCardEntry {
	id: string;
	data: {
		title: string;
		excerpt?: string | null;
		featured_image?: ImageValue | null;
		price?: number | null;
		currency?: string | null;
		availability?: string | null;
		terms?: Record<string, TaxonomyTerm[]>;
	};
	edit?: Record<string, Partial<{ "data-emdash-ref": string }>>;
}

export function getProductCategories(
	terms?: Record<string, TaxonomyTerm[]> | null,
): TaxonomyTerm[] {
	return terms?.[PRODUCT_CATEGORY_TAXONOMY] ?? [];
}

/**
 * Formats a price only when both the amount and an ISO 4217 currency exist.
 * Missing or partial data returns null so the UI can state that price is
 * unavailable instead of inventing a number or a currency symbol.
 */
export function formatProductPrice(
	price?: number | null,
	currency?: string | null,
): string | null {
	if (price == null || !Number.isFinite(price)) return null;

	const code = currency?.trim().toUpperCase();
	if (!code) return null;

	try {
		return new Intl.NumberFormat("id-ID", {
			style: "currency",
			currency: code,
			maximumFractionDigits: 0,
		}).format(price);
	} catch {
		// Unknown currency code: keep the amount readable without assuming a
		// symbol. The code is still shown so the value is not ambiguous.
		return `${price.toLocaleString("id-ID")} ${code}`;
	}
}

const AVAILABILITY_VALUES = ["Tersedia", "Tidak tersedia", "Pre-order"];

/**
 * Returns a known availability label, or null when the CMS value is empty or
 * outside the allowed options. The detail page uses null to show an honest
 * "not available" state.
 */
export function availabilityLabel(value?: string | null): string | null {
	if (!value) return null;
	return AVAILABILITY_VALUES.includes(value) ? value : null;
}
