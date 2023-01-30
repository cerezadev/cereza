import { defineConfig } from "tsup";

export default defineConfig({
	target: "node16",
	// minify: true,
	noExternal: ["@actions/core", "@actions/github", "client"],
});
