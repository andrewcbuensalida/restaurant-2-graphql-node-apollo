import { ApolloServer } from "@apollo/server";
import { describe, it, expect } from "@jest/globals";
import { typeDefs } from "../../graphql/typeDefs";
import { resolvers } from "../../graphql/resolvers";
import { IContext } from "../../index";

describe("MenuCategory.ts", () => {
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
            categoryId
          }
        }
      }
      `,
      },
      {
        contextValue: {
          menuCategories,
          menuItems,
          token,
        },
      }
    );

    expect(response.body.singleResult.data).toEqual({
      menuCategories: [
        {
          id: "1",
          title: "Appetizers",
          menuItems: [
            {
              id: "1",
              title: "Spring Rolls",
              ingredients: ["Cabbage", "Carrot"],
              price: 5.99,
              categoryId: "1",
            },
          ],
        },
        {
          id: "2",
          title: "Main Course",
          menuItems: [
            {
              id: "2",
              title: "Pad Thai",
              ingredients: ["Rice Noodles", "Peanuts"],
              price: 8.99,
              categoryId: "2",
            },
          ],
        },
        {
          id: "3",
          title: "Desserts",
          menuItems: [
            {
              id: "3",
              title: "Cheesecake",
              ingredients: ["Cheese", "Sugar"],
              price: 6.99,
              categoryId: "3",
            },
          ],
        },
      ],
    });
  });
});