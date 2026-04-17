"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Plus, Send, TrendingUp } from "lucide-react";

type CampagneStatus = "active" | "terminee" | "brouillon" | "en-pause";

interface Campagne {
  id: string;
  nom: string;
  description: string;
  statut: CampagneStatus;
  nbProspects: number;
  envoyes: number;
  repondus: number;
  dateDebut: string;
  dateFin?: string;
}

const STATUS_CONFIG: Record<CampagneStatus, { label: string; className: string }> = {
  active: { label: "Active", className: "bg-[#264DEB]/10 text-[#264DEB] border-[#264DEB]/20" },
  terminee: { label: "Terminée", className: "bg-green-600/10 text-green-600 border-green-600/20" },
  brouillon: { label: "Brouillon", className: "bg-muted text-muted-foreground border-border" },
  "en-pause": { label: "En pause", className: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
};

const INITIAL_CAMPAGNES: Campagne[] = [
  {
    id: "camp1",
    nom: "Restaurants Montréal — Printemps 2026",
    description: "Outreach email ciblant les restaurants de Montréal sans site web moderne.",
    statut: "active",
    nbProspects: 120,
    envoyes: 87,
    repondus: 14,
    dateDebut: "2026-04-01",
  },
  {
    id: "camp2",
    nom: "Plombiers & Électriciens Rive-Sud",
    description: "Campagne SMS + email pour les corps de métier de la Rive-Sud.",
    statut: "en-pause",
    nbProspects: 65,
    envoyes: 40,
    repondus: 5,
    dateDebut: "2026-03-15",
  },
  {
    id: "camp3",
    nom: "Salons de coiffure Québec",
    description: "Prospection LinkedIn + email pour les salons à Québec et Lévis.",
    statut: "terminee",
    nbProspects: 80,
    envoyes: 80,
    repondus: 22,
    dateDebut: "2026-02-01",
    dateFin: "2026-03-31",
  },
  {
    id: "camp4",
    nom: "Cliniques santé — Laurentides",
    description: "Campagne de prospection pour les cliniques privées dans les Laurentides.",
    statut: "brouillon",
    nbProspects: 45,
    envoyes: 0,
    repondus: 0,
    dateDebut: "2026-04-20",
  },
];

function tauxReponse(envoyes: number, repondus: number) {
  if (envoyes === 0) return "—";
  return `${Math.round((repondus / envoyes) * 100)} %`;
}

export default function CampagnesPage() {
  const [campagnes, setCampagnes] = useState<Campagne[]>(INITIAL_CAMPAGNES);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = () => {
    if (!nom.trim()) return;
    const newCamp: Campagne = {
      id: `camp${Date.now()}`,
      nom: nom.trim(),
      description: description.trim(),
      statut: "brouillon",
      nbProspects: 0,
      envoyes: 0,
      repondus: 0,
      dateDebut: new Date().toISOString().split("T")[0],
    };
    setCampagnes((prev) => [newCamp, ...prev]);
    setNom("");
    setDescription("");
    setDialogOpen(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-white">Campagnes Outreach</h1>
          <p className="text-sm text-white/40 font-medium leading-relaxed">Automatisez votre prospection à grande échelle avec des séquences IA.</p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="bg-white text-black hover:bg-white/90 h-10 px-6 font-bold text-xs uppercase tracking-widest shrink-0 shadow-2xl">
          <Plus className="mr-2 w-4 h-4" />
          Nouvelle campagne
        </Button>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            label: "CAMPAGNES ACTIVES",
            value: campagnes.filter((c) => c.statut === "active").length,
            icon: Send,
          },
          {
            label: "PROSPECTS CIBLÉS",
            value: campagnes.reduce((s, c) => s + c.nbProspects, 0).toLocaleString(),
            icon: TrendingUp,
          },
          {
            label: "TAUX DE RÉPONSE MOYEN",
            value: (() => {
              const totalEnv = campagnes.reduce((s, c) => s + c.envoyes, 0);
              const totalRep = campagnes.reduce((s, c) => s + c.repondus, 0);
              return totalEnv === 0 ? "—" : `${Math.round((totalRep / totalEnv) * 100)}%`;
            })(),
            icon: TrendingUp,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6 flex flex-col gap-4 relative overflow-hidden group hover:border-white/10 transition-colors"
          >
            <div className="flex items-center justify-between relative z-10">
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">{stat.label}</p>
                <stat.icon className="w-4 h-4 text-white/10" />
            </div>
            <div className="text-4xl font-bold tracking-tighter text-white tabular-nums relative z-10">{stat.value}</div>
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/[0.01] rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
          </div>
        ))}
      </div>

      {/* Campagne list */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden shadow-2xl">
         <div className="px-6 py-4 border-b border-white/[0.05] bg-white/[0.02]">
            <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">LISTE DES CAMPAGNES</h3>
         </div>
         <div className="flex flex-col">
            {campagnes.map((camp, idx) => {
              const statusConf = STATUS_CONFIG[camp.statut];
              const responseRate = tauxReponse(camp.envoyes, camp.repondus);
              return (
                <div
                  key={camp.id}
                  className={cn(
                    "p-6 flex flex-col gap-6 lg:flex-row lg:items-center transition-all duration-300 group hover:bg-white/[0.02]",
                    idx !== campagnes.length - 1 && "border-b border-white/[0.03]"
                  )}
                >
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <h4 className="text-base font-bold text-white leading-none tracking-tight">{camp.nom}</h4>
                      <div className={cn("px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest border", statusConf.className.replace('bg-[#264DEB]/10 text-[#264DEB] border-[#264DEB]/20', 'bg-white/10 text-white border-white/20 bg-muted text-muted-foreground border-border bg-amber-500/10 text-amber-500 border-amber-500/20 bg-green-500/10 text-green-500 border-green-500/20').replace('bg-muted text-muted-foreground border-border', 'bg-white/5 text-white/30 border-white/10'))}>
                        {statusConf.label}
                      </div>
                    </div>
                    {camp.description && (
                      <p className="text-sm text-white/40 font-medium leading-relaxed max-w-xl">
                        {camp.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-[10px] font-bold text-white/20 uppercase tracking-widest">
                       <span>START — {new Date(camp.dateDebut).toLocaleDateString("fr-CA")}</span>
                       {camp.dateFin && <span>END — {new Date(camp.dateFin).toLocaleDateString("fr-CA")}</span>}
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 shrink-0">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Prospects</p>
                      <p className="text-xl font-bold tracking-tight text-white/90 tabular-nums">{camp.nbProspects}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Envoyés</p>
                      <p className="text-xl font-bold tracking-tight text-white/90 tabular-nums">{camp.envoyes}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Réponses</p>
                      <p className="text-xl font-bold tracking-tight text-white/90 tabular-nums">{camp.repondus}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Taux</p>
                      <p className="text-xl font-extrabold tracking-tighter text-white tabular-nums">{responseRate}</p>
                    </div>
                  </div>
                </div>
              );
            })}
         </div>
      </div>

      {/* Create dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#0A0A0A] border-white/10 shadow-2xl max-w-lg p-0 overflow-hidden">
          <DialogHeader className="p-8 pb-0">
            <DialogTitle className="text-2xl font-bold tracking-tight text-white">Initialiser une Campagne</DialogTitle>
             <p className="text-sm text-white/40 mt-1">Configurez les bases de votre nouvelle séquence automatisée.</p>
          </DialogHeader>
          <div className="px-8 py-8 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="camp-nom" className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">NOM DE LA CAMPAGNE</Label>
              <Input
                id="camp-nom"
                placeholder="ex: Restaurants Montréal — Été 2026"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                className="bg-white/[0.02] border-white/10 h-12 text-white placeholder:text-white/10 rounded-xl focus-visible:ring-1 focus-visible:ring-white/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="camp-desc" className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">CIBLE & OBJECTIFS</Label>
              <Textarea
                id="camp-desc"
                placeholder="Décrivez précisément votre audience..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="bg-white/[0.02] border-white/10 text-white placeholder:text-white/10 rounded-xl focus-visible:ring-1 focus-visible:ring-white/20"
              />
            </div>
          </div>
          <DialogFooter className="p-8 bg-white/[0.02] border-t border-white/[0.05]">
            <Button variant="ghost" onClick={() => setDialogOpen(false)} className="text-white/30 hover:text-white uppercase text-[10px] font-bold tracking-widest">
              Annuler
            </Button>
            <Button onClick={handleCreate} disabled={!nom.trim()} className="bg-white text-black hover:bg-white/90 font-bold h-12 px-10 rounded-xl shrink-0">
              Lancer le setup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
