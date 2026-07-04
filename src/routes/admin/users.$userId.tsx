import { useState, useEffect } from "react";
import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft, Mail, Phone, Shield, Clock, CreditCard, MessageSquare,
  Wallet, CheckCircle2, XCircle, Eye, EyeOff, Zap, Ban, SlidersHorizontal, Trash2,
  CalendarRange, Bitcoin,
} from "lucide-react";
import { useAdminAuth } from "../../admin/hooks/useAdminAuth";
import { useUserTransactionsById } from "../../admin/hooks/useUserTransactionsById";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { db } from "../../firebase/config";
import { doc, onSnapshot, updateDoc, deleteDoc, collection, getDocs, query, where, Timestamp } from "firebase/firestore";
import { toast } from "sonner";
import { toggleUserFreeze } from "../../admin/utils/toggleUserFreeze";
import { formatInCurrency, type CurrencyCode } from "../../utils/currency";

type TransactionMode = "manual" | "auto_approve" | "auto_decline";

export const Route = createFileRoute("/admin/users/$userId")({
  component: AdminUserDetailPage,
});

function AdminUserDetailPage() {
  const { userId } = useParams({ from: "/admin/users/$userId" });
  const navigate = useNavigate();
  const { admin, loading: authLoading } = useAdminAuth();
  const [user, setUser] = useState<any>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [userError, setUserError] = useState<string | null>(null);
  const [showBalances, setShowBalances] = useState(true);
  const { transactions, loading: txLoading, error: txError } = useUserTransactionsById(userId);

  // Backdate control state
  const [backdateInput, setBackdateInput] = useState("");
  const [backdateSaving, setBackdateSaving] = useState(false);

  // Fetch user data
  useEffect(() => {
    if (!userId) return;
    setUserLoading(true);
    setUserError(null);

    const userRef = doc(db, "users", userId);
    const unsubscribe = onSnapshot(
      userRef,
      (snap) => {
        if (snap.exists()) {
          setUser({
            id: snap.id,
            ...snap.data(),
            createdAt: snap.data().createdAt?.toDate() ?? new Date(),
          });
        } else {
          setUserError("User not found");
        }
        setUserLoading(false);
      },
      (err) => {
        console.error(err);
        setUserError("Failed to load user data");
        setUserLoading(false);
      },
    );

    return unsubscribe;
  }, [userId]);

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && !admin) {
      navigate({ to: "/admin-login" });
    }
  }, [authLoading, admin, navigate]);

  const handleToggleFreeze = async () => {
    if (!user) return;
    try {
      await toggleUserFreeze(user.id, user.fullName, user.status);
      toast.success(`User ${user.status === "active" ? "frozen" : "unfrozen"} successfully!`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update user status");
    }
  };

  const handleDeleteTransaction = async (tx: any) => {
    if (!window.confirm(`Delete transaction "${tx.description || tx.id.slice(0,8)}" of $${(tx.amount||0).toFixed(2)}? This cannot be undone.`)) return;
    try {
      // Delete from top-level transactions
      await deleteDoc(doc(db, "transactions", tx.id));
      // Delete from user subcollection
      try {
        const userTxQ = query(collection(db, "users", userId, "transactions"), where("transactionRef", "==", tx.transactionRef));
        const snap = await getDocs(userTxQ);
        await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)));
      } catch { /* non-critical */ }
      // Delete related notifications — match by transactionId (doc ID)
      try {
        const notifQ = query(collection(db, "notifications"), where("userId", "==", userId), where("transactionId", "==", tx.id));
        const nSnap = await getDocs(notifQ);
        await Promise.all(nSnap.docs.map((d) => deleteDoc(d.ref)));
      } catch { /* non-critical */ }
      toast.success("Transaction deleted from all records");
    } catch (err) {
      toast.error("Failed to delete transaction");
    }
  };

  const handleSetTransactionMode = async (mode: TransactionMode) => {    if (!user) return;
    // If already in this mode, toggle back to manual
    const newMode: TransactionMode = user.transactionMode === mode ? "manual" : mode;
    try {
      await updateDoc(doc(db, "users", user.id), { transactionMode: newMode });
      const labels: Record<TransactionMode, string> = {
        manual: "Manual review",
        auto_approve: "Auto-approve",
        auto_decline: "Auto-decline",
      };
      toast.success(`Transaction mode set to: ${labels[newMode]}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update transaction mode");
    }
  };

  // ── Backdate control ─────────────────────────────────────────────────
  // Sets a date filter on the user's account so only transactions on or after
  // that date are visible in the user dashboard.
  const handleSetBackdate = async () => {
    if (!user || !backdateInput) return;
    setBackdateSaving(true);
    try {
      const date = new Date(backdateInput + "T00:00:00");
      if (isNaN(date.getTime())) { toast.error("Invalid date"); return; }
      await updateDoc(doc(db, "users", user.id), {
        transactionDateFilter: Timestamp.fromDate(date),
      });
      toast.success(`Transactions will now show from ${date.toLocaleDateString()} onwards`);
      setBackdateInput("");
    } catch (err) {
      toast.error("Failed to set backdate filter");
    } finally {
      setBackdateSaving(false);
    }
  };

  const handleClearBackdate = async () => {
    if (!user) return;
    try {
      await updateDoc(doc(db, "users", user.id), { transactionDateFilter: null });
      toast.success("Backdate filter removed — showing all transactions");
    } catch {
      toast.error("Failed to clear filter");
    }
  };

  // ── Crypto deposit addresses ─────────────────────────────────────────────
  const CRYPTO_COINS = [
    { id: "btc",        label: "Bitcoin (BTC)"         },
    { id: "eth",        label: "Ethereum ERC-20 (ETH)" },
    { id: "usdt_erc20", label: "USDT ERC-20"           },
    { id: "usdt_trc20", label: "USDT TRC-20"           },
    { id: "sol",        label: "Solana (SOL)"          },
    { id: "bnb",        label: "BNB Smart Chain (BNB)" },
  ];
  const [cryptoAddressInputs, setCryptoAddressInputs] = useState<Record<string, string>>({});
  const [cryptoSaving, setCryptoSaving] = useState<string | null>(null);

  const handleSaveCryptoAddress = async (coinId: string) => {
    if (!user) return;
    const addr = (cryptoAddressInputs[coinId] || "").trim();
    if (!addr) { toast.error("Enter a wallet address"); return; }
    setCryptoSaving(coinId);
    try {
      await updateDoc(doc(db, "users", user.id), {
        [`cryptoAddresses.${coinId}`]: addr,
      });
      toast.success(`${coinId.toUpperCase()} deposit address saved`);
      setCryptoAddressInputs((p) => ({ ...p, [coinId]: "" }));
    } catch {
      toast.error("Failed to save address");
    } finally {
      setCryptoSaving(null);
    }
  };

  if (authLoading || userLoading) {
    return (
      <div className="flex items-center justify-center h-full py-24">
        <div className="text-cyan-400 animate-pulse">Loading user details...</div>
      </div>
    );
  }

  if (userError) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-24 gap-4">
        <p className="text-red-400">{userError}</p>
        <Button
          onClick={() => navigate({ to: "/admin/users" })}
          className="bg-cyan-500 hover:bg-cyan-600 text-white"
        >
          Back to Users
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-16">
      {/* Back button */}
      <button
        onClick={() => navigate({ to: "/admin/users" })}
        className="flex items-center gap-2 text-blue-300 hover:text-white transition-colors text-sm font-medium"
      >
        <ArrowLeft size={16} />
        Back to Users
      </button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white">User Details</h1>
          <p className="text-blue-300/60 text-xs mt-0.5">Managing {user.fullName}</p>
        </div>
        <Button
          size="sm"
          className="bg-gradient-to-r from-cyan-500 to-violet-600 text-white gap-2 self-start sm:self-auto"
          onClick={() => navigate({ to: "/admin/chat", search: { userId } })}
        >
          <MessageSquare size={15} />
          Message
        </Button>
      </div>

      {/* Profile + Balances — stack on mobile, side by side on lg */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* ── Profile card ── */}
        <Card className="glass-card border-0 lg:col-span-1">
          <CardContent className="pt-6 space-y-4">
            {/* Avatar + name */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                {user.fullName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-white font-semibold text-base truncate">{user.fullName}</p>
                <p className="text-blue-300/60 text-xs truncate">{user.email}</p>
                <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                  user.status === "active" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                }`}>{user.status}</span>
              </div>
            </div>

            <hr className="border-[rgba(255,255,255,0.05)]" />

            {/* Info rows */}
            <div className="space-y-3">
              {[
                { icon: <Mail size={15} className="text-cyan-400 flex-shrink-0" />, label: "Email", value: user.email },
                { icon: <Phone size={15} className="text-cyan-400 flex-shrink-0" />, label: "Phone", value: user.phone || "Not provided" },
                { icon: <Clock size={15} className="text-cyan-400 flex-shrink-0" />, label: "Registered", value: user.createdAt.toLocaleDateString() },
                { icon: <Shield size={15} className="text-cyan-400 flex-shrink-0" />, label: "Verified",
                  value: user.verified
                    ? <span className="text-green-400 flex items-center gap-1"><CheckCircle2 size={12} />Yes</span>
                    : <span className="text-yellow-400 flex items-center gap-1"><XCircle size={12} />No</span>
                },
              ].map(({ icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  {icon}
                  <div className="min-w-0">
                    <p className="text-xs text-blue-300/50">{label}</p>
                    <p className="text-white text-sm">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            <hr className="border-[rgba(255,255,255,0.05)]" />

            {/* Freeze / Unfreeze */}
            <Button
              className="w-full"
              onClick={handleToggleFreeze}
              style={{
                background: user.status === "active"
                  ? "rgba(239,68,68,0.18)"
                  : "linear-gradient(135deg,#38BDF8,#6366F1)",
                color: "#fff",
                border: user.status === "active" ? "1px solid rgba(239,68,68,0.3)" : "none",
              }}
            >
              {user.status === "active" ? "❄️ Freeze User" : "✅ Unfreeze User"}
            </Button>

            <hr className="border-[rgba(255,255,255,0.05)]" />

            {/* Transaction Mode Controls */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <SlidersHorizontal size={15} className="text-cyan-400" />
                <p className="text-xs font-semibold text-blue-300/70 uppercase tracking-wide">Transaction Mode</p>
              </div>

              {/* Current mode badge */}
              <div className="mb-3 flex items-center justify-center">
                {(user.transactionMode ?? "manual") === "manual" && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    🔍 Manual Review (default)
                  </span>
                )}
                {user.transactionMode === "auto_approve" && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30">
                    ⚡ Auto-Approve Active
                  </span>
                )}
                {user.transactionMode === "auto_decline" && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30">
                    🚫 Auto-Decline Active
                  </span>
                )}
              </div>

              {/* Auto Approve toggle */}
              <button
                onClick={() => handleSetTransactionMode("auto_approve")}
                className="w-full mb-2 py-2.5 px-3 rounded-xl text-sm font-semibold flex items-center justify-between transition-all"
                style={{
                  background: user.transactionMode === "auto_approve"
                    ? "rgba(34,197,94,0.18)"
                    : "rgba(34,197,94,0.06)",
                  color: user.transactionMode === "auto_approve" ? "#22C55E" : "#6B7280",
                  border: `1px solid ${user.transactionMode === "auto_approve" ? "rgba(34,197,94,0.4)" : "rgba(34,197,94,0.15)"}`,
                }}
              >
                <span className="flex items-center gap-2">
                  <Zap size={15} />
                  Auto Approve Transactions
                </span>
                <span
                  className="w-9 h-5 rounded-full flex items-center px-0.5 transition-all"
                  style={{
                    background: user.transactionMode === "auto_approve"
                      ? "#22C55E"
                      : "rgba(255,255,255,0.1)",
                  }}
                >
                  <span
                    className="w-4 h-4 rounded-full bg-white shadow transition-all"
                    style={{
                      transform: user.transactionMode === "auto_approve" ? "translateX(16px)" : "translateX(0)",
                    }}
                  />
                </span>
              </button>

              {/* Auto Decline toggle */}
              <button
                onClick={() => handleSetTransactionMode("auto_decline")}
                className="w-full py-2.5 px-3 rounded-xl text-sm font-semibold flex items-center justify-between transition-all"
                style={{
                  background: user.transactionMode === "auto_decline"
                    ? "rgba(239,68,68,0.18)"
                    : "rgba(239,68,68,0.06)",
                  color: user.transactionMode === "auto_decline" ? "#EF4444" : "#6B7280",
                  border: `1px solid ${user.transactionMode === "auto_decline" ? "rgba(239,68,68,0.4)" : "rgba(239,68,68,0.15)"}`,
                }}
              >
                <span className="flex items-center gap-2">
                  <Ban size={15} />
                  Auto Decline Transactions
                </span>
                <span
                  className="w-9 h-5 rounded-full flex items-center px-0.5 transition-all"
                  style={{
                    background: user.transactionMode === "auto_decline"
                      ? "#EF4444"
                      : "rgba(255,255,255,0.1)",
                  }}
                >
                  <span
                    className="w-4 h-4 rounded-full bg-white shadow transition-all"
                    style={{
                      transform: user.transactionMode === "auto_decline" ? "translateX(16px)" : "translateX(0)",
                    }}
                  />
                </span>
              </button>
            </div>

            <hr className="border-[rgba(255,255,255,0.05)]" />

            {/* ── Backdate / Transaction Visibility Control ── */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <CalendarRange size={15} className="text-cyan-400" />
                <p className="text-xs font-semibold text-blue-300/70 uppercase tracking-wide">Transaction Visibility</p>
              </div>
              <p className="text-xs text-blue-300/50 mb-3 leading-relaxed">
                Set a start date — only transactions on or after this date will appear in the customer's dashboard.
              </p>

              {/* Current filter badge */}
              {user.transactionDateFilter ? (
                <div className="mb-3 flex items-center justify-between p-2.5 rounded-xl"
                  style={{ background: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.2)" }}>
                  <div>
                    <p className="text-xs font-semibold text-cyan-400">Filter Active</p>
                    <p className="text-xs text-blue-300/60 mt-0.5">
                      Showing from: {(user.transactionDateFilter?.toDate?.() ?? new Date(user.transactionDateFilter)).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                    </p>
                  </div>
                  <button
                    onClick={handleClearBackdate}
                    className="text-xs font-semibold px-2 py-1 rounded-lg transition-all"
                    style={{ background: "rgba(239,68,68,0.15)", color: "#EF4444" }}
                  >
                    Clear
                  </button>
                </div>
              ) : (
                <div className="mb-3 px-3 py-2 rounded-xl"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <p className="text-xs text-blue-300/40">No filter — customer sees all transactions</p>
                </div>
              )}

              {/* Date picker + set button */}
              <div className="flex gap-2">
                <input
                  type="date"
                  value={backdateInput}
                  onChange={(e) => setBackdateInput(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl text-xs outline-none"
                  style={{
                    background: "#070B14",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#fff",
                    colorScheme: "dark",
                  }}
                />
                <button
                  onClick={handleSetBackdate}
                  disabled={!backdateInput || backdateSaving}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-white transition-all"
                  style={{
                    background: (!backdateInput || backdateSaving)
                      ? "rgba(56,189,248,0.3)"
                      : "linear-gradient(135deg,#38BDF8,#6366F1)",
                    opacity: (!backdateInput || backdateSaving) ? 0.6 : 1,
                    whiteSpace: "nowrap",
                  }}
                >
                  {backdateSaving ? "Saving…" : "Set Date"}
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Balances card ── */}
        <Card className="glass-card border-0 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-white text-base flex items-center gap-2">
              <Wallet size={18} className="text-cyan-400" />
              Account Balances
            </CardTitle>
            <Button variant="ghost" size="icon"
              onClick={() => setShowBalances(!showBalances)}
              className="text-blue-300 hover:text-white w-8 h-8">
              {showBalances ? <EyeOff size={16} /> : <Eye size={16} />}
            </Button>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-xl" style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.05)" }}>
              <p className="text-xs text-blue-300/60 mb-2">Checking Account</p>
              <p className="text-2xl font-mono font-bold text-cyan-400">
                {showBalances
                  ? formatInCurrency(user.checkingBalance || 0, (user.dashboardCurrency as CurrencyCode) || "USD")
                  : "......"}
              </p>
              <p className="text-xs text-blue-300/50 mt-1">#{user.checkingAccountNumber || "---"}</p>
            </div>
            <div className="p-4 rounded-xl" style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.05)" }}>
              <p className="text-xs text-blue-300/60 mb-2">Savings Account</p>
              <p className="text-2xl font-mono font-bold text-violet-400">
                {showBalances
                  ? formatInCurrency(user.savingsBalance || 0, (user.dashboardCurrency as CurrencyCode) || "USD")
                  : "......"}
              </p>
              <p className="text-xs text-blue-300/50 mt-1">#{user.savingsAccountNumber || "---"}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Crypto Deposit Addresses ── */}
      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle className="text-white text-base flex items-center gap-2">
            <Bitcoin size={18} className="text-cyan-400" />
            Crypto Deposit Addresses
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-blue-300/50">
            Set wallet addresses for each crypto. The customer will see these addresses on their Crypto Deposit page.
          </p>
          {CRYPTO_COINS.map((coin) => {
            const saved = user?.cryptoAddresses?.[coin.id] || "";
            return (
              <div key={coin.id} className="space-y-1.5">
                <label className="text-xs font-semibold text-blue-300/60">{coin.label}</label>
                {saved && (
                  <div className="flex items-center justify-between px-3 py-2 rounded-xl"
                    style={{ background: "rgba(56,189,248,0.06)", border: "1px solid rgba(56,189,248,0.2)" }}>
                    <p className="text-xs font-mono text-cyan-400 truncate flex-1">{saved}</p>
                    <button
                      onClick={() => updateDoc(doc(db, "users", user.id), { [`cryptoAddresses.${coin.id}`]: "" })
                        .then(() => toast.success("Address cleared"))
                        .catch(() => toast.error("Failed"))}
                      className="text-xs text-red-400 ml-2 flex-shrink-0 hover:text-red-300">
                      Clear
                    </button>
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={cryptoAddressInputs[coin.id] || ""}
                    onChange={(e) => setCryptoAddressInputs((p) => ({ ...p, [coin.id]: e.target.value }))}
                    placeholder={saved ? "Update address…" : "Paste wallet address…"}
                    className="flex-1 px-3 py-2 rounded-xl text-xs font-mono outline-none"
                    style={{ background: "#070B14", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
                  />
                  <button
                    onClick={() => handleSaveCryptoAddress(coin.id)}
                    disabled={!cryptoAddressInputs[coin.id]?.trim() || cryptoSaving === coin.id}
                    className="px-3 py-2 rounded-xl text-xs font-semibold text-white flex-shrink-0"
                    style={{
                      background: !cryptoAddressInputs[coin.id]?.trim() || cryptoSaving === coin.id
                        ? "rgba(56,189,248,0.3)" : "linear-gradient(135deg,#38BDF8,#6366F1)",
                      opacity: !cryptoAddressInputs[coin.id]?.trim() ? 0.5 : 1,
                    }}>
                    {cryptoSaving === coin.id ? "…" : "Save"}
                  </button>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* ── Transaction History ── */}
      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle className="text-white text-base flex items-center gap-2">
            <CreditCard size={18} className="text-cyan-400" />
            Transaction History
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {txLoading ? (
            <div className="text-center py-10 text-blue-300/60">Loading transactions...</div>
          ) : txError ? (
            <div className="text-center py-10 text-red-400">{txError}</div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-10 text-blue-300/50">No transactions yet</div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#070B14]">
                    <tr>
                      {["ID", "Date", "Description", "Type", "Amount", "Status", ""].map((h) => (
                        <th key={h} className="text-left py-3 px-4 text-blue-300/50 text-xs font-medium uppercase">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="border-t border-[rgba(255,255,255,0.05)] hover:bg-white/5">
                        <td className="py-3 px-4 text-blue-300/60 font-mono text-xs">#{(tx.transactionRef || tx.id.slice(0,8)).toUpperCase()}</td>
                        <td className="py-3 px-4 text-blue-300/60 text-xs whitespace-nowrap">{tx.createdAt.toLocaleDateString()}</td>
                        <td className="py-3 px-4 text-white text-sm">{tx.description || "-"}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${tx.type === "credit" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>{tx.type}</span>
                        </td>
                        <td className="py-3 px-4 text-cyan-400 font-mono text-sm font-semibold whitespace-nowrap">
                          ${(tx.amount || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            tx.status === "completed" ? "bg-green-500/20 text-green-400"
                            : tx.status === "pending" ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-red-500/20 text-red-400"
                          }`}>{tx.status || "completed"}</span>
                        </td>
                        <td className="py-3 px-4">
                          <button onClick={() => handleDeleteTransaction(tx)}
                            className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors">
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile transaction cards */}
              <div className="sm:hidden divide-y divide-[rgba(255,255,255,0.05)]">
                {transactions.map((tx) => (
                  <div key={tx.id} className="px-4 py-3 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-white text-sm font-medium truncate max-w-[60%]">{tx.description || "Transaction"}</p>
                      <div className="flex items-center gap-2">
                        <p className={`font-mono text-sm font-bold ${tx.type === "credit" ? "text-green-400" : "text-red-400"}`}>
                          {tx.type === "credit" ? "+" : "-"}${(tx.amount || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </p>
                        <button onClick={() => handleDeleteTransaction(tx)} className="p-1 rounded text-red-400 hover:bg-red-500/10">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-blue-300/50 text-xs">{tx.createdAt.toLocaleDateString()}</p>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        tx.status === "completed" ? "bg-green-500/20 text-green-400"
                        : tx.status === "pending" ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-red-500/20 text-red-400"
                      }`}>{tx.status || "completed"}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
