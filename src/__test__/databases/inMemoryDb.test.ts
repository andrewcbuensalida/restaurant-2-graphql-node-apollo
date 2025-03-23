import InMemoryDb, { IMenuItem } from "../../databases/inMemoryDb";

describe("InMemoryDb", () => {
	let db: InMemoryDb;

	beforeEach(() => {
		db = new InMemoryDb();
	});

	it("should find all menu items", () => {
		const items = db.findAllMenuItems();
		expect(items.length).toBeGreaterThan(0);
	});

	it("should find menu item by id", () => {
		const item = db.findMenuItemById("1");
		expect(item).toBeDefined();
		expect(item?.id).toBe("1");
	});

	it("should return undefined for non-existing menu item id", () => {
		const item = db.findMenuItemById("non-existing-id");
		expect(item).toBeUndefined();
	});

	it("should find menu items by category id", () => {
		const items = db.findMenuItemsByCategoryId("1");
		expect(items.length).toBeGreaterThan(0);
		items.forEach((item) => {
			expect(item.categoryId).toBe("1");
		});
	});

	it("should find all menu categories", () => {
		const categories = db.findAllMenuCategories();
		expect(categories.length).toBeGreaterThan(0);
	});

	it("should find menu category by id", () => {
		const category = db.findMenuCategoryById("1");
		expect(category).toBeDefined();
		expect(category?.id).toBe("1");
	});

	it("should return undefined for non-existing menu category id", () => {
		const category = db.findMenuCategoryById("non-existing-id");
		expect(category).toBeUndefined();
	});

	it("should add a new menu item", () => {
		const newItem: IMenuItem = {
			title: "New Item",
			ingredients: ["ingredient1", "ingredient2"],
			price: 10,
			categoryId: "1",
			id: "",
		};
		const addedItem = db.addMenuItem(newItem);
		expect(addedItem.id).toBeDefined();
		expect(db.findMenuItemById(addedItem.id as string)).toEqual(addedItem);
	});

	it("should update an existing menu item", () => {
		const updatedItem: IMenuItem = {
			title: "Updated Item",
			ingredients: ["ingredient1", "ingredient2"],
			price: 12,
			categoryId: "1",
			id: "1",
		};
		const result = db.updateMenuItem("1", updatedItem);
		expect(result).toBeDefined();
		expect(result?.title).toBe("Updated Item");
	});

	it("should return undefined when updating a non-existing menu item", () => {
		const updatedItem: IMenuItem = {
			title: "Updated Item",
			ingredients: ["ingredient1", "ingredient2"],
			price: 12,
			categoryId: "1",
			id: "",
		};
		const result = db.updateMenuItem("non-existing-id", updatedItem);
		expect(result).toBeUndefined();
	});

	it("should delete an existing menu item", () => {
		const result = db.deleteMenuItem("1");
		expect(result).toBeDefined();
		expect(db.findMenuItemById("1")).toBeUndefined();
	});

	it("should return undefined when deleting a non-existing menu item", () => {
		const result = db.deleteMenuItem("non-existing-id");
		expect(result).toBeUndefined();
	});
});
