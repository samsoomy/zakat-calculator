const UUID_KEY = "zakat_session_uuid";

export function getOrCreateUUID(): string {
  if (typeof window === "undefined") return "";
  let uuid = localStorage.getItem(UUID_KEY);
  if (!uuid) {
    uuid = crypto.randomUUID();
    localStorage.setItem(UUID_KEY, uuid);
  }
  return uuid;
}

export function getUUID(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(UUID_KEY);
}
