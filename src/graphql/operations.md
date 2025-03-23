### To conditionally get emails and ids when getting users

Operation:

```bash
query Users ($withEmail:Boolean=false, $withoutId: Boolean!=true){
  users {
    name
    email @include(if: $withEmail)
    id @skip(if: $withoutId)
  }
}
```

Variables:

```bash
{
  "withEmail": true,
  "withoutId": false
}
```

### To get Users using interfaces and inline fragments ...

Operation:

```bash
query Query {
  users {
    __typename
    name
    ... on Employee {
      salary
    }
    ... on Customer {
     orders {
      id
     }
    }
  }
}
```

### To compare two menu categories using fragment and aliases

Operation:

```bash
query Query($id1:ID!, $id2:ID!){
  leftMenuCategory: menuCategory(id: $id1){
    ...fields
  }
  rightMenuCategory: menuCategory(id: $id2){
    ...fields
  }
}

fragment fields on MenuCategory{
  title
  menuItems{
    title
    price
  }
}
```

```bash
Variables:
{
  "id1": "1",
  "id2": "2"
}
```

### To search for menu items or menu categories using union and inline fragments

Operation:

```bash
query Query($queryString: String!){
  searchMenu(contains: $queryString){
    __typename
    ... on MenuCategory{
      title
    }
    ... on MenuItem{
      title
      price
    }
  }
}
```

```bash
Variables:
{
  "queryString":"salad"
}
```

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
