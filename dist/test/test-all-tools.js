import { loadConfig } from "../config.js";
import { ClickUpClient } from "../client.js";
import { toolHandlers } from "../handlers.js";
import { CLICKUP_TOOLS } from "../schemas.js";
async function runTests() {
    console.log("=== Testing ClickUp2 MCP Server & Tools ===");
    const config = loadConfig();
    console.log("Config loaded. Token prefix:", config.apiToken.slice(0, 10) + "...");
    console.log("Registered tool schemas count:", CLICKUP_TOOLS.length);
    const client = new ClickUpClient(config);
    // 1. Verify schema completeness
    console.log("\n[1/10] Verifying tool handlers map to all schemas...");
    for (const tool of CLICKUP_TOOLS) {
        if (!toolHandlers[tool.name]) {
            throw new Error(`Missing handler for tool: ${tool.name}`);
        }
    }
    console.log(`✓ All ${CLICKUP_TOOLS.length} schemas have corresponding handlers.`);
    // 2. Test Workspace Members & Hierarchy
    console.log("\n[2/10] Testing workspace members & hierarchy...");
    const membersRes = await toolHandlers.clickup_get_workspace_members({}, client);
    console.log(`✓ clickup_get_workspace_members: found ${membersRes.members?.length} members.`);
    const findMember = await toolHandlers.clickup_find_member_by_name({ name_or_email: "Rafael" }, client);
    console.log(`✓ clickup_find_member_by_name: found user ${findMember.member?.username} (${findMember.member?.id})`);
    const resolveAssignees = await toolHandlers.clickup_resolve_assignees({ assignees: ["me"] }, client);
    console.log(`✓ clickup_resolve_assignees: resolved "me" ->`, resolveAssignees.assignees);
    const hierarchy = await toolHandlers.clickup_get_workspace_hierarchy({ limit: 5, max_depth: "2" }, client);
    const spaces = hierarchy.hierarchy?.root?.children || [];
    console.log(`✓ clickup_get_workspace_hierarchy: found ${spaces.length} spaces.`);
    for (const s of spaces) {
        console.log(`   - Space: ${s.name} (${s.id}) with ${s.children.length} items`);
    }
    // 3. Test Lists & Folders
    console.log("\n[3/10] Testing list & folder retrieval...");
    const listInfo = await toolHandlers.clickup_get_list({ list_name: "Conecta" }, client);
    console.log(`✓ clickup_get_list (Conecta): id=${listInfo.id}, name=${listInfo.name}`);
    const targetListId = listInfo.id;
    // 4. Test Custom Fields
    console.log("\n[4/10] Testing custom fields...");
    const customFields = await toolHandlers.clickup_get_custom_fields({ list_id: targetListId }, client);
    console.log(`✓ clickup_get_custom_fields: fields=${(customFields.fields || []).length}`);
    // 5. Test Tasks: Filter & Search
    console.log("\n[5/10] Testing task filter & search...");
    const filtered = await toolHandlers.clickup_filter_tasks({ list_ids: [targetListId], page: 0 }, client);
    console.log(`✓ clickup_filter_tasks: found ${filtered.tasks?.length} tasks in list ${targetListId}`);
    const searchRes = await toolHandlers.clickup_search({ keywords: "notícia", count: 5 }, client);
    console.log(`✓ clickup_search: found ${searchRes.results?.length} matches for 'notícia'`);
    // 6. Test Task Lifecycle (Create, Get, Update, Add Tag, Remove Tag, Delete)
    console.log("\n[6/10] Testing task lifecycle (CRUD + Tags)...");
    const testTaskName = `[Automated Test] MCP Task ${Date.now()}`;
    const createdTask = await toolHandlers.clickup_create_task({
        list_id: targetListId,
        name: testTaskName,
        markdown_description: "This is a temporary task created by the ClickUp2 MCP verification test.",
        priority: "normal"
    }, client);
    console.log(`✓ clickup_create_task: created task id=${createdTask.id}, name="${createdTask.name}"`);
    const testTaskId = createdTask.id;
    const fetchedTask = await toolHandlers.clickup_get_task({ task_id: testTaskId }, client);
    console.log(`✓ clickup_get_task: retrieved task id=${fetchedTask.id}, status=${fetchedTask.status?.status}`);
    const updatedTask = await toolHandlers.clickup_update_task({
        task_id: testTaskId,
        name: `${testTaskName} (Updated)`,
        priority: "high"
    }, client);
    console.log(`✓ clickup_update_task: updated priority to ${updatedTask.priority?.priority}`);
    // Test tags
    const testTag = "mcp-test";
    await toolHandlers.clickup_add_tag_to_task({ task_id: testTaskId, tag_name: testTag }, client);
    console.log(`✓ clickup_add_tag_to_task: added tag '${testTag}'`);
    await toolHandlers.clickup_remove_tag_from_task({ task_id: testTaskId, tag_name: testTag }, client);
    console.log(`✓ clickup_remove_tag_from_task: removed tag '${testTag}'`);
    // 7. Test Comments Lifecycle
    console.log("\n[7/10] Testing comments lifecycle...");
    const commentRes = await toolHandlers.clickup_create_task_comment({
        task_id: testTaskId,
        comment_text: "Verification comment from ClickUp2 MCP."
    }, client);
    console.log(`✓ clickup_create_task_comment: created comment id=${commentRes.id}`);
    const testCommentId = commentRes.id;
    const taskComments = await toolHandlers.clickup_get_task_comments({ task_id: testTaskId }, client);
    console.log(`✓ clickup_get_task_comments: found ${taskComments.comments?.length} comments on task`);
    if (testCommentId) {
        const updatedComment = await toolHandlers.clickup_update_comment({
            comment_id: testCommentId,
            comment_text: "Verification comment updated!"
        }, client);
        console.log(`✓ clickup_update_comment: updated comment`);
        await toolHandlers.clickup_delete_comment({ comment_id: testCommentId }, client);
        console.log(`✓ clickup_delete_comment: deleted comment`);
    }
    // Delete test task
    await toolHandlers.clickup_delete_task({ task_id: testTaskId }, client);
    console.log(`✓ clickup_delete_task: deleted test task id=${testTaskId}`);
    // 8. Test Chat Channels
    console.log("\n[8/10] Testing chat channels...");
    const chatChannels = await toolHandlers.clickup_get_chat_channels({}, client);
    console.log(`✓ clickup_get_chat_channels: found ${chatChannels.data?.length} channels`);
    // 9. Test Time Tracking
    console.log("\n[9/10] Testing time tracking...");
    const currentTime = await toolHandlers.clickup_get_current_time_entry({}, client);
    console.log(`✓ clickup_get_current_time_entry: data =`, currentTime.data);
    const timeEntries = await toolHandlers.clickup_get_time_entries({}, client);
    console.log(`✓ clickup_get_time_entries: found ${(timeEntries.data || []).length} entries`);
    // 10. Test Operators & Compatibility
    console.log("\n[10/10] Testing operator catalog & schema tools...");
    const ops = await toolHandlers.clickup_get_operators({}, client);
    console.log(`✓ clickup_get_operators: "${ops}"`);
    const schema = await toolHandlers.clickup_get_schema({}, client);
    console.log(`✓ clickup_get_schema: "${schema}"`);
    console.log("\n=========================================");
    console.log("🎉 ALL TESTS PASSED SUCCESSFULLY! ClickUp2 MCP is fully operational!");
    console.log("=========================================\n");
}
runTests().catch((err) => {
    console.error("Test failed with error:", err);
    process.exit(1);
});
