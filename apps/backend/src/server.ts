import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { backendRouter } from "./routers";

const PORT = 16231;

const { listen } = createHTTPServer({
	router: backendRouter,
});

listen(PORT);

console.log(`Listening on port ${PORT}.`);
