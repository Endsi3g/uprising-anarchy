import { Users, UserCheck, TrendingUp, DollarSign, ArrowUpRight, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const stats = [
  { label: "Prospects Totaux", value: "0", change: "+0 ce mois", icon: Users, color: "text-primary" },
  { label: "Contactés", value: "0", change: "+0 cette semaine", icon: TrendingUp, color: "text-secondary" },
  { label: "Clients actifs", value: "0", change: "0 en cours", icon: UserCheck, color: "text-green-600" },
  { label: "Pipeline (CA)", value: "0 $", change: "0 devis", icon: DollarSign, color: "text-orange-500" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="p-4 border-border shadow-none">
              <div className="flex items-start justify-between mb-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{stat.label}</p>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.change}</p>
            </Card>
          );
        })}
      </div>

      {/* Quick actions */}
      <div className="flex gap-2">
        <Link href="/prospection/scraper">
          <Button size="sm" className="gap-1.5">
            <Search className="w-3.5 h-3.5" />
            Nouveau scraping
          </Button>
        </Link>
        <Link href="/prospection/carte">
          <Button size="sm" variant="outline" className="gap-1.5">
            Voir la carte
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>

      {/* Recent prospects placeholder */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
          DERNIERS PROSPECTS
        </h2>
        <Card className="border-border shadow-none">
          <div className="p-8 text-center">
            <Users className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm font-medium text-foreground">Aucun prospect encore</p>
            <p className="text-xs text-muted-foreground mt-1 mb-3">
              Lancez un scraping pour importer vos premiers prospects
            </p>
            <Link href="/prospection/scraper">
              <Button size="sm" variant="outline">Commencer le scraping</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
