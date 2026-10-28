#!/usr/bin/env node
/**
 * Production launch checklist.
 *
 * Usage:
 *   node --experimental-strip-types scripts/launch-check.ts
 *   node --experimental-strip-types scripts/launch-check.ts --staging
 *
 * `--staging` downgrades missing contact data and DEMO content to warnings.
 * Without it, the script exits non-zero until production data is in place.
 */

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { resolveInquiryContact } from "../src/lib/inquiry/contact.ts";

const root = fileURLToPath(new URL("..", import.meta.url));
const staging = process.argv.includes("--staging");
const failures: string[] = [];
const warnings: string[] = [];
const passes: string[] = [];

function fail(message: string): void {
	failures.push(message);
}
function warn(message: string): void {
	warnings.push(message);
}
function pass(message: string): void {
	passes.push(message);
}

function readEnvFile(): Record<string, string> {
	const path = `${root}.env`;
	if (!existsSync(path)) return {};
	const values: Record<string, string> = {};
	for (const line of readFileSync(path, "utf8").split("\n")) {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith("#")) continue;
		const index = trimmed.indexOf("=");
		if (index === -1) continue;
		const key = trimmed.slice(0, index).trim();
		let value = trimmed.slice(index + 1).trim();
		if (
			(value.startsWith('"') && value.endsWith('"')) ||
			(value.startsWith("'") && value.endsWith("'"))
		) {
			value = value.slice(1, -1);
		}
		values[key] = value;
	}
	return values;
}

const env = { ...readEnvFile(), ...process.env };

// --- Secrets -------------------------------------------------------------
const encryptionKey = env.EMDASH_ENCRYPTION_KEY?.trim() ?? "";
if (!encryptionKey) {
	fail("EMDASH_ENCRYPTION_KEY is missing");
} else if (
	/replace|example|changeme|placeholder/i.test(encryptionKey) ||
	encryptionKey.length < 32
) {
	fail("EMDASH_ENCRYPTION_KEY looks like a placeholder or is too short");
} else {
	pass("EMDASH_ENCRYPTION_KEY is set and not a placeholder");
}

// --- Public origin -------------------------------------------------------
const siteUrl = env.EMDASH_SITE_URL?.trim() ?? env.SITE_URL?.trim() ?? "";
if (!siteUrl) {
	fail("EMDASH_SITE_URL is not set (canonical URLs would follow the request host)");
} else {
	try {
		const parsed = new URL(siteUrl);
		if (parsed.protocol !== "https:") {
			fail(`EMDASH_SITE_URL must use https:// in production (got ${parsed.protocol})`);
		} else if (
			["localhost", "127.0.0.1", "0.0.0.0", "::1"].includes(parsed.hostname) ||
			parsed.hostname.endsWith(".example.com") ||
			parsed.hostname === "example.com"
		) {
			fail(`EMDASH_SITE_URL still points at a placeholder host (${parsed.hostname})`);
		} else {
			pass(`EMDASH_SITE_URL is an HTTPS origin (${parsed.origin})`);
		}
	} catch {
		fail("EMDASH_SITE_URL is not a valid absolute URL");
	}
}

// --- Contact channels ----------------------------------------------------
const contact = resolveInquiryContact({
	INQUIRY_WHATSAPP_NUMBER: env.INQUIRY_WHATSAPP_NUMBER,
	INQUIRY_EMAIL: env.INQUIRY_EMAIL,
});
for (const issue of contact.issues) fail(issue);
if (!contact.whatsappNumber && !contact.email) {
	const message =
		"No inquiry channel is configured; product CTAs will stay disabled (Phase 6 behaviour).";
	if (staging) warn(message);
	else fail(message);
} else {
	pass(
		`Inquiry channels configured: ${[contact.whatsappNumber ? "WhatsApp" : null, contact.email ? "email" : null].filter(Boolean).join(" + ")}`,
	);
}

// --- DEMO data -----------------------------------------------------------
const seedPath = `${root}seed/seed.json`;
if (!existsSync(seedPath)) {
	fail("seed/seed.json is missing");
} else {
	const seed = readFileSync(seedPath, "utf8");
	const demoMatches = [...seed.matchAll(/\bDEMO\b/gi)].length;
	if (demoMatches > 0) {
		const message = `seed/seed.json still contains ${demoMatches} DEMO marker(s); replace DEMO products/posts/pages before launch`;
		if (staging) warn(message);
		else fail(message);
	} else {
		pass("seed/seed.json has no DEMO markers");
	}
}

if (existsSync(`${root}public/og-default-demo.png`)) {
	warn("public/og-default-demo.png is still the default social image (DEMO asset)");
}

// --- Repository hygiene --------------------------------------------------
function git(args: string[]): string {
	return execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
}

try {
	const tracked = git(["ls-files"]).split("\n");
	const sensitive = tracked.filter(
		(file) =>
			file === ".env" ||
			file.startsWith("data.db") ||
			file.startsWith("uploads/") ||
			/\.(sqlite|sqlite3)$/i.test(file),
	);
	if (sensitive.length > 0) {
		fail(`Sensitive local data is tracked in git: ${sensitive.join(", ")}`);
	} else {
		pass("No database, uploads, or .env files are tracked in git");
	}

	const history = git(["log", "--all", "--oneline", "--", "data.db*"]);
	if (history) {
		warn(
			"Git history still contains a data.db backup. If this repository is or will be public, purge history and rotate EMDASH_ENCRYPTION_KEY.",
		);
	}
} catch {
	warn("Could not inspect git tracking state (not a git repository?)");
}

// --- Documentation -------------------------------------------------------
for (const doc of [
	"docs/08-SECURITY.md",
	"docs/09-TESTING.md",
	"docs/10-DEPLOYMENT.md",
	"docs/12-OPEN-DECISIONS.md",
]) {
	if (!existsSync(`${root}${doc}`)) fail(`Missing required document: ${doc}`);
}
if (failures.length === 0) pass("Security, testing, deployment, and open-decisions docs exist");

// --- Output --------------------------------------------------------------
for (const message of passes) console.log(`  ✓ ${message}`);
if (warnings.length > 0) {
	console.log("");
	for (const message of warnings) console.warn(`  ! ${message}`);
}
if (failures.length > 0) {
	console.log("");
	for (const message of failures) console.error(`  ✗ ${message}`);
	console.error(
		`\nLaunch check FAILED (${failures.length} blocker(s), ${warnings.length} warning(s))`,
	);
	process.exitCode = 1;
} else {
	console.log(`\nLaunch check PASSED (${warnings.length} warning(s))`);
}
