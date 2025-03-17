import { IResolvers } from "@graphql-tools/utils";
import { IMenuItem, IMenuCategory } from "../../db"; // Adjust the import path as needed
import { v4 } from "uuid";

export const Mutation: IResolvers = {
	addMenuItem: (parent, args, context) => {
		const { menuItems } = context;
		const newItem = {
			...args.input,
			id: v4(),
		};
		menuItems.push(newItem);
		return newItem;
	},
	updateMenuItem: (parent, args, context) => {
		const { menuItems } = context;
		const { id, input } = args;
		const index = menuItems.findIndex((item: IMenuItem) => item.id === id);
		if (index === -1) return null;
		const updatedItem = { ...menuItems[index], ...input };
		menuItems[index] = updatedItem;
		return updatedItem;
	},
	deleteMenuItem: (parent, args, context) => {
		const { menuItems } = context;
		const { id } = args;
		const index = menuItems.findIndex((item: IMenuItem) => item.id === id);
		if (index === -1) return null;
		const deletedItem = menuItems.splice(index, 1);
		return deletedItem[0];
	},
};
