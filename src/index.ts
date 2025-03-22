import { ApolloServer } from "@apollo/server";
import { readFileSync } from "fs";
import { resolvers } from "./graphql/resolvers/index";
import InMemoryDb from "./databases/inMemoryDb";
import express, { json } from "express";
import cors from "cors";
import gql from "graphql-tag";
import { expressMiddleware } from "@apollo/server/express4";
import { resolve } from "path";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import http from "http";

export interface IContext {
	token: string;
	inMemoryDb: InMemoryDb;
}

const PORT = process.env.PORT || 5050;

const app = express();
app.use(cors());
app.use(express.json());

const typeDefs = gql(
	readFileSync(resolve( "schema.graphql"), {
		encoding: "utf-8",
	})
);

// Our httpServer handles incoming requests to our Express app.
// Below, we tell Apollo Server to "drain" this httpServer,
// enabling our servers to shut down gracefully.
const httpServer = http.createServer(app);

const server = new ApolloServer<IContext>({
	typeDefs,
	resolvers,
	plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

const startServer = async () => {
  await server.start();

  app.use(
    "/",
    cors<cors.CorsRequest>(),
    json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({
        token: req.headers.authorization || "",
        inMemoryDb: new InMemoryDb(),
      }),
    })
  );

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: PORT }, resolve)
  );
  console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
};

startServer();
