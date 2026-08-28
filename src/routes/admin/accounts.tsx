import { useState } from "react";
import { createFileRoute, useSearch, useNavigate } from "@tanstack/react-router";
import { Search, Copy, Edit2, Plus, Minus, DollarSign, Wallet, Trash2, PenLine, ToggleLeft, ToggleRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../../components/ui/dialog";
import { useUsers } from "../../admin/hooks/useUsers";
import { setBalanceDirectly } from "../../admin/utils/setBalanceDirectly";
import { postTransaction } from "../../admin/utils/postTransaction";
import { useCustomAccounts } from "../../dashboard/hooks/useCustomAccounts";
import {
  createCustomAccount, setCustomAccountBalance, postCustomAccountTransaction,
  renameCustomAccount, setCustomAccountStatus, deleteCustomAccount,
  type CustomAccount,
} from "../../admin/utils/customAccountOps";
import { db } from "../../firebase/config";
import { doc, updateDoc } from "firebase/firestore";
import { CURRENCIES, formatInCurrency, type CurrencyCode } from "../../utils/currency";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/accounts")({ component: AdminAccountsPage });

function fmt(v: number) {
  return v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

type EditMode = "set" | "credit" | "debit";

const modeLabel: Record<EditMode, string> = { set: "Set Balance", credit: "Add Funds", debit: "Deduct Funds" };
const modeColor: Record<EditMode, string> = { set: "#38BDF8", credit: "#00E676", debit: "#FF4D6A" };
const modeDesc: Record<EditMode, string> = {
  set:    "Directly overrides the balance. No transaction record is created.",
  credit: "Adds funds. A credit transaction record will be saved.",
  debit:  "Removes funds. A debit transaction record will be saved.",
};

// Standard account edit state
interface StdEditState { account: "checking" | "savings"; mode: EditMode; currentBalance: number; }
// Custom account edit state
interface CustEditState { acct: CustomAccount; mode: EditMode; }

function AdminAccountsPage() {
  const search = useSearch({ strict: false });
  const { users, loading } = useUsers();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm]   = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(search.user ? String(search.user) : null);

  // Standard account edit
  const [stdEdit, setStdEdit]         = useState<StdEditState | null>(null);
  const [editAmount, setEditAmount]   = useState("");
  const [editDesc, setEditDesc]       = useState("");
  const [editLoading, setEditLoading] = useState(false);

  // Custom account edit
  const [custEdit, setCustEdit]       = useState<CustEditState | null>(null);

  // Create custom account dialog
  const [showCreate, setShowCreate]   = useState(false);
  const [newAcctName, setNewAcctName] = useState("");
  const [newAcctBal, setNewAcctBal]   = useState("0");
  const [createLoading, setCreateLoading] = useState(false);

  // Rename dialog
  const [renameAcct, setRenameAcct]   = useState<CustomAccount | null>(null);
  const [renameTo, setRenameTo]       = useState("");
  const [renameLoading, setRenameLoading] = useState(false);

  // Delete confirmation
  const [deleteAcct, setDeleteAcct]   = useState<CustomAccount | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const filteredUsers = users.filter((u) =>
    u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const selectedUser  = selectedUserId ? users.find((u) => u.id === selectedUserId) : null;
  const { customAccounts } = useCustomAccounts(selectedUserId);

  const totalBalance = selectedUser
    ? (selectedUser.checkingBalance || 0) + (selectedUser.savingsBalance || 0) +
      customAccounts.reduce((s, a) => s + (a.balance || 0), 0)
    : 0;

  // ── Standard account handlers ───────────────────────────────────────────────
  const openStd = (account: "checking" | "savings", mode: EditMode, bal: number) => {
    setStdEdit({ account, mode, currentBalance: bal });
    setEditAmount(mode === "set" ? bal.toFixed(2) : "");
    setEditDesc("");
  };

  const getStdPreview = (): number => {
    if (!stdEdit) return 0;
    const amt = parseFloat(editAmount) || 0;
    if (stdEdit.mode === "set")    return amt;
    if (stdEdit.mode === "credit") return stdEdit.currentBalance + amt;
    return Math.max(0, stdEdit.currentBalance - amt);
  };

  const handleStdSave = async () => {
    if (!selectedUser || !stdEdit) return;
    const amt = parseFloat(editAmount);
    if (isNaN(amt) || amt < 0) { toast.error("Enter a valid amount"); return; }
    setEditLoading(true);
    try {
      const { account, mode, currentBalance } = stdEdit;
      if (mode === "set") {
        await setBalanceDirectly(selectedUser.id, selectedUser.fullName, account, amt, currentBalance);
        toast.success(`${account} balance set to $${fmt(amt)}`);
      } else {
        await postTransaction({
          userId: selectedUser.id, userFullName: selectedUser.fullName,
          account, type: mode === "credit" ? "credit" : "debit", amount: amt,
          description: editDesc.trim() || (mode === "credit" ? "Admin Credit" : "Admin Debit"),
          category: "Admin Adjustment", adminNote: `Manual ${mode} by admin`, currentBalance,
        });
        toast.success(`$${fmt(amt)} ${mode === "credit" ? "credited to" : "debited from"} ${account}`);
      }
      setStdEdit(null);
    } catch (err: any) {
      toast.error(err?.message || "Failed to update balance");
    } finally { setEditLoading(false); }
  };

  // ── Custom account handlers ─────────────────────────────────────────────────
  const openCust = (acct: CustomAccount, mode: EditMode) => {
    setCustEdit({ acct, mode });
    setEditAmount(mode === "set" ? (acct.balance || 0).toFixed(2) : "");
    setEditDesc("");
  };

  const getCustPreview = (): number => {
    if (!custEdit) return 0;
    const amt = parseFloat(editAmount) || 0;
    const cur = custEdit.acct.balance || 0;
    if (custEdit.mode === "set")    return amt;
    if (custEdit.mode === "credit") return cur + amt;
    return Math.max(0, cur - amt);
  };

  const handleCustSave = async () => {
    if (!selectedUser || !custEdit) return;
    const amt = parseFloat(editAmount);
    if (isNaN(amt) || amt < 0) { toast.error("Enter a valid amount"); return; }
    setEditLoading(true);
    try {
      const { acct, mode } = custEdit;
      if (mode === "set") {
        await setCustomAccountBalance(selectedUser.id, selectedUser.fullName, acct.id, acct.name, amt, acct.balance || 0);
        toast.success(`"${acct.name}" balance set to $${fmt(amt)}`);
      } else {
        await postCustomAccountTransaction(
          selectedUser.id, selectedUser.fullName, acct.id, acct.name,
          mode === "credit" ? "credit" : "debit", amt,
          editDesc.trim() || (mode === "credit" ? "Admin Credit" : "Admin Debit"),
          acct.balance || 0,
        );
        toast.success(`$${fmt(amt)} ${mode === "credit" ? "credited to" : "debited from"} "${acct.name}"`);
      }
      setCustEdit(null);
    } catch (err: any) {
      toast.error(err?.message || "Failed to update balance");
    } finally { setEditLoading(false); }
  };

  const handleCreate = async () => {
    if (!selectedUser) return;
    const name = newAcctName.trim();
    if (!name) { toast.error("Account name is required"); return; }
    const bal = parseFloat(newAcctBal) || 0;
    if (bal < 0) { toast.error("Balance cannot be negative"); return; }
    setCreateLoading(true);
    try {
      await createCustomAccount(selectedUser.id, selectedUser.fullName, name, bal);
      toast.success(`"${name}" account created`);
      setShowCreate(false);
      setNewAcctName("");
      setNewAcctBal("0");
    } catch (err: any) {
      toast.error(err?.message || "Failed to create account");
    } finally { setCreateLoading(false); }
  };

  const handleRename = async () => {
    if (!selectedUser || !renameAcct) return;
    const name = renameTo.trim();
    if (!name) { toast.error("Name is required"); return; }
    setRenameLoading(true);
    try {
      await renameCustomAccount(selectedUser.id, selectedUser.fullName, renameAcct.id, name);
      toast.success("Account renamed");
      setRenameAcct(null);
    } catch (err: any) {
      toast.error(err?.message || "Rename failed");
    } finally { setRenameLoading(false); }
  };

  const handleToggleStatus = async (acct: CustomAccount) => {
    if (!selectedUser) return;
    const next = acct.status === "active" ? "frozen" : "active";
    try {
      await setCustomAccountStatus(selectedUser.id, selectedUser.fullName, acct.id, acct.name, next);
      toast.success(`"${acct.name}" ${next}`);
    } catch (err: any) {
      toast.error(err?.message || "Failed to update status");
    }
  };

  const handleDelete = async () => {
    if (!selectedUser || !deleteAcct) return;
    setDeleteLoading(true);
    try {
      await deleteCustomAccount(selectedUser.id, selectedUser.fullName, deleteAcct.id, deleteAcct.name, deleteAcct.balance || 0);
      toast.success(`"${deleteAcct.name}" deleted`);
      setDeleteAcct(null);
    } catch (err: any) {
      toast.error(err?.message || "Delete failed");
    } finally { setDeleteLoading(false); }
  };

  // Shared edit state for rendering the edit dialog
  const activeEdit = stdEdit ? {
    mode: stdEdit.mode,
    label: `${stdEdit.account.charAt(0).toUpperCase() + stdEdit.account.slice(1)}`,
    balance: stdEdit.currentBalance,
    preview: getStdPreview(),
    onSave: handleStdSave,
    onClose: () => setStdEdit(null),
  } : custEdit ? {
    mode: custEdit.mode,
    label: custEdit.acct.name,
    balance: custEdit.acct.balance || 0,
    preview: getCustPreview(),
    onSave: handleCustSave,
    onClose: () => setCustEdit(null),
  } : null;

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Wallet className="text-cyan-400" size={24} />
          Account Control
        </h1>
        <p className="text-blue-300/60 text-sm mt-1">Manage and edit user account balances</p>
      </div>

      {loading ? (
        <Card className="glass-card border-0"><CardContent className="py-12 text-center text-[#8A9BB5]">Loading users...</CardContent></Card>
      ) : users.length === 0 ? (
        <Card className="glass-card border-0"><CardContent className="py-12 text-center text-[#8A9BB5]">No users yet.</CardContent></Card>
      ) : (
        <Card className="glass-card border-0">
          <CardContent className="pt-6">
            {/* Search + Select */}
            <div className="mb-6 flex flex-col gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300/50" />
                <Input placeholder="Search users..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-[#070B14] border-[rgba(255,255,255,0.1)] text-white placeholder:text-blue-300/50" />
              </div>
              <Select value={selectedUserId || ""} onValueChange={(v) => { setSelectedUserId(v || null); navigate({ to: "/admin/accounts", search: { user: v } }); }}>
                <SelectTrigger className="w-full bg-[#070B14] border-[rgba(255,255,255,0.1)] text-white">
                  <SelectValue placeholder="Select a user" />
                </SelectTrigger>
                <SelectContent className="bg-[#0D1625] border-[rgba(255,255,255,0.1)] text-white max-h-60 overflow-y-auto">
                  {filteredUsers.map((u) => (
                    <SelectItem key={u.id} value={u.id}>{u.fullName} ({u.email})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {!selectedUser ? (
              <div className="text-center py-12 text-[#8A9BB5]">Select a user to view and edit their accounts</div>
            ) : (
              <>
                {/* User summary */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-[#070B14] p-4 rounded-xl mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      {selectedUser.fullName.split(" ").map((n: string) => n[0]).join("").toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{selectedUser.fullName}</h3>
                      <p className="text-blue-300/60 text-sm">{selectedUser.email}</p>
                    </div>
                  </div>
                  <div className="sm:text-right">
                    <p className="text-white font-bold font-mono text-xl">
                      {formatInCurrency(totalBalance, (selectedUser.dashboardCurrency as CurrencyCode) || "USD")}
                    </p>
                    <p className="text-blue-300/60 text-xs">Total Balance</p>
                  </div>
                </div>

                {/* Standard accounts grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {([
                    { type: "checking" as const, label: "Checking", balance: selectedUser.checkingBalance || 0, accountNumber: selectedUser.checkingAccountNumber },
                    { type: "savings"  as const, label: "Savings",  balance: selectedUser.savingsBalance  || 0, accountNumber: selectedUser.savingsAccountNumber  },
                  ]).map((acct) => (
                    <Card key={acct.type} className="border border-[rgba(255,255,255,0.05)] bg-[#0D1625]">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <CardTitle className="text-white text-base">{acct.label} Account</CardTitle>
                          <div className="flex items-center gap-2 bg-[#070B14] px-3 py-1 rounded-lg flex-shrink-0">
                            <span className="text-blue-300/70 text-sm font-mono">
                              {acct.accountNumber ? `****${acct.accountNumber.slice(-4)}` : "****0000"}
                            </span>
                            {acct.accountNumber && (
                              <button onClick={() => navigator.clipboard.writeText(acct.accountNumber).then(() => toast.success("Copied!"))}
                                className="text-blue-300 hover:text-white">
                                <Copy size={14} />
                              </button>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="text-center py-3 rounded-xl" style={{ background: "rgba(56,189,248,0.05)" }}>
                          <p className="text-blue-300/60 text-xs mb-1">Current Balance</p>
                          <p className="text-3xl font-bold text-cyan-400 font-mono">
                            {formatInCurrency(acct.balance, (selectedUser.dashboardCurrency as CurrencyCode) || "USD")}
                          </p>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {([
                            { mode: "set"    as EditMode, icon: Edit2, label: "Set",    color: "#38BDF8", bg: "rgba(56,189,248,0.1)",  border: "rgba(56,189,248,0.2)"  },
                            { mode: "credit" as EditMode, icon: Plus,  label: "Credit", color: "#00E676", bg: "rgba(0,230,118,0.1)",   border: "rgba(0,230,118,0.2)"   },
                            { mode: "debit"  as EditMode, icon: Minus, label: "Debit",  color: "#FF4D6A", bg: "rgba(255,77,106,0.1)",  border: "rgba(255,77,106,0.2)"  },
                          ]).map(({ mode, icon: Icon, label, color, bg, border }) => (
                            <button key={mode} onClick={() => openStd(acct.type, mode, acct.balance)}
                              className="flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all hover:opacity-90 active:scale-95"
                              style={{ background: bg, border: `1px solid ${border}` }}>
                              <Icon size={16} style={{ color }} />
                              <span className="text-xs font-semibold" style={{ color }}>{label}</span>
                            </button>
                          ))}
                        </div>
                        <p className="text-xs text-center text-blue-300/40">Set overrides · Credit/Debit logs transaction</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Custom accounts section */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-semibold flex items-center gap-2">
                      <Wallet size={16} className="text-cyan-400" />
                      Custom Accounts
                      <span className="text-xs text-blue-300/50 font-normal">({customAccounts.length})</span>
                    </h3>
                    <button onClick={() => { setNewAcctName(""); setNewAcctBal("0"); setShowCreate(true); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all hover:opacity-90"
                      style={{ background: "linear-gradient(135deg,#38BDF8,#6366F1)", color: "#fff" }}>
                      <Plus size={14} />
                      Add Account
                    </button>
                  </div>

                  {customAccounts.length === 0 ? (
                    <div className="text-center py-6 rounded-xl border border-dashed border-[rgba(255,255,255,0.1)] text-blue-300/40 text-sm">
                      No custom accounts yet — click "Add Account" to create one
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {customAccounts.map((acct) => (
                        <Card key={acct.id} className="border border-[rgba(255,255,255,0.05)] bg-[#0D1625]">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <div className="flex items-center gap-2 min-w-0">
                                <CardTitle className="text-white text-base truncate">{acct.name}</CardTitle>
                                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0 ${acct.status === "active" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                                  {acct.status}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 flex-shrink-0">
                                <button onClick={() => { setRenameAcct(acct); setRenameTo(acct.name); }}
                                  className="p-1.5 rounded-lg hover:bg-white/5 text-blue-300/60 hover:text-white" title="Rename">
                                  <PenLine size={13} />
                                </button>
                                <button onClick={() => handleToggleStatus(acct)}
                                  className="p-1.5 rounded-lg hover:bg-white/5 text-blue-300/60 hover:text-white" title="Toggle status">
                                  {acct.status === "active" ? <ToggleRight size={15} className="text-green-400" /> : <ToggleLeft size={15} className="text-red-400" />}
                                </button>
                                <button onClick={() => setDeleteAcct(acct)}
                                  className="p-1.5 rounded-lg hover:bg-red-500/20 text-blue-300/60 hover:text-red-400" title="Delete">
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 bg-[#070B14] px-3 py-1 rounded-lg w-fit mt-1">
                              <span className="text-blue-300/70 text-sm font-mono">
                                {acct.accountNumber ? `****${acct.accountNumber.slice(-4)}` : "****0000"}
                              </span>
                              {acct.accountNumber && (
                                <button onClick={() => navigator.clipboard.writeText(acct.accountNumber).then(() => toast.success("Copied!"))}
                                  className="text-blue-300 hover:text-white">
                                  <Copy size={13} />
                                </button>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="text-center py-3 rounded-xl" style={{ background: "rgba(99,102,241,0.07)" }}>
                              <p className="text-blue-300/60 text-xs mb-1">Current Balance</p>
                              <p className="text-3xl font-bold font-mono" style={{ color: "#a78bfa" }}>
                                {formatInCurrency(acct.balance || 0, (selectedUser.dashboardCurrency as CurrencyCode) || "USD")}
                              </p>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              {([
                                { mode: "set"    as EditMode, icon: Edit2, label: "Set",    color: "#38BDF8", bg: "rgba(56,189,248,0.1)",  border: "rgba(56,189,248,0.2)"  },
                                { mode: "credit" as EditMode, icon: Plus,  label: "Credit", color: "#00E676", bg: "rgba(0,230,118,0.1)",   border: "rgba(0,230,118,0.2)"   },
                                { mode: "debit"  as EditMode, icon: Minus, label: "Debit",  color: "#FF4D6A", bg: "rgba(255,77,106,0.1)",  border: "rgba(255,77,106,0.2)"  },
                              ]).map(({ mode, icon: Icon, label, color, bg, border }) => (
                                <button key={mode} onClick={() => openCust(acct, mode)}
                                  disabled={acct.status === "frozen"}
                                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all hover:opacity-90 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
                                  style={{ background: bg, border: `1px solid ${border}` }}>
                                  <Icon size={16} style={{ color }} />
                                  <span className="text-xs font-semibold" style={{ color }}>{label}</span>
                                </button>
                              ))}
                            </div>
                            <p className="text-xs text-center text-blue-300/40">Set overrides · Credit/Debit logs transaction</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>

                {/* Currency Control */}
                <Card className="border border-[rgba(255,255,255,0.05)] bg-[#0D1625]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-white text-base flex items-center gap-2">
                      <DollarSign size={16} className="text-cyan-400" />
                      Display Currency
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-blue-300/50 text-xs">
                      Balances are stored in USD. Choose how they display in the customer's dashboard. Amounts are automatically converted using standard exchange rates.
                    </p>
                    <div className="flex gap-3 items-end">
                      <div className="flex-1">
                        <label className="block text-xs font-semibold text-blue-300/60 mb-2">Current: {selectedUser.dashboardCurrency || "USD"}</label>
                        <select defaultValue={selectedUser.dashboardCurrency || "USD"}
                          onChange={async (e) => {
                            try {
                              await updateDoc(doc(db, "users", selectedUser.id), { dashboardCurrency: e.target.value });
                              toast.success(`Currency changed to ${e.target.value}`);
                            } catch { toast.error("Failed to update currency"); }
                          }}
                          className="w-full h-10 px-3 rounded-xl text-sm outline-none"
                          style={{ background: "#070B14", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}>
                          {Object.entries(CURRENCIES).map(([code, { symbol, name }]) => (
                            <option key={code} value={code}>{symbol} {code} — {name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* ── Shared Balance Edit Dialog (standard + custom) ── */}
      <Dialog open={!!activeEdit} onOpenChange={(open) => { if (!open) { setStdEdit(null); setCustEdit(null); } }}>
        <DialogContent className="bg-[#0F1829] border-[rgba(255,255,255,0.1)] w-[calc(100vw-2rem)] max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2" style={{ color: activeEdit ? modeColor[activeEdit.mode] : "#FFFFFF" }}>
              <DollarSign size={18} />
              {activeEdit ? modeLabel[activeEdit.mode] : "Edit"} — {activeEdit?.label}
            </DialogTitle>
            <DialogDescription className="text-blue-300/60 text-sm">
              {activeEdit ? modeDesc[activeEdit.mode] : ""}
            </DialogDescription>
          </DialogHeader>
          {activeEdit && (
            <div className="space-y-4 py-2">
              <div className="flex justify-between items-center p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="text-sm text-blue-300/60">Current balance</span>
                <span className="text-white font-mono font-semibold">${fmt(activeEdit.balance)}</span>
              </div>
              <div>
                <label className="block text-sm font-semibold text-blue-300/70 mb-2">
                  {activeEdit.mode === "set" ? "New Balance" : "Amount"}
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-mono" style={{ color: modeColor[activeEdit.mode] }}>$</span>
                  <input type="number" min="0" step="0.01" value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)} placeholder="0.00" autoFocus
                    className="w-full pl-10 pr-4 py-4 rounded-xl text-xl font-mono font-bold outline-none"
                    style={{ background: "#070B14", color: modeColor[activeEdit.mode], border: `1px solid ${modeColor[activeEdit.mode]}33` }} />
                </div>
              </div>
              {activeEdit.mode !== "set" && (
                <div>
                  <label className="block text-sm font-semibold text-blue-300/70 mb-2">Description (optional)</label>
                  <input type="text" value={editDesc} onChange={(e) => setEditDesc(e.target.value)}
                    placeholder={activeEdit.mode === "credit" ? "e.g. Bonus credit" : "e.g. Fee deduction"}
                    className="w-full px-4 py-3 rounded-xl outline-none text-white"
                    style={{ background: "#070B14", border: "1px solid rgba(255,255,255,0.1)" }} />
                </div>
              )}
              {editAmount && !isNaN(parseFloat(editAmount)) && (
                <div className="p-4 rounded-xl space-y-2"
                  style={{ background: `${modeColor[activeEdit.mode]}0D`, border: `1px solid ${modeColor[activeEdit.mode]}33` }}>
                  <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: modeColor[activeEdit.mode] }}>Preview</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-300/60">Before</span>
                    <span className="text-white font-mono">${fmt(activeEdit.balance)}</span>
                  </div>
                  {activeEdit.mode !== "set" && (
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-300/60">{activeEdit.mode === "credit" ? "+ Adding" : "− Removing"}</span>
                      <span className="font-mono" style={{ color: modeColor[activeEdit.mode] }}>${fmt(parseFloat(editAmount) || 0)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm border-t pt-2" style={{ borderColor: `${modeColor[activeEdit.mode]}33` }}>
                    <span className="font-semibold" style={{ color: modeColor[activeEdit.mode] }}>After</span>
                    <span className="font-mono font-bold text-lg" style={{ color: modeColor[activeEdit.mode] }}>${fmt(activeEdit.preview)}</span>
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
            <Button onClick={() => { setStdEdit(null); setCustEdit(null); }} className="w-full sm:w-auto bg-transparent border border-[rgba(255,255,255,0.1)] text-blue-300/60 hover:bg-white/5">
              Cancel
            </Button>
            <Button onClick={activeEdit?.onSave} disabled={editLoading || !editAmount || isNaN(parseFloat(editAmount)) || parseFloat(editAmount) < 0}
              className="w-full sm:w-auto text-white font-semibold"
              style={{ background: activeEdit ? `linear-gradient(135deg,${modeColor[activeEdit.mode]}99,${modeColor[activeEdit.mode]})` : "#38BDF8", opacity: editLoading ? 0.6 : 1 }}>
              {editLoading ? "Saving..." : activeEdit ? modeLabel[activeEdit.mode] : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Create Custom Account Dialog ── */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="bg-[#0F1829] border-[rgba(255,255,255,0.1)] w-[calc(100vw-2rem)] max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-cyan-400 flex items-center gap-2"><Plus size={18} /> New Custom Account</DialogTitle>
            <DialogDescription className="text-blue-300/60 text-sm">
              Create a new named account for {selectedUser?.fullName}. The account will appear on their dashboard.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="block text-sm font-semibold text-blue-300/70 mb-2">Account Name *</label>
              <input type="text" value={newAcctName} onChange={(e) => setNewAcctName(e.target.value)}
                placeholder="e.g. Investment, Money Market, Crypto Reserve..."
                className="w-full px-4 py-3 rounded-xl outline-none text-white"
                style={{ background: "#070B14", border: "1px solid rgba(255,255,255,0.15)" }} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-300/70 mb-2">Opening Balance (USD)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-mono text-cyan-400">$</span>
                <input type="number" min="0" step="0.01" value={newAcctBal} onChange={(e) => setNewAcctBal(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-10 pr-4 py-4 rounded-xl text-xl font-mono font-bold outline-none text-cyan-400"
                  style={{ background: "#070B14", border: "1px solid rgba(56,189,248,0.3)" }} />
              </div>
              <p className="text-xs text-blue-300/40 mt-1">Set to 0 to create an empty account</p>
            </div>
          </div>
          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
            <Button onClick={() => setShowCreate(false)} className="w-full sm:w-auto bg-transparent border border-[rgba(255,255,255,0.1)] text-blue-300/60 hover:bg-white/5">
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={createLoading || !newAcctName.trim()}
              className="w-full sm:w-auto text-white font-semibold"
              style={{ background: "linear-gradient(135deg,#38BDF8,#6366F1)", opacity: createLoading ? 0.6 : 1 }}>
              {createLoading ? "Creating..." : "Create Account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Rename Dialog ── */}
      <Dialog open={!!renameAcct} onOpenChange={(open) => !open && setRenameAcct(null)}>
        <DialogContent className="bg-[#0F1829] border-[rgba(255,255,255,0.1)] w-[calc(100vw-2rem)] max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-blue-300 flex items-center gap-2"><PenLine size={18} /> Rename Account</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <label className="block text-sm font-semibold text-blue-300/70 mb-2">New Name</label>
            <input type="text" value={renameTo} onChange={(e) => setRenameTo(e.target.value)}
              placeholder="Account name..."
              className="w-full px-4 py-3 rounded-xl outline-none text-white"
              style={{ background: "#070B14", border: "1px solid rgba(255,255,255,0.15)" }} />
          </div>
          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
            <Button onClick={() => setRenameAcct(null)} className="w-full sm:w-auto bg-transparent border border-[rgba(255,255,255,0.1)] text-blue-300/60 hover:bg-white/5">
              Cancel
            </Button>
            <Button onClick={handleRename} disabled={renameLoading || !renameTo.trim()}
              className="w-full sm:w-auto text-white font-semibold"
              style={{ background: "linear-gradient(135deg,#38BDF8,#6366F1)", opacity: renameLoading ? 0.6 : 1 }}>
              {renameLoading ? "Saving..." : "Rename"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirmation ── */}
      <Dialog open={!!deleteAcct} onOpenChange={(open) => !open && setDeleteAcct(null)}>
        <DialogContent className="bg-[#0F1829] border-[rgba(255,255,255,0.1)] w-[calc(100vw-2rem)] max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-red-400 flex items-center gap-2"><Trash2 size={18} /> Delete Account</DialogTitle>
            <DialogDescription className="text-blue-300/60 text-sm">
              This will permanently delete the <strong className="text-white">"{deleteAcct?.name}"</strong> account
              {(deleteAcct?.balance || 0) > 0 && ` and remove its balance of $${fmt(deleteAcct?.balance || 0)} from the user's total`}.
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
            <Button onClick={() => setDeleteAcct(null)} className="w-full sm:w-auto bg-transparent border border-[rgba(255,255,255,0.1)] text-blue-300/60 hover:bg-white/5">
              Cancel
            </Button>
            <Button onClick={handleDelete} disabled={deleteLoading}
              className="w-full sm:w-auto text-white font-semibold"
              style={{ background: "linear-gradient(135deg,#FF4D6A,#c0392b)", opacity: deleteLoading ? 0.6 : 1 }}>
              {deleteLoading ? "Deleting..." : "Delete Account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
