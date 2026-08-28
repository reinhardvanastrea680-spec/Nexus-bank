import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, XCircle, Clock, Eye, AlertTriangle } from "lucide-react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../components/ui/dialog";
import { Textarea } from "../../components/ui/textarea";
import { useAdminTransactions } from "../../admin/hooks/useAdminTransactions";
import {
  approveTransaction,
  declineTransaction,
} from "../../admin/functions/reviewTransaction";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/pending-transactions")({
  component: AdminPendingTransactionsPage,
});

function formatCurrency(value: number) {
  return value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function AdminPendingTransactionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // Decline dialog
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [transactionToReject, setTransactionToReject] = useState<any>(null);

  // Approve confirmation dialog
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [transactionToApprove, setTransactionToApprove] = useState<any>(null);

  // Detail drawer
  const [detailTx, setDetailTx] = useState<any>(null);

  const { transactions: pendingTransactions, loading: fetching } =
    useAdminTransactions("pending");

  const filteredTransactions = pendingTransactions.filter((tx) =>
    tx.userFullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.transactionRef?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // ── Approve flow ──────────────────────────────────────────────────────────
  const handleApproveClick = (tx: any) => {
    setTransactionToApprove(tx);
    setApproveDialogOpen(true);
  };

  const confirmApprove = async () => {
    if (!transactionToApprove) return;
    setLoading(true);
    try {
      await approveTransaction(transactionToApprove.id);
      toast.success(`Transaction approved — $${formatCurrency(transactionToApprove.amount)} deducted from ${transactionToApprove.userFullName}'s ${transactionToApprove.fundingAccount} account`);
      setApproveDialogOpen(false);
      setTransactionToApprove(null);
      setDetailTx(null);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to approve transaction");
    } finally {
      setLoading(false);
    }
  };

  // ── Decline flow ──────────────────────────────────────────────────────────
  const handleRejectClick = (tx: any) => {
    setTransactionToReject(tx);
    setRejectReason("");
    setRejectDialogOpen(true);
  };

  const confirmReject = async () => {
    if (!transactionToReject) return;
    if (!rejectReason || rejectReason.trim().length < 5) {
      toast.error("Please provide a reason (at least 5 characters)");
      return;
    }
    setLoading(true);
    try {
      await declineTransaction(transactionToReject.id, rejectReason.trim());
      toast.success("Transaction declined — user has been notified");
      setRejectDialogOpen(false);
      setTransactionToReject(null);
      setRejectReason("");
      setDetailTx(null);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to decline transaction");
    } finally {
      setLoading(false);
    }
  };

  // ── Badge helpers ─────────────────────────────────────────────────────────
  const getTransactionDisplay = (tx: any) => {
    if (tx.type === "internal_transfer") {
      return {
        from: tx.fundingAccount,
        to: tx.toAccount ? `${tx.toAccount} account` : (tx.recipientName || "-"),
        badge: <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">Internal</Badge>,
        displayAmount: tx.amount,
      };
    } else if (tx.type === "local_transfer") {
      return {
        from: tx.fundingAccount,
        to: `${tx.recipientName || "-"} (${tx.toBank || "-"})`,
        badge: <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Local</Badge>,
        displayAmount: tx.amount,
      };
    } else if (tx.type === "wire_transfer") {
      return {
        from: tx.fundingAccount,
        to: `${tx.recipientName || "-"} (${tx.toBank || "-"}, ${tx.toCountry || "-"})`,
        badge: <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30">Wire</Badge>,
        displayAmount: tx.amount,
      };
    } else if (tx.type === "buy_crypto") {
      return {
        from: tx.fundingAccount,
        to: `${tx.cryptoAmount ? Number(tx.cryptoAmount).toFixed(6) : "-"} ${tx.cryptoSymbol || "-"}`,
        badge: <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">Crypto</Badge>,
        displayAmount: tx.fiatAmount || tx.amount,
      };
    } else if (tx.type === "check_deposit" || tx.subType === "card_deposit") {
      return {
        from: tx.subType === "card_deposit" ? "Card" : `Check #${tx.checkNumber || "-"}`,
        to: tx.fundingAccount,
        badge: <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">Deposit</Badge>,
        displayAmount: tx.amount,
      };
    } else if (tx.type === "bill_payment") {
      return {
        from: tx.fundingAccount,
        to: tx.recipientName || "-",
        badge: <Badge className="bg-pink-500/20 text-pink-300 border-pink-500/30">Bills</Badge>,
        displayAmount: tx.amount,
      };
    } else {
      return {
        from: tx.fundingAccount || "-",
        to: tx.recipientName || tx.description || "-",
        badge: <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30">{tx.type?.replace(/_/g, " ") || "Transfer"}</Badge>,
        displayAmount: tx.amount,
      };
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Pending Transactions</h1>
          <p className="text-blue-300/60 text-xs">
            Review and approve all pending transactions
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20">
          <Clock size={14} className="text-yellow-400" />
          <span className="text-yellow-400 text-sm font-medium">
            {filteredTransactions.length} Pending
          </span>
        </div>
      </div>

      <Input
        placeholder="Search by user name or reference..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-80 bg-[#070B14] border-[rgba(255,255,255,0.1)] text-white"
      />

      <Card className="glass-card border-0 overflow-hidden">
        <div className="overflow-x-auto">
          {fetching ? (
            <div className="py-12 text-center text-[#8A9BB5]">Loading pending transactions...</div>
          ) : filteredTransactions.length === 0 ? (
            <div className="py-16 text-center">
              <CheckCircle2 size={40} className="mx-auto mb-3 text-[#8A9BB5] opacity-30" />
              <p className="text-[#8A9BB5]">No pending transactions</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-[#070B14]">
                <tr>
                  <th className="text-left py-4 px-6 text-blue-300/60 text-xs font-medium uppercase">Date</th>
                  <th className="text-left py-4 px-6 text-blue-300/60 text-xs font-medium uppercase">User</th>
                  <th className="text-left py-4 px-6 text-blue-300/60 text-xs font-medium uppercase">Type</th>
                  <th className="text-left py-4 px-6 text-blue-300/60 text-xs font-medium uppercase">From</th>
                  <th className="text-left py-4 px-6 text-blue-300/60 text-xs font-medium uppercase">To</th>
                  <th className="text-left py-4 px-6 text-blue-300/60 text-xs font-medium uppercase">Amount</th>
                  <th className="text-left py-4 px-6 text-blue-300/60 text-xs font-medium uppercase">Ref</th>
                  <th className="text-right py-4 px-6 text-blue-300/60 text-xs font-medium uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx) => {
                  const { from, to, badge, displayAmount } = getTransactionDisplay(tx);
                  return (
                    <tr
                      key={tx.id}
                      className="border-t border-[rgba(255,255,255,0.05)] hover:bg-white/5 cursor-pointer"
                      onClick={() => setDetailTx(tx)}
                    >
                      <td className="py-4 px-6 text-blue-300/60 text-xs">
                        {tx.createdAt instanceof Date
                          ? tx.createdAt.toLocaleString()
                          : "-"}
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <p className="text-white font-medium text-sm">{tx.userFullName || "Unknown"}</p>
                          <p className="text-blue-300/50 text-xs">{tx.userEmail || ""}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">{badge}</td>
                      <td className="py-4 px-6 text-white text-sm capitalize">{from}</td>
                      <td className="py-4 px-6 text-white text-sm max-w-[180px] truncate">{to}</td>
                      <td className="py-4 px-6 text-cyan-400 font-mono text-sm font-semibold">
                        ${formatCurrency(parseFloat(String(displayAmount || 0)))}
                      </td>
                      <td className="py-4 px-6 text-blue-300/50 text-xs font-mono">
                        {tx.transactionRef || "-"}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div
                          className="flex gap-2 justify-end"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button
                            onClick={() => handleRejectClick(tx)}
                            disabled={loading}
                            size="sm"
                            className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30"
                          >
                            <XCircle size={14} className="mr-1" />
                            Decline
                          </Button>
                          <Button
                            onClick={() => handleApproveClick(tx)}
                            disabled={loading}
                            size="sm"
                            className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30"
                          >
                            <CheckCircle2 size={14} className="mr-1" />
                            Approve
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      {/* ── Transaction Detail Dialog ── */}
      <Dialog open={!!detailTx} onOpenChange={(open) => !open && setDetailTx(null)}>
        <DialogContent className="bg-[#0F1829] border-[rgba(255,255,255,0.1)] max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Eye size={18} className="text-cyan-400" />
              Transaction Details
            </DialogTitle>
          </DialogHeader>
          {detailTx && (() => {
            const { badge, displayAmount } = getTransactionDisplay(detailTx);
            return (
              <div className="space-y-4">
                {/* Amount hero */}
                <div className="text-center p-4 rounded-xl" style={{ background: "rgba(56,189,248,0.06)", border: "1px solid rgba(56,189,248,0.15)" }}>
                  <p className="text-xs text-blue-300/60 mb-1">Amount</p>
                  <p className="text-3xl font-mono font-bold text-white">
                    ${formatCurrency(parseFloat(String(displayAmount || 0)))}
                  </p>
                  <div className="mt-2 flex justify-center">{badge}</div>
                </div>

                {/* Details grid */}
                <div className="space-y-2 text-sm">
                  {[
                    { label: "User", value: detailTx.userFullName },
                    { label: "Email", value: detailTx.userEmail },
                    { label: "From Account", value: detailTx.fundingAccount },
                    ...(detailTx.toAccount ? [{ label: "To Account", value: detailTx.toAccount }] : []),
                    ...(detailTx.recipientName ? [{ label: "Recipient", value: detailTx.recipientName }] : []),
                    ...(detailTx.toBank ? [{ label: "Bank", value: detailTx.toBank }] : []),
                    ...(detailTx.toCountry ? [{ label: "Country", value: detailTx.toCountry }] : []),
                    ...(detailTx.toAccountNumber ? [{ label: "Account No.", value: detailTx.toAccountNumber }] : []),
                    ...(detailTx.toSwiftCode ? [{ label: "SWIFT", value: detailTx.toSwiftCode }] : []),
                    ...(detailTx.toCurrency ? [{ label: "Currency", value: detailTx.toCurrency }] : []),
                    ...(detailTx.fee ? [{ label: "Fee", value: `$${formatCurrency(detailTx.fee)}` }] : []),
                    ...(detailTx.purpose ? [{ label: "Purpose", value: detailTx.purpose }] : []),
                    ...(detailTx.cryptoSymbol ? [{ label: "Crypto", value: `${Number(detailTx.cryptoAmount || 0).toFixed(6)} ${detailTx.cryptoSymbol}` }] : []),
                    ...(detailTx.note ? [{ label: "Note", value: detailTx.note }] : []),
                    { label: "Reference", value: detailTx.transactionRef || detailTx.id },
                    { label: "Submitted", value: detailTx.createdAt instanceof Date ? detailTx.createdAt.toLocaleString() : "-" },
                    { label: "Balance at submission", value: `$${formatCurrency(detailTx.balanceAtSubmission || 0)}` },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between py-1.5 border-b border-[rgba(255,255,255,0.05)]">
                      <span className="text-blue-300/60">{label}</span>
                      <span className="text-white font-medium text-right max-w-[55%] break-words capitalize">{value}</span>
                    </div>
                  ))}
                </div>

                {/* Warning if amount > balance */}
                {detailTx.amount > (detailTx.balanceAtSubmission || 0) && (
                  <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: "rgba(255,77,106,0.1)", border: "1px solid rgba(255,77,106,0.3)" }}>
                    <AlertTriangle size={16} className="text-red-400 flex-shrink-0" />
                    <p className="text-xs text-red-400">User's balance may have changed since submission.</p>
                  </div>
                )}
              </div>
            );
          })()}
          <DialogFooter className="gap-2 mt-2">
            <Button
              onClick={() => { setDetailTx(null); handleRejectClick(detailTx); }}
              disabled={loading}
              className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 flex-1"
            >
              <XCircle size={16} className="mr-1" />
              Decline
            </Button>
            <Button
              onClick={() => { setDetailTx(null); handleApproveClick(detailTx); }}
              disabled={loading}
              className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30 flex-1"
            >
              <CheckCircle2 size={16} className="mr-1" />
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Approve Confirmation Dialog ── */}
      <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <DialogContent className="bg-[#0F1829] border-[rgba(255,255,255,0.1)]">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <CheckCircle2 size={18} className="text-cyan-400" />
              Confirm Approval
            </DialogTitle>
            <DialogDescription className="text-blue-300/60">
              This will deduct the amount from the user's account and notify them immediately.
            </DialogDescription>
          </DialogHeader>
          {transactionToApprove && (
            <div className="space-y-3 py-2">
              <div className="p-4 rounded-xl space-y-2" style={{ background: "rgba(56,189,248,0.06)", border: "1px solid rgba(56,189,248,0.15)" }}>
                <div className="flex justify-between text-sm">
                  <span className="text-blue-300/60">User</span>
                  <span className="text-white font-semibold">{transactionToApprove.userFullName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-blue-300/60">Type</span>
                  <span className="text-white capitalize">{transactionToApprove.type?.replace(/_/g, " ")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-blue-300/60">Amount to deduct</span>
                  <span className="text-cyan-400 font-mono font-bold text-lg">
                    ${formatCurrency(transactionToApprove.amount)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-blue-300/60">From</span>
                  <span className="text-white capitalize">{transactionToApprove.fundingAccount} account</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-blue-300/60">Balance at submission</span>
                  <span className="text-white">${formatCurrency(transactionToApprove.balanceAtSubmission || 0)}</span>
                </div>
                <div className="flex justify-between text-sm border-t border-[rgba(255,255,255,0.05)] pt-2 mt-2">
                  <span className="text-blue-300/60">Balance after approval</span>
                  <span className="text-green-400 font-semibold">
                    ${formatCurrency(Math.max(0, (transactionToApprove.balanceAtSubmission || 0) - transactionToApprove.amount))}
                  </span>
                </div>
              </div>
              <p className="text-xs text-blue-300/50 text-center">
                A notification will be sent to the user upon approval.
              </p>
            </div>
          )}
          <DialogFooter>
            <Button
              onClick={() => setApproveDialogOpen(false)}
              className="bg-transparent border border-[rgba(255,255,255,0.1)] text-blue-300/60 hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmApprove}
              disabled={loading}
              className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30"
            >
              {loading ? "Approving..." : "Confirm Approval"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Decline Dialog ── */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="bg-[#0F1829] border-[rgba(255,255,255,0.1)]">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <XCircle size={18} className="text-red-400" />
              Decline Transaction
            </DialogTitle>
            <DialogDescription className="text-blue-300/60">
              Provide a reason — the user will see this in their notification.
            </DialogDescription>
          </DialogHeader>
          {transactionToReject && (
            <div className="py-1">
              <p className="text-sm text-blue-300/60 mb-3">
                Declining <span className="text-white font-semibold">${formatCurrency(transactionToReject.amount)}</span> {transactionToReject.type?.replace(/_/g, " ")} for <span className="text-white font-semibold">{transactionToReject.userFullName}</span>
              </p>
            </div>
          )}
          <Textarea
            placeholder="Enter reason for declining (min 5 characters)..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            rows={3}
            className="bg-[#070B14] border-[rgba(255,255,255,0.1)] text-white placeholder:text-blue-300/40"
          />
          <DialogFooter>
            <Button
              onClick={() => setRejectDialogOpen(false)}
              className="bg-transparent border border-[rgba(255,255,255,0.1)] text-blue-300/60 hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmReject}
              disabled={loading || rejectReason.trim().length < 5}
              className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30"
            >
              {loading ? "Declining..." : "Confirm Decline"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
