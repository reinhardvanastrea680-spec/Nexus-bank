/**
 * Admin Security Utilities
 * - Rate limiting (localStorage-based, 5 attempts / 15 min, exponential backoff)
 * - Session timeout (30 min inactivity auto-logout)
 * - Simple hash for storing attempt fingerprint
 */

const ATTEMPTS_KEY  = "nexus-admin-attempts";
const SESSION_KEY   = "nexus-admin-session-ts";
const MAX_ATTEMPTS  = 5;
const WINDOW_MS     = 15 * 60 * 1000; // 15 minutes
const SESSION_MS    = 30 * 60 * 1000; // 30 minutes inactivity

// ── Rate limiting ─────────────────────────────────────────────────────────

interface AttemptRecord {
  count: number;
  windowStart: number;
  lockedUntil: number; // epoch ms — 0 = not locked
}

function getAttempts(): AttemptRecord {
  try {
    const raw = localStorage.getItem(ATTEMPTS_KEY);
    if (raw) return JSON.parse(raw) as AttemptRecord;
  } catch {}
  return { count: 0, windowStart: Date.now(), lockedUntil: 0 };
}

function saveAttempts(r: AttemptRecord) {
  localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(r));
}

export function recordFailedAttempt(): AttemptRecord {
  let r = getAttempts();
  const now = Date.now();

  // Reset if outside window
  if (now - r.windowStart > WINDOW_MS) {
    r = { count: 0, windowStart: now, lockedUntil: 0 };
  }

  r.count += 1;

  // Exponential backoff lock: 1 min → 5 min → 15 min → 60 min
  if (r.count >= MAX_ATTEMPTS) {
    const lockMinutes = Math.min(60, Math.pow(2, r.count - MAX_ATTEMPTS + 1));
    r.lockedUntil = now + lockMinutes * 60 * 1000;
  }

  saveAttempts(r);
  return r;
}

export function isRateLimited(): boolean {
  const r = getAttempts();
  if (r.lockedUntil && Date.now() < r.lockedUntil) return true;
  return false;
}

export function getLockoutSeconds(): number {
  const r = getAttempts();
  if (!r.lockedUntil) return 0;
  return Math.max(0, Math.ceil((r.lockedUntil - Date.now()) / 1000));
}

export function resetAttempts() {
  localStorage.removeItem(ATTEMPTS_KEY);
}

// ── Session timeout ───────────────────────────────────────────────────────

export function touchSession() {
  localStorage.setItem(SESSION_KEY, String(Date.now()));
}

export function isSessionExpired(): boolean {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return true;
  return Date.now() - parseInt(raw, 10) > SESSION_MS;
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

// ── Activity listener — call once on admin mount ──────────────────────────

export function startSessionWatcher(onExpire: () => void): () => void {
  touchSession();

  const events = ["click", "keydown", "scroll", "mousemove", "touchstart"];
  const handler = () => touchSession();
  events.forEach((e) => window.addEventListener(e, handler, { passive: true }));

  const interval = setInterval(() => {
    if (isSessionExpired()) {
      clearSession();
      onExpire();
    }
  }, 30_000); // check every 30s

  return () => {
    events.forEach((e) => window.removeEventListener(e, handler));
    clearInterval(interval);
  };
}
