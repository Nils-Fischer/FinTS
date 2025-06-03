/** @type {import('jest').Config} */
export default {
    preset: "ts-jest",
    testEnvironment: "node",
    runner: "groups",
    collectCoverage: true,
    moduleFileExtensions: ["ts", "js"],
    transform: {
        "^.+\\.ts$": [
            "ts-jest",
            {
                useESM: false,
                tsconfig: {
                    module: "CommonJS",
                },
            },
        ],
    },
    coverageReporters: ["lcov", "text-summary"],
    testMatch: ["**/src/**/__tests__/test-*.ts"],
    coveragePathIgnorePatterns: ["/node_modules/", "/__tests__/"],
    collectCoverageFrom: ["src/**/*.ts", "!src/**/__tests__/**", "!src/**/*.d.ts"],
    testTimeout: 10000,
};
