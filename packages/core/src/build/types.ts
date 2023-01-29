import { z } from "zod";
import { StartBuildSchema } from "./schemas";

export type StartBuildOptionsInput = z.input<typeof StartBuildSchema>;
export type StartBuildOptions = z.infer<typeof StartBuildSchema>;
