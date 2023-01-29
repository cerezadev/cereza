import { Args } from "@oclif/core";
import { handle } from "core";
import ConfigCommand from "../../base/ConfigCommand";
import { writeConfig } from "../../utils/config";

export default class AddCommand extends ConfigCommand {
	static args = {
		name: Args.string({ required: true }),
		url: Args.string({ required: true }),
	};

	async run() {
		const {
			args: { name, url },
		} = await this.parse(AddCommand);

		const newConfig = {
			...this.appConfig,
			backends: [...this.appConfig.backends, { name, url }],
		};

		const configWrite = await handle(() => writeConfig(newConfig))<Error>();

		if (!configWrite.success) {
			this.error(configWrite.error.message);
		}

		this.log(`Added backend "${name}" with url "${url}".`);
	}
}
