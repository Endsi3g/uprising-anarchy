"use client";

import { Bell, Settings, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface HeaderProps {
  greeting?: string;
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Bonjour";
  if (hour < 18) return "Bon après-midi";
  return "Bonsoir";
}

export function Header({ greeting }: HeaderProps) {
  const now = new Date();
  const dateStr = now.toLocaleDateString("fr-CA", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <header className="h-12 border-b border-border bg-background flex items-center px-4 gap-4 sticky top-0 z-10">
      <div className="flex-1">
        <span className="text-sm font-medium text-foreground">
          {greeting ?? getGreeting()}, Uprising
        </span>
        <span className="text-sm text-muted-foreground ml-2 capitalize">{dateStr}</span>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="w-8 h-8">
          <Plus className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" className="w-8 h-8">
          <Bell className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" className="w-8 h-8">
          <Settings className="w-4 h-4" />
        </Button>
        <Avatar className="w-7 h-7">
          <AvatarFallback className="text-xs bg-primary text-primary-foreground">U</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
