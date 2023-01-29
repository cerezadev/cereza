import type { CreateTRPCProxyClient } from "@trpc/client";
import type { BackendRouter } from "backend";

export interface Command<T = unknown> {
	send(trpc: CreateTRPCProxyClient<BackendRouter>): Promise<T>;
}
