import { RESTDataSource } from "@apollo/datasource-rest";

// RESTDataSource helps with deduplication
export class TheMealDb extends RESTDataSource {
	override baseURL = "https://www.themealdb.com";

	async getRandomStrMealThumb(): Promise<any> {
		const response = await this.get<any>(`/api/json/v1/1/random.php`);
		return response.meals[0].strMealThumb;
	}
}

// deprecated
export class TheMealDbWithoutCache {
	async getRandomStrMealThumb(): Promise<any> {
		const response = await fetch(
			`https://www.themealdb.com/api/json/v1/1/random.php`
		);
		const data = await response.json();
		return data.meals[0].strMealThumb;
	}
}
