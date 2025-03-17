// This defines what kind of queries and mutations we can make. ! is required. [] is an array. The values are the return types. () are arguments.
export const typeDefs = `#graphql
  type MenuItem {
    id: ID!
    title: String!
    ingredients: [String!]!
    price: Float!
    categoryId: ID!
    menuCategory: MenuCategory!
  }
  type MenuCategory {
    id: ID!
    title: String!
    menuItems: [MenuItem!]!
  }
  type Query {
    menuItems: [MenuItem!]!
    menuItem(id: ID!): MenuItem
    menuCategories: [MenuCategory!]!
    menuCategory(id: ID!): MenuCategory
  }
  type Mutation {
    addMenuItem(input: AddMenuItemInput!): MenuItem!
    updateMenuItem(id: ID!, input: UpdateMenuItemInput!): MenuItem
    deleteMenuItem(id: ID!): MenuItem
  }
  input AddMenuItemInput {
    title: String!
    ingredients: [String!]!
    price: Float!
    categoryId: ID!
  }
  input UpdateMenuItemInput {
    title: String
    ingredients: [String!]
    price: Float
    categoryId: ID
  }
`;
