import { StartBuildSchema } from "core";
import {
	projectWithProviderIdExists,
	projectWithTokenExists,
} from "../db/project";
import { procedure, router } from "../trpc";

export const buildRouter = router({
	startBuild: procedure
		.input(
			StartBuildSchema.refine(
				({ token }) => projectWithTokenExists(token),
				"The access token is invalid."
			).refine(
				({ providerId }) => projectWithProviderIdExists(providerId),
				"A project with that provider id does not exist."
			)
		)
		.mutation(() => {
			console.log("Starting build.");
		}),
});
