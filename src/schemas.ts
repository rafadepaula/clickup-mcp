// Auto-generated exact tool definitions matching ClickUp MCP schemas
import type { Tool } from "@modelcontextprotocol/sdk/types.js";

export const CLICKUP_TOOLS: Tool[] = [
  {
    "name": "clickup_add_tag_to_task",
    "description": "Add existing tag to task. Tag must exist in space. Note: Will fail if tag doesn't exist.",
    "inputSchema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "properties": {
        "tag_name": {
          "description": "Name of the tag to add to the task. The tag must already exist in the space.",
          "type": "string"
        },
        "task_id": {
          "description": "ID of task. Works with both regular task IDs and custom IDs (like 'DEV-1234'). Use clickup_search to find task ID by name if needed.",
          "type": "string"
        },
        "workspace_id": {
          "description": "Workspace ID (digits only). Only needed when you have multiple workspaces.",
          "pattern": "^\\d+$",
          "type": "string"
        }
      },
      "required": [
        "task_id",
        "tag_name"
      ],
      "type": "object"
    }
  },
  {
    "name": "clickup_add_task_dependency",
    "description": "Set a directional dependency where one task blocks the other. Use 'waiting_on' when task_id cannot start until depends_on is done, or 'blocking' when task_id is blocking depends_on. For non-blocking associations, use add_task_link instead.",
    "inputSchema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "properties": {
        "depends_on": {
          "description": "ID of the task that task_id depends on or is blocking. Works with regular and custom IDs.",
          "type": "string"
        },
        "task_id": {
          "description": "ID of the task to set the dependency on. Works with regular and custom IDs (like 'DEV-1234'). Use clickup_search to find task ID by name if needed.",
          "type": "string"
        },
        "type": {
          "description": "Type of dependency to add: 'waiting_on' or 'blocking'.",
          "enum": [
            "waiting_on",
            "blocking"
          ],
          "type": "string"
        },
        "workspace_id": {
          "description": "Workspace ID (digits only). Only needed when you have multiple workspaces.",
          "pattern": "^\\d+$",
          "type": "string"
        }
      },
      "required": [
        "task_id",
        "depends_on",
        "type"
      ],
      "type": "object"
    }
  },
  {
    "name": "clickup_add_task_link",
    "description": "Link two tasks together. Creates a bidirectional association with no ordering or blocking. For blocking/dependency relationships, use add_task_dependency instead.",
    "inputSchema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "properties": {
        "links_to": {
          "description": "ID of the task to link to. Works with regular and custom IDs.",
          "type": "string"
        },
        "task_id": {
          "description": "ID of the task to link from. Works with regular and custom IDs (like 'DEV-1234').",
          "type": "string"
        },
        "workspace_id": {
          "description": "Workspace ID (digits only). Only needed when you have multiple workspaces.",
          "pattern": "^\\d+$",
          "type": "string"
        }
      },
      "required": [
        "task_id",
        "links_to"
      ],
      "type": "object"
    }
  },
  {
    "name": "clickup_add_task_to_list",
    "description": "Add a task to an additional list (keeps current home list). Requires the Tasks in Multiple Lists ClickApp to be enabled.",
    "inputSchema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "properties": {
        "list_id": {
          "description": "ID of the additional list to add the task to. The task remains in its original list. Use clickup_get_list to find the list ID from a list name if needed.",
          "type": "string"
        },
        "task_id": {
          "description": "ID of the task to add. Works with regular and custom IDs (like 'DEV-1234'). Use clickup_search to find task ID by name if needed.",
          "type": "string"
        },
        "workspace_id": {
          "description": "Workspace ID (digits only). Only needed when you have multiple workspaces.",
          "pattern": "^\\d+$",
          "type": "string"
        }
      },
      "required": [
        "task_id",
        "list_id"
      ],
      "type": "object"
    }
  },
  {
    "name": "clickup_add_time_entry",
    "description": "Add a manual time entry to a task. You can provide either (start + duration) OR (start + end). The tool will calculate missing values. Requires task_id, start time, and either duration or end time. Supports description, billable flag, and tags.",
    "inputSchema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "properties": {
        "billable": {
          "description": "Whether this time is billable. Default is workspace setting.",
          "type": "boolean"
        },
        "description": {
          "description": "Description for the time entry. Keep short and simple, or omit for best compatibility.",
          "type": "string"
        },
        "duration": {
          "description": "Duration of the time entry. Format as 'Xh Ym' (e.g., '1h 30m') or just minutes (e.g., '90m'). Either duration or end_time is required.",
          "type": "string"
        },
        "end_time": {
          "description": "End time in YYYY-MM-DD HH:MM format (e.g., '2025-01-15 11:00'). Time is required for time tracking entries.",
          "pattern": "^\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}$",
          "type": "string"
        },
        "start": {
          "description": "Start time in YYYY-MM-DD HH:MM format (e.g., '2025-01-15 09:30'). Time is required for time tracking entries.",
          "pattern": "^\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}$",
          "type": "string"
        },
        "tags": {
          "description": "Array of tag names to assign to the time entry.",
          "items": {
            "type": "string"
          },
          "type": "array"
        },
        "task_id": {
          "description": "Task ID (supports custom IDs like 'DEV-1234')",
          "type": "string"
        },
        "workspace_id": {
          "description": "Workspace ID (digits only). Only needed when you have multiple workspaces.",
          "pattern": "^\\d+$",
          "type": "string"
        }
      },
      "required": [
        "task_id",
        "start"
      ],
      "type": "object"
    }
  },
  {
    "name": "clickup_attach_task_file",
    "description": "Attach file to task. Requires task_id. File sources: 1) base64 + filename (small files under ~200KB only), 2) URL (http/https). For files on the local machine, use request_attachment_upload instead.",
    "inputSchema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "properties": {
        "auth_header": {
          "description": "Authorization header to use when downloading from the web URL.",
          "type": "string"
        },
        "file_data": {
          "description": "Base64-encoded content of the file (without the data URL prefix).",
          "type": "string"
        },
        "file_name": {
          "description": "Name of the file to be attached (include the extension). Required when using file_data.",
          "type": "string"
        },
        "file_url": {
          "description": "URL to download the file from (must start with http:// or https://).",
          "type": "string"
        },
        "task_id": {
          "description": "Task ID (supports custom IDs like 'DEV-1234')",
          "type": "string"
        },
        "workspace_id": {
          "description": "Workspace ID (digits only). Only needed when you have multiple workspaces.",
          "pattern": "^\\d+$",
          "type": "string"
        }
      },
      "required": [
        "task_id"
      ],
      "type": "object"
    }
  },
  {
    "name": "clickup_create_comment",
    "description": "Create a comment or threaded reply on a task, list, or view. Supports Markdown (headings, bold, code blocks, tables). Use entity_type + entity_id for the target entity. Provide reply_to_id for a threaded reply.",
    "inputSchema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "properties": {
        "assignee": {
          "description": "User ID to assign the comment to. Use clickup_resolve_assignees to convert email, username, or \"me\" to user ID if needed.",
          "type": "number"
        },
        "comment_text": {
          "description": "Comment content. Supports Markdown formatting. To @mention a user, write a markdown link [@Name](#user_mention#user_id) inline, e.g. 'Hey [@Jane](#user_mention#81344), please review' — user_id MUST be a numeric ClickUp user id from clickup_resolve_assignees (the display name is resolved server-side).",
          "maxLength": 40000,
          "type": "string"
        },
        "entity_id": {
          "description": "ID of the entity to comment on.",
          "type": "string"
        },
        "entity_type": {
          "default": "task",
          "description": "Entity type to comment on. Use with entity_id.",
          "enum": [
            "task",
            "list",
            "view"
          ],
          "type": "string"
        },
        "notify_all": {
          "description": "Whether to notify all assignees. Default is false.",
          "type": "boolean"
        },
        "reply_to_id": {
          "description": "ID of a parent comment to reply to. When provided, the comment is posted as a threaded reply instead of a top-level comment.",
          "type": "string"
        },
        "workspace_id": {
          "description": "Workspace ID (digits only). Only needed when you have multiple workspaces.",
          "pattern": "^\\d+$",
          "type": "string"
        }
      },
      "required": [
        "comment_text"
      ],
      "type": "object"
    }
  },
  {
    "name": "clickup_create_document",
    "description": "Create a document in a ClickUp space, folder, or list. Requires name, parent info, visibility and create_page flag.",
    "inputSchema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "properties": {
        "create_page": {
          "description": "Whether to create an initial blank page",
          "type": "boolean"
        },
        "name": {
          "description": "Name and Title of the document",
          "type": "string"
        },
        "parent": {
          "description": "Parent container information",
          "properties": {
            "id": {
              "description": "ID of the parent container (space, folder, or list)",
              "type": "string"
            },
            "type": {
              "description": "Type of the parent container ('4'=space, '5'=folder, '6'=list, '7'=everything, '12'=workspace)",
              "enum": [
                "4",
                "5",
                "6",
                "7",
                "12"
              ],
              "type": "string"
            }
          },
          "required": [
            "id",
            "type"
          ],
          "type": "object"
        },
        "visibility": {
          "description": "Document visibility setting",
          "enum": [
            "PUBLIC",
            "PRIVATE",
            "PERSONAL",
            "HIDDEN"
          ],
          "type": "string"
        },
        "workspace_id": {
          "description": "Workspace ID (digits only). Only needed when you have multiple workspaces.",
          "pattern": "^\\d+$",
          "type": "string"
        }
      },
      "required": [
        "name",
        "parent",
        "visibility",
        "create_page"
      ],
      "type": "object"
    }
  },
  {
    "name": "clickup_create_document_page",
    "description": "Create a new page in a ClickUp document.",
    "inputSchema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "properties": {
        "content": {
          "description": "Content of the page",
          "type": "string"
        },
        "content_format": {
          "default": "text/md",
          "description": "The format of the page content",
          "enum": [
            "text/md",
            "text/plain"
          ],
          "type": "string"
        },
        "document_id": {
          "description": "ID of the document to create the page in (e.g. 'ad-909705'). In ClickUp doc URLs, the document_id is always the first ID after /docs/ or /v/dc/.",
          "type": "string"
        },
        "name": {
          "description": "Name and title of the page",
          "type": "string"
        },
        "parent_page_id": {
          "description": "ID of the parent page (if this is a sub-page)",
          "type": "string"
        },
        "sub_title": {
          "description": "Subtitle of the page",
          "type": "string"
        },
        "workspace_id": {
          "description": "Workspace ID (digits only). Only needed when you have multiple workspaces.",
          "pattern": "^\\d+$",
          "type": "string"
        }
      },
      "required": [
        "document_id",
        "content",
        "name"
      ],
      "type": "object"
    }
  },
  {
    "name": "clickup_create_folder",
    "description": "Create folder in ClickUp space. Use space_id (preferred) or space_name + folder name. Supports override_statuses for folder-specific statuses. Use clickup_create_list_in_folder to add lists after creation.",
    "inputSchema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "properties": {
        "name": {
          "description": "Name of the folder.",
          "type": "string"
        },
        "override_statuses": {
          "description": "Whether to override space statuses with folder-specific statuses.",
          "type": "boolean"
        },
        "space_id": {
          "description": "ID of the space to create the folder in (preferred). Provide this instead of space_name if you already have it.",
          "type": "string"
        },
        "space_name": {
          "description": "Name of the space to create the folder in. Use this when space_id is not available.",
          "type": "string"
        },
        "workspace_id": {
          "description": "Workspace ID (digits only). Only needed when you have multiple workspaces.",
          "pattern": "^\\d+$",
          "type": "string"
        }
      },
      "required": [
        "name"
      ],
      "type": "object"
    }
  },
  {
    "name": "clickup_create_list",
    "description": "Create a list in a ClickUp space. Requires name and space_name or space_id. For lists in folders, use clickup_create_list_in_folder.",
    "inputSchema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "properties": {
        "assignee": {
          "description": "User ID to assign the list to. Use clickup_resolve_assignees to convert email, username, or \"me\" to user ID if needed.",
          "type": "number"
        },
        "content": {
          "description": "Description or content of the list.",
          "type": "string"
        },
        "due_date": {
          "description": "Due date in YYYY-MM-DD format or date-time in YYYY-MM-DD HH:MM format",
          "pattern": "^\\d{4}-\\d{2}-\\d{2}( \\d{2}:\\d{2})?$",
          "type": "string"
        },
        "name": {
          "description": "Name of the list.",
          "type": "string"
        },
        "priority": {
          "description": "Priority value: 'urgent', 'high', 'normal', or 'low'.",
          "enum": [
            "urgent",
            "high",
            "normal",
            "low"
          ],
          "type": "string"
        },
        "space_id": {
          "description": "ID of the space to create the list in. Provide this instead of space_name if you already have the ID.",
          "type": "string"
        },
        "space_name": {
          "description": "Name of the space to create the list in. Alternative to space_id; one of them must be provided.",
          "type": "string"
        },
        "status": {
          "description": "Status of the list.",
          "type": "string"
        },
        "workspace_id": {
          "description": "Workspace ID (digits only). Only needed when you have multiple workspaces.",
          "pattern": "^\\d+$",
          "type": "string"
        }
      },
      "required": [
        "name"
      ],
      "type": "object"
    }
  },
  {
    "name": "clickup_create_list_in_folder",
    "description": "Create a list in a ClickUp folder. Requires folder_id and list name. Supports content and status. If you need to get a folder ID from a folder name, use clickup_get_folder first.",
    "inputSchema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "properties": {
        "content": {
          "description": "Description or content of the list.",
          "type": "string"
        },
        "folder_id": {
          "description": "ID of the folder to create the list in.",
          "type": "string"
        },
        "name": {
          "description": "Name of the list.",
          "type": "string"
        },
        "status": {
          "description": "Status of the list (uses folder default if not specified).",
          "type": "string"
        },
        "workspace_id": {
          "description": "Workspace ID (digits only). Only needed when you have multiple workspaces.",
          "pattern": "^\\d+$",
          "type": "string"
        }
      },
      "required": [
        "name",
        "folder_id"
      ],
      "type": "object"
    }
  },
  {
    "name": "clickup_create_reminder",
    "description": "Create a personal reminder in your ClickUp workspace. Requires title and due_date (YYYY-MM-DD or YYYY-MM-DD HH:MM format, uses your timezone).",
    "inputSchema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "properties": {
        "description": {
          "description": "Optional description with additional details for the reminder.",
          "type": "string"
        },
        "due_date": {
          "description": "Due date in YYYY-MM-DD format or date-time in YYYY-MM-DD HH:MM format (e.g., '2025-12-31' or '2025-12-31 14:30'). Uses your user timezone.",
          "pattern": "^\\d{4}-\\d{2}-\\d{2}( \\d{2}:\\d{2})?$",
          "type": "string"
        },
        "title": {
          "description": "Title for the reminder. Ask the user what they want to be reminded about.",
          "type": "string"
        },
        "workspace_id": {
          "description": "Workspace ID (digits only). Only needed when you have multiple workspaces.",
          "pattern": "^\\d+$",
          "type": "string"
        }
      },
      "required": [
        "title",
        "due_date"
      ],
      "type": "object"
    }
  },
  {
    "name": "clickup_create_task",
    "description": "Create a task in a ClickUp list. Requires name and list_id — always ask the user which list. Supports assignees (user IDs, emails, usernames, or \"me\") and task_type by name.",
    "inputSchema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "properties": {
        "assignees": {
          "description": "Array of assignee user IDs. Use clickup_resolve_assignees to convert emails, usernames, or \"me\" to user IDs if needed.",
          "items": {
            "type": "string"
          },
          "type": "array"
        },
        "check_required_custom_fields": {
          "description": "Flag to check if all required custom fields are set before saving the task.",
          "type": "boolean"
        },
        "custom_fields": {
          "description": "Array of custom field values to set on the task. Each object must have an 'id' and 'value' property.",
          "items": {
            "properties": {
              "id": {
                "description": "ID of the custom field",
                "type": "string"
              },
              "value": {
                "description": "Value for the custom field. Pass as a string — the format depends on the field type: text/url/email: the value directly. phone: must be a valid phone number in international format (e.g. '+1 234 567 8901'). dropdown: the option UUID. number/money/rating: the number as a string (e.g. '42'). date: a date string in YYYY-MM-DD or YYYY-MM-DD HH:MM format (auto-converted to timestamp). checkbox/button: 'true' or 'false'. labels: JSON array of UUIDs (e.g. '[\"uuid1\",\"uuid2\"]'). relationships/people/files: JSON with add/rem arrays (e.g. '{\"add\":[\"id1\"],\"rem\":[\"id2\"]}'). progress: JSON with current value (e.g. '{\"current\":50}'). location: JSON with location object (e.g. '{\"location\":{\"lat\":-28,\"lng\":153},\"formatted_address\":\"...\"}').",
                "type": "string"
              }
            },
            "required": [
              "id",
              "value"
            ],
            "type": "object"
          },
          "type": "array"
        },
        "due_date": {
          "description": "Due date in YYYY-MM-DD or YYYY-MM-DD HH:MM format",
          "pattern": "^\\d{4}-\\d{2}-\\d{2}( \\d{2}:\\d{2})?$",
          "type": "string"
        },
        "list_id": {
          "description": "List ID. Use clickup_get_list to resolve names.",
          "type": "string"
        },
        "markdown_description": {
          "description": "Task description in markdown format.",
          "type": "string"
        },
        "name": {
          "description": "Task name. Ask the user what they want to name the task.",
          "type": "string"
        },
        "parent": {
          "description": "Parent task ID to create as subtask.",
          "type": "string"
        },
        "priority": {
          "enum": [
            "urgent",
            "high",
            "normal",
            "low"
          ],
          "type": "string"
        },
        "start_date": {
          "description": "Start date in YYYY-MM-DD or YYYY-MM-DD HH:MM format",
          "pattern": "^\\d{4}-\\d{2}-\\d{2}( \\d{2}:\\d{2})?$",
          "type": "string"
        },
        "status": {
          "description": "Override default status. Omit to use list defaults.",
          "type": "string"
        },
        "tags": {
          "description": "Tag names (must already exist in the space).",
          "items": {
            "type": "string"
          },
          "type": "array"
        },
        "task_type": {
          "description": "Name of the task type (e.g., 'Bug', 'Feature', 'Milestone'). The type must exist in the workspace. If not specified, the default task type will be used.",
          "type": "string"
        },
        "time_estimate": {
          "description": "Time estimate in minutes (e.g., '150' for 2h 30m).",
          "type": "string"
        },
        "workspace_id": {
          "description": "Workspace ID (digits only). Only needed when you have multiple workspaces.",
          "pattern": "^\\d+$",
          "type": "string"
        }
      },
      "required": [
        "name",
        "list_id"
      ],
      "type": "object"
    }
  },
  {
    "name": "clickup_create_task_comment",
    "description": "[DEPRECATED → clickup_create_comment] Legacy name for creating a task comment, kept for clients with stale tool listings. Prefer the replacement tool; it takes entity_id instead of task_id.",
    "inputSchema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "properties": {
        "assignee": {
          "description": "User ID to assign the comment to. Use clickup_resolve_assignees to convert email, username, or \"me\" to user ID if needed.",
          "type": "number"
        },
        "comment_text": {
          "description": "Comment content. Supports Markdown formatting.",
          "type": "string"
        },
        "notify_all": {
          "description": "Whether to notify all assignees. Default is false.",
          "type": "boolean"
        },
        "task_id": {
          "description": "Task ID (supports custom IDs like 'DEV-1234')",
          "type": "string"
        },
        "workspace_id": {
          "description": "Workspace ID (digits only). Only needed when you have multiple workspaces.",
          "pattern": "^\\d+$",
          "type": "string"
        }
      },
      "required": [
        "task_id",
        "comment_text"
      ],
      "type": "object"
    }
  },
  {
    "name": "clickup_delete_comment",
    "description": "Delete a comment by comment_id. This cannot be undone. Use clickup_get_task_comments or clickup_get_threaded_comments to find the comment ID.",
    "inputSchema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "properties": {
        "comment_id": {
          "description": "ID of the comment to delete. Use clickup_get_task_comments or clickup_get_threaded_comments to find the comment ID.",
          "minLength": 1,
          "type": "string"
        },
        "workspace_id": {
          "description": "Workspace ID (digits only). Only needed when you have multiple workspaces.",
          "pattern": "^\\d+$",
          "type": "string"
        }
      },
      "required": [
        "comment_id"
      ],
      "type": "object"
    }
  },
  {
    "name": "clickup_delete_task",
    "description": "Delete a task by task_id (supports custom IDs like 'DEV-1234'). Always confirm the task_id with the user before deleting.",
    "inputSchema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "properties": {
        "task_id": {
          "description": "Task ID to delete (supports custom IDs like 'DEV-1234')",
          "type": "string"
        },
        "workspace_id": {
          "description": "Workspace ID (digits only). Only needed when you have multiple workspaces.",
          "pattern": "^\\d+$",
          "type": "string"
        }
      },
      "required": [
        "task_id"
      ],
      "type": "object"
    }
  },
  {
    "name": "clickup_download_document_page_attachment",
    "description": "Download a ClickUp doc page attachment (get attachment IDs from clickup_list_document_page_attachments). Returns a short-lived download URL plus attachment metadata. IMPORTANT: the URL is short-lived and, on workspaces with private attachments enabled, single-use — it expires within ~5 minutes. Fetch it immediately and exactly once; do not preview, HEAD-request, retry, or store it. If a download fails or the URL expired, call this tool again for a fresh URL.",
    "inputSchema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "properties": {
        "attachment_id": {
          "description": "Attachment ID — the `id` field returned by clickup_list_document_page_attachments for the page.",
          "type": "string"
        },
        "page_id": {
          "description": "ID of the doc page (e.g. 'ad-2675877'). In ClickUp doc URLs, the page_id is the second ID after /docs/ or /v/dc/. Use list_document_pages to discover page IDs.",
          "type": "string"
        },
        "workspace_id": {
          "description": "Workspace ID (digits only). Only needed when you have multiple workspaces.",
          "pattern": "^\\d+$",
          "type": "string"
        }
      },
      "required": [
        "page_id",
        "attachment_id"
      ],
      "type": "object"
    }
  },
  {
    "name": "clickup_download_task_attachment",
    "description": "Download a ClickUp task attachment (get attachment IDs from clickup_get_task with include: [\"attachments\"]). Returns a short-lived download URL plus attachment metadata. IMPORTANT: the URL is short-lived and, on workspaces with private attachments enabled, single-use — it expires within ~5 minutes. Fetch it immediately and exactly once; do not preview, HEAD-request, retry, or store it. If a download fails or the URL expired, call this tool again for a fresh URL.",
    "inputSchema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "properties": {
        "attachment_id": {
          "description": "Attachment ID. List a task's attachments with clickup_get_task using include: [\"attachments\"].",
          "type": "string"
        },
        "task_id": {
          "description": "Task ID (supports custom IDs like 'DEV-1234')",
          "type": "string"
        },
        "workspace_id": {
          "description": "Workspace ID (digits only). Only needed when you have multiple workspaces.",
          "pattern": "^\\d+$",
          "type": "string"
        }
      },
      "required": [
        "task_id",
        "attachment_id"
      ],
      "type": "object"
    }
  },
  {
    "name": "clickup_execute_operator",
    "description": "Run one enabled Unified API operator (a `<model>.<operator>` pair) as the authenticated user, in the session workspace. The operator catalog is how this server exposes ClickUp operations beyond the dedicated clickup_* tools, and it grows over time: reach for it when no dedicated tool fits the request or when a request spans many objects (for example several tasks to change, create or read). Call clickup_get_operators first; it lists the enabled operators with each one's parameters and request-body schema, and only enabled operators are callable. Prefer a dedicated clickup_* tool when one covers the whole request in a single call. workspace_id is taken from the session and cannot be overridden. Operators that return full objects (creates and updates included) can produce very large results: pass query with the request to project only the fields you need. Errors carry the upstream status, operationId and response body. Do not retry a call that timed out: the operation may have completed.",
    "inputSchema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "properties": {
        "body": {
          "additionalProperties": {},
          "description": "Request body shaped per the schema shown by clickup_get_operators.",
          "propertyNames": {
            "type": "string"
          },
          "type": "object"
        },
        "model": {
          "description": "Lowercase model name from clickup_get_operators.",
          "type": "string"
        },
        "operation_id": {
          "description": "Underlying API operationId; only needed when clickup_get_operators lists several for the pair.",
          "type": "string"
        },
        "operator": {
          "description": "Operator from the canonical taxonomy, e.g. `get_many`, `update_many`. Only enabled pairs are accepted.",
          "enum": [
            "get",
            "list",
            "create",
            "update",
            "delete",
            "get_many",
            "list_children",
            "duplicate",
            "merge",
            "archive",
            "unarchive",
            "restore",
            "search",
            "move",
            "create_many",
            "update_many",
            "delete_many"
          ],
          "type": "string"
        },
        "parameters": {
          "additionalProperties": {},
          "description": "Path and query parameters keyed by the names shown by clickup_get_operators (e.g. `list_id`). workspace_id is filled in automatically.",
          "propertyNames": {
            "type": "string"
          },
          "type": "object"
        },
        "query": {
          "description": "Optional JMESPath expression applied to the response to return only what you need, e.g. `items[*].{id: id, name: name}`.",
          "type": "string"
        },
        "workspace_id": {
          "description": "Workspace ID (digits only). Only needed when you have multiple workspaces.",
          "pattern": "^\\d+$",
          "type": "string"
        }
      },
      "required": [
        "model",
        "operator"
      ],
      "type": "object"
    }
  },
  {
    "name": "clickup_filter_tasks",
    "description": "Retrieve tasks with combined filters (tags, lists, folders, spaces, statuses, assignees, due date range, completion date range, custom field values). Multiple values within a filter use OR logic; across filters, AND logic applies (custom_fields entries also AND together). Best for filtering tasks by structured field values. For text/keyword search across all workspace content, use search instead. Custom field filters need field IDs — discover them with clickup_get_custom_fields. Results are paginated at 100 tasks per page: the response includes has_more and next_page, and when has_more is true you MUST call again with page set to next_page (repeating until has_more is false) to retrieve every matching task — a single call is not guaranteed to be complete. Assignees must be numeric user IDs — use clickup_resolve_assignees to convert names/emails/\"me\". Date filters use YYYY-MM-DD. For a single task by ID, use clickup_get_task.",
    "inputSchema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "properties": {
        "assignees": {
          "description": "Filter by assignee user IDs. Multiple IDs use OR logic. Use clickup_resolve_assignees to convert names/emails/\"me\" first.",
          "items": {
            "type": "string"
          },
          "type": "array"
        },
        "custom_fields": {
          "description": "Filter by custom field values. Entries combine with AND (and with all other filters).",
          "items": {
            "properties": {
              "field_id": {
                "description": "Custom field ID. Discover fields with clickup_get_custom_fields — one unrecognized field_id makes the API silently drop ALL custom field filters in the call and return unfiltered results. Formula, location, button, votes, signature, rollup, progress, and app fields cannot be filtered at all (any operator errors).",
                "type": "string"
              },
              "operator": {
                "description": "On text fields '=' means contains and '==' exact match; on single-value non-text fields (number, money, date, rating, checkbox, dropdown) use '=' or '!=' (exact) — '==' and '!==' only work on text fields. <, <=, >, >=, RANGE order numbers/dates. Multi-value fields (labels, people, relationships) require ANY/ALL/NOT ANY/NOT ALL, with a non-empty JSON array value. IS NULL/IS NOT NULL match unset/set fields.",
                "enum": [
                  "=",
                  "==",
                  "<",
                  "<=",
                  ">",
                  ">=",
                  "!=",
                  "!==",
                  "IS NULL",
                  "IS NOT NULL",
                  "RANGE",
                  "ANY",
                  "ALL",
                  "NOT ANY",
                  "NOT ALL"
                ],
                "type": "string"
              },
              "value": {
                "description": "Filter value as a string. Omit for IS NULL/IS NOT NULL. Formats: text as-is; dropdown: option UUID, or the option's orderindex when the field's type_config.options is present (those legacy dropdowns store numeric values); number/money/rating: '42'; date: YYYY-MM-DD or YYYY-MM-DD HH:MM (auto-converted to a timestamp for <, <=, >, >=, RANGE; date-only values resolve to 00:00 in your timezone); RANGE: JSON array of two numbers/dates (e.g. '[1, 5]'); ANY/ALL/NOT ANY/NOT ALL: JSON array — labels: option UUIDs, people: numeric user IDs, task/list relationships: task IDs (e.g. '[\"uuid1\",\"uuid2\"]'). For = or != on Date fields pass a millisecond epoch; date strings auto-convert only for the ordering operators.",
                "type": "string"
              }
            },
            "required": [
              "field_id",
              "operator"
            ],
            "type": "object"
          },
          "type": "array"
        },
        "date_closed_from": {
          "description": "Filter tasks completed on or after. Format: YYYY-MM-DD",
          "pattern": "^\\d{4}-\\d{2}-\\d{2}( \\d{2}:\\d{2})?$",
          "type": "string"
        },
        "date_closed_to": {
          "description": "Filter tasks completed on or before. Format: YYYY-MM-DD",
          "pattern": "^\\d{4}-\\d{2}-\\d{2}( \\d{2}:\\d{2})?$",
          "type": "string"
        },
        "due_date_from": {
          "description": "Filter tasks with due date on or after. Format: YYYY-MM-DD",
          "pattern": "^\\d{4}-\\d{2}-\\d{2}( \\d{2}:\\d{2})?$",
          "type": "string"
        },
        "due_date_to": {
          "description": "Filter tasks with due date on or before. Format: YYYY-MM-DD",
          "pattern": "^\\d{4}-\\d{2}-\\d{2}( \\d{2}:\\d{2})?$",
          "type": "string"
        },
        "folder_ids": {
          "description": "Filter by Folder IDs. Multiple IDs use OR logic (matches tasks in ANY of the specified folders).",
          "items": {
            "type": "string"
          },
          "type": "array"
        },
        "include_closed": {
          "description": "Include closed tasks in results",
          "type": "boolean"
        },
        "list_ids": {
          "description": "Filter by List IDs. Multiple IDs use OR logic (matches tasks in ANY of the specified lists).",
          "items": {
            "type": "string"
          },
          "type": "array"
        },
        "order_by": {
          "description": "Sort results by field. Default direction is descending — newest first for created/updated. Set reverse: true for ascending (oldest first).",
          "enum": [
            "id",
            "created",
            "updated",
            "due_date"
          ],
          "type": "string"
        },
        "page": {
          "description": "0-indexed page number. Each page returns up to 100 tasks. When a response has has_more=true, request the next page using its next_page value, and keep going until has_more=false to retrieve every matching task.",
          "type": "number"
        },
        "reverse": {
          "description": "Sort ascending (oldest first) instead of the default descending (newest first). Leave unset/false to get the most recently created/updated tasks first.",
          "type": "boolean"
        },
        "space_ids": {
          "description": "Filter by Space IDs. Multiple IDs use OR logic (matches tasks in ANY of the specified spaces).",
          "items": {
            "type": "string"
          },
          "type": "array"
        },
        "statuses": {
          "description": "Filter by task status names. Multiple statuses use OR logic (matches tasks with ANY of the specified statuses).",
          "items": {
            "type": "string"
          },
          "type": "array"
        },
        "subtasks": {
          "default": true,
          "description": "Include subtasks in results (default: true)",
          "type": "boolean"
        },
        "tags": {
          "description": "Filter by tag names. Multiple tags use OR logic (matches tasks with ANY of the specified tags).",
          "items": {
            "type": "string"
          },
          "type": "array"
        },
        "workspace_id": {
          "description": "Workspace ID (digits only). Only needed when you have multiple workspaces.",
          "pattern": "^\\d+$",
          "type": "string"
        }
      },
      "type": "object"
    }
  },
  {
    "name": "clickup_find_member_by_name",
    "description": "Get a member in the ClickUp workspace by name or email. Returns the member object if found, or null if not found.",
    "inputSchema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "properties": {
        "name_or_email": {
          "description": "The name or email of the member to find.",
          "type": "string"
        },
        "workspace_id": {
          "description": "Workspace ID (digits only). Only needed when you have multiple workspaces.",
          "pattern": "^\\d+$",
          "type": "string"
        }
      },
      "required": [
        "name_or_email"
      ],
      "type": "object"
    }
  },
  {
    "name": "clickup_get_bulk_tasks_time_in_status",
    "description": "Get the time multiple tasks have spent in each status (bulk operation, up to 100 tasks). Returns a map of task IDs to their status history and current status time data. Requires the \"Total time in Status\" ClickApp to be enabled in the workspace.",
    "inputSchema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "properties": {
        "task_ids": {
          "description": "Array of task IDs to get time in status for (1-100 tasks). Works with both regular task IDs and custom IDs (like 'DEV-1234').",
          "items": {
            "type": "string"
          },
          "maxItems": 100,
          "minItems": 1,
          "type": "array"
        },
        "workspace_id": {
          "description": "Workspace ID (digits only). Only needed when you have multiple workspaces.",
          "pattern": "^\\d+$",
          "type": "string"
        }
      },
      "required": [
        "task_ids"
      ],
      "type": "object"
    }
  },
  {
    "name": "clickup_get_chat_channel_messages",
    "description": "Get messages for a chat channel. Messages with has_replies=true have threads fetchable via clickup_get_chat_message_replies. Supports pagination. Channel URLs look like /<ws>/v/cn/<channel_id> or /<ws>/chat/r/<channel_id>.",
    "inputSchema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "properties": {
        "channel_id": {
          "description": "ID of the chat channel to get messages from.",
          "type": "string"
        },
        "content_format": {
          "default": "text/plain",
          "description": "Response content format.",
          "enum": [
            "text/plain",
            "text/md"
          ],
          "type": "string"
        },
        "cursor": {
          "description": "Cursor for pagination. Use the next_cursor value from the previous response to fetch the next page of results.",
          "type": "string"
        },
        "limit": {
          "default": 100,
          "description": "Maximum number of messages to return (1-100).",
          "maximum": 100,
          "minimum": 1,
          "type": "number"
        },
        "workspace_id": {
          "description": "Workspace ID (digits only). Only needed when you have multiple workspaces.",
          "pattern": "^\\d+$",
          "type": "string"
        }
      },
      "required": [
        "channel_id"
      ],
      "type": "object"
    }
  },
  {
    "name": "clickup_get_chat_channels",
    "description": "List chat channels in the workspace with pagination support.",
    "inputSchema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "properties": {
        "cursor": {
          "description": "Cursor for pagination. Use the next_cursor value from the previous response to fetch the next page of results.",
          "type": "string"
        },
        "limit": {
          "default": 100,
          "description": "Maximum number of channels to return (1-100).",
          "maximum": 100,
          "minimum": 1,
          "type": "number"
        },
        "workspace_id": {
          "description": "Workspace ID (digits only). Only needed when you have multiple workspaces.",
          "pattern": "^\\d+$",
          "type": "string"
        }
      },
      "type": "object"
    }
  },
  {
    "name": "clickup_get_chat_message_replies",
    "description": "Get threaded replies for a chat message by message_id. Supports pagination. Chat thread URLs (/<ws>/v/cn/<channel_id>/t/<id> or /<ws>/chat/r/<channel_id>/t/<id>) end in a chat message id — pass it here, not to clickup_get_task. That id is usually the thread root but can be a reply inside the thread; if no replies come back, find the thread root via clickup_get_chat_channel_messages on the channel.",
    "inputSchema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "properties": {
        "content_format": {
          "default": "text/plain",
          "description": "Response content format.",
          "enum": [
            "text/plain",
            "text/md"
          ],
          "type": "string"
        },
        "cursor": {
          "description": "Cursor for pagination. Use the next_cursor value from the previous response to fetch the next page of results.",
          "type": "string"
        },
        "limit": {
          "default": 100,
          "description": "Maximum number of replies to return (1-100).",
          "maximum": 100,
          "minimum": 1,
          "type": "number"
        },
        "message_id": {
          "description": "ID of the chat message to get replies from.",
          "type": "string"
        },
        "workspace_id": {
          "description": "Workspace ID (digits only). Only needed when you have multiple workspaces.",
          "pattern": "^\\d+$",
          "type": "string"
        }
      },
      "required": [
        "message_id"
      ],
      "type": "object"
    }
  },
  {
    "name": "clickup_get_current_time_entry",
    "description": "Get the currently running time entry, if any. No parameters needed.",
    "inputSchema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "properties": {
        "workspace_id": {
          "description": "Workspace ID (digits only). Only needed when you have multiple workspaces.",
          "pattern": "^\\d+$",
          "type": "string"
        }
      },
      "type": "object"
    }
  },
  {
    "name": "clickup_get_custom_fields",
    "description": "Get custom field definitions at any hierarchy level (list, folder, space, or workspace). Returns field IDs, types, and options for dropdowns/labels. Use this to discover available custom fields before setting values on tasks. Multiple scopes can be queried in a single call.",
    "inputSchema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "properties": {
        "folder_id": {
          "description": "Folder ID. Returns custom fields defined on this folder.",
          "minLength": 1,
          "type": "string"
        },
        "include_workspace": {
          "description": "If true, returns workspace-level custom fields.",
          "type": "boolean"
        },
        "list_id": {
          "description": "List ID. Returns custom fields defined on this list.",
          "minLength": 1,
          "type": "string"
        },
        "space_id": {
          "description": "Space ID. Returns custom fields defined on this space.",
          "minLength": 1,
          "type": "string"
        },
        "workspace_id": {
          "description": "Workspace ID (digits only). Only needed when you have multiple workspaces.",
          "pattern": "^\\d+$",
          "type": "string"
        }
      },
      "type": "object"
    }
  },
  {
    "name": "clickup_get_document_pages",
    "description": "Get the full content of specific pages by page ID. Use list_document_pages first to discover available page IDs.",
    "inputSchema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "properties": {
        "content_format": {
          "default": "text/plain",
          "description": "Response content format.",
          "enum": [
            "text/plain",
            "text/md"
          ],
          "type": "string"
        },
        "document_id": {
          "description": "ID of the document (e.g. 'ad-909705'). In ClickUp doc URLs the path is either /{workspace_id}/docs/{document_id}/{page_id} or /{workspace_id}/v/dc/{document_id}/{page_id}. The document_id is always the first ID after /docs/ or /v/dc/.",
          "type": "string"
        },
        "page_ids": {
          "description": "Array of page IDs to retrieve (e.g. ['ad-2675877']). In ClickUp doc URLs, the page_id is the second ID after /docs/ or /v/dc/. If the URL contains only one ID (e.g. /{workspace_id}/docs/{document_id}), that is the document_id — use list_document_pages to discover page IDs.",
          "items": {
            "type": "string"
          },
          "type": "array"
        },
        "workspace_id": {
          "description": "Workspace ID (digits only). Only needed when you have multiple workspaces.",
          "pattern": "^\\d+$",
          "type": "string"
        }
      },
      "required": [
        "document_id",
        "page_ids"
      ],
      "type": "object"
    }
  },
  {
    "name": "clickup_get_folder",
    "description": "Get folder details by folder_id or folder_name (+ space info). Use to resolve folder names to IDs.",
    "inputSchema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "properties": {
        "folder_id": {
          "description": "ID of the folder to retrieve.",
          "type": "string"
        },
        "folder_name": {
          "description": "Name of the folder to retrieve. When using this, you must also provide space_id or space_name.",
          "type": "string"
        },
        "space_id": {
          "description": "ID of the space containing the folder (required with folder_name).",
          "type": "string"
        },
        "space_name": {
          "description": "Name of the space containing the folder (required with folder_name).",
          "type": "string"
        },
        "workspace_id": {
          "description": "Workspace ID (digits only). Only needed when you have multiple workspaces.",
          "pattern": "^\\d+$",
          "type": "string"
        }
      },
      "type": "object"
    }
  },
  {
    "name": "clickup_get_list",
    "description": "Get list details by list_id or list_name. Returns id, name, content, space info, and configured statuses. Use to resolve list names to IDs.",
    "inputSchema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "properties": {
        "list_id": {
          "description": "ID of the list to retrieve.",
          "type": "string"
        },
        "list_name": {
          "description": "Name of the list to retrieve. The tool will search for a list with this name.",
          "type": "string"
        },
        "workspace_id": {
          "description": "Workspace ID (digits only). Only needed when you have multiple workspaces.",
          "pattern": "^\\d+$",
          "type": "string"
        }
      },
      "type": "object"
    }
  },
  {
    "name": "clickup_get_operators",
    "description": "Lists the Unified API operators enabled on this server (`<model>.<operator>` pairs) with each one's HTTP route, parameters and request/response body schema, as Markdown. The catalog is how this server exposes ClickUp operations beyond the dedicated clickup_* tools, and it grows over time: call this whenever no dedicated tool fits the request, whenever a request spans many objects, and always before clickup_execute_operator to build a correct call. It is also the only reliable answer to what this server can do: answer any question about its capabilities by calling it, never from tool names or descriptions. Operators that are not enabled are never shown.",
    "inputSchema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "properties": {
        "model_operators": {
          "description": "Restrict the output to these `<model>.<operator>` pairs.",
          "items": {
            "type": "string"
          },
          "type": "array"
        },
        "models": {
          "description": "Restrict the output to every enabled operator of these models.",
          "items": {
            "type": "string"
          },
          "type": "array"
        },
        "workspace_id": {
          "description": "Workspace ID (digits only). Only needed when you have multiple workspaces.",
          "pattern": "^\\d+$",
          "type": "string"
        }
      },
      "type": "object"
    }
  },
  {
    "name": "clickup_get_schema",
    "description": "Returns the entity-relationship schema (Markdown with a Mermaid ER diagram) for the models behind the enabled Unified API operators. Optional background before a clickup_execute_operator call; not needed for the dedicated clickup_* tools.",
    "inputSchema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "properties": {
        "detailed": {
          "description": "Include the long-form description of each entity and relationship instead of the one-line summary.",
          "type": "boolean"
        },
        "entities_only": {
          "description": "Return only the entity list — no relationships, no diagram.",
          "type": "boolean"
        },
        "names": {
          "description": "Restrict the output to these entity names (lowercase). Only enabled models are returned.",
          "items": {
            "type": "string"
          },
          "type": "array"
        },
        "tier": {
          "description": "Minimum importance tier to include: `primary` (overview), `secondary`, or `attribute` (everything, the default).",
          "enum": [
            "primary",
            "secondary",
            "attribute"
          ],
          "type": "string"
        },
        "workspace_id": {
          "description": "Workspace ID (digits only). Only needed when you have multiple workspaces.",
          "pattern": "^\\d+$",
          "type": "string"
        }
      },
      "type": "object"
    }
  },
  {
    "name": "clickup_get_task",
    "description": "Retrieve a ClickUp task by ID (supports custom IDs like 'DEV-1234'). Returns a compact summary by default — core fields are always included, large sections appear as counts only (e.g. custom_fields_count: 3). Use include to fetch full data for specific sections: include: [\"custom_fields\", \"description\"]. Set expand_statuses=true to list valid statuses for update_task. URL disambiguation: a bare /t/<id> or /t/<workspace>/<id> ClickUp URL is a task, but in chat thread URLs (/v/cn/<channel_id>/t/<id> or /chat/r/<channel_id>/t/<id>) the trailing id is a chat MESSAGE id — use clickup_get_chat_message_replies for those.",
    "inputSchema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "properties": {
        "expand_statuses": {
          "description": "When true, returns the full set of statuses configured on the task's list (including any inherited from the parent folder or space) under `available_statuses`. Use to discover which status values can be assigned via update_task. Off by default to keep responses lean.",
          "type": "boolean"
        },
        "include": {
          "description": "Sections to return in full. Without this, large sections appear as counts (e.g. custom_fields_count: 3). Available: attachments (metadata only — id, title, extension, mimetype, size, date, source; use clickup_download_task_attachment to get a download URL), checklists (items + completion), custom_fields (field values), dependencies (blocking/waiting-on relationships), description (full text — summary truncates at 10k chars), linked_tasks (linked task IDs), subtasks (triggers subtask fetch from API), watchers (watching users).",
          "items": {
            "enum": [
              "attachments",
              "checklists",
              "custom_fields",
              "dependencies",
              "description",
              "linked_tasks",
              "subtasks",
              "watchers"
            ],
            "type": "string"
          },
          "type": "array"
        },
        "task_id": {
          "description": "Task ID (supports custom IDs like 'DEV-1234')",
          "type": "string"
        },
        "workspace_id": {
          "description": "Workspace ID (digits only). Only needed when you have multiple workspaces.",
          "pattern": "^\\d+$",
          "type": "string"
        }
      },
      "required": [
        "task_id"
      ],
      "type": "object"
    }
  },
  {
    "name": "clickup_get_task_comments",
    "description": "Get task comments with reply_count per comment. Use clickup_get_threaded_comments for replies when reply_count > 0. Supports pagination via start/start_id.",
    "inputSchema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "properties": {
        "start": {
          "description": "Timestamp (in milliseconds) to start retrieving comments from. Used for pagination.",
          "type": "number"
        },
        "start_id": {
          "description": "Comment ID to start from. Used together with start for pagination.",
          "type": "string"
        },
        "task_id": {
          "description": "Task ID (supports custom IDs like 'DEV-1234')",
          "type": "string"
        },
        "workspace_id": {
          "description": "Workspace ID (digits only). Only needed when you have multiple workspaces.",
          "pattern": "^\\d+$",
          "type": "string"
        }
      },
      "required": [
        "task_id"
      ],
      "type": "object"
    }
  },
  {
    "name": "clickup_get_task_time_in_status",
    "description": "Get the time a task has spent in each status. Returns the current status with elapsed time and the full status history with time spent in each status. Requires the \"Total time in Status\" ClickApp to be enabled in the workspace.",
    "inputSchema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "properties": {
        "task_id": {
          "description": "ID of task. Works with both regular task IDs and custom IDs (like 'DEV-1234'). Use clickup_search to find task ID by name if needed.",
          "type": "string"
        },
        "workspace_id": {
          "description": "Workspace ID (digits only). Only needed when you have multiple workspaces.",
          "pattern": "^\\d+$",
          "type": "string"
        }
      },
      "required": [
        "task_id"
      ],
      "type": "object"
    }
  },
  {
    "name": "clickup_get_threaded_comments",
    "description": "Get threaded replies for a comment by comment_id. Use clickup_get_task_comments first to find comments with reply_count > 0.",
    "inputSchema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "properties": {
        "comment_id": {
          "description": "ID of the parent comment to get threaded replies for.",
          "type": "string"
        },
        "workspace_id": {
          "description": "Workspace ID (digits only). Only needed when you have multiple workspaces.",
          "pattern": "^\\d+$",
          "type": "string"
        }
      },
      "required": [
        "comment_id"
      ],
      "type": "object"
    }
  },
  {
    "name": "clickup_get_time_entries",
    "description": "Get time entries with optional filtering by task, date range, assignee, and billable status. Pass task_id to scope to a single task, or omit for workspace-wide results. IMPORTANT: without assignee, only the authenticated user's entries are returned — pass 'any' to get all users' entries, or specific user IDs (comma-separated) for targeted queries.",
    "inputSchema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "properties": {
        "assignee": {
          "description": "Filter by assignee user IDs. Pass numeric user IDs (e.g. ['123', '456']) or include 'any' to get ALL users' entries. IMPORTANT: when omitted, the API returns only the authenticated user's entries. Use get_workspace_members to look up user IDs.",
          "items": {
            "type": "string"
          },
          "type": "array"
        },
        "end_date": {
          "description": "End date in YYYY-MM-DD format or date-time in YYYY-MM-DD HH:MM format",
          "pattern": "^\\d{4}-\\d{2}-\\d{2}( \\d{2}:\\d{2})?$",
          "type": "string"
        },
        "is_billable": {
          "description": "Filter by billable status. Set to true for only billable entries, false for non-billable. Omit to get all entries.",
          "type": "boolean"
        },
        "start_date": {
          "description": "Start date in YYYY-MM-DD format or date-time in YYYY-MM-DD HH:MM format",
          "pattern": "^\\d{4}-\\d{2}-\\d{2}( \\d{2}:\\d{2})?$",
          "type": "string"
        },
        "task_id": {
          "description": "Task ID to scope entries to (supports custom IDs like 'DEV-1234'). Omit to query workspace-wide.",
          "type": "string"
        },
        "workspace_id": {
          "description": "Workspace ID (digits only). Only needed when you have multiple workspaces.",
          "pattern": "^\\d+$",
          "type": "string"
        }
      },
      "type": "object"
    }
  },
  {
    "name": "clickup_get_workspace_hierarchy",
    "description": "Get workspace hierarchy (spaces, folders, lists) with pagination and depth control. Use only when you need the workspace structure — most tools resolve names automatically.",
    "inputSchema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "properties": {
        "cursor": {
          "description": "Pagination cursor from previous response. Use to fetch next page of spaces",
          "type": "string"
        },
        "limit": {
          "description": "Maximum number of spaces to return per page (default: 10, max: 50)",
          "maximum": 50,
          "minimum": 1,
          "type": "number"
        },
        "max_depth": {
          "description": "Maximum depth of hierarchy to return: 0=spaces only, 1=spaces+folders, 2=spaces+folders+lists (default: 2)",
          "enum": [
            "0",
            "1",
            "2"
          ],
          "type": "string"
        },
        "space_ids": {
          "description": "Filter to return only specific spaces by ID.",
          "items": {
            "type": "string"
          },
          "type": "array"
        },
        "workspace_id": {
          "description": "Workspace ID (digits only). Only needed when you have multiple workspaces.",
          "pattern": "^\\d+$",
          "type": "string"
        }
      },
      "type": "object"
    }
  },
  {
    "name": "clickup_get_workspace_members",
    "description": "List all members in the workspace. Most tools resolve assignees automatically — use only when you need the full member list.",
    "inputSchema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "properties": {
        "workspace_id": {
          "description": "Workspace ID (digits only). Only needed when you have multiple workspaces.",
          "pattern": "^\\d+$",
          "type": "string"
        }
      },
      "type": "object"
    }
  },
  {
    "name": "clickup_list_document_page_attachments",
    "description": "List metadata for files attached to a ClickUp doc page (images and files embedded in the page content).",
    "inputSchema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "properties": {
        "cursor": {
          "description": "Cursor from a previous response to fetch the next page of results.",
          "type": "string"
        },
        "limit": {
          "description": "Maximum number of attachments to return (1-100, default 50).",
          "maximum": 100,
          "minimum": 1,
          "type": "integer"
        },
        "page_id": {
          "description": "ID of the doc page (e.g. 'ad-2675877'). In ClickUp doc URLs, the page_id is the second ID after /docs/ or /v/dc/. Use list_document_pages to discover page IDs.",
          "type": "string"
        },
        "workspace_id": {
          "description": "Workspace ID (digits only). Only needed when you have multiple workspaces.",
          "pattern": "^\\d+$",
          "type": "string"
        }
      },
      "required": [
        "page_id"
      ],
      "type": "object"
    }
  },
  {
    "name": "clickup_list_document_pages",
    "description": "List page names and structure of a document (no content). Use get_document_pages to fetch full page content by page ID.",
    "inputSchema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "properties": {
        "document_id": {
          "description": "ID of the document (e.g. 'ad-909705'). In ClickUp doc URLs the path is either /{workspace_id}/docs/{document_id} or /{workspace_id}/v/dc/{document_id}. The document_id is always the first ID after /docs/ or /v/dc/.",
          "type": "string"
        },
        "max_page_depth": {
          "description": "Maximum depth of pages to retrieve (-1 for unlimited)",
          "type": "number"
        },
        "workspace_id": {
          "description": "Workspace ID (digits only). Only needed when you have multiple workspaces.",
          "pattern": "^\\d+$",
          "type": "string"
        }
      },
      "required": [
        "document_id"
      ],
      "type": "object"
    }
  },
  {
    "name": "clickup_merge_tasks",
    "description": "Merge one or more source tasks into a target task. The target task survives and absorbs content from the source tasks, which are consumed. Destination field values take precedence on conflicts. Works with both regular task IDs and custom IDs (like 'DEV-1234').",
    "inputSchema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "properties": {
        "source_task_ids": {
          "description": "Array of task IDs to merge into the target task. These tasks will be consumed/deleted after merging. Works with both regular task IDs and custom IDs (like 'DEV-1234').",
          "items": {
            "type": "string"
          },
          "minItems": 1,
          "type": "array"
        },
        "task_id": {
          "description": "ID of the target/destination task that will survive the merge. Source tasks will be merged into this task. Works with both regular task IDs and custom IDs (like 'DEV-1234').",
          "type": "string"
        },
        "workspace_id": {
          "description": "Workspace ID (digits only). Only needed when you have multiple workspaces.",
          "pattern": "^\\d+$",
          "type": "string"
        }
      },
      "required": [
        "task_id",
        "source_task_ids"
      ],
      "type": "object"
    }
  },
  {
    "name": "clickup_move_task",
    "description": "Move a task to a new home list. Requires task_id and list_id (supports custom IDs). Use clickup_get_list to resolve list names.",
    "inputSchema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "properties": {
        "list_id": {
          "description": "ID of the destination list to move the task into. Use clickup_get_list to find the list ID from a list name if needed.",
          "type": "string"
        },
        "task_id": {
          "description": "ID of the task to move. Works with regular and custom IDs (like 'DEV-1234'). Use clickup_search to find task ID by name if needed.",
          "type": "string"
        },
        "workspace_id": {
          "description": "Workspace ID (digits only). Only needed when you have multiple workspaces.",
          "pattern": "^\\d+$",
          "type": "string"
        }
      },
      "required": [
        "task_id",
        "list_id"
      ],
      "type": "object"
    }
  },
  {
    "name": "clickup_remove_tag_from_task",
    "description": "Remove tag from task. Only removes tag-task association, tag remains in space.",
    "inputSchema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "properties": {
        "tag_name": {
          "description": "Name of the tag to remove from the task.",
          "type": "string"
        },
        "task_id": {
          "description": "ID of task. Works with both regular task IDs and custom IDs (like 'DEV-1234'). Use clickup_search to find task ID by name if needed.",
          "type": "string"
        },
        "workspace_id": {
          "description": "Workspace ID (digits only). Only needed when you have multiple workspaces.",
          "pattern": "^\\d+$",
          "type": "string"
        }
      },
      "required": [
        "task_id",
        "tag_name"
      ],
      "type": "object"
    }
  },
  {
    "name": "clickup_remove_task_dependency",
    "description": "Remove a dependency between two tasks.",
    "inputSchema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "properties": {
        "depends_on": {
          "description": "ID of the task that was in the dependency relationship. Works with both regular task IDs and custom IDs (like 'DEV-1234').",
          "type": "string"
        },
        "task_id": {
          "description": "ID of the task to remove the dependency from. Works with both regular task IDs and custom IDs (like 'DEV-1234'). Use clickup_search to find task ID by name if needed.",
          "type": "string"
        },
        "type": {
          "description": "Type of dependency to remove: 'waiting_on' or 'blocking'.",
          "enum": [
            "waiting_on",
            "blocking"
          ],
          "type": "string"
        },
        "workspace_id": {
          "description": "Workspace ID (digits only). Only needed when you have multiple workspaces.",
          "pattern": "^\\d+$",
          "type": "string"
        }
      },
      "required": [
        "task_id",
        "depends_on",
        "type"
      ],
      "type": "object"
    }
  },
  {
    "name": "clickup_remove_task_from_list",
    "description": "Remove a task from an additional list (cannot remove from home list). Requires the Tasks in Multiple Lists ClickApp to be enabled.",
    "inputSchema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "properties": {
        "list_id": {
          "description": "ID of the additional list to remove the task from. Use clickup_get_list to find the list ID from a list name if needed.",
          "type": "string"
        },
        "task_id": {
          "description": "ID of the task to remove from the additional list. Works with regular and custom IDs (like 'DEV-1234'). Note: a task cannot be removed from its home list.",
          "type": "string"
        },
        "workspace_id": {
          "description": "Workspace ID (digits only). Only needed when you have multiple workspaces.",
          "pattern": "^\\d+$",
          "type": "string"
        }
      },
      "required": [
        "task_id",
        "list_id"
      ],
      "type": "object"
    }
  },
  {
    "name": "clickup_remove_task_link",
    "description": "Remove a link between two tasks.",
    "inputSchema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "properties": {
        "links_to": {
          "description": "ID of the task that was linked to. Works with both regular task IDs and custom IDs (like 'DEV-1234').",
          "type": "string"
        },
        "task_id": {
          "description": "ID of the task to remove the link from. Works with both regular task IDs and custom IDs (like 'DEV-1234'). Use clickup_search to find task ID by name if needed.",
          "type": "string"
        },
        "workspace_id": {
          "description": "Workspace ID (digits only). Only needed when you have multiple workspaces.",
          "pattern": "^\\d+$",
          "type": "string"
        }
      },
      "required": [
        "task_id",
        "links_to"
      ],
      "type": "object"
    }
  },
  {
    "name": "clickup_request_attachment_upload",
    "description": "Get short-lived, structured upload details (upload URL, ticket, HTTP method, and multipart field name) to attach a LOCAL file (any size) to a task; follow the returned instructions to upload it with a native HTTP client. For small base64 payloads or web URLs, use attach_task_file instead.",
    "inputSchema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "properties": {
        "file_name": {
          "description": "Optional file name override (include the extension). Defaults to the local file's own name.",
          "type": "string"
        },
        "task_id": {
          "description": "Task ID (supports custom IDs like 'DEV-1234')",
          "type": "string"
        },
        "workspace_id": {
          "description": "Workspace ID (digits only). Only needed when you have multiple workspaces.",
          "pattern": "^\\d+$",
          "type": "string"
        }
      },
      "required": [
        "task_id"
      ],
      "type": "object"
    }
  },
  {
    "name": "clickup_resolve_assignees",
    "description": "Convert names, emails, or \"me\" to numeric ClickUp user IDs. Use when you need IDs for filters (e.g., search, filter_tasks). Most task tools resolve assignees automatically.",
    "inputSchema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "properties": {
        "assignees": {
          "description": "Array of assignee names, emails, or \"me\" to resolve. Use \"me\" to refer to the currently authenticated user.",
          "items": {
            "type": "string"
          },
          "type": "array"
        },
        "workspace_id": {
          "description": "Workspace ID (digits only). Only needed when you have multiple workspaces.",
          "pattern": "^\\d+$",
          "type": "string"
        }
      },
      "required": [
        "assignees"
      ],
      "type": "object"
    }
  },
  {
    "name": "clickup_search",
    "description": "Search across all workspace content (tasks, docs, dashboards, attachments, whiteboards, chats, forms). Best for keyword/text matching across all content types. For filtering tasks by field values (status, priority, tags, dates), use filter_tasks instead. Supports filtering by assignees, creators, status, location, asset types, and date ranges. Date filters use YYYY-MM-DD or YYYY-MM-DD HH:MM format in your timezone. Results are paginated: the response includes next_cursor whenever more results exist. When next_cursor is present you MUST call search again with that value in the cursor field (repeating until next_cursor is absent) to retrieve every match — a single call is not guaranteed to be complete.",
    "inputSchema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "properties": {
        "count": {
          "description": "Maximum number of results to return per page (for pagination)",
          "type": "number"
        },
        "cursor": {
          "description": "Pagination cursor from previous response. Use to fetch next page of results",
          "type": "string"
        },
        "filters": {
          "description": "Filters to refine search results by various criteria",
          "properties": {
            "asset_types": {
              "description": "Filter by asset types (task, doc, whiteboard, dashboard, attachment, or chat)",
              "items": {
                "description": "Type of ClickUp asset to search for",
                "enum": [
                  "task",
                  "doc",
                  "whiteboard",
                  "dashboard",
                  "attachment",
                  "chat"
                ],
                "type": "string"
              },
              "type": "array"
            },
            "assignees": {
              "description": "Numeric user IDs. Use clickup_resolve_assignees to convert names/emails/\"me\".",
              "items": {
                "type": "string"
              },
              "type": "array"
            },
            "created_date_from": {
              "description": "Filter items created on or after this date. Format: YYYY-MM-DD or YYYY-MM-DD HH:MM (e.g., \"2025-01-01\" or \"2025-01-01 09:00\")",
              "pattern": "^\\d{4}-\\d{2}-\\d{2}( \\d{2}:\\d{2})?$",
              "type": "string"
            },
            "created_date_to": {
              "description": "Filter items created on or before this date. Format: YYYY-MM-DD or YYYY-MM-DD HH:MM (e.g., \"2025-12-31\" or \"2025-12-31 23:59\")",
              "pattern": "^\\d{4}-\\d{2}-\\d{2}( \\d{2}:\\d{2})?$",
              "type": "string"
            },
            "creators": {
              "description": "Numeric user IDs. Use clickup_resolve_assignees to convert names/emails/\"me\".",
              "items": {
                "type": "string"
              },
              "type": "array"
            },
            "due_date_from": {
              "description": "Filter items with due date on or after this date. Format: YYYY-MM-DD or YYYY-MM-DD HH:MM (e.g., \"2025-01-01\" or \"2025-01-01 09:00\")",
              "pattern": "^\\d{4}-\\d{2}-\\d{2}( \\d{2}:\\d{2})?$",
              "type": "string"
            },
            "due_date_to": {
              "description": "Filter items with due date on or before this date. Format: YYYY-MM-DD or YYYY-MM-DD HH:MM (e.g., \"2025-12-31\" or \"2025-12-31 23:59\")",
              "pattern": "^\\d{4}-\\d{2}-\\d{2}( \\d{2}:\\d{2})?$",
              "type": "string"
            },
            "location": {
              "description": "Location filters for hierarchical organization (Spaces, Folders, Lists)",
              "properties": {
                "categories": {
                  "description": "Filter by Folder IDs. Returns items from these Folders",
                  "items": {
                    "type": "string"
                  },
                  "type": "array"
                },
                "projects": {
                  "description": "Filter by Space IDs. Returns items from these Spaces",
                  "items": {
                    "type": "string"
                  },
                  "type": "array"
                },
                "subcategories": {
                  "description": "Filter by List IDs. Returns items from these Lists",
                  "items": {
                    "type": "string"
                  },
                  "type": "array"
                }
              },
              "type": "object"
            },
            "task_statuses": {
              "description": "Filter tasks by their status (unstarted, active, done, closed, or archived)",
              "items": {
                "description": "Task status filter values",
                "enum": [
                  "unstarted",
                  "active",
                  "done",
                  "closed",
                  "archived"
                ],
                "type": "string"
              },
              "type": "array"
            }
          },
          "type": "object"
        },
        "keywords": {
          "description": "Search query string. Use specific keywords to find items",
          "type": "string"
        },
        "sort": {
          "description": "Sort criteria for results. Can specify multiple sort fields in priority order",
          "items": {
            "description": "Single sort criteria",
            "properties": {
              "direction": {
                "description": "Sort order (asc for ascending, desc for descending)",
                "enum": [
                  "asc",
                  "desc"
                ],
                "type": "string"
              },
              "field": {
                "description": "The field to sort by (created_at or updated_at)",
                "enum": [
                  "created_at",
                  "updated_at"
                ],
                "type": "string"
              }
            },
            "required": [
              "field",
              "direction"
            ],
            "type": "object"
          },
          "type": "array"
        },
        "workspace_id": {
          "description": "Workspace ID (digits only). Only needed when you have multiple workspaces.",
          "pattern": "^\\d+$",
          "type": "string"
        }
      },
      "type": "object"
    }
  },
  {
    "name": "clickup_search_reminders",
    "description": "Search and list your reminders. Supports filtering by type, status, completion, and since date. Date filters use YYYY-MM-DD or YYYY-MM-DD HH:MM format (e.g., '2025-01-01') in your timezone. Paginated via cursor.",
    "inputSchema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "properties": {
        "cursor": {
          "description": "Cursor for pagination. Use the next_cursor value from the previous response to fetch the next page of results",
          "type": "string"
        },
        "due_date_status": {
          "description": "Filter reminders by due date status (TODO, LATER, DELETED)",
          "enum": [
            "TODO",
            "LATER",
            "DELETED"
          ],
          "type": "string"
        },
        "is_completed": {
          "description": "Filter to show only completed or incomplete reminders",
          "type": "boolean"
        },
        "is_overdue": {
          "description": "Filter to show only overdue reminders",
          "type": "boolean"
        },
        "limit": {
          "description": "Maximum number of reminders to return per page (default: 25, max: 100)",
          "maximum": 100,
          "minimum": 1,
          "type": "number"
        },
        "reminder_type": {
          "description": "Filter by type of reminder (ASSIGNED_COMMENT, UNANSWERED_MENTION, APPROVAL, SAVED, REMINDER)",
          "enum": [
            "ASSIGNED_COMMENT",
            "UNANSWERED_MENTION",
            "APPROVAL",
            "SAVED",
            "REMINDER"
          ],
          "type": "string"
        },
        "since": {
          "description": "Filter reminders updated since this date in YYYY-MM-DD format or date-time in YYYY-MM-DD HH:MM format (e.g., '2025-01-01' or '2025-01-01 09:00')",
          "pattern": "^\\d{4}-\\d{2}-\\d{2}( \\d{2}:\\d{2})?$",
          "type": "string"
        },
        "workspace_id": {
          "description": "Workspace ID (digits only). Only needed when you have multiple workspaces.",
          "pattern": "^\\d+$",
          "type": "string"
        }
      },
      "type": "object"
    }
  },
  {
    "name": "clickup_send_chat_message",
    "description": "Send a message or threaded reply to a chat channel. Provide parent_message_id for threaded replies. Supports markdown and post types.",
    "inputSchema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "properties": {
        "assignee": {
          "description": "User ID to assign the message to. Use clickup_resolve_assignees to convert email, username, or \"me\" to user ID if needed.",
          "type": "string"
        },
        "channel_id": {
          "description": "ID of the chat channel to send the message to. Ignored when parent_message_id is set — a reply's channel is derived from its parent message.",
          "type": "string"
        },
        "content": {
          "description": "Message content to send (supports markdown).",
          "type": "string"
        },
        "content_format": {
          "default": "text/md",
          "description": "Format of the message content.",
          "enum": [
            "text/md",
            "text/plain"
          ],
          "type": "string"
        },
        "followers": {
          "description": "Array of user IDs to add as followers of the message. Use clickup_resolve_assignees to convert emails, usernames, or \"me\" to user IDs if needed.",
          "items": {
            "type": "string"
          },
          "type": "array"
        },
        "group_assignee": {
          "description": "Group ID to assign the message to.",
          "type": "string"
        },
        "parent_message_id": {
          "description": "ID of the parent message to reply to. When provided, the message is sent as a threaded reply instead of a top-level channel message. Use clickup_get_chat_channel_messages to find the message ID.",
          "type": "string"
        },
        "post_title": {
          "description": "Title for the post (required if type is 'post').",
          "type": "string"
        },
        "post_type": {
          "description": "Kind of post (required if type is 'post'). Resolved to the workspace's post subtype.",
          "enum": [
            "Update",
            "Announcement",
            "Idea",
            "Discussion"
          ],
          "type": "string"
        },
        "type": {
          "default": "message",
          "description": "Type of message to send.",
          "enum": [
            "message",
            "post"
          ],
          "type": "string"
        },
        "workspace_id": {
          "description": "Workspace ID (digits only). Only needed when you have multiple workspaces.",
          "pattern": "^\\d+$",
          "type": "string"
        }
      },
      "required": [
        "channel_id",
        "content"
      ],
      "type": "object"
    }
  },
  {
    "name": "clickup_start_time_tracking",
    "description": "Start time tracking on a task. Supports description, billable status, and tags. Only one timer can be running at a time. For best results, omit extra parameters unless specifically needed.",
    "inputSchema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "properties": {
        "billable": {
          "description": "Whether this time is billable. Default is workspace setting.",
          "type": "boolean"
        },
        "description": {
          "description": "Description for the time entry. Keep short and simple, or omit for best compatibility.",
          "type": "string"
        },
        "tags": {
          "description": "Array of tag names to assign to the time entry.",
          "items": {
            "type": "string"
          },
          "type": "array"
        },
        "task_id": {
          "description": "Task ID (supports custom IDs like 'DEV-1234')",
          "type": "string"
        },
        "workspace_id": {
          "description": "Workspace ID (digits only). Only needed when you have multiple workspaces.",
          "pattern": "^\\d+$",
          "type": "string"
        }
      },
      "required": [
        "task_id"
      ],
      "type": "object"
    }
  },
  {
    "name": "clickup_stop_time_tracking",
    "description": "Stop the currently running time tracker. Supports description and tags. Returns the completed time entry details.",
    "inputSchema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "properties": {
        "description": {
          "description": "Description to update or add to the time entry.",
          "type": "string"
        },
        "tags": {
          "description": "Array of tag names to assign to the time entry.",
          "items": {
            "type": "string"
          },
          "type": "array"
        },
        "workspace_id": {
          "description": "Workspace ID (digits only). Only needed when you have multiple workspaces.",
          "pattern": "^\\d+$",
          "type": "string"
        }
      },
      "type": "object"
    }
  },
  {
    "name": "clickup_update_comment",
    "description": "Edit an existing comment in place by comment_id. Replaces the comment text (supports Markdown), and can mark it resolved or reassign it. Use clickup_get_task_comments or clickup_get_threaded_comments to find the comment ID.",
    "inputSchema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "properties": {
        "assignee": {
          "description": "User ID to assign the comment to. Use clickup_resolve_assignees to convert email, username, or \"me\" to user ID if needed.",
          "type": "number"
        },
        "comment_id": {
          "description": "ID of the comment to update. Use clickup_get_task_comments or clickup_get_threaded_comments to find the comment ID.",
          "minLength": 1,
          "type": "string"
        },
        "comment_text": {
          "description": "New comment content that replaces the existing text. Supports Markdown formatting. To @mention a user, write [@Name](#user_mention#user_id) inline — user_id MUST be a numeric ClickUp user id from clickup_resolve_assignees.",
          "maxLength": 40000,
          "type": "string"
        },
        "resolved": {
          "description": "Mark the comment as resolved (true) or unresolved (false).",
          "type": "boolean"
        },
        "workspace_id": {
          "description": "Workspace ID (digits only). Only needed when you have multiple workspaces.",
          "pattern": "^\\d+$",
          "type": "string"
        }
      },
      "required": [
        "comment_id"
      ],
      "type": "object"
    }
  },
  {
    "name": "clickup_update_document_page",
    "description": "Update a page in a ClickUp document. Use content_edit_mode to control how content is applied: append/prepend merge with the existing page server-side and preserve it exactly — no need to read the page first. The default is 'replace', which overwrites the whole page. If appended content should start on its own line, include a leading newline; if prepended content should end on its own line, include a trailing newline.",
    "inputSchema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "properties": {
        "content": {
          "description": "New content for the page (must be non-empty; clearing a page is not supported). By default this REPLACES the entire existing page content — set content_edit_mode to 'append' or 'prepend' to add to the page instead of overwriting it.",
          "minLength": 1,
          "type": "string"
        },
        "content_edit_mode": {
          "default": "replace",
          "description": "How to apply `content`: 'append' adds it at the end of the existing page, 'prepend' inserts it before the existing content, 'replace' (default) OVERWRITES the entire page — existing content is lost. Ignored when `content` is not provided.",
          "enum": [
            "replace",
            "append",
            "prepend"
          ],
          "type": "string"
        },
        "content_format": {
          "default": "text/md",
          "description": "The format of the page content",
          "enum": [
            "text/md",
            "text/plain"
          ],
          "type": "string"
        },
        "document_id": {
          "description": "ID of the document containing the page (e.g. 'ad-909705'). In ClickUp doc URLs, the document_id is always the first ID after /docs/ or /v/dc/.",
          "type": "string"
        },
        "name": {
          "description": "New name for the page",
          "type": "string"
        },
        "page_id": {
          "description": "ID of the page to update (e.g. 'ad-2675877'). In ClickUp doc URLs, this is the second ID after /docs/ or /v/dc/.",
          "type": "string"
        },
        "sub_title": {
          "description": "New subtitle for the page",
          "type": "string"
        },
        "workspace_id": {
          "description": "Workspace ID (digits only). Only needed when you have multiple workspaces.",
          "pattern": "^\\d+$",
          "type": "string"
        }
      },
      "required": [
        "document_id",
        "page_id"
      ],
      "type": "object"
    }
  },
  {
    "name": "clickup_update_folder",
    "description": "Update a ClickUp folder. Requires folder_id + at least one update field (name/override_statuses). Only specified fields updated. Changes apply to all lists in folder. If you need to get a folder ID from a folder name, use clickup_get_folder first.",
    "inputSchema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "properties": {
        "folder_id": {
          "description": "ID of the folder to update.",
          "type": "string"
        },
        "name": {
          "description": "New name for the folder.",
          "type": "string"
        },
        "override_statuses": {
          "description": "Whether to override space statuses with folder-specific statuses.",
          "type": "boolean"
        },
        "workspace_id": {
          "description": "Workspace ID (digits only). Only needed when you have multiple workspaces.",
          "pattern": "^\\d+$",
          "type": "string"
        }
      },
      "required": [
        "folder_id"
      ],
      "type": "object"
    }
  },
  {
    "name": "clickup_update_list",
    "description": "Update a ClickUp list. Requires list_id + at least one update field (name/content/status). Only specified fields updated. If you need to get a list ID from a list name, use clickup_get_list first.",
    "inputSchema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "properties": {
        "content": {
          "description": "New description or content for the list.",
          "type": "string"
        },
        "list_id": {
          "description": "ID of the list to update.",
          "type": "string"
        },
        "name": {
          "description": "New name for the list.",
          "type": "string"
        },
        "status": {
          "description": "New status for the list.",
          "type": "string"
        },
        "workspace_id": {
          "description": "Workspace ID (digits only). Only needed when you have multiple workspaces.",
          "pattern": "^\\d+$",
          "type": "string"
        }
      },
      "required": [
        "list_id"
      ],
      "type": "object"
    }
  },
  {
    "name": "clickup_update_reminder",
    "description": "Update a reminder by reminder_id. Supports title, description, due_date (YYYY-MM-DD or YYYY-MM-DD HH:MM, e.g. '2025-12-31'), and is_completed.",
    "inputSchema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "properties": {
        "description": {
          "description": "New description for the reminder.",
          "type": "string"
        },
        "due_date": {
          "description": "New due date in YYYY-MM-DD format or date-time in YYYY-MM-DD HH:MM format (e.g., '2025-12-31' or '2025-12-31 14:30'). Uses your user timezone.",
          "pattern": "^\\d{4}-\\d{2}-\\d{2}( \\d{2}:\\d{2})?$",
          "type": "string"
        },
        "is_completed": {
          "description": "Set to true to mark the reminder as completed, false to mark as incomplete.",
          "type": "boolean"
        },
        "reminder_id": {
          "description": "The unique identifier (KSUID) of the reminder to update.",
          "pattern": "^[0-9A-Za-z]{27}$",
          "type": "string"
        },
        "title": {
          "description": "New title for the reminder.",
          "type": "string"
        },
        "workspace_id": {
          "description": "Workspace ID (digits only). Only needed when you have multiple workspaces.",
          "pattern": "^\\d+$",
          "type": "string"
        }
      },
      "required": [
        "reminder_id"
      ],
      "type": "object"
    }
  },
  {
    "name": "clickup_update_task",
    "description": "Update task properties. Requires task_id and at least one field to change. Supports assignees (user IDs, emails, usernames, or \"me\"), custom fields as [{id, value}], and task_type by name (or 'none' to reset).",
    "inputSchema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "properties": {
        "assignees": {
          "description": "Array of assignee user IDs. Use clickup_resolve_assignees to convert emails, usernames, or \"me\" to user IDs if needed.",
          "items": {
            "type": "string"
          },
          "type": "array"
        },
        "custom_fields": {
          "description": "Array of custom field values to set on the task. Each object must have an 'id' and 'value' property.",
          "items": {
            "properties": {
              "id": {
                "description": "ID of the custom field",
                "type": "string"
              },
              "value": {
                "description": "Value for the custom field. Pass as a string — the format depends on the field type: text/url/email: the value directly. phone: must be a valid phone number in international format (e.g. '+1 234 567 8901'). dropdown: the option UUID. number/money/rating: the number as a string (e.g. '42'). date: a date string in YYYY-MM-DD or YYYY-MM-DD HH:MM format (auto-converted to timestamp). checkbox/button: 'true' or 'false'. labels: JSON array of UUIDs (e.g. '[\"uuid1\",\"uuid2\"]'). relationships/people/files: JSON with add/rem arrays (e.g. '{\"add\":[\"id1\"],\"rem\":[\"id2\"]}'). progress: JSON with current value (e.g. '{\"current\":50}'). location: JSON with location object (e.g. '{\"location\":{\"lat\":-28,\"lng\":153},\"formatted_address\":\"...\"}').",
                "type": "string"
              }
            },
            "required": [
              "id",
              "value"
            ],
            "type": "object"
          },
          "type": "array"
        },
        "due_date": {
          "description": "YYYY-MM-DD or YYYY-MM-DD HH:MM format. Pass 'none' to clear. Omit to leave unchanged.",
          "type": "string"
        },
        "markdown_description": {
          "description": "Task description in markdown format.",
          "type": "string"
        },
        "name": {
          "type": "string"
        },
        "priority": {
          "description": "Set priority, or 'none' to clear. Omit to leave unchanged.",
          "enum": [
            "urgent",
            "high",
            "normal",
            "low",
            "none"
          ],
          "type": "string"
        },
        "start_date": {
          "description": "YYYY-MM-DD or YYYY-MM-DD HH:MM format. Pass 'none' to clear. Omit to leave unchanged.",
          "type": "string"
        },
        "status": {
          "description": "New status (must be valid for the task's list).",
          "type": "string"
        },
        "task_id": {
          "description": "Task ID (supports custom IDs like 'DEV-1234')",
          "type": "string"
        },
        "task_type": {
          "description": "To change the task type, pass the type name as a string (e.g., 'Bug', 'Feature', 'Milestone'). The type must exist in the workspace. To revert to the default 'Task' type, pass 'none'. Omit entirely to leave unchanged.",
          "type": "string"
        },
        "time_estimate": {
          "description": "Time estimate in minutes (e.g., '150' for 2h 30m).",
          "type": "string"
        },
        "workspace_id": {
          "description": "Workspace ID (digits only). Only needed when you have multiple workspaces.",
          "pattern": "^\\d+$",
          "type": "string"
        }
      },
      "required": [
        "task_id"
      ],
      "type": "object"
    }
  }
] as any;
