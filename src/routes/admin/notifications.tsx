import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, CheckCircle2, Clock, XCircle, Check, Eye, AlertTriangle, UserCheck, UserX, Trash2 } from "lucide-react";
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
import { db } from "../../firebase/config";
import {
  collection, addDoc, updateDoc, doc, getDocs,
  query, where, serverTimestamp, deleteDoc,
} from "firebase/firestore";
import { logAdminAction } from "../../utils/logAdminAction";
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
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingAll, setDeletingAll] = useState(false);
  // Separate loading state for beneficiary actions — fully independent
  const [benLoading, setBenLoading] = useState(false);

  // Delete a single notification
  const handleDeleteNotif = async (e: React.MouseEvent, notifId: string) => {
    e.stopPropagation();
    setDeletingId(notifId);
    try {
      await deleteDoc(doc(db, "notifications", notifId));
      toast.success("Notification deleted");
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeletingId(null);
    }
  };

  // Delete ALL admin notifications
  const handleDeleteAll = async () => {
    if (!window.confirm(`Delete all ${notifications.length} notifications? This cannot be undone.`)) return;
    setDeletingAll(true);
    try {
      await Promise.all(notifications.map((n) => deleteDoc(doc(db, "notifications", n.id))));
      toast.success("All notifications deleted");
    } catch {
      toast.error("Failed to delete all");
    } finally {
      setDeletingAll(false);
    }
  };

  // ── Auto-cleanup: delete admin notifications older than 24 hours ──────────
  // Runs once when the page loads, silently clears stale notifications
  useEffect(() => {
    if (loading || notifications.length === 0) return;
    const cutoff = Date.now() - 24 * 60 * 60 * 1000; // 24 hours ago
    const stale = notifications.filter((n) => {
      const ts = n.createdAt instanceof Date ? n.createdAt.getTime() : 0;
      return ts < cutoff;
    });
    if (stale.length === 0) return;
    // Fire-and-forget — don't block the UI
    Promise.all(stale.map((n) => deleteDoc(doc(db, "notifications", n.id))))
      .then(() => console.log(`Auto-cleaned ${stale.length} admin notifications older than 24h`))
      .catch((err) => console.error("Auto-cleanup failed:", err));
  }, [loading]); // only run when loading transitions to false (i.e., once on mount)

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

  // ── Beneficiary approve/decline ─────────────────────────────────────
  // Parse beneficiary info from the notification message directly
  // (avoids Firestore query issues with security rules)
  const parseBenFromNotif = (notif: any) => {
    // Message format: "X wants to add FULLNAME (BANK) as a beneficiary..."
    const match = notif?.message?.match(/add (.+?) \((.+?)\) as a beneficiary/);
    return {
      fullName: match?.[1] || "",
      bankName: match?.[2] || "",
    };
  };

  const handleBeneficiaryApprove = async () => {
    if (!selectedNotif || benLoading) return;
    setBenLoading(true);
    const userId = selectedNotif.userId;
    const userFullName = selectedNotif.userFullName || selectedNotif.userEmail || "User";

    try {
      if (!userId) {
        toast.error("User ID missing on this notification");
        return;
      }

      const parsed = parseBenFromNotif(selectedNotif);

      // 1. Try to find the pending request in Firestore (best effort)
      let benData: any = parsed.fullName ? { ...parsed, accountNumber: "", bankId: "other", accountType: "Personal", initials: parsed.fullName.charAt(0).toUpperCase() } : null;
      let reqDocId: string | null = null;
      try {
        const reqSnap = await getDocs(query(
          collection(db, "beneficiaryRequests"),
          where("userId", "==", userId),
          where("status", "==", "pending"),
        ));
        if (!reqSnap.empty) {
          const sorted = reqSnap.docs.sort((a, b) =>
            (b.data().createdAt?.toMillis?.() || 0) - (a.data().createdAt?.toMillis?.() || 0)
          );
          reqDocId = sorted[0].id;
          benData = sorted[0].data();
        }
      } catch (e) {
        console.warn("Could not fetch beneficiaryRequests — using parsed data:", e);
      }

      // 2. Write beneficiary to user's collection
      if (benData?.fullName) {
        await addDoc(collection(db, "beneficiaries"), {
          userId,
          fullName: benData.fullName || "",
          nickname: benData.nickname || "",
          bankName: benData.bankName || "",
          bankId: benData.bankId || "other",
          accountNumber: benData.accountNumber || "",
          accountType: benData.accountType || "Personal",
          initials: benData.initials || benData.fullName.charAt(0).toUpperCase(),
          createdAt: serverTimestamp(),
          approvedByAdmin: true,
        });
      }

      // 3. Mark request approved (if found)
      if (reqDocId) {
        try {
          await updateDoc(doc(db, "beneficiaryRequests", reqDocId), {
            status: "approved", resolvedAt: serverTimestamp(),
          });
        } catch (e) { console.warn("Could not update request:", e); }
      }

      // 4. Notify user
      await addDoc(collection(db, "notifications"), {
        recipientId: userId, recipientType: "user",
        type: "beneficiary_approved",
        title: "Beneficiary Approved ✓",
        message: benData?.fullName
          ? `${benData.fullName} (${benData.bankName || "bank"}) has been added to your saved beneficiaries.`
          : "Your beneficiary request has been approved.",
        userId, userFullName, amount: 0,
        transactionType: "beneficiary_request",
        status: "unread", declineReason: null,
        createdAt: serverTimestamp(), readAt: null,
      });

      // 5. Mark this admin notification as read
      await updateDoc(doc(db, "notifications", selectedNotif.id), {
        status: "read", readAt: serverTimestamp(),
      });

      await logAdminAction("BENEFICIARY_APPROVED",
        `Approved beneficiary for ${userFullName}`,
        userId, userFullName, {});

      toast.success(`Beneficiary approved — ${userFullName} notified`);
      setSelectedNotif(null);
    } catch (err: any) {
      console.error("Beneficiary approve error:", err);
      toast.error(err?.message || "Failed to approve — check console");
    } finally {
      setBenLoading(false);
    }
  };

  const handleBeneficiaryDecline = async () => {
    if (!selectedNotif || benLoading) return;
    setBenLoading(true);
    const userId = selectedNotif.userId;
    const userFullName = selectedNotif.userFullName || selectedNotif.userEmail || "User";

    try {
      if (!userId) {
        toast.error("User ID missing on this notification");
        return;
      }

      const parsed = parseBenFromNotif(selectedNotif);

      // Mark all pending requests declined (best effort)
      try {
        const reqSnap = await getDocs(query(
          collection(db, "beneficiaryRequests"),
          where("userId", "==", userId),
          where("status", "==", "pending"),
        ));
        for (const reqDoc of reqSnap.docs) {
          await updateDoc(doc(db, "beneficiaryRequests", reqDoc.id), {
            status: "declined", resolvedAt: serverTimestamp(),
          });
        }
      } catch (e) { console.warn("Could not update requests:", e); }

      // Notify user
      await addDoc(collection(db, "notifications"), {
        recipientId: userId, recipientType: "user",
        type: "beneficiary_declined",
        title: "Beneficiary Request Declined",
        message: parsed.fullName
          ? `Your request to add ${parsed.fullName} (${parsed.bankName}) was declined. Contact support for assistance.`
          : "Your beneficiary request was declined. Please contact support.",
        userId, userFullName, amount: 0,
        transactionType: "beneficiary_request",
        status: "unread", declineReason: null,
        createdAt: serverTimestamp(), readAt: null,
      });

      // Mark admin notification as read
      await updateDoc(doc(db, "notifications", selectedNotif.id), {
        status: "read", readAt: serverTimestamp(),
      });

      await logAdminAction("BENEFICIARY_DECLINED",
        `Declined beneficiary for ${userFullName}`,
        userId, userFullName, {});

      toast.success("Beneficiary declined — user notified");
      setSelectedNotif(null);
    } catch (err: any) {
      console.error("Beneficiary decline error:", err);
      toast.error(err?.message || "Failed to decline — check console");
    } finally {
      setBenLoading(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "new_transaction":      return <Clock size={20} style={{ color: "#FFAB00" }} />;
      case "transaction_approved": return <CheckCircle2 size={20} style={{ color: "#00E676" }} />;
      case "transaction_declined": return <XCircle size={20} style={{ color: "#FF4D6A" }} />;
      case "admin_credit":         return <CheckCircle2 size={20} style={{ color: "#00E676" }} />;
      case "admin_debit":          return <XCircle size={20} style={{ color: "#FF4D6A" }} />;
      case "balance_override":     return <Bell size={20} style={{ color: "#38BDF8" }} />;
      case "beneficiary_request":  return <UserCheck size={20} style={{ color: "#A855F7" }} />;
      default:                     return <Bell size={20} style={{ color: "#38BDF8" }} />;
    }
  };

  const getIconBg = (type: string) => {
    switch (type) {
      case "new_transaction":      return "rgba(255,171,0,0.12)";
      case "transaction_approved": return "rgba(0,230,118,0.12)";
      case "transaction_declined": return "rgba(255,77,106,0.12)";
      case "admin_credit":         return "rgba(0,230,118,0.12)";
      case "admin_debit":          return "rgba(255,77,106,0.12)";
      case "balance_override":     return "rgba(56,189,248,0.12)";
      case "beneficiary_request":  return "rgba(168,85,247,0.12)";
      default:                     return "rgba(56,189,248,0.12)";
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
          {notifications.length > 0 && (
            <button
              onClick={handleDeleteAll}
              disabled={deletingAll}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition-all"
              style={{ background: "rgba(239,68,68,0.1)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.2)", opacity: deletingAll ? 0.6 : 1 }}
            >
              <Trash2 size={14} />
              {deletingAll ? "Deleting…" : "Delete All"}
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
                className="flex items-start gap-4 p-4 hover:bg-white/5 transition-all cursor-pointer relative"
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
                      {/* Delete button — always visible */}
                      <button
                        onClick={(e) => handleDeleteNotif(e, notif.id)}
                        disabled={deletingId === notif.id}
                        className="p-1.5 rounded-lg transition-all hover:bg-red-500/20 flex-shrink-0"
                        title="Delete notification"
                        style={{ opacity: deletingId === notif.id ? 0.4 : 1 }}
                      >
                        <Trash2 size={14} style={{ color: "#EF4444" }} />
                      </button>
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

          <DialogFooter className="gap-2 mt-2 flex-col">
            {/* Beneficiary request — approve / decline */}
            {selectedNotif?.type === "beneficiary_request" ? (
              <>
                <div className="flex gap-2 w-full">
                  <Button
                    onClick={handleBeneficiaryDecline}
                    disabled={benLoading}
                    className="flex-1 bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/30"
                  >
                    <UserX size={15} className="mr-1.5" />
                    {benLoading ? "…" : "Decline"}
                  </Button>
                  <Button
                    onClick={handleBeneficiaryApprove}
                    disabled={benLoading}
                    className="flex-1 bg-green-500/15 hover:bg-green-500/25 text-green-400 border border-green-500/30"
                  >
                    <UserCheck size={15} className="mr-1.5" />
                    {benLoading ? "Approving…" : "Approve"}
                  </Button>
                </div>
                <Link to="/admin/beneficiary-requests" onClick={() => setSelectedNotif(null)}
                  className="w-full text-center text-xs text-blue-300/50 hover:text-blue-300 pt-1">
                  → Or manage all beneficiary requests
                </Link>
              </>
            ) : relatedTx?.status === "pending" ? (
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
