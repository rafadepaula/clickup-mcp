import { loadConfig } from "../config.js";
import { ClickUpClient } from "../client.js";
import { toolHandlers } from "../handlers.js";
async function testAttachment() {
    console.log("=== Testing ClickUp2 Attachment Tools ===");
    const config = loadConfig();
    const client = new ClickUpClient(config);
    // Get a list
    const list = await toolHandlers.clickup_get_list({ list_name: "Conecta" }, client);
    const listId = list.id;
    // Create temporary task
    console.log("Creating temporary task for attachment test...");
    const task = await toolHandlers.clickup_create_task({
        list_id: listId,
        name: `[Test Attachment] Task ${Date.now()}`
    }, client);
    const taskId = task.id;
    console.log("✓ Task created:", taskId);
    try {
        // Test attach_task_file
        console.log("Attaching base64 file to task...");
        const sampleData = Buffer.from("Hello from ClickUp2 MCP attachment test!").toString("base64");
        const attachRes = await toolHandlers.clickup_attach_task_file({
            task_id: taskId,
            file_data: sampleData,
            file_name: "mcp-test-file.txt"
        }, client);
        console.log("✓ clickup_attach_task_file result:", attachRes?.id, attachRes?.name);
        const attachmentId = attachRes.id;
        // Test download_task_attachment
        if (attachmentId) {
            console.log("Downloading attachment info...");
            const dlRes = await toolHandlers.clickup_download_task_attachment({
                task_id: taskId,
                attachment_id: attachmentId
            }, client);
            console.log("✓ clickup_download_task_attachment:", dlRes.name, dlRes.url ? "URL present" : "no URL");
        }
        // Test request_attachment_upload
        console.log("Testing request_attachment_upload...");
        const reqRes = await toolHandlers.clickup_request_attachment_upload({
            task_id: taskId,
            file_name: "sample.pdf"
        }, client);
        console.log("✓ clickup_request_attachment_upload:", reqRes.upload_url);
    }
    finally {
        console.log("Cleaning up temporary task...");
        await toolHandlers.clickup_delete_task({ task_id: taskId }, client);
        console.log("✓ Temporary task deleted.");
    }
    console.log("=== Attachment Tests Passed! ===");
}
testAttachment().catch(err => {
    console.error("Attachment test error:", err);
    process.exit(1);
});
