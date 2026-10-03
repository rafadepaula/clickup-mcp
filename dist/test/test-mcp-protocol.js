import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadConfig } from "../config.js";
async function testMcpProtocol() {
    console.log("=== Testing ClickUp2 via Standard MCP Client (stdio) ===");
    const serverPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../dist/index.js");
    const config = loadConfig();
    const transport = new StdioClientTransport({
        command: "node",
        args: [serverPath],
        env: {
            ...process.env,
            CLICKUP_API_TOKEN: config.apiToken
        }
    });
    const client = new Client({ name: "test-client", version: "1.0.0" }, { capabilities: {} });
    await client.connect(transport);
    console.log("✓ Connected to ClickUp2 MCP server over stdio");
    // 1. List tools
    const toolsResponse = await client.listTools();
    console.log(`✓ tools/list returned ${toolsResponse.tools.length} tools`);
    if (toolsResponse.tools.length !== 61) {
        throw new Error(`Expected 61 tools, got ${toolsResponse.tools.length}`);
    }
    // 2. Call a tool: clickup_get_workspace_members
    console.log("Testing tool call: clickup_get_workspace_members...");
    const callRes = await client.callTool({
        name: "clickup_get_workspace_members",
        arguments: {}
    });
    console.log("✓ tools/call (clickup_get_workspace_members) result content:", callRes.content[0]);
    // 3. Call a tool: clickup_filter_tasks
    console.log("Testing tool call: clickup_filter_tasks...");
    const taskRes = await client.callTool({
        name: "clickup_filter_tasks",
        arguments: { page: 0 }
    });
    console.log("✓ tools/call (clickup_filter_tasks) returned output (length):", taskRes.content[0]?.text?.length);
    await client.close();
    console.log("✓ Connection closed cleanly.");
    console.log("=== MCP Protocol Test Passed Successfully! ===");
}
testMcpProtocol().catch(err => {
    console.error("MCP Protocol Test Error:", err);
    process.exit(1);
});
