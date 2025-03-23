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
	// Don't need MenuCategoryTitleEnum here if titles in the database are exactly the same as the enum values. If they are not, then you need to map them. EmployeeRoleEnum values are the same as the database values, so we don't need to map them.
	MenuCategoryTitleEnum: {
		APPETIZERS: "APPETIZERS",
		ENTREES: "ENTREES",
		DESSERTS: "DESSERTS",
		SANDWICHES: "SANDWICHES",
		SOUP_SALAD_COMBOS: "SOUP & SALAD COMBOS",
		FAJITAS: "FAJITAS",
		TACOS: "TACOS",
		ENCHILADAS: "ENCHILADAS",
		QUICHE: "QUICHE",
		GREEN_SALADS: "GREEN SALADS",
	},
};
