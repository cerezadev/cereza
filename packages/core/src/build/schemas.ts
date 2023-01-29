import { z } from "zod";

export const StartBuildSchema = z.object({
	providerId: z.number(),
	token: z.string(),
});
