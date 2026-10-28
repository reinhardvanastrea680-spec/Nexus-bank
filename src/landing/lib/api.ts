const BASE = "/api";

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  try {
    const res = await fetch(`${BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Request failed" }));
      throw new Error((err as { error?: string }).error ?? "Request failed");
    }
    return res.json() as Promise<T>;
  } catch (e) {
    // For demo purposes, if API isn't running, just return a fallback or rethrow
    console.warn("API request failed (demo mode)", e);
    throw e;
  }
}

export async function apiGet<T>(path: string): Promise<T> {
  try {
    const res = await fetch(`${BASE}${path}`, { credentials: "include" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Request failed" }));
      throw new Error((err as { error?: string }).error ?? "Request failed");
    }
    return res.json() as Promise<T>;
  } catch (e) {
    // For demo purposes, if API isn't running, just return a fallback or rethrow
    console.warn("API request failed (demo mode)", e);
    throw e;
  }
}
