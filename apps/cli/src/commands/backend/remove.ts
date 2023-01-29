import { Args } from "@oclif/core";
import { handle } from "core";
import ConfigCommand from "../../base/ConfigCommand";
import { writeConfig } from "../../utils/config";

export default class RemoveCommand extends ConfigCommand {
	static args = {
		name: Args.string({ required: true }),
	};

	async run() {
		const {
			args: { name },
		} = await this.parse(RemoveCommand);

		const backendIndex = this.appConfig.backends.findIndex(
			({ name: curName }) => curName === name
		);

		if (backendIndex === -1) {
			this.error("A backend with that name does not exist.");
		}

		this.appConfig.backends.splice(backendIndex, 1);

		const configWrite = await handle(() =>
			writeConfig(this.appConfig)
		)<Error>();

		if (!configWrite.success) {
			this.error(configWrite.error.message);
		}

		this.log(`Removed backend "${name}".`);
	}
}
