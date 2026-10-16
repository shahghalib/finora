import { getToken as getStoredToken } from '@/lib/utils/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

// The real login flow (authStore.ts) persists the token via Zustand under
// the 'auth-storage' key, not a plain string — getStoredToken() knows how
// to read that. This used to read a 'finora_token' key that nothing in the
// app ever wrote to, so every request here went out with no auth header at
// all, and the Overview page treated every real logged-in user as signed
// out (see AuthRequiredCard, now removed from that flow).
export function getToken(): string | null {
  return getStoredToken();
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const token = getToken();

  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    let message = res.statusText || "Request failed";

    try {
      const body = await res.json();
      message = body?.message ?? message;
    } catch {
      // response wasn't JSON, keep default message
    }

    throw new ApiError(message, res.status);
  }

  if (res.status === 204) return undefined as T;

  return (await res.json()) as T;
}

// Raw budget row, as returned by GET /budgets and POST /budgets.
export interface Budget {
  id: number;
  userId: number;
  categoryId: number;
  month: string; // YYYY-MM-01
  limitAmount: string; // decimal column comes back as a string
  currency: string;
}

// Returned by GET /analytics/flagged-categories — categories that have
// exceeded their budget in 2+ of the last 3 months.
export interface FlaggedCategory {
  categoryId: number;
  categoryName: string;
  months: string[];
  exceededCount: number;
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-PK", {
    maximumFractionDigits: 0,
  }).format(value);
}

export function monthLabel(month: string | Date) {
  const date = typeof month === "string" ? new Date(month) : month;

  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}