import { IResolvers } from "@graphql-tools/utils";
import { IMenuItem, IMenuCategory } from "../../db"; // Adjust the import path as needed

export const MenuItem: IResolvers = {
	// need menuCategory resolver function because in typeDefs it returns a MenuCategory type. The other fields like id, title, ingredients, price, and menuCategoryId are scalar types and don't need a resolver function.
	menuCategory: (parent, args, context) => {
		const { menuCategories } = context;
		return menuCategories.find((category: IMenuCategory) => {
			return category.id === parent.categoryId;
		});
	},
};
