import { CerezaClient, StartBuildCommand } from "client";

export const build = async (url: string, providerId: number, token: string) => {
	const cereza = new CerezaClient({ backend: { url } });

	console.log(`url: ${Buffer.from(url).toString("base64")}`);
	console.log(`token: ${Buffer.from(token).toString("base64")}`);

	const build = await cereza.send(
		new StartBuildCommand({
			providerId,
			token,
		})
	);

	if (!build.success) {
		throw build.error;
	}
};
