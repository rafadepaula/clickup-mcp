import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export interface Config {
  apiToken: string;
  apiBaseUrl: string;
  apiV3BaseUrl: string;
}

export function loadConfig(): Config {
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
    const candidatePaths = [
      path.resolve(process.cwd(), "token.txt"),
      path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../token.txt"),
      path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../token.txt"),
      path.resolve(process.env.HOME || "", ".clickup_token")
    ];

    for (const p of candidatePaths) {
      if (fs.existsSync(p)) {
        try {
          const content = fs.readFileSync(p, "utf8").trim();
          if (content) {
            token = content;
            break;
          }
        } catch {
          // ignore read error and continue
        }
      }
    }
  }

  if (!token) {
    throw new Error(
      "ClickUp API token is required. Please set the CLICKUP_API_TOKEN environment variable (or pass --token <token>, or place it in token.txt)."
    );
  }

  // Trim whitespace or quotes if present
  token = token.trim().replace(/^["']|["']$/g, "");

  return {
    apiToken: token,
    apiBaseUrl: process.env.CLICKUP_API_BASE_URL || "https://api.clickup.com/api/v2",
    apiV3BaseUrl: process.env.CLICKUP_API_V3_BASE_URL || "https://api.clickup.com/api/v3"
  };
}
