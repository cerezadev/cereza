import { z } from "zod";
import {
	CreateProjectOptionsSchema,
	DeleteProjectOptionsSchema,
} from "./schemas";

export type CreateProjectOptionsInput = z.input<
	typeof CreateProjectOptionsSchema
>;
export type CreateProjectOptions = z.infer<typeof CreateProjectOptionsSchema>;

export type DeleteProjectOptionsInput = z.input<
	typeof DeleteProjectOptionsSchema
>;
export type DeleteProjectOptions = z.infer<typeof DeleteProjectOptionsSchema>;
