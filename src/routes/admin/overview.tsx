import { useState, useEffect } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Route as AdminRootRoute } from "../admin";
import { Users, Wallet, MessageSquare, Clock, Activity, TrendingUp, Circle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { useUsers } from "../../admin/hooks/useUsers";
import { useTransactions } from "../../admin/hooks/useTransactions";
import { db } from "../../firebase/config";
import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { formatInCurrency, type CurrencyCode } from "../../utils/currency";

export const Route = createFileRoute("/admin/overview")({
  component: AdminOverviewPage,
  getParentRoute: () => AdminRootRoute,
});

function formatCurrency(v: number) {
  if (v >= 1_000_000_000) return `$${(v / 1_000_000_000).toFixed(1)}B`;
  if (v >= 1_000_000)     return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000)         return `$${(v / 1_000).toFixed(1)}K`;
  return `$${v.toFixed(0)}`;
}

// ── Pure-CSS / SVG bar chart — no extra library ────────────────────────────
function BalanceBarChart({ users }: { users: any[] }) {
  const sorted = [...users]
    .map((u) => ({
      name: u.fullName?.split(" ")[0] || "User",
      checking: u.checkingBalance || 0,
      savings: u.savingsBalance || 0,
      total: (u.checkingBalance || 0) + (u.savingsBalance || 0),
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 8);

  if (sorted.length === 0) {
    // Placeholder skeleton bars when no real users
    return (
      <div className="h-[260px] flex flex-col justify-end gap-3 px-2">
        <div className="flex items-end gap-2 h-full">
          {[65, 45, 80, 30, 55, 70, 40, 60].map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full rounded-t-lg opacity-20"
                style={{ height: `${h}%`, background: "linear-gradient(180deg, #38BDF8, #6366F1)" }} />
              <span className="text-[10px] text-blue-300/40">—</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-blue-300/40 text-center">Awaiting user data</p>
      </div>
    );
  }

  const maxVal = Math.max(...sorted.map((u) => u.total), 1);

  return (
    <div className="h-[260px] flex flex-col">
      {/* Legend */}
      <div className="flex items-center gap-4 mb-3">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm" style={{ background: "#38BDF8" }} />
          <span className="text-xs text-blue-300/60">Checking</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm" style={{ background: "#6366F1" }} />
          <span className="text-xs text-blue-300/60">Savings</span>
        </div>
      </div>

      {/* Bars */}
      <div className="flex items-end gap-2 flex-1">
        {sorted.map((u, i) => {
          const checkH = maxVal > 0 ? (u.checking / maxVal) * 100 : 0;
          const savH   = maxVal > 0 ? (u.savings  / maxVal) * 100 : 0;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
              {/* Tooltip on hover */}
              <div className="hidden group-hover:block absolute z-10 bg-[#0A1020] border border-[rgba(255,255,255,0.1)] rounded-lg px-2 py-1.5 text-xs text-white whitespace-nowrap -translate-y-2 pointer-events-none shadow-lg">
                <p className="font-semibold">{u.name}</p>
                <p className="text-cyan-400">Checking: {formatCurrency(u.checking)}</p>
                <p className="text-violet-400">Savings: {formatCurrency(u.savings)}</p>
              </div>
              <div className="w-full flex gap-0.5 items-end relative" style={{ height: "200px" }}>
                {/* Checking bar */}
                <div className="flex-1 rounded-t-md transition-all duration-500"
                  style={{
                    height: `${Math.max(checkH, 2)}%`,
                    background: "linear-gradient(180deg, #38BDF8cc, #38BDF855)",
                    minHeight: "4px",
                  }} />
                {/* Savings bar */}
                <div className="flex-1 rounded-t-md transition-all duration-500"
                  style={{
                    height: `${Math.max(savH, 2)}%`,
                    background: "linear-gradient(180deg, #6366F1cc, #6366F155)",
                    minHeight: "4px",
                  }} />
              </div>
              <span className="text-[9px] text-blue-300/50 truncate w-full text-center">{u.name}</span>
              <span className="text-[9px] text-blue-300/40">{formatCurrency(u.total)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Donut chart for checking vs savings split ──────────────────────────────
function BalanceDonut({ users }: { users: any[] }) {
  const totalChecking = users.reduce((s, u) => s + (u.checkingBalance || 0), 0);
  const totalSavings  = users.reduce((s, u) => s + (u.savingsBalance  || 0), 0);
  const grand = totalChecking + totalSavings || 1;

  const checkPct = (totalChecking / grand) * 100;
  const savPct   = (totalSavings  / grand) * 100;

  const r = 45;
  const circ = 2 * Math.PI * r;
  const checkDash = (checkPct / 100) * circ;
  const savDash   = (savPct   / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-3">
      <svg width="120" height="120" viewBox="0 0 100 100">
        {/* Background ring */}
        <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
        {/* Savings arc */}
        <circle cx="50" cy="50" r={r} fill="none"
          stroke="#6366F1" strokeWidth="10"
          strokeDasharray={`${savDash} ${circ - savDash}`}
          strokeDashoffset={0}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
          style={{ transition: "stroke-dasharray 0.6s ease" }}
        />
        {/* Checking arc */}
        <circle cx="50" cy="50" r={r} fill="none"
          stroke="#38BDF8" strokeWidth="10"
          strokeDasharray={`${checkDash} ${circ - checkDash}`}
          strokeDashoffset={`${-(savDash)}`}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
          style={{ transition: "stroke-dasharray 0.6s ease" }}
        />
        {/* Centre label */}
        <text x="50" y="46" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold">Total</text>
        <text x="50" y="58" textAnchor="middle" fill="#8A9BB5" fontSize="7">{formatCurrency(grand)}</text>
      </svg>
      <div className="flex gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
          <span className="text-blue-300/70">Checking {checkPct.toFixed(0)}%</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-violet-500" />
          <span className="text-blue-300/70">Savings {savPct.toFixed(0)}%</span>
        </div>
      </div>
    </div>
  );
}

function AdminOverviewPage() {
  const { users } = useUsers();
  const { transactions } = useTransactions();
  const [activeChats, setActiveChats] = useState<any[]>([]);

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAssets: 0,
    activeChatsCount: 0,
    transactionsToday: 0,
  });

  // Live chat preview — listen to chats with unread or recent messages
  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, "chats"), orderBy("lastMessageAt", "desc"), limit(5)),
      (snap) => {
        setActiveChats(
          snap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
            lastMessageAt: d.data().lastMessageAt?.toDate?.() ?? new Date(),
          }))
        );
      },
      () => {} // ignore errors silently
    );
    return unsub;
  }, []);

  useEffect(() => {
    let totalAssets = 0;
    users.forEach((user) => {
      totalAssets += (user.checkingBalance || 0) + (user.savingsBalance || 0);
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const txToday = transactions.filter((tx) => {
      const txDate = tx.createdAt?.toDate ? tx.createdAt.toDate() : new Date(tx.createdAt);
      txDate.setHours(0, 0, 0, 0);
      return txDate.getTime() === today.getTime();
    }).length;

    setStats({
      totalUsers: users.length,
      totalAssets,
      activeChatsCount: activeChats.length,
      transactionsToday: txToday,
    });
  }, [users, transactions, activeChats]);

  return (
    <div className="space-y-6">
      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card border-0 shadow-lg shadow-cyan-500/10">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-blue-300/70 font-medium">Total Users</CardTitle>
              <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                <Users className="text-cyan-400 w-5 h-5" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-white font-mono">{stats.totalUsers.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-0 shadow-lg shadow-violet-500/10">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-blue-300/70 font-medium">Total Simulated Assets</CardTitle>
              <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
                <Wallet className="text-violet-400 w-5 h-5" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-white font-mono">${stats.totalAssets.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-0 shadow-lg shadow-yellow-500/10">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-blue-300/70 font-medium">Active Chat Sessions</CardTitle>
              <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                <MessageSquare className="text-yellow-400 w-5 h-5" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-white font-mono">{stats.activeChatsCount}</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-0 shadow-lg shadow-green-500/10">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-blue-300/70 font-medium">Transactions Today</CardTitle>
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <Activity className="text-green-400 w-5 h-5" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-white font-mono">{stats.transactionsToday.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      {/* Balance Distribution + Top Balances */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 glass-card border-0">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white font-semibold flex items-center gap-2">
                <TrendingUp size={18} className="text-cyan-400" />
                Balance Distribution
              </CardTitle>
              <Button variant="ghost" className="h-8 text-cyan-400 border border-cyan-500/30 bg-cyan-500/10">
                All Users
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Bar chart */}
            <BalanceBarChart users={users} />
          </CardContent>
        </Card>

        <Card className="glass-card border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-white font-semibold">Top Balances</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Donut chart summary */}
            {users.length > 0 && (
              <div className="mb-4">
                <BalanceDonut users={users} />
              </div>
            )}
            <div className="space-y-2">
              {(() => {
                const sortedUsers = [...users]
                  .sort((a, b) => {
                    const balanceA = (a.checkingBalance || 0) + (a.savingsBalance || 0);
                    const balanceB = (b.checkingBalance || 0) + (b.savingsBalance || 0);
                    return balanceB - balanceA;
                  })
                  .slice(0, 5);

                if (sortedUsers.length === 0) {
                  return <p className="text-[#8A9BB5] text-sm text-center py-4">No users yet</p>;
                }

                return sortedUsers.map((user, index) => (
                  <Link key={user.id} to={`/admin/accounts?user=${user.id}`}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-all group">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-sm truncate">{user.fullName}</p>
                      <p className="text-blue-300/60 text-xs truncate">{user.email}</p>
                    </div>
                    <p className="text-white font-mono text-xs font-semibold flex-shrink-0 whitespace-nowrap">
                      {formatInCurrency(
                        (user.checkingBalance || 0) + (user.savingsBalance || 0),
                        (user.dashboardCurrency as CurrencyCode) || "USD"
                      )}
                    </p>
                  </Link>
                ));
              })()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent activity + Live chat preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="glass-card border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-white font-semibold">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {transactions.length === 0 ? (
                <p className="text-[#8A9BB5] text-sm text-center py-4">No activity yet</p>
              ) : (
                transactions.slice(0, 5).map((tx) => (
                  <div key={tx.id} className="flex items-start gap-2 p-2 rounded-lg hover:bg-white/5">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${tx.type === "credit" ? "bg-green-400" : "bg-red-400"}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm truncate">{tx.description}</p>
                      <p className="text-blue-300/60 text-xs truncate">{tx.userFullName || "Unknown User"}</p>
                    </div>
                    <div className="flex flex-col items-end gap-0.5 flex-shrink-0 ml-2">
                      <span className={`font-mono text-xs font-semibold whitespace-nowrap ${tx.type === "credit" ? "text-green-400" : "text-red-400"}`}>
                        {tx.type === "credit" ? "+" : "-"}${Math.abs(tx.amount || 0).toLocaleString()}
                      </span>
                      <div className="flex items-center gap-1 text-blue-300/50 text-xs whitespace-nowrap">
                        <Clock size={10} />
                        {tx.createdAt?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* ── Live Chat Preview ── */}
        <Card className="glass-card border-0">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white font-semibold flex items-center gap-2">
                <MessageSquare size={16} className="text-cyan-400" />
                Live Chat Preview
              </CardTitle>
              <Link to="/admin/chat">
                <Button variant="ghost" className="h-8 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10">
                  Open Chat Centre →
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {activeChats.length === 0 ? (
              /* Empty state — still looks good */
              <div className="flex flex-col items-center justify-center py-8 gap-3">
                <div className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.15)" }}>
                  <MessageSquare size={24} className="text-cyan-400 opacity-50" />
                </div>
                <p className="text-sm font-semibold text-white/60">All quiet right now</p>
                <p className="text-xs text-blue-300/40 text-center max-w-[180px]">
                  Chat sessions will appear here when customers start a conversation
                </p>
                <Link to="/admin/chat">
                  <button className="mt-1 px-4 py-2 rounded-xl text-xs font-semibold text-cyan-400 transition-all"
                    style={{ background: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.2)" }}>
                    Go to Chat Centre
                  </button>
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {activeChats.map((chat) => {
                  const unread = chat.unreadByAdmin || 0;
                  const initials = (chat.userFullName || "U").split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();
                  const timeStr = chat.lastMessageAt instanceof Date
                    ? chat.lastMessageAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                    : "";
                  return (
                    <Link key={chat.id} to="/admin/chat"
                      className="flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-white/5"
                      style={{ border: "1px solid rgba(255,255,255,0.05)" }}>
                      {/* Avatar */}
                      <div className="relative flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 flex items-center justify-center text-white text-sm font-bold">
                          {initials}
                        </div>
                        {/* Online dot */}
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#0D1625]"
                          style={{ background: "#00E676" }} />
                      </div>
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-semibold truncate">{chat.userFullName || "Customer"}</p>
                        <p className="text-blue-300/50 text-xs truncate">{chat.lastMessage || "Started a conversation"}</p>
                      </div>
                      {/* Right side */}
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <span className="text-blue-300/40 text-xs">{timeStr}</span>
                        {unread > 0 && (
                          <span className="min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                            style={{ background: "#FF4D6A" }}>
                            {unread > 9 ? "9+" : unread}
                          </span>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
