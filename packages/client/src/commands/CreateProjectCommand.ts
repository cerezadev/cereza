import { CreateTRPCProxyClient } from "@trpc/client";
import type { inferRouterOutputs } from "@trpc/server";
import { BackendRouter } from "backend";
import {
	CreateProjectOptions,
	CreateProjectOptionsInput,
	CreateProjectOptionsSchema,
} from "core";
import { Command } from "./Command";

type BackendOutputs = inferRouterOutputs<BackendRouter>;
type CommandOutput = BackendOutputs["createProject"];

export class CreateProjectCommand implements Command<CommandOutput> {
	private readonly options: CreateProjectOptions;

	constructor(_options: CreateProjectOptionsInput) {
		this.options = CreateProjectOptionsSchema.parse(_options);
	}

	public async send(trpc: CreateTRPCProxyClient<BackendRouter>) {
		return trpc.createProject.mutate(this.options);
	}
}
