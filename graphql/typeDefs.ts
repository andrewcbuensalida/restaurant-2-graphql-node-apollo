export const typeDefs = `#graphql
  type Listing {
    id: ID!
    name: String!
    height: String!
    mass: String!
    hair_color: String!
    skin_color: String!
    eye_color: String!
    birth_year: String!
    gender: String!
    homeworld: String!
    films: [String]!
    species: [String]!
    vehicles: [String]!
    starships: [String]!
    created: String!
    edited: String!
    url: String!
  }

  type Query {
      people: [Listing!]!
  }

  type Mutation {
      deletePerson(id: ID!): Listing!
  }
`;
