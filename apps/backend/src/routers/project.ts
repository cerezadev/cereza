import { CreateProjectOptionsSchema } from "core";
import { DeleteProjectOptionsSchema } from "core/src/project/schemas";
import { negate } from "core/src/utils";
import {
	createProject,
	deleteProject,
	listProjects,
	projectWithNameExists,
	projectWithProviderIdExists,
} from "../db/project";
import { procedure, router } from "../trpc";

export const projectRouter = router({
	listProjects: procedure.query(listProjects),
	createProject: procedure
		.input(
			CreateProjectOptionsSchema.refine(
				({ name }) => negate(projectWithNameExists(name)),
				"A project with that name already exists."
			).refine(
				({ providerId }) =>
					negate(projectWithProviderIdExists(providerId)),
				"A project with that repository already exists."
			)
		)
		.mutation(({ input }) => createProject(input)),
	deleteProject: procedure
		.input(
			DeleteProjectOptionsSchema.refine(
				({ name }) => projectWithNameExists(name),
				"A project with that name does not exist."
			)
		)
		.mutation(({ input }) => deleteProject(input)),
});
