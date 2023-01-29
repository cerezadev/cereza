import { ux } from "@oclif/core";
import { CerezaClient, CreateProjectCommand } from "client";
import { prompt } from "enquirer";
import { basename } from "path";
import { cwd } from "process";
import GithubCommand from "../../base/GithubCommand";
import { selectBackend } from "../../utils/backend";
import { mkdir, writeFile } from "fs/promises";
import { join } from "path";

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
      - uses: cereza/cereza/packages/actions/build@master
        with:
          url: \${{ secrets.CEREZA_BACKEND_URL }}
          token: \${{ secrets.CEREZA_BACKEND_TOKEN }}

`.trim();

export default class CreateProject extends GithubCommand {
	async run() {
		const projectName = await this.selectName();
		const backend = await selectBackend(this.appConfig);
		const repository = await this.selectRepository();

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

		ux.action.start("Generating configuration files");

		await mkdir(".github");
		await writeFile(join(".github", "cereza.yml"), CEREZA_BUILD_CONFIG);

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
