import type { ImageValue, ProductCategoryProfile } from "emdash";

export const PRODUCT_CATEGORY_PROFILE_COLLECTION = "product_category_profiles" as const;

export interface ProductCategoryProfileEntry {
	data: ProductCategoryProfile;
}

export function mapCategoryIcons(
	profiles: ProductCategoryProfileEntry[],
): Map<string, ImageValue> {
	const icons = new Map<string, ImageValue>();

	for (const profile of profiles) {
		const taxonomySlug = profile.data.taxonomy_slug.trim().toLowerCase();
		if (taxonomySlug && profile.data.icon) {
			icons.set(taxonomySlug, profile.data.icon);
		}
	}

	return icons;
}
