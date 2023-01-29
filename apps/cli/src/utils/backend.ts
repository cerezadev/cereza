import type { CerezaConfig } from "./config";
import { prompt } from "enquirer";

export const selectBackend = async ({ backends }: CerezaConfig) => {
	const { backendName } = await prompt<{ backendName: string }>({
		name: "backendName",
		message: "Select a backend to use",
		type: "autocomplete",
		choices: backends.map(({ name, url }) => ({
			name,
			hint: url,
		})),
	});

	return backends.find(({ name: curName }) => curName === backendName)!;
};
