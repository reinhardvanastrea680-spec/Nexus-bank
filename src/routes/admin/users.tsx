import { useState, useMemo } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Plus, Search, Eye, Snowflake, Trash2, Users, ChevronRight, Zap, Ban } from "lucide-react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { toast } from "sonner";
import { useUsers } from "../../admin/hooks/useUsers";
import { toggleUserFreeze } from "../../admin/utils/toggleUserFreeze";
import { deleteUserAndData } from "../../admin/utils/deleteUserAndData";
import { AddUserModal } from "../../admin/components/AddUserModal";
import { db } from "../../firebase/config";
import { doc, updateDoc } from "firebase/firestore";
import { formatInCurrency, type CurrencyCode } from "../../utils/currency";

export const Route = createFileRoute("/admin/users")({
  component: AdminUsersPage,
});

const ITEMS_PER_PAGE = 20;

function AdminUsersPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter]         = useState<"all" | "active" | "frozen">("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [page, setPage]             = useState(1);
  const { users, loading }          = useUsers();

  const filteredUsers = useMemo(() => users.filter((u) => {
    const matchSearch = u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchFilter = filter === "all" || u.status === filter;
    return matchSearch && matchFilter;
  }), [users, searchTerm, filter]);

  // Paginate to reduce DOM nodes and improve TBT
  const pagedUsers = filteredUsers.slice(0, page * ITEMS_PER_PAGE);
  const hasMore    = pagedUsers.length < filteredUsers.length;

  const handleToggleFreeze = async (user: any, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await toggleUserFreeze(user.id, user.fullName, user.status);
      toast.success(`User ${user.status === "active" ? "frozen" : "unfrozen"}`);
    } catch { toast.error("Failed to update user status"); }
  };

  const handleToggleTxMode = async (user: any, mode: "auto_approve" | "auto_decline", e: React.MouseEvent) => {
    e.stopPropagation();
    const newMode = user.transactionMode === mode ? "manual" : mode;
    try {
      await updateDoc(doc(db, "users", user.id), { transactionMode: newMode });
      const label = newMode === "auto_approve" ? "Auto-Approve" : newMode === "auto_decline" ? "Auto-Decline" : "Manual Review";
      toast.success(`${user.fullName}: ${label} mode set`);
    } catch { toast.error("Failed to update transaction mode"); }
  };

  const handleDelete = async (user: any, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm(`Delete ${user.fullName} and all their data?`)) return;
    try {
      await deleteUserAndData(user.id, user.fullName);
      toast.success("User deleted");
    } catch { toast.error("Failed to delete user"); }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
            <Users size={22} className="text-cyan-400" aria-hidden="true" />
            User Management
          </h1>
          <p className="text-blue-300/60 text-xs md:text-sm mt-0.5">Manage all Nexus Bank users</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} size="sm"
          className="bg-gradient-to-r from-cyan-500 to-violet-600 text-white gap-1.5 shrink-0">
          <Plus size={16} aria-hidden="true" />
          <span className="hidden sm:inline">Add User</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>

      <AddUserModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300/50" aria-hidden="true" />
          <Input placeholder="Search users..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
            aria-label="Search users"
            className="pl-10 bg-[#070B14] border-[rgba(255,255,255,0.1)] text-white placeholder:text-blue-300/50" />
        </div>
        <div className="flex gap-2">
          {(["all", "active", "frozen"] as const).map((f) => (
            <button key={f} onClick={() => { setFilter(f); setPage(1); }}
              className="px-3 py-2 rounded-lg text-sm font-semibold capitalize transition-all flex-1 sm:flex-none"
              style={{
                background: filter === f ? "rgba(56,189,248,0.15)" : "rgba(255,255,255,0.04)",
                color: filter === f ? "#38BDF8" : "#8A9BB5",
                border: `1px solid ${filter === f ? "rgba(56,189,248,0.3)" : "transparent"}`,
              }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Total", value: users.length, color: "#38BDF8" },
          { label: "Active", value: users.filter(u => u.status === "active").length, color: "#00E676" },
          { label: "Frozen", value: users.filter(u => u.status === "frozen").length, color: "#FF4D6A" },
        ].map(({ label, value, color }) => (
          <div key={label} className="p-3 rounded-xl text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="text-xl font-bold font-mono" style={{ color }}>{value}</p>
            <p className="text-xs text-blue-300/60 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Desktop table / Mobile cards */}
      {loading ? (
        <Card className="glass-card border-0"><div className="py-12 text-center text-[#8A9BB5]">Loading users...</div></Card>
      ) : filteredUsers.length === 0 ? (
        <Card className="glass-card border-0"><div className="py-12 text-center text-[#8A9BB5]">No users found</div></Card>
      ) : (
        <>
          {/* ── Desktop table (hidden on mobile) ── */}
          <Card className="glass-card border-0 overflow-hidden hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead className="bg-[#070B14]">
                  <tr>
                    {["#", "User", "Status", "Checking", "Savings", "Created", "Tx Mode", "Actions"].map((h) => (
                      <th key={h} className="text-left py-3 px-4 text-blue-300/60 text-xs font-medium uppercase whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pagedUsers.map((user, i) => (
                    <tr key={user.id} className="border-t border-[rgba(255,255,255,0.05)] hover:bg-white/5 cursor-pointer"
                      onClick={() => {
                        console.log("Table row: Navigating to user:", user.id);
                        window.location.href = `/admin/users/${user.id}`;
                      }}>
                      <td className="py-3 px-4 text-blue-300/60 font-mono text-sm">{i + 1}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0" aria-hidden="true">
                            {user.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-white font-medium text-sm truncate">{user.fullName}</p>
                            <p className="text-blue-300/60 text-xs truncate">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${user.status === "active" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-white font-mono text-sm whitespace-nowrap">
                        {formatInCurrency(user.checkingBalance || 0, (user.dashboardCurrency as CurrencyCode) || "USD")}
                      </td>
                      <td className="py-3 px-4 text-white font-mono text-sm whitespace-nowrap">
                        {formatInCurrency(user.savingsBalance || 0, (user.dashboardCurrency as CurrencyCode) || "USD")}
                      </td>
                      <td className="py-3 px-4 text-blue-300/60 text-xs whitespace-nowrap">
                        {user.createdAt?.toLocaleDateString?.() || "-"}
                      </td>
                      {/* Transaction Mode column */}
                      <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1.5">
                          <button
                            title="Auto Approve: transactions immediately complete"
                            onClick={(e) => handleToggleTxMode(user, "auto_approve", e)}
                            className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition-all"
                            style={{
                              background: user.transactionMode === "auto_approve" ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.04)",
                              color: user.transactionMode === "auto_approve" ? "#22C55E" : "#8A9BB5",
                              border: `1px solid ${user.transactionMode === "auto_approve" ? "rgba(34,197,94,0.4)" : "rgba(255,255,255,0.08)"}`,
                            }}>
                            <Zap size={11} />
                            Approve
                          </button>
                          <button
                            title="Auto Decline: transactions immediately decline"
                            onClick={(e) => handleToggleTxMode(user, "auto_decline", e)}
                            className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition-all"
                            style={{
                              background: user.transactionMode === "auto_decline" ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.04)",
                              color: user.transactionMode === "auto_decline" ? "#EF4444" : "#8A9BB5",
                              border: `1px solid ${user.transactionMode === "auto_decline" ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.08)"}`,
                            }}>
                            <Ban size={11} />
                            Decline
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" aria-label={`View ${user.fullName}`}
                            className="w-8 h-8 text-blue-300 hover:text-white hover:bg-blue-500/10"
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log("Navigating to user:", user.id);
                              window.location.href = `/admin/users/${user.id}`;
                            }}>
                            <Eye size={14} aria-hidden="true" />
                          </Button>
                          <Button variant="ghost" size="icon" aria-label={`${user.status === "active" ? "Freeze" : "Unfreeze"} ${user.fullName}`}
                            className="w-8 h-8 text-blue-300 hover:text-white hover:bg-blue-500/10"
                            onClick={(e) => handleToggleFreeze(user, e)}>
                            <Snowflake size={14} aria-hidden="true" />
                          </Button>
                          <Button variant="ghost" size="icon" aria-label={`Delete ${user.fullName}`}
                            className="w-8 h-8 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            onClick={(e) => handleDelete(user, e)}>
                            <Trash2 size={14} aria-hidden="true" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* ── Mobile card list (hidden on md+) ── */}
          <div className="space-y-2 md:hidden">
            {pagedUsers.map((user) => (
              <div key={user.id}
                className="rounded-2xl overflow-hidden"
                style={{ background: "#0F1829", border: "1px solid rgba(255,255,255,0.06)" }}>

                {/* Main row — tap to go to detail page */}
                <div
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer active:bg-white/5"
                  onClick={() => {
                    console.log("Mobile: Navigating to user:", user.id);
                    window.location.href = `/admin/users/${user.id}`;
                  }}
                  role="button" tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      console.log("Mobile keyboard: Navigating to user:", user.id);
                      window.location.href = `/admin/users/${user.id}`;
                    }
                  }}>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm truncate">{user.fullName}</p>
                    <p className="text-blue-300/50 text-xs truncate">{user.email}</p>
                  </div>
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${user.status === "active" ? "bg-green-400" : "bg-red-400"}`} />
                  <ChevronRight size={16} className="text-blue-300/40 flex-shrink-0" aria-hidden="true" />
                </div>

                {/* Action buttons row */}
                <div className="flex items-center gap-1 px-3 pb-3 pt-0 flex-wrap"
                  onClick={(e) => e.stopPropagation()}>
                  {/* View detail */}
                  <button onClick={(e) => {
                    e.stopPropagation();
                    console.log("Mobile button: Navigating to user:", user.id);
                    window.location.href = `/admin/users/${user.id}`;
                  }}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold"
                    style={{ background: "rgba(56,189,248,0.1)", color: "#38BDF8" }}>
                    <Eye size={12} /> View
                  </button>
                  {/* Freeze/Unfreeze */}
                  <button onClick={(e) => handleToggleFreeze(user, e)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold"
                    style={{ background: user.status === "active" ? "rgba(56,189,248,0.08)" : "rgba(0,230,118,0.08)", color: user.status === "active" ? "#38BDF8" : "#00E676" }}>
                    <Snowflake size={12} /> {user.status === "active" ? "Freeze" : "Unfreeze"}
                  </button>
                  {/* Auto Approve */}
                  <button onClick={(e) => handleToggleTxMode(user, "auto_approve", e)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold"
                    style={{
                      background: user.transactionMode === "auto_approve" ? "rgba(34,197,94,0.2)" : "rgba(34,197,94,0.06)",
                      color: user.transactionMode === "auto_approve" ? "#22C55E" : "#6B7280",
                      border: `1px solid ${user.transactionMode === "auto_approve" ? "rgba(34,197,94,0.4)" : "rgba(255,255,255,0.08)"}`,
                    }}>
                    <Zap size={12} /> Approve
                  </button>
                  {/* Auto Decline */}
                  <button onClick={(e) => handleToggleTxMode(user, "auto_decline", e)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold"
                    style={{
                      background: user.transactionMode === "auto_decline" ? "rgba(239,68,68,0.2)" : "rgba(239,68,68,0.06)",
                      color: user.transactionMode === "auto_decline" ? "#EF4444" : "#6B7280",
                      border: `1px solid ${user.transactionMode === "auto_decline" ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.08)"}`,
                    }}>
                    <Ban size={12} /> Decline
                  </button>
                  {/* Delete */}
                  <button onClick={(e) => handleDelete(user, e)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold ml-auto"
                    style={{ background: "rgba(239,68,68,0.08)", color: "#EF4444" }}>
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {hasMore && (
            <button onClick={() => setPage((p) => p + 1)}
              className="w-full py-3 rounded-xl text-sm font-semibold transition-all"
              style={{ background: "rgba(255,255,255,0.04)", color: "#8A9BB5", border: "1px solid rgba(255,255,255,0.06)" }}>
              Load more ({filteredUsers.length - pagedUsers.length} remaining)
            </button>
          )}

          <p className="text-xs text-center text-blue-300/40">
            Showing {pagedUsers.length} of {filteredUsers.length} users
          </p>
        </>
      )}
    </div>
  );
}
