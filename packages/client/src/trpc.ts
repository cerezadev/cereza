import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { BackendRouter } from "backend";

export const trpc = createTRPCProxyClient<BackendRouter>({
	links: [
		httpBatchLink({
			url: "http://localhost:16231",
		}),
	],
});
