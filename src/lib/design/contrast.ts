/**
 * WCAG contrast helpers used by the design-token test.
 *
 * Kept dependency-free so it can run in the same `node --test` setup as the
 * rest of the project.
 */

export function parseHexColor(value: string): [number, number, number] {
	const hex = value.trim().replace(/^#/, "");
	if (!/^[0-9a-fA-F]{6}$/.test(hex)) {
		throw new Error(`Expected a 6-digit hex color, received: ${value}`);
	}
	return [
		Number.parseInt(hex.slice(0, 2), 16),
		Number.parseInt(hex.slice(2, 4), 16),
		Number.parseInt(hex.slice(4, 6), 16),
	];
}

export function relativeLuminance(value: string): number {
	const [r, g, b] = parseHexColor(value).map((channel) => {
		const normalized = channel / 255;
		return normalized <= 0.04045
			? normalized / 12.92
			: ((normalized + 0.055) / 1.055) ** 2.4;
	});
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(foreground: string, background: string): number {
	const a = relativeLuminance(foreground);
	const b = relativeLuminance(background);
	const lighter = Math.max(a, b);
	const darker = Math.min(a, b);
	return (lighter + 0.05) / (darker + 0.05);
}
