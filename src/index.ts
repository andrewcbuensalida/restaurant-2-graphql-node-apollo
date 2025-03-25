import { ApolloServer } from "@apollo/server";
import { readFileSync } from "fs";
import { resolvers } from "./graphql/resolvers/index";
import { getUserFromToken } from "./graphql/resolvers/Authorization";
import InMemoryDb, { IUser } from "./databases/inMemoryDb";
import express, { json } from "express";
import cors from "cors";
import gql from "graphql-tag";
import { expressMiddleware } from "@apollo/server/express4";
import { resolve } from "path";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import http from "http";
import { TheMealDb } from "./apis/theMealDb";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/use/ws";
import "dotenv/config";

export interface IContext {
	user: IUser | null;
	inMemoryDb: InMemoryDb;
	theMealDb: TheMealDb;
	JWT_SECRET: string | undefined;
}

const PORT = process.env.PORT || 5050;

const app = express();
// Our httpServer handles incoming requests to our Express app.
const httpServer = http.createServer(app);

const typeDefs = gql(
	readFileSync(resolve("schema.graphql"), {
		encoding: "utf-8",
	})
);

const schema = makeExecutableSchema({ typeDefs, resolvers });

// Creating the WebSocket server
const wsServer = new WebSocketServer({
	// This is the `httpServer` we created in a previous step.
	server: httpServer,
	// Pass a different path here if app.use
	// serves expressMiddleware at a different path
	path: "/subscriptions",
});

// Hand in the schema we just created and have the
// WebSocketServer start listening.
const serverCleanup = useServer({ schema }, wsServer);

const server = new ApolloServer<IContext>({
	schema,
	plugins: [
		// Proper shutdown for the HTTP server.
		ApolloServerPluginDrainHttpServer({ httpServer }),
		// Proper shutdown for the WebSocket server.
		{
			async serverWillStart() {
				return {
					// Below, we tell Apollo Server to "drain" this httpServer,
					// enabling our servers to shut down gracefully.
					async drainServer() {
						await serverCleanup.dispose();
					},
				};
			},
		},
	],
});

const startServer = async () => {
	await server.start();

	app.use(
		"/",
		cors<cors.CorsRequest>(),
		json(),
		expressMiddleware(server, {
			context: async ({ req }) => {
				const authHeader = req.headers["authorization"];
				const token = authHeader && authHeader.split(" ")[1];
				const user: IUser | null = getUserFromToken(
					token,
					process.env.JWT_SECRET
				);

				return {
					inMemoryDb: new InMemoryDb(), // could pass user as an argument here so that the auth check is done in the db layer, or can create a custom directive.
					theMealDb: new TheMealDb({ cache: server.cache }),
					user,
					JWT_SECRET: process.env.JWT_SECRET, // for jwt
				};
			},
		})
	);

	await new Promise<void>((resolve) =>
		httpServer.listen({ port: PORT }, resolve)
	);
	console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
};

startServer();
