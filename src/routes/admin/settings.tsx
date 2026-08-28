import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Route as AdminRootRoute } from "../admin";
import {
  User,
  MessageSquare,
  Shield,
  AlertTriangle,
  Trash2,
  Upload,
  Lock,
  Plus,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Switch } from "../../components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "../../components/ui/dialog";
import { Textarea } from "../../components/ui/textarea";
import { Badge } from "../../components/ui/badge";
import { toast } from "sonner";
import { useTheme } from "../../hooks/use-theme";

// Mock system settings data
const initialSystemSettings = {
  chatEnabled: true,
  dashboardEnabled: true,
  registrationEnabled: true,
};

// Empty quick replies
const initialQuickReplies = [];

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettingsPage,
  getParentRoute: () => AdminRootRoute,
});

function AdminSettingsPage() {
  const { theme, setTheme } = useTheme();

  // State management
  const [adminName, setAdminName] = useState("Admin User");
  const [quickReplies, setQuickReplies] = useState(initialQuickReplies);
  const [newReply, setNewReply] = useState("");
  const [showAddReplyModal, setShowAddReplyModal] = useState(false);
  const [systemSettings, setSystemSettings] = useState(initialSystemSettings);
  const [confirmText, setConfirmText] = useState("");

  // Handle password reset
  const handlePasswordReset = () => {
    toast.success("Password reset link sent to admin@nexusbank.com!");
  };

  // Handle quick reply management
  const handleAddReply = () => {
    if (newReply.trim()) {
      setQuickReplies([...quickReplies, newReply.trim()]);
      setNewReply("");
      setShowAddReplyModal(false);
      toast.success("Quick reply added!");
    }
  };

  const handleDeleteReply = (index: number) => {
    setQuickReplies(quickReplies.filter((_, i) => i !== index));
    toast.success("Quick reply deleted!");
  };

  // Handle system toggle changes
  const handleToggle = (key: keyof typeof systemSettings, value: boolean) => {
    setSystemSettings((prev) => ({ ...prev, [key]: value }));
    toast.success(`${key} setting updated!`);
  };

  // Handle danger zone actions
  const handleDangerAction = (action: string) => {
    if (confirmText !== "CONFIRM RESET") {
      toast.error("Please type 'CONFIRM RESET' to confirm!");
      return;
    }

    // Mock action
    toast.success(`Action "${action}" executed successfully!`);
    setConfirmText("");
  };

  // Sections for left sub-nav
  const sections = [
    { id: "appearance", icon: Sun, label: "Appearance" },
    { id: "profile",    icon: User, label: "Admin Profile" },
    { id: "replies",    icon: MessageSquare, label: "Quick Replies" },
    { id: "controls",   icon: Shield, label: "System Controls" },
    { id: "danger",     icon: AlertTriangle, label: "Danger Zone" },
  ];

  const [activeSection, setActiveSection] = useState("appearance");

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-white">System Settings</h1>
        <p className="text-sm text-[#8A9BB5]">Configure Nexsus Bank admin console</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left Sub-Navigation */}
        <Card className="glass-card border-0 bg-[#111827] lg:col-span-1">
          <CardContent className="pt-6 space-y-2">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left ${
                    activeSection === section.id
                      ? "bg-[#38BDF8]/20 border border-[#38BDF8]/30 text-[#38BDF8]"
                      : "bg-transparent text-[#8A9BB5] hover:bg-[#1A2438]"
                  }`}
                >
                  <Icon size={18} />
                  <span className="font-medium">{section.label}</span>
                </button>
              );
            })}
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-4">
          {/* Appearance Section */}
          {activeSection === "appearance" && (
            <Card className="glass-card border-0 bg-[#111827]">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Sun size={20} className="text-[#38BDF8]" />
                  Appearance
                </CardTitle>
                <p className="text-sm text-[#8A9BB5] mt-1">Customize how the admin console looks</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Theme selector */}
                <div>
                  <Label className="text-white font-semibold mb-4 block">Theme</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      {
                        id: "dark",
                        label: "Dark",
                        icon: Moon,
                        desc: "Deep navy — default",
                        bg: "#070B14",
                        accent: "#38BDF8",
                      },
                      {
                        id: "light",
                        label: "Light",
                        icon: Sun,
                        desc: "Clean white",
                        bg: "#F0F4F8",
                        accent: "#0EA5E9",
                      },
                    ].map((t) => {
                      const Icon = t.icon;
                      const isActive = theme === t.id;
                      return (
                        <button
                          key={t.id}
                          onClick={() => {
                            setTheme(t.id as "dark" | "light");
                            toast.success(`Switched to ${t.label} theme`);
                          }}
                          className="relative flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all text-center"
                          style={{
                            borderColor: isActive ? t.accent : "rgba(255,255,255,0.08)",
                            background: isActive ? `${t.accent}15` : "rgba(255,255,255,0.02)",
                            boxShadow: isActive ? `0 0 0 1px ${t.accent}40, 0 4px 20px ${t.accent}20` : "none",
                          }}
                        >
                          {/* Mini preview */}
                          <div
                            className="w-full h-16 rounded-xl flex items-center justify-center mb-1 overflow-hidden"
                            style={{ background: t.bg }}
                          >
                            <div className="flex gap-2 items-center">
                              <div className="w-6 h-10 rounded" style={{ background: t.id === "dark" ? "#0A1020" : "#FFFFFF", border: `1px solid ${t.accent}40` }} />
                              <div className="space-y-1.5">
                                <div className="h-1.5 w-10 rounded" style={{ background: t.accent }} />
                                <div className="h-1.5 w-8 rounded" style={{ background: t.id === "dark" ? "#1A2438" : "#E4EAF2" }} />
                                <div className="h-1.5 w-6 rounded" style={{ background: t.id === "dark" ? "#1A2438" : "#E4EAF2" }} />
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Icon size={16} style={{ color: isActive ? t.accent : "#8A9BB5" }} />
                            <span className="font-semibold text-sm" style={{ color: isActive ? t.accent : "#FFFFFF" }}>
                              {t.label}
                            </span>
                          </div>
                          <span className="text-xs" style={{ color: "#8A9BB5" }}>{t.desc}</span>

                          {isActive && (
                            <span
                              className="absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded-full"
                              style={{ background: `${t.accent}20`, color: t.accent }}
                            >
                              Active
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Quick toggle */}
                <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="flex items-center gap-3">
                    {theme === "dark"
                      ? <Moon size={20} style={{ color: "#38BDF8" }} />
                      : <Sun size={20} style={{ color: "#F59E0B" }} />
                    }
                    <div>
                      <p className="text-white font-medium text-sm">Current theme</p>
                      <p className="text-[#8A9BB5] text-xs">{theme === "dark" ? "Dark mode — navy background" : "Light mode — white background"}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const next = theme === "dark" ? "light" : "dark";
                      setTheme(next);
                      toast.success(`Switched to ${next} theme`);
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                    style={{
                      background: theme === "dark" ? "rgba(56,189,248,0.1)" : "rgba(245,158,11,0.1)",
                      color: theme === "dark" ? "#38BDF8" : "#F59E0B",
                      border: `1px solid ${theme === "dark" ? "rgba(56,189,248,0.2)" : "rgba(245,158,11,0.2)"}`,
                    }}
                  >
                    {theme === "dark" ? <><Sun size={14} /> Switch to Light</> : <><Moon size={14} /> Switch to Dark</>}
                  </button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Admin Profile Section */}
          {activeSection === "profile" && (
            <Card className="glass-card border-0 bg-[#111827]">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <User size={20} className="text-[#38BDF8]" />
                  Admin Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[#38BDF8] to-[#6366F1] flex items-center justify-center text-3xl font-bold text-white">
                      {adminName.charAt(0)}
                    </div>
                    <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#1A2438] border border-[rgba(255,255,255,0.1)] flex items-center justify-center text-[#8A9BB5] hover:text-[#38BDF8]">
                      <Upload size={14} />
                    </button>
                  </div>
                  <div className="flex-1 space-y-4 w-full">
                    <div className="space-y-2">
                      <Label className="text-[#8A9BB5]">Display Name</Label>
                      <Input
                        value={adminName}
                        onChange={(e) => setAdminName(e.target.value)}
                        className="bg-[#1A2438] border border-[rgba(255,255,255,0.1)] text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[#8A9BB5]">Email</Label>
                      <Input
                        value="admin@nexusbank.com"
                        readOnly
                        className="bg-[#1A2438] border border-[rgba(255,255,255,0.1)] text-[#8A9BB5]"
                      />
                    </div>
                    <Button
                      onClick={handlePasswordReset}
                      className="w-full sm:w-auto bg-[#1A2438] text-[#8A9BB5] border border-[rgba(255,255,255,0.1)]"
                    >
                      <Lock size={16} className="mr-2" />
                      Change Password
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Replies Section */}
          {activeSection === "replies" && (
            <Card className="glass-card border-0 bg-[#111827]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <MessageSquare size={20} className="text-[#6366F1]" />
                    Quick Reply Templates
                  </CardTitle>
                  <Dialog open={showAddReplyModal} onOpenChange={setShowAddReplyModal}>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-[#38BDF8] to-[#6366F1] text-white">
                        <Plus size={16} className="mr-2" />
                        Add Template
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#111827] border border-[rgba(255,255,255,0.1)] text-white">
                      <DialogHeader>
                        <DialogTitle className="text-white">Add Quick Reply</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-[#8A9BB5]">Message</Label>
                          <Textarea
                            value={newReply}
                            onChange={(e) => setNewReply(e.target.value)}
                            placeholder="Enter your quick reply..."
                            className="bg-[#1A2438] border border-[rgba(255,255,255,0.1)] text-white min-h-[100px]"
                          />
                        </div>
                        <DialogClose asChild>
                          <div className="flex gap-3">
                            <Button
                              variant="ghost"
                              className="flex-1 text-[#8A9BB5] border border-[rgba(255,255,255,0.1)]"
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={handleAddReply}
                              className="flex-1 bg-gradient-to-r from-[#38BDF8] to-[#6366F1] text-white"
                            >
                              Save
                            </Button>
                          </div>
                        </DialogClose>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickReplies.length === 0 ? (
                  <div className="text-center py-8 text-[#8A9BB5]">
                    No quick replies yet. Add one above!
                  </div>
                ) : (
                  quickReplies.map((reply, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 bg-[#1A2438] p-3 rounded-lg"
                    >
                      <span className="text-[#8A9BB5] text-sm flex-1">{reply}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteReply(index)}
                        className="text-[#FF4D6A] hover:text-[#FF4D6A] hover:bg-[#FF4D6A]/10"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          )}

          {/* System Controls Section */}
          {activeSection === "controls" && (
            <Card className="glass-card border-0 bg-[#111827]">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield size={20} className="text-[#00E676]" />
                  System Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Live Chat Widget */}
                <div className="flex items-center justify-between p-4 bg-[#1A2438] rounded-lg">
                  <div className="flex-1">
                    <p className="text-white font-medium">Live Chat Widget</p>
                    <p className="text-[#8A9BB5] text-xs">
                      Enable or disable the chat widget on the Nexsus Bank landing page and user
                      dashboard
                    </p>
                  </div>
                  <Switch
                    checked={systemSettings.chatEnabled}
                    onCheckedChange={(v) => handleToggle("chatEnabled", v)}
                  />
                </div>

                {/* User Dashboard Access */}
                <div className="flex items-center justify-between p-4 bg-[#1A2438] rounded-lg">
                  <div className="flex-1">
                    <p className="text-white font-medium">User Dashboard Access</p>
                    <p className="text-[#8A9BB5] text-xs">
                      When disabled, all users see a maintenance screen on login
                    </p>
                  </div>
                  <Switch
                    checked={systemSettings.dashboardEnabled}
                    onCheckedChange={(v) => handleToggle("dashboardEnabled", v)}
                  />
                </div>

                {/* New User Registration */}
                <div className="flex items-center justify-between p-4 bg-[#1A2438] rounded-lg">
                  <div className="flex-1">
                    <p className="text-white font-medium">New User Registration</p>
                    <p className="text-[#8A9BB5] text-xs">
                      Allow or block admin from creating new users (soft lock)
                    </p>
                  </div>
                  <Switch
                    checked={systemSettings.registrationEnabled}
                    onCheckedChange={(v) => handleToggle("registrationEnabled", v)}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Danger Zone Section */}
          {activeSection === "danger" && (
            <Card className="glass-card border-2 border-[#FF4D6A]/50 bg-[#111827]">
              <CardHeader>
                <CardTitle className="text-[#FF4D6A] flex items-center gap-2">
                  <AlertTriangle size={20} />
                  Danger Zone
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Reset All Balances */}
                <div className="p-4 bg-[#1A2438] rounded-lg border border-[rgba(255,255,255,0.07)]">
                  <div className="flex flex-col gap-4">
                    <div>
                      <p className="text-white font-medium mb-1">Reset All Balances to Zero</p>
                      <p className="text-[#8A9BB5] text-xs">
                        Sets all users' checking and savings to 0, posts a single "System Reset"
                        transaction entry for each.
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Input
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value)}
                        placeholder="Type 'CONFIRM RESET' here"
                        className="flex-1 bg-[#070B14] border border-[rgba(255,255,255,0.1)] text-white"
                      />
                      <Button
                        onClick={() => handleDangerAction("Reset All Balances")}
                        className="bg-[#FF4D6A] hover:bg-[#FF4D6A]/90 text-white"
                        disabled={confirmText !== "CONFIRM RESET"}
                      >
                        Execute
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Delete All Transactions */}
                <div className="p-4 bg-[#1A2438] rounded-lg border border-[rgba(255,255,255,0.07)]">
                  <div className="flex flex-col gap-4">
                    <div>
                      <p className="text-white font-medium mb-1">Delete All Transactions</p>
                      <p className="text-[#8A9BB5] text-xs">
                        Wipes the entire transactions collection.
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Input
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value)}
                        placeholder="Type 'CONFIRM RESET' here"
                        className="flex-1 bg-[#070B14] border border-[rgba(255,255,255,0.1)] text-white"
                      />
                      <Button
                        onClick={() => handleDangerAction("Delete All Transactions")}
                        className="bg-[#FF4D6A] hover:bg-[#FF4D6A]/90 text-white"
                        disabled={confirmText !== "CONFIRM RESET"}
                      >
                        Execute
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Delete All Chat History */}
                <div className="p-4 bg-[#1A2438] rounded-lg border border-[rgba(255,255,255,0.07)]">
                  <div className="flex flex-col gap-4">
                    <div>
                      <p className="text-white font-medium mb-1">Delete All Chat History</p>
                      <p className="text-[#8A9BB5] text-xs">
                        Wipes all chat sessions and messages.
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Input
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value)}
                        placeholder="Type 'CONFIRM RESET' here"
                        className="flex-1 bg-[#070B14] border border-[rgba(255,255,255,0.1)] text-white"
                      />
                      <Button
                        onClick={() => handleDangerAction("Delete All Chat History")}
                        className="bg-[#FF4D6A] hover:bg-[#FF4D6A]/90 text-white"
                        disabled={confirmText !== "CONFIRM RESET"}
                      >
                        Execute
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
