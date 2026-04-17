"use client";

import * as React from "react";
import {
  Users,
  Map,
  Search,
  MapPin,
  UserCheck,
  Mail,
  Bot,
  Settings,
  LogOut,
  User,
  LayoutDashboard,
  ChevronRight,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UprisingMascot } from "@/components/ui/uprising-mascot";
import { createClient } from "@/lib/supabase/client";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const data = {
  navMain: [
    {
      title: "PROSPECTION",
      items: [
        { title: "Tableau de bord", url: "/", icon: LayoutDashboard },
        { title: "Prospects", url: "/prospection", icon: Users },
        { title: "Carte", url: "/prospection/carte", icon: Map },
        { title: "Scraper", url: "/prospection/scraper", icon: Search },
        { title: "Zones", url: "/prospection/territoires", icon: MapPin },
      ],
    },
    {
      title: "AGENCE",
      items: [
        { title: "Clients", url: "/clients", icon: UserCheck },
        { title: "Campagnes", url: "/campagnes", icon: Mail },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = React.useState<any>(null);
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
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
    <Sidebar variant="inset" className="border-r border-white/5 bg-black" {...props}>
      <SidebarHeader className="h-14 border-b border-white/5 px-6 flex items-center">
        <div className="flex items-center gap-3">
          <UprisingMascot size={24} className="text-white" />
          <span className="font-bold text-sm tracking-tight text-white/90">UPRISING</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-3 py-6">
        {data.navMain.map((group) => (
          <SidebarGroup key={group.title} className="mb-6">
            <SidebarGroupLabel className="px-3 text-[10px] font-bold tracking-[0.2em] text-white/30 uppercase mb-2">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        className={cn(
                          "h-9 px-3 transition-all duration-200 group/btn",
                          isActive 
                            ? "bg-white/10 text-white font-semibold" 
                            : "text-white/50 hover:text-white hover:bg-white/5"
                        )}
                      >
                        <a href={item.url} className="flex items-center gap-3">
                          <item.icon className={cn("w-4 h-4", isActive ? "text-white" : "text-white/40 group-hover/btn:text-white/70")} />
                          <span className="text-xs">{item.title}</span>
                          {isActive && (
                            <div className="ml-auto w-1 h-1 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                          )}
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-white/5">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="w-full justify-start gap-3 px-3 hover:bg-white/5 transition-colors"
              />
            }
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10">
              <User className="h-4 w-4 text-white/70" />
            </div>
            <div className="flex flex-col items-start min-w-0">
              <span className="text-xs font-semibold text-white/90 truncate w-full leading-tight">
                {user?.email?.split("@")[0] || "Compte"}
              </span>
              <span className="text-[10px] text-white/40 truncate w-full">
                {user?.email || "Chargement..."}
              </span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="right"
            align="end"
            sideOffset={12}
            className="w-56 bg-black border-white/10 text-white"
          >
            <DropdownMenuLabel className="text-xs font-bold text-white/50 px-3 py-2">MON COMPTE</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/5" />
            <DropdownMenuItem className="focus:bg-white/10 focus:text-white cursor-pointer px-3 py-2 text-xs">
              <User className="mr-2 h-4 w-4" />
              Profil
            </DropdownMenuItem>
            <DropdownMenuItem className="focus:bg-white/10 focus:text-white cursor-pointer px-3 py-2 text-xs">
              <Settings className="mr-2 h-4 w-4" />
              Paramètres
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/5" />
            <DropdownMenuItem 
              onClick={handleSignOut}
              className="text-red-400 focus:bg-red-500/10 focus:text-red-400 cursor-pointer px-3 py-2 text-xs"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Se déconnecter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
