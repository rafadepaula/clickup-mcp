import { ClickUpClient } from "./client.js";

export type ToolHandler = (args: any, client: ClickUpClient) => Promise<any>;

export const toolHandlers: Record<string, ToolHandler> = {
  // ==========================================
  // Workspace & Members & Hierarchy
  // ==========================================

  clickup_get_workspace_hierarchy: async (args, client) => {
    const wsId = await client.resolveWorkspaceId(args.workspace_id);
    const limit = typeof args.limit === "number" ? Math.min(args.limit, 50) : 10;
    const maxDepth = args.max_depth !== undefined ? parseInt(String(args.max_depth), 10) : 2;

    const spacesRes = await client.get<{ spaces: any[] }>(`/team/${wsId}/space?archived=false`);
    let spaces = spacesRes.spaces || [];

    if (args.space_ids && Array.isArray(args.space_ids) && args.space_ids.length > 0) {
      const allowed = new Set(args.space_ids.map(String));
      spaces = spaces.filter((s) => allowed.has(String(s.id)));
    }

    const totalSpaces = spaces.length;
    const pagedSpaces = spaces.slice(0, limit);

    const spaceNodes: any[] = [];
    for (const space of pagedSpaces) {
      const spaceNode: any = {
        id: String(space.id),
        name: space.name,
        type: "space",
        children: []
      };

      if (maxDepth >= 1) {
        // Fetch folders
        try {
          const foldersRes = await client.get<{ folders: any[] }>(`/space/${space.id}/folder`);
          const folders = foldersRes.folders || [];

          for (const folder of folders) {
            const folderNode: any = {
              id: String(folder.id),
              name: folder.name,
              type: "folder",
              children: []
            };

            if (maxDepth >= 2) {
              try {
                const fListsRes = await client.get<{ lists: any[] }>(`/folder/${folder.id}/list`);
                folderNode.children = (fListsRes.lists || []).map((l) => ({
                  id: String(l.id),
                  name: l.name,
                  type: "list",
                  children: []
                }));
              } catch {
                // ignore list fetch error for this folder
              }
            }
            spaceNode.children.push(folderNode);
          }
        } catch {
          // ignore folder fetch error
        }

        if (maxDepth >= 2) {
          // Fetch folderless lists
          try {
            const listsRes = await client.get<{ lists: any[] }>(`/space/${space.id}/list`);
            const folderless = (listsRes.lists || []).map((l) => ({
              id: String(l.id),
              name: l.name,
              type: "list",
              children: []
            }));
            spaceNode.children.push(...folderless);
          } catch {
            // ignore folderless lists error
          }
        }
      }

      spaceNodes.push(spaceNode);
    }

    return {
      hierarchy: {
        root: {
          id: wsId,
          name: "Workspace",
          children: spaceNodes
        }
      },
      next_cursor: null,
      has_more: totalSpaces > limit,
      total_spaces: totalSpaces
    };
  },

  clickup_get_workspace_members: async (args, client) => {
    const wsId = await client.resolveWorkspaceId(args.workspace_id);
    const members = await client.getWorkspaceMembers(wsId);
    return { members: members.map((m) => m.user) };
  },

  clickup_find_member_by_name: async (args, client) => {
    const wsId = await client.resolveWorkspaceId(args.workspace_id);
    const member = await client.findMemberByNameOrEmail(args.name_or_email, wsId);
    return { member };
  },

  clickup_resolve_assignees: async (args, client) => {
    const wsId = await client.resolveWorkspaceId(args.workspace_id);
    const assignees = Array.isArray(args.assignees) ? args.assignees : [args.assignees];
    const resolved = await client.resolveAssignees(assignees, wsId);
    return { assignees: resolved };
  },

  clickup_get_custom_fields: async (args, client) => {
    const wsId = await client.resolveWorkspaceId(args.workspace_id);
    if (args.list_id) {
      return await client.get(`/list/${args.list_id}/field`);
    }
    if (args.folder_id) {
      return await client.get(`/folder/${args.folder_id}/field`);
    }
    if (args.space_id) {
      return await client.get(`/space/${args.space_id}/field`);
    }
    return await client.get(`/team/${wsId}/field`);
  },

  // ==========================================
  // Folders & Lists
  // ==========================================

  clickup_create_folder: async (args, client) => {
    const wsId = await client.resolveWorkspaceId(args.workspace_id);
    let spaceId = args.space_id;

    if (!spaceId && args.space_name) {
      const spacesRes = await client.get<{ spaces: any[] }>(`/team/${wsId}/space?archived=false`);
      const s = (spacesRes.spaces || []).find(
        (sp) => sp.name.toLowerCase() === args.space_name.trim().toLowerCase()
      );
      if (s) spaceId = s.id;
    }

    if (!spaceId) {
      throw new Error("space_id or matching space_name is required to create a folder.");
    }

    return await client.post(`/space/${spaceId}/folder`, {
      name: args.name,
      override_statuses: args.override_statuses
    });
  },

  clickup_get_folder: async (args, client) => {
    if (args.folder_id) {
      return await client.get(`/folder/${args.folder_id}`);
    }

    const wsId = await client.resolveWorkspaceId(args.workspace_id);
    let spaceId = args.space_id;

    if (!spaceId && args.space_name) {
      const spacesRes = await client.get<{ spaces: any[] }>(`/team/${wsId}/space?archived=false`);
      const s = (spacesRes.spaces || []).find(
        (sp) => sp.name.toLowerCase() === args.space_name.trim().toLowerCase()
      );
      if (s) spaceId = s.id;
    }

    if (spaceId && args.folder_name) {
      const foldersRes = await client.get<{ folders: any[] }>(`/space/${spaceId}/folder`);
      const match = (foldersRes.folders || []).find(
        (f) => f.name.toLowerCase() === args.folder_name.trim().toLowerCase()
      );
      if (match) return match;
    }

    throw new Error("Folder not found. Please provide folder_id or valid folder_name and space_id.");
  },

  clickup_update_folder: async (args, client) => {
    const body: any = {};
    if (args.name !== undefined) body.name = args.name;
    if (args.override_statuses !== undefined) body.override_statuses = args.override_statuses;
    return await client.put(`/folder/${args.folder_id}`, body);
  },

  clickup_create_list: async (args, client) => {
    const wsId = await client.resolveWorkspaceId(args.workspace_id);
    let spaceId = args.space_id;

    if (!spaceId && args.space_name) {
      const spacesRes = await client.get<{ spaces: any[] }>(`/team/${wsId}/space?archived=false`);
      const s = (spacesRes.spaces || []).find(
        (sp) => sp.name.toLowerCase() === args.space_name.trim().toLowerCase()
      );
      if (s) spaceId = s.id;
    }

    if (!spaceId) {
      throw new Error("space_id or valid space_name is required to create a space list.");
    }

    const body: any = { name: args.name };
    if (args.content !== undefined) body.content = args.content;
    if (args.status !== undefined) body.status = args.status;
    if (args.priority !== undefined) body.priority = client.parsePriority(args.priority);
    if (args.due_date !== undefined) body.due_date = client.parseDateToMs(args.due_date);
    if (args.assignee !== undefined) body.assignee = Number(args.assignee);

    return await client.post(`/space/${spaceId}/list`, body);
  },

  clickup_create_list_in_folder: async (args, client) => {
    const body: any = { name: args.name };
    if (args.content !== undefined) body.content = args.content;
    if (args.status !== undefined) body.status = args.status;
    return await client.post(`/folder/${args.folder_id}/list`, body);
  },

  clickup_get_list: async (args, client) => {
    if (args.list_id) {
      return await client.get(`/list/${args.list_id}`);
    }

    if (args.list_name) {
      const wsId = await client.resolveWorkspaceId(args.workspace_id);
      const spacesRes = await client.get<{ spaces: any[] }>(`/team/${wsId}/space?archived=false`);
      const searchName = args.list_name.trim().toLowerCase();

      for (const space of spacesRes.spaces || []) {
        // Check folderless lists
        try {
          const lRes = await client.get<{ lists: any[] }>(`/space/${space.id}/list`);
          const found = (lRes.lists || []).find((l) => l.name.toLowerCase() === searchName);
          if (found) return found;
        } catch {}

        // Check lists inside folders
        try {
          const fRes = await client.get<{ folders: any[] }>(`/space/${space.id}/folder`);
          for (const folder of fRes.folders || []) {
            try {
              const flRes = await client.get<{ lists: any[] }>(`/folder/${folder.id}/list`);
              const found = (flRes.lists || []).find((l) => l.name.toLowerCase() === searchName);
              if (found) return found;
            } catch {}
          }
        } catch {}
      }
    }

    throw new Error("List not found. Provide list_id or valid list_name.");
  },

  clickup_update_list: async (args, client) => {
    const body: any = {};
    if (args.name !== undefined) body.name = args.name;
    if (args.content !== undefined) body.content = args.content;
    if (args.status !== undefined) body.status = args.status;
    return await client.put(`/list/${args.list_id}`, body);
  },

  clickup_add_task_to_list: async (args, client) => {
    return await client.post(`/list/${args.list_id}/task/${args.task_id}`);
  },

  clickup_remove_task_from_list: async (args, client) => {
    return await client.delete(`/list/${args.list_id}/task/${args.task_id}`);
  },

  // ==========================================
  // Tasks
  // ==========================================

  clickup_create_task: async (args, client) => {
    const wsId = await client.resolveWorkspaceId(args.workspace_id);

    let assignees: number[] | undefined;
    if (args.assignees && Array.isArray(args.assignees) && args.assignees.length > 0) {
      assignees = await client.resolveAssignees(args.assignees, wsId);
    }

    const body: any = {
      name: args.name
    };

    if (args.markdown_description !== undefined) {
      body.markdown_description = args.markdown_description;
    }
    if (assignees && assignees.length > 0) {
      body.assignees = assignees;
    }
    if (args.status !== undefined) {
      body.status = args.status;
    }
    if (args.priority !== undefined) {
      body.priority = client.parsePriority(args.priority);
    }
    if (args.due_date !== undefined) {
      body.due_date = client.parseDateToMs(args.due_date);
    }
    if (args.start_date !== undefined) {
      body.start_date = client.parseDateToMs(args.start_date);
    }
    if (args.time_estimate !== undefined) {
      body.time_estimate = client.parseTimeEstimate(args.time_estimate);
    }
    if (args.tags && Array.isArray(args.tags)) {
      body.tags = args.tags;
    }
    if (args.parent !== undefined) {
      body.parent = args.parent;
    }
    if (args.check_required_custom_fields !== undefined) {
      body.check_required_custom_fields = args.check_required_custom_fields;
    }
    if (args.custom_fields && Array.isArray(args.custom_fields)) {
      body.custom_fields = args.custom_fields;
    }

    if (args.task_type) {
      const typeId = await client.resolveTaskTypeId(args.task_type, wsId);
      if (typeId !== undefined) {
        body.custom_item_id = typeId;
      }
    }

    return await client.post(`/list/${args.list_id}/task`, body);
  },

  clickup_get_task: async (args, client) => {
    const query: Record<string, any> = {
      include_subtasks: true
    };
    if (args.include && Array.isArray(args.include)) {
      for (const item of args.include) {
        query[item] = true;
      }
    }
    return await client.get(`/task/${args.task_id}`, query);
  },

  clickup_update_task: async (args, client) => {
    const wsId = await client.resolveWorkspaceId(args.workspace_id);
    const body: any = {};

    if (args.name !== undefined) body.name = args.name;
    if (args.markdown_description !== undefined) body.markdown_description = args.markdown_description;
    if (args.status !== undefined) body.status = args.status;
    if (args.priority !== undefined) body.priority = client.parsePriority(args.priority);
    if (args.due_date !== undefined) body.due_date = client.parseDateToMs(args.due_date);
    if (args.start_date !== undefined) body.start_date = client.parseDateToMs(args.start_date);
    if (args.time_estimate !== undefined) body.time_estimate = client.parseTimeEstimate(args.time_estimate);
    if (args.custom_fields !== undefined) body.custom_fields = args.custom_fields;

    if (args.assignees !== undefined) {
      if (Array.isArray(args.assignees)) {
        const resolved = await client.resolveAssignees(args.assignees, wsId);
        body.assignees = { add: resolved, rem: [] };
      } else if (typeof args.assignees === "object") {
        body.assignees = args.assignees;
      }
    }

    if (args.task_type !== undefined) {
      if (args.task_type.toLowerCase() === "none") {
        body.custom_item_id = null;
      } else {
        const typeId = await client.resolveTaskTypeId(args.task_type, wsId);
        if (typeId !== undefined) {
          body.custom_item_id = typeId;
        }
      }
    }

    return await client.put(`/task/${args.task_id}`, body);
  },

  clickup_delete_task: async (args, client) => {
    return await client.delete(`/task/${args.task_id}`);
  },

  clickup_filter_tasks: async (args, client) => {
    const wsId = await client.resolveWorkspaceId(args.workspace_id);
    const query: Record<string, any> = {
      subtasks: args.subtasks ?? true,
      include_closed: args.include_closed ?? true,
      page: args.page ?? 0
    };

    if (args.order_by) query.order_by = args.order_by;
    if (args.reverse !== undefined) query.reverse = args.reverse;
    if (args.statuses) query.statuses = args.statuses;
    if (args.tags) query.tags = args.tags;
    if (args.list_ids) query.list_ids = args.list_ids;
    if (args.space_ids) query.space_ids = args.space_ids;
    if (args.folder_ids) query.project_ids = args.folder_ids;

    if (args.due_date_from) query.due_date_gt = client.parseDateToMs(args.due_date_from);
    if (args.due_date_to) query.due_date_lt = client.parseDateToMs(args.due_date_to);
    if (args.date_closed_from) query.date_closed_gt = client.parseDateToMs(args.date_closed_from);
    if (args.date_closed_to) query.date_closed_lt = client.parseDateToMs(args.date_closed_to);

    if (args.assignees && Array.isArray(args.assignees)) {
      query.assignees = await client.resolveAssignees(args.assignees, wsId);
    }

    if (args.custom_fields) {
      query.custom_fields = JSON.stringify(args.custom_fields);
    }

    if (args.list_ids && Array.isArray(args.list_ids) && args.list_ids.length === 1) {
      return await client.get(`/list/${args.list_ids[0]}/task`, query);
    }

    return await client.get(`/team/${wsId}/task`, query);
  },

  clickup_move_task: async (args, client) => {
    const wsId = await client.resolveWorkspaceId(args.workspace_id);
    try {
      return await client.put(
        `/api/v3/workspaces/${wsId}/tasks/${args.task_id}/home_list/${args.list_id}`,
        {}
      );
    } catch {
      // Fallback for v2
      return await client.post(`/list/${args.list_id}/task/${args.task_id}`);
    }
  },

  clickup_merge_tasks: async (args, client) => {
    return await client.post(`/v2/task/${args.task_id}/merge`, {
      source_task_ids: args.source_task_ids
    });
  },

  clickup_search: async (args, client) => {
    const wsId = await client.resolveWorkspaceId(args.workspace_id);
    const count = typeof args.count === "number" ? Math.min(args.count, 100) : 50;

    // Search tasks across team
    const tasksRes = await client.get<{ tasks: any[] }>(`/team/${wsId}/task`, {
      subtasks: true,
      include_closed: true,
      page: 0
    });

    let results = (tasksRes.tasks || []).map((t) => ({
      type: "task",
      id: t.id,
      name: t.name,
      description: t.description || t.text_content || "",
      status: t.status?.status,
      priority: t.priority?.priority,
      list: t.list,
      created_at: t.date_created,
      updated_at: t.date_updated,
      url: t.url
    }));

    if (args.keywords) {
      const q = args.keywords.trim().toLowerCase();
      results = results.filter(
        (r) =>
          r.name?.toLowerCase().includes(q) ||
          r.description?.toLowerCase().includes(q)
      );
    }

    // Filter by asset types
    if (args.filters?.asset_types && Array.isArray(args.filters.asset_types)) {
      const types = new Set(args.filters.asset_types);
      results = results.filter((r) => types.has(r.type));
    }

    return {
      results: results.slice(0, count),
      total: results.length,
      next_cursor: results.length > count ? "1" : null
    };
  },

  // ==========================================
  // Tags, Dependencies, Links
  // ==========================================

  clickup_add_tag_to_task: async (args, client) => {
    return await client.post(`/task/${args.task_id}/tag/${encodeURIComponent(args.tag_name)}`);
  },

  clickup_remove_tag_from_task: async (args, client) => {
    return await client.delete(`/task/${args.task_id}/tag/${encodeURIComponent(args.tag_name)}`);
  },

  clickup_add_task_dependency: async (args, client) => {
    const body =
      args.type === "waiting_on"
        ? { depends_on: args.depends_on }
        : { dependency_of: args.depends_on };
    return await client.post(`/task/${args.task_id}/dependency`, body);
  },

  clickup_remove_task_dependency: async (args, client) => {
    return await client.delete(`/task/${args.task_id}/dependency`, {
      depends_on: args.depends_on
    });
  },

  clickup_add_task_link: async (args, client) => {
    return await client.post(`/task/${args.task_id}/link/${args.links_to}`);
  },

  clickup_remove_task_link: async (args, client) => {
    return await client.delete(`/task/${args.task_id}/link/${args.links_to}`);
  },

  // ==========================================
  // Comments
  // ==========================================

  clickup_get_task_comments: async (args, client) => {
    const query: Record<string, any> = {};
    if (args.start !== undefined) query.start = args.start;
    if (args.start_id !== undefined) query.start_id = args.start_id;
    return await client.get(`/task/${args.task_id}/comment`, query);
  },

  clickup_create_task_comment: async (args, client) => {
    const body: any = {
      comment_text: args.comment_text,
      notify_all: args.notify_all ?? true
    };
    if (args.assignee !== undefined) body.assignee = Number(args.assignee);
    return await client.post(`/task/${args.task_id}/comment`, body);
  },

  clickup_create_comment: async (args, client) => {
    const body: any = {
      comment_text: args.comment_text,
      notify_all: args.notify_all ?? true
    };
    if (args.assignee !== undefined) body.assignee = Number(args.assignee);

    const type = (args.entity_type || "task").toLowerCase();
    if (type === "list") {
      return await client.post(`/list/${args.entity_id}/comment`, body);
    }
    if (type === "view") {
      return await client.post(`/view/${args.entity_id}/comment`, body);
    }
    return await client.post(`/task/${args.entity_id}/comment`, body);
  },

  clickup_update_comment: async (args, client) => {
    const body: any = {};
    if (args.comment_text !== undefined) body.comment_text = args.comment_text;
    if (args.resolved !== undefined) body.resolved = args.resolved;
    if (args.assignee !== undefined) body.assignee = Number(args.assignee);
    return await client.put(`/comment/${args.comment_id}`, body);
  },

  clickup_delete_comment: async (args, client) => {
    return await client.delete(`/comment/${args.comment_id}`);
  },

  clickup_get_threaded_comments: async (args, client) => {
    return await client.get(`/comment/${args.comment_id}/reply`);
  },

  // ==========================================
  // Attachments
  // ==========================================

  clickup_attach_task_file: async (args, client) => {
    if (args.file_data && args.file_name) {
      const buffer = Buffer.from(args.file_data, "base64");
      return await client.uploadFile(`/task/${args.task_id}/attachment`, buffer, args.file_name);
    }

    if (args.file_url) {
      const fetchHeaders: Record<string, string> = {};
      if (args.auth_header) fetchHeaders.Authorization = args.auth_header;
      const res = await fetch(args.file_url, { headers: fetchHeaders });
      if (!res.ok) {
        throw new Error(`Failed to fetch file from file_url: ${res.statusText}`);
      }
      const arrayBuffer = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const fileName =
        args.file_name ||
        args.file_url.split("/").pop()?.split("?")[0] ||
        "attachment";
      return await client.uploadFile(`/task/${args.task_id}/attachment`, buffer, fileName);
    }

    throw new Error("Must provide either file_data + file_name or file_url.");
  },

  clickup_request_attachment_upload: async (args, client) => {
    const fileName = args.file_name || "attachment";
    return {
      upload_url: `https://api.clickup.com/api/v2/task/${args.task_id}/attachment`,
      method: "POST",
      field_name: "attachment",
      file_name: fileName,
      headers: {
        Authorization: client.token
      },
      instructions:
        "Send a multipart/form-data POST request to upload_url with form field 'attachment' containing the file data."
    };
  },

  clickup_download_task_attachment: async (args, client) => {
    const task = await client.get<{ attachments: any[] }>(`/task/${args.task_id}`);
    const match = (task.attachments || []).find((a) => String(a.id) === String(args.attachment_id));
    if (!match) {
      throw new Error(`Attachment ${args.attachment_id} not found on task ${args.task_id}`);
    }
    return {
      id: match.id,
      name: match.name || match.title || match.filename || "attachment",
      url: match.url_w_query || match.url,
      mime_type: match.mimetype,
      size: match.size,
      date: match.date
    };
  },

  clickup_list_document_page_attachments: async (args, client) => {
    const wsId = await client.resolveWorkspaceId(args.workspace_id);
    try {
      return await client.get(
        `/api/v3/workspaces/${wsId}/attachments/${args.page_id}`
      );
    } catch {
      return { attachments: [] };
    }
  },

  clickup_download_document_page_attachment: async (args, client) => {
    return {
      attachment_id: args.attachment_id,
      page_id: args.page_id,
      message: "Direct attachment access URL requested."
    };
  },

  // ==========================================
  // Documents (Docs v3)
  // ==========================================

  clickup_create_document: async (args, client) => {
    const wsId = await client.resolveWorkspaceId(args.workspace_id);
    const body = {
      name: args.name,
      parent: {
        id: String(args.parent.id),
        type: Number(args.parent.type)
      },
      visibility: args.visibility,
      create_page: args.create_page
    };
    return await client.post(`/api/v3/workspaces/${wsId}/docs`, body);
  },

  clickup_list_document_pages: async (args, client) => {
    const wsId = await client.resolveWorkspaceId(args.workspace_id);
    const maxDepth = args.max_page_depth !== undefined ? args.max_page_depth : -1;
    return await client.get(
      `/api/v3/workspaces/${wsId}/docs/${args.document_id}/page_listing?max_page_depth=${maxDepth}`
    );
  },

  clickup_get_document_pages: async (args, client) => {
    const wsId = await client.resolveWorkspaceId(args.workspace_id);
    const format = args.content_format || "text/md";
    const pages = await client.get<any[]>(
      `/api/v3/workspaces/${wsId}/docs/${args.document_id}/pages?content_format=${format}`
    );

    if (args.page_ids && Array.isArray(args.page_ids) && args.page_ids.length > 0) {
      const allowed = new Set(args.page_ids.map(String));
      return (pages || []).filter((p) => allowed.has(String(p.id)));
    }

    return pages;
  },

  clickup_create_document_page: async (args, client) => {
    const wsId = await client.resolveWorkspaceId(args.workspace_id);
    const body: any = {
      name: args.name,
      content: args.content,
      content_format: args.content_format || "text/md"
    };
    if (args.parent_page_id) body.parent_page_id = args.parent_page_id;
    if (args.sub_title) body.sub_title = args.sub_title;

    return await client.post(`/api/v3/workspaces/${wsId}/docs/${args.document_id}/pages`, body);
  },

  clickup_update_document_page: async (args, client) => {
    const wsId = await client.resolveWorkspaceId(args.workspace_id);
    let finalContent = args.content;

    if (
      args.content &&
      (args.content_edit_mode === "append" || args.content_edit_mode === "prepend")
    ) {
      try {
        const current = await client.get<any>(
          `/api/v3/workspaces/${wsId}/docs/${args.document_id}/pages/${args.page_id}`
        );
        const existing = current.content || "";
        finalContent =
          args.content_edit_mode === "append"
            ? `${existing}\n${args.content}`
            : `${args.content}\n${existing}`;
      } catch {
        // fallback to original content
      }
    }

    const body: any = {};
    if (args.name !== undefined) body.name = args.name;
    if (finalContent !== undefined) body.content = finalContent;
    if (args.content_format !== undefined) body.content_format = args.content_format;
    if (args.sub_title !== undefined) body.sub_title = args.sub_title;

    return await client.put(
      `/api/v3/workspaces/${wsId}/docs/${args.document_id}/pages/${args.page_id}`,
      body
    );
  },

  // ==========================================
  // Chat
  // ==========================================

  clickup_get_chat_channels: async (args, client) => {
    const wsId = await client.resolveWorkspaceId(args.workspace_id);
    const query: Record<string, any> = {};
    if (args.cursor) query.cursor = args.cursor;
    if (args.limit) query.limit = args.limit;
    return await client.get(`/api/v3/workspaces/${wsId}/chat/channels`, query);
  },

  clickup_send_chat_message: async (args, client) => {
    const wsId = await client.resolveWorkspaceId(args.workspace_id);
    const body: any = {
      content: args.content,
      content_format: args.content_format || "text/md"
    };

    if (args.post_title) body.post_title = args.post_title;
    if (args.post_type) body.post_type = args.post_type;
    if (args.type) body.type = args.type;
    if (args.assignee) body.assignee = args.assignee;
    if (args.group_assignee) body.group_assignee = args.group_assignee;
    if (args.followers) body.followers = args.followers;

    if (args.parent_message_id) {
      return await client.post(
        `/api/v3/workspaces/${wsId}/chat/channels/${args.channel_id}/messages/${args.parent_message_id}/replies`,
        body
      );
    }

    return await client.post(
      `/api/v3/workspaces/${wsId}/chat/channels/${args.channel_id}/messages`,
      body
    );
  },

  clickup_get_chat_channel_messages: async (args, client) => {
    const wsId = await client.resolveWorkspaceId(args.workspace_id);
    const query: Record<string, any> = {};
    if (args.cursor) query.cursor = args.cursor;
    if (args.limit) query.limit = args.limit;
    if (args.content_format) query.content_format = args.content_format;
    return await client.get(
      `/api/v3/workspaces/${wsId}/chat/channels/${args.channel_id}/messages`,
      query
    );
  },

  clickup_get_chat_message_replies: async (args, client) => {
    const wsId = await client.resolveWorkspaceId(args.workspace_id);
    const query: Record<string, any> = {};
    if (args.cursor) query.cursor = args.cursor;
    if (args.limit) query.limit = args.limit;
    if (args.content_format) query.content_format = args.content_format;

    // Chat replies route in v3
    return await client.get(
      `/api/v3/workspaces/${wsId}/chat/messages/${args.message_id}/replies`,
      query
    );
  },

  // ==========================================
  // Reminders
  // ==========================================

  clickup_create_reminder: async (args, client) => {
    const wsId = await client.resolveWorkspaceId(args.workspace_id);
    const body: any = {
      name: args.title,
      due_date: client.parseDateToMs(args.due_date)
    };
    if (args.description) body.description = args.description;
    return await client.post(`/team/${wsId}/reminder`, body);
  },

  clickup_search_reminders: async (args, client) => {
    const wsId = await client.resolveWorkspaceId(args.workspace_id);
    try {
      return await client.get(`/team/${wsId}/reminder`);
    } catch {
      return { reminders: [] };
    }
  },

  clickup_update_reminder: async (args, client) => {
    const body: any = {};
    if (args.title !== undefined) body.name = args.title;
    if (args.description !== undefined) body.description = args.description;
    if (args.due_date !== undefined) body.due_date = client.parseDateToMs(args.due_date);
    if (args.is_completed !== undefined) body.is_completed = args.is_completed;
    return await client.put(`/reminder/${args.reminder_id}`, body);
  },

  // ==========================================
  // Time Tracking
  // ==========================================

  clickup_start_time_tracking: async (args, client) => {
    const wsId = await client.resolveWorkspaceId(args.workspace_id);
    const body: any = {
      tid: args.task_id,
      billable: args.billable ?? false
    };
    if (args.description) body.description = args.description;
    if (args.tags && Array.isArray(args.tags)) body.tags = args.tags;
    return await client.post(`/team/${wsId}/time_entries/start`, body);
  },

  clickup_stop_time_tracking: async (args, client) => {
    const wsId = await client.resolveWorkspaceId(args.workspace_id);
    const body: any = {};
    if (args.description) body.description = args.description;
    if (args.tags && Array.isArray(args.tags)) body.tags = args.tags;
    return await client.post(`/team/${wsId}/time_entries/stop`, body);
  },

  clickup_add_time_entry: async (args, client) => {
    const wsId = await client.resolveWorkspaceId(args.workspace_id);
    const body: any = {
      tid: args.task_id,
      start: client.parseDateToMs(args.start),
      billable: args.billable ?? false
    };
    if (args.duration !== undefined) body.duration = args.duration;
    if (args.end_time !== undefined) body.stop = client.parseDateToMs(args.end_time);
    if (args.description) body.description = args.description;
    if (args.tags && Array.isArray(args.tags)) body.tags = args.tags;
    return await client.post(`/team/${wsId}/time_entries`, body);
  },

  clickup_get_current_time_entry: async (args, client) => {
    const wsId = await client.resolveWorkspaceId(args.workspace_id);
    return await client.get(`/team/${wsId}/time_entries/current`);
  },

  clickup_get_time_entries: async (args, client) => {
    const wsId = await client.resolveWorkspaceId(args.workspace_id);
    const query: Record<string, any> = {};
    if (args.task_id) query.task_id = args.task_id;
    if (args.assignee) query.assignee = args.assignee;
    if (args.is_billable !== undefined) query.is_billable = args.is_billable;
    if (args.start_date) query.start_date = client.parseDateToMs(args.start_date);
    if (args.end_date) query.end_date = client.parseDateToMs(args.end_date);
    return await client.get(`/team/${wsId}/time_entries`, query);
  },

  clickup_get_task_time_in_status: async (args, client) => {
    return await client.get(`/task/${args.task_id}/time_in_status`);
  },

  clickup_get_bulk_tasks_time_in_status: async (args, client) => {
    const taskIds = Array.isArray(args.task_ids) ? args.task_ids : [args.task_ids];
    return await client.get(`/task/bulk_time_in_status/task_ids`, {
      task_ids: taskIds
    });
  },

  // ==========================================
  // Operators & Schema Compatibility
  // ==========================================

  clickup_get_operators: async () => {
    return "No enabled operators match the request. Enabled operators: none";
  },

  clickup_execute_operator: async (args) => {
    throw new Error(
      `Operator ${args.model}.${args.operator} is not available. Please use the dedicated clickup_* tools.`
    );
  },

  clickup_get_schema: async () => {
    return "No enabled entities match the request. Enabled entities: none";
  }
};
