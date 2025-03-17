import { IResolvers } from "@graphql-tools/utils";

export const MenuItem: IResolvers = {
	// need menuCategory resolver function because in typeDefs it returns a MenuCategory type. The other fields like id, title, ingredients, price, and menuCategoryId are scalar types and don't need a resolver function.
	menuCategory: (parent, args, context) => {
		const { inMemoryDb } = context;
		return inMemoryDb.findMenuCategoryById(parent.categoryId);
	},
};
