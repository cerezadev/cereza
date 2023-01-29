import ConfigCommand from "../../base/ConfigCommand";

const BACKENDS = (backends: string) =>
	`

Backends:
${backends}

`.trim();

export default class ListCommand extends ConfigCommand {
	async run() {
		const { backends } = this.appConfig;

		if (backends.length === 0) {
			this.log("No backends registered.");
			return;
		}

		const backendStrs = backends.map(
			({ name, url }, index) => `${index + 1}. ${url} (${name})`
		);
		const backendStr = backendStrs.join("\n");

		this.log(BACKENDS(backendStr));
	}
}
