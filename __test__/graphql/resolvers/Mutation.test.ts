import { ApolloServer } from "@apollo/server";
import { describe, it, expect } from "@jest/globals";
import { typeDefs } from "../../../graphql/typeDefs";
import { resolvers } from "../../../graphql/resolvers";
import { IContext } from "../../../index";
import InMemoryDb from "../../../databases/inMemoryDb";

describe("Mutation.ts", () => {
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
	inMemoryDb.addMenuItem = jest.fn().mockImplementation((item) => {
		const newItem = { ...item, id: String(menuItems.length + 1) };
		menuItems.push(newItem);
		return newItem;
	});
	inMemoryDb.updateMenuItem = jest.fn().mockImplementation((id, item) => {
		const index = menuItems.findIndex((i) => i.id === id);
		if (index === -1) return null;
		menuItems[index] = { ...menuItems[index], ...item };
		return menuItems[index];
	});
	inMemoryDb.deleteMenuItem = jest.fn().mockImplementation((id) => {
		const index = menuItems.findIndex((i) => i.id === id);
		if (index === -1) return null;
		const deletedItem = menuItems.splice(index, 1)[0];
		return deletedItem;
	});

	const token = "test-token";

	const testServer = new ApolloServer<IContext>({
		typeDefs,
		resolvers,
	});

	it("should add a menu item", async () => {
		const response: any = await testServer.executeOperation(
			{
				query: `
      mutation AddMenuItem($input: AddMenuItemInput!) {
        addMenuItem(input: $input) {
          title
          ingredients
          price
          categoryId
        }
      }
      `,
				variables: {
					input: {
						title: "New Dish",
						ingredients: ["Ingredient 1", "Ingredient 2"],
						price: 12.99,
						categoryId: "1",
					},
				},
			},
			{
				contextValue: {
					inMemoryDb,
					token,
				},
			}
		);

		expect(response.body.singleResult.data).toEqual({
			addMenuItem: {
				title: "New Dish",
				ingredients: ["Ingredient 1", "Ingredient 2"],
				price: 12.99,
				categoryId: "1",
			},
		});
		expect(menuItems.length).toBe(4);
		expect(menuItems[3].title).toBe("New Dish");
	});

	it("should update a menu item", async () => {
		const response: any = await testServer.executeOperation(
			{
				query: `
    mutation UpdateMenuItem($id: ID!, $input: UpdateMenuItemInput!) {
    updateMenuItem(id: $id, input: $input) {
      id
      title
      ingredients
      price
      categoryId
    }
    }
    `,
				variables: {
					id: "1",
					input: {
						title: "Updated Spring Rolls",
						ingredients: ["Cabbage", "Carrot", "Onion"],
						price: 6.99,
						categoryId: "1",
					},
				},
			},
			{
				contextValue: {
					inMemoryDb,
					token,
				},
			}
		);

		expect(response.body.singleResult.data).toEqual({
			updateMenuItem: {
				id: "1",
				title: "Updated Spring Rolls",
				ingredients: ["Cabbage", "Carrot", "Onion"],
				price: 6.99,
				categoryId: "1",
			},
		});
		expect(menuItems[0].title).toBe("Updated Spring Rolls");
		expect(menuItems[0].ingredients).toContain("Onion");
		expect(menuItems[0].price).toBe(6.99);
	});
	it("should return null when updating a non-existent menu item", async () => {
		const response: any = await testServer.executeOperation(
			{
				query: `
  mutation UpdateMenuItem($id: ID!, $input: UpdateMenuItemInput!) {
  updateMenuItem(id: $id, input: $input) {
    id
    title
    ingredients
    price
    categoryId
  }
  }
  `,
				variables: {
					id: "999",
					input: {
						title: "Non-existent Dish",
						ingredients: ["Ingredient 1", "Ingredient 2"],
						price: 10.99,
						categoryId: "1",
					},
				},
			},
			{
				contextValue: {
					inMemoryDb,
					token,
				},
			}
		);

		expect(response.body.singleResult.data).toEqual({
			updateMenuItem: null,
		});
	});

	it("should return null when deleting a non-existent menu item", async () => {
		const response: any = await testServer.executeOperation(
			{
				query: `
  mutation DeleteMenuItem($id: ID!) {
  deleteMenuItem(id: $id) {
    id
    title
    ingredients
    price
    categoryId
  }
  }
  `,
				variables: {
					id: "999",
				},
			},
			{
				contextValue: {
					inMemoryDb,
					token,
				},
			}
		);

		expect(response.body.singleResult.data).toEqual({
			deleteMenuItem: null,
		});
	});
	it("should delete a menu item", async () => {
		const response: any = await testServer.executeOperation(
			{
				query: `
    mutation DeleteMenuItem($id: ID!) {
    deleteMenuItem(id: $id) {
      id
      title
      ingredients
      price
      categoryId
    }
    }
    `,
				variables: {
					id: "1",
				},
			},
			{
				contextValue: {
					inMemoryDb,
					token,
				},
			}
		);

		expect(response.body.singleResult.data).toEqual({
			deleteMenuItem: {
				id: "1",
				title: "Updated Spring Rolls",
				ingredients: ["Cabbage", "Carrot", "Onion"],
				price: 6.99,
				categoryId: "1",
			},
		});
		expect(menuItems.length).toBe(3);
		expect(menuItems.find((item) => item.id === "1")).toBeUndefined();
	});
});
