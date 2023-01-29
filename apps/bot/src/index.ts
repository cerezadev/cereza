import { Probot } from "probot";

export default (app: Probot) => {
	app.on("push", async (context) => {
		app.log.info(`Pushed to ${context.payload.ref}`);

		context.config("cereza.yml");
	});
};
