import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { B as Button, I as Input, C as Card, d as db, a as auth } from "./router-8iYk_PDV.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-DguZ9IUy.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { u as useUsers } from "./useUsers-B9DgIn9o.mjs";
import { t as toggleUserFreeze } from "./toggleUserFreeze-DIYZyRjz.mjs";
import { j as writeBatch, d as doc, q as query, w as where, c as collection, k as getDocs, s as serverTimestamp, h as setDoc, b as addDoc } from "../_libs/firebase__firestore.mjs";
import { l as logAdminAction } from "./logAdminAction-DVr4geeY.mjs";
import { L as Label } from "./label-DFbnuHFR.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./dialog-vES-p4nC.mjs";
import { d as createUserWithEmailAndPassword, u as updateProfile, a as signOut, g as getAuth } from "../_libs/firebase__auth.mjs";
import { c as getApps, i as initializeApp } from "../_libs/firebase__app.mjs";
import "../_libs/firebase__logger.mjs";
import "../_libs/firebase.mjs";
import { g as generateAccountNumber, a as generateTransactionRef } from "./generateAccountNumber-C0BBgSQp.mjs";
import "../_libs/firebase__storage.mjs";
import { a2 as Plus, u as Search, E as Eye, a3 as SquarePen, a4 as Snowflake, V as Trash2, X, a5 as CircleAlert, m as User, L as Lock, W as Wallet, a6 as CircleCheckBig } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "../_libs/tanstack__history.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "async_hooks";
import "stream";
import "util";
import "crypto";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/firebase__component.mjs";
import "../_libs/firebase__util.mjs";
import "../_libs/firebase__webchannel-wrapper.mjs";
import "../_libs/@grpc/grpc-js.mjs";
import "process";
import "tls";
import "fs";
import "os";
import "net";
import "events";
import "http2";
import "http";
import "url";
import "dns";
import "zlib";
import "../_libs/@grpc/proto-loader.mjs";
import "path";
import "../_libs/lodash.camelcase.mjs";
import "../_libs/protobufjs.mjs";
import "../_libs/protobufjs__aspromise.mjs";
import "../_libs/protobufjs__base64.mjs";
import "../_libs/protobufjs__eventemitter.mjs";
import "../_libs/protobufjs__float.mjs";
import "../_libs/protobufjs__utf8.mjs";
import "../_libs/protobufjs__pool.mjs";
import "../_libs/long.mjs";
import "../_libs/protobufjs__codegen.mjs";
import "../_libs/protobufjs__fetch.mjs";
import "../_libs/protobufjs__path.mjs";
import "../_libs/re2js.mjs";
import "../_libs/idb.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
async function deleteUserAndData(userId, userFullName) {
  const batch = writeBatch(db);
  batch.delete(doc(db, "users", userId));
  const txQuery = query(collection(db, "transactions"), where("userId", "==", userId));
  const txSnap = await getDocs(txQuery);
  txSnap.forEach((d) => batch.delete(d.ref));
  await batch.commit();
  await logAdminAction(
    "USER_DELETED",
    `Deleted account and all data for ${userFullName}`,
    userId,
    userFullName,
    {}
  );
}
const secondaryFirebaseConfig = {
  apiKey: "AIzaSyBlXeem_vLL6xbOYxkAg2qV_JRMZG97U68",
  authDomain: "nexus-bank-b6820.firebaseapp.com",
  projectId: "nexus-bank-b6820",
  storageBucket: "nexus-bank-b6820.firebasestorage.app",
  messagingSenderId: "383216015173",
  appId: "1:383216015173:web:f833940e4cc9b92aa2902c"
};
const secondaryApp = getApps().find((app) => app.name === "secondary") || initializeApp(secondaryFirebaseConfig, "secondary");
const secondaryAuth = getAuth(secondaryApp);
async function createUserAccount(formData) {
  const {
    fullName,
    email,
    password,
    phone,
    address,
    dateOfBirth,
    initialCheckingBalance,
    initialSavingsBalance,
    status
  } = formData;
  let newUid = null;
  try {
    const credential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
    newUid = credential.user.uid;
    await updateProfile(credential.user, {
      displayName: fullName
    });
    await signOut(secondaryAuth);
    const checkingAccountNumber = generateAccountNumber();
    let savingsAccountNumber = generateAccountNumber();
    if (savingsAccountNumber === checkingAccountNumber) {
      savingsAccountNumber = generateAccountNumber();
    }
    const checkingBalance = parseFloat(initialCheckingBalance) || 0;
    const savingsBalance = parseFloat(initialSavingsBalance) || 0;
    const userDocument = {
      // Identity
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || "",
      address: address?.trim() || "",
      dateOfBirth: dateOfBirth || "",
      // Account status
      status: status || "active",
      // "active" | "frozen"
      createdAt: serverTimestamp(),
      createdByAdmin: true,
      adminCreatorId: auth.currentUser?.uid ?? "admin",
      // Bank account details
      checkingAccountNumber,
      savingsAccountNumber,
      routingNumber: "082000073",
      // Same routing number for all users
      // Balances (stored as numbers, never strings)
      checkingBalance,
      savingsBalance,
      totalBalance: checkingBalance + savingsBalance,
      // Metadata
      lastBalanceUpdatedAt: serverTimestamp(),
      lastBalanceUpdatedBy: "admin",
      avatarUrl: null,
      notificationsEnabled: true,
      // Dashboard display settings
      dashboardCurrency: "USD"
    };
    await setDoc(doc(db, "users", newUid), userDocument);
    if (checkingBalance > 0) {
      await writeOpeningTransaction(
        newUid,
        fullName,
        "checking",
        checkingBalance,
        checkingAccountNumber
      );
    }
    if (savingsBalance > 0) {
      await writeOpeningTransaction(
        newUid,
        fullName,
        "savings",
        savingsBalance,
        savingsAccountNumber
      );
    }
    await logAdminAction(
      "USER_CREATED",
      `Created account for ${fullName} (${email})`,
      newUid,
      fullName,
      {
        email,
        phone,
        initialCheckingBalance: checkingBalance,
        initialSavingsBalance: savingsBalance,
        checkingAccountNumber,
        savingsAccountNumber,
        status
      }
    );
    return {
      uid: newUid,
      ...userDocument
    };
  } catch (error) {
    if (newUid) {
      console.error(
        `Auth account created (UID: ${newUid}) but Firestore write failed. Manual cleanup may be needed.`,
        error
      );
    }
    throw error;
  }
}
async function writeOpeningTransaction(userId, userFullName, account, amount, accountNumber) {
  await addDoc(collection(db, "transactions"), {
    userId,
    userFullName,
    account,
    type: "credit",
    amount,
    description: "Account Opening Balance",
    category: "Transfer",
    date: serverTimestamp(),
    balanceAfter: amount,
    adminNote: "Initial balance set at account creation",
    createdAt: serverTimestamp(),
    createdByAdmin: true,
    transactionRef: generateTransactionRef(),
    accountNumber
  });
}
function AddUserModal({ isOpen, onClose }) {
  const [formData, setFormData] = reactExports.useState({
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    address: "",
    password: "",
    confirmPassword: "",
    status: "active",
    initialCheckingBalance: "",
    initialSavingsBalance: ""
  });
  const [errors, setErrors] = reactExports.useState({});
  const [isSubmitting, setIsSubmitting] = reactExports.useState(false);
  const [submitError, setSubmitError] = reactExports.useState(null);
  const [showPassword, setShowPassword] = reactExports.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = reactExports.useState(false);
  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.length < 2) {
      newErrors.fullName = "Name must be at least 2 characters";
    } else if (!/^[a-zA-Z '-]+$/.test(formData.fullName)) {
      newErrors.fullName = "Name can only contain letters, spaces, hyphens, and apostrophes";
    } else if (formData.fullName.length > 80) {
      newErrors.fullName = "Name must be less than 80 characters";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (formData.phone.trim()) {
      const phoneDigits = formData.phone.replace(/\D/g, "");
      if (phoneDigits.length < 7 || phoneDigits.length > 15) {
        newErrors.phone = "Please enter a valid phone number";
      }
    }
    if (formData.dateOfBirth) {
      const today = /* @__PURE__ */ new Date();
      const dob = new Date(formData.dateOfBirth);
      const age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      if (monthDiff < 0 || monthDiff === 0 && today.getDate() < dob.getDate()) {
        const adjustedAge = age - 1;
        if (adjustedAge < 18) {
          newErrors.dateOfBirth = "Account holder must be at least 18 years old";
        }
      } else if (age < 18) {
        newErrors.dateOfBirth = "Account holder must be at least 18 years old";
      }
    }
    if (formData.address.length > 200) {
      newErrors.address = "Address must be less than 200 characters";
    }
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
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm the password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (formData.initialCheckingBalance) {
      const balance = parseFloat(formData.initialCheckingBalance);
      if (isNaN(balance) || balance < 0) {
        newErrors.initialCheckingBalance = "Balance cannot be negative";
      } else if (formData.initialCheckingBalance.includes(".") && formData.initialCheckingBalance.split(".")[1].length > 2) {
        newErrors.initialCheckingBalance = "Maximum 2 decimal places";
      } else if (balance > 9999999999e-2) {
        newErrors.initialCheckingBalance = "Maximum $99,999,999.99";
      }
    }
    if (formData.initialSavingsBalance) {
      const balance = parseFloat(formData.initialSavingsBalance);
      if (isNaN(balance) || balance < 0) {
        newErrors.initialSavingsBalance = "Balance cannot be negative";
      } else if (formData.initialSavingsBalance.includes(".") && formData.initialSavingsBalance.split(".")[1].length > 2) {
        newErrors.initialSavingsBalance = "Maximum 2 decimal places";
      } else if (balance > 9999999999e-2) {
        newErrors.initialSavingsBalance = "Maximum $99,999,999.99";
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
    password = password.split("").sort(() => 0.5 - Math.random()).join("");
    setFormData((prev) => ({ ...prev, password, confirmPassword: password }));
    setShowPassword(true);
    setShowConfirmPassword(true);
  };
  const formatCurrency = (value) => {
    return value.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  const handleSubmit = async (e) => {
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
        status: formData.status
      });
      onClose();
      resetForm();
      toast.success(`Account created for ${newUser.fullName}`, {
        description: `${newUser.email} · Checking: ${formatCurrency(newUser.checkingBalance)}`,
        duration: 5e3
      });
    } catch (error) {
      const errorMessages = {
        "auth/email-already-in-use": "An account with this email already exists.",
        "auth/invalid-email": "The email address is not valid.",
        "auth/weak-password": "Password is too weak. Use at least 8 characters.",
        "auth/network-request-failed": "Network error. Please check your connection."
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
      initialSavingsBalance: ""
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
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: isOpen, onOpenChange: (open) => {
    if (!open) {
      onClose();
      resetForm();
    }
  }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "bg-[#0D1625] border border-[rgba(255,255,255,0.08)] rounded-[20px] p-8 w-[560px] max-h-[90vh] overflow-y-auto shadow-2xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { className: "mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-white text-[22px] font-bold", children: "Create New Account" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[#7A8FA6] text-[13px] mt-1", children: "New user will receive login credentials via email" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", onClick: onClose, className: "w-9 h-9 rounded-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] text-[#7A8FA6] hover:bg-[rgba(255,255,255,0.1)] hover:text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 18 }) })
    ] }) }),
    submitError && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 bg-[rgba(255,23,68,0.1)] border border-[rgba(255,23,68,0.3)] rounded-[12px] p-[14px] mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "text-[#FF1744] flex-shrink-0", size: 20 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white text-sm flex-1", children: submitError }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", onClick: () => setSubmitError(null), className: "text-[#7A8FA6] hover:text-white h-8 w-8 p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 16 }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 pb-3 border-b border-[rgba(255,255,255,0.06)]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 rounded-lg bg-[rgba(0,198,255,0.1)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "text-[#00C6FF]", size: 18 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white font-semibold", children: "Personal Information" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "fullName", className: "text-[#7A8FA6] text-sm", children: "Full Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "fullName",
              name: "fullName",
              type: "text",
              value: formData.fullName,
              onChange: handleChange,
              placeholder: "e.g. John Adebayo",
              className: `h-11 bg-[#111827] border border-[rgba(255,255,255,0.08)] text-white placeholder:text-[#7A8FA6] ${errors.fullName ? "border-[#FF1744]" : ""}`
            }
          ),
          errors.fullName && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[#FF1744] text-xs", children: errors.fullName })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "email", className: "text-[#7A8FA6] text-sm", children: "Email Address" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "email",
              name: "email",
              type: "email",
              value: formData.email,
              onChange: handleChange,
              placeholder: "e.g. john@email.com",
              className: `h-11 bg-[#111827] border border-[rgba(255,255,255,0.08)] text-white placeholder:text-[#7A8FA6] ${errors.email ? "border-[#FF1744]" : ""}`
            }
          ),
          errors.email && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[#FF1744] text-xs", children: errors.email })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "phone", className: "text-[#7A8FA6] text-sm", children: "Phone Number" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "phone",
              name: "phone",
              type: "tel",
              value: formData.phone,
              onChange: handleChange,
              placeholder: "e.g. +234 801 234 5678",
              className: `h-11 bg-[#111827] border border-[rgba(255,255,255,0.08)] text-white placeholder:text-[#7A8FA6] ${errors.phone ? "border-[#FF1744]" : ""}`
            }
          ),
          errors.phone && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[#FF1744] text-xs", children: errors.phone })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "dateOfBirth", className: "text-[#7A8FA6] text-sm", children: "Date of Birth" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "dateOfBirth",
              name: "dateOfBirth",
              type: "date",
              value: formData.dateOfBirth,
              onChange: handleChange,
              max: new Date((/* @__PURE__ */ new Date()).setFullYear((/* @__PURE__ */ new Date()).getFullYear() - 18)).toISOString().split("T")[0],
              className: `h-11 bg-[#111827] border border-[rgba(255,255,255,0.08)] text-white ${errors.dateOfBirth ? "border-[#FF1744]" : ""}`
            }
          ),
          errors.dateOfBirth && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[#FF1744] text-xs", children: errors.dateOfBirth })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "address", className: "text-[#7A8FA6] text-sm", children: "Home Address" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              id: "address",
              name: "address",
              value: formData.address,
              onChange: handleChange,
              placeholder: "Street, City, State",
              rows: 2,
              maxLength: 200,
              className: `w-full h-auto p-3 rounded-lg bg-[#111827] border border-[rgba(255,255,255,0.08)] text-white placeholder:text-[#7A8FA6] resize-none ${errors.address ? "border-[#FF1744]" : ""}`
            }
          ),
          errors.address && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[#FF1744] text-xs", children: errors.address })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 pb-3 border-b border-[rgba(255,255,255,0.06)]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 rounded-lg bg-[rgba(123,47,255,0.1)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "text-[#7B2FFF]", size: 18 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white font-semibold", children: "Login Credentials" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[#7A8FA6] text-[12px] mt-1", children: "These credentials will be used by the account holder to log in to their dashboard." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "password", className: "text-[#7A8FA6] text-sm", children: "Password" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "password",
                name: "password",
                type: showPassword ? "text" : "password",
                value: formData.password,
                onChange: handleChange,
                placeholder: "Create a strong password",
                className: `h-11 pl-3 pr-10 bg-[#111827] border border-[rgba(255,255,255,0.08)] text-white placeholder:text-[#7A8FA6] ${errors.password ? "border-[#FF1744]" : ""}`
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute right-3 top-1/2 -translate-y-1/2 text-[#7A8FA6] hover:text-white", children: showPassword ? /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 16 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 16 }) })
          ] }),
          errors.password && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[#FF1744] text-xs", children: errors.password }),
          formData.password && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 flex-1", children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `h-2 flex-1 rounded-full ${i <= passwordStrength ? passwordStrength === 1 ? "bg-[#FF1744]" : passwordStrength === 2 ? "bg-[#FFA000]" : passwordStrength === 3 ? "bg-[#FFD600]" : "bg-[#00E676]" : "bg-[#1A2438]"}`
              },
              i
            )) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `text-xs font-semibold ${passwordStrength === 1 ? "text-[#FF1744]" : passwordStrength === 2 ? "text-[#FFA000]" : passwordStrength === 3 ? "text-[#FFD600]" : "text-[#00E676]"}`,
                children: passwordStrengthLabel
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "confirmPassword", className: "text-[#7A8FA6] text-sm", children: "Confirm Password" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "confirmPassword",
                name: "confirmPassword",
                type: showConfirmPassword ? "text" : "password",
                value: formData.confirmPassword,
                onChange: handleChange,
                placeholder: "Re-enter the password",
                className: `h-11 pl-3 pr-10 bg-[#111827] border border-[rgba(255,255,255,0.08)] text-white placeholder:text-[#7A8FA6] ${errors.confirmPassword ? "border-[#FF1744]" : ""}`
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setShowConfirmPassword(!showConfirmPassword), className: "absolute right-3 top-1/2 -translate-y-1/2 text-[#7A8FA6] hover:text-white", children: showConfirmPassword ? /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 16 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 16 }) })
          ] }),
          errors.confirmPassword && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[#FF1744] text-xs", children: errors.confirmPassword })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: generateStrongPassword, className: "text-[#00C6FF] text-sm hover:text-white flex items-center gap-1", children: "⚡ Generate strong password" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 pb-3 border-b border-[rgba(255,255,255,0.06)]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 rounded-lg bg-[rgba(0,230,118,0.1)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "text-[#00E676]", size: 18 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white font-semibold", children: "Account Configuration" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "status", className: "text-[#7A8FA6] text-sm", children: "Account Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                variant: "ghost",
                onClick: () => setFormData((prev) => ({ ...prev, status: "active" })),
                className: `flex-1 h-11 rounded-lg border border-[rgba(255,255,255,0.08)] font-semibold ${formData.status === "active" ? "bg-[#00E676] text-[#0A0F1E]" : "bg-[#1A2438] text-[#7A8FA6]"}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { size: 16, className: "mr-2" }),
                  "Active"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                variant: "ghost",
                onClick: () => setFormData((prev) => ({ ...prev, status: "frozen" })),
                className: `flex-1 h-11 rounded-lg border border-[rgba(255,255,255,0.08)] font-semibold ${formData.status === "frozen" ? "bg-[#FF1744] text-white" : "bg-[#1A2438] text-[#7A8FA6]"}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Snowflake, { size: 16, className: "mr-2" }),
                  "Frozen"
                ]
              }
            )
          ] }),
          formData.status === "frozen" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 rounded-lg bg-[rgba(255,160,0,0.1)] border border-[rgba(255,160,0,0.3)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[#FFA000] text-sm", children: "⚠️ This account will be created but the user will not be able to log in." }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "initialCheckingBalance", className: "text-[#7A8FA6] text-sm", children: "Opening Checking Balance" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-[#7A8FA6]", children: "$" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "initialCheckingBalance",
                name: "initialCheckingBalance",
                type: "number",
                step: "0.01",
                min: "0",
                value: formData.initialCheckingBalance,
                onChange: handleChange,
                placeholder: "0.00",
                className: `h-11 pl-7 bg-[#111827] border border-[rgba(255,255,255,0.08)] text-white placeholder:text-[#7A8FA6] ${errors.initialCheckingBalance ? "border-[#FF1744]" : ""}`
              }
            )
          ] }),
          checkingBalance > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[#7A8FA6] text-xs", children: formatCurrency(checkingBalance) }),
          errors.initialCheckingBalance && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[#FF1744] text-xs", children: errors.initialCheckingBalance })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "initialSavingsBalance", className: "text-[#7A8FA6] text-sm", children: "Opening Savings Balance" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-[#7A8FA6]", children: "$" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "initialSavingsBalance",
                name: "initialSavingsBalance",
                type: "number",
                step: "0.01",
                min: "0",
                value: formData.initialSavingsBalance,
                onChange: handleChange,
                placeholder: "0.00",
                className: `h-11 pl-7 bg-[#111827] border border-[rgba(255,255,255,0.08)] text-white placeholder:text-[#7A8FA6] ${errors.initialSavingsBalance ? "border-[#FF1744]" : ""}`
              }
            )
          ] }),
          savingsBalance > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[#7A8FA6] text-xs", children: formatCurrency(savingsBalance) }),
          errors.initialSavingsBalance && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[#FF1744] text-xs", children: errors.initialSavingsBalance })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pt-2 pb-3 border-t border-[rgba(255,255,255,0.06)]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#7A8FA6] text-sm", children: "Total Opening Balance" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#00C6FF] font-mono font-semibold", children: formatCurrency(totalBalance) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 pb-3 border-b border-[rgba(255,255,255,0.06)]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 rounded-lg bg-[rgba(255,160,0,0.1)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "text-[#FFA000]", size: 18 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white font-semibold", children: "Account Preview" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[#7A8FA6] text-[12px] mt-1", children: "These details are auto-generated and assigned to the user." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-[#111827] rounded-[12px] p-4 space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center pb-3 border-b border-[rgba(255,255,255,0.05)]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#7A8FA6] text-sm", children: "Checking Account No." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#7A8FA6] font-mono", children: "Will be generated on creation" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center pb-3 border-b border-[rgba(255,255,255,0.05)]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#7A8FA6] text-sm", children: "Savings Account No." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#7A8FA6] font-mono", children: "Will be generated on creation" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center pb-3 border-b border-[rgba(255,255,255,0.05)]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#7A8FA6] text-sm", children: "Routing Number" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white font-mono", children: "082000073" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center pb-3 border-b border-[rgba(255,255,255,0.05)]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#7A8FA6] text-sm", children: "Account Type" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white text-sm", children: "Personal Checking & Savings" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#7A8FA6] text-sm", children: "Currency" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white text-sm", children: "USD · US Dollar" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sticky bottom-0 bg-[#0D1625] pt-4 mt-6 border-t border-[rgba(255,255,255,0.06)] flex gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "ghost",
            onClick: onClose,
            className: "flex-1 h-12 bg-[#1A2438] text-[#7A8FA6] border border-[rgba(255,255,255,0.08)] rounded-[12px]",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "submit",
            disabled: isSubmitting,
            className: "flex-[2] h-12 bg-gradient-to-r from-[#00C6FF] to-[#7B2FFF] text-white font-semibold rounded-[12px] shadow-lg shadow-[#00C6FF]/20 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed",
            children: isSubmitting ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" }),
              "Creating Account..."
            ] }) : "Create Account"
          }
        )
      ] })
    ] })
  ] }) });
}
function AdminUsersPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = reactExports.useState("");
  const [filter, setFilter] = reactExports.useState("all");
  const [showAddModal, setShowAddModal] = reactExports.useState(false);
  const {
    users,
    loading
  } = useUsers();
  const handleToggleFreeze = async (user) => {
    try {
      await toggleUserFreeze(user.id, user.fullName, user.status);
      toast.success(`User ${user.status === "active" ? "frozen" : "unfrozen"} successfully!`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update user status!");
    }
  };
  const handleDeleteUser = async (user) => {
    if (!window.confirm(`Are you sure you want to delete ${user.fullName} and all their data?`)) {
      return;
    }
    try {
      await deleteUserAndData(user.id, user.fullName);
      toast.success("User deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete user!");
    }
  };
  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || filter === "active" && user.status === "active" || filter === "frozen" && user.status === "frozen";
    return matchesSearch && matchesFilter;
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-white", children: "User Management" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-blue-300/60 text-sm", children: "Manage all Nexus Bank users" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => setShowAddModal(true), className: "bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-600 hover:to-violet-700 text-white gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 18 }),
        "Add New User"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AddUserModal, { isOpen: showAddModal, onClose: () => setShowAddModal(false) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 md:w-80", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300/50" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Search users...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "pl-10 bg-[#070B14] border-[rgba(255,255,255,0.1)] text-white placeholder:text-blue-300/50" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: filter, onValueChange: setFilter, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-[180px] bg-[#070B14] border-[rgba(255,255,255,0.1)] text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Filter" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "bg-[#0D1625] border-[rgba(255,255,255,0.1)] text-white", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All Users" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "active", children: "Active" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "frozen", children: "Frozen" })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "glass-card border-0 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-12 text-center text-[#8A9BB5]", children: "Loading users..." }) : filteredUsers.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-12 text-center text-[#8A9BB5]", children: "No users found" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-[#070B14]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-4 px-6 text-blue-300/60 text-xs font-medium uppercase", children: "#" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-4 px-6 text-blue-300/60 text-xs font-medium uppercase", children: "User" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-4 px-6 text-blue-300/60 text-xs font-medium uppercase", children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-4 px-6 text-blue-300/60 text-xs font-medium uppercase", children: "Checking" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-4 px-6 text-blue-300/60 text-xs font-medium uppercase", children: "Savings" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-4 px-6 text-blue-300/60 text-xs font-medium uppercase", children: "Created" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-4 px-6 text-blue-300/60 text-xs font-medium uppercase", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: filteredUsers.map((user, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-[rgba(255,255,255,0.05)] hover:bg-white/5 cursor-pointer", onClick: (e) => {
        if (!e.target.closest("button")) {
          navigate({
            to: `/admin/users/${user.id}`
          });
        }
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-4 px-6 text-blue-300/60 font-mono text-sm", children: index + 1 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-4 px-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 flex items-center justify-center text-white font-semibold text-sm", children: user.fullName.charAt(0).toUpperCase() }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white font-medium", children: user.fullName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-blue-300/60 text-sm", children: user.email })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-4 px-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-2 py-1 rounded-full text-xs font-medium ${user.status === "active" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`, children: user.status }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "py-4 px-6 text-white font-mono text-sm", children: [
          "$",
          (user.checkingBalance || 0).toLocaleString()
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "py-4 px-6 text-white font-mono text-sm", children: [
          "$",
          (user.savingsBalance || 0).toLocaleString()
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-4 px-6 text-blue-300/60 text-sm", children: user.createdAt?.toLocaleDateString?.() || "-" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-4 px-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", onClick: (e) => e.stopPropagation(), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "text-blue-300 hover:text-white hover:bg-blue-500/10", onClick: () => navigate({
            to: `/admin/users/${user.id}`
          }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 16 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "text-blue-300 hover:text-white hover:bg-blue-500/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { size: 16 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "text-blue-300 hover:text-white hover:bg-blue-500/10", onClick: () => handleToggleFreeze(user), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Snowflake, { size: 16 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "text-red-400 hover:text-red-300 hover:bg-red-500/10", onClick: () => handleDeleteUser(user), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 16 }) })
        ] }) })
      ] }, user.id)) })
    ] }) }) })
  ] });
}
export {
  AdminUsersPage as component
};
