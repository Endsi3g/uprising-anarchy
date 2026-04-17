"use client";

import { X, TrendingUp, CheckCircle2, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PanelCard {
  id: string;
  type: "stat" | "task" | "ai" | "promo";
  title: string;
  content?: string;
  value?: string;
  accent?: "blue" | "violet" | "green";
  dismissible?: boolean;
}

interface RightPanelProps {
  cards?: PanelCard[];
}

const defaultCards: PanelCard[] = [
  {
    id: "stats",
    type: "promo",
    title: "Commencez à prospecter",
    content: "Scrapez vos premiers prospects depuis Pages Jaunes ou Google Maps.",
    accent: "blue",
    dismissible: false,
  },
  {
    id: "ai-recap",
    type: "ai",
    title: "Résumé IA",
    content: "Aucune activité récente. Lancez un scraping pour commencer.",
    dismissible: true,
  },
];

export function RightPanel({ cards = defaultCards }: RightPanelProps) {
  return (
    <aside className="w-[280px] shrink-0 border-l border-border bg-sidebar p-3 space-y-2 h-screen sticky top-0 overflow-y-auto">
      {cards.map((card) => (
        <PanelCardItem key={card.id} card={card} />
      ))}
    </aside>
  );
}

function PanelCardItem({ card }: { card: PanelCard }) {
  const accentClasses = {
    blue: "bg-primary text-primary-foreground",
    violet: "bg-secondary text-secondary-foreground",
    green: "bg-green-800 text-white",
  };

  if (card.type === "promo" && card.accent) {
    return (
      <div className={cn("rounded-lg p-3 relative", accentClasses[card.accent])}>
        {card.dismissible && (
          <Button variant="ghost" size="icon" className="absolute top-1 right-1 w-6 h-6 opacity-70 hover:opacity-100">
            <X className="w-3 h-3" />
          </Button>
        )}
        <p className="text-[10px] font-semibold uppercase tracking-wider opacity-70 mb-1">
          DÉMARRAGE
        </p>
        <p className="text-sm font-semibold leading-tight">{card.title}</p>
        {card.content && (
          <p className="text-xs opacity-80 mt-1 leading-snug">{card.content}</p>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card p-3 relative">
      {card.dismissible && (
        <Button variant="ghost" size="icon" className="absolute top-1 right-1 w-6 h-6 text-muted-foreground hover:text-foreground">
          <X className="w-3 h-3" />
        </Button>
      )}
      <div className="flex items-center gap-1.5 mb-1">
        {card.type === "ai" && <Bot className="w-3 h-3 text-secondary" />}
        {card.type === "stat" && <TrendingUp className="w-3 h-3 text-primary" />}
        {card.type === "task" && <CheckCircle2 className="w-3 h-3 text-green-600" />}
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {card.type === "ai" ? "RÉSUMÉ IA" : card.type === "stat" ? "STATISTIQUES" : "TÂCHES"}
        </p>
      </div>
      <p className="text-sm font-medium text-foreground">{card.title}</p>
      {card.content && (
        <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{card.content}</p>
      )}
      {card.value && (
        <p className="text-2xl font-bold text-foreground mt-1">{card.value}</p>
      )}
    </div>
  );
}
