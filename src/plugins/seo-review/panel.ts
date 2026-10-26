/**
 * Block Kit rendering for the SEO Review editor panel.
 *
 * Plain text only: Block Kit sections render text, not Markdown. The SERP
 * preview is a deliberate simulation (truncation widths differ from Google and
 * from device to device) and is labelled as such.
 */

import { blocks, elements, type Block } from "@emdash-cms/blocks/server";
import {
	SEVERITY_LABELS,
	SEVERITY_ORDER,
	type AuditIssue,
	type AuditResult,
	type IssueSeverity,
} from "../../lib/seo-review/audit";

export interface PanelMeta {
	collection: string;
	entryId: string;
}

function truncate(text: string, max: number): string {
	const normalized = text.replace(/\s+/g, " ").trim();
	if (normalized.length <= max) return normalized;
	return `${normalized.slice(0, Math.max(0, max - 1)).trimEnd()}…`;
}

function issueValue(issue: AuditIssue): string {
	return issue.detail ? `${issue.message} (${issue.detail})` : issue.message;
}

function groupIssues(
	result: AuditResult,
): Array<{ severity: IssueSeverity; issues: AuditIssue[] }> {
	return SEVERITY_ORDER.map((severity) => ({
		severity,
		issues: result.issues.filter((issue) => issue.severity === severity),
	})).filter((group) => group.issues.length > 0);
}

function previewFields(
	result: AuditResult,
	titleMax: number,
	descriptionMax: number,
): Block {
	return blocks.fields([
		{ label: "Judul", value: truncate(result.serp.title, titleMax) },
		{ label: "URL", value: result.serp.displayUrl },
		{ label: "Deskripsi", value: truncate(result.serp.description, descriptionMax) },
	]);
}

/**
 * Renders the full panel: score, SERP desktop/mobile preview, grouped
 * checklist, content metrics, score breakdown, and a manual refresh action.
 */
export function renderPanel(result: AuditResult, meta: PanelMeta): Block[] {
	const panel: Block[] = [
		blocks.header("SEO Review"),
		blocks.section(
			`Pratinjau memakai data draf terakhir yang tersimpan untuk ${meta.collection}/${meta.entryId}. ` +
				"Perubahan yang belum disimpan di editor belum terlihat di sini.",
		),
	];

	if (result.gate.blocked) {
		panel.push(
			blocks.banner({
				variant: "error",
				title: "Publikasi akan diblokir",
				description: result.gate.reasons.join(" "),
			}),
		);
	} else {
		const variant =
			result.score >= 85 ? "default" : result.score >= 70 ? "alert" : "error";
		panel.push(
			blocks.banner({
				variant,
				title: `Skor panduan internal: ${result.score}/100 — ${result.scoreLabel}`,
				description:
					`${result.counts.error} wajib · ${result.counts.warning} peringatan · ` +
					`${result.counts.suggestion} saran · ${result.counts.info} info.`,
			}),
		);
	}

	panel.push(
		blocks.stats([
			{ label: "Skor", value: result.score },
			{ label: "Wajib", value: result.counts.error },
			{ label: "Peringatan", value: result.counts.warning },
			{ label: "Saran", value: result.counts.suggestion },
		]),
		blocks.divider(),
		blocks.header("Pratinjau hasil pencarian"),
		blocks.columns([
			[
				blocks.header("Desktop"),
				previewFields(result, 60, 160),
				blocks.context("Perkiraan tampilan desktop: ±60 karakter judul, ±160 karakter deskripsi."),
			],
			[
				blocks.header("Mobile"),
				previewFields(result, 50, 120),
				blocks.context("Perkiraan tampilan mobile: ±50 karakter judul, ±120 karakter deskripsi."),
			],
		]),
		blocks.context(
			"Ini simulasi tampilan, bukan hasil Google. Panjang potongan berbeda per perangkat dan dapat berubah.",
		),
		blocks.divider(),
		blocks.header("Pemeriksaan"),
	);

	const groups = groupIssues(result);
	if (groups.length === 0) {
		panel.push(
			blocks.section("Tidak ada masalah yang terdeteksi pada pemeriksaan saat ini."),
		);
	} else {
		for (const group of groups) {
			panel.push(
				blocks.header(`${SEVERITY_LABELS[group.severity]} (${group.issues.length})`),
				blocks.fields(
					group.issues.map((issue) => ({
						label: issue.label,
						value: issueValue(issue),
					})),
				),
			);
		}
	}

	panel.push(
		blocks.divider(),
		blocks.header("Metrik konten"),
		blocks.fields([
			{ label: "Kata", value: String(result.metrics.wordCount) },
			{ label: "Subjudul H2/H3", value: String(result.metrics.headingCount) },
			{ label: "Gambar", value: String(result.metrics.imageCount) },
			{ label: "Gambar tanpa alt", value: String(result.metrics.missingAltCount) },
			{ label: "Tautan internal", value: String(result.metrics.internalLinkCount) },
			{ label: "Tautan eksternal", value: String(result.metrics.externalLinkCount) },
		]),
		blocks.divider(),
		blocks.header("Rincian skor"),
	);

	const deductions = result.breakdown.filter((item) => item.count > 0);
	if (deductions.length === 0) {
		panel.push(blocks.section("Tidak ada pengurangan skor."));
	} else {
		panel.push(
			blocks.fields(
				deductions.map((item) => ({
					label: `${SEVERITY_LABELS[item.severity]} × ${item.count}`,
					value: `−${item.deduction} poin (bobot ${item.points})`,
				})),
			),
		);
	}

	panel.push(
		blocks.context(result.scoreExplanation),
		blocks.actions([
			elements.button("refresh", "Periksa ulang", { style: "secondary" }),
		]),
	);

	return panel;
}
