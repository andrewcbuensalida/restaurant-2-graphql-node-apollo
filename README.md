# GraphQL TypeScript Server 

A starter GraphQL Apollo Server & API in Node / Express with TypeScript. If you're new to GraphQL then clone the repo and start playing around with it instead of reading countless blog posts or books.

This should be all you need to get started on creating your GraphQL API or port your existing REST API over to GraphQL - it is agnostic of a persistence layer, you can choose what technology serves you best and factor it in, but right now we're serving from memory (you never want to do this in production and will need a DB).

## Installation

```
clone the repo
npm ci
npm run start
```

`npm run build` for prod when you've added in your persistence, etc.

## Getting Started 

Fundamentally you have one query and one mutation, the first is to get a listing and second to delete a listing - you can go from there in whichever direction you choose. Note the TypeScript types in your interfaces and `gql` template strings.

Start the server and head over to http://localhost:4000 and start querying via the graphical GUI:

```bash
query {
  people {
    id
    name
    height
  }
}
```

```bash
mutation {
  deletePerson(id: "001") {
    id
    name
    height
  }
}
```

Make sure to check your docs and schemas tab for type details etc.

### Schema

GraphQL schema is roughly modelled via the Star Wars API (SWAPI) so thanks to them. You can easily create your own 
data model, extend or adjust it.

## Road Map

Perhaps in the future I can add:

At a boilerplate level:

- [ ] More extenisble and configurable tooling, settings and data model
- [ ] Full fake server dependent on schema of your choice
- [ ] Generate build setup for types and schemas 
- [ ] Simple REST API (diff branch) so you can compare

At a GraphQL server / API level:

- [ ] Authentication / Authorization
- [ ] Cookies, Logger
- [ ] Registration
- [ ] Login, Logout
- [ ] Persistence: DB, Mongo, SQL, choice

If you're interested you're welcome to contribute to this project - please send a pull request.

