import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
function loadEnvFile(envPath) {
    if (!fs.existsSync(envPath))
        return;
    try {
        if (typeof process.loadEnvFile === "function") {
            process.loadEnvFile(envPath);
        }
        else {
            const content = fs.readFileSync(envPath, "utf8");
            for (const line of content.split("\n")) {
                const trimmed = line.trim();
                if (!trimmed || trimmed.startsWith("#"))
                    continue;
                const eqIndex = trimmed.indexOf("=");
                if (eqIndex > 0) {
                    const key = trimmed.slice(0, eqIndex).trim();
                    let val = trimmed.slice(eqIndex + 1).trim();
                    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
                        val = val.slice(1, -1);
                    }
                    if (process.env[key] === undefined) {
                        process.env[key] = val;
                    }
                }
            }
        }
    }
    catch {
        // ignore read error and continue
    }
}
function loadEnv(customPath) {
    if (customPath) {
        loadEnvFile(customPath);
        return;
    }
    const candidateEnvPaths = Array.from(new Set([
        path.resolve(process.cwd(), ".env"),
        path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../.env"),
        path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../.env")
    ]));
    for (const envPath of candidateEnvPaths) {
        loadEnvFile(envPath);
    }
}
export function loadConfig(options) {
    if (!options?.skipDotenv) {
        loadEnv(options?.envPath);
    }
    let token = process.env.CLICKUP_API_TOKEN || process.env.CLICKUP_API_KEY;
    if (!token) {
        for (let i = 0; i < process.argv.length; i++) {
            if (process.argv[i] === "--token" && process.argv[i + 1]) {
                token = process.argv[i + 1];
                break;
            }
            if (process.argv[i].startsWith("--token=")) {
                token = process.argv[i].split("=")[1];
                break;
            }
        }
    }
    if (!token) {
        throw new Error("ClickUp API token is required. Please set the CLICKUP_API_TOKEN environment variable (or define it in a .env file).");
    }
    // Trim whitespace or quotes if present
    token = token.trim().replace(/^["']|["']$/g, "");
    return {
        apiToken: token,
        apiBaseUrl: process.env.CLICKUP_API_BASE_URL || "https://api.clickup.com/api/v2",
        apiV3BaseUrl: process.env.CLICKUP_API_V3_BASE_URL || "https://api.clickup.com/api/v3"
    };
}
