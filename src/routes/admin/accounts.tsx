import { useState } from "react";
import { createFileRoute, useSearch, useNavigate } from "@tanstack/react-router";
import { Search, Copy, Edit2, Plus, Minus, DollarSign, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../../components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "../../components/ui/dialog";
import { useUsers } from "../../admin/hooks/useUsers";
import { setBalanceDirectly } from "../../admin/utils/setBalanceDirectly";
import { postTransaction }    from "../../admin/utils/postTransaction";
import { db } from "../../firebase/config";
import { doc, updateDoc } from "firebase/firestore";
import { CURRENCIES } from "../../utils/currency";
import { formatInCurrency, type CurrencyCode } from "../../utils/currency";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/accounts")({
  component: AdminAccountsPage,
});

function formatCurrency(v: number) {
  return v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

type EditMode = "set" | "credit" | "debit";
interface EditState { account: "checking" | "savings"; mode: EditMode; currentBalance: number; }

const modeLabel: Record<EditMode, string> = { set: "Set Balance", credit: "Add Funds", debit: "Deduct Funds" };
const modeColor: Record<EditMode, string> = { set: "#38BDF8", credit: "#00E676", debit: "#FF4D6A" };
const modeDesc: Record<EditMode, string>  = {
  set:    "Directly overrides the balance. No transaction record is created.",
  credit: "Adds funds. A credit transaction record will be saved.",
  debit:  "Removes funds. A debit transaction record will be saved.",
};

function AdminAccountsPage() {
  const search = useSearch({ strict: false });
  const { users, loading } = useUsers();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(search.user ? String(search.user) : null);

  // Edit dialog
  const [editState, setEditState]       = useState<EditState | null>(null);
  const [editAmount, setEditAmount]     = useState("");
  const [editDesc, setEditDesc]         = useState("");
  const [editLoading, setEditLoading]   = useState(false);

  const filteredUsers = users.filter((u) =>
    u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const selectedUser = selectedUserId ? users.find((u) => u.id === selectedUserId) : null;
  const totalBalance = selectedUser
    ? (selectedUser.checkingBalance || 0) + (selectedUser.savingsBalance || 0)
    : 0;

  const openEdit = (account: "checking" | "savings", mode: EditMode, currentBalance: number) => {
    setEditState({ account, mode, currentBalance });
    setEditAmount(mode === "set" ? currentBalance.toFixed(2) : "");
    setEditDesc("");
  };

  const getPreviewBalance = (): number => {
    if (!editState) return 0;
    const amt = parseFloat(editAmount) || 0;
    if (editState.mode === "set")    return amt;
    if (editState.mode === "credit") return editState.currentBalance + amt;
    return Math.max(0, editState.currentBalance - amt);
  };

  const handleSave = async () => {
    if (!selectedUser || !editState) return;
    const amt = parseFloat(editAmount);
    if (isNaN(amt) || amt < 0) { toast.error("Enter a valid amount"); return; }
    setEditLoading(true);
    try {
      const { account, mode, currentBalance } = editState;
      if (mode === "set") {
        await setBalanceDirectly(selectedUser.id, selectedUser.fullName, account, amt, currentBalance);
        toast.success(`${account} balance set to $${formatCurrency(amt)}`);
      } else {
        await postTransaction({
          userId: selectedUser.id, userFullName: selectedUser.fullName,
          account, type: mode === "credit" ? "credit" : "debit", amount: amt,
          description: editDesc.trim() || (mode === "credit" ? "Admin Credit" : "Admin Debit"),
          category: "Admin Adjustment", adminNote: `Manual ${mode} by admin`, currentBalance,
        });
        toast.success(`$${formatCurrency(amt)} ${mode === "credit" ? "credited to" : "debited from"} ${account}`);
      }
      setEditState(null);
    } catch (err: any) {
      toast.error(err?.message || "Failed to update balance");
    } finally { setEditLoading(false); }
  };

  return (
    <div className="space-y-4">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Wallet className="text-cyan-400" size={24} aria-hidden="true" />
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

            {/* Search + Select row */}
            <div className="mb-6 flex flex-col gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300/50" aria-hidden="true" />
                <Input placeholder="Search users..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label="Search users"
                  className="pl-10 bg-[#070B14] border-[rgba(255,255,255,0.1)] text-white placeholder:text-blue-300/50" />
              </div>
              <Select value={selectedUserId || ""} onValueChange={(v) => { setSelectedUserId(v || null); navigate({ to: "/admin/accounts", search: { user: v } }); }}>
                <SelectTrigger className="w-full bg-[#070B14] border-[rgba(255,255,255,0.1)] text-white" aria-label="Select user">
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
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0" aria-hidden="true">
                      {selectedUser.fullName.split(" ").map((n: string) => n[0]).join("").toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-white font-semibold truncate">{selectedUser.fullName}</h3>
                      <p className="text-blue-300/60 text-sm truncate">{selectedUser.email}</p>
                    </div>
                  </div>
                  <div className="sm:text-right">
                    <p className="text-white font-bold font-mono text-xl">
                      {formatInCurrency(totalBalance, (selectedUser.dashboardCurrency as CurrencyCode) || "USD")}
                    </p>
                    <p className="text-blue-300/60 text-xs">Total Balance</p>
                  </div>
                </div>

                {/* Account cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                className="text-blue-300 hover:text-white" aria-label="Copy account number">
                                <Copy size={14} aria-hidden="true" />
                              </button>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Balance */}
                        <div className="text-center py-3 rounded-xl" style={{ background: "rgba(56,189,248,0.05)" }}>
                          <p className="text-blue-300/60 text-xs mb-1">Current Balance</p>
                          <p className="text-3xl font-bold text-cyan-400 font-mono">
                            {formatInCurrency(acct.balance, (selectedUser.dashboardCurrency as CurrencyCode) || "USD")}
                          </p>
                        </div>

                        {/* Action buttons */}
                        <div className="grid grid-cols-3 gap-2">
                          {([
                            { mode: "set"    as const, icon: Edit2,  label: "Set",    color: "#38BDF8", bg: "rgba(56,189,248,0.1)",  border: "rgba(56,189,248,0.2)"  },
                            { mode: "credit" as const, icon: Plus,   label: "Credit", color: "#00E676", bg: "rgba(0,230,118,0.1)",   border: "rgba(0,230,118,0.2)"   },
                            { mode: "debit"  as const, icon: Minus,  label: "Debit",  color: "#FF4D6A", bg: "rgba(255,77,106,0.1)",  border: "rgba(255,77,106,0.2)"  },
                          ]).map(({ mode, icon: Icon, label, color, bg, border }) => (
                            <button key={mode}
                              onClick={() => openEdit(acct.type, mode, acct.balance)}
                              aria-label={`${label} ${acct.label} account`}
                              className="flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all hover:opacity-90 active:scale-95"
                              style={{ background: bg, border: `1px solid ${border}` }}>
                              <Icon size={16} style={{ color }} aria-hidden="true" />
                              <span className="text-xs font-semibold" style={{ color }}>{label}</span>
                            </button>
                          ))}
                        </div>
                        <p className="text-xs text-center text-blue-300/40">Set overrides · Credit/Debit logs transaction</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* ── Currency Control ── */}
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
                        <select
                          id="currency-select"
                          defaultValue={selectedUser.dashboardCurrency || "USD"}
                          onChange={async (e) => {
                            const newCurrency = e.target.value;
                            try {
                              await updateDoc(doc(db, "users", selectedUser.id), { dashboardCurrency: newCurrency });
                              toast.success(`Currency changed to ${newCurrency} — customer dashboard will update automatically`);
                            } catch {
                              toast.error("Failed to update currency");
                            }
                          }}
                          className="w-full h-10 px-3 rounded-xl text-sm outline-none"
                          style={{ background: "#070B14", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
                        >
                          {Object.entries(CURRENCIES).map(([code, { symbol, name }]) => (
                            <option key={code} value={code}>{symbol} {code} — {name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <p className="text-xs text-blue-300/40">
                      Example: $1,000 USD → {CURRENCIES[selectedUser.dashboardCurrency as keyof typeof CURRENCIES]
                        ? `${CURRENCIES[selectedUser.dashboardCurrency as keyof typeof CURRENCIES].symbol}${(1000 * CURRENCIES[selectedUser.dashboardCurrency as keyof typeof CURRENCIES].rateFromUSD).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${selectedUser.dashboardCurrency}`
                        : "$1,000.00 USD"}
                    </p>
                  </CardContent>
                </Card>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editState} onOpenChange={(open) => !open && setEditState(null)}>
        <DialogContent className="bg-[#0F1829] border-[rgba(255,255,255,0.1)] w-[calc(100vw-2rem)] max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2" style={{ color: editState ? modeColor[editState.mode] : "#FFFFFF" }}>
              <DollarSign size={18} aria-hidden="true" />
              {editState ? modeLabel[editState.mode] : "Edit"} — <span className="capitalize">{editState?.account}</span>
            </DialogTitle>
            <DialogDescription className="text-blue-300/60 text-sm">
              {editState ? modeDesc[editState.mode] : ""}
            </DialogDescription>
          </DialogHeader>

          {editState && selectedUser && (
            <div className="space-y-4 py-2">
              {/* Current balance */}
              <div className="flex justify-between items-center p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="text-sm text-blue-300/60">Current balance</span>
                <span className="text-white font-mono font-semibold">${formatCurrency(editState.currentBalance)}</span>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-semibold text-blue-300/70 mb-2" htmlFor="edit-amount">
                  {editState.mode === "set" ? "New Balance" : "Amount"}
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-mono" style={{ color: modeColor[editState.mode] }} aria-hidden="true">$</span>
                  <input id="edit-amount" type="number" min="0" step="0.01" value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)} placeholder="0.00" autoFocus
                    aria-label={editState.mode === "set" ? "New balance amount" : "Transaction amount"}
                    className="w-full pl-10 pr-4 py-4 rounded-xl text-xl font-mono font-bold outline-none"
                    style={{ background: "#070B14", color: modeColor[editState.mode], border: `1px solid ${modeColor[editState.mode]}33` }} />
                </div>
                <p className="text-xs text-blue-300/40 mt-1">Maximum: $99,999,999.99</p>
              </div>

              {/* Description */}
              {editState.mode !== "set" && (
                <div>
                  <label className="block text-sm font-semibold text-blue-300/70 mb-2" htmlFor="edit-desc">Description (optional)</label>
                  <input id="edit-desc" type="text" value={editDesc} onChange={(e) => setEditDesc(e.target.value)}
                    placeholder={editState.mode === "credit" ? "e.g. Bonus credit" : "e.g. Fee deduction"}
                    className="w-full px-4 py-3 rounded-xl outline-none text-white"
                    style={{ background: "#070B14", border: "1px solid rgba(255,255,255,0.1)" }} />
                </div>
              )}

              {/* Preview */}
              {editAmount && !isNaN(parseFloat(editAmount)) && (
                <div className="p-4 rounded-xl space-y-2"
                  style={{ background: `${modeColor[editState.mode]}0D`, border: `1px solid ${modeColor[editState.mode]}33` }}>
                  <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: modeColor[editState.mode] }}>Preview</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-300/60">Before</span>
                    <span className="text-white font-mono">${formatCurrency(editState.currentBalance)}</span>
                  </div>
                  {editState.mode !== "set" && (
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-300/60">{editState.mode === "credit" ? "+ Adding" : "− Removing"}</span>
                      <span className="font-mono" style={{ color: modeColor[editState.mode] }}>${formatCurrency(parseFloat(editAmount) || 0)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm border-t pt-2" style={{ borderColor: `${modeColor[editState.mode]}33` }}>
                    <span className="font-semibold" style={{ color: modeColor[editState.mode] }}>After</span>
                    <span className="font-mono font-bold text-lg" style={{ color: modeColor[editState.mode] }}>${formatCurrency(getPreviewBalance())}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
            <Button onClick={() => setEditState(null)} className="w-full sm:w-auto bg-transparent border border-[rgba(255,255,255,0.1)] text-blue-300/60 hover:bg-white/5">
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={editLoading || !editAmount || isNaN(parseFloat(editAmount)) || parseFloat(editAmount) < 0}
              className="w-full sm:w-auto text-white font-semibold"
              style={{ background: editState ? `linear-gradient(135deg, ${modeColor[editState.mode]}99, ${modeColor[editState.mode]})` : "#38BDF8", opacity: editLoading ? 0.6 : 1 }}>
              {editLoading ? "Saving..." : editState ? modeLabel[editState.mode] : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
