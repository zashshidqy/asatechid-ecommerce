import node from "@astrojs/node";
import react from "@astrojs/react";
import { defineConfig, envField } from "astro/config";
import emdash, { local } from "emdash/astro";
import { sqlite } from "emdash/db";

export default defineConfig({
	output: "server",
	adapter: node({
		mode: "standalone",
	}),
	env: {
		schema: {
			INQUIRY_WHATSAPP_NUMBER: envField.string({
				context: "server",
				access: "secret",
				optional: true,
			}),
			INQUIRY_EMAIL: envField.string({
				context: "server",
				access: "secret",
				optional: true,
			}),
		},
	},
	image: {
		layout: "constrained",
		responsiveStyles: true,
	},
	integrations: [
		react(),
		emdash({
			database: sqlite({ url: "file:./data.db" }),
			storage: local({
				directory: "./uploads",
				baseUrl: "/_emdash/api/media/file",
			}),
			plugins: [
				{
					id: "seo-review",
					version: "1.0.0",
					entrypoint: "/src/plugins/seo-review/index.ts",
					format: "native",
				},
			],
		}),
	],
	devToolbar: { enabled: false },
});
