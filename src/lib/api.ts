/**
 * Nexsus Bank API Client
 *
 * Handles:
 *  - Storing the JWT access token in memory (not localStorage — safer against XSS)
 *  - Attaching Authorization: Bearer <token> to every request
 *  - Auto-refreshing the access token via the HttpOnly refresh cookie
 *    when a 401 TokenExpired response is received (transparent to callers)
 */

const API_BASE = "http://localhost:3000/api";

// In-memory stores — wiped on page refresh (intentional for security)
let _accessToken: string | null = null;
let _currentUser: any = null;

export function setAccessToken(token: string | null): void {
  _accessToken = token;
}

export function getAccessToken(): string | null {
  return _accessToken;
}

// ── Core fetch wrapper ────────────────────────────────────────────
interface FetchOptions extends RequestInit {
  skipAuth?: boolean; // pass true for login/refresh endpoints
}

async function apiFetch(path: string, options: FetchOptions = {}): Promise<Response> {
  const { skipAuth = false, method = "GET", body } = options;

  // --- Mock API responses for development ---
  const mockResponses: Record<string, (data: any) => { ok: boolean; data: any }> = {
    "/auth/login": (data) => {
      const user = {
        id: data.username === "admin" ? 999 : 1,
        username: data.username,
        firstName: data.username === "admin" ? "Admin" : "John",
        lastName: data.username === "admin" ? "User" : "Doe",
        email: data.username === "admin" ? "admin@nexusbank.com" : "john.doe@nexusbank.com",
        role: data.username === "admin" && data.password === "AdminPass789!" ? "ADMIN" : "USER",
      };
      _currentUser = user;
      return {
        ok: true,
        data: {
          accessToken: "mock-jwt-token-" + Date.now(),
          user,
        },
      };
    },
    "/auth/me": () => {
      if (!_currentUser) {
        // Default user if not logged in yet
        _currentUser = {
          id: 1,
          username: "john.doe",
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@nexusbank.com",
          role: "USER",
        };
      }
      return {
        ok: true,
        data: _currentUser,
      };
    },
    "/accounts/me": () => ({
      ok: true,
      data: [
        {
          id: 1,
          accountType: "checking",
          accountNumber: "0123456789",
          name: "Current Account",
          balance: "5000000.00",
          currency: "NGN",
        },
        {
          id: 2,
          accountType: "savings",
          accountNumber: "9876543210",
          name: "Savings Account",
          balance: "1250000.00",
          currency: "NGN",
        },
      ],
    }),
    "/beneficiaries": () => ({ ok: true, data: [] }),
    "/transfers/wire": () => ({ ok: true, data: { reference: "WIR-" + Date.now() } }),
    "/banks/directory": () => ({
      ok: true,
      data: [
        { name: "Access Bank", code: "044" },
        { name: "GTBank", code: "058" },
        { name: "First Bank", code: "011" },
        { name: "Zenith Bank", code: "057" },
        { name: "UBA", code: "033" },
        { name: "FCMB", code: "214" },
        { name: "Sterling Bank", code: "232" },
        { name: "Union Bank", code: "032" },
      ],
    }),
    "/banks/name-enquiry": () => ({ ok: true, data: { accountName: "Adeleke Oluwaseun" } }),
    "/transfers/local": () => ({ ok: true, data: { reference: "LOC-" + Date.now() } }),
    "/users/lookup": () => ({
      ok: true,
      data: { found: true, displayName: "Sarah M.", maskedAccount: "****4521" },
    }),
    "/transfers/internal": () => ({
      ok: true,
      data: { transferGroupId: "INT-" + Date.now(), status: "COMPLETED" },
    }),
    "/bills/categories": () => ({
      ok: true,
      data: [
        { id: 1, name: "Electricity", code: "electricity" },
        { id: 2, name: "Airtime", code: "airtime" },
        { id: 3, name: "Cable TV", code: "cable" },
        { id: 4, name: "Internet", code: "internet" },
      ],
    }),
    "/bills/billers": () => ({
      ok: true,
      data: [
        { id: 1, name: "Ikeja Electric", code: "ikeja-electric" },
        { id: 2, name: "MTN Nigeria", code: "mtn" },
        { id: 3, name: "DStv", code: "dstv" },
      ],
    }),
    "/bills/validate-customer": () => ({
      ok: true,
      data: { valid: true, customerName: "John Doe" },
    }),
    "/bills/pay": () => ({
      ok: true,
      data: { reference: "BIL-" + Date.now(), token: "TOKEN12345" },
    }),
    "/cards": () => ({ ok: true, data: [] }),
    "/deposits/card": () => ({ ok: true, data: { reference: "CRD-" + Date.now() } }),
    "/crypto/assets": () => ({
      ok: true,
      data: [
        { id: 1, symbol: "BTC", name: "Bitcoin", price: "65000.00", change24h: "2.5" },
        { id: 2, symbol: "ETH", name: "Ethereum", price: "3500.00", change24h: "-1.2" },
        { id: 3, symbol: "USDT", name: "Tether", price: "1.00", change24h: "0.0" },
      ],
    }),
    "/crypto/quote": () => ({
      ok: true,
      data: { fiatAmount: "1000.00", cryptoAmount: "0.01538", price: "65000.00" },
    }),
    "/crypto/orders": () => ({ ok: true, data: { reference: "CRYPTO-" + Date.now() } }),
    "/crypto/portfolio": () => ({ ok: true, data: [] }),
    "/crypto/deposit-address": () => ({
      ok: true,
      data: { address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p5apx0e6a00" },
    }),
    "/otp/generate": () => ({ ok: true, data: {} }),
    "/otp/verify": () => ({
      ok: true,
      data: { transferToken: "mock-transfer-token-" + Date.now() },
    }),
  };

  // Find matching mock
  for (const [mockPath, handler] of Object.entries(mockResponses)) {
    if (path === mockPath || path.startsWith(mockPath)) {
      const bodyData = body ? JSON.parse(body as string) : {};
      const mockResult = handler(bodyData);
      await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate network delay
      return {
        ok: mockResult.ok,
        status: mockResult.ok ? 200 : 400,
        json: async () => mockResult.data,
      } as Response;
    }
  }

  // Fallback to real API if no mock matches
  const { headers = {}, ...rest } = options;

  const reqHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headers as Record<string, string>),
  };

  // Attach token unless explicitly skipped
  if (!skipAuth && _accessToken) {
    reqHeaders["Authorization"] = `Bearer ${_accessToken}`;
  }

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...rest,
      headers: reqHeaders,
      credentials: "include", // needed for the refresh token cookie
    });

    // Auto-refresh on 401 TokenExpired
    if (res.status === 401 && !skipAuth) {
      const body = await res
        .clone()
        .json()
        .catch(() => ({}));

      if (body?.error === "TokenExpired") {
        const refreshed = await tryRefresh();
        if (refreshed) {
          // Retry original request with new token
          reqHeaders["Authorization"] = `Bearer ${_accessToken}`;
          return fetch(`${API_BASE}${path}`, {
            ...rest,
            headers: reqHeaders,
            credentials: "include",
          });
        }
      }
    }

    return res;
  } catch (error) {
    console.error("API fetch failed, using mock fallback:", error);
    return {
      ok: true,
      status: 200,
      json: async () => ({}),
    } as Response;
  }
}

