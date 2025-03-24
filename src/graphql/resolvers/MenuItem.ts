import { IResolvers } from "@graphql-tools/utils";
import { IContext } from "../..";

export const MenuItem: IResolvers<any, IContext> = {
	// need menuCategory resolver function because in typeDefs it returns a MenuCategory type. The other fields like id, title, ingredients, price, and menuCategoryId are scalar types and don't need a resolver function.
	menuCategory: (parent, args, context) => {
		const { inMemoryDb } = context;
		return inMemoryDb.findMenuCategoryById(parent.categoryId);
	},
	orderItems: (parent, args, context) => {
		const { inMemoryDb } = context;
		return inMemoryDb.findOrderItemsByMenuItemId(parent.id);
	},
	strMealThumb: (parent, args, context) => {
		const { theMealDb } = context;
		return theMealDb.getRandomStrMealThumb();
	},
};
