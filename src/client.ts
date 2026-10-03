import { Config } from "./config.js";

export interface WorkspaceMember {
  user: {
    id: number;
    username: string;
    email: string;
    color?: string;
    profilePicture?: string | null;
    initials?: string;
    role?: number;
  };
}

export interface WorkspaceTeam {
  id: string;
  name: string;
  color?: string;
  members: WorkspaceMember[];
}

export class ClickUpClient {
  private config: Config;
  private defaultWorkspaceId?: string;
  private currentUserId?: number;
  private memberCache: Map<string, WorkspaceMember[]> = new Map();
  private customItemCache: Map<string, Array<{ id: number; name: string }>> = new Map();

  constructor(config: Config) {
    this.config = config;
  }

  get token(): string {
    return this.config.apiToken;
  }

  /**
   * Builds full URL for an API endpoint
   */
  private buildUrl(path: string, query?: Record<string, any>): string {
    let url: string;
    if (path.startsWith("http://") || path.startsWith("https://")) {
      url = path;
    } else if (path.startsWith("/api/v3")) {
      url = `https://api.clickup.com${path}`;
    } else if (path.startsWith("/api/v2")) {
      url = `https://api.clickup.com${path}`;
    } else if (path.startsWith("/v2")) {
      url = `https://api.clickup.com/api${path}`;
    } else if (path.startsWith("/v3")) {
      url = `https://api.clickup.com/api${path}`;
    } else {
      url = `${this.config.apiBaseUrl}${path.startsWith("/") ? "" : "/"}${path}`;
    }

    if (query && Object.keys(query).length > 0) {
      const searchParams = new URLSearchParams();
      for (const [key, val] of Object.entries(query)) {
        if (val === undefined || val === null) continue;
        if (Array.isArray(val)) {
          for (const item of val) {
            if (item !== undefined && item !== null) {
              if (key === "task_ids") {
                searchParams.append("task_ids", String(item));
              } else if (key.endsWith("[]")) {
                searchParams.append(key, String(item));
              } else {
                searchParams.append(`${key}[]`, String(item));
              }
            }
          }
        } else {
          searchParams.append(key, String(val));
        }
      }
      const qs = searchParams.toString();
      if (qs) {
        url += (url.includes("?") ? "&" : "?") + qs;
      }
    }

    return url;
  }

  /**
   * Generic HTTP request against ClickUp API
   */
  public async request<T = any>(
    path: string,
    options: {
      method?: string;
      body?: any;
      query?: Record<string, any>;
      headers?: Record<string, string>;
    } = {}
  ): Promise<T> {
    const url = this.buildUrl(path, options.query);
    const headers: Record<string, string> = {
      Authorization: this.config.apiToken,
      Accept: "application/json",
      ...(options.headers || {})
    };

    let bodyStr: string | undefined;
    if (options.body !== undefined) {
      if (typeof options.body === "string") {
        bodyStr = options.body;
      } else {
        bodyStr = JSON.stringify(options.body);
        headers["Content-Type"] = "application/json";
      }
    }

    const res = await fetch(url, {
      method: options.method || "GET",
      headers,
      body: bodyStr
    });

    const contentType = res.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");

    if (!res.ok) {
      let errDetail = "";
      try {
        if (isJson) {
          const errJson = await res.json();
          errDetail = typeof errJson === "object" ? JSON.stringify(errJson) : String(errJson);
        } else {
          errDetail = await res.text();
        }
      } catch {
        errDetail = res.statusText;
      }
      throw new Error(`ClickUp API Error (${res.status} ${res.statusText}): ${errDetail}`);
    }

    if (res.status === 204) {
      return {} as T;
    }

    if (isJson) {
      return (await res.json()) as T;
    }

    return (await res.text()) as unknown as T;
  }

  public async get<T = any>(path: string, query?: Record<string, any>): Promise<T> {
    return this.request<T>(path, { method: "GET", query });
  }

  public async post<T = any>(path: string, body?: any, query?: Record<string, any>): Promise<T> {
    return this.request<T>(path, { method: "POST", body, query });
  }

  public async put<T = any>(path: string, body?: any, query?: Record<string, any>): Promise<T> {
    return this.request<T>(path, { method: "PUT", body, query });
  }

  public async delete<T = any>(path: string, query?: Record<string, any>): Promise<T> {
    return this.request<T>(path, { method: "DELETE", query });
  }

