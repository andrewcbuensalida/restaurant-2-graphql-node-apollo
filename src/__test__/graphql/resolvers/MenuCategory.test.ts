import { ApolloServer } from "@apollo/server";
import { describe, it, expect } from "@jest/globals";
import { resolvers } from "../../../graphql/resolvers";
import { IContext } from "../../../index";
import InMemoryDb from "../../../databases/inMemoryDb";
import { readFileSync } from "fs";

const typeDefs = readFileSync("schema.graphql", {
	encoding: "utf-8",
});
describe("MenuCategory.ts", () => {
	const menuCategories = [
		{ id: "1", title: "APPETIZERS" },
		{ id: "2", title: "ENTREES" },
		{ id: "3", title: "DESSERTS" },
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

	// Mock inMemoryDb data
	const inMemoryDb = new InMemoryDb();
	inMemoryDb.findAllMenuItems = jest.fn().mockReturnValue(menuItems);
	inMemoryDb.findAllMenuCategories = jest
		.fn()
		.mockReturnValue(menuCategories);
	inMemoryDb.findMenuItemsByCategoryId = jest
		.fn()
		.mockImplementation((categoryId) => {
			return menuItems.filter((item) => item.categoryId === categoryId);
		});

	const token = "test-token";

	const testServer = new ApolloServer<IContext>({
		typeDefs,
		resolvers,
	});

	it("should include the menu items when getting the menu categories", async () => {
		const response: any = await testServer.executeOperation(
			{
				query: `
      query Query {
        menuCategories {
          id
          title
          menuItems {
            id
            title
            ingredients
            price
          }
        }
      }
      `,
			},
			{
				contextValue: {
					inMemoryDb,
					token,
				},
			}
		);

		expect(response.body.singleResult.data).toEqual({
			menuCategories: [
				{
					id: "1",
					title: "APPETIZERS",
					menuItems: [
						{
							id: "1",
							title: "Spring Rolls",
							ingredients: ["Cabbage", "Carrot"],
							price: 5.99,
						},
					],
				},
				{
					id: "2",
					title: "ENTREES",
					menuItems: [
						{
							id: "2",
							title: "Pad Thai",
							ingredients: ["Rice Noodles", "Peanuts"],
							price: 8.99,
						},
					],
				},
				{
					id: "3",
					title: "DESSERTS",
					menuItems: [
						{
							id: "3",
							title: "Cheesecake",
							ingredients: ["Cheese", "Sugar"],
							price: 6.99,
						},
					],
				},
			],
		});
	});
});
