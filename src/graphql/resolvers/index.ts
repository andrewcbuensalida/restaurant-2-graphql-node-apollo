import { Query } from "./Query";
import { Mutation } from "./Mutation";
import { MenuCategory } from "./MenuCategory";
import { MenuItem } from "./MenuItem";
import { Order } from "./Order";
import { OrderItem } from "./OrderItem";
import { Customer } from "./Customer";
import { GraphQLResolveInfo } from "graphql";

export const resolvers = {
	Query,
	Mutation,
	MenuCategory,
	MenuItem,
	Order,
	OrderItem,
	Customer,
  // Interfaces need to be resolved
	User: {
		__resolveType(obj: any, context: any, info: GraphQLResolveInfo) {
			if (obj.role) {
				return "Employee";
			} else {
				return "Customer";
			}
		},
	},
  // Unions need to be resolved too
	SearchMenuResult: {
		__resolveType(obj: any, context: any, info: GraphQLResolveInfo) {
			if (obj.categoryId) {
				return "MenuItem";
			} else {
				return "MenuCategory";
			}
		},
	},
};
