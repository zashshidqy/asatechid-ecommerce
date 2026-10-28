import { randomBytes } from "node:crypto";
import { defineMiddleware } from "astro:middleware";

/**
 * Public-site security headers.
 *
 * EmDash already sets a conservative baseline on every response
 * (`X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`,
 * `X-Frame-Options`) and a strict, admin-specific CSP on `/_emdash/*`.
 * This middleware adds a public-page CSP that does not rely on
 * `'unsafe-inline'` for scripts, plus HSTS when the request is HTTPS.
 *
 * `/_emdash/*` is intentionally skipped so EmDash's own CSP (which allows the
 * admin's inline bootstrap and React hydration) is not weakened or broken.
 */

function buildPublicCsp(nonce: string): string {
	// Vite's dev server needs a same-origin WebSocket for HMR and may use
	// eval-based helpers. Production keeps the stricter policy.
	const isDev = import.meta.env.DEV;
	const scriptSrc = isDev
		? `script-src 'self' 'nonce-${nonce}' 'unsafe-eval'`
		: `script-src 'self' 'nonce-${nonce}'`;
	const connectSrc = isDev ? "connect-src 'self' ws: wss:" : "connect-src 'self'";

	return [
		"default-src 'self'",
		"base-uri 'self'",
		"object-src 'none'",
		"frame-ancestors 'self'",
		"form-action 'self'",
		"img-src 'self' data: https:",
		"font-src 'self' data:",
		"media-src 'self' https:",
		"manifest-src 'self'",
		// Astro emits scoped styles as inline <style> blocks on server-rendered
		// pages. Scripts are same-origin modules plus one nonce-tagged inline
		// bootstrap, so script-src stays strict.
		"style-src 'self' 'unsafe-inline'",
		scriptSrc,
		connectSrc,
	].join("; ");
}

function isHttpsRequest(url: URL, headers: Headers): boolean {
	if (url.protocol === "https:") return true;
	const forwarded = headers.get("x-forwarded-proto");
	return forwarded?.split(",")[0]?.trim().toLowerCase() === "https";
}

export const onRequest = defineMiddleware(async (context, next) => {
	const isAdmin = context.url.pathname.startsWith("/_emdash");
	const nonce = isAdmin ? undefined : randomBytes(16).toString("base64");
	if (nonce) context.locals.cspNonce = nonce;

	const response = await next();

	if (!isAdmin && nonce) {
		// Set-if-absent keeps a stricter host/CDN policy authoritative.
		if (!response.headers.has("Content-Security-Policy")) {
			response.headers.set("Content-Security-Policy", buildPublicCsp(nonce));
		}
		response.headers.set("X-Frame-Options", "SAMEORIGIN");
	}

	if (isHttpsRequest(context.url, context.request.headers)) {
		response.headers.set(
			"Strict-Transport-Security",
			"max-age=31536000; includeSubDomains",
		);
	}

	return response;
});
