import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, Eye, EyeOff, Edit2, Save, X, RefreshCw, Camera, Clock, History, Pencil, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { db } from "../../firebase/config";
import { doc, onSnapshot, updateDoc, Timestamp, collection, addDoc, query, where, orderBy, getDocs } from "firebase/firestore";
import { toast } from "sonner";
import { useAdminAuth } from "../../admin/hooks/useAdminAuth";
import { generateTransactionRef } from "../../utils/generateTransactionRef";

export const Route = createFileRoute("/admin/users/$userId")({
  component: UserDetailPage,
});

function UserDetailPage() {
  const { userId } = useParams({ from: "/admin/users/$userId" });
  const navigate = useNavigate();
  const { admin, loading: authLoading } = useAdminAuth();
  
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Security visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showPin, setShowPin] = useState(false);
  
  // Password editing state
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  
  // PIN editing state
  const [isEditingPin, setIsEditingPin] = useState(false);
  const [newPin, setNewPin] = useState("");
  const [savingPin, setSavingPin] = useState(false);

  // Photo upload state
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  // Account tier editing state
  const [isEditingTier, setIsEditingTier] = useState(false);
  const [newTier, setNewTier] = useState("");
  const [savingTier, setSavingTier] = useState(false);

  // Member Since editing state
  const [isEditingMemberSince, setIsEditingMemberSince] = useState(false);
  const [newMemberSince, setNewMemberSince] = useState("");
  const [savingMemberSince, setSavingMemberSince] = useState(false);

  // Backdate transactions state
  const [showBackdateModal, setShowBackdateModal] = useState(false);
  const [backdateFrom, setBackdateFrom] = useState("");
  const [backdateTo, setBackdateTo] = useState("");
  const [backdating, setBackdating] = useState(false);

  // Transaction history state
  const [showTxHistory, setShowTxHistory] = useState(false);
  const [userTransactions, setUserTransactions] = useState<any[]>([]);
  const [txLoading, setTxLoading] = useState(false);

  // Edit transaction state
  const [editTx, setEditTx] = useState<any>(null);
  const [editTxDescription, setEditTxDescription] = useState("");
  const [editTxAmount, setEditTxAmount] = useState("");
  const [editTxType, setEditTxType] = useState<"credit" | "debit">("debit");
  const [editTxStatus, setEditTxStatus] = useState("");
  const [editTxDate, setEditTxDate] = useState("");
  const [editTxTime, setEditTxTime] = useState("");
  const [savingTx, setSavingTx] = useState(false);

  // True whenever any modal is open — used to disable all page buttons
  const anyModalOpen = showBackdateModal || !!editTx;

  const ACCOUNT_TIERS = ["Standard", "Bronze", "Silver", "Gold", "Platinum", "VIP", "Elite", "Diamond"];

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("Photo must be under 5MB"); return; }
    if (!file.type.startsWith("image/")) { toast.error("Only image files are allowed"); return; }
    setUploadingPhoto(true);
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      await updateDoc(doc(db, "users", userId), { photoURL: base64 });
      toast.success("Profile photo updated!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload photo. Please try again.");
    } finally {
      setUploadingPhoto(false);
      if (e.target) e.target.value = "";
    }
  };

  const handleUpdateTier = async () => {
    if (!newTier) return;
    setSavingTier(true);
    try {
      await updateDoc(doc(db, "users", userId), { accountTier: newTier });
      toast.success(`Account tier updated to ${newTier}`);
      setIsEditingTier(false);
      setNewTier("");
    } catch (err: any) {
      toast.error(err?.message || "Failed to update tier");
    } finally {
      setSavingTier(false);
    }
  };

  const handleUpdateMemberSince = async () => {
    if (!newMemberSince) return;
    setSavingMemberSince(true);
    try {
      // Store as a Firestore Timestamp so orderBy("createdAt") still works
      const date = new Date(newMemberSince);
      await updateDoc(doc(db, "users", userId), { createdAt: Timestamp.fromDate(date) });
      toast.success("Member since date updated");
      setIsEditingMemberSince(false);
      setNewMemberSince("");
    } catch (err: any) {
      toast.error(err?.message || "Failed to update date");
    } finally {
      setSavingMemberSince(false);
    }
  };

  // ── Backdate transactions ────────────────────────────────────────────
  const handleBackdateTransactions = async () => {
    if (!backdateFrom || !backdateTo) {
      toast.error("Please select both a start and end date");
      return;
    }
    const start = new Date(backdateFrom);
    const end   = new Date(backdateTo);
    end.setHours(23, 59, 59, 999);

    if (start >= end) {
      toast.error("Start date must be before end date");
      return;
    }
    if (end > new Date()) {
      toast.error("End date cannot be in the future");
      return;
    }

    setBackdating(true);
    try {
      const fullName     = user.fullName || "Account Holder";
      const checkingAcct = user.checkingAccountNumber || "";
      const savingsAcct  = user.savingsAccountNumber  || "";

      // ── Transaction templates that feel realistic ─────────────────
      const templates = [
        { desc: "Direct Deposit — Payroll",           type: "credit",  cat: "Income",    acct: "checking", minAmt: 1200, maxAmt: 4500  },
        { desc: "ACH Transfer — Online Bill Pay",     type: "debit",   cat: "Bills",     acct: "checking", minAmt: 50,   maxAmt: 350   },
        { desc: "POS Purchase — Grocery Store",       type: "debit",   cat: "Shopping",  acct: "checking", minAmt: 25,   maxAmt: 180   },
        { desc: "ATM Withdrawal",                     type: "debit",   cat: "Cash",      acct: "checking", minAmt: 40,   maxAmt: 300   },
        { desc: "Utility Bill — Electric Company",    type: "debit",   cat: "Bills",     acct: "checking", minAmt: 60,   maxAmt: 220   },
        { desc: "Online Transfer to Savings",         type: "debit",   cat: "Transfer",  acct: "checking", minAmt: 100,  maxAmt: 800   },
        { desc: "Transfer from Checking",             type: "credit",  cat: "Transfer",  acct: "savings",  minAmt: 100,  maxAmt: 800   },
        { desc: "Interest Credit — Savings Account",  type: "credit",  cat: "Interest",  acct: "savings",  minAmt: 1,    maxAmt: 35    },
        { desc: "Mobile Deposit — Check",             type: "credit",  cat: "Deposit",   acct: "checking", minAmt: 200,  maxAmt: 2000  },
        { desc: "Subscription — Streaming Service",  type: "debit",   cat: "Bills",     acct: "checking", minAmt: 10,   maxAmt: 50    },
        { desc: "Restaurant — Dining",                type: "debit",   cat: "Food",      acct: "checking", minAmt: 15,   maxAmt: 120   },
        { desc: "Gas Station Purchase",               type: "debit",   cat: "Transport", acct: "checking", minAmt: 30,   maxAmt: 90    },
        { desc: "Freelance Payment Received",         type: "credit",  cat: "Income",    acct: "checking", minAmt: 300,  maxAmt: 2500  },
        { desc: "Insurance Premium Payment",          type: "debit",   cat: "Bills",     acct: "checking", minAmt: 80,   maxAmt: 400   },
        { desc: "Online Shopping — Retail",           type: "debit",   cat: "Shopping",  acct: "checking", minAmt: 20,   maxAmt: 250   },
      ];

      // Spread transactions across the date range
      const totalDays = Math.ceil((end.getTime() - start.getTime()) / 86_400_000);
      // 1–3 transactions per day on average, capped at 60 total
      const count = Math.min(Math.max(Math.round(totalDays * 1.8), 5), 60);

      // Generate all dates first, then sort ascending so the first
      // transaction falls on the start date and the last on the end date
      const txDates: Date[] = [];
      for (let i = 0; i < count; i++) {
        const fraction = i / count + (Math.random() * 0.6) / count;
        const txDate = new Date(start.getTime() + fraction * (end.getTime() - start.getTime()));
        txDate.setSeconds(Math.floor(Math.random() * 59));
        txDate.setMinutes(Math.floor(Math.random() * 59));
        txDate.setHours(Math.floor(Math.random() * 22) + 1); // 01:00 – 23:00
        txDates.push(txDate);
      }
      // Sort chronologically — earliest first, latest last
      txDates.sort((a, b) => a.getTime() - b.getTime());

      const writes: Promise<any>[] = [];

      for (let i = 0; i < count; i++) {
        const txDate = txDates[i];

        // Pick a template, weighted towards checking debits (realistic)
        const tpl = templates[Math.floor(Math.random() * templates.length)];
        const amount = parseFloat(
          (tpl.minAmt + Math.random() * (tpl.maxAmt - tpl.minAmt)).toFixed(2)
        );
        const accountNumber = tpl.acct === "savings" ? savingsAcct : checkingAcct;
        const txTimestamp   = Timestamp.fromDate(txDate);

        writes.push(
          addDoc(collection(db, "transactions"), {
            userId,
            userFullName: fullName,
            description:  tpl.desc,
            type:         tpl.type,
            amount,
            category:     tpl.cat,
            status:       "completed",
            fundingAccount:   tpl.acct,
            accountNumber,
            transactionRef:   generateTransactionRef(),
            createdAt:        txTimestamp,
            date:             txTimestamp,
            createdByAdmin:   true,
            backdated:        true,
          })
        );
      }

      await Promise.all(writes);

      toast.success(
        `${count} backdated transactions created between ${start.toLocaleDateString()} and ${end.toLocaleDateString()}`,
        { duration: 6000 }
      );
      setShowBackdateModal(false);
      setBackdateFrom("");
      setBackdateTo("");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to create backdated transactions");
    } finally {
      setBackdating(false);
    }
  };

  // ── Load user transactions ───────────────────────────────────────────
  const loadUserTransactions = async () => {
    setTxLoading(true);
    try {
      const q = query(
        collection(db, "transactions"),
        where("userId", "==", userId)
      );
      const snap = await getDocs(q);
      const txs = snap.docs.map((d) => {
        const data = d.data();
        const createdAt = data.createdAt?.toDate
          ? data.createdAt.toDate()
          : new Date(data.createdAt || 0);
        return { id: d.id, ...data, createdAt };
      });
      // Sort newest first client-side
      txs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      setUserTransactions(txs);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load transactions");
    } finally {
      setTxLoading(false);
    }
  };

  const handleToggleTxHistory = async () => {
    if (!showTxHistory) {
      setShowTxHistory(true);
      await loadUserTransactions();
    } else {
      setShowTxHistory(false);
    }
  };

  // ── Open edit modal ──────────────────────────────────────────────────
  const openEditTx = (tx: any) => {
    setEditTx(tx);
    setEditTxDescription(tx.description || "");
    setEditTxAmount(String(tx.amount || ""));
    setEditTxType(tx.type === "credit" ? "credit" : "debit");
    setEditTxStatus(tx.status || "completed");
    const d = tx.createdAt instanceof Date ? tx.createdAt : new Date(tx.createdAt);
    setEditTxDate(d.toISOString().split("T")[0]);
    // Populate time as HH:MM from the existing transaction
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    setEditTxTime(`${hh}:${mm}`);
  };

  // ── Save edited transaction ──────────────────────────────────────────
  const handleSaveTxEdit = async () => {
    if (!editTx) return;
    const amount = parseFloat(editTxAmount);
    if (!editTxDescription.trim()) { toast.error("Description is required"); return; }
    if (isNaN(amount) || amount <= 0) { toast.error("Enter a valid amount"); return; }
    if (!editTxDate) { toast.error("Date is required"); return; }
    setSavingTx(true);
    try {
      // Combine date + time into a single Date object
      const [hh, mm] = editTxTime ? editTxTime.split(":").map(Number) : [0, 0];
      const newDate = new Date(editTxDate);
      newDate.setHours(hh, mm, 0, 0);
      await updateDoc(doc(db, "transactions", editTx.id), {
        description: editTxDescription.trim(),
        amount,
        type: editTxType,
        status: editTxStatus,
        createdAt: Timestamp.fromDate(newDate),
        date: Timestamp.fromDate(newDate),
      });
      toast.success("Transaction updated");
      setEditTx(null);
      // Refresh the list
      await loadUserTransactions();
    } catch (err: any) {
      toast.error(err?.message || "Failed to update transaction");
    } finally {
      setSavingTx(false);
    }
  };

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && !admin) {
      navigate({ to: "/admin-login" });
    }
  }, [authLoading, admin, navigate]);

  // Fetch user data
  useEffect(() => {
    if (!userId) return;

    const userRef = doc(db, "users", userId);
    const unsubscribe = onSnapshot(
      userRef,
      (snap) => {
        if (snap.exists()) {
          const userData = { id: snap.id, ...snap.data() };
          console.log("📊 User data loaded:", {
            email: userData.email,
            hasPassword: !!userData.password,
            password: userData.password,
            hasPin: !!userData.transactionPin,
            pin: userData.transactionPin
          });
          setUser(userData);
          setError(null);
        } else {
          setError("User not found");
        }
        setLoading(false);
      },
      (err) => {
        console.error("Error loading user:", err);
        setError("Failed to load user data");
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [userId]);

  // Handle password update
  const handleUpdatePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setSavingPassword(true);
    try {
      // Store both the display password AND a pending password change flag
      // The pending password will be applied on the user's next login
      await updateDoc(doc(db, "users", userId), {
        password: newPassword, // For display in admin panel
        pendingPasswordChange: newPassword, // Will be applied on next login
        passwordChangedByAdmin: true,
        passwordChangeTimestamp: Timestamp.now(),
      });
      toast.success(
        "Password updated! The new password will take effect when the user logs in next time.",
        { duration: 5000 }
      );
      setIsEditingPassword(false);
      setNewPassword("");
      setShowPassword(true); // Auto-show the new password
    } catch (err) {
      console.error("Error updating password:", err);
      toast.error("Failed to update password");
    } finally {
      setSavingPassword(false);
    }
  };

  // Handle PIN update
  const handleUpdatePin = async () => {
    if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
      toast.error("PIN must be exactly 4 digits");
      return;
    }

    setSavingPin(true);
    try {
      await updateDoc(doc(db, "users", userId), {
        transactionPin: newPin,
      });
      toast.success("Transaction PIN updated successfully!");
      setIsEditingPin(false);
      setNewPin("");
      setShowPin(true); // Auto-show the new PIN
    } catch (err) {
      console.error("Error updating PIN:", err);
      toast.error("Failed to update PIN");
    } finally {
      setSavingPin(false);
    }
  };

  // Handle PIN regeneration
  const handleRegeneratePin = async () => {
    const generatedPin = Math.floor(1000 + Math.random() * 9000).toString();
    
    try {
      await updateDoc(doc(db, "users", userId), {
        transactionPin: generatedPin,
      });
      toast.success(`New PIN generated: ${generatedPin}`, { duration: 8000 });
      setShowPin(true); // Auto-show the new PIN
    } catch (err) {
      console.error("Error regenerating PIN:", err);
      toast.error("Failed to regenerate PIN");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-cyan-400 text-lg animate-pulse">Loading user details...</div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <p className="text-red-400 text-lg">{error || "User not found"}</p>
        <Button
          onClick={() => navigate({ to: "/admin/users" })}
          className="bg-cyan-500 hover:bg-cyan-600 text-white"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Users
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Back Button */}
      <button
        onClick={() => navigate({ to: "/admin/users" })}
        className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors text-sm font-medium"
      >
        <ArrowLeft size={16} />
        Back to Users
      </button>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">User Details</h1>
        <p className="text-gray-400 text-sm mt-1">View and manage user information</p>
      </div>

      {/* Profile Card */}
      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle className="text-white text-lg">Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Picture & Name */}
          <div className="flex items-center gap-4">
            {/* Clickable avatar with upload */}
            <div className="relative flex-shrink-0">
              <button
                onClick={() => photoInputRef.current?.click()}
                disabled={uploadingPhoto}
                className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center relative group focus:outline-none"
                style={{ background: "linear-gradient(to right, #06b6d4, #7c3aed)" }}
                title="Click to upload profile photo"
              >
                {user.photoURL
                  ? <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                  : <span className="text-white text-3xl font-bold">{user.fullName?.charAt(0).toUpperCase() || "U"}</span>
                }
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/50 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera size={20} color="#fff" />
                  <span className="text-white text-[10px] mt-1 font-medium">Change</span>
                </div>
                {/* Uploading spinner */}
                {uploadingPhoto && (
                  <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </button>
              {/* Small camera badge */}
              <button
                onClick={() => photoInputRef.current?.click()}
                disabled={uploadingPhoto}
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center bg-cyan-500 hover:bg-cyan-400 transition-colors focus:outline-none"
                style={{ border: "2px solid #0f172a" }}
                title="Upload photo"
              >
                <Camera size={12} color="#fff" />
              </button>
            </div>
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />
            <div>
              <h2 className="text-white text-xl font-semibold">{user.fullName || "Unknown User"}</h2>
              <p className="text-gray-400 text-sm">{user.email || "No email"}</p>
              <span
                className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                  user.status === "active"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {user.status === "active" ? "Active" : "Frozen"}
              </span>
            </div>
          </div>

          <hr className="border-gray-700" />

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Email</label>
              <p className="text-white text-sm mt-1">{user.email || "Not provided"}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Phone</label>
              <p className="text-white text-sm mt-1">{user.phone || "Not provided"}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Date of Birth</label>
              <p className="text-white text-sm mt-1">{user.dateOfBirth || "Not provided"}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Address</label>
              <p className="text-white text-sm mt-1">{user.address || "Not provided"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Credentials Card */}
      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle className="text-white text-lg">🔐 Security Credentials</CardTitle>
          <p className="text-xs text-gray-400 mt-1">View and manage user login password and transaction PIN</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Password Section */}
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 block">
              Login Password
            </label>
            
            {isEditingPassword ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min 6 characters)"
                  className="w-full px-4 py-3 rounded-xl font-mono text-sm bg-gray-800/50 border-2 border-cyan-500 text-white outline-none"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleUpdatePassword}
                    disabled={!newPassword || newPassword.length < 6 || savingPassword}
                    className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-600 hover:to-violet-700"
                  >
                    <Save size={14} className="inline mr-2" />
                    {savingPassword ? "Saving..." : "Save Password"}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingPassword(false);
                      setNewPassword("");
                    }}
                    className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gray-700 hover:bg-gray-600 transition-all"
                  >
                    <X size={14} className="inline mr-2" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="flex-1 px-4 py-3 rounded-xl font-mono text-sm bg-gray-800/50 border border-gray-700"
                    style={{ color: showPassword ? "#fff" : "#6B7280" }}
                  >
                    {showPassword ? (user.password || "Not set") : "••••••••••••"}
                  </div>
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-3 rounded-xl bg-gray-800/50 border border-gray-700 hover:bg-gray-700/50 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} className="text-gray-400" /> : <Eye size={18} className="text-gray-400" />}
                  </button>
                </div>
                <button
                  onClick={() => setIsEditingPassword(true)}
                  disabled={anyModalOpen}
                  className="w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gray-700 hover:bg-gray-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Edit2 size={14} className="inline mr-2" />
                  {user.password ? "Edit Password" : "Set Password"}
                </button>
                {!user.password && (
                  <p className="text-amber-400 text-xs mt-2">
                    ⚠️ Password is not stored in database (only in Firebase Auth). 
                    <br />
                    Click "Set Password" to store it here for admin viewing, or ask the user to reset their password.
                  </p>
                )}
              </>
            )}
          </div>

          <hr className="border-gray-700" />

          {/* Transaction PIN Section */}
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 block">
              Transaction PIN (4 Digits)
            </label>
            
            {isEditingPin ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  placeholder="Enter 4 digits"
                  maxLength={4}
                  className="w-full px-4 py-3 rounded-xl font-mono text-lg text-center bg-gray-800/50 border-2 border-cyan-500 text-white outline-none"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleUpdatePin}
                    disabled={newPin.length !== 4 || savingPin}
                    className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-600 hover:to-violet-700"
                  >
                    <Save size={14} className="inline mr-2" />
                    {savingPin ? "Saving..." : "Save PIN"}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingPin(false);
                      setNewPin("");
                    }}
                    className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gray-700 hover:bg-gray-600 transition-all"
                  >
                    <X size={14} className="inline mr-2" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="flex-1 px-4 py-3 rounded-xl font-mono text-xl text-center bg-gray-800/50 border border-gray-700"
                    style={{ color: showPin ? "#38BDF8" : "#6B7280" }}
                  >
                    {showPin ? user.transactionPin || "Not set" : "••••"}
                  </div>
                  <button
                    onClick={() => setShowPin(!showPin)}
                    className="p-3 rounded-xl bg-gray-800/50 border border-gray-700 hover:bg-gray-700/50 transition-colors"
                  >
                    {showPin ? <EyeOff size={18} className="text-gray-400" /> : <Eye size={18} className="text-gray-400" />}
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditingPin(true)}
                    disabled={anyModalOpen}
                    className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gray-700 hover:bg-gray-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Edit2 size={14} className="inline mr-2" />
                    Edit PIN
                  </button>
                  <button
                    onClick={handleRegeneratePin}
                    disabled={anyModalOpen}
                    className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-600 hover:to-violet-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <RefreshCw size={14} className="inline mr-2" />
                    Regenerate PIN
                  </button>
                </div>
                {!user.transactionPin && (
                  <p className="text-amber-400 text-xs mt-2">⚠️ No PIN set for this user</p>
                )}
              </>
            )}
          </div>

          {/* Info Box */}
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs text-gray-300 flex items-start gap-2">
            <span className="text-cyan-400 text-base">💡</span>
            <span>Password is used for login. PIN is used to confirm transactions. Both are stored securely and viewable by admin only.</span>
          </div>
        </CardContent>
      </Card>

      {/* Account Balances Card */}
      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle className="text-white text-lg">Account Balances</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
            <p className="text-xs text-gray-400 mb-2">Checking Account</p>
            <p className="text-2xl font-mono font-bold text-cyan-400">
              ${(user.checkingBalance || 0).toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 mt-1">#{user.checkingAccountNumber || "N/A"}</p>
          </div>
          <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
            <p className="text-xs text-gray-400 mb-2">Savings Account</p>
            <p className="text-2xl font-mono font-bold text-violet-400">
              ${(user.savingsBalance || 0).toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 mt-1">#{user.savingsAccountNumber || "N/A"}</p>
          </div>
        </CardContent>
      </Card>

      {/* Account Settings Card */}
      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle className="text-white text-lg">Account Settings</CardTitle>
          <p className="text-xs text-gray-400 mt-1">Manage account tier and other settings</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Account Tier */}
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 block">
              Account Tier
            </label>
            {isEditingTier ? (
              <div className="space-y-3">
                <select
                  value={newTier}
                  onChange={(e) => setNewTier(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border-2 border-cyan-500 text-white outline-none"
                  autoFocus
                >
                  {ACCOUNT_TIERS.map((tier) => (
                    <option key={tier} value={tier}>{tier}</option>
                  ))}
                </select>
                <div className="flex gap-2">
                  <button
                    onClick={handleUpdateTier}
                    disabled={!newTier || savingTier}
                    className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-600 hover:to-violet-700"
                  >
                    <Save size={14} className="inline mr-2" />
                    {savingTier ? "Saving..." : "Save Tier"}
                  </button>
                  <button
                    onClick={() => { setIsEditingTier(false); setNewTier(""); }}
                    className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gray-700 hover:bg-gray-600 transition-all"
                  >
                    <X size={14} className="inline mr-2" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex-1 px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white text-sm font-medium">
                  {user.accountTier || "Standard"}
                </div>
                <button
                  onClick={() => { setNewTier(user.accountTier || "Standard"); setIsEditingTier(true); }}
                  disabled={anyModalOpen}
                  className="px-4 py-3 rounded-xl text-sm font-semibold text-white bg-gray-700 hover:bg-gray-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Edit2 size={14} className="inline mr-1" />
                  Edit
                </button>
              </div>
            )}
          </div>

          <hr className="border-gray-700" />

          {/* Member Since */}
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 block">
              Member Since
            </label>
            {isEditingMemberSince ? (
              <div className="space-y-3">
                <input
                  type="date"
                  value={newMemberSince}
                  onChange={(e) => setNewMemberSince(e.target.value)}
                  max={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border-2 border-cyan-500 text-white outline-none"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleUpdateMemberSince}
                    disabled={!newMemberSince || savingMemberSince}
                    className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-600 hover:to-violet-700"
                  >
                    <Save size={14} className="inline mr-2" />
                    {savingMemberSince ? "Saving..." : "Save Date"}
                  </button>
                  <button
                    onClick={() => { setIsEditingMemberSince(false); setNewMemberSince(""); }}
                    className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gray-700 hover:bg-gray-600 transition-all"
                  >
                    <X size={14} className="inline mr-2" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex-1 px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white text-sm font-medium">
                  {user.createdAt
                    ? new Date(
                        typeof user.createdAt.toDate === "function"
                          ? user.createdAt.toDate()
                          : user.createdAt
                      ).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
                    : "—"}
                </div>
                <button
                  onClick={() => {
                    const d = user.createdAt
                      ? new Date(typeof user.createdAt.toDate === "function" ? user.createdAt.toDate() : user.createdAt)
                      : new Date();
                    setNewMemberSince(d.toISOString().split("T")[0]);
                    setIsEditingMemberSince(true);
                  }}
                  disabled={anyModalOpen}
                  className="px-4 py-3 rounded-xl text-sm font-semibold text-white bg-gray-700 hover:bg-gray-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Edit2 size={14} className="inline mr-1" />
                  Edit
                </button>
              </div>
            )}
          </div>

          <hr className="border-gray-700" />

          {/* Backdate Transactions */}
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 block">
              Backdate Transactions
            </label>
            <p className="text-xs text-gray-500 mb-3">
              Automatically generate realistic past transactions within a date range to build account history.
            </p>
            <button
              onClick={() => setShowBackdateModal(true)}
              disabled={anyModalOpen}
              className="w-full px-4 py-3 rounded-xl text-sm font-semibold text-white transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(135deg, #f59e0b, #ef4444)" }}
            >
              <Clock size={15} className="inline" />
              Backdate Transactions
            </button>

            {/* View Transaction History */}
            <button
              onClick={handleToggleTxHistory}
              disabled={anyModalOpen}
              className="w-full mt-3 px-4 py-3 rounded-xl text-sm font-semibold text-white transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(135deg, #0ea5e9, #6366f1)" }}
            >
              <History size={15} />
              {showTxHistory ? "Hide Transaction History" : "View Transaction History"}
              {showTxHistory ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {/* ── Inline Transaction History ── */}
            {showTxHistory && (
              <div className="mt-3 rounded-xl overflow-hidden border border-gray-700">
                {txLoading ? (
                  <div className="py-8 text-center text-gray-400 text-sm">Loading transactions…</div>
                ) : userTransactions.length === 0 ? (
                  <div className="py-8 text-center text-gray-400 text-sm">No transactions found</div>
                ) : (
                  <div className="max-h-96 overflow-y-auto">
                    {userTransactions.map((tx) => (
                      <div
                        key={tx.id}
                        className="flex items-center gap-3 px-4 py-3 border-b border-gray-800 hover:bg-white/5 transition-colors"
                      >
                        {/* Type dot */}
                        <div
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ background: tx.type === "credit" ? "#00E676" : "#FF4D6A" }}
                        />
                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-xs font-medium truncate">{tx.description || "—"}</p>
                          <p className="text-gray-500 text-xs mt-0.5">
                            {tx.createdAt instanceof Date
                              ? tx.createdAt.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
                              : "—"}{" "}
                            · <span className="capitalize">{tx.fundingAccount || "checking"}</span>
                          </p>
                        </div>
                        {/* Amount */}
                        <span
                          className="text-xs font-mono font-semibold flex-shrink-0"
                          style={{ color: tx.type === "credit" ? "#00E676" : "#FF4D6A" }}
                        >
                          {tx.type === "credit" ? "+" : "-"}${Number(tx.amount || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </span>
                        {/* Status badge */}
                        <span
                          className="text-[10px] px-2 py-0.5 rounded-full flex-shrink-0 capitalize"
                          style={{
                            background: tx.status === "completed" ? "rgba(0,230,118,0.12)" : "rgba(255,77,106,0.12)",
                            color: tx.status === "completed" ? "#00E676" : "#FF4D6A",
                          }}
                        >
                          {tx.status || "completed"}
                        </span>
                        {/* Edit button */}
                        <button
                          onClick={() => openEditTx(tx)}
                          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0"
                          title="Edit transaction"
                        >
                          <Pencil size={13} className="text-cyan-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── Backdate Modal — rendered in document.body via portal so fixed works correctly ── */}
      {showBackdateModal && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.75)" }}
          onClick={() => !backdating && setShowBackdateModal(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl p-6 space-y-5"
            style={{ background: "#0F1829", border: "1px solid rgba(255,255,255,0.08)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                  <Clock size={18} className="text-amber-400" />
                  Backdate Transactions
                </h3>
                <p className="text-gray-400 text-xs mt-1">
                  Generate realistic transaction history for{" "}
                  <span className="text-white font-medium">{user.fullName}</span>
                </p>
              </div>
              <button
                onClick={() => setShowBackdateModal(false)}
                disabled={backdating}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <X size={18} className="text-gray-400" />
              </button>
            </div>

            {/* Date Range */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 block">
                  Start Date
                </label>
                <input
                  type="date"
                  value={backdateFrom}
                  onChange={(e) => setBackdateFrom(e.target.value)}
                  max={backdateTo || new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white outline-none focus:border-amber-500 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 block">
                  End Date
                </label>
                <input
                  type="date"
                  value={backdateTo}
                  onChange={(e) => setBackdateTo(e.target.value)}
                  min={backdateFrom || undefined}
                  max={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </div>

            {/* Preview */}
            {backdateFrom && backdateTo && new Date(backdateFrom) < new Date(backdateTo) && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
                <p className="text-amber-300 text-xs font-medium">
                  📋 Preview: Approximately{" "}
                  <strong>
                    {Math.min(
                      Math.max(
                        Math.round(
                          ((new Date(backdateTo).getTime() - new Date(backdateFrom).getTime()) /
                            86_400_000) * 1.8
                        ),
                        5
                      ),
                      60
                    )}
                  </strong>{" "}
                  realistic transactions will be created — deposits, withdrawals, bill payments, transfers — spread across the date range.
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => { setShowBackdateModal(false); setBackdateFrom(""); setBackdateTo(""); }}
                disabled={backdating}
                className="flex-1 py-3 rounded-xl text-sm font-semibold text-gray-400 bg-gray-800 hover:bg-gray-700 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleBackdateTransactions}
                disabled={!backdateFrom || !backdateTo || backdating}
                className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: "linear-gradient(135deg, #f59e0b, #ef4444)" }}
              >
                {backdating ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
                    Generating…
                  </span>
                ) : (
                  "Backdate"
                )}
              </button>
            </div>
          </div>
        </div>
      , document.body)}

      {/* ── Edit Transaction Modal — rendered in document.body via portal ── */}
      {editTx && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.75)" }}
          onClick={() => !savingTx && setEditTx(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl p-6 space-y-4"
            style={{ background: "#0F1829", border: "1px solid rgba(255,255,255,0.08)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-white font-bold text-lg flex items-center gap-2">
                <Pencil size={16} className="text-cyan-400" />
                Edit Transaction
              </h3>
              <button
                onClick={() => setEditTx(null)}
                disabled={savingTx}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <X size={18} className="text-gray-400" />
              </button>
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5 block">Description</label>
              <input
                type="text"
                value={editTxDescription}
                onChange={(e) => setEditTxDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white outline-none focus:border-cyan-500 transition-colors text-sm"
              />
            </div>

            {/* Amount */}
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5 block">Amount ($)</label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={editTxAmount}
                onChange={(e) => setEditTxAmount(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white outline-none focus:border-cyan-500 transition-colors text-sm font-mono"
              />
            </div>

            {/* Type + Status row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5 block">Type</label>
                <select
                  value={editTxType}
                  onChange={(e) => setEditTxType(e.target.value as "credit" | "debit")}
                  className="w-full px-3 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white outline-none focus:border-cyan-500 transition-colors text-sm"
                >
                  <option value="credit">Credit (incoming)</option>
                  <option value="debit">Debit (outgoing)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5 block">Status</label>
                <select
                  value={editTxStatus}
                  onChange={(e) => setEditTxStatus(e.target.value)}
                  className="w-full px-3 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white outline-none focus:border-cyan-500 transition-colors text-sm"
                >
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>

            {/* Date + Time row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5 block">Date</label>
                <input
                  type="date"
                  value={editTxDate}
                  max={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setEditTxDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white outline-none focus:border-cyan-500 transition-colors text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5 block">Time</label>
                <input
                  type="time"
                  value={editTxTime}
                  onChange={(e) => setEditTxTime(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white outline-none focus:border-cyan-500 transition-colors text-sm"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setEditTx(null)}
                disabled={savingTx}
                className="flex-1 py-3 rounded-xl text-sm font-semibold text-gray-400 bg-gray-800 hover:bg-gray-700 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTxEdit}
                disabled={savingTx}
                className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: "linear-gradient(135deg, #0ea5e9, #6366f1)" }}
              >
                {savingTx ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
                    Saving…
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Save size={14} />
                    Save Changes
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      , document.body)}
    </div>
  );
}
