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
  Settings,
  LogOut,
  Moon,
  Sun,
  Globe,
  User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuPage,
  DropdownMenuPageTrigger,
} from "@/components/ui/material-ui-dropdown-menu";
import { createClient } from "@/lib/supabase/client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { UprisingMascot } from "@/components/ui/uprising-mascot";

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
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, [supabase]);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
    } else {
      router.push("/login");
      toast.success("Déconnecté");
    }
  };

  return (
    <aside className="w-[200px] shrink-0 border-r border-border bg-sidebar flex flex-col h-screen sticky top-0 group/sidebar">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <UprisingMascot size={24} className="text-primary" />
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
      <div className="px-2 py-3 border-t border-border flex flex-col gap-1">
        {/* Mascot Chamber */}
        <div className="mb-2 px-2">
          <div className="relative group/mascot p-4 rounded-xl bg-gradient-to-b from-primary/5 to-transparent border border-primary/10 overflow-hidden">
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/mascot:opacity-100 transition-opacity duration-500 blur-xl" />
            <UprisingMascot size={48} className="mx-auto relative z-10" />
            <div className="mt-3 text-center">
              <p className="text-[10px] uppercase tracking-[0.2em] text-primary/50 font-bold">The Herald</p>
              <div className="h-1 w-8 bg-primary/20 mx-auto mt-1 rounded-full overflow-hidden">
                <motion.div 
                  animate={{ x: [-32, 32] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="h-full w-full bg-primary/40" 
                />
              </div>
            </div>
          </div>
        </div>

        <Link
          href="/assistant"
          className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <Bot className="w-4 h-4" />
          <span>Assistant IA</span>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger className="w-full flex items-center justify-between px-2 py-2 rounded-lg hover:bg-muted transition-colors text-left outline-none">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <User className="w-3.5 h-3.5 text-primary" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-medium text-foreground truncate">
                  {user?.email?.split("@")[0] || "Invité"}
                </span>
                <span className="text-[10px] text-muted-foreground truncate opacity-70">
                  {user?.email || "Chargement..."}
                </span>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          </DropdownMenuTrigger>
          
          <DropdownMenuContent className="w-56" side="right" align="end" sideOffset={12}>
            <DropdownMenuPage id="main">
              <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="w-4 h-4" />
                <span>Profil</span>
              </DropdownMenuItem>
              <DropdownMenuPageTrigger targetId="settings">
                <Settings className="w-4 h-4" />
                <span>Paramètres</span>
              </DropdownMenuPageTrigger>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
                <LogOut className="w-4 h-4" />
                <span>Se déconnecter</span>
              </DropdownMenuItem>
            </DropdownMenuPage>

            <DropdownMenuPage id="settings">
              <DropdownMenuLabel>Paramètres</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuPageTrigger targetId="appearance">
                <Sun className="w-4 h-4" />
                <span>Apparence</span>
              </DropdownMenuPageTrigger>
              <DropdownMenuItem>
                <Globe className="w-4 h-4" />
                <span>Langue</span>
              </DropdownMenuItem>
            </DropdownMenuPage>

            <DropdownMenuPage id="appearance">
              <DropdownMenuLabel>Apparence</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Sun className="w-4 h-4" />
                <span>Clair</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Moon className="w-4 h-4" />
                <span>Sombre</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LayoutDashboard className="w-4 h-4" />
                <span>Système</span>
              </DropdownMenuItem>
            </DropdownMenuPage>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
