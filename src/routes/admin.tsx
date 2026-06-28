import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, Outlet, useLocation, createFileRoute } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  Wallet,
  ArrowLeftRight,
  MessageSquare,
  ScrollText,
  Settings,
  Bell,
  User,
  Search,
  Menu,
  X,
  LogOut,
  Clock,
  UserPlus,
  BookUser,
} from "lucide-react";
import { useAdminAuth } from "../admin/hooks/useAdminAuth";
import { useAdminTransactions } from "../admin/hooks/useAdminTransactions";
import { useAdminNotifications } from "../admin/hooks/useAdminNotifications";
import { db } from "../firebase/config";
import { collection, onSnapshot } from "firebase/firestore";
import { startSessionWatcher, touchSession } from "../utils/adminSecurity";
import { AdminInstallPrompt } from "../dashboard/components/AdminInstallPrompt";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
  // Override manifest for admin PWA — installs as "Nexus Bank Admin" opening /admin-login
  head: () => ({
    meta: [
      { name: "theme-color", content: "#06B6D4" },
      { name: "apple-mobile-web-app-title", content: "NB Admin" },
    ],
    links: [
      { rel: "manifest", href: "/admin-manifest.json" },
    ],
  }),
  loader: () => {
    // Redirect to /admin/overview when visiting /admin
    return null;
  },
  errorComponent: () => null,
});

