import { Command } from "@oclif/core";
import { handle } from "core";
import { CerezaConfig, readConfig } from "../utils/config";

export default abstract class ConfigCommand extends Command {
	protected appConfig!: CerezaConfig;

	protected async init() {
		await super.init();

		const configRead = await handle(readConfig)<Error>();

		if (!configRead.success) {
			this.error(configRead.error.message);
		}

		this.appConfig = configRead.data;
	}
}