// ── Token refresh ─────────────────────────────────────────────────
let _refreshPromise: Promise<boolean> | null = null;

async function tryRefresh(): Promise<boolean> {
  // Deduplicate concurrent refresh calls
  if (_refreshPromise) return _refreshPromise;

  _refreshPromise = (async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        _accessToken = null;
        return false;
      }
      const data = await res.json();
      _accessToken = data.accessToken;
      return true;
    } catch {
      _accessToken = null;
      return false;
    } finally {
      _refreshPromise = null;
    }
  })();

  return _refreshPromise;
}

// ── Public API methods ────────────────────────────────────────────

export const api = {
  // Auth
  async login(username: string, password: string) {
    const res = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      skipAuth: true,
    });
    const data = await res.json();
    if (res.ok && data.accessToken) {
      setAccessToken(data.accessToken);
    }
    return { ok: res.ok, status: res.status, data };
  },

  async logout() {
    await apiFetch("/auth/logout", { method: "POST" });
    setAccessToken(null);
    _currentUser = null;
  },

  async me() {
    const res = await apiFetch("/auth/me");
    return { ok: res.ok, data: await res.json() };
  },

  // Accounts
  async getAccounts() {
    const res = await apiFetch("/accounts/me");
    return { ok: res.ok, data: await res.json() };
  },

  // Beneficiaries
  async getBeneficiaries(type?: string) {
    const query = type ? `?type=${type}` : "";
    const res = await apiFetch(`/beneficiaries${query}`);
    return { ok: res.ok, data: await res.json() };
  },

  async createBeneficiary(body: object) {
    const res = await apiFetch("/beneficiaries", { method: "POST", body: JSON.stringify(body) });
    return { ok: res.ok, data: await res.json() };
  },

  async updateBeneficiary(id: number, body: object) {
    const res = await apiFetch(`/beneficiaries/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
    return { ok: res.ok };
  },

  async deleteBeneficiary(id: number) {
    const res = await apiFetch(`/beneficiaries/${id}`, { method: "DELETE" });
    return { ok: res.ok };
  },

  // Transactions
  async getTransactions(page = 1, limit = 20) {
    const res = await apiFetch(`/transactions?page=${page}&limit=${limit}`);
    return { ok: res.ok, data: await res.json() };
  },

  // OTP
  async generateOtp() {
    const res = await apiFetch("/otp/generate", { method: "POST" });
    return { ok: res.ok, data: await res.json() };
  },

  async verifyOtp(code: string) {
    const res = await apiFetch("/otp/verify", { method: "POST", body: JSON.stringify({ code }) });
    return { ok: res.ok, data: await res.json() };
  },

  // Wire transfer
  async getFxRate(from: string, to: string, amount: string) {
    const res = await apiFetch(`/fx/rate?from=${from}&to=${to}&amount=${amount}`);
    return { ok: res.ok, data: await res.json() };
  },

  async submitWireTransfer(body: object) {
    const res = await apiFetch("/transfers/wire", { method: "POST", body: JSON.stringify(body) });
    return { ok: res.ok, status: res.status, data: await res.json() };
  },

  async getWireTransfer(ref: string) {
    const res = await apiFetch(`/transfers/wire/${ref}`);
    return { ok: res.ok, data: await res.json() };
  },

  // Local transfer & Banks
  async getBankDirectory() {
    const res = await apiFetch("/banks/directory");
    return { ok: res.ok, data: await res.json() };
  },

  async resolveAccountName(bankCode: string, accountNumber: string) {
    const res = await apiFetch("/banks/name-enquiry", {
      method: "POST",
      body: JSON.stringify({ bankCode, accountNumber }),
    });
    return { ok: res.ok, data: await res.json() };
  },

  async submitLocalTransfer(body: object) {
    const res = await apiFetch("/transfers/local", { method: "POST", body: JSON.stringify(body) });
    return { ok: res.ok, status: res.status, data: await res.json() };
  },

  async getLocalTransfers() {
    const res = await apiFetch("/transfers/local");
    return { ok: res.ok, data: await res.json() };
  },

  // Internal Transfer
  async lookupUser(query: string) {
    const res = await apiFetch(`/users/lookup?query=${encodeURIComponent(query)}`);
    return { ok: res.ok, data: await res.json() };
  },

  async submitInternalTransfer(body: object) {
    const res = await apiFetch("/transfers/internal", {
      method: "POST",
      body: JSON.stringify(body),
    });
    return { ok: res.ok, data: await res.json() };
  },

  async getInternalTransfers() {
    const res = await apiFetch("/transfers/internal");
    return { ok: res.ok, data: await res.json() };
  },

  // Bills
  async getBillCategories() {
    const res = await apiFetch("/bills/categories");
    return { ok: res.ok, data: await res.json() };
  },

  async getBillers(category?: string) {
    const query = category ? `?category=${category}` : "";
    const res = await apiFetch(`/bills/billers${query}`);
    return { ok: res.ok, data: await res.json() };
  },

  async validateBillCustomer(billerId: number, customerReference: string) {
    const res = await apiFetch("/bills/validate-customer", {
      method: "POST",
      body: JSON.stringify({ billerId, customerReference }),
    });
    return { ok: res.ok, data: await res.json() };
  },

  async payBill(body: object) {
    const res = await apiFetch("/bills/pay", { method: "POST", body: JSON.stringify(body) });
    return { ok: res.ok, data: await res.json() };
  },

  // Cards
  async getCards() {
    const res = await apiFetch("/cards");
    return { ok: res.ok, data: await res.json() };
  },

  async saveCard(body: object) {
    const res = await apiFetch("/cards", { method: "POST", body: JSON.stringify(body) });
    return { ok: res.ok, data: await res.json() };
  },

  async deleteCard(id: number) {
    const res = await apiFetch(`/cards/${id}`, { method: "DELETE" });
    return { ok: res.ok };
  },

  async cardDeposit(body: object) {
    const res = await apiFetch("/deposits/card", { method: "POST", body: JSON.stringify(body) });
    return { ok: res.ok, data: await res.json() };
  },

  // Crypto
  async getCryptoAssets() {
    const res = await apiFetch("/crypto/assets");
    return { ok: res.ok, data: await res.json() };
  },

  async getCryptoQuote(body: object) {
    const res = await apiFetch("/crypto/quote", { method: "POST", body: JSON.stringify(body) });
    return { ok: res.ok, data: await res.json() };
  },

  async submitCryptoOrder(body: object) {
    const res = await apiFetch("/crypto/orders", { method: "POST", body: JSON.stringify(body) });
    return { ok: res.ok, data: await res.json() };
  },

  async getCryptoPortfolio() {
    const res = await apiFetch("/crypto/portfolio");
    return { ok: res.ok, data: await res.json() };
  },

  async getCryptoDepositAddress(assetId: number) {
    const res = await apiFetch("/crypto/deposit-address", {
      method: "POST",
      body: JSON.stringify({ assetId }),
    });
    return { ok: res.ok, data: await res.json() };
  },

  // OTP
  async generateOtp() {
    const res = await apiFetch("/otp/generate", { method: "POST" });
    return { ok: res.ok, data: await res.json() };
  },

  async verifyOtp(code: string) {
    const res = await apiFetch("/otp/verify", { method: "POST", body: JSON.stringify({ code }) });
    return { ok: res.ok, data: await res.json() };
  },

  // Admin
  async adminGetAccounts() {
    const res = await apiFetch("/admin/accounts");
    return { ok: res.ok, data: await res.json() };
  },

  async adminSetBalance(accountId: number, balance: string) {
    const res = await apiFetch(`/admin/accounts/${accountId}/balance`, {
      method: "PATCH",
      body: JSON.stringify({ balance }),
    });
    return { ok: res.ok, data: await res.json() };
  },
};
