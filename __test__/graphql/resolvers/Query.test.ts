import { ApolloServer } from "@apollo/server";
import { describe, it, expect } from "@jest/globals";
import { typeDefs } from "../../../graphql/typeDefs";
import { resolvers } from "../../../graphql/resolvers";
import { IContext } from "../../../index";
import InMemoryDb from "../../../databases/inMemoryDb";

describe("Query.ts", () => {
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

	// Mock inMemoryDb data
	const inMemoryDb = new InMemoryDb();
	inMemoryDb.findAllMenuItems = jest.fn().mockReturnValue(menuItems);
	inMemoryDb.findAllMenuCategories = jest
		.fn()
		.mockReturnValue(menuCategories);
	inMemoryDb.findMenuItemById = jest.fn().mockImplementation((id) => {
		return menuItems.find((item) => item.id === id);
	});
	inMemoryDb.findMenuCategoryById = jest.fn().mockImplementation((id) => {
		return menuCategories.find((category) => category.id === id);
	});

	const token = "test-token";

	const testServer = new ApolloServer<IContext>({
		typeDefs,
		resolvers,
	});

	it("should get menu items", async () => {
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
					inMemoryDb,
					token,
				},
			}
		);

		expect(response.body.singleResult.data).toEqual({
			menuItems,
		});
	});

	it("should get a menu item by id", async () => {
		const response: any = await testServer.executeOperation(
			{
				query: `
      query Query($id: ID!) {
        menuItem(id: $id) {
          id
          categoryId
          ingredients
          price
          title
        }
      }
      `,
				variables: { id: "1" },
			},
			{
				contextValue: {
					inMemoryDb,
					token,
				},
			}
		);
		expect(response.body.singleResult.data).toEqual({
			menuItem: {
				id: "1",
				categoryId: "1",
				ingredients: ["Cabbage", "Carrot"],
				price: 5.99,
				title: "Spring Rolls",
			},
		});
	});
	it("should get menu categories", async () => {
		const response: any = await testServer.executeOperation(
			{
				query: `
      query Query {
        menuCategories {
          id
          title
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
			menuCategories,
		});
	});
	it("should get a menu category by id", async () => {
		const response: any = await testServer.executeOperation(
			{
				query: `
      query Query($id: ID!) {
        menuCategory(id: $id) {
          id
          title
        }
      }
      `,
				variables: { id: "1" },
			},
			{
				contextValue: {
					inMemoryDb,
					token,
				},
			}
		);
		expect(response.body.singleResult.data).toEqual({
			menuCategory: {
				id: "1",
				title: "Appetizers",
			},
		});
	});
});
