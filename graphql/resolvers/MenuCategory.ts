import { IResolvers } from "@graphql-tools/utils";
import { IMenuItem, IMenuCategory } from "../../db"; // Adjust the import path as needed

export const MenuCategory: IResolvers = {
	// need menuCategory resolver function because in typeDefs it returns a MenuCategory type. The other fields like id, title, ingredients, price, and menuCategoryId are scalar types and don't need a resolver function.
	menuItems: (parent, args, context) => {
		const { menuItems } = context;
		return menuItems.filter((item: IMenuItem) => {
			return item.categoryId === parent.id;
		});
	},
};
