import { mergeRouters } from "../trpc";
import { buildRouter } from "./build";
import { projectRouter } from "./project";

export const backendRouter = mergeRouters(projectRouter, buildRouter);

export type BackendRouter = typeof backendRouter;
