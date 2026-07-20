import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Plus, Trash2, Pencil, Check, X, Download, Search,
  ArrowUpRight, ArrowDownRight,
} from "lucide-react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { useTransactions } from "../../admin/hooks/useTransactions";
import { useUsers } from "../../admin/hooks/useUsers";
import { db } from "../../firebase/config";
import {
  collection, addDoc, doc, updateDoc, deleteDoc,
  increment, Timestamp, getDocs, query as fsQuery, where,
} from "firebase/firestore";
import { exportToCSV } from "../../utils/exportToCSV";
import { generateTransactionRef } from "../../utils/generateTransactionRef";
import { logAdminAction } from "../../utils/logAdminAction";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/transactions")({
  component: AdminTransactionsPage,
});

const TRANSACTION_TYPES = [
  "Wire Transfer", "Local Transfer", "Internal Transfer",
  "Crypto", "Card Deposit", "Cheque Deposit", "Bill Payment",
];

function formatCurrency(v: number) {
  return v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function statusColor(status: string) {
  if (status === "completed") return "bg-green-500/20 text-green-400 border-green-500/30";
  if (status === "pending")   return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
  return "bg-red-500/20 text-red-400 border-red-500/30";
}

interface NewTxForm {
  userId: string;
  transactionType: string;
  amount: string;
  description: string;
  type: "credit" | "debit";
  status: "pending" | "completed" | "failed";
  fundingAccount: "checking" | "savings";
  customDate: string;
  customTime: string;
}

const defaultForm: NewTxForm = {
  userId: "",
  transactionType: "Wire Transfer",
  amount: "",
  description: "",
  type: "credit",
  status: "completed",
  fundingAccount: "checking",
  customDate: new Date().toISOString().split("T")[0],
  customTime: new Date().toTimeString().slice(0, 5),
};

function AdminTransactionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { transactions, loading } = useTransactions();
  const { users } = useUsers();

  const [addOpen, setAddOpen]           = useState(false);
  const [form, setForm]                 = useState<NewTxForm>(defaultForm);
  const [submitting, setSubmitting]     = useState(false);
  const [deleting, setDeleting]         = useState(false);
  const [editTarget, setEditTarget]     = useState<any>(null);
  const [editStatus, setEditStatus]     = useState<string>("");
  const [editSaving, setEditSaving]     = useState(false);

  const filtered = transactions.filter((tx) =>
    tx.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (tx.userFullName as string | undefined)?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalCredits = transactions.filter((tx) => tx.type === "credit").reduce((s, tx) => s + (tx.amount || 0), 0);
  const totalDebits  = transactions.filter((tx) => tx.type === "debit") .reduce((s, tx) => s + (tx.amount || 0), 0);

  // ── Add transaction ──────────────────────────────────────────────────
  const handleAddTransaction = async () => {
    if (!form.userId) return toast.error("Please select a user");
    const amount = parseFloat(form.amount);
    if (!amount || amount <= 0) return toast.error("Enter a valid amount");
    if (!form.description.trim()) return toast.error("Description is required");
    const selectedUser = users.find((u) => u.id === form.userId);
    if (!selectedUser) return toast.error("User not found");

    const customDateTime = new Date(`${form.customDate}T${form.customTime}:00`);
    if (isNaN(customDateTime.getTime())) return toast.error("Invalid date/time");

    setSubmitting(true);
    try {
      const balanceField  = form.fundingAccount === "checking" ? "checkingBalance" : "savingsBalance";
      const balanceDelta  = form.type === "credit" ? amount : -amount;
      const txRef         = generateTransactionRef();

      const txDocRef = await addDoc(collection(db, "transactions"), {
        userId:           form.userId,
        userFullName:     selectedUser.fullName || selectedUser.email,
        userEmail:        selectedUser.email,
        account:          form.fundingAccount,
        fundingAccount:   form.fundingAccount,
        type:             form.type,
        transactionType:  form.transactionType,
        amount,
        description:      form.description.trim(),
        status:           form.status,
        transactionRef:   txRef,
        createdAt:        Timestamp.fromDate(customDateTime),
        createdByAdmin:   true,
      });

      try {
        await addDoc(collection(db, "users", form.userId, "transactions"), {
          userId: form.userId, userFullName: selectedUser.fullName || selectedUser.email,
          account: form.fundingAccount, fundingAccount: form.fundingAccount,
          type: form.type, transactionType: form.transactionType, amount,
          description: form.description.trim(), status: form.status,
          transactionRef: txRef, transactionId: txDocRef.id,
          createdAt: Timestamp.fromDate(customDateTime), createdByAdmin: true,
        });
      } catch { /* subcollection optional */ }

      if (form.status === "completed") {
        await updateDoc(doc(db, "users", form.userId), {
          [balanceField]:  increment(balanceDelta),
          totalBalance:    increment(balanceDelta),
        });
      }

      await logAdminAction(
        "TRANSACTION_CREATED",
        `Created ${form.type} $${amount.toFixed(2)} for ${selectedUser.fullName || selectedUser.email} (backdated: ${customDateTime.toLocaleDateString()})`,
        form.userId, selectedUser.fullName || selectedUser.email,
        { amount, type: form.type, backdatedTo: customDateTime.toISOString() },
      );

      toast.success("Transaction created!");
      setAddOpen(false);
      setForm(defaultForm);
    } catch (err: any) {
      toast.error(err?.message || "Failed to create transaction");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Delete transaction ───────────────────────────────────────────────
  const handleDelete = async (tx: any) => {
    if (!tx) return;
    setDeleting(true);
    try {
      // Delete from top-level transactions collection
      await deleteDoc(doc(db, "transactions", tx.id));

      // Also delete from user's subcollection if userId available
      if (tx.userId) {
        try {
          const userTxQuery = fsQuery(
            collection(db, "users", tx.userId, "transactions"),
            where("transactionRef", "==", tx.transactionRef)
          );
          const snap = await getDocs(userTxQuery);
          await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)));
        } catch { /* subcollection may not exist */ }

        // Also delete the notification for this transaction
        // Match by transactionId (the doc ID) — that's what createNotification stores
        try {
          const notifQuery = fsQuery(
            collection(db, "notifications"),
            where("userId", "==", tx.userId),
            where("transactionId", "==", tx.id)
          );
          const notifSnap = await getDocs(notifQuery);
          await Promise.all(notifSnap.docs.map((d) => deleteDoc(d.ref)));
        } catch { /* notifications may not exist */ }
      }

      await logAdminAction("TRANSACTION_DELETED", `Deleted transaction ${tx.transactionRef}`, tx.userId, tx.userFullName, {});
      toast.success("Transaction deleted from all records");
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  // ── Edit status ──────────────────────────────────────────────────────
  const handleEditStatus = async () => {
    if (!editTarget || !editStatus) return;
    setEditSaving(true);
    try {
      await updateDoc(doc(db, "transactions", editTarget.id), { status: editStatus });

      // If changing to completed — apply balance adjustment
      if (editStatus === "completed" && editTarget.status !== "completed") {
        const balanceField = editTarget.fundingAccount === "savings" ? "savingsBalance" : "checkingBalance";
        const delta = editTarget.type === "credit" ? editTarget.amount : -editTarget.amount;
        await updateDoc(doc(db, "users", editTarget.userId), {
          [balanceField]: increment(delta),
          totalBalance:   increment(delta),
        });
      }

      toast.success("Status updated");
      setEditTarget(null);
    } catch (err: any) {
      toast.error(err?.message || "Failed to update");
    } finally {
      setEditSaving(false);
    }
  };

  const setF = (k: keyof NewTxForm, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const inputStyle = {
    background: "#070B14", border: "1px solid rgba(255,255,255,0.1)",
    color: "#fff", borderRadius: 10, padding: "10px 14px",
    fontSize: 13, width: "100%", outline: "none",
  } as React.CSSProperties;

  const labelStyle = { fontSize: 11, color: "#8A9BB5", marginBottom: 4, display: "block" } as React.CSSProperties;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white">Transaction Management</h1>
          <p className="text-blue-300/60 text-xs mt-0.5">Create, edit and manage all transactions with backdating</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="ghost"
            className="text-blue-300 hover:text-white border border-[rgba(255,255,255,0.1)]"
            onClick={() => exportToCSV(transactions, "transactions")}>
            <Download size={14} className="mr-1" /> Export
          </Button>
          <Button size="sm"
            className="bg-gradient-to-r from-cyan-500 to-violet-600 text-white gap-1.5"
            onClick={() => { setForm(defaultForm); setAddOpen(true); }}>
            <Plus size={14} /> Add Transaction
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Total",   value: transactions.length,           color: "#38BDF8" },
          { label: "Credits", value: `$${formatCurrency(totalCredits)}`, color: "#00E676" },
          { label: "Debits",  value: `$${formatCurrency(totalDebits)}`,  color: "#FF4D6A" },
        ].map(({ label, value, color }) => (
          <div key={label} className="p-3 rounded-xl text-center"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="text-sm md:text-base font-bold font-mono" style={{ color }}>{value}</p>
            <p className="text-xs text-blue-300/60 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300/50" />
        <Input placeholder="Search by user or description..." value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-[#070B14] border-[rgba(255,255,255,0.1)] text-white placeholder:text-blue-300/50" />
      </div>

      {/* Transaction list */}
      {loading ? (
        <Card className="glass-card border-0"><div className="py-12 text-center text-[#8A9BB5]">Loading…</div></Card>
      ) : filtered.length === 0 ? (
        <Card className="glass-card border-0"><div className="py-12 text-center text-[#8A9BB5]">No transactions found</div></Card>
      ) : (
        <>
          {/* Desktop table */}
          <Card className="glass-card border-0 overflow-hidden hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead className="bg-[#070B14]">
                  <tr>
                    {["Date","User","Description","Type","Amount","Status","Actions"].map((h) => (
                      <th key={h} className="text-left py-3 px-4 text-blue-300/60 text-xs font-medium uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((tx: any) => (
                    <tr key={tx.id} className="border-t border-[rgba(255,255,255,0.05)] hover:bg-white/5">
                      <td className="py-3 px-4 text-blue-300/60 text-xs whitespace-nowrap">
                        {tx.createdAt?.toDate?.()?.toLocaleDateString() || "—"}
                      </td>
                      <td className="py-3 px-4 text-white text-sm">{tx.userFullName || "—"}</td>
                      <td className="py-3 px-4 text-white text-sm">{tx.description || "—"}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          {tx.type === "credit"
                            ? <ArrowDownRight size={14} className="text-green-400" />
                            : <ArrowUpRight   size={14} className="text-red-400" />}
                          <span className="text-xs capitalize">{tx.type}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-sm font-semibold"
                        style={{ color: tx.type === "credit" ? "#00E676" : "#FF4D6A" }}>
                        {tx.type === "credit" ? "+" : "-"}${formatCurrency(tx.amount || 0)}
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={statusColor(tx.status)}>{tx.status}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="w-8 h-8 text-blue-300 hover:text-white"
                            onClick={() => { setEditTarget(tx); setEditStatus(tx.status); }}>
                            <Pencil size={13} />
                          </Button>
                          <Button variant="ghost" size="icon" className="w-8 h-8 text-red-400 hover:text-red-300"
                            onClick={() => void handleDelete(tx)}>
                            <Trash2 size={13} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Mobile cards */}
          <div className="md:hidden space-y-2">
            {filtered.map((tx: any) => (
              <div key={tx.id} className="p-4 rounded-2xl"
                style={{ background: "#0F1829", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-white font-semibold text-sm">{tx.userFullName || "—"}</p>
                    <p className="text-blue-300/60 text-xs">{tx.description || "—"}</p>
                  </div>
                  <p className="font-mono font-bold text-sm"
                    style={{ color: tx.type === "credit" ? "#00E676" : "#FF4D6A" }}>
                    {tx.type === "credit" ? "+" : "-"}${formatCurrency(tx.amount || 0)}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className={statusColor(tx.status)}>{tx.status}</Badge>
                    <span className="text-xs text-blue-300/40">
                      {tx.createdAt?.toDate?.()?.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <button className="p-1.5 rounded-lg text-blue-300 hover:bg-white/10"
                      onClick={() => { setEditTarget(tx); setEditStatus(tx.status); }}>
                      <Pencil size={13} />
                    </button>
                    <button className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10"
                      onClick={() => void handleDelete(tx)}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── ADD TRANSACTION DIALOG ── */}
      {addOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)" }}
          onClick={() => setAddOpen(false)}>
          <div className="w-full max-w-lg rounded-2xl p-6 space-y-4 overflow-y-auto max-h-[90vh]"
            style={{ background: "#0F1829", border: "1px solid rgba(255,255,255,0.08)" }}
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-white font-bold text-lg">Add Transaction</h2>
              <button onClick={() => setAddOpen(false)} className="text-blue-300 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* User */}
              <div className="sm:col-span-2">
                <label style={labelStyle}>User *</label>
                <select value={form.userId} onChange={(e) => setF("userId", e.target.value)} style={inputStyle}>
                  <option value="">Select user…</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>{u.fullName} ({u.email})</option>
                  ))}
                </select>
              </div>
              {/* Type */}
              <div>
                <label style={labelStyle}>Transaction Type</label>
                <select value={form.transactionType} onChange={(e) => setF("transactionType", e.target.value)} style={inputStyle}>
                  {TRANSACTION_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              {/* Debit/Credit */}
              <div>
                <label style={labelStyle}>Credit / Debit</label>
                <select value={form.type} onChange={(e) => setF("type", e.target.value as "credit"|"debit")} style={inputStyle}>
                  <option value="credit">Credit (incoming)</option>
                  <option value="debit">Debit (outgoing)</option>
                </select>
              </div>
              {/* Amount */}
              <div>
                <label style={labelStyle}>Amount ($) *</label>
                <input type="number" min="0.01" step="0.01" placeholder="0.00"
                  value={form.amount} onChange={(e) => setF("amount", e.target.value)} style={inputStyle} />
              </div>
              {/* Account */}
              <div>
                <label style={labelStyle}>Account</label>
                <select value={form.fundingAccount} onChange={(e) => setF("fundingAccount", e.target.value as "checking"|"savings")} style={inputStyle}>
                  <option value="checking">Checking Account</option>
                  <option value="savings">Savings Account</option>
                </select>
              </div>
              {/* Status */}
              <div>
                <label style={labelStyle}>Status</label>
                <select value={form.status} onChange={(e) => setF("status", e.target.value as "pending"|"completed"|"failed")} style={inputStyle}>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
              {/* Description */}
              <div className="sm:col-span-2">
                <label style={labelStyle}>Description *</label>
                <input type="text" placeholder="e.g. Wire Transfer to John" value={form.description}
                  onChange={(e) => setF("description", e.target.value)} style={inputStyle} />
              </div>
              {/* Backdate */}
              <div>
                <label style={labelStyle}>📅 Date (Backdate)</label>
                <input type="date" value={form.customDate}
                  onChange={(e) => setF("customDate", e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>🕐 Time</label>
                <input type="time" value={form.customTime}
                  onChange={(e) => setF("customTime", e.target.value)} style={inputStyle} />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setAddOpen(false)} className="flex-1 py-3 rounded-xl font-semibold text-sm"
                style={{ background: "rgba(255,255,255,0.06)", color: "#8A9BB5" }}>
                Cancel
              </button>
              <button onClick={() => void handleAddTransaction()} disabled={submitting}
                className="flex-1 py-3 rounded-xl font-semibold text-sm text-white"
                style={{ background: submitting ? "rgba(56,189,248,0.4)" : "linear-gradient(135deg,#38BDF8,#6366F1)", opacity: submitting ? 0.7 : 1 }}>
                {submitting ? "Creating…" : "Create Transaction"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── EDIT STATUS ── */}
      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)" }}
          onClick={() => setEditTarget(null)}>
          <div className="w-full max-w-sm rounded-2xl p-6 space-y-4"
            style={{ background: "#0F1829", border: "1px solid rgba(255,255,255,0.08)" }}
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-white font-bold">Update Status</h3>
              <button onClick={() => setEditTarget(null)} className="text-blue-300 hover:text-white">
                <X size={18} />
              </button>
            </div>
            <p className="text-blue-300/60 text-sm">
              {editTarget.description} — ${formatCurrency(editTarget.amount)}
            </p>
            <div className="space-y-2">
              {(["pending","completed","failed"] as const).map((s) => (
                <button key={s} onClick={() => setEditStatus(s)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all"
                  style={{
                    background: editStatus === s ? "rgba(56,189,248,0.1)" : "rgba(255,255,255,0.03)",
                    border: editStatus === s ? "1px solid rgba(56,189,248,0.4)" : "1px solid rgba(255,255,255,0.05)",
                  }}>
                  <span className="text-white text-sm capitalize">{s}</span>
                  {editStatus === s && <Check size={14} className="text-cyan-400" />}
                </button>
              ))}
            </div>
            <div className="flex gap-3 pt-1">
              <button onClick={() => setEditTarget(null)} className="flex-1 py-3 rounded-xl font-semibold text-sm"
                style={{ background: "rgba(255,255,255,0.06)", color: "#8A9BB5" }}>
                Cancel
              </button>
              <button onClick={() => void handleEditStatus()} disabled={editSaving}
                className="flex-1 py-3 rounded-xl font-semibold text-sm text-white"
                style={{ background: "linear-gradient(135deg,#38BDF8,#6366F1)" }}>
                {editSaving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
