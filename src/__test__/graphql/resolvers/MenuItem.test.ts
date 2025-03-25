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
describe("MenuItem.ts", () => {
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
	inMemoryDb.findMenuCategoryById = jest
		.fn()
		.mockImplementation((categoryId) => {
			return menuCategories.find(
				(category) => category.id === categoryId
			);
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
    hashedPassword: "hashedPassword",
	};

	const testServer = new ApolloServer<IContext>({
		typeDefs,
		resolvers,
	});

	it("should include the menu category when getting the menu items", async () => {
		const response: any = await testServer.executeOperation(
			{
				query: `
      query Query {
        menuItems {
          id
          ingredients
          price
          title
          menuCategory {
            id
            title
          }
        }
      }
      `,
			},
			{
				contextValue: {
					inMemoryDb,
					user,
					theMealDb,
					JWT_SECRET: "JWT_SECRET",
				},
			}
		);

		expect(response.body.singleResult.data).toEqual({
			menuItems: [
				{
					id: "1",
					ingredients: ["Cabbage", "Carrot"],
					price: 5.99,
					title: "Spring Rolls",
					menuCategory: {
						id: "1",
						title: "APPETIZERS",
					},
				},
				{
					id: "2",
					ingredients: ["Rice Noodles", "Peanuts"],
					price: 8.99,
					title: "Pad Thai",
					menuCategory: {
						id: "2",
						title: "ENTREES",
					},
				},
				{
					id: "3",
					ingredients: ["Cheese", "Sugar"],
					price: 6.99,
					title: "Cheesecake",
					menuCategory: {
						id: "3",
						title: "DESSERTS",
					},
				},
			],
		});
	});
});
