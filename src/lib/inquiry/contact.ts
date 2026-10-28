/**
 * Inquiry contact configuration and link builders.
 *
 * Contact details are never hard-coded: they come from server environment
 * variables declared in `astro.config.mjs`. When a value is missing or invalid
 * the CTA is disabled instead of rendering a broken link.
 *
 * No inquiry data is stored by the site. WhatsApp and email links open the
 * visitor's own app, so there is no server-side form, lead table, or spam
 * surface in this phase.
 */

export interface InquiryEnv {
	INQUIRY_WHATSAPP_NUMBER?: string;
	INQUIRY_EMAIL?: string;
}

export interface InquiryContactResolution {
	/** Digits-only international number, or null when missing/invalid. */
	whatsappNumber: string | null;
	/** Validated email address, or null when missing/invalid. */
	email: string | null;
	/** Safe configuration warnings for server logs; never shown verbatim. */
	issues: string[];
}

export interface InquiryContext {
	productTitle: string;
	productUrl: string;
}

export interface InquiryLinks {
	whatsapp: string | null;
	email: string | null;
}

const WHATSAPP_ALLOWED = /^\+?[\d\s().-]+$/;
const EMAIL_PATTERN =
	/^[A-Za-z0-9._%+-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/;

/**
 * Normalizes a WhatsApp number for `wa.me`.
 *
 * `wa.me` requires the full international number without `+`, spaces, or
 * punctuation. Local numbers starting with `0` are rejected because the site
 * cannot know which country code to prepend.
 */
export function normalizeWhatsAppNumber(
	value: string | null | undefined,
): string | null {
	const trimmed = value?.trim();
	if (!trimmed) return null;
	if (!WHATSAPP_ALLOWED.test(trimmed)) return null;

	const digits = trimmed.replace(/\D/g, "");
	if (digits.length < 8 || digits.length > 15) return null;
	if (digits.startsWith("0")) return null;

	return digits;
}

/**
 * Validates an email address for a `mailto:` link.
 *
 * Deliberately conservative: common address characters only, no whitespace,
 * no `?`/`&`/`#` that would break the mailto URL.
 */
export function normalizeEmail(value: string | null | undefined): string | null {
	const trimmed = value?.trim();
	if (!trimmed) return null;
	if (trimmed.length > 254) return null;
	if (!EMAIL_PATTERN.test(trimmed)) return null;
	return trimmed;
}

/**
 * Resolves contact configuration from server env values. Invalid values are
 * reported as issues and treated as unconfigured so the UI never renders a
 * malformed external link.
 */
export function resolveInquiryContact(env: InquiryEnv): InquiryContactResolution {
	const issues: string[] = [];

	const rawWhatsApp = env.INQUIRY_WHATSAPP_NUMBER;
	const whatsappNumber = normalizeWhatsAppNumber(rawWhatsApp);
	if (rawWhatsApp?.trim() && !whatsappNumber) {
		issues.push(
			"INQUIRY_WHATSAPP_NUMBER tidak valid; gunakan format internasional tanpa awalan 0, mis. +62 8xx xxxx xxxx.",
		);
	}

	const rawEmail = env.INQUIRY_EMAIL;
	const email = normalizeEmail(rawEmail);
	if (rawEmail?.trim() && !email) {
		issues.push("INQUIRY_EMAIL tidak valid; gunakan alamat email lengkap.");
	}

	return { whatsappNumber, email, issues };
}

export function buildInquiryMessage(context: InquiryContext): string {
	return `Halo, saya ingin bertanya tentang produk "${context.productTitle}".\n${context.productUrl}`;
}

/**
 * Builds the external links. Each link is null when its channel is not
 * configured, so the component can render only working CTAs.
 */
export function buildInquiryLinks(
	contact: InquiryContactResolution,
	context: InquiryContext,
): InquiryLinks {
	const message = buildInquiryMessage(context);
	const subject = `Pertanyaan produk: ${context.productTitle}`;

	return {
		whatsapp: contact.whatsappNumber
			? `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(message)}`
			: null,
		email: contact.email
			? `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`
			: null,
	};
}
