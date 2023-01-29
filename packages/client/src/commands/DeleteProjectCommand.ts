import { CreateTRPCProxyClient } from "@trpc/client";
import { BackendRouter } from "backend";
import { DeleteProjectOptions, DeleteProjectOptionsInput } from "core";
import { DeleteProjectOptionsSchema } from "core/src/project/schemas";
import { Command } from "./Command";

export class DeleteProjectCommand implements Command {
	private readonly options: DeleteProjectOptions;

	constructor(_options: DeleteProjectOptionsInput) {
		this.options = DeleteProjectOptionsSchema.parse(_options);
	}

	async send(trpc: CreateTRPCProxyClient<BackendRouter>) {
		return trpc.deleteProject.mutate(this.options);
	}
}
