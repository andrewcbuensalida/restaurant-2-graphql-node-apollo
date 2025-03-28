import { v4 } from "uuid";
import { hashPassword } from "../graphql/resolvers/Authorization";

export interface IMenuCategory {
	id: string;
	title: string;
}
export interface IMenuItem {
	title: string;
	ingredients: string[];
	price: number;
	categoryId: string;
	id?: string;
}

export interface IOrder {
	id: string;
	customerId: string;
	createdAt: Date;
}
export interface IOrderItem {
	id: string;
	menuItemId: string;
	orderId: string;
	quantity: number;
}

export interface IUser {
	id: string;
	name: string;
	email: string;
	hashedPassword: string;
}

export interface ICustomer extends IUser {}

export interface IEmployee extends IUser {
	role: string;
	salary: number;
}

export type SearchMenuResultType = IMenuItem | IMenuCategory;

export default class InMemoryDb {
	findAllMenuItems(): IMenuItem[] {
		return menuItems;
	}

	findMenuItemById(id: string): IMenuItem | undefined {
		return menuItems.find((item) => item.id === id);
	}

	findMenuItemsByCategoryId(categoryId: string): IMenuItem[] {
		return menuItems.filter((item) => item.categoryId === categoryId);
	}

	findAllMenuCategories(): IMenuCategory[] {
		return menuCategories;
	}

	findMenuCategoryById(id: string): IMenuCategory | undefined {
		return menuCategories.find((category) => category.id === id);
	}

	searchMenu(contains: string): SearchMenuResultType[] {
		const results: SearchMenuResultType[] = [];
		const lowerCaseContains = contains.toLowerCase();
		results.push(
			...menuItems.filter((item) =>
				item.title.toLowerCase().includes(lowerCaseContains)
			)
		);
		results.push(
			...menuCategories.filter((category) =>
				category.title.toLowerCase().includes(lowerCaseContains)
			)
		);
		return results;
	}

	findAllOrders(): IOrder[] {
		return orders;
	}

	findOrderById(id: string): IOrder | undefined {
		return orders.find((order) => order.id === id);
	}

	findAllUsers(): IUser[] {
		return [...customers, ...employees];
	}

	findUserById(id: string): IUser | undefined {
		return [...customers, ...employees].find((user) => user.id === id);
	}

	findUserByEmail(email: string): IUser | undefined {
		return [...customers, ...employees].find(
			(user) => user.email === email
		);
	}

	findOrderItemsByMenuItemId(menuItemId: string): IOrderItem[] {
		return orderItems.filter((item) => item.menuItemId === menuItemId);
	}

	findOrderItemsByOrderId(orderId: string): IOrderItem[] {
		return orderItems.filter((item) => item.orderId === orderId);
	}

	findOrdersByCustomerId(customerId: string): IOrder[] {
		return orders.filter((order) => order.customerId === customerId);
	}

	addMenuItem(menuItem: IMenuItem): IMenuItem {
		const newItem = {
			...menuItem,
			id: v4(),
		};
		menuItems.push(newItem);
		return newItem;
	}
	updateMenuItem(id: string, menuItem: IMenuItem): IMenuItem | undefined {
		const index = menuItems.findIndex((item) => item.id === id);
		if (index === -1) return undefined;
		const updatedItem = { ...menuItems[index], ...menuItem };
		menuItems[index] = updatedItem;
		return updatedItem;
	}
	deleteMenuItem(id: string): IMenuItem | undefined {
		const index = menuItems.findIndex((item) => item.id === id);
		if (index === -1) return undefined;
		const deletedItem = menuItems.splice(index, 1);
		return deletedItem[0];
	}
	createUser(input: any): IUser | undefined {
		const { email, password } = input;
		const user = [...customers, ...employees].find(
			(user) => user.email === email
		);
		if (user) {
			throw new Error("Email already exists");
		}
		const hashedPassword = hashPassword(password);
		delete input.password;

		const newUser = {
			...input,
			id: v4(),
			hashedPassword,
		};
		customers.push(newUser);
		return newUser;
	}
}

