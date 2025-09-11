import { TokenService } from "../../services/token.service";
import { RequestOptions } from "../../../types/api.type";
import { BASE_URL } from "../../configs/api.config";
import { TokenRefreshManager } from "../../managers/token.refresh.managere";

// ================== BaseApi =================
class BaseApi {
  constructor(private baseURL: string) {
    TokenRefreshManager.configure(baseURL); // dùng chung
  }

  async get<T>(path: string, opts: Omit<RequestOptions, "method" | "body"> = {}): Promise<T> {
    return this.request<T>(path, { ...opts, method: "GET" });
  }
  async post<T>(path: string, body?: any, opts: Omit<RequestOptions, "method" | "body"> = {}): Promise<T> {
    return this.request<T>(path, { ...opts, method: "POST", body });
  }
  async put<T>(path: string, body?: any, opts: Omit<RequestOptions, "method" | "body"> = {}): Promise<T> {
    return this.request<T>(path, { ...opts, method: "PUT", body });
  }
  async del<T>(path: string, opts: Omit<RequestOptions, "method" | "body"> = {}): Promise<T> {
    return this.request<T>(path, { ...opts, method: "DELETE" });
  }

  private async request<T>(path: string, opts: RequestOptions): Promise<T> {
    // --- NEW: preflight refresh nếu cần ---
    const needPre = opts.preflightRefresh !== false;
    if (needPre) {
      const ok = await TokenRefreshManager.refreshIfNeeded(opts.preflightSkewMs ?? 15_000);
      if (!ok) throw new Error("Unauthenticated (refresh needed but failed)");
    }

    const url = this.buildURL(path, opts.query);
    const headers: Record<string, string> = { "Content-Type": "application/json", ...(opts.headers || {}) };
    const access = TokenService.getAccessToken();
    if (access) headers["Authorization"] = `Bearer ${access}`;

    const controller = typeof AbortController !== "undefined" ? new AbortController() : undefined;
    const timer = opts.timeoutMs && controller ? setTimeout(() => controller.abort(), opts.timeoutMs) : undefined;

    try {
      const res = await fetch(url, {
        method: opts.method || "GET",
        headers,
        body: opts.body && typeof opts.body === "object" ? JSON.stringify(opts.body) : opts.body,
        credentials: opts.credentials,
        signal: controller?.signal,
      });

      if (res.status === 401) {
        // --- NEW: retry 1 lần sau khi force refresh ---
        const refreshed = await TokenRefreshManager.forceRefresh();
        if (!refreshed) {
          if (timer) clearTimeout(timer as any);
          TokenService.clearAll();
          throw new Error("Unauthorized and refresh failed");
        }

        const access2 = TokenService.getAccessToken();
        const headers2 = { ...headers, Authorization: access2 ? `Bearer ${access2}` : "" };
        const retry = await fetch(url, {
          method: opts.method || "GET",
          headers: headers2,
          body: opts.body && typeof opts.body === "object" ? JSON.stringify(opts.body) : opts.body,
          credentials: opts.credentials,
        });
        if (!retry.ok) {
          const txt = await safeReadText(retry);
          if (timer) clearTimeout(timer as any);
          throw new Error(`HTTP ${retry.status} ${retry.statusText} - ${txt}`);
        }
        const data = await retry.json();
        if (timer) clearTimeout(timer as any);
        return data as T;
      }

      if (!res.ok) {
        const text = await safeReadText(res);
        throw new Error(`HTTP ${res.status} ${res.statusText} - ${text}`);
      }

      const data = res.status === 204 ? undefined : await res.json();
      if (timer) clearTimeout(timer as any);
      return data as T;
    } catch (err) {
      if (timer) clearTimeout(timer as any);
      if ((err as any)?.name === "AbortError") throw new Error(`Request timeout after ${opts.timeoutMs}ms`);
      throw err;
    }
  }

  private buildURL(path: string, query?: RequestOptions["query"]): string {
    const u = new URL(path, this.baseURL);
    if (query) for (const k in query) {
      if (!Object.prototype.hasOwnProperty.call(query, k)) continue;
      const v = query[k];
      if (v !== undefined && v !== null) u.searchParams.set(k, String(v));
    }
    return u.toString();
  }
}
async function safeReadText(res: Response): Promise<string> {
  try { return await res.text(); } catch { return ""; }
}

export const baseApi = new BaseApi(BASE_URL);

