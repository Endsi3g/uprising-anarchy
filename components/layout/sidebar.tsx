"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Map,
  Search,
  MapPin,
  UserCheck,
  Mail,
  Bot,
  ChevronDown,
} from "lucide-react";

const navGroups = [
  {
    label: "PROSPECTION",
    items: [
      { href: "/prospection", label: "Prospects", icon: Users },
      { href: "/prospection/carte", label: "Carte", icon: Map },
      { href: "/prospection/scraper", label: "Scraper", icon: Search },
      { href: "/prospection/territoires", label: "Zones", icon: MapPin },
    ],
  },
  {
    label: "AGENCE",
    items: [
      { href: "/clients", label: "Clients", icon: UserCheck },
      { href: "/campagnes", label: "Campagnes", icon: Mail },
    ],
  },
  {
    label: "OUTILS",
    items: [
      { href: "/assistant", label: "Assistant IA", icon: Bot },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[200px] shrink-0 border-r border-border bg-sidebar flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-xs font-bold">U</span>
          </div>
          <span className="font-semibold text-sm text-foreground">Uprising</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-4">
            <p className="px-2 mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {group.label}
            </p>
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors mb-0.5",
                    isActive
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-2 py-3 border-t border-border">
        <Link
          href="/assistant"
          className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <Bot className="w-4 h-4" />
          <span>+ Demander à Claude</span>
        </Link>
      </div>
    </aside>
  );
}