const navItems = [
  { label: "Overview",              icon: LayoutDashboard, to: "/admin/overview"              },
  { label: "Notifications",         icon: Bell,            to: "/admin/notifications"          },
  { label: "User Management",       icon: Users,           to: "/admin/users"                  },
  { label: "Account Control",       icon: Wallet,          to: "/admin/accounts"               },
  { label: "Pending Transfers",     icon: Clock,           to: "/admin/pending-transactions"   },
  { label: "Transaction Manager",   icon: ArrowLeftRight,  to: "/admin/transactions"           },
  { label: "Beneficiary Requests",  icon: BookUser,        to: "/admin/beneficiary-requests"   },
  { label: "Live Chat Center",      icon: MessageSquare,   to: "/admin/chat"                   },
  { label: "Prospective New Users", icon: UserPlus,        to: "/admin/prospective-users"      },
  { label: "Activity Log",          icon: ScrollText,      to: "/admin/activity"               },
  { label: "System Settings",       icon: Settings,        to: "/admin/settings"               },
];

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { admin, loading, adminLogout } = useAdminAuth();
  const { pendingCount } = useAdminTransactions("pending");
  const { unreadCount: unreadNotifCount } = useAdminNotifications();
  const [unreadChatCount, setUnreadChatCount] = useState(0);
  const [prospectiveCount, setProspectiveCount] = useState(0);
  const [pendingBeneficiaryCount, setPendingBeneficiaryCount] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const prevPendingCountRef = useRef(pendingCount);

  // Listen to pending beneficiary requests
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "beneficiaryRequests"),
      (snap) => {
        setPendingBeneficiaryCount(
          snap.docs.filter((d) => d.data().status === "pending").length
        );
      }
    );
    return unsub;
  }, []);

  // Listen to total unread chat messages across all chats
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "chats"), (snap) => {
      const total = snap.docs.reduce((sum, d) => sum + (d.data().unreadByAdmin || 0), 0);
      setUnreadChatCount(total);
    });
    return unsub;
  }, []);

  // Listen to prospective chats + new contact submissions
  useEffect(() => {
    const chatUnsub = onSnapshot(collection(db, "prospectiveChats"), (snap) => {
      const unread = snap.docs.reduce((sum, d) => sum + (d.data().unreadByAdmin || 0), 0);
      setProspectiveCount((prev) => {
        // Also count new contacts — we update together below
        return unread;
      });
    });
    const contactUnsub = onSnapshot(collection(db, "prospectiveContacts"), (snap) => {
      const newCount = snap.docs.filter((d) => d.data().status === "new").length;
      setProspectiveCount((chatUnread) => chatUnread + newCount);
    });
    return () => { chatUnsub(); contactUnsub(); };
  }, []);

  // Update time
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Show toast when new pending transactions arrive
  useEffect(() => {
    if (pendingCount > prevPendingCountRef.current && prevPendingCountRef.current !== 0) {
      toast.info("New transaction request pending approval", {
        action: {
          label: "Review",
          onClick: () => navigate({ to: "/admin/pending-transactions" }),
        },
      });
    }
    prevPendingCountRef.current = pendingCount;
  }, [pendingCount, navigate]);

  // Session timeout — auto-logout after 30 min inactivity
  useEffect(() => {
    if (!admin) return;
    touchSession();
    const cleanup = startSessionWatcher(async () => {
      toast.error("Session expired — please sign in again");
      await adminLogout();
      navigate({ to: "/admin-login" });
    });
    return cleanup;
  }, [admin]);

  // Redirect if not admin
  useEffect(() => {
    if (!loading && !admin) {
      navigate({ to: "/admin-login" });
    }
  }, [loading, admin, navigate]);

  // Session timeout watcher — auto logout after 30 min inactivity
  useEffect(() => {
    if (!admin) return;
    touchSession();
    const cleanup = startSessionWatcher(() => {
      toast.warning("Session expired — please sign in again.");
      adminLogout().finally(() => navigate({ to: "/admin-login" }));
    });
    return cleanup;
  }, [admin]);

  const handleLogout = async () => {
    try {
      await adminLogout();
      navigate({ to: "/admin-login" });
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070B14]">
        <div className="text-blue-300 animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Animated background */}
      <div className="animated-bg">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
      </div>

      {/* Sidebar — COMPLETELY HIDDEN on mobile (<1024px), visible on desktop */}
      <aside
        className={`fixed left-0 top-0 h-full bg-[#0A1020] border-r border-[rgba(255,255,255,0.05)] transition-all duration-300 z-40 flex-col ${
          sidebarCollapsed ? "w-0 overflow-hidden border-0 !hidden" : "w-[260px] hidden lg:flex"
        }`}
        aria-label="Admin sidebar"
      >
        <div className="p-4 border-b border-[rgba(255,255,255,0.05)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            {!sidebarCollapsed && (
              <span className="text-white font-bold text-lg">Admin Console</span>
            )}
          </div>
        </div>

        <nav className="p-3 space-y-1" aria-label="Admin navigation">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            let badge = 0;
            if (item.to === "/admin/notifications")          badge = unreadNotifCount;
            if (item.to === "/admin/pending-transactions")   badge = pendingCount;
            if (item.to === "/admin/chat")                   badge = unreadChatCount;
            if (item.to === "/admin/prospective-users")      badge = prospectiveCount;
            if (item.to === "/admin/beneficiary-requests")   badge = pendingBeneficiaryCount;

            return (
              <Link
                key={item.to}
                to={item.to}
                aria-label={`${item.label}${badge > 0 ? ` (${badge} new)` : ""}`}
                aria-current={isActive ? "page" : undefined}
                onClick={() => setMobileSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-[rgba(0,198,255,0.07)] text-white border-l-[3px] border-cyan-500"
                    : "text-blue-300/70 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="relative flex-shrink-0">
                  <item.icon size={20} className={isActive ? "text-cyan-400" : ""} aria-hidden="true" />
                  {badge > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-0.5 rounded-full flex items-center justify-center text-[10px] font-bold"
                      style={{ background: "#FF4D6A", color: "#FFFFFF" }} aria-hidden="true">
                      {badge > 99 ? "99+" : badge}
                    </span>
                  )}
                </div>
                {!sidebarCollapsed && (
                  <span className="font-medium flex-1 flex items-center justify-between">
                    {item.label}
                    {badge > 0 && (
                      <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: "#FF4D6A", color: "#FFFFFF" }} aria-hidden="true">
                        {badge > 99 ? "99+" : badge}
                      </span>
                    )}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-[rgba(255,255,255,0.05)]">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 flex items-center justify-center flex-shrink-0" aria-hidden="true">
              <User size={18} className="text-white" />
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">Admin</p>
                <p className="text-blue-300/60 text-xs truncate">{admin?.email || "admin@nexusbank.com"}</p>
              </div>
            )}
          </div>
          <button onClick={handleLogout} aria-label="Sign out"
            className="w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all mt-1">
            <LogOut size={20} aria-hidden="true" />
            {!sidebarCollapsed && <span className="font-medium">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileSidebarOpen(false)} aria-hidden="true" />
          <aside className="absolute left-0 top-0 h-full w-[260px] bg-[#0A1020] border-r border-[rgba(255,255,255,0.05)] flex flex-col overflow-y-auto">
            <div className="p-4 border-b border-[rgba(255,255,255,0.05)] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-lg" aria-hidden="true">N</span>
                </div>
                <span className="text-white font-bold text-lg">Admin Console</span>
              </div>
              <button onClick={() => setMobileSidebarOpen(false)} aria-label="Close menu"
                className="p-2 rounded-lg text-blue-300 hover:text-white hover:bg-white/10">
                <X size={20} aria-hidden="true" />
              </button>
            </div>
            <nav className="p-3 space-y-1 flex-1" aria-label="Admin navigation">
              {navItems.map((item) => {
                const isActive = location.pathname === item.to;
                let badge = 0;
                if (item.to === "/admin/notifications")          badge = unreadNotifCount;
                if (item.to === "/admin/pending-transactions")   badge = pendingCount;
                if (item.to === "/admin/chat")                   badge = unreadChatCount;
                if (item.to === "/admin/prospective-users")      badge = prospectiveCount;
                if (item.to === "/admin/beneficiary-requests")   badge = pendingBeneficiaryCount;
                return (
                  <Link key={item.to} to={item.to}
                    aria-label={`${item.label}${badge > 0 ? ` (${badge} new)` : ""}`}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${isActive ? "bg-[rgba(0,198,255,0.07)] text-white border-l-[3px] border-cyan-500" : "text-blue-300/70 hover:text-white hover:bg-white/5"}`}>
                    <div className="relative flex-shrink-0">
                      <item.icon size={20} className={isActive ? "text-cyan-400" : ""} aria-hidden="true" />
                      {badge > 0 && <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-0.5 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: "#FF4D6A", color: "#FFFFFF" }} aria-hidden="true">{badge > 99 ? "99+" : badge}</span>}
                    </div>
                    <span className="font-medium flex-1 flex items-center justify-between">
                      {item.label}
                      {badge > 0 && <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: "#FF4D6A", color: "#FFFFFF" }} aria-hidden="true">{badge > 99 ? "99+" : badge}</span>}
                    </span>
                  </Link>
                );
              })}
            </nav>
            <div className="p-3 border-t border-[rgba(255,255,255,0.05)]">
              <button onClick={handleLogout} aria-label="Sign out"
                className="w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-lg">
                <LogOut size={20} aria-hidden="true" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className={`flex-1 transition-all min-w-0 ${sidebarCollapsed ? "lg:ml-0" : "lg:ml-[260px]"} ml-0`}>
        {/* Header */}
        <header className="h-[64px] bg-[#0D1625]/90 backdrop-blur-md border-b border-[rgba(255,255,255,0.05)] sticky top-0 z-30 px-4 md:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button onClick={() => setMobileSidebarOpen(true)} aria-label="Open menu"
              className="lg:hidden p-2 rounded-lg text-blue-300 hover:text-white hover:bg-white/10">
              <Menu size={20} aria-hidden="true" />
            </button>
            {/* Desktop collapse/expand */}
            <Button variant="ghost" size="icon" aria-label={sidebarCollapsed ? "Show sidebar" : "Hide sidebar"}
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex text-blue-300 hover:text-white">
              {sidebarCollapsed ? <Menu size={20} aria-hidden="true" /> : <X size={20} aria-hidden="true" />}
            </Button>
            <div className="min-w-0">
              <h1 className="text-white font-semibold text-base md:text-lg truncate">Nexus Control Centre</h1>
              <p className="text-blue-300/60 text-xs hidden sm:block">
                {navItems.find((item) => location.pathname === item.to)?.label || "Dashboard"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300/50" aria-hidden="true" />
              <Input placeholder="Search users, transactions..." aria-label="Search admin dashboard"
                className="w-48 lg:w-80 pl-10 h-10 bg-[#070B14] border-[rgba(255,255,255,0.1)] text-white placeholder:text-blue-300/50 focus:ring-cyan-500" />
            </div>
            <div className="text-right hidden lg:block">
              <p className="text-white font-mono text-sm" aria-live="polite" aria-label="Current time">
                {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
              <p className="text-blue-300/60 text-xs">{currentTime.toLocaleDateString()}</p>
            </div>
            <Link to="/admin/notifications" aria-label={`Notifications${unreadNotifCount > 0 ? `, ${unreadNotifCount} unread` : ""}`}
              className="relative w-10 h-10 rounded-lg flex items-center justify-center bg-white/5 hover:bg-white/10 transition-all">
              <Bell className="text-white w-5 h-5" aria-hidden="true" />
              {unreadNotifCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-0.5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white" aria-hidden="true">
                  {unreadNotifCount > 99 ? "99+" : unreadNotifCount}
                </span>
              )}
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 px-2" aria-label="Admin account menu">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 flex items-center justify-center" aria-hidden="true">
                    <User size={16} className="text-white" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#0D1625] border-[rgba(255,255,255,0.1)] text-white">
                <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-[rgba(255,255,255,0.1)]" />
                <DropdownMenuItem className="hover:bg-white/10">Profile</DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-white/10">Settings</DropdownMenuItem>
                <DropdownMenuSeparator className="bg-[rgba(255,255,255,0.1)]" />
                <DropdownMenuItem onClick={handleLogout} className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main */}
        <main className="p-4 md:p-6 min-h-[calc(100vh-64px)] overflow-x-hidden">
          <div className="admin-page-content space-y-4">
            <Outlet />
          </div>
        </main>
        <AdminInstallPrompt />
      </div>
    </div>
  );
}
