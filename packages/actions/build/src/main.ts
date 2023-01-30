import { getInput, setFailed, info, error } from "@actions/core";
import { context } from "@actions/github";
import { build } from "./build";

const run = async () => {
	try {
		const url = getInput("url", { required: true });
		const token = getInput("token", { required: true });

		info(context.payload.repository?.id);

		const _providerId = context.payload.repository?.id;

		if (_providerId === undefined) {
			return setFailed("Provider ID not found.");
		}

		const providerId =
			typeof _providerId === "number" ? _providerId : Number(_providerId);

		await build(url, providerId, token);
	} catch (err) {
		if (err instanceof Error) setFailed(err);
	}
};

run();
