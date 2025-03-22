import { IResolvers } from "@graphql-tools/utils";

export const Mutation: IResolvers = {
	addMenuItem: (parent, args, context) => {
		const { inMemoryDb } = context;
		const { input } = args;
		return inMemoryDb.addMenuItem(input);
	},
	updateMenuItem: (parent, args, context) => {
		const { inMemoryDb } = context;
		const { id, input } = args;
		return inMemoryDb.updateMenuItem(id, input);
	},
	deleteMenuItem: (parent, args, context) => {
		const { inMemoryDb } = context;
		const { id } = args;
		return inMemoryDb.deleteMenuItem(id);
	},
};
