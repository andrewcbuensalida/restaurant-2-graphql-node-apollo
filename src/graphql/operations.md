### To compare two menu categories
Operation:
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

Variables:
{
  "id1": "1",
  "id2": "2"
}



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