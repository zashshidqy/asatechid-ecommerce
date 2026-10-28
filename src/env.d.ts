declare namespace App {
	interface Locals {
		/** Per-request nonce for the public Content-Security-Policy. */
		cspNonce?: string;
	}
}
