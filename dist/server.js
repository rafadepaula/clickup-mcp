import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { CLICKUP_TOOLS } from "./schemas.js";
import { toolHandlers } from "./handlers.js";
export function createServer(client) {
    const server = new Server({
        name: "clickup2",
        version: "1.0.0"
    }, {
        capabilities: {
            tools: {}
        }
    });
    // Return the complete exact catalog of 61 tools
    server.setRequestHandler(ListToolsRequestSchema, async () => {
        return {
            tools: CLICKUP_TOOLS
        };
    });
    // Route tool invocations
    server.setRequestHandler(CallToolRequestSchema, async (request) => {
        const { name, arguments: args } = request.params;
        const handler = toolHandlers[name];
        if (!handler) {
            return {
                content: [
                    {
                        type: "text",
                        text: `Tool '${name}' is not supported.`
                    }
                ],
                isError: true
            };
        }
        try {
            const result = await handler(args || {}, client);
            const textResult = typeof result === "string" ? result : JSON.stringify(result, null, 2);
            return {
                content: [
                    {
                        type: "text",
                        text: textResult
                    }
                ]
            };
        }
        catch (err) {
            const errorMessage = err?.message || String(err);
            return {
                content: [
                    {
                        type: "text",
                        text: `Error executing ${name}: ${errorMessage}`
                    }
                ],
                isError: true
            };
        }
    });
    return server;
}
