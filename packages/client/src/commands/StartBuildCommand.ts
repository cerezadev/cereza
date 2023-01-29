import { CreateTRPCProxyClient } from "@trpc/client";
import { BackendRouter } from "backend";
import {
	StartBuildOptions,
	StartBuildOptionsInput,
	StartBuildSchema,
} from "core";
import { Command } from "./Command";

export class StartBuildCommand implements Command {
	private readonly options: StartBuildOptions;

	constructor(_options: StartBuildOptionsInput) {
		this.options = StartBuildSchema.parse(_options);
	}

	async send(trpc: CreateTRPCProxyClient<BackendRouter>) {
		return trpc.startBuild.mutate(this.options);
	}
}
