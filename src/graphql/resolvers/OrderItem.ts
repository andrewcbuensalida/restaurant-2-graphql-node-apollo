import { IResolvers } from "@graphql-tools/utils";
import { IContext } from "../../index";

// The keys should be the same as the typeDefs.
export const OrderItem: IResolvers<any, IContext> = {
	menuItem: (parent, args, context) => {
		const { inMemoryDb } = context;
		return inMemoryDb.findMenuItemById(parent.menuItemId);
	},
	order: (parent, args, context) => {
		const { inMemoryDb } = context;
		return inMemoryDb.findOrderById(parent.orderId);
	},
};
