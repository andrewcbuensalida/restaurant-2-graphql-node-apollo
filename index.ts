import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

import { typeDefs, resolvers } from "./graphql";

const server = new ApolloServer({ typeDefs, resolvers });

(async () => {
	const { url } = await startStandaloneServer(server);
	console.log(`🚀 Server ready at ${url}`);
})();
