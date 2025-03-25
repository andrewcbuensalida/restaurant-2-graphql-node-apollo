import { IResolvers } from "@graphql-tools/utils";
import { combineResolvers } from "graphql-resolvers";
import { createToken, isManager } from "./Authorization";
import { IUser } from "../../databases/inMemoryDb";
import { comparePassword } from "./Authorization";

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
		const { inMemoryDb, JWT_SECRET } = context;
		const { input } = args;
		const user: IUser = inMemoryDb.findUserByEmail(input.email);
		if (!user) {
			throw new Error("User not found");
		}
		const isPasswordValid = comparePassword(
			input.password,
			user.hashedPassword
		);
		if (!isPasswordValid) {
			throw new Error("Invalid password");
		}

		return { token: createToken(user, JWT_SECRET, "30m") };
	},
	createUser: (parent, args, context) => {
		const { inMemoryDb, JWT_SECRET } = context;
		const { input } = args;
		const user = inMemoryDb.createUser(input);
		return { token: createToken(user, JWT_SECRET, "30m") };
	},
};
