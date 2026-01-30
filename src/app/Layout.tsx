import { NavLink, Outlet } from "react-router-dom";
import {
  CalendarCheck,
  Heart,
  Sparkles,
  Target,
  List,
  Repeat,
} from "lucide-react";

const navItems = [
  { to: "/", icon: CalendarCheck, label: "Today" },
  { to: "/values", icon: Heart, label: "Values" },
  { to: "/dreams", icon: Sparkles, label: "Dreams" },
  { to: "/goals", icon: Target, label: "Goals" },
  { to: "/backlog", icon: List, label: "Backlog" },
  { to: "/habits", icon: Repeat, label: "Habits" },
];

export function Layout() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <main className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-2 py-1.5 text-xs transition-colors ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`
              }
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
