import { IResolvers } from "@graphql-tools/utils";
import { IContext } from "../../index";

// The keys should be the same as the typeDefs.
export const Customer: IResolvers<any, IContext> = {
	orders: (parent, args, context) => {
		const { inMemoryDb } = context;
		return inMemoryDb.findOrdersByCustomerId(parent.id);
	},
};