const orders: IOrder[] = [
	{ id: "1", customerId: "1", createdAt: new Date() },
	{ id: "2", customerId: "2", createdAt: new Date() },
	{ id: "3", customerId: "1", createdAt: new Date() },
	{ id: "4", customerId: "2", createdAt: new Date() },
];

const customers: ICustomer[] = [
	{
		id: "1",
		name: "John Doe",
		email: "john@example.com",
		hashedPassword: hashPassword("password1"),
	},
	{
		id: "2",
		name: "Jane Smith",
		email: "jane@example.com",
		hashedPassword: hashPassword("password2"),
	},
];

const employees: IEmployee[] = [
	{
		id: "3",
		name: "Alice Johnson",
		email: "alice@example.com",
		role: "MANAGER",
		salary: 50000,
		hashedPassword: hashPassword("password3"),
	},
	{
		id: "4",
		name: "Bob Brown",
		email: "bob@example.com",
		role: "CHEF",
		salary: 40000,
		hashedPassword: hashPassword("password4"),
	},
];

const orderItems: IOrderItem[] = [
	{ id: "1", menuItemId: "1", orderId: "1", quantity: 1 },
	{ id: "2", menuItemId: "2", orderId: "1", quantity: 2 },
	{ id: "3", menuItemId: "3", orderId: "2", quantity: 1 },
	{ id: "4", menuItemId: "4", orderId: "2", quantity: 10 },
	{ id: "5", menuItemId: "5", orderId: "3", quantity: 100 },
	{ id: "6", menuItemId: "6", orderId: "3", quantity: 1 },
	{ id: "7", menuItemId: "7", orderId: "4", quantity: 1 },
];

