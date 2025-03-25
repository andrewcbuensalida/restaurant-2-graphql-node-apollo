import { IResolvers } from "@graphql-tools/utils";
import { combineResolvers } from "graphql-resolvers";
import { isManager } from "./Authorization";

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
  // instead of combineResolvers, could just check if user is manager from context
	deleteMenuItem: combineResolvers(isManager, (parent, args, context) => {
		const { inMemoryDb } = context;
		const { id } = args;
		return inMemoryDb.deleteMenuItem(id);
	}),
	loginUser: (parent, args, context) => {
		const { inMemoryDb } = context;
		const { input } = args;
		return inMemoryDb.loginUser(input);
	},
	logoutUser: (parent, args, context) => {
		const { inMemoryDb } = context;
		const { user } = context;
		return inMemoryDb.logoutUser(user);
	},
};
