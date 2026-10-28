import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { contrastRatio } from "./contrast.ts";

const tokensCss = readFileSync(
	new URL("../../styles/tokens.css", import.meta.url),
	"utf8",
);

const colors = new Map<string, string>();
for (const match of tokensCss.matchAll(/--color-([a-z-]+):\s*(#[0-9a-fA-F]{6})/g)) {
	colors.set(match[1], match[2]);
}

function color(name: string): string {
	const value = colors.get(name);
	assert.ok(value, `Missing --color-${name} in tokens.css`);
	return value;
}

/**
 * WCAG 2.2 AA normal-text pairs used by the public UI. Keep this list in sync
 * with token usage; decorative borders are intentionally excluded.
 */
const TEXT_PAIRS: Array<[foreground: string, background: string]> = [
	["ink", "bg"],
	["ink", "surface"],
	["ink", "surface-muted"],
	["ink", "highlight"],
	["ink-soft", "bg"],
	["ink-soft", "surface"],
	["ink-soft", "surface-muted"],
	["muted", "bg"],
	["muted", "surface"],
	["muted", "surface-muted"],
	["accent", "bg"],
	["accent", "surface"],
	["accent", "surface-muted"],
	["accent-hover", "surface"],
	["accent-hover", "accent-soft"],
	["accent-contrast", "accent"],
	["danger", "surface"],
	["success", "surface"],
];

test("all text color pairs meet WCAG AA contrast (4.5:1)", () => {
	for (const [foreground, background] of TEXT_PAIRS) {
		const ratio = contrastRatio(color(foreground), color(background));
		assert.ok(
			ratio >= 4.5,
			`--color-${foreground} on --color-${background} is ${ratio.toFixed(2)}:1`,
		);
	}
});

test("focus indicator color is distinguishable from the page background", () => {
	const ratio = contrastRatio(color("focus"), color("bg"));
	assert.ok(ratio >= 3, `--color-focus on --color-bg is ${ratio.toFixed(2)}:1`);
});
