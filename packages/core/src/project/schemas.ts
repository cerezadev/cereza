import { z } from "zod";

export const CreateProjectOptionsSchema = z.object({
	name: z.string(),
	providerId: z.number(),
});

export const DeleteProjectOptionsSchema = z.object({
	name: z.string(),
});
