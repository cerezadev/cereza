import {
	createOAuthDeviceAuth,
	GitHubAppAuthOptions,
	type GitHubAppAuthentication,
	type GitHubAppStrategyOptions,
} from "@octokit/auth-oauth-device";
import { Octokit } from "octokit";
import { writeConfig } from "../utils/config";
import ConfigCommand from "./ConfigCommand";

const CLIENT_ID = "Iv1.f03da4b1afd21a38";

type StrategyOptions = GitHubAppStrategyOptions & {
	authentication?: GitHubAppAuthentication;
};

const authStrategyOptions = (accessToken?: string) =>
	({
		clientType: "github-app",
		clientId: CLIENT_ID,
		onVerification: ({ user_code, verification_uri }) => {
			console.log(`Enter ${user_code} into ${verification_uri}.`);
		},
		authentication:
			accessToken !== undefined
				? {
						type: "token",
						tokenType: "oauth",
						clientType: "github-app",
						clientId: CLIENT_ID,
						token: accessToken,
				  }
				: undefined,
	} satisfies StrategyOptions);

const authOptions = { type: "oauth" } satisfies GitHubAppAuthOptions;

export default abstract class GithubCommand extends ConfigCommand {
	protected octokit!: Octokit;

	protected async init() {
		await super.init();

		const {
			github: { accessToken },
		} = this.appConfig;

		const octokit = new Octokit({
			authStrategy: createOAuthDeviceAuth,
			auth: authStrategyOptions(accessToken),
		});

		const auth = (await octokit.auth(
			authOptions
		)) as GitHubAppAuthentication;

		await writeConfig({
			...this.appConfig,
			github: { ...this.appConfig.github, accessToken: auth.token },
		});

		this.octokit = octokit;
	}
}
