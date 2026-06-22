import { useState, useEffect } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Route as AdminRootRoute } from "../admin";
import { Users, Wallet, MessageSquare, Clock, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { useUsers } from "../../admin/hooks/useUsers";
import { useTransactions } from "../../admin/hooks/useTransactions";

// Empty data
const chartData = [];
const recentActivity = [];

export const Route = createFileRoute("/admin/overview")({
  component: AdminOverviewPage,
  getParentRoute: () => AdminRootRoute,
});

function AdminOverviewPage() {
  const { users } = useUsers();
  const { transactions } = useTransactions();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAssets: 0,
    activeChats: 0,
    transactionsToday: 0,
  });

  useEffect(() => {
    let totalAssets = 0;
    users.forEach((user) => {
      totalAssets += (user.checkingBalance || 0) + (user.savingsBalance || 0);
    });

    // Count transactions today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const txToday = transactions.filter((tx) => {
      const txDate = tx.createdAt?.toDate ? tx.createdAt.toDate() : new Date(tx.createdAt);
      txDate.setHours(0, 0, 0, 0);
      return txDate.getTime() === today.getTime();
    }).length;

    setStats((prev) => ({
      ...prev,
      totalUsers: users.length,
      totalAssets,
      transactionsToday: txToday,
    }));
  }, [users, transactions]);

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
            <p className="text-3xl font-bold text-white font-mono">
              {stats.totalUsers.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card border-0 shadow-lg shadow-violet-500/10">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-blue-300/70 font-medium">
                Total Simulated Assets
              </CardTitle>
              <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
                <Wallet className="text-violet-400 w-5 h-5" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-white font-mono">
              ${stats.totalAssets.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card border-0 shadow-lg shadow-yellow-500/10">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-blue-300/70 font-medium">
                Active Chat Sessions
              </CardTitle>
              <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                <MessageSquare className="text-yellow-400 w-5 h-5" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-white font-mono">{stats.activeChats}</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-0 shadow-lg shadow-green-500/10">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-blue-300/70 font-medium">
                Transactions Today
              </CardTitle>
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <Activity className="text-green-400 w-5 h-5" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-white font-mono">
              {stats.transactionsToday.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and top users */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 glass-card border-0">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white font-semibold">Balance Distribution</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  className="h-8 text-cyan-400 border border-cyan-500/30 bg-cyan-500/10"
                >
                  All Users
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full flex items-center justify-center text-[#8A9BB5]">
              No data yet
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-white font-semibold">Top Balances</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(() => {
                // Sort users by total balance descending
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
                  <Link
                    key={user.id}
                    to={`/admin/accounts?user=${user.id}`}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-all group"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-sm truncate">{user.fullName}</p>
                      <p className="text-blue-300/60 text-xs truncate">{user.email}</p>
                    </div>
                    <p className="text-white font-mono text-sm font-semibold">
                      ${((user.checkingBalance || 0) + (user.savingsBalance || 0)).toLocaleString()}
                    </p>
                  </Link>
                ));
              })()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent activity and chat preview */}
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
                transactions.slice(0, 5).map((tx) => {
                  return (
                    <div
                      key={tx.id}
                      className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5"
                    >
                      <div
                        className={`w-2 h-2 rounded-full mt-2 ${tx.type === "credit" ? "bg-green-400" : "bg-red-400"}`}
                      ></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm">{tx.description}</p>
                        <p className="text-blue-300/60 text-xs">
                          {tx.userFullName || "Unknown User"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-mono text-sm font-semibold ${tx.type === "credit" ? "text-green-400" : "text-red-400"}`}
                        >
                          {tx.type === "credit" ? "+" : ""}$
                          {Math.abs(tx.amount || 0).toLocaleString()}
                        </span>
                        <div className="flex items-center gap-1 text-blue-300/50 text-xs">
                          <Clock size={12} />
                          {tx.createdAt?.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-0">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white font-semibold">Live Chat Preview</CardTitle>
              <Link to="/admin/chat">
                <Button
                  variant="ghost"
                  className="h-8 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
                >
                  Open Chat Centre →
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-[#8A9BB5] text-sm text-center py-4">No active chats</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
