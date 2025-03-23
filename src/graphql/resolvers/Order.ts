import { IResolvers } from "@graphql-tools/utils";
import { IContext } from "../../index";

// The keys should be the same as the typeDefs.
export const Order: IResolvers<any, IContext> = {
  customer: (parent, args, context) => {
    const { inMemoryDb } = context;
    return inMemoryDb.findUserById(parent.customerId);
  },
	orderItems: (parent, args, context) => {
		const { inMemoryDb } = context;
		return inMemoryDb.findOrderItemsByOrderId(parent.id);
	},
};
