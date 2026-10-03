import { loadConfig } from "../config.js";
import { ClickUpClient } from "../client.js";
import { toolHandlers } from "../handlers.js";
async function testDocs() {
    console.log("=== Testing ClickUp2 Docs v3 Tools with existing Doc ===");
    const config = loadConfig();
    const client = new ClickUpClient(config);
    const docId = "2kza5jq9-77"; // Team Docs
    console.log("Listing doc pages for doc", docId, "...");
    const pageListing = await toolHandlers.clickup_list_document_pages({
        document_id: docId
    }, client);
    console.log("✓ clickup_list_document_pages:", JSON.stringify(pageListing));
    const firstPageId = Array.isArray(pageListing) && pageListing.length > 0 ? pageListing[0].id : null;
    if (firstPageId) {
        console.log("Getting page content for page", firstPageId, "...");
        const pages = await toolHandlers.clickup_get_document_pages({
            document_id: docId,
            page_ids: [firstPageId]
        }, client);
        console.log("✓ clickup_get_document_pages:", Array.isArray(pages) ? pages.length : 1, "page(s)");
    }
    console.log("=== Existing Doc Tests Passed! ===");
}
testDocs().catch(err => {
    console.error("Docs test error:", err);
    process.exit(1);
});
