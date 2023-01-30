import { defineConfig } from "tsup";

export default defineConfig({
	target: "node16",
	noExternal: ["@actions/core", "@actions/github", "client"],
});
