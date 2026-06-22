import { useState, useEffect } from "react";
import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Mail,
  Phone,
  Shield,
  Clock,
  CreditCard,
  MessageSquare,
  Wallet,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAdminAuth } from "../../admin/hooks/useAdminAuth";
import { useUserTransactionsById } from "../../admin/hooks/useUserTransactionsById";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { db } from "../../firebase/config";
import { doc, onSnapshot } from "firebase/firestore";
import { toast } from "sonner";
import { toggleUserFreeze } from "../../admin/utils/toggleUserFreeze";

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
                  ? `$${(user.checkingBalance || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}`
                  : "••••••"}
              </p>
              <p className="text-xs text-blue-300/50 mt-1">#{user.checkingAccountNumber || "---"}</p>
            </div>
            <div className="p-4 rounded-xl" style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.05)" }}>
              <p className="text-xs text-blue-300/60 mb-2">Savings Account</p>
              <p className="text-2xl font-mono font-bold text-violet-400">
                {showBalances
                  ? `$${(user.savingsBalance || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}`
                  : "••••••"}
              </p>
              <p className="text-xs text-blue-300/50 mt-1">#{user.savingsAccountNumber || "---"}</p>
            </div>
          </CardContent>
        </Card>
      </div>

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
                      {["ID", "Date", "Description", "Type", "Amount", "Status"].map((h) => (
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
                      <p className="text-white text-sm font-medium">{tx.description || "Transaction"}</p>
                      <p className={`font-mono text-sm font-bold ${tx.type === "credit" ? "text-green-400" : "text-red-400"}`}>
                        {tx.type === "credit" ? "+" : "-"}${(tx.amount || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </p>
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
