import { initTRPC } from "@trpc/server";
import { ZodError } from "zod";

export const { router, mergeRouters, procedure, middleware } = initTRPC.create({
	errorFormatter: (data) => {
		if (data.error.cause instanceof ZodError) {
			return {
				...data.shape,
				message: data.error.cause.issues[0].message,
			};
		}

		return data;
	},
});
