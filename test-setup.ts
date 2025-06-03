// Global test setup for Bun test
import { beforeAll } from "bun:test";

// Set timezone for consistent test results
beforeAll(() => {
    process.env.TZ = "UTC";
});
