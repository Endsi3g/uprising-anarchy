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
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-lg font-semibold">Campagnes</h1>
          <p className="text-sm text-muted-foreground">Gérez vos campagnes outreach</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-1.5" />
          Nouvelle campagne
        </Button>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          {
            label: "Campagnes actives",
            value: campagnes.filter((c) => c.statut === "active").length,
            icon: Send,
            color: "text-[#264DEB]",
          },
          {
            label: "Total prospects ciblés",
            value: campagnes.reduce((s, c) => s + c.nbProspects, 0),
            icon: TrendingUp,
            color: "text-[#6C3AED]",
          },
          {
            label: "Taux moyen réponse",
            value: (() => {
              const totalEnv = campagnes.reduce((s, c) => s + c.envoyes, 0);
              const totalRep = campagnes.reduce((s, c) => s + c.repondus, 0);
              return totalEnv === 0 ? "—" : `${Math.round((totalRep / totalEnv) * 100)} %`;
            })(),
            icon: TrendingUp,
            color: "text-green-600",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl bg-card ring-1 ring-foreground/10 p-4 flex items-center gap-3"
          >
            <div className={cn("w-9 h-9 rounded-lg bg-muted/50 flex items-center justify-center", stat.color)}>
              <stat.icon className="w-4 h-4" />
            </div>
            <div>
              <div className="text-lg font-semibold leading-none">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Campagne list */}
      <div className="flex flex-col gap-3">
        {campagnes.map((camp) => {
          const statusConf = STATUS_CONFIG[camp.statut];
          return (
            <div
              key={camp.id}
              className="rounded-xl bg-card ring-1 ring-foreground/10 p-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold">{camp.nom}</span>
                  <Badge className={cn("border", statusConf.className)}>{statusConf.label}</Badge>
                </div>
                {camp.description && (
                  <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-sm">
                    {camp.description}
                  </p>
                )}
                <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                  <span>Débute {new Date(camp.dateDebut).toLocaleDateString("fr-CA")}</span>
                  {camp.dateFin && <span>→ {new Date(camp.dateFin).toLocaleDateString("fr-CA")}</span>}
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 shrink-0">
                <div className="text-center">
                  <div className="text-sm font-semibold">{camp.nbProspects}</div>
                  <div className="text-xs text-muted-foreground">Prospects</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-semibold">{camp.envoyes}</div>
                  <div className="text-xs text-muted-foreground">Envoyés</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-semibold">{camp.repondus}</div>
                  <div className="text-xs text-muted-foreground">Réponses</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-semibold text-[#264DEB]">
                    {tauxReponse(camp.envoyes, camp.repondus)}
                  </div>
                  <div className="text-xs text-muted-foreground">Taux</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouvelle campagne</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="camp-nom">Nom de la campagne</Label>
              <Input
                id="camp-nom"
                placeholder="ex: Restaurants Montréal — Été 2026"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="camp-desc">Description</Label>
              <Textarea
                id="camp-desc"
                placeholder="Décrivez la cible et l'objectif de la campagne…"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleCreate} disabled={!nom.trim()}>
              Créer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
