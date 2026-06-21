import { useState } from "react";
import { createFileRoute, useSearch, useNavigate } from "@tanstack/react-router";
import { Search, Copy, Edit2, CheckCircle2, XCircle, Plus, Minus, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../components/ui/dialog";
import { useUsers } from "../../admin/hooks/useUsers";
import { setBalanceDirectly } from "../../admin/utils/setBalanceDirectly";
import { postTransaction } from "../../admin/utils/postTransaction";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/accounts")({
  component: AdminAccountsPage,
});

function formatCurrency(v: number) {
  return v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

type EditMode = "set" | "credit" | "debit";

interface EditState {
  account: "checking" | "savings";
  mode: EditMode;
  currentBalance: number;
}

function AdminAccountsPage() {
  const search = useSearch({ strict: false });
  const { users, loading } = useUsers();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(
    search.user ? String(search.user) : null,
  );
  const navigate = useNavigate();

  // Edit dialog state
  const [editState, setEditState] = useState<EditState | null>(null);
  const [editAmount, setEditAmount] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  const filteredUsers = users.filter(
    (user) =>
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const selectedUser = selectedUserId ? users.find((u) => u.id === selectedUserId) : null;
  const totalBalance = selectedUser
    ? (selectedUser.checkingBalance || 0) + (selectedUser.savingsBalance || 0)
    : 0;

  const openEdit = (account: "checking" | "savings", mode: EditMode, currentBalance: number) => {
    setEditState({ account, mode, currentBalance });
    setEditAmount(mode === "set" ? currentBalance.toFixed(2) : "");
    setEditDescription("");
  };

  const closeEdit = () => {
    setEditState(null);
    setEditAmount("");
    setEditDescription("");
  };

  const getPreviewBalance = (): number => {
    if (!editState) return 0;
    const amt = parseFloat(editAmount) || 0;
    switch (editState.mode) {
      case "set": return amt;
      case "credit": return editState.currentBalance + amt;
      case "debit": return Math.max(0, editState.currentBalance - amt);
    }
  };

  const handleSave = async () => {
    if (!selectedUser || !editState) return;
    const amt = parseFloat(editAmount);
    if (isNaN(amt) || amt < 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setEditLoading(true);
    try {
      const { account, mode, currentBalance } = editState;

      if (mode === "set") {
        // Direct balance override — no transaction record needed
        await setBalanceDirectly(
          selectedUser.id,
          selectedUser.fullName,
          account,
          amt,
          currentBalance,
        );
        toast.success(
          `${account.charAt(0).toUpperCase() + account.slice(1)} balance set to $${formatCurrency(amt)}`,
        );
      } else {
        // Credit or debit — posts a transaction record
        const desc = editDescription.trim() || (mode === "credit" ? "Admin Credit" : "Admin Debit");
        await postTransaction({
          userId: selectedUser.id,
          userFullName: selectedUser.fullName,
          account,
          type: mode === "credit" ? "credit" : "debit",
          amount: amt,
          description: desc,
          category: "Admin Adjustment",
          adminNote: `Manual ${mode} by admin`,
          currentBalance,
        });
        toast.success(
          `$${formatCurrency(amt)} ${mode === "credit" ? "credited to" : "debited from"} ${account} account`,
        );
      }

      closeEdit();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to update balance");
    } finally {
      setEditLoading(false);
    }
  };

  const modeLabel: Record<EditMode, string> = {
    set: "Set Balance",
    credit: "Add Funds",
    debit: "Deduct Funds",
  };

  const modeColor: Record<EditMode, string> = {
    set: "#38BDF8",
    credit: "#00E676",
    debit: "#FF4D6A",
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-white">Account Control</h1>
        <p className="text-blue-300/60 text-sm">Manage and edit user account balances</p>
      </div>

      {loading ? (
        <Card className="glass-card border-0">
          <CardContent className="pt-6 text-center py-12 text-[#8A9BB5]">
            Loading users...
          </CardContent>
        </Card>
      ) : users.length === 0 ? (
        <Card className="glass-card border-0">
          <CardContent className="pt-6 text-center py-12 text-[#8A9BB5]">
            No users yet. Create a user first.
          </CardContent>
        </Card>
      ) : (
        <Card className="glass-card border-0">
          <CardContent className="pt-6">
            {/* Search & Select */}
            <div className="mb-6 flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300/50" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-[#070B14] border-[rgba(255,255,255,0.1)] text-white placeholder:text-blue-300/50"
                />
              </div>
              <Select
                value={selectedUserId || ""}
                onValueChange={(value) => {
                  setSelectedUserId(value || null);
                  navigate({ to: "/admin/accounts", search: { user: value } });
                }}
              >
                <SelectTrigger className="w-full md:w-[300px] bg-[#070B14] border-[rgba(255,255,255,0.1)] text-white">
                  <SelectValue placeholder="Select a user" />
                </SelectTrigger>
                <SelectContent className="bg-[#0D1625] border-[rgba(255,255,255,0.1)] text-white">
                  {filteredUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.fullName} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {!selectedUser ? (
              <div className="text-center py-12 text-[#8A9BB5]">
                Select a user to view and edit their accounts
              </div>
            ) : (
              <>
                {/* User summary header */}
                <div className="flex items-center justify-between bg-[#070B14] p-4 rounded-xl mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 flex items-center justify-center text-white font-semibold text-lg">
                      {selectedUser.fullName
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{selectedUser.fullName}</h3>
                      <p className="text-blue-300/60 text-sm">{selectedUser.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold font-mono text-2xl">
                      ${formatCurrency(totalBalance)}
                    </p>
                    <p className="text-blue-300/60 text-xs">Total Balance</p>
                  </div>
                </div>

                {/* Account cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(
                    [
                      {
                        type: "checking" as const,
                        label: "Checking",
                        balance: selectedUser.checkingBalance || 0,
                        accountNumber: selectedUser.checkingAccountNumber,
                      },
                      {
                        type: "savings" as const,
                        label: "Savings",
                        balance: selectedUser.savingsBalance || 0,
                        accountNumber: selectedUser.savingsAccountNumber,
                      },
                    ] as const
                  ).map((acct) => (
                    <Card
                      key={acct.type}
                      className="border border-[rgba(255,255,255,0.05)] bg-[#0D1625]"
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg text-white">{acct.label} Account</CardTitle>
                          <div className="flex items-center gap-2 bg-[#070B14] px-3 py-1 rounded-lg">
                            <span className="text-blue-300/70 text-sm font-mono">
                              {acct.accountNumber
                                ? `****${acct.accountNumber.slice(-4)}`
                                : "****0000"}
                            </span>
                            {acct.accountNumber && (
                              <button
                                onClick={() =>
                                  navigator.clipboard.writeText(acct.accountNumber).then(() =>
                                    toast.success("Copied!")
                                  )
                                }
                                className="text-blue-300 hover:text-white"
                              >
                                <Copy size={14} />
                              </button>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-5">
                        {/* Balance display */}
                        <div className="text-center py-2">
                          <p className="text-blue-300/60 text-sm mb-1">Current Balance</p>
                          <p className="text-4xl font-bold text-cyan-400 font-mono">
                            ${formatCurrency(acct.balance)}
                          </p>
                        </div>

                        {/* Action buttons */}
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            onClick={() => openEdit(acct.type, "set", acct.balance)}
                            className="flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all hover:opacity-90"
                            style={{ background: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.2)" }}
                          >
                            <Edit2 size={16} style={{ color: "#38BDF8" }} />
                            <span className="text-xs font-semibold" style={{ color: "#38BDF8" }}>
                              Set
                            </span>
                          </button>
                          <button
                            onClick={() => openEdit(acct.type, "credit", acct.balance)}
                            className="flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all hover:opacity-90"
                            style={{ background: "rgba(0,230,118,0.1)", border: "1px solid rgba(0,230,118,0.2)" }}
                          >
                            <Plus size={16} style={{ color: "#00E676" }} />
                            <span className="text-xs font-semibold" style={{ color: "#00E676" }}>
                              Credit
                            </span>
                          </button>
                          <button
                            onClick={() => openEdit(acct.type, "debit", acct.balance)}
                            className="flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all hover:opacity-90"
                            style={{ background: "rgba(255,77,106,0.1)", border: "1px solid rgba(255,77,106,0.2)" }}
                          >
                            <Minus size={16} style={{ color: "#FF4D6A" }} />
                            <span className="text-xs font-semibold" style={{ color: "#FF4D6A" }}>
                              Debit
                            </span>
                          </button>
                        </div>

                        <p className="text-xs text-center text-blue-300/40">
                          Set overrides balance directly · Credit/Debit creates a transaction record
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* ── Edit Balance Dialog ── */}
      <Dialog open={!!editState} onOpenChange={(open) => !open && closeEdit()}>
        <DialogContent className="bg-[#0F1829] border-[rgba(255,255,255,0.1)] max-w-md">
          <DialogHeader>
            <DialogTitle
              className="text-white flex items-center gap-2"
              style={{ color: editState ? modeColor[editState.mode] : "#FFFFFF" }}
            >
              <DollarSign size={18} />
              {editState ? modeLabel[editState.mode] : "Edit Balance"} —{" "}
              <span className="capitalize">{editState?.account}</span>
            </DialogTitle>
            <DialogDescription className="text-blue-300/60">
              {editState?.mode === "set"
                ? "Set the exact balance. No transaction record is created."
                : editState?.mode === "credit"
                  ? "Add funds to the account. A credit transaction will be recorded."
                  : "Remove funds from the account. A debit transaction will be recorded."}
            </DialogDescription>
          </DialogHeader>

          {editState && selectedUser && (
            <div className="space-y-4 py-2">
              {/* Current balance */}
              <div
                className="flex justify-between items-center p-3 rounded-xl"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                <span className="text-sm text-blue-300/60">Current balance</span>
                <span className="text-white font-mono font-semibold">
                  ${formatCurrency(editState.currentBalance)}
                </span>
              </div>

              {/* Amount input */}
              <div>
                <label className="block text-sm font-semibold text-blue-300/70 mb-2">
                  {editState.mode === "set" ? "New Balance" : "Amount"}
                </label>
                <div className="relative">
                  <span
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-mono"
                    style={{ color: modeColor[editState.mode] }}
                  >
                    $
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-10 pr-4 py-4 rounded-xl text-xl font-mono font-bold outline-none"
                    style={{
                      background: "#070B14",
                      color: modeColor[editState.mode],
                      border: `1px solid ${modeColor[editState.mode]}33`,
                    }}
                    autoFocus
                  />
                </div>
              </div>

              {/* Description (only for credit/debit) */}
              {editState.mode !== "set" && (
                <div>
                  <label className="block text-sm font-semibold text-blue-300/70 mb-2">
                    Description (optional)
                  </label>
                  <input
                    type="text"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder={editState.mode === "credit" ? "e.g. Bonus credit" : "e.g. Fee deduction"}
                    className="w-full px-4 py-3 rounded-xl outline-none"
                    style={{
                      background: "#070B14",
                      color: "#FFFFFF",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  />
                </div>
              )}

              {/* Preview */}
              {editAmount && !isNaN(parseFloat(editAmount)) && (
                <div
                  className="p-4 rounded-xl space-y-2"
                  style={{
                    background: `${modeColor[editState.mode]}0D`,
                    border: `1px solid ${modeColor[editState.mode]}33`,
                  }}
                >
                  <p
                    className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: modeColor[editState.mode] }}
                  >
                    Preview
                  </p>
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-300/60">Before</span>
                    <span className="text-white font-mono">${formatCurrency(editState.currentBalance)}</span>
                  </div>
                  {editState.mode !== "set" && (
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-300/60">
                        {editState.mode === "credit" ? "+ Added" : "− Removed"}
                      </span>
                      <span className="font-mono" style={{ color: modeColor[editState.mode] }}>
                        ${formatCurrency(parseFloat(editAmount) || 0)}
                      </span>
                    </div>
                  )}
                  <div
                    className="flex justify-between text-sm border-t pt-2"
                    style={{ borderColor: `${modeColor[editState.mode]}33` }}
                  >
                    <span className="font-semibold" style={{ color: modeColor[editState.mode] }}>
                      After
                    </span>
                    <span
                      className="font-mono font-bold text-lg"
                      style={{ color: modeColor[editState.mode] }}
                    >
                      ${formatCurrency(getPreviewBalance())}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              onClick={closeEdit}
              className="bg-transparent border border-[rgba(255,255,255,0.1)] text-blue-300/60 hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={editLoading || !editAmount || isNaN(parseFloat(editAmount)) || parseFloat(editAmount) < 0}
              className="text-white font-semibold"
              style={{
                background: editState
                  ? `linear-gradient(135deg, ${modeColor[editState.mode]}99, ${modeColor[editState.mode]})`
                  : "#38BDF8",
                opacity: editLoading ? 0.6 : 1,
              }}
            >
              {editLoading
                ? "Saving..."
                : editState?.mode === "set"
                  ? "Set Balance"
                  : editState?.mode === "credit"
                    ? "Add Funds"
                    : "Deduct Funds"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
