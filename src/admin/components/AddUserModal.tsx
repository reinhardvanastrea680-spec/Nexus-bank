
import { useState } from "react";
import { X, User, Lock, Wallet, Eye, CheckCircle, Snowflake, AlertCircle } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { toast } from "sonner";
import { createUserAccount } from "../utils/createUserAccount";
import { CURRENCIES } from "../../utils/currency";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddUserModal({ isOpen, onClose }: AddUserModalProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    address: "",
    password: "",
    confirmPassword: "",
    status: "active" as "active" | "frozen",
    initialCheckingBalance: "",
    initialSavingsBalance: "",
    accountTier: "Standard",
    hidePhone: false,
    currency: "USD",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Full Name
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.length < 2) {
      newErrors.fullName = "Name must be at least 2 characters";
    } else if (!/^[a-zA-Z '-]+$/.test(formData.fullName)) {
      newErrors.fullName = "Name can only contain letters, spaces, hyphens, and apostrophes";
    } else if (formData.fullName.length > 80) {
      newErrors.fullName = "Name must be less than 80 characters";
    }

    // Email
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone
    if (formData.phone.trim()) {
      const phoneDigits = formData.phone.replace(/\D/g, "");
      if (phoneDigits.length < 7 || phoneDigits.length > 15) {
        newErrors.phone = "Please enter a valid phone number";
      }
    }

    // Date of Birth
    if (formData.dateOfBirth) {
      const today = new Date();
      const dob = new Date(formData.dateOfBirth);
      const age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        const adjustedAge = age - 1;
        if (adjustedAge < 18) {
          newErrors.dateOfBirth = "Account holder must be at least 18 years old";
        }
      } else if (age < 18) {
        newErrors.dateOfBirth = "Account holder must be at least 18 years old";
      }
    }

    // Address
    if (formData.address.length > 200) {
      newErrors.address = "Address must be less than 200 characters";
    }

    // Password
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = "Must include at least one uppercase letter";
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = "Must include at least one number";
    } else if (!/[!@#$%^&*]/.test(formData.password)) {
      newErrors.password = "Must include at least one special character";
    }

    // Confirm Password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm the password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Checking Balance
    if (formData.initialCheckingBalance) {
      const balance = parseFloat(formData.initialCheckingBalance);
      if (isNaN(balance) || balance < 0) {
        newErrors.initialCheckingBalance = "Balance cannot be negative";
      } else if (formData.initialCheckingBalance.includes('.') && formData.initialCheckingBalance.split('.')[1].length > 2) {
        newErrors.initialCheckingBalance = "Maximum 2 decimal places";
      }
    }

    // Savings Balance
    if (formData.initialSavingsBalance) {
      const balance = parseFloat(formData.initialSavingsBalance);
      if (isNaN(balance) || balance < 0) {
        newErrors.initialSavingsBalance = "Balance cannot be negative";
      } else if (formData.initialSavingsBalance.includes('.') && formData.initialSavingsBalance.split('.')[1].length > 2) {
        newErrors.initialSavingsBalance = "Maximum 2 decimal places";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getPasswordStrength = () => {
    let strength = 0;
    if (formData.password.length >= 8) strength++;
    if (/[A-Z]/.test(formData.password)) strength++;
    if (/[0-9]/.test(formData.password)) strength++;
    if (/[!@#$%^&*]/.test(formData.password)) strength++;

    let label = "Weak";
    if (strength === 2) label = "Fair";
    if (strength === 3) label = "Good";
    if (strength === 4) label = "Strong";

    return { strength, label };
  };

  const generateStrongPassword = () => {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const special = "!@#$%^&*";
    const all = uppercase + lowercase + numbers + special;
    let password = "";
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += special[Math.floor(Math.random() * special.length)];
    for (let i = 4; i < 12; i++) {
      password += all[Math.floor(Math.random() * all.length)];
    }
    password = password.split('').sort(() => 0.5 - Math.random()).join('');
    setFormData(prev => ({ ...prev, password, confirmPassword: password }));
    setShowPassword(true);
    setShowConfirmPassword(true);
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const newUser = await createUserAccount({
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        dateOfBirth: formData.dateOfBirth,
        initialCheckingBalance: parseFloat(formData.initialCheckingBalance) || 0,
        initialSavingsBalance: parseFloat(formData.initialSavingsBalance) || 0,
        status: formData.status,
        accountTier: formData.accountTier,
        hidePhone: formData.hidePhone,
        currency: formData.currency,
      });
      onClose();
      resetForm();
      toast.success(`Account created for ${newUser.fullName}`, {
        description: `${newUser.email} | Transaction PIN: ${newUser.transactionPin} | Checking: ${formatCurrency(newUser.checkingBalance)}`,
        duration: 10000,
      });
    } catch (error: any) {
      const errorMessages: Record<string, string> = {
        "auth/email-already-in-use": "An account with this email already exists.",
        "auth/invalid-email": "The email address is not valid.",
        "auth/weak-password": "Password is too weak. Use at least 8 characters.",
        "auth/network-request-failed": "Network error. Please check your connection.",
      };
      const message = errorMessages[error.code] || error.message || "Something went wrong. Please try again.";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      address: "",
      password: "",
      confirmPassword: "",
      status: "active",
      initialCheckingBalance: "",
      initialSavingsBalance: "",
      accountTier: "Standard",
      hidePhone: false,
      currency: "USD",
    });
    setErrors({});
    setSubmitError(null);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const { strength: passwordStrength, label: passwordStrengthLabel } = getPasswordStrength();

  const checkingBalance = parseFloat(formData.initialCheckingBalance) || 0;
  const savingsBalance = parseFloat(formData.initialSavingsBalance) || 0;
  const totalBalance = checkingBalance + savingsBalance;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) { onClose(); resetForm(); } }}>
      <DialogContent className="bg-[#0D1625] border border-[rgba(255,255,255,0.08)] rounded-[20px] p-8 w-[560px] max-h-[90vh] overflow-y-auto shadow-2xl">
        <DialogHeader className="mb-6">
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-white text-[22px] font-bold">Create New Account</DialogTitle>
              <p className="text-[#7A8FA6] text-[13px] mt-1">New user will receive login credentials via email</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="w-9 h-9 rounded-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] text-[#7A8FA6] hover:bg-[rgba(255,255,255,0.1)] hover:text-white">
              <X size={18} />
            </Button>
          </div>
        </DialogHeader>

        {submitError && (
          <div className="flex items-center gap-3 bg-[rgba(255,23,68,0.1)] border border-[rgba(255,23,68,0.3)] rounded-[12px] p-[14px] mb-6">
            <AlertCircle className="text-[#FF1744] flex-shrink-0" size={20} />
            <p className="text-white text-sm flex-1">{submitError}</p>
            <Button variant="ghost" size="icon" onClick={() => setSubmitError(null)} className="text-[#7A8FA6] hover:text-white h-8 w-8 p-0">
              <X size={16} />
            </Button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* SECTION 1 - Personal Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[rgba(255,255,255,0.06)]">
              <div className="p-2 rounded-lg bg-[rgba(0,198,255,0.1)]">
                <User className="text-[#00C6FF]" size={18} />
              </div>
              <span className="text-white font-semibold">Personal Information</span>
            </div>

            <div className="space-y-3">
              <Label htmlFor="fullName" className="text-[#7A8FA6] text-sm">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="e.g. John Adebayo"
                className={`h-11 bg-[#111827] border border-[rgba(255,255,255,0.08)] text-white placeholder:text-[#7A8FA6] ${errors.fullName ? "border-[#FF1744]" : ""}`}
              />
              {errors.fullName && <p className="text-[#FF1744] text-xs">{errors.fullName}</p>}
            </div>

            <div className="space-y-3">
              <Label htmlFor="email" className="text-[#7A8FA6] text-sm">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. john@email.com"
                className={`h-11 bg-[#111827] border border-[rgba(255,255,255,0.08)] text-white placeholder:text-[#7A8FA6] ${errors.email ? "border-[#FF1744]" : ""}`}
              />
              {errors.email && <p className="text-[#FF1744] text-xs">{errors.email}</p>}
            </div>

            <div className="space-y-3">
              <Label htmlFor="phone" className="text-[#7A8FA6] text-sm">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. +234 801 234 5678"
                className={`h-11 bg-[#111827] border border-[rgba(255,255,255,0.08)] text-white placeholder:text-[#7A8FA6] ${errors.phone ? "border-[#FF1744]" : ""}`}
              />
              {errors.phone && <p className="text-[#FF1744] text-xs">{errors.phone}</p>}
            </div>

            <div className="space-y-3">
              <Label htmlFor="dateOfBirth" className="text-[#7A8FA6] text-sm">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                className={`h-11 bg-[#111827] border border-[rgba(255,255,255,0.08)] text-white ${errors.dateOfBirth ? "border-[#FF1744]" : ""}`}
              />
              {errors.dateOfBirth && <p className="text-[#FF1744] text-xs">{errors.dateOfBirth}</p>}
            </div>

            <div className="space-y-3">
              <Label htmlFor="address" className="text-[#7A8FA6] text-sm">Home Address</Label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Street, City, State"
                rows={2}
                maxLength={200}
                className={`w-full h-auto p-3 rounded-lg bg-[#111827] border border-[rgba(255,255,255,0.08)] text-white placeholder:text-[#7A8FA6] resize-none ${errors.address ? "border-[#FF1744]" : ""}`}
              />
              {errors.address && <p className="text-[#FF1744] text-xs">{errors.address}</p>}
            </div>
          </div>

          {/* SECTION 2 - Login Credentials */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[rgba(255,255,255,0.06)]">
              <div className="p-2 rounded-lg bg-[rgba(123,47,255,0.1)]">
                <Lock className="text-[#7B2FFF]" size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-semibold">Login Credentials</span>
                <p className="text-[#7A8FA6] text-[12px] mt-1">These credentials will be used by the account holder to log in to their dashboard.</p>
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="password" className="text-[#7A8FA6] text-sm">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  className={`h-11 pl-3 pr-10 bg-[#111827] border border-[rgba(255,255,255,0.08)] text-white placeholder:text-[#7A8FA6] ${errors.password ? "border-[#FF1744]" : ""}`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A8FA6] hover:text-white">
                  {showPassword ? <Eye size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-[#FF1744] text-xs">{errors.password}</p>}

              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex gap-1 flex-1">
                    {[1, 2, 3, 4].map(i => (
                      <div
                        key={i}
                        className={`h-2 flex-1 rounded-full ${
                          i <= passwordStrength
                            ? passwordStrength === 1
                              ? "bg-[#FF1744]"
                              : passwordStrength === 2
                                ? "bg-[#FFA000]"
                                : passwordStrength === 3
                                  ? "bg-[#FFD600]"
                                  : "bg-[#00E676]"
                            : "bg-[#1A2438]"
                        }`}
                      />
                    ))}
                  </div>
                  <span
                    className={`text-xs font-semibold ${
                      passwordStrength === 1 ? "text-[#FF1744]"
                        : passwordStrength === 2 ? "text-[#FFA000]"
                          : passwordStrength === 3 ? "text-[#FFD600]"
                            : "text-[#00E676]"
                    }`}
                  >
                    {passwordStrengthLabel}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Label htmlFor="confirmPassword" className="text-[#7A8FA6] text-sm">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter the password"
                  className={`h-11 pl-3 pr-10 bg-[#111827] border border-[rgba(255,255,255,0.08)] text-white placeholder:text-[#7A8FA6] ${errors.confirmPassword ? "border-[#FF1744]" : ""}`}
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A8FA6] hover:text-white">
                  {showConfirmPassword ? <Eye size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-[#FF1744] text-xs">{errors.confirmPassword}</p>}
            </div>

            <button type="button" onClick={generateStrongPassword} className="text-[#00C6FF] text-sm hover:text-white flex items-center gap-1">
              ⚡ Generate strong password
            </button>
          </div>

          {/* SECTION 3 - Account Configuration */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[rgba(255,255,255,0.06)]">
              <div className="p-2 rounded-lg bg-[rgba(0,230,118,0.1)]">
                <Wallet className="text-[#00E676]" size={18} />
              </div>
              <span className="text-white font-semibold">Account Configuration</span>
            </div>

            <div className="space-y-3">
              <Label htmlFor="status" className="text-[#7A8FA6] text-sm">Account Status</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setFormData(prev => ({ ...prev, status: "active" }))}
                  className={`flex-1 h-11 rounded-lg border border-[rgba(255,255,255,0.08)] font-semibold ${
                    formData.status === "active"
                      ? "bg-[#00E676] text-[#0A0F1E]"
                      : "bg-[#1A2438] text-[#7A8FA6]"
                  }`}
                >
                  <CheckCircle size={16} className="mr-2" />
                  Active
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setFormData(prev => ({ ...prev, status: "frozen" }))}
                  className={`flex-1 h-11 rounded-lg border border-[rgba(255,255,255,0.08)] font-semibold ${
                    formData.status === "frozen"
                      ? "bg-[#FF1744] text-white"
                      : "bg-[#1A2438] text-[#7A8FA6]"
                  }`}
                >
                  <Snowflake size={16} className="mr-2" />
                  Frozen
                </Button>
              </div>
              {formData.status === "frozen" && (
                <div className="p-3 rounded-lg bg-[rgba(255,160,0,0.1)] border border-[rgba(255,160,0,0.3)]">
                  <p className="text-[#FFA000] text-sm">⚠️ This account will be created but the user will not be able to log in.</p>
                </div>
              )}
            </div>

            {/* Account Tier */}
            <div className="space-y-3">
              <Label className="text-[#7A8FA6] text-sm">Account Tier</Label>
              <select
                value={formData.accountTier}
                onChange={(e) => setFormData(prev => ({ ...prev, accountTier: e.target.value }))}
                className="w-full h-11 px-3 rounded-lg bg-[#111827] border border-[rgba(255,255,255,0.08)] text-white"
              >
                {["Standard","Bronze","Silver","Gold","Platinum","VIP","Elite","Diamond"].map((tier) => (
                  <option key={tier} value={tier}>{tier}</option>
                ))}
              </select>
              <p className="text-[#7A8FA6] text-xs">Selected tier is shown on the user's profile as Account Tier.</p>
            </div>

            {/* Account Currency */}
            <div className="space-y-3">
              <Label className="text-[#7A8FA6] text-sm">Account Display Currency</Label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                className="w-full h-11 px-3 rounded-lg bg-[#111827] border border-[rgba(255,255,255,0.08)] text-white"
              >
                {Object.entries(CURRENCIES).map(([code, { symbol, name }]) => (
                  <option key={code} value={code}>{symbol} {code} — {name}</option>
                ))}
              </select>
              <p className="text-[#7A8FA6] text-xs">Balances are stored in USD and automatically converted for display using live exchange rates.</p>
            </div>

            {/* Hide Phone Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl"
              style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div>
                <p className="text-sm font-semibold text-white">Hide Phone Number</p>
                <p className="text-xs text-[#7A8FA6] mt-0.5">User sees ......... instead of their number</p>
              </div>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, hidePhone: !prev.hidePhone }))}
                className="w-12 h-6 rounded-full flex items-center px-0.5 transition-all flex-shrink-0"
                style={{ background: formData.hidePhone ? "#EF4444" : "rgba(255,255,255,0.1)" }}>
                <span className="w-5 h-5 rounded-full bg-white shadow transition-all"
                  style={{ transform: formData.hidePhone ? "translateX(24px)" : "translateX(0)" }} />
              </button>
            </div>

            <div className="space-y-3">
              <Label htmlFor="initialCheckingBalance" className="text-[#7A8FA6] text-sm">Opening Checking Balance</Label>              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A8FA6]">$</span>
                <Input
                  id="initialCheckingBalance"
                  name="initialCheckingBalance"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.initialCheckingBalance}
                  onChange={handleChange}
                  placeholder="0.00"
                  className={`h-11 pl-7 bg-[#111827] border border-[rgba(255,255,255,0.08)] text-white placeholder:text-[#7A8FA6] ${errors.initialCheckingBalance ? "border-[#FF1744]" : ""}`}
                />
              </div>
              {checkingBalance > 0 && <p className="text-[#7A8FA6] text-xs">{formatCurrency(checkingBalance)}</p>}
              {errors.initialCheckingBalance && <p className="text-[#FF1744] text-xs">{errors.initialCheckingBalance}</p>}
            </div>

            <div className="space-y-3">
              <Label htmlFor="initialSavingsBalance" className="text-[#7A8FA6] text-sm">Opening Savings Balance</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A8FA6]">$</span>
                <Input
                  id="initialSavingsBalance"
                  name="initialSavingsBalance"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.initialSavingsBalance}
                  onChange={handleChange}
                  placeholder="0.00"
                  className={`h-11 pl-7 bg-[#111827] border border-[rgba(255,255,255,0.08)] text-white placeholder:text-[#7A8FA6] ${errors.initialSavingsBalance ? "border-[#FF1744]" : ""}`}
                />
              </div>
              {savingsBalance > 0 && <p className="text-[#7A8FA6] text-xs">{formatCurrency(savingsBalance)}</p>}
              {errors.initialSavingsBalance && <p className="text-[#FF1744] text-xs">{errors.initialSavingsBalance}</p>}
            </div>

            <div className="flex items-center justify-between pt-2 pb-3 border-t border-[rgba(255,255,255,0.06)]">
              <span className="text-[#7A8FA6] text-sm">Total Opening Balance</span>
              <span className="text-[#00C6FF] font-mono font-semibold">{formatCurrency(totalBalance)}</span>
            </div>
          </div>

          {/* SECTION 4 - Account Preview */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[rgba(255,255,255,0.06)]">
              <div className="p-2 rounded-lg bg-[rgba(255,160,0,0.1)]">
                <Eye className="text-[#FFA000]" size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-semibold">Account Preview</span>
                <p className="text-[#7A8FA6] text-[12px] mt-1">These details are auto-generated and assigned to the user.</p>
              </div>
            </div>

            <div className="bg-[#111827] rounded-[12px] p-4 space-y-3">
              <div className="flex justify-between items-center pb-3 border-b border-[rgba(255,255,255,0.05)]">
                <span className="text-[#7A8FA6] text-sm">Checking Account No.</span>
                <span className="text-[#7A8FA6] font-mono">Will be generated on creation</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-[rgba(255,255,255,0.05)]">
                <span className="text-[#7A8FA6] text-sm">Savings Account No.</span>
                <span className="text-[#7A8FA6] font-mono">Will be generated on creation</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-[rgba(255,255,255,0.05)]">
                <span className="text-[#7A8FA6] text-sm">Routing Number</span>
                <span className="text-white font-mono">082000073</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-[rgba(255,255,255,0.05)]">
                <span className="text-[#7A8FA6] text-sm">Account Type</span>
                <span className="text-white text-sm">Personal Checking & Savings</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#7A8FA6] text-sm">Currency</span>
                <span className="text-white text-sm">{formData.currency} · {CURRENCIES[formData.currency]?.name || "US Dollar"}</span>
              </div>
            </div>
          </div>

          {/* Form Footer */}
          <div className="sticky bottom-0 bg-[#0D1625] pt-4 mt-6 border-t border-[rgba(255,255,255,0.06)] flex gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="flex-1 h-12 bg-[#1A2438] text-[#7A8FA6] border border-[rgba(255,255,255,0.08)] rounded-[12px]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-[2] h-12 bg-gradient-to-r from-[#00C6FF] to-[#7B2FFF] text-white font-semibold rounded-[12px] shadow-lg shadow-[#00C6FF]/20 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating Account...
                </div>
              ) : (
                "Create Account"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
