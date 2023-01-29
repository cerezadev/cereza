import { Flags } from "@oclif/core";
import { CerezaClient, DeleteProjectCommand } from "client";
import ConfigCommand from "../../base/ConfigCommand";
import { selectBackend } from "../../utils/backend";

export default class DeleteProject extends ConfigCommand {
	static flags = {
		backend: Flags.string({ char: "b" }),
		project: Flags.string({ char: "p", required: true }),
	};

	async run() {
		const {
			flags: { project },
		} = await this.parse(DeleteProject);

		const backend = await this.selectBackend();

		const cereza = new CerezaClient({ backend });
		const removal = await cereza.send(
			new DeleteProjectCommand({ name: project })
		);

		if (!removal.success) {
			this.error(removal.error.message);
		}

		this.log("Deleted project.");
	}

	async selectBackend() {
		const {
			flags: { backend: backendName },
		} = await this.parse(DeleteProject);

		if (backendName === undefined) {
			return selectBackend(this.appConfig);
		}

		const backend = this.appConfig.backends.find(
			({ name }) => name === backendName
		);

		if (backend === undefined) {
			this.error("Backend not found.");
		}

		return backend;
	}
}
