import { IResolvers } from "@graphql-tools/utils";
import { IContext } from "../../index";

export const Subscription: IResolvers<any, IContext> = {
	userLoggedIn: {
		subscribe: async function* () {
			for await (const word of ["Hello", "Bonjour", "Ciao"]) {
				yield { hello: word };
			}
		},
	},
};