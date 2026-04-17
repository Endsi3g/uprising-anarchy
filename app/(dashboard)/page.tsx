import { Users, UserCheck, TrendingUp, DollarSign, ArrowUpRight, Search, Plus, Calendar, Mail, MapPin, Bot } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

const stats = [
  { label: "Prospects Totaux", value: "2,840", change: "+12% vs last month", icon: Users, trend: "up" },
  { label: "Contactés", value: "1,120", change: "+5.4% vs last month", icon: TrendingUp, trend: "up" },
  { label: "Clients Actifs", value: "48", change: "+2 this week", icon: UserCheck, trend: "up" },
  { label: "Pipeline CA", value: "$124,500", change: "9 pending deals", icon: DollarSign, trend: "up" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-white">Tableau de Bord</h1>
          <p className="text-sm text-white/40 font-medium">
            Bienvenue chez Uprising. Voici un aperçu de vos performances actuelles.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white h-10 px-4 transition-all">
            <Calendar className="w-4 h-4 mr-2 opacity-50" />
            30 derniers jours
          </Button>
          <Link href="/prospection/scraper">
            <Button className="bg-white text-black hover:bg-white/90 h-10 px-4 font-semibold transition-all">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Scraping
            </Button>
          </Link>
        </div>
      </div>

      {/* Modern Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="bg-white/[0.03] border-white/[0.08] p-5 shadow-2xl relative overflow-hidden group hover:bg-white/[0.05] transition-all duration-300">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                  <Icon className="w-4 h-4 text-white/60" />
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-white/30 uppercase tracking-widest">
                  Live <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.15em]">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-2xl font-bold tracking-tighter text-white">{stat.value}</h2>
                </div>
                <p className="text-[11px] font-medium text-white/40 flex items-center gap-1">
                  <span className="text-green-400 font-bold">{stat.change.split(' ')[0]}</span>
                  {stat.change.split(' ').slice(1).join(' ')}
                </p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Main Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <Card className="lg:col-span-2 bg-white/[0.02] border-white/[0.06] p-0 overflow-hidden shadow-2xl">
          <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-xs font-bold tracking-[0.2em] text-white/30 uppercase">ACTIVITÉ RÉCENTE</h3>
            <Button variant="ghost" className="text-[10px] h-7 px-2 text-white/40 hover:text-white uppercase font-bold tracking-widest">Voir tout</Button>
          </div>
          <div className="p-0">
            <div className="divide-y divide-white/5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 px-6 py-5 hover:bg-white/[0.02] transition-colors group cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-colors">
                    <Search className="w-4 h-4 text-white/50" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white/90">Extraction terminée : "Restaurants MTL"</p>
                    <p className="text-xs text-white/30">Il y a 2 heures • 142 nouveaux prospects trouvés</p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-white/20 group-hover:text-white transition-colors" />
                </div>
              ))}
            </div>
            <div className="p-8 text-center bg-black/20">
              <Link href="/prospection/scraper">
                <Button variant="outline" className="border-white/10 bg-white/5 text-white/60 hover:text-white hover:bg-white/10">
                  Charger plus d'activités
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        {/* Quick Insights / Action Sidebar */}
        <div className="space-y-6">
          <Card className="bg-white/[0.02] border-white/[0.06] p-6 shadow-2xl">
            <h3 className="text-xs font-bold tracking-[0.2em] text-white/30 uppercase mb-6">ACTIONS RAPIDES</h3>
            <div className="space-y-3">
              <Button className="w-full justify-start gap-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white/90 h-11 px-4 text-xs font-medium">
                <Mail className="w-4 h-4 text-white/40" />
                Lancer une campagne
              </Button>
              <Button className="w-full justify-start gap-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white/90 h-11 px-4 text-xs font-medium">
                <MapPin className="w-4 h-4 text-white/40" />
                Explorer les zones
              </Button>
              <Button className="w-full justify-start gap-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white/90 h-11 px-4 text-xs font-medium">
                <Bot className="w-4 h-4 text-white/40" />
                Demander à l'Assistant IA
              </Button>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-white/10 to-transparent border-white/10 p-6 relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-xl">
                <TrendingUp className="w-6 h-6 text-black" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Prêt pour l'échelle ?</h4>
                <p className="text-xs text-white/60 leading-relaxed mt-1">
                  Vos taux de conversion sont 14% au-dessus de la moyenne. Activez l'automatisation avancée pour gagner du temps.
                </p>
              </div>
              <Button className="w-full bg-white text-black hover:bg-white/90 h-9 text-xs font-bold">
                Optimiser maintenant
              </Button>
            </div>
            {/* Background Decoration */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/5 blur-3xl rounded-full" />
          </Card>
        </div>
      </div>
    </div>
  );
}
