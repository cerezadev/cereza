import { ux } from "@oclif/core";
import { CerezaClient, CreateProjectCommand } from "client";
import { prompt } from "enquirer";
import { basename } from "path";
import { cwd } from "process";
import GithubCommand from "../../base/GithubCommand";
import { selectBackend } from "../../utils/backend";
import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import {
	ready,
	from_base64,
	from_string,
	base64_variants,
	crypto_box_seal,
	to_base64,
} from "libsodium-wrappers";

const CEREZA_BUILD_CONFIG = `

name: Build
on:
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: cerezadev/cereza/packages/actions/build@start
        with:
          url: \${{ secrets.CEREZA_BACKEND_URL }}
          token: \${{ secrets.CEREZA_BACKEND_TOKEN }}

`.trim();

export default class CreateProject extends GithubCommand {
	async run() {
		const projectName = await this.selectName();
		const backend = await selectBackend(this.appConfig);
		const repository = await this.selectRepository();

		const project = await this.createProject(
			backend,
			projectName,
			repository
		);

		await this.addSecrets(
			backend.url,
			project.connection.token,
			repository
		);

		await this.generateFiles();
	}

	async createProject(
		backend: { name: string; url: string },
		projectName: string,
		repository: { id: number }
	) {
		const cereza = new CerezaClient({ backend });

		ux.action.start("Creating project");

		const creation = await cereza.send(
			new CreateProjectCommand({
				name: projectName,
				providerId: repository.id,
			})
		);

		if (!creation.success) {
			this.error(creation.error.message);
		}

		ux.action.stop();

		return creation.data;
	}

	async addSecrets(
		backendUrl: string,
		accessToken: string,
		repository: {
			owner: { login: string };
			name: string;
		}
	) {
		ux.action.start("Adding secrets to repository");

		const {
			data: { key_id, key },
		} = await this.octokit.rest.actions.getRepoPublicKey({
			owner: repository.owner.login,
			repo: repository.name,
		});

		await this.octokit.rest.actions.createOrUpdateRepoSecret({
			owner: repository.owner.login,
			repo: repository.name,
			secret_name: "CEREZA_BACKEND_URL",
			encrypted_value: await encrypt(backendUrl, key),
			key_id,
		});

		await this.octokit.rest.actions.createOrUpdateRepoSecret({
			owner: repository.owner.login,
			repo: repository.name,
			secret_name: "CEREZA_BACKEND_TOKEN",
			encrypted_value: await encrypt(accessToken, key),
			key_id,
		});

		ux.action.stop();
	}

	async generateFiles() {
		ux.action.start("Generating configuration files");

		const workFlowsPath = join(".github", "workflows");

		await mkdir(workFlowsPath, { recursive: true });
		await writeFile(join(workFlowsPath, "cereza.yml"), CEREZA_BUILD_CONFIG);

		ux.action.stop();
	}

	async selectName() {
		const { projectName } = await prompt<{ projectName: string }>({
			name: "projectName",
			message: "Name of project",
			type: "input",
			initial: basename(cwd()),
		});

		return projectName;
	}

	async selectRepository() {
		const installations = await this.getInstallations();

		const installation = installations.find(
			({ app_id }) => app_id === 286780
		);

		if (installation === undefined) {
			this.error("App installation not found on GitHub account.");
		}

		const repositories = await this.getRepositories(installation.id);

		const { repositoryName } = await prompt<{ repositoryName: string }>({
			name: "repositoryName",
			message: "Choose a repository",
			type: "autocomplete",
			choices: repositories.map(({ name }) => name),
		});

		return repositories.find(({ name }) => name === repositoryName)!;
	}

	getInstallations() {
		return this.octokit.rest.apps
			.listInstallationsForAuthenticatedUser()
			.then(({ data: { installations } }) => installations);
	}

	getRepositories(installationId: number) {
		return this.octokit.rest.apps
			.listInstallationReposForAuthenticatedUser({
				installation_id: installationId,
			})
			.then(({ data: { repositories } }) => repositories);
	}
}

const encrypt = async (value: string, key: string) => {
	await ready;

	const keyBytes = from_base64(key, base64_variants.ORIGINAL);
	const secretBytes = from_string(value);
	const encryptedBytes = crypto_box_seal(secretBytes, keyBytes);
	const encryptedStr = to_base64(encryptedBytes, base64_variants.ORIGINAL);

	return encryptedStr;
};
