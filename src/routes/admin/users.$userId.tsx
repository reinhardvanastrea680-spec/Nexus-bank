import { useState, useEffect } from "react";
import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, Eye, EyeOff, Edit2, Save, X, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { db } from "../../firebase/config";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { toast } from "sonner";
import { useAdminAuth } from "../../admin/hooks/useAdminAuth";

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
  
  // PIN editing state
  const [isEditingPin, setIsEditingPin] = useState(false);
  const [newPin, setNewPin] = useState("");
  const [savingPin, setSavingPin] = useState(false);

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
          setUser({ id: snap.id, ...snap.data() });
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
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
              {user.fullName?.charAt(0).toUpperCase() || "U"}
            </div>
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
            <div className="flex items-center gap-2">
              <div
                className="flex-1 px-4 py-3 rounded-xl font-mono text-sm bg-gray-800/50 border border-gray-700"
                style={{ color: showPassword ? "#fff" : "#6B7280" }}
              >
                {showPassword ? user.password || "Not set" : "••••••••••••"}
              </div>
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="p-3 rounded-xl bg-gray-800/50 border border-gray-700 hover:bg-gray-700/50 transition-colors"
              >
                {showPassword ? <EyeOff size={18} className="text-gray-400" /> : <Eye size={18} className="text-gray-400" />}
              </button>
            </div>
            {!user.password && (
              <p className="text-amber-400 text-xs mt-2">⚠️ No password stored for this user</p>
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
                    className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gray-700 hover:bg-gray-600 transition-all"
                  >
                    <Edit2 size={14} className="inline mr-2" />
                    Edit PIN
                  </button>
                  <button
                    onClick={handleRegeneratePin}
                    className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-600 hover:to-violet-700 transition-all"
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
    </div>
  );
}
