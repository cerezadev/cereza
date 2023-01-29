import { handle } from "core";
import { readFile, writeFile } from "fs/promises";
import { homedir } from "os";
import { join } from "path";
import { z } from "zod";

const unique = <T>(items: T[]) => {
	const seen = new Set<T>();

	for (const item of items) {
		if (seen.has(item)) {
			return false;
		}

		seen.add(item);
	}

	return true;
};

const CerezaConfigSchema = z
	.object({
		backends: z
			.array(
				z.object({
					name: z.string({
						invalid_type_error: `Backend "name" must be of type string.`,
						required_error:
							'Backend "name" string property is required.',
					}),
					url: z.string({
						invalid_type_error: `Backend "url" must be of type string.`,
						required_error:
							'Backend "url" string property is required.',
					}),
				}),
				{
					invalid_type_error: `"backends" must be an array of Backend objects.`,
				}
			)
			.default([]),
		github: z
			.object({
				accessToken: z.string().optional(),
			})
			.default({}),
	})
	.refine(
		({ backends }) => unique(backends.map(({ name }) => name)),
		"Backend names must be unique."
	);

type CerezaConfigInput = z.input<typeof CerezaConfigSchema>;
export type CerezaConfig = z.infer<typeof CerezaConfigSchema>;

const CONFIG_READ_ERROR = (message: string) =>
	`

Could not read config file for the following reason:
    ${message}

`.trim();

const CONFIG_WRITE_ERROR = (message: string) =>
	`

Could not write config file for the following reason:
    ${message}

`.trim();

const CONFIG_PATH = join(homedir(), ".cereza", "config.json");

export const readConfig = async () => {
	const read = await handle(() => readFile(CONFIG_PATH, "utf-8"))<Error>();

	if (!read.success) {
		throw new Error(CONFIG_READ_ERROR(read.error.message));
	}

	const jsonParse = await handle<CerezaConfigInput>(() =>
		JSON.parse(read.data)
	)<Error>();

	if (!jsonParse.success) {
		throw new Error(CONFIG_READ_ERROR(jsonParse.error.message));
	}

	const configParse = CerezaConfigSchema.safeParse(jsonParse.data);

	if (!configParse.success) {
		throw new Error(configParse.error.errors[0].message);
	}

	return configParse.data;
};

export const writeConfig = async (config: CerezaConfig) => {
	const configParse = CerezaConfigSchema.safeParse(config);

	if (!configParse.success) {
		throw new Error(configParse.error.errors[0].message);
	}

	const stringify = await handle(() =>
		JSON.stringify(configParse.data, null, 4)
	)<Error>();

	if (!stringify.success) {
		throw stringify.error;
	}

	const write = await handle(() =>
		writeFile(CONFIG_PATH, stringify.data)
	)<Error>();

	if (!write.success) {
		throw new Error(CONFIG_WRITE_ERROR(write.error.message));
	}
};
