import assert from "node:assert/strict";
import test from "node:test";

import {
	buildInquiryLinks,
	buildInquiryMessage,
	normalizeEmail,
	normalizeWhatsAppNumber,
	resolveInquiryContact,
} from "./contact.ts";

const CONTEXT = {
	productTitle: 'Produk "Uji" & Demo',
	productUrl: "https://example.com/products/produk-uji",
};

test("normalizes international WhatsApp numbers", () => {
	assert.equal(normalizeWhatsAppNumber("+62 812-3456-7890"), "6281234567890");
	assert.equal(normalizeWhatsAppNumber("+1 (555) 010-0000"), "15550100000");
	assert.equal(normalizeWhatsAppNumber(" +62.812.3456.7890 "), "6281234567890");
});

test("rejects local, malformed, and out-of-range WhatsApp numbers", () => {
	assert.equal(normalizeWhatsAppNumber("0812-3456-7890"), null);
	assert.equal(normalizeWhatsAppNumber("1234567"), null);
	assert.equal(normalizeWhatsAppNumber("+1234567890123456"), null);
	assert.equal(normalizeWhatsAppNumber("+62 abc 812"), null);
	assert.equal(normalizeWhatsAppNumber(""), null);
	assert.equal(normalizeWhatsAppNumber(null), null);
});

test("validates email addresses for mailto links", () => {
	assert.equal(normalizeEmail("halo@example.com"), "halo@example.com");
	assert.equal(normalizeEmail("halo+tag@example.co.id"), "halo+tag@example.co.id");
	assert.equal(normalizeEmail("halo@example"), null);
	assert.equal(normalizeEmail("halo @example.com"), null);
	assert.equal(normalizeEmail("halo@example.com?subject=x"), null);
	assert.equal(normalizeEmail(""), null);
});

test("an empty environment leaves both channels unconfigured", () => {
	const contact = resolveInquiryContact({});
	assert.equal(contact.whatsappNumber, null);
	assert.equal(contact.email, null);
	assert.deepEqual(contact.issues, []);
});

test("invalid values are reported as issues and treated as unconfigured", () => {
	const contact = resolveInquiryContact({
		INQUIRY_WHATSAPP_NUMBER: "0812-3456-7890",
		INQUIRY_EMAIL: "not-an-email",
	});
	assert.equal(contact.whatsappNumber, null);
	assert.equal(contact.email, null);
	assert.equal(contact.issues.length, 2);
});

test("valid values are normalized", () => {
	const contact = resolveInquiryContact({
		INQUIRY_WHATSAPP_NUMBER: "+62 812 3456 7890",
		INQUIRY_EMAIL: "halo@example.com",
	});
	assert.equal(contact.whatsappNumber, "6281234567890");
	assert.equal(contact.email, "halo@example.com");
	assert.deepEqual(contact.issues, []);
});

test("the inquiry message includes the product title and URL", () => {
	const message = buildInquiryMessage(CONTEXT);
	assert.match(message, /Produk "Uji" & Demo/);
	assert.match(message, /https:\/\/example\.com\/products\/produk-uji/);
});

test("builds a wa.me link with an encoded product message", () => {
	const links = buildInquiryLinks(
		{ whatsappNumber: "6281234567890", email: null, issues: [] },
		CONTEXT,
	);
	assert.ok(links.whatsapp);
	assert.equal(links.email, null);

	const url = new URL(links.whatsapp);
	assert.equal(url.origin, "https://wa.me");
	assert.equal(url.pathname, "/6281234567890");
	assert.equal(url.searchParams.get("text"), buildInquiryMessage(CONTEXT));
});

test("builds a mailto link with subject and body", () => {
	const links = buildInquiryLinks(
		{ whatsappNumber: null, email: "halo@example.com", issues: [] },
		CONTEXT,
	);
	assert.ok(links.email);
	assert.equal(links.whatsapp, null);

	const url = new URL(links.email);
	assert.equal(url.protocol, "mailto:");
	assert.equal(url.pathname, "halo@example.com");
	assert.equal(
		url.searchParams.get("subject"),
		'Pertanyaan produk: Produk "Uji" & Demo',
	);
	assert.equal(url.searchParams.get("body"), buildInquiryMessage(CONTEXT));
});

test("unconfigured contact produces no links", () => {
	const links = buildInquiryLinks(
		{ whatsappNumber: null, email: null, issues: [] },
		CONTEXT,
	);
	assert.equal(links.whatsapp, null);
	assert.equal(links.email, null);
});
