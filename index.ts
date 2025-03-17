import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { menuItems, menuCategories, IMenuItem, IMenuCategory } from "./db";
import { typeDefs } from "./graphql/typeDefs";
import { Mutation } from "./graphql/resolvers/Mutation";
import { Query } from "./graphql/resolvers/Query";
import { MenuItem } from "./graphql/resolvers/MenuItem";
import { MenuCategory } from "./graphql/resolvers/MenuCategory";

interface IContext {
	token: string;
	menuItems: IMenuItem[];
	menuCategories: IMenuCategory[];
}

const server = new ApolloServer<IContext>({
	typeDefs,
	resolvers: {
		Query,
		Mutation,
		MenuItem,
		MenuCategory,
	},
});

// You can use await in the root if the file type is mjs
const startServer = async () => {
	// This can also be an express version
	const { url } = await startStandaloneServer(server, {
		// context function is called once for each request to the server.
		context: async ({ req }) => {
			const token = req.headers.authorization || "";

			return { token, menuItems, menuCategories };
		},
		listen: { port: 4001 }, // specify a different port here
	});
	console.log(`🚀 Server ready at ${url}`);
};

startServer();
