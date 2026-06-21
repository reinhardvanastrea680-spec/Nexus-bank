import { useState, useEffect } from "react";
import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  User,
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
    <div className="space-y-6 pb-12">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: "/admin/users" })}
          className="text-blue-300 hover:text-white"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">User Details</h1>
          <p className="text-blue-300/70 mt-1">View and manage {user.fullName}</p>
        </div>
        <div className="flex gap-3">
          <Button
            className="bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-600 hover:to-violet-700 text-white"
            onClick={() => navigate({ to: "/admin/chat", search: { userId } })}
          >
            <MessageSquare size={18} className="mr-2" />
            Message User
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Profile Card */}
        <Card className="lg:col-span-1 glass-card border-0">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <User size={20} className="text-cyan-400" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 flex items-center justify-center text-white text-3xl font-bold">
                {user.fullName.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="text-center">
              <p className="text-white text-xl font-semibold">{user.fullName}</p>
              <p className="text-blue-300/70 text-sm">{user.email}</p>
              <span
                className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-medium ${
                  user.status === "active"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {user.status}
              </span>
            </div>
            <hr className="border-[rgba(255,255,255,0.05)]" />
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail size={18} className="text-cyan-400 mt-0.5" />
                <div>
                  <p className="text-xs text-blue-300/60">Email</p>
                  <p className="text-white text-sm">{user.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={18} className="text-cyan-400 mt-0.5" />
                <div>
                  <p className="text-xs text-blue-300/60">Phone</p>
                  <p className="text-white text-sm">{user.phone || "Not provided"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={18} className="text-cyan-400 mt-0.5" />
                <div>
                  <p className="text-xs text-blue-300/60">Registration Date</p>
                  <p className="text-white text-sm">
                    {user.createdAt.toLocaleDateString()} {user.createdAt.toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield size={18} className="text-cyan-400 mt-0.5" />
                <div>
                  <p className="text-xs text-blue-300/60">Verification</p>
                  <p className="text-white text-sm flex items-center gap-1">
                    {user.verified ? (
                      <>
                        <CheckCircle2 size={14} className="text-green-400" />
                        Verified
                      </>
                    ) : (
                      <>
                        <XCircle size={14} className="text-yellow-400" />
                        Unverified
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
            <hr className="border-[rgba(255,255,255,0.05)]" />
            <div className="flex gap-3">
              <Button
                className="flex-1"
                onClick={handleToggleFreeze}
                variant={user.status === "active" ? "destructive" : "default"}
                style={{
                  background:
                    user.status === "active"
                      ? "rgba(239, 68, 68, 0.2)"
                      : "linear-gradient(135deg, #38BDF8, #6366F1)",
                  color: "white",
                  border: user.status === "active" ? "1px solid rgba(239, 68, 68, 0.3)" : "none",
                }}
              >
                {user.status === "active" ? "Freeze User" : "Unfreeze User"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Account Balances */}
        <Card className="lg:col-span-2 glass-card border-0">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Wallet size={20} className="text-cyan-400" />
              Account Balances
            </CardTitle>
            <Button
              variant="ghost"
              onClick={() => setShowBalances(!showBalances)}
              className="text-blue-300 hover:text-white"
            >
              {showBalances ? <EyeOff size={18} /> : <Eye size={18} />}
            </Button>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#111827] border border-[rgba(255,255,255,0.05)]">
              <p className="text-sm text-blue-300/60 mb-2">Checking Account</p>
              <p className="text-2xl font-mono font-bold text-cyan-400">
                {showBalances
                  ? `$${(user.checkingBalance || 0).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}`
                  : "••••••"}
              </p>
              <p className="text-xs text-blue-300/60 mt-1">
                #{user.checkingAccountNumber || "---"}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#111827] border border-[rgba(255,255,255,0.05)]">
              <p className="text-sm text-blue-300/60 mb-2">Savings Account</p>
              <p className="text-2xl font-mono font-bold text-violet-400">
                {showBalances
                  ? `$${(user.savingsBalance || 0).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}`
                  : "••••••"}
              </p>
              <p className="text-xs text-blue-300/60 mt-1">#{user.savingsAccountNumber || "---"}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions */}
      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <CreditCard size={20} className="text-cyan-400" />
            Transaction History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {txLoading ? (
            <div className="text-center py-12 text-[#8A9BB5]">Loading transactions...</div>
          ) : txError ? (
            <div className="text-center py-12 text-red-400">{txError}</div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12 text-[#8A9BB5]">No transactions yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#070B14]">
                  <tr>
                    <th className="text-left py-4 px-6 text-blue-300/60 text-xs font-medium uppercase">
                      Transaction ID
                    </th>
                    <th className="text-left py-4 px-6 text-blue-300/60 text-xs font-medium uppercase">
                      Date
                    </th>
                    <th className="text-left py-4 px-6 text-blue-300/60 text-xs font-medium uppercase">
                      Description
                    </th>
                    <th className="text-left py-4 px-6 text-blue-300/60 text-xs font-medium uppercase">
                      Type
                    </th>
                    <th className="text-left py-4 px-6 text-blue-300/60 text-xs font-medium uppercase">
                      Amount
                    </th>
                    <th className="text-left py-4 px-6 text-blue-300/60 text-xs font-medium uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr
                      key={tx.id}
                      className="border-t border-[rgba(255,255,255,0.05)] hover:bg-white/5"
                    >
                      <td className="py-4 px-6 text-blue-300/70 font-mono text-sm">
                        #{tx.transactionRef || tx.id.slice(0, 8).toUpperCase()}
                      </td>
                      <td className="py-4 px-6 text-blue-300/70 text-sm">
                        {tx.createdAt.toLocaleDateString()} {tx.createdAt.toLocaleTimeString()}
                      </td>
                      <td className="py-4 px-6 text-white text-sm">{tx.description || "-"}</td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            tx.type === "credit"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {tx.type}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-cyan-400 font-mono text-sm font-semibold">
                        $
                        {(tx.amount || 0).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            (tx.status || "completed") === "completed"
                              ? "bg-green-500/20 text-green-400"
                              : (tx.status || "pending") === "pending"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {tx.status || "completed"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
