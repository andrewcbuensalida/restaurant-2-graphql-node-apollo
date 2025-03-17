import { ApolloServer } from "@apollo/server";
import { describe, it, expect } from "@jest/globals";
import { typeDefs } from "../graphql/typeDefs";
import { resolvers } from "../graphql/resolvers";
import { assert } from "node:console";
import { IContext } from "../index";

describe("Query.ts", () => {
	it("should get menu items", async () => {
		const menuCategories = [
			{ id: "1", title: "Appetizers" },
			{ id: "2", title: "Main Course" },
			{ id: "3", title: "Desserts" },
		];

		const menuItems = [
			{
				id: "1",
				title: "Spring Rolls",
				ingredients: ["Cabbage", "Carrot"],
				price: 5.99,
				categoryId: "1",
			},
			{
				id: "2",
				title: "Pad Thai",
				ingredients: ["Rice Noodles", "Peanuts"],
				price: 8.99,
				categoryId: "2",
			},
			{
				id: "3",
				title: "Cheesecake",
				ingredients: ["Cheese", "Sugar"],
				price: 6.99,
				categoryId: "3",
			},
		];

		const token = "test-token";

		const testServer = new ApolloServer<IContext>({
			typeDefs,
			resolvers,
		});
		const response: any = await testServer.executeOperation(
			{
				query: `
      query Query {
        menuItems {
          id
          categoryId
          ingredients
          price
          title
        }
      }
      `,
			},
			{
				contextValue: {
					menuItems,
					menuCategories,
					token,
				},
			}
		);
		console.log(`*Example response: `, response.body.singleResult.data);
		expect(response.body.singleResult.data).toEqual({
			menuItems,
		});
	});
});
