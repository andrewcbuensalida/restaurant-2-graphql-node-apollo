import { GraphQLError } from "graphql";
import { combineResolvers, skip } from "graphql-resolvers";
import { IUser } from "../../databases/inMemoryDb";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

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

export function getUserFromToken(
	token: string | undefined,
	JWT_SECRET: string | undefined
): IUser | null {
	if (!token) return null;

	try {
		const user = jwt.verify(token, JWT_SECRET || "") as IUser;
		return user;
	} catch (err) {
		return null;
	}
}

export const createToken = async (
	user: any,
	JWT_SECRET: any,
	expiresIn: any
): Promise<string> => {
	return jwt.sign(user, JWT_SECRET, {
		expiresIn,
	});
};

export function hashPassword(password: string): string {
	return bcrypt.hashSync(password, 10);
}

export function comparePassword(
	password: string,
	hashedPassword: string
): boolean {
	return bcrypt.compareSync(password, hashedPassword);
}
