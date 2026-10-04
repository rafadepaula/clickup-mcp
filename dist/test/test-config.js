import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { loadConfig } from "../config.js";
async function runConfigTests() {
    console.log("=== Testing loadConfig ===");
    const originalEnv = { ...process.env };
    const originalArgv = [...process.argv];
    const testDir = fs.mkdtempSync(path.join(os.tmpdir(), "clickup-config-test-"));
    try {
        // Test 1: Should load token from process.env.CLICKUP_API_TOKEN
        {
            delete process.env.CLICKUP_API_KEY;
            process.env.CLICKUP_API_TOKEN = "pk_test_env_token";
            process.argv = ["node", "index.js"];
            const config = loadConfig({ skipDotenv: true });
            assert.strictEqual(config.apiToken, "pk_test_env_token");
            console.log("✓ Test 1 passed: loads from CLICKUP_API_TOKEN");
        }
        // Test 2: Should load token from process.env.CLICKUP_API_KEY as fallback
        {
            delete process.env.CLICKUP_API_TOKEN;
            process.env.CLICKUP_API_KEY = "pk_test_key_token";
            process.argv = ["node", "index.js"];
            const config = loadConfig({ skipDotenv: true });
            assert.strictEqual(config.apiToken, "pk_test_key_token");
            console.log("✓ Test 2 passed: loads from CLICKUP_API_KEY");
        }
        // Test 3: Should load token from custom .env file when env var is not set
        {
            delete process.env.CLICKUP_API_TOKEN;
            delete process.env.CLICKUP_API_KEY;
            process.argv = ["node", "index.js"];
            const envFilePath = path.join(testDir, ".env");
            fs.writeFileSync(envFilePath, "CLICKUP_API_TOKEN=pk_test_dotenv_token\n");
            const config = loadConfig({ envPath: envFilePath });
            assert.strictEqual(config.apiToken, "pk_test_dotenv_token");
            console.log("✓ Test 3 passed: loads from specified .env file");
        }
        // Test 4: Should NOT load token from token.txt even if present
        {
            delete process.env.CLICKUP_API_TOKEN;
            delete process.env.CLICKUP_API_KEY;
            process.argv = ["node", "index.js"];
            const tokenTxtPath = path.join(testDir, "token.txt");
            fs.writeFileSync(tokenTxtPath, "pk_from_token_txt");
            assert.throws(() => {
                loadConfig({ envPath: path.join(testDir, "nonexistent.env") });
            }, (err) => {
                assert.ok(!err.message.includes("token.txt"), `Error message should not mention token.txt: ${err.message}`);
                assert.ok(err.message.includes(".env"), `Error message should mention .env: ${err.message}`);
                return true;
            });
            console.log("✓ Test 4 passed: ignores token.txt and error does not mention token.txt");
        }
        // Test 5: Default loadConfig() should load from process.cwd()/.env
        {
            delete process.env.CLICKUP_API_TOKEN;
            delete process.env.CLICKUP_API_KEY;
            process.argv = ["node", "index.js"];
            const cwd = process.cwd();
            try {
                process.chdir(testDir);
                const envFilePath = path.join(testDir, ".env");
                fs.writeFileSync(envFilePath, "CLICKUP_API_TOKEN=pk_default_dotenv_test\n");
                const config = loadConfig();
                assert.strictEqual(config.apiToken, "pk_default_dotenv_test");
                console.log("✓ Test 5 passed: default loadConfig() automatically loads .env from cwd");
            }
            finally {
                process.chdir(cwd);
            }
        }
        console.log("\nAll loadConfig tests passed!");
    }
    finally {
        // Cleanup
        process.env = originalEnv;
        process.argv = originalArgv;
        fs.rmSync(testDir, { recursive: true, force: true });
    }
}
runConfigTests().catch((err) => {
    console.error("Test failed:", err);
    process.exit(1);
});