const menuItems: IMenuItem[] = [
	{
		title: "Iceberg Wedge Salad with House Cured Bacon",
		ingredients: ["tomato salsa", "gorgonzola"],
		price: 7.5,
		categoryId: "1",
		id: "1",
	},
	{
		title: "Sautéed Shredded Brussels Sprouts",
		ingredients: ["bacon", "hazelnuts", "gorgonzola"],
		price: 6.95,
		categoryId: "1",
		id: "2",
	},
	{
		title: "Kale Salad",
		ingredients: [
			"parmesan crisp",
			"corn",
			"radish",
			"garlic-lemon vinaigrette",
		],
		price: 7.5,
		categoryId: "1",
		id: "3",
	},
	{
		title: "Pecan Crusted Utah Goat Cheese with Basil-Mint Pesto",
		ingredients: ["grilled tomato salsa", "crostini"],
		price: 6.95,
		categoryId: "1",
		id: "4",
	},
	{
		title: "Chicken and Cabbage Eggrolls",
		ingredients: ["hot & sour dipping sauce"],
		price: 6.95,
		categoryId: "1",
		id: "5",
	},
	{
		title: "Farfalle Pasta with Braised Pork in Tomato Cream",
		ingredients: ["capers", "butternut squash", "kale"],
		price: 12.95,
		categoryId: "2",
		id: "6",
	},
	{
		title: "Stout Braised Bratwurst",
		ingredients: [
			"horseradish mashed potatoes",
			"roasted root veggies",
			"grilled onion",
		],
		price: 13.95,
		categoryId: "2",
		id: "7",
	},
	{
		title: "Salmon & Crispy Tofu in Yellow Curry Sauce",
		ingredients: ["vegetable sauté", "golden raisin chutney"],
		price: 15.95,
		categoryId: "2",
		id: "8",
	},
	{
		title: "Sesame Shrimp",
		ingredients: [
			"udon noodles",
			"ramen broth",
			"shiitake mushrooms",
			"bean sprouts",
			"scallions",
		],
		price: 13.95,
		categoryId: "2",
		id: "9",
	},
	{
		title: "Turkey & Avocado",
		ingredients: ["tomato"],
		price: 9.25,
		categoryId: "3",
		id: "10",
	},
	{
		title: "Pub Club",
		ingredients: ["turkey", "bacon", "lettuce", "tomato"],
		price: 9.25,
		categoryId: "3",
		id: "11",
	},
	{
		title: "Rare Roast Beef & Swiss",
		ingredients: ["sweet-hot mustard", "lettuce", "red onion"],
		price: 9.25,
		categoryId: "3",
		id: "12",
	},
	{
		title: "Veggie",
		ingredients: ["pepper jack", "avocado", "sprout", "tomato"],
		price: 9.25,
		categoryId: "3",
		id: "13",
	},
	{
		title: "Southwest Chicken Breast",
		ingredients: [
			"grilled onion",
			"poblano pepper",
			"tomato",
			"lettuce",
			"jack cheese",
		],
		price: 9.5,
		categoryId: "3",
		id: "14",
	},
	{
		title: "Portobello Fresh Mozzarella",
		ingredients: [
			"caramelized onion",
			"roasted pepper",
			"tomato",
			"field greens",
			"basil aioli",
		],
		price: 9.5,
		categoryId: "3",
		id: "15",
	},
	{
		title: "Chipotle BBQ Pork Sandwich",
		ingredients: ["pickled jalapeño slaw"],
		price: 9.5,
		categoryId: "3",
		id: "16",
	},
	{
		title: "Bacon Burger",
		ingredients: ["swiss", "lettuce", "tomato"],
		price: 9.25,
		categoryId: "3",
		id: "17",
	},
	{
		title: "Mexi Burger",
		ingredients: [
			"pepper relish",
			"pepper jack",
			"tomato",
			"lettuce",
			"guacamole",
		],
		price: 9.25,
		categoryId: "3",
		id: "18",
	},
	{
		title: "Herb Marinated Top Sirloin",
		ingredients: [
			"crimini mushrooms",
			"caramelized onion",
			"gorgonzola",
			"basil aioli",
		],
		price: 10.95,
		categoryId: "3",
		id: "19",
	},
	{
		title: "Roast Beef with Ancho Au Jus",
		ingredients: ["jack cheese", "grilled onions"],
		price: 9.75,
		categoryId: "3",
		id: "20",
	},
	{
		title: "Blackened Catfish",
		ingredients: ["creole peppers & onions", "fresh herb aioli"],
		price: 9.75,
		categoryId: "3",
		id: "21",
	},
	{
		title: "French Onion or Soup of the Day",
		ingredients: [],
		price: 4.95,
		categoryId: "4",
		id: "22",
	},
	{
		title: "French Onion or Soup of the Day Combos with small green salad, fresh fruit or house pasta",
		ingredients: [],
		price: 7.25,
		categoryId: "4",
		id: "23",
	},
	{
		title: "French Onion or Soup of the Day Combos with half pasta of the day",
		ingredients: [],
		price: 8.75,
		categoryId: "4",
		id: "24",
	},
	{
		title: "Chicken Fajitas",
		ingredients: [
			"onions",
			"poblano and bell peppers",
			"guacamole",
			"two salsas",
		],
		price: 10.95,
		categoryId: "5",
		id: "25",
	},
	{
		title: "Sirloin Steak Fajitas",
		ingredients: [
			"onions",
			"poblano and bell peppers",
			"carrots",
			"onion",
			"guacamole",
			"two salsas",
		],
		price: 10.95,
		categoryId: "5",
		id: "26",
	},
	{
		title: "Beer Battered Fish Tacos",
		ingredients: ["jalapeño remoulade", "roasted salsa", "cabbage"],
		price: 9.95,
		categoryId: "6",
		id: "27",
	},
	{
		title: "Carne Asada Tacos",
		ingredients: ["marinated sirloin", "guacamole", "tomatillo salsa"],
		price: 9.95,
		categoryId: "6",
		id: "28",
	},
	{
		title: "Citrus Marinated Chicken Tacos",
		ingredients: ["guacamole", "tomatillo salsa"],
		price: 9.95,
		categoryId: "6",
		id: "29",
	},
	{
		title: "Grilled Veggie Tacos",
		ingredients: [
			"zucchini",
			"yellow squash",
			"bell peppers",
			"onion",
			"guacamole",
			"tomatillo salsa",
		],
		price: 9.95,
		categoryId: "6",
		id: "30",
	},
	{
		title: "Beef Enchiladas",
		ingredients: [
			"southwestern succotash",
			"black beans with chipotle crema",
		],
		price: 8.5,
		categoryId: "7",
		id: "31",
	},
	{
		title: "Chicken Enchiladas",
		ingredients: [
			"southwestern succotash",
			"black beans with chipotle crema",
		],
		price: 8.5,
		categoryId: "7",
		id: "32",
	},
	{
		title: "Cheese Enchiladas",
		ingredients: [
			"southwestern succotash",
			"black beans with chipotle crema",
		],
		price: 8.5,
		categoryId: "7",
		id: "33",
	},
	{
		title: "Veggie Enchiladas",
		ingredients: [
			"southwestern succotash",
			"black beans with chipotle crema",
		],
		price: 8.5,
		categoryId: "7",
		id: "34",
	},
	{
		title: "Chili Relleno",
		ingredients: [
			"jack cheese",
			"corn glazed yam",
			"chayote squash succotash",
			"red chili sauce",
		],
		price: 9.95,
		categoryId: "7",
		id: "35",
	},
	{
		title: "Pepita Crusted Salmon",
		ingredients: [
			"chipotle glaze",
			"chevre whipped yams",
			"jicama slaw",
			"tomatillo sauce",
		],
		price: 10.95,
		categoryId: "7",
		id: "36",
	},
	{
		title: "Bacon, Swiss, Mushroom, Zucchini and Mushroom Quiche",
		ingredients: ["choice of fresh fruit or green salad"],
		price: 8.95,
		categoryId: "8",
		id: "37",
	},
	{
		title: "Grilled Red Trout Salad",
		ingredients: [
			"lentils",
			"tomatoes",
			"cukes",
			"green beans",
			"red bells",
			"almonds",
			"sundried tomato vinaigrette",
		],
		price: 10.95,
		categoryId: "9",
		id: "38",
	},
	{
		title: "Smoked Turkey Salad",
		ingredients: [
			"cheese tortellini",
			"bacon",
			"tomato",
			"cucumber",
			"egg",
			"black bean-corn salsa",
			"avocado",
		],
		price: 9.95,
		categoryId: "9",
		id: "39",
	},
	{
		title: "Asian Grilled Chicken Salad",
		ingredients: [
			"snow peas",
			"carrot slaw",
			"red bells",
			"water chestnut",
			"peanuts",
			"baby corn",
			"cilantro",
			"cukes",
			"spicy peanut dressing",
		],
		price: 10.5,
		categoryId: "9",
		id: "40",
	},
	{
		title: "Southwest Grilled Chicken Salad",
		ingredients: [
			"tomato",
			"guacamole",
			"pepitas",
			"jicama",
			"corn & black bean salsa",
			"orange wedges",
			"spicy citrus vinaigrette",
		],
		price: 10.5,
		categoryId: "9",
		id: "41",
	},
	{
		title: "Mediterranean Salad",
		ingredients: [
			"italian sausage",
			"artichoke hearts",
			"green beans",
			"roma tomato",
			"kalamatas",
			"red onion",
			"cucumber",
			"croutons",
			"parmesan",
			"fresh mozzarella",
			"gorgonzola vinaigrette",
		],
		price: 9.95,
		categoryId: "9",
		id: "42",
	},
	{
		title: "Grilled Salmon Salad",
		ingredients: [
			"artichoke tapenade",
			"shredded kale",
			"corn",
			"radish",
			"parmesan crisps",
		],
		price: 11.5,
		categoryId: "9",
		id: "43",
	},
];

const menuCategories: IMenuCategory[] = [
	{
		id: "1",
		title: "APPETIZERS",
	},
	{
		id: "2",
		title: "ENTREES",
	},
	{
		id: "3",
		title: "SANDWICHES",
	},
	{
		id: "4",
		title: "SOUP & SALAD COMBOS",
	},
	{
		id: "5",
		title: "FAJITAS",
	},
	{
		id: "6",
		title: "TACOS",
	},
	{
		id: "7",
		title: "ENCHILADAS",
	},
	{
		id: "8",
		title: "QUICHE",
	},
	{
		id: "9",
		title: "GREEN SALADS",
	},
];
