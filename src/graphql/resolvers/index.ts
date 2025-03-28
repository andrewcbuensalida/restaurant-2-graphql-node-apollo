import { Query } from "./Query";
import { Mutation } from "./Mutation";
import { MenuCategory } from "./MenuCategory";
import { MenuItem } from "./MenuItem";
import { Order } from "./Order";
import { OrderItem } from "./OrderItem";
import { Customer } from "./Customer";
import { GraphQLResolveInfo, GraphQLScalarType, Kind } from "graphql";

const dateScalar = new GraphQLScalarType({
	name: "Date",
	description: "Date custom scalar type",
	serialize(value) {
		if (value instanceof Date) {
			return value.getTime(); // Convert outgoing Date to integer for JSON
		}
		throw Error("GraphQL Date Scalar serializer expected a `Date` object");
	},
	parseValue(value) {
		if (typeof value === "number") {
			return new Date(value); // Convert incoming integer to Date
		}
		throw new Error("GraphQL Date Scalar parser expected a `number`");
	},
	parseLiteral(ast) {
		if (ast.kind === Kind.INT) {
			// Convert hard-coded AST string to integer and then to Date
			return new Date(parseInt(ast.value, 10));
		}
		// Invalid hard-coded value (not an integer)
		return null;
	},
});

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
  Date: dateScalar,
};
