import { ApolloServer } from "@apollo/server";
import { describe, it, expect } from "@jest/globals";
import { resolvers } from "../../../graphql/resolvers";
import { IContext } from "../../../index";
import InMemoryDb, { IUser } from "../../../databases/inMemoryDb";
import { readFileSync } from "fs";
import { TheMealDb } from "../../../apis/theMealDb";

const typeDefs = readFileSync("schema.graphql", {
	encoding: "utf-8",
});
describe("Query.ts", () => {
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
		},
		{
			id: "2",
			title: "Pad Thai",
			ingredients: ["Rice Noodles", "Peanuts"],
			price: 8.99,
		},
		{
			id: "3",
			title: "Cheesecake",
			ingredients: ["Cheese", "Sugar"],
			price: 6.99,
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
	const theMealDb = new TheMealDb();
	theMealDb.getRandomStrMealThumb = jest
		.fn()
		.mockReturnValue(
			"https://www.themealdb.com/images/media/meals/xxxxx.jpg"
		);

	const user: IUser = {
		id: "1",
		name: "testuser",
		email: "test@gmail.com",
		isLoggedIn: true,
	};

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
					user,
					theMealDb,
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
					user,
					theMealDb,
				},
			}
		);
		expect(response.body.singleResult.data).toEqual({
			menuItem: {
				id: "1",
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
					user,
					theMealDb,
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
					user,
					theMealDb,
				},
			}
		);
		expect(response.body.singleResult.data).toEqual({
			menuCategory: {
				id: "1",
				title: "APPETIZERS",
			},
		});
	});
});
