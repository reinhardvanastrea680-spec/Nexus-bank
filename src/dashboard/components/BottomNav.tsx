import { Link } from "@tanstack/react-router";
import { Settings, Bell, Home as HomeIcon, History, Headphones } from "lucide-react";
import { useTheme } from "../../hooks/use-theme";
import { themeColors } from "../../utils/theme";
import { useLang } from "../../hooks/LanguageContext";

interface BottomNavProps {
  active?: "home" | "notifications" | "transactions" | "settings" | "support" | "cards" | "profile";
}

export function BottomNav({ active }: BottomNavProps) {
  const { theme } = useTheme();
  const t = themeColors(theme);
  const { t: tl } = useLang();

  const items = [
    { key: "settings",      label: tl("Settings"),      icon: Settings,     to: "/settings"      },
    { key: "notifications", label: tl("Notifications"), icon: Bell,         to: "/notifications" },
    { key: "home",          label: tl("Home"),           icon: HomeIcon,     to: "/"              },
    { key: "transactions",  label: tl("Transactions"),  icon: History,      to: "/transactions"  },
    { key: "support",       label: tl("Support"),       icon: Headphones,   to: "/support"       },
  ];

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around px-2 py-3 border-t"
      style={{ background: t.navBg, borderColor: t.navBorder }}
    >
      {items.map(({ key, label, icon: Icon, to }) => {
        const isActive = key === active;
        const color = isActive ? t.navActive : t.navInactive;
        return (
          <Link key={key} to={to} className="flex flex-col items-center gap-0.5 min-w-0 px-1">
            <Icon size={22} style={{ color }} strokeWidth={isActive ? 2.5 : 1.8} />
            <span className="text-xs font-medium" style={{ color }}>{label}</span>
          </Link>
        );
      })}
    </div>
  );
}
