import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { C as Card, e as CardContent, b as CardHeader, c as CardTitle, I as Input, B as Button, f as cn } from "./router-8iYk_PDV.mjs";
import { L as Label } from "./label-DFbnuHFR.mjs";
import { S as Switch$1, a as SwitchThumb } from "../_libs/radix-ui__react-switch.mjs";
import { D as Dialog, d as DialogTrigger, a as DialogContent, b as DialogHeader, c as DialogTitle, e as DialogClose } from "./dialog-vES-p4nC.mjs";
import { T as Textarea } from "./textarea-CZiTatT5.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/firebase__firestore.mjs";
import "../_libs/firebase.mjs";
import "../_libs/firebase__auth.mjs";
import "../_libs/firebase__app.mjs";
import "../_libs/firebase__logger.mjs";
import "../_libs/firebase__storage.mjs";
import { m as User, M as MessageSquare, o as Shield, T as TriangleAlert, aa as Upload, L as Lock, a2 as Plus, V as Trash2 } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__react-router.mjs";
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
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
const Switch = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Switch$1,
  {
    className: cn(
      "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className
    ),
    ...props,
    ref,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      SwitchThumb,
      {
        className: cn(
          "pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"
        )
      }
    )
  }
));
Switch.displayName = Switch$1.displayName;
const initialSystemSettings = {
  chatEnabled: true,
  dashboardEnabled: true,
  registrationEnabled: true
};
const initialQuickReplies = [];
function AdminSettingsPage() {
  const [adminName, setAdminName] = reactExports.useState("Admin User");
  const [quickReplies, setQuickReplies] = reactExports.useState(initialQuickReplies);
  const [newReply, setNewReply] = reactExports.useState("");
  const [showAddReplyModal, setShowAddReplyModal] = reactExports.useState(false);
  const [systemSettings, setSystemSettings] = reactExports.useState(initialSystemSettings);
  const [confirmText, setConfirmText] = reactExports.useState("");
  const handlePasswordReset = () => {
    toast.success("Password reset link sent to admin@nexusbank.com!");
  };
  const handleAddReply = () => {
    if (newReply.trim()) {
      setQuickReplies([...quickReplies, newReply.trim()]);
      setNewReply("");
      setShowAddReplyModal(false);
      toast.success("Quick reply added!");
    }
  };
  const handleDeleteReply = (index) => {
    setQuickReplies(quickReplies.filter((_, i) => i !== index));
    toast.success("Quick reply deleted!");
  };
  const handleToggle = (key, value) => {
    setSystemSettings((prev) => ({
      ...prev,
      [key]: value
    }));
    toast.success(`${key} setting updated!`);
  };
  const handleDangerAction = (action) => {
    if (confirmText !== "CONFIRM RESET") {
      toast.error("Please type 'CONFIRM RESET' to confirm!");
      return;
    }
    toast.success(`Action "${action}" executed successfully!`);
    setConfirmText("");
  };
  const sections = [{
    id: "profile",
    icon: User,
    label: "Admin Profile"
  }, {
    id: "replies",
    icon: MessageSquare,
    label: "Quick Replies"
  }, {
    id: "controls",
    icon: Shield,
    label: "System Controls"
  }, {
    id: "danger",
    icon: TriangleAlert,
    label: "Danger Zone"
  }];
  const [activeSection, setActiveSection] = reactExports.useState("profile");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-white", children: "System Settings" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-[#8A9BB5]", children: "Configure Nexus Bank admin console" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-4 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "glass-card border-0 bg-[#111827] lg:col-span-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-6 space-y-2", children: sections.map((section) => {
        const Icon = section.icon;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setActiveSection(section.id), className: `w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left ${activeSection === section.id ? "bg-[#38BDF8]/20 border border-[#38BDF8]/30 text-[#38BDF8]" : "bg-transparent text-[#8A9BB5] hover:bg-[#1A2438]"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 18 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: section.label })
        ] }, section.id);
      }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-3 space-y-4", children: [
        activeSection === "profile" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "glass-card border-0 bg-[#111827]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-white flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(User, { size: 20, className: "text-[#38BDF8]" }),
            "Admin Profile"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-center gap-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 h-24 rounded-full bg-gradient-to-r from-[#38BDF8] to-[#6366F1] flex items-center justify-center text-3xl font-bold text-white", children: adminName.charAt(0) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#1A2438] border border-[rgba(255,255,255,0.1)] flex items-center justify-center text-[#8A9BB5] hover:text-[#38BDF8]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { size: 14 }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-4 w-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[#8A9BB5]", children: "Display Name" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: adminName, onChange: (e) => setAdminName(e.target.value), className: "bg-[#1A2438] border border-[rgba(255,255,255,0.1)] text-white" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[#8A9BB5]", children: "Email" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: "admin@nexusbank.com", readOnly: true, className: "bg-[#1A2438] border border-[rgba(255,255,255,0.1)] text-[#8A9BB5]" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: handlePasswordReset, className: "w-full sm:w-auto bg-[#1A2438] text-[#8A9BB5] border border-[rgba(255,255,255,0.1)]", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { size: 16, className: "mr-2" }),
                "Change Password"
              ] })
            ] })
          ] }) })
        ] }),
        activeSection === "replies" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "glass-card border-0 bg-[#111827]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-white flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { size: 20, className: "text-[#6366F1]" }),
              "Quick Reply Templates"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open: showAddReplyModal, onOpenChange: setShowAddReplyModal, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "bg-gradient-to-r from-[#38BDF8] to-[#6366F1] text-white", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 16, className: "mr-2" }),
                "Add Template"
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "bg-[#111827] border border-[rgba(255,255,255,0.1)] text-white", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-white", children: "Add Quick Reply" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[#8A9BB5]", children: "Message" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { value: newReply, onChange: (e) => setNewReply(e.target.value), placeholder: "Enter your quick reply...", className: "bg-[#1A2438] border border-[rgba(255,255,255,0.1)] text-white min-h-[100px]" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(DialogClose, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", className: "flex-1 text-[#8A9BB5] border border-[rgba(255,255,255,0.1)]", children: "Cancel" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handleAddReply, className: "flex-1 bg-gradient-to-r from-[#38BDF8] to-[#6366F1] text-white", children: "Save" })
                  ] }) })
                ] })
              ] })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-3", children: quickReplies.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-8 text-[#8A9BB5]", children: "No quick replies yet. Add one above!" }) : quickReplies.map((reply, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 bg-[#1A2438] p-3 rounded-lg", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#8A9BB5] text-sm flex-1", children: reply }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", onClick: () => handleDeleteReply(index), className: "text-[#FF4D6A] hover:text-[#FF4D6A] hover:bg-[#FF4D6A]/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 16 }) })
          ] }, index)) })
        ] }),
        activeSection === "controls" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "glass-card border-0 bg-[#111827]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-white flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { size: 20, className: "text-[#00E676]" }),
            "System Controls"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-4 bg-[#1A2438] rounded-lg", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white font-medium", children: "Live Chat Widget" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[#8A9BB5] text-xs", children: "Enable or disable the chat widget on the Nexus Bank landing page and user dashboard" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: systemSettings.chatEnabled, onCheckedChange: (v) => handleToggle("chatEnabled", v) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-4 bg-[#1A2438] rounded-lg", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white font-medium", children: "User Dashboard Access" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[#8A9BB5] text-xs", children: "When disabled, all users see a maintenance screen on login" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: systemSettings.dashboardEnabled, onCheckedChange: (v) => handleToggle("dashboardEnabled", v) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-4 bg-[#1A2438] rounded-lg", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white font-medium", children: "New User Registration" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[#8A9BB5] text-xs", children: "Allow or block admin from creating new users (soft lock)" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: systemSettings.registrationEnabled, onCheckedChange: (v) => handleToggle("registrationEnabled", v) })
            ] })
          ] })
        ] }),
        activeSection === "danger" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "glass-card border-2 border-[#FF4D6A]/50 bg-[#111827]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-[#FF4D6A] flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 20 }),
            "Danger Zone"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 bg-[#1A2438] rounded-lg border border-[rgba(255,255,255,0.07)]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white font-medium mb-1", children: "Reset All Balances to Zero" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[#8A9BB5] text-xs", children: `Sets all users' checking and savings to 0, posts a single "System Reset" transaction entry for each.` })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: confirmText, onChange: (e) => setConfirmText(e.target.value), placeholder: "Type 'CONFIRM RESET' here", className: "flex-1 bg-[#070B14] border border-[rgba(255,255,255,0.1)] text-white" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => handleDangerAction("Reset All Balances"), className: "bg-[#FF4D6A] hover:bg-[#FF4D6A]/90 text-white", disabled: confirmText !== "CONFIRM RESET", children: "Execute" })
              ] })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 bg-[#1A2438] rounded-lg border border-[rgba(255,255,255,0.07)]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white font-medium mb-1", children: "Delete All Transactions" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[#8A9BB5] text-xs", children: "Wipes the entire transactions collection." })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: confirmText, onChange: (e) => setConfirmText(e.target.value), placeholder: "Type 'CONFIRM RESET' here", className: "flex-1 bg-[#070B14] border border-[rgba(255,255,255,0.1)] text-white" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => handleDangerAction("Delete All Transactions"), className: "bg-[#FF4D6A] hover:bg-[#FF4D6A]/90 text-white", disabled: confirmText !== "CONFIRM RESET", children: "Execute" })
              ] })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 bg-[#1A2438] rounded-lg border border-[rgba(255,255,255,0.07)]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white font-medium mb-1", children: "Delete All Chat History" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[#8A9BB5] text-xs", children: "Wipes all chat sessions and messages." })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: confirmText, onChange: (e) => setConfirmText(e.target.value), placeholder: "Type 'CONFIRM RESET' here", className: "flex-1 bg-[#070B14] border border-[rgba(255,255,255,0.1)] text-white" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => handleDangerAction("Delete All Chat History"), className: "bg-[#FF4D6A] hover:bg-[#FF4D6A]/90 text-white", disabled: confirmText !== "CONFIRM RESET", children: "Execute" })
              ] })
            ] }) })
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  AdminSettingsPage as component
};