  /**
   * Uploads a file via multipart/form-data
   */
  public async uploadFile<T = any>(
    path: string,
    fileBuffer: Buffer | Uint8Array,
    fileName: string,
    fieldName = "attachment"
  ): Promise<T> {
    const url = this.buildUrl(path);
    const formData = new FormData();
    const blob = new Blob([fileBuffer as any]);
    formData.append(fieldName, blob, fileName);

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: this.config.apiToken
      },
      body: formData
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`ClickUp File Upload Error (${res.status}): ${errText}`);
    }

    return (await res.json()) as T;
  }

  /**
   * Get the current authenticated user
   */
  public async getCurrentUser(): Promise<{ id: number; username: string; email: string }> {
    if (this.currentUserId) {
      return { id: this.currentUserId, username: "", email: "" };
    }
    const data = await this.get<{ user: { id: number; username: string; email: string } }>("/user");
    this.currentUserId = data.user.id;
    return data.user;
  }

  /**
   * Get workspace / teams and cache default workspace ID and members
   */
  public async getTeams(): Promise<WorkspaceTeam[]> {
    const data = await this.get<{ teams: WorkspaceTeam[] }>("/team");
    if (data.teams && data.teams.length > 0) {
      if (!this.defaultWorkspaceId) {
        this.defaultWorkspaceId = String(data.teams[0].id);
      }
      for (const t of data.teams) {
        this.memberCache.set(String(t.id), t.members || []);
      }
    }
    return data.teams || [];
  }

  /**
   * Resolves workspace ID. Uses provided workspace_id, or defaults to the first workspace.
   */
  public async resolveWorkspaceId(providedId?: string | number): Promise<string> {
    if (providedId) {
      return String(providedId);
    }
    if (this.defaultWorkspaceId) {
      return this.defaultWorkspaceId;
    }
    await this.getTeams();
    if (!this.defaultWorkspaceId) {
      throw new Error("Could not find any ClickUp workspace for this account.");
    }
    return this.defaultWorkspaceId;
  }

  /**
   * Get members for a workspace
   */
  public async getWorkspaceMembers(workspaceId?: string): Promise<WorkspaceMember[]> {
    const wsId = await this.resolveWorkspaceId(workspaceId);
    if (this.memberCache.has(wsId)) {
      return this.memberCache.get(wsId)!;
    }
    const teams = await this.getTeams();
    const team = teams.find((t) => String(t.id) === wsId);
    return team?.members || [];
  }

  /**
   * Find a single member by name or email
   */
  public async findMemberByNameOrEmail(
    nameOrEmail: string,
    workspaceId?: string
  ): Promise<WorkspaceMember["user"] | null> {
    const members = await this.getWorkspaceMembers(workspaceId);
    const search = nameOrEmail.trim().toLowerCase();

    // Exact email match
    let match = members.find((m) => m.user.email?.toLowerCase() === search);
    if (match) return match.user;

    // Exact username match
    match = members.find((m) => m.user.username?.toLowerCase() === search);
    if (match) return match.user;

    // Substring match
    match = members.find(
      (m) =>
        m.user.username?.toLowerCase().includes(search) ||
        m.user.email?.toLowerCase().includes(search)
    );
    if (match) return match.user;

    return null;
  }

  /**
   * Resolve an array of assignee identifiers ("me", username, email, ID) into numeric IDs
   */
  public async resolveAssignees(
    assignees: string[] | number[],
    workspaceId?: string
  ): Promise<number[]> {
    if (!assignees || assignees.length === 0) return [];
    const resolvedIds: number[] = [];
    const members = await this.getWorkspaceMembers(workspaceId);
    const currentUser = await this.getCurrentUser();

    for (const a of assignees) {
      if (typeof a === "number" || /^\d+$/.test(String(a))) {
        resolvedIds.push(Number(a));
        continue;
      }

      const str = String(a).trim().toLowerCase();
      if (str === "me" || str === "current_user") {
        resolvedIds.push(currentUser.id);
        continue;
      }

      const found = members.find(
        (m) =>
          m.user.email?.toLowerCase() === str ||
          m.user.username?.toLowerCase() === str ||
          m.user.username?.toLowerCase().includes(str)
      );

      if (found) {
        resolvedIds.push(found.user.id);
      }
    }

    return Array.from(new Set(resolvedIds));
  }

  /**
   * Resolve custom task type name to ID
   */
  public async resolveTaskTypeId(
    typeName: string,
    workspaceId?: string
  ): Promise<number | undefined> {
    if (!typeName || typeName.toLowerCase() === "none") return undefined;
    const wsId = await this.resolveWorkspaceId(workspaceId);

    let items = this.customItemCache.get(wsId);
    if (!items) {
      try {
        const res = await this.get<{ custom_items: Array<{ id: number; name: string }> }>(
          `/team/${wsId}/custom_item`
        );
        items = res.custom_items || [];
        this.customItemCache.set(wsId, items);
      } catch {
        items = [];
      }
    }

    const match = items.find((i) => i.name.toLowerCase() === typeName.trim().toLowerCase());
    return match ? match.id : undefined;
  }

  /**
   * Parse date strings (YYYY-MM-DD or YYYY-MM-DD HH:MM or ISO) to Unix milliseconds
   */
  public parseDateToMs(dateStr?: string | number): number | undefined {
    if (dateStr === undefined || dateStr === null || dateStr === "") return undefined;
    if (typeof dateStr === "number") return dateStr;

    // If pure digits, treat as timestamp
    if (/^\d+$/.test(dateStr)) {
      return Number(dateStr);
    }

    // YYYY-MM-DD HH:MM
    if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(dateStr)) {
      const [datePart, timePart] = dateStr.split(" ");
      const [year, month, day] = datePart.split("-").map(Number);
      const [hour, minute] = timePart.split(":").map(Number);
      return new Date(year, month - 1, day, hour, minute).getTime();
    }

    // YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      const [year, month, day] = dateStr.split("-").map(Number);
      return new Date(year, month - 1, day, 0, 0, 0).getTime();
    }

    const parsed = new Date(dateStr).getTime();
    return isNaN(parsed) ? undefined : parsed;
  }

  /**
   * Parse priority strings ("urgent", "high", "normal", "low") to ClickUp priority numbers (1, 2, 3, 4)
   */
  public parsePriority(priority?: string | number): number | undefined {
    if (priority === undefined || priority === null) return undefined;
    if (typeof priority === "number") return priority;

    const lower = String(priority).toLowerCase().trim();
    switch (lower) {
      case "urgent":
        return 1;
      case "high":
        return 2;
      case "normal":
        return 3;
      case "low":
        return 4;
      default: {
        const num = Number(lower);
        return isNaN(num) ? undefined : num;
      }
    }
  }

  /**
   * Parse time estimate in minutes (e.g. "120" -> 120 * 60 * 1000)
   */
  public parseTimeEstimate(estimate?: string | number): number | undefined {
    if (estimate === undefined || estimate === null || estimate === "") return undefined;
    const num = Number(estimate);
    if (isNaN(num)) return undefined;
    return num * 60 * 1000;
  }
}
