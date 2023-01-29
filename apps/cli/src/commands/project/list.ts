import { Args } from "@oclif/core";
import { CerezaClient, ListProjectsCommand } from "client";
import ConfigCommand from "../../base/ConfigCommand";
import { selectBackend } from "../../utils/backend";

const PROJECTS = (backendName: string, projectStr: string) =>
	`

Projects (${backendName}):
${projectStr}

`.trim();

export default class ListProjects extends ConfigCommand {
	static args = {
		backendName: Args.string(),
	};

	async run() {
		const backend = await this.selectBackend();

		const cereza = new CerezaClient({ backend });
		const listing = await cereza.send(new ListProjectsCommand());

		if (!listing.success) {
			this.error(listing.error.message);
		}

		const projectStrs = listing.data.map(
			({ name }, index) => `${index + 1}. ${name}`
		);
		const projectStr = projectStrs.join("\n");

		this.log(PROJECTS(backend.name, projectStr));
	}

	async selectBackend() {
		const {
			args: { backendName },
		} = await this.parse(ListProjects);

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
