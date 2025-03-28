## TODO
- add jwt authentication
- send metrics to graphOS https://www.apollographql.com/docs/apollo-server/monitoring/metrics
- deploy to lambda or elastic beanstalk
- super graph
- websockets with subscriptions
- caching user requests


## DONE
- caching fetching from third-party api
- fetch from third-party api
- custom scalar date https://www.apollographql.com/docs/apollo-server/schema/custom-scalars
- make menu category and employee role an enum
- implement an interface. type Customer implements interface User. type Employee implements interface User. Then use an inline fragment.
- Implement union type. union SearchResult = Employee | Customer
- Implement directive @deprecated, @skip
- many orders to many menu items
- implement fragment aka reusable fields, maybe comparing one menu category with another
- add automated unit tests.

# GraphQL TypeScript Server 
Based on https://github.com/harblaith7/GraphQL-Crash-Course/tree/main and https://github.com/ahadb/graphql-typescript-node-starter

A starter GraphQL Apollo Server & API in Node / Express with TypeScript. 
Right now the restaurent menu dummy data is being served in-memory.

## Installation

- In command prompt, clone the repo with 
`git clone https://github.com/andrewcbuensalida/restaurant-2-graphql-node-apollo.git`
- Go into the newly created directory, `cd restaurant-2-graphql-node-apollo`
- To install dependencies, `npm ci`
- To start the server, `npm run start`

## Tests
It is currently at 100% code coverage. You can see this by running
`npm run test`

## Data
In db.ts, there is an array of menu categories like entrees, appetizers, soup and salads. Each menu category has an id and a title. There is also an array of menu items such as Kale Salad, Chick eggrolls, etc. Each menu item has a title, an array of ingredients, price, categoryId, id. Each menu category can have multiple menu items. 

## Getting Started 

Start the server and head over to http://localhost:5050/graphql and start querying via the graphical GUI. You can build your query/mutation clicking the plus buttons in the documentation section on the left side, or copy and paste the operations below.

### To get all menu items
Operation:
```bash
query Query {
  menuItems {
    id
    categoryId
    ingredients
    price
    title
  }
}
```

### To get a menu item
Operation:
```bash
query Query($menuItemId: ID!) {
  menuItem(id: $menuItemId) {
    categoryId
    id
    ingredients
    price
    title
  }
}
```
Variables:
```bash
{
  "menuItemId": "1"
}
```



### To get all menu categories with their items
Operation:
```bash
query Query {
  menuCategories {
    id
    menuItems {
      title
    }
    title
  }
}
```


### To get a menu category with its items
Operation:
```bash
query Query($menuCategoryId: ID!) {
  menuCategory(id: $menuCategoryId) {
    menuItems {
      title
    }
    title
  }
}
```
Variables:
```bash
{
  "menuCategoryId":"1"
}
```

### To add a menu item
Operation:
```bash
mutation Mutation($input: AddMenuItemInput!) {
  addMenuItem(input: $input) {
    categoryId
    id
    ingredients
    price
    title
  }
}
```
Variables:
```bash
{
  "input": {
    "title": "adobo",
    "categoryId": "2",
    "ingredients":["chicken","soy sauce"],
    "price": 11.11
  }
}
```

### To delete a menu item
Operation:
```bash
mutation Mutation($menuItemId: ID!) {
  deleteMenuItem(id: $menuItemId) {
    id
    title
  }
}
```
Variables:
```bash
{
  "menuItemId": "1"
}
```

### To update a menu item
Operation:
```bash
mutation Mutation($updateMenuItemId: ID!, $input: UpdateMenuItemInput!) {
  updateMenuItem(id: $updateMenuItemId, input: $input) {
    categoryId
    id
    ingredients
    price
    title
  }
}
```
Variables:
```bash
{
  "updateMenuItemId": "2",
  "input": {
    "categoryId":3,
    "ingredients":["jelly", "peanut butter","bread"],
    "price":9.99,
    "title":"pb and j sandwich"
  }
}
```

## To create PR
`gh pr create --base <branch to PR into>`

## To setup Github Actions to require passing tests before merging a pull request
- create .github/workflows/ci.yml
- In github > repo > settings > rulesets
  - Check require status check to pass
  - Create a check with the same name as myBuild in ci.yml


