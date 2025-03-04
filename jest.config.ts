// jest.config.ts
import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
	preset: "ts-jest",
	testEnvironment: "node",
	verbose: true,
	// automock: true,
	moduleNameMapper: {
		"^@/(.*)$": "<rootDir>/src/$1",
		"^@routes/(.*)$": "<rootDir>/src/routes/$1",
		"^@interfaces/(.*)$": "<rootDir>/src/interfaces/$1",
		"^@controllers/(.*)$": "<rootDir>/src/controllers/$1",
		"^@middlewares/(.*)$": "<rootDir>/src/middlewares/$1",
		"^@models/(.*)$": "<rootDir>/src/models/$1",
		"^@utils/(.*)$": "<rootDir>/src/utils/$1",
	},
};
export default config;
