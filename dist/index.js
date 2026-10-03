#!/usr/bin/env node
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { loadConfig } from "./config.js";
import { ClickUpClient } from "./client.js";
import { createServer } from "./server.js";
async function main() {
    try {
        const config = loadConfig();
        const client = new ClickUpClient(config);
        const server = createServer(client);
        const transport = new StdioServerTransport();
        await server.connect(transport);
        console.error("ClickUp2 MCP server running on stdio");
    }
    catch (err) {
        console.error("Fatal error starting ClickUp2 MCP server:", err?.message || err);
        process.exit(1);
    }
}
main();
