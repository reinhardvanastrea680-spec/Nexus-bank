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
} from "lucide-react";
import { useAdminAuth } from "../admin/hooks/useAdminAuth";
import { useAdminTransactions } from "../admin/hooks/useAdminTransactions";
import { useAdminNotifications } from "../admin/hooks/useAdminNotifications";
import { db } from "../firebase/config";
import { collection, onSnapshot } from "firebase/firestore";
import { startSessionWatcher, touchSession } from "../utils/adminSecurity";
import { startSessionWatcher, touchSession } from "../utils/adminSecurity";
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
  loader: () => {
    // Redirect to /admin/overview when visiting /admin
    return null;
  },
  errorComponent: () => null,
});

const navItems = [
  { label: "Overview",             icon: LayoutDashboard, to: "/admin/overview"           },
  { label: "Notifications",        icon: Bell,            to: "/admin/notifications"       },
  { label: "User Management",      icon: Users,           to: "/admin/users"               },
  { label: "Account Control",      icon: Wallet,          to: "/admin/accounts"            },
  { label: "Pending Transfers",    icon: Clock,           to: "/admin/pending-transactions" },
  { label: "Transaction Manager",  icon: ArrowLeftRight,  to: "/admin/transactions"        },
  { label: "Live Chat Center",     icon: MessageSquare,   to: "/admin/chat"                },
  { label: "Prospective New Users",icon: UserPlus,        to: "/admin/prospective-users"   },
  { label: "Activity Log",         icon: ScrollText,      to: "/admin/activity"            },
  { label: "System Settings",      icon: Settings,        to: "/admin/settings"            },
];

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { admin, loading, adminLogout } = useAdminAuth();
  const { pendingCount } = useAdminTransactions("pending");
  const { unreadCount: unreadNotifCount } = useAdminNotifications();
  const [unreadChatCount, setUnreadChatCount] = useState(0);
  const [prospectiveCount, setProspectiveCount] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const prevPendingCountRef = useRef(pendingCount);

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

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-[#0A1020] border-r border-[rgba(255,255,255,0.05)] transition-all duration-300 z-40 ${
          sidebarCollapsed ? "w-[72px]" : "w-[260px]"
        }`}
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

        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;

            // Determine badge count per nav item
            let badge = 0;
            if (item.to === "/admin/notifications")        badge = unreadNotifCount;
            if (item.to === "/admin/pending-transactions") badge = pendingCount;
            if (item.to === "/admin/chat")                 badge = unreadChatCount;
            if (item.to === "/admin/prospective-users")    badge = prospectiveCount;

            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-[rgba(0,198,255,0.07)] text-white border-l-3 border-l-cyan-500"
                    : "text-blue-300/70 hover:text-white hover:bg-white/5"
                }`}
              >
                {/* Icon with badge dot */}
                <div className="relative flex-shrink-0">
                  <item.icon size={20} className={isActive ? "text-cyan-400" : ""} />
                  {badge > 0 && (
                    <span
                      className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-0.5 rounded-full flex items-center justify-center text-[10px] font-bold"
                      style={{ background: "#FF4D6A", color: "#FFFFFF" }}
                    >
                      {badge > 99 ? "99+" : badge}
                    </span>
                  )}
                </div>

                {/* Label with inline badge */}
                {!sidebarCollapsed && (
                  <span className="font-medium flex-1 flex items-center justify-between">
                    {item.label}
                    {badge > 0 && (
                      <span
                        className="ml-2 px-2 py-0.5 rounded-full text-xs font-bold"
                        style={{ background: "#FF4D6A", color: "#FFFFFF" }}
                      >
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
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 flex items-center justify-center flex-shrink-0">
              <User size={18} className="text-white" />
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">Admin</p>
                <p className="text-blue-300/60 text-xs truncate">
                  {admin?.email || "admin@nexusbank.com"}
                </p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all mt-1"
          >
            <LogOut size={20} />
            {!sidebarCollapsed && <span className="font-medium">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className={`flex-1 transition-all ${sidebarCollapsed ? "ml-[72px]" : "ml-[260px]"}`}>
        {/* Header */}
        <header className="h-[64px] bg-[#0D1625]/90 backdrop-blur-md border-b border-[rgba(255,255,255,0.05)] sticky top-0 z-30 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="text-blue-300 hover:text-white"
            >
              {sidebarCollapsed ? <Menu size={20} /> : <X size={20} />}
            </Button>
            <div>
              <h1 className="text-white font-semibold text-lg">Nexus Control Centre</h1>
              <p className="text-blue-300/60 text-xs">
                {navItems.find((item) => location.pathname === item.to)?.label || "Dashboard"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300/50" />
              <Input
                placeholder="Search users, transactions..."
                className="w-80 pl-10 h-10 bg-[#070B14] border-[rgba(255,255,255,0.1)] text-white placeholder:text-blue-300/50 focus:ring-cyan-500"
              />
            </div>

            <div className="text-right hidden sm:block">
              <p className="text-white font-mono text-sm">
                {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
              <p className="text-blue-300/60 text-xs">{currentTime.toLocaleDateString()}</p>
            </div>

            <Link
              to="/admin/notifications"
              className="relative w-10 h-10 rounded-lg flex items-center justify-center bg-white/5 hover:bg-white/10 transition-all"
            >
              <Bell className="text-white w-5 h-5" />
              {unreadNotifCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-0.5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                  {unreadNotifCount > 99 ? "99+" : unreadNotifCount}
                </span>
              )}
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 px-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 flex items-center justify-center">
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
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main */}
        <main className="p-6 min-h-[calc(100vh-64px)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
