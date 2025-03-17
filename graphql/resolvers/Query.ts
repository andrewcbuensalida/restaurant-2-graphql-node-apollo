import { IResolvers } from "@graphql-tools/utils";
import { IMenuItem, IMenuCategory } from "../../db"; // Adjust the import path as needed

// The keys should be the same as the typeDefs.
export const Query: IResolvers = {
	// parent comes from the field's parent, or rootValue function in Apollo Server constructor. context comes from the ApolloServer setup in index.ts. Use this to share authentication info and ORMs. This should never be destructively modified. args are the arguments passed to the query. info contains info about execution state, such as the field name, the path to the field, etc.
	menuItems: (parent, args, context, info) => {
		const { menuItems } = context;
		return menuItems;
	},
	menuItem: (parent, args, context) => {
		const { menuItems } = context;
		const { id } = args;
		return menuItems.find((item: IMenuItem) => item.id === id);
	},
	menuCategories: (parent, args, context) => {
		const { menuCategories } = context;
		return menuCategories;
	},
	menuCategory: (parent, args, context) => {
		const { menuCategories } = context;
		const { id } = args;
		return menuCategories.find(
			(category: IMenuCategory) => category.id === id
		);
	},
};
