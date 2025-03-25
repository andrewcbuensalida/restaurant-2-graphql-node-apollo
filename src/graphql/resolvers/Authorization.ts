import { GraphQLError } from "graphql";
import { combineResolvers, skip } from "graphql-resolvers";
import InMemoryDb, { IUser } from "../../databases/inMemoryDb";

export const isAuthenticated = (parent: any, args: any, { user }: any) =>
	user
		? skip
		: new GraphQLError("Not authenticated as user.", {
				extensions: {
					code: "UNAUTHENTICATED",
					http: { status: 401 },
				},
		  });

export const isManager = combineResolvers(
	isAuthenticated,
	(parent, args, { user: { role } }) =>
		role === "MANAGER"
			? skip
			: new GraphQLError("Not authorized as manager.")
);

export function getUserFromToken(token: string | undefined): IUser | null {
	// This is a mock implementation. Replace with actual logic to get user from token.
	if (!token) {
		return null;
	}

	const inMemoryDb = new InMemoryDb();
	const user = inMemoryDb.findUserById(token); // TODO for now just use the token as the user id, but this should be replaced with actual JWT validation logic

	if (!user) {
		throw new GraphQLError("Invalid token.", {
			extensions: {
				code: "UNAUTHENTICATED",
				http: { status: 401 },
			},
		});
	}

	return user;
}
