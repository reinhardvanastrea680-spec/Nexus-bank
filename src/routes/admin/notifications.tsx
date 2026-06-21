import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, CheckCircle2, Clock, XCircle, Check, Eye, AlertTriangle } from "lucide-react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../components/ui/dialog";
import { Textarea } from "../../components/ui/textarea";
import { Badge } from "../../components/ui/badge";
import { useAdminNotifications } from "../../admin/hooks/useAdminNotifications";
import { useAdminTransactions } from "../../admin/hooks/useAdminTransactions";
import {
  approveTransaction,
  declineTransaction,
} from "../../admin/functions/reviewTransaction";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/notifications")({
  component: AdminNotificationsPage,
});

function formatCurrency(v: number) {
  return v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function AdminNotificationsPage() {
  const { notifications, loading, markAllRead, markRead } = useAdminNotifications();
  // Fetch all transactions so we can show details when a notification is clicked
  const { transactions: allTransactions } = useAdminTransactions();

  const unreadCount = notifications.filter((n) => n.status === "unread").length;

  // Detail / action state
  const [selectedNotif, setSelectedNotif] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);

  // The actual transaction document for the selected notification
  const relatedTx = selectedNotif?.transactionId
    ? allTransactions.find((t) => t.id === selectedNotif.transactionId)
    : null;

  const handleNotifClick = async (notif: any) => {
    setSelectedNotif(notif);
    if (notif.status === "unread") {
      await markRead(notif.id);
    }
  };

  const handleApproveClick = () => setApproveDialogOpen(true);

  const confirmApprove = async () => {
    if (!relatedTx) return;
    setActionLoading(true);
    try {
      await approveTransaction(relatedTx.id);
      toast.success(`Approved — $${formatCurrency(relatedTx.amount)} deducted`);
      setApproveDialogOpen(false);
      setSelectedNotif(null);
    } catch (err: any) {
      toast.error(err?.message || "Failed to approve");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectClick = () => {
    setRejectReason("");
    setRejectDialogOpen(true);
  };

  const confirmReject = async () => {
    if (!relatedTx || rejectReason.trim().length < 5) {
      toast.error("Please provide a reason (at least 5 characters)");
      return;
    }
    setActionLoading(true);
    try {
      await declineTransaction(relatedTx.id, rejectReason.trim());
      toast.success("Transaction declined — user notified");
      setRejectDialogOpen(false);
      setSelectedNotif(null);
    } catch (err: any) {
      toast.error(err?.message || "Failed to decline");
    } finally {
      setActionLoading(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "new_transaction": return <Clock size={20} style={{ color: "#FFAB00" }} />;
      case "transaction_approved": return <CheckCircle2 size={20} style={{ color: "#00E676" }} />;
      case "transaction_declined": return <XCircle size={20} style={{ color: "#FF4D6A" }} />;
      case "admin_credit": return <CheckCircle2 size={20} style={{ color: "#00E676" }} />;
      case "admin_debit": return <XCircle size={20} style={{ color: "#FF4D6A" }} />;
      case "balance_override": return <Bell size={20} style={{ color: "#38BDF8" }} />;
      default: return <Bell size={20} style={{ color: "#38BDF8" }} />;
    }
  };

  const getIconBg = (type: string) => {
    switch (type) {
      case "new_transaction": return "rgba(255,171,0,0.12)";
      case "transaction_approved": return "rgba(0,230,118,0.12)";
      case "transaction_declined": return "rgba(255,77,106,0.12)";
      case "admin_credit": return "rgba(0,230,118,0.12)";
      case "admin_debit": return "rgba(255,77,106,0.12)";
      case "balance_override": return "rgba(56,189,248,0.12)";
      default: return "rgba(56,189,248,0.12)";
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Notifications</h1>
          <p className="text-blue-300/60 text-xs">Real-time transaction alerts</p>
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <span
              className="px-2.5 py-1 rounded-full text-xs font-bold"
              style={{ background: "rgba(56,189,248,0.15)", color: "#38BDF8" }}
            >
              {unreadCount} unread
            </span>
          )}
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg"
              style={{ background: "rgba(56,189,248,0.1)", color: "#38BDF8", border: "1px solid rgba(56,189,248,0.2)" }}
            >
              <Check size={14} />
              Mark all read
            </button>
          )}
        </div>
      </div>

      <Card className="glass-card border-0 overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-[#8A9BB5]">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="py-16 text-center">
            <Bell size={40} className="mx-auto mb-3 text-[#8A9BB5] opacity-40" />
            <p className="text-[#8A9BB5]">No notifications yet</p>
            <p className="text-blue-300/40 text-xs mt-1">New transaction requests will appear here</p>
          </div>
        ) : (
          <div className="divide-y divide-[rgba(255,255,255,0.04)]">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className="flex items-start gap-4 p-4 hover:bg-white/5 transition-all cursor-pointer"
                style={{
                  background: notif.status === "unread" ? "rgba(56,189,248,0.03)" : "transparent",
                  borderLeft: notif.status === "unread" ? "3px solid #38BDF8" : "3px solid transparent",
                }}
                onClick={() => handleNotifClick(notif)}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: getIconBg(notif.type) }}
                >
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold text-white">{notif.title}</p>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                      {notif.status === "unread" && (
                        <span className="w-2 h-2 rounded-full bg-cyan-400" />
                      )}
                      <span className="text-xs text-blue-300/50">
                        {notif.createdAt instanceof Date
                          ? notif.createdAt.toLocaleString()
                          : "Just now"}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-blue-300/60 mb-2">{notif.message}</p>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs font-semibold flex items-center gap-1"
                      style={{ color: "#38BDF8" }}
                    >
                      <Eye size={11} />
                      View details
                    </span>
                    {notif.type === "new_transaction" && (
                      <Link
                        to="/admin/pending-transactions"
                        className="text-xs font-semibold"
                        style={{ color: "#FFAB00" }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        → Go to Pending
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* ── Notification Detail Dialog ── */}
      <Dialog open={!!selectedNotif} onOpenChange={(o) => !o && setSelectedNotif(null)}>
        <DialogContent className="bg-[#0F1829] border-[rgba(255,255,255,0.1)] max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              {selectedNotif && (
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: getIconBg(selectedNotif.type) }}
                >
                  {getIcon(selectedNotif.type)}
                </div>
              )}
              {selectedNotif?.title}
            </DialogTitle>
          </DialogHeader>

          {selectedNotif && (
            <div className="space-y-4">
              <p className="text-sm text-blue-300/70">{selectedNotif.message}</p>
              <p className="text-xs text-blue-300/40">
                {selectedNotif.createdAt instanceof Date
                  ? selectedNotif.createdAt.toLocaleString()
                  : ""}
              </p>

              {/* Transaction details if we found the related tx */}
              {relatedTx ? (
                <div className="rounded-xl overflow-hidden border border-[rgba(255,255,255,0.08)]">
                  <div className="bg-[#070B14] px-4 py-2">
                    <p className="text-xs font-semibold text-blue-300/60 uppercase tracking-wider">
                      Transaction Details
                    </p>
                  </div>
                  <div className="p-4 space-y-2 text-sm">
                    {[
                      { label: "Amount", value: `$${formatCurrency(relatedTx.amount)}`, highlight: true },
                      { label: "Type", value: relatedTx.type?.replace(/_/g, " ") },
                      { label: "From", value: `${relatedTx.fundingAccount} account` },
                      ...(relatedTx.toAccount ? [{ label: "To", value: `${relatedTx.toAccount} account` }] : []),
                      ...(relatedTx.recipientName ? [{ label: "Recipient", value: relatedTx.recipientName }] : []),
                      ...(relatedTx.toBank ? [{ label: "Bank", value: relatedTx.toBank }] : []),
                      ...(relatedTx.toCountry ? [{ label: "Country", value: relatedTx.toCountry }] : []),
                      ...(relatedTx.purpose ? [{ label: "Purpose", value: relatedTx.purpose }] : []),
                      ...(relatedTx.note ? [{ label: "Note", value: relatedTx.note }] : []),
                      { label: "Reference", value: relatedTx.transactionRef || relatedTx.id },
                      {
                        label: "Status",
                        value: relatedTx.status,
                        badge: relatedTx.status === "pending"
                          ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                          : relatedTx.status === "approved"
                            ? "bg-green-500/20 text-green-300 border-green-500/30"
                            : "bg-red-500/20 text-red-300 border-red-500/30",
                      },
                    ].map(({ label, value, highlight, badge }: any) => (
                      <div key={label} className="flex justify-between items-center py-1 border-b border-[rgba(255,255,255,0.04)]">
                        <span className="text-blue-300/60">{label}</span>
                        {badge ? (
                          <Badge className={badge}>{value}</Badge>
                        ) : (
                          <span className={`font-semibold capitalize ${highlight ? "text-cyan-400 font-mono text-base" : "text-white"}`}>
                            {value}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : selectedNotif.transactionId ? (
                <div className="text-center py-4 text-blue-300/50 text-sm">
                  Loading transaction details...
                </div>
              ) : null}

              {/* Decline reason for declined notifications */}
              {selectedNotif.declineReason && (
                <div className="p-3 rounded-xl" style={{ background: "rgba(255,77,106,0.08)", border: "1px solid rgba(255,77,106,0.2)" }}>
                  <p className="text-xs font-semibold text-red-400 mb-1">Decline Reason</p>
                  <p className="text-sm text-red-300">{selectedNotif.declineReason}</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="gap-2 mt-2">
            {/* Show approve/decline only if the related tx is still pending */}
            {relatedTx?.status === "pending" ? (
              <>
                <Button
                  onClick={handleRejectClick}
                  disabled={actionLoading}
                  className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 flex-1"
                >
                  <XCircle size={15} className="mr-1" />
                  Decline
                </Button>
                <Button
                  onClick={handleApproveClick}
                  disabled={actionLoading}
                  className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30 flex-1"
                >
                  <CheckCircle2 size={15} className="mr-1" />
                  Approve
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setSelectedNotif(null)}
                className="w-full bg-transparent border border-[rgba(255,255,255,0.1)] text-blue-300/60 hover:bg-white/5"
              >
                Close
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Approve Confirmation ── */}
      <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <DialogContent className="bg-[#0F1829] border-[rgba(255,255,255,0.1)]">
          <DialogHeader>
            <DialogTitle className="text-white">Confirm Approval</DialogTitle>
            <DialogDescription className="text-blue-300/60">
              This will deduct the amount and notify the user.
            </DialogDescription>
          </DialogHeader>
          {relatedTx && (
            <div className="p-4 rounded-xl space-y-2 text-sm" style={{ background: "rgba(56,189,248,0.06)", border: "1px solid rgba(56,189,248,0.15)" }}>
              <div className="flex justify-between">
                <span className="text-blue-300/60">User</span>
                <span className="text-white font-semibold">{relatedTx.userFullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-300/60">Amount to deduct</span>
                <span className="text-cyan-400 font-mono font-bold text-lg">${formatCurrency(relatedTx.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-300/60">From account</span>
                <span className="text-white capitalize">{relatedTx.fundingAccount}</span>
              </div>
              <div className="flex justify-between border-t border-[rgba(255,255,255,0.05)] pt-2 mt-1">
                <span className="text-blue-300/60">Balance after</span>
                <span className="text-green-400 font-semibold">
                  ${formatCurrency(Math.max(0, (relatedTx.balanceAtSubmission || 0) - relatedTx.amount))}
                </span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setApproveDialogOpen(false)} className="bg-transparent border border-[rgba(255,255,255,0.1)] text-blue-300/60 hover:bg-white/5">
              Cancel
            </Button>
            <Button onClick={confirmApprove} disabled={actionLoading} className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30">
              {actionLoading ? "Approving..." : "Confirm Approval"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Decline Dialog ── */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="bg-[#0F1829] border-[rgba(255,255,255,0.1)]">
          <DialogHeader>
            <DialogTitle className="text-white">Decline Transaction</DialogTitle>
            <DialogDescription className="text-blue-300/60">
              Provide a reason — the user will see this in their notification.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Reason for declining (min 5 characters)..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            rows={3}
            className="bg-[#070B14] border-[rgba(255,255,255,0.1)] text-white placeholder:text-blue-300/40"
          />
          <DialogFooter>
            <Button onClick={() => setRejectDialogOpen(false)} className="bg-transparent border border-[rgba(255,255,255,0.1)] text-blue-300/60 hover:bg-white/5">
              Cancel
            </Button>
            <Button onClick={confirmReject} disabled={actionLoading || rejectReason.trim().length < 5} className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30">
              {actionLoading ? "Declining..." : "Confirm Decline"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
