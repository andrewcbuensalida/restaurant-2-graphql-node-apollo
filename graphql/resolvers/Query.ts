import { IResolvers } from "@graphql-tools/utils";
import { IContext } from "../../index";

// The keys should be the same as the typeDefs.
export const Query: IResolvers<any, IContext> = {
	// parent comes from the field's parent, or rootValue function in Apollo Server constructor. context comes from the ApolloServer setup in index.ts. Use this to share authentication info and ORMs. This should never be destructively modified. args are the arguments passed to the query. info contains info about execution state, such as the field name, the path to the field, etc.
	menuItems: (parent, args, context, info) => {
		const { inMemoryDb } = context;
		return inMemoryDb.findAllMenuItems();
	},
	menuItem: (parent, args, context) => {
		const { id } = args;
		const { inMemoryDb } = context;
		return inMemoryDb.findMenuItemById(id);
	},
	menuCategories: (parent, args, context) => {
		const { inMemoryDb } = context;
		return inMemoryDb.findAllMenuCategories();
	},
	menuCategory: (parent, args, context) => {
		const { id } = args;
		const { inMemoryDb } = context;
		return inMemoryDb.findMenuCategoryById(id);
	},
};
