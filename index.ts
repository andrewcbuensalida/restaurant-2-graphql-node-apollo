import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import InMemoryDb, { IMenuCategory, IMenuItem } from "./databases/inMemoryDb";
import { typeDefs } from "./graphql/typeDefs";
import { resolvers } from "./graphql/resolvers";

export interface IContext {
	token: string;
	inMemoryDb: InMemoryDb;
}

const server = new ApolloServer<IContext>({
	typeDefs,
	resolvers,
});

// You can use await in the root if the file type is mjs
const startServer = async () => {
	// This can also be an express version
	const { url } = await startStandaloneServer<IContext>(server, {
		// context function is called once for each request to the server.
		context: async ({ req }) => {
			const token = req.headers.authorization || "";

			return { token, inMemoryDb: new InMemoryDb() };
		},
		listen: { port: 4001 }, // specify a different port here
	});
	console.log(`🚀 Server ready at ${url}`);
};

startServer();
