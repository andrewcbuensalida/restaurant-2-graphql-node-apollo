module.exports = {
	testEnvironment: "node",
	collectCoverage: true,
	coverageDirectory: "coverage",
	testPathIgnorePatterns: ["/node_modules/", "/dist/", "/coverage/"],
	transform: {
		"^.+\\.ts$": "ts-jest",
	},
	moduleFileExtensions: ["ts", "js", "json", "node"],
	testRegex: "(/__tests__/.*|(\\.|/))(test|spec)\\.(ts|js)$",
};
