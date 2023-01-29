import type { CreateTRPCProxyClient } from "@trpc/client";
import type { BackendRouter } from "backend";
import { Command } from "./Command";

export class ListProjectsCommand implements Command {
	async send(trpc: CreateTRPCProxyClient<BackendRouter>) {
		return trpc.listProjects.query();
	}
}
