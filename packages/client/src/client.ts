import {
	createTRPCProxyClient,
	httpBatchLink,
	TRPCClientError,
} from "@trpc/client";
import type { BackendRouter } from "backend";
import { handle } from "core";
import nodeFetch from "node-fetch";
import { z } from "zod";
import { Command } from "./commands/Command";

const CerezaClientOptionsSchema = z.object({
	backend: z.object({
		url: z.string(),
	}),
});

type CerezaClientOptionsInput = z.input<typeof CerezaClientOptionsSchema>;

export class CerezaClient {
	private readonly trpc;

	constructor(_options: CerezaClientOptionsInput) {
		const {
			backend: { url },
		} = CerezaClientOptionsSchema.parse(_options);

		this.trpc = createTRPCProxyClient<BackendRouter>({
			links: [
				httpBatchLink({
					url,
					fetch: nodeFetch as unknown as typeof fetch,
				}),
			],
		});
	}

	public async send<T>(command: Command<T>) {
		return handle(() => command.send(this.trpc))<
			TRPCClientError<BackendRouter>
		>();
	}
}
