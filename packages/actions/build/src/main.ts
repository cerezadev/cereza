import { getInput, setFailed } from "@actions/core";
import { context } from "@actions/github";
import { build } from "./build";

const run = async () => {
	try {
		const url = getInput("url", { required: true });
		const token = getInput("token", { required: true });
		const providerId = context.payload.repository?.id as number;

		await build(url, providerId, token);
	} catch (err) {
		if (err instanceof Error) setFailed(err);
	}
};

run();
