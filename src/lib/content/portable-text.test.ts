import assert from "node:assert/strict";
import test from "node:test";

import type { PortableTextBlock } from "emdash";
import { normalizePortableTextBlocks } from "../../utils/post.ts";

const paragraph = {
	_type: "block",
	_key: "paragraph",
	style: "normal",
	children: [{ _type: "span", _key: "span", text: "Teks" }],
} as PortableTextBlock;

const bullet = {
	_type: "block",
	_key: "bullet",
	style: "normal",
	listItem: "bullet",
	level: 1,
	children: [{ _type: "span", _key: "bullet-span", text: "Butir" }],
} as PortableTextBlock;

test("flattens legacy nested PortableText block arrays", () => {
	const legacy = [paragraph, [bullet]] as unknown as PortableTextBlock[];

	assert.deepEqual(normalizePortableTextBlocks(legacy), [paragraph, bullet]);
});

test("drops malformed PortableText nodes without a type", () => {
	const malformed = [paragraph, { children: [] }, null] as unknown as PortableTextBlock[];

	assert.deepEqual(normalizePortableTextBlocks(malformed), [paragraph]);
});
