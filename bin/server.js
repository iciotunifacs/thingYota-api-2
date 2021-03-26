const path = require("path");
let envPath;

switch (process.env.NODE_ENV) {
	case "development":
		envPath = "dev.env";
		break;
	case "development-docker":
		envPath = "docker.env";
		break;
	case "production":
	default:
		envPath = ".env";
		break;
}

require("dotenv").config({
	path: envPath,
});

const mongoose = require("mongoose");
const server = require("../dist/server");
const env = require("../dist/config/env").default;

console.table(env);

const url = env.db.username
	? `${env.db.url}://${env.db.username}:${env.db.password}@${env.db.host}/${env.db.database}`
	: `${env.db.url}://${env.db.host}/${env.db.database}`;

mongoose
	.connect(url, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	})
	.then((data) => {
		console.info("Database as connected");
		console.info(url);
		server.start(env.sever.port, (data) => {
			console.info(`Press CTRL+C to kill`);
		});
	})
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
