import { loadConfig } from "../config.js";
import { ClickUpClient } from "../client.js";
import { toolHandlers } from "../handlers.js";

async function testRelations() {
  console.log("=== Testing ClickUp2 Task Relationships & Move Tools ===");
  const config = loadConfig();
  const client = new ClickUpClient(config);

  const list = await toolHandlers.clickup_get_list({ list_name: "Conecta" }, client);
  const listId = list.id;

  console.log("Creating task A and task B...");
  const taskA = await toolHandlers.clickup_create_task({
    list_id: listId,
    name: `[Rel Test A] ${Date.now()}`
  }, client);

  const taskB = await toolHandlers.clickup_create_task({
    list_id: listId,
    name: `[Rel Test B] ${Date.now()}`
  }, client);

  console.log(`✓ Created Task A (${taskA.id}) and Task B (${taskB.id})`);

  try {
    // 1. Task Links
    console.log("Adding task link between Task A and Task B...");
    await toolHandlers.clickup_add_task_link({
      task_id: taskA.id,
      links_to: taskB.id
    }, client);
    console.log("✓ clickup_add_task_link succeeded");

    console.log("Removing task link between Task A and Task B...");
    await toolHandlers.clickup_remove_task_link({
      task_id: taskA.id,
      links_to: taskB.id
    }, client);
    console.log("✓ clickup_remove_task_link succeeded");

    // 2. Task Dependencies
    console.log("Adding dependency (Task A waiting_on Task B)...");
    await toolHandlers.clickup_add_task_dependency({
      task_id: taskA.id,
      depends_on: taskB.id,
      type: "waiting_on"
    }, client);
    console.log("✓ clickup_add_task_dependency succeeded");

    console.log("Removing dependency...");
    await toolHandlers.clickup_remove_task_dependency({
      task_id: taskA.id,
      depends_on: taskB.id,
      type: "waiting_on"
    }, client);
    console.log("✓ clickup_remove_task_dependency succeeded");

    // 3. Move Task / Add to List
    const otherList = await toolHandlers.clickup_get_list({ list_name: "Cursos" }, client);
    if (otherList && otherList.id) {
      console.log(`Testing adding Task B to secondary list '${otherList.name}' (${otherList.id})...`);
      try {
        await toolHandlers.clickup_add_task_to_list({
          task_id: taskB.id,
          list_id: otherList.id
        }, client);
        console.log("✓ clickup_add_task_to_list succeeded");

        await toolHandlers.clickup_remove_task_from_list({
          task_id: taskB.id,
          list_id: otherList.id
        }, client);
        console.log("✓ clickup_remove_task_from_list succeeded");
      } catch (e: any) {
        console.log("ℹ Tasks in multiple lists ClickApp might not be enabled (expected if free tier):", e?.message);
      }
    }

  } finally {
    console.log("Cleaning up test tasks...");
    await toolHandlers.clickup_delete_task({ task_id: taskA.id }, client);
    await toolHandlers.clickup_delete_task({ task_id: taskB.id }, client);
    console.log("✓ Test tasks deleted.");
  }

  console.log("=== Relationships & Move Tests Completed! ===");
}

testRelations().catch(err => {
  console.error("Test relations error:", err);
  process.exit(1);
});
