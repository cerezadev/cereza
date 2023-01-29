import { CerezaClient, StartBuildCommand } from "client";

export const build = async (url: string, providerId: number, token: string) => {
	const cereza = new CerezaClient({ backend: { url } });

	const build = await cereza.send(
		new StartBuildCommand({
			providerId,
			token,
		})
	);

	if (!build.success) {
		throw new Error(build.error.message);
	}
};
