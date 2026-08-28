import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Check, X, Clock, UserCheck, UserX, Users, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { db } from "../../firebase/config";
import {
  collection, onSnapshot, query, orderBy, updateDoc, doc,
  addDoc, serverTimestamp, deleteDoc, getDocs, where,
} from "firebase/firestore";
import { toast } from "sonner";
import { logAdminAction } from "../../utils/logAdminAction";

export const Route = createFileRoute("/admin/beneficiary-requests")({
  component: BeneficiaryRequestsPage,
});

interface BeneficiaryRequest {
  id: string;
  userId: string;
  userFullName: string;
  userEmail: string;
  fullName: string;
  nickname: string;
  bankName: string;
  bankId: string;
  accountNumber: string;
  accountType: "Personal" | "Business";
  initials: string;
  status: "pending" | "approved" | "declined";
  createdAt: Date;
}

function statusColor(s: string) {
  if (s === "approved") return "bg-green-500/20 text-green-400 border-green-500/30";
  if (s === "declined") return "bg-red-500/20 text-red-400 border-red-500/30";
  return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
}

function BeneficiaryRequestsPage() {
  const [requests, setRequests] = useState<BeneficiaryRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved" | "declined">("all");

  useEffect(() => {
    const q = query(collection(db, "beneficiaryRequests"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setRequests(snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
        createdAt: d.data().createdAt?.toDate?.() ?? new Date(),
      })) as BeneficiaryRequest[]);
      setLoading(false);
    });
    return unsub;
  }, []);

  const filtered = requests.filter((r) => filterStatus === "all" || r.status === filterStatus);

  const handleApprove = async (req: BeneficiaryRequest) => {
    setProcessingId(req.id);
    try {
      // 1. Write approved beneficiary to user subcollection (admin has write access to users/*)
      await addDoc(collection(db, "users", req.userId, "beneficiaries"), {
        userId: req.userId,
        fullName: req.fullName,
        nickname: req.nickname || "",
        bankName: req.bankName,
        bankId: req.bankId,
        accountNumber: req.accountNumber,
        accountType: req.accountType,
        initials: req.initials,
        createdAt: serverTimestamp(),
        approvedByAdmin: true,
      });
      // Also try top-level (non-critical)
      try {
        await addDoc(collection(db, "beneficiaries"), {
          userId: req.userId,
          fullName: req.fullName,
          nickname: req.nickname || "",
          bankName: req.bankName,
          bankId: req.bankId,
          accountNumber: req.accountNumber,
          accountType: req.accountType,
          initials: req.initials,
          createdAt: serverTimestamp(),
          approvedByAdmin: true,
        });
      } catch { /* rules may block top-level — subcollection is primary */ }

      // 2. Update request status
      await updateDoc(doc(db, "beneficiaryRequests", req.id), {
        status: "approved",
        resolvedAt: serverTimestamp(),
      });

      // 3. Notify the user
      await addDoc(collection(db, "notifications"), {
        recipientId: req.userId,
        recipientType: "user",
        type: "beneficiary_approved",
        title: "Beneficiary Approved ✓",
        message: `Your request to add ${req.fullName} (${req.bankName}) as a beneficiary has been approved.`,
        userId: req.userId,
        userFullName: req.userFullName,
        amount: 0,
        transactionType: "beneficiary_request",
        status: "unread",
        declineReason: null,
        createdAt: serverTimestamp(),
        readAt: null,
      });

      await logAdminAction("BENEFICIARY_APPROVED",
        `Approved beneficiary request: ${req.fullName} (${req.bankName}) for ${req.userFullName}`,
        req.userId, req.userFullName, { beneficiaryName: req.fullName, bank: req.bankName });

      toast.success(`Approved — ${req.fullName} added to ${req.userFullName}'s beneficiaries`);
    } catch (err: any) {
      toast.error(err?.message || "Failed to approve");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDecline = async (req: BeneficiaryRequest) => {
    setProcessingId(req.id);
    try {
      // Update request status
      await updateDoc(doc(db, "beneficiaryRequests", req.id), {
        status: "declined",
        resolvedAt: serverTimestamp(),
      });

      // Notify the user
      await addDoc(collection(db, "notifications"), {
        recipientId: req.userId,
        recipientType: "user",
        type: "beneficiary_declined",
        title: "Beneficiary Request Declined",
        message: `Your request to add ${req.fullName} (${req.bankName}) as a beneficiary was declined. Please contact support for more information.`,
        userId: req.userId,
        userFullName: req.userFullName,
        amount: 0,
        transactionType: "beneficiary_request",
        status: "unread",
        declineReason: null,
        createdAt: serverTimestamp(),
        readAt: null,
      });

      await logAdminAction("BENEFICIARY_DECLINED",
        `Declined beneficiary request: ${req.fullName} (${req.bankName}) for ${req.userFullName}`,
        req.userId, req.userFullName, { beneficiaryName: req.fullName, bank: req.bankName });

      toast.success("Request declined");
    } catch (err: any) {
      toast.error(err?.message || "Failed to decline");
    } finally {
      setProcessingId(null);
    }
  };

  const pendingCount = requests.filter((r) => r.status === "pending").length;
  const approvedCount = requests.filter((r) => r.status === "approved").length;
  const declinedCount = requests.filter((r) => r.status === "declined").length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
          <Users size={22} className="text-cyan-400" />
          Beneficiary Requests
        </h1>
        <p className="text-blue-300/60 text-xs mt-0.5">
          Review and approve beneficiary additions requested by customers
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Pending",  value: pendingCount,  color: "#FFAB00" },
          { label: "Approved", value: approvedCount, color: "#00E676" },
          { label: "Declined", value: declinedCount, color: "#FF4D6A" },
        ].map(({ label, value, color }) => (
          <div key={label} className="p-3 rounded-xl text-center"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="text-lg font-bold font-mono" style={{ color }}>{value}</p>
            <p className="text-xs text-blue-300/60 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 flex-wrap">
        {(["all", "pending", "approved", "declined"] as const).map((s) => (
          <button key={s} onClick={() => setFilterStatus(s)}
            className="px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-all"
            style={{
              background: filterStatus === s ? "rgba(56,189,248,0.2)" : "rgba(255,255,255,0.05)",
              color: filterStatus === s ? "#38BDF8" : "#8A9BB5",
              border: filterStatus === s ? "1px solid rgba(56,189,248,0.4)" : "1px solid rgba(255,255,255,0.07)",
            }}>
            {s}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <Card className="glass-card border-0">
          <div className="py-12 text-center text-[#8A9BB5]">Loading requests…</div>
        </Card>
      ) : filtered.length === 0 ? (
        <Card className="glass-card border-0">
          <div className="py-12 text-center text-[#8A9BB5]">
            {filterStatus === "pending" ? "No pending requests" : "No requests found"}
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((req) => (
            <Card key={req.id} className="glass-card border-0">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  {/* Avatar */}
                  <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                    style={{ background: "linear-gradient(135deg,#38BDF8,#6366F1)", color: "#fff" }}>
                    {req.initials || req.fullName.charAt(0).toUpperCase()}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <p className="text-white font-semibold text-sm">{req.fullName}</p>
                      <Badge className={statusColor(req.status)}>{req.status}</Badge>
                    </div>
                    <p className="text-blue-300/60 text-xs">{req.bankName} · {req.accountNumber}</p>
                    <p className="text-blue-300/40 text-xs mt-0.5">
                      Requested by <span className="text-blue-300/70">{req.userFullName}</span>
                      {" · "}{req.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </div>

                  {/* Action buttons — only for pending */}
                  {req.status === "pending" && (
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleApprove(req)}
                        disabled={processingId === req.id}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all"
                        style={{
                          background: processingId === req.id ? "rgba(0,230,118,0.3)" : "rgba(0,230,118,0.85)",
                          opacity: processingId === req.id ? 0.6 : 1,
                        }}>
                        <UserCheck size={14} />
                        {processingId === req.id ? "…" : "Approve"}
                      </button>
                      <button
                        onClick={() => handleDecline(req)}
                        disabled={processingId === req.id}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all"
                        style={{
                          background: "rgba(255,77,106,0.15)",
                          color: "#FF4D6A",
                          border: "1px solid rgba(255,77,106,0.3)",
                          opacity: processingId === req.id ? 0.6 : 1,
                        }}>
                        <UserX size={14} />
                        {processingId === req.id ? "…" : "Decline"}
                      </button>
                    </div>
                  )}

                  {/* Resolved indicator */}
                  {req.status === "approved" && (
                    <div className="flex items-center gap-1.5 text-green-400 text-xs font-semibold flex-shrink-0">
                      <Check size={14} />
                      Added
                    </div>
                  )}
                  {req.status === "declined" && (
                    <div className="flex items-center gap-1.5 text-red-400 text-xs font-semibold flex-shrink-0">
                      <X size={14} />
                      Declined
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
