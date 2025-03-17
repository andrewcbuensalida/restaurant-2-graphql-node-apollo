import { IResolvers } from "@graphql-tools/utils";

export const MenuCategory: IResolvers = {
	// need menuCategory resolver function because in typeDefs it returns a MenuCategory type. The other fields like id, title, ingredients, price, and menuCategoryId are scalar types and don't need a resolver function.
	menuItems: (parent, args, context) => {
		const { inMemoryDb } = context;
		return inMemoryDb.findMenuItemsByCategoryId(parent.id);
	},
};
