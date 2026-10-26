/**
 * Resolves the public origin used for canonical URLs, Open Graph URLs, and
 * structured data.
 *
 * Precedence mirrors EmDash's own `getPublicOrigin()`: an explicitly configured
 * site setting wins, then the integration config (which EmDash populates from
 * `EMDASH_SITE_URL` / `SITE_URL`), then the request origin. Keeping this in one
 * helper prevents different pages from emitting different canonicals for the
 * same content.
 */
export function resolveSiteOrigin(input: {
	url: URL;
	settingsUrl?: string | null;
	configUrl?: string | null;
}): string {
	// `import.meta.env` is baked in at build time, while container deployments
	// set the variable at runtime — so read `process.env` as well, mirroring
	// EmDash's own `getPublicOrigin()`.
	const runtimeEnv = typeof process !== "undefined" ? process.env : undefined;
	const candidates = [
		input.settingsUrl,
		input.configUrl,
		runtimeEnv?.EMDASH_SITE_URL,
		runtimeEnv?.SITE_URL,
		import.meta.env.EMDASH_SITE_URL,
		import.meta.env.SITE_URL,
	];

	for (const candidate of candidates) {
		if (!candidate) continue;
		try {
			return new URL(candidate).origin;
		} catch {
			// Ignore malformed configuration and keep looking.
		}
	}

	return input.url.origin;
}

/**
 * Builds an absolute URL from an origin and a pathname. Query strings and
 * fragments are intentionally dropped by callers before reaching here, so
 * filtered/paginated views canonicalize to the base path.
 */
export function absoluteSiteUrl(origin: string, pathname: string): string {
	const path = pathname.replace(/\/+$/, "") || "/";
	return new URL(path, `${origin}/`).href;
}
