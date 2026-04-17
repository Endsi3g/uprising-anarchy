"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { StatusBadge, type ProspectStatus } from "./status-badge";
import { ScanSearch, Eye, Search } from "lucide-react";

export interface Prospect {
  id: string;
  nom: string;
  ville: string;
  categorie: string;
  source: string;
  statut: ProspectStatus;
  score: number;
  date: string;
  telephone?: string;
  email?: string;
  notes?: string;
}

const MOCK_PROSPECTS: Prospect[] = [
  {
    id: "1",
    nom: "Resto Chez Marie",
    ville: "Montréal",
    categorie: "Restaurant",
    source: "Pages Jaunes",
    statut: "nouveau",
    score: 82,
    date: "2026-04-10",
    telephone: "514-555-0101",
    email: "contact@chezmarie.ca",
    notes: "Restaurant franco-québécois, 3 succursales.",
  },
  {
    id: "2",
    nom: "Plomberie Landry Inc.",
    ville: "Québec",
    categorie: "Plomberie",
    source: "Pages Vertes",
    statut: "contacte",
    score: 67,
    date: "2026-04-08",
    telephone: "418-555-0234",
    email: "info@plomberielandry.qc",
    notes: "Propriétaire ouvert à une refonte de site.",
  },
  {
    id: "3",
    nom: "Électro Bouchard",
    ville: "Laval",
    categorie: "Électricité",
    source: "Google Maps",
    statut: "interesse",
    score: 91,
    date: "2026-04-06",
    telephone: "450-555-0312",
    email: "electrobouchard@gmail.com",
    notes: "Intéressé par SEO local et refonte.",
  },
  {
    id: "4",
    nom: "Clinique Beauté Nathalie",
    ville: "Longueuil",
    categorie: "Beauté & Spa",
    source: "Pages Jaunes",
    statut: "client",
    score: 95,
    date: "2026-03-28",
    telephone: "450-555-0445",
    email: "nathalie@cliniquebeaute.ca",
    notes: "Contrat signé, démarrage mai 2026.",
  },
  {
    id: "5",
    nom: "Garage Tremblay Auto",
    ville: "Sherbrooke",
    categorie: "Automobile",
    source: "Google Maps",
    statut: "perdu",
    score: 34,
    date: "2026-03-20",
    telephone: "819-555-0567",
    email: "tremblay.auto@videotron.ca",
    notes: "Budget trop limité pour l'instant.",
  },
];

const STATUT_OPTIONS = ["tous", "nouveau", "contacte", "interesse", "client", "perdu"];
const SOURCE_OPTIONS = ["toutes", "Pages Jaunes", "Pages Vertes", "Google Maps"];

export function ProspectTable({ prospects = MOCK_PROSPECTS }: { prospects?: Prospect[] }) {
  const [search, setSearch] = useState("");
  const [statutFilter, setStatutFilter] = useState("tous");
  const [sourceFilter, setSourceFilter] = useState("toutes");
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null);

  const filtered = prospects.filter((p) => {
    const matchSearch =
      search === "" ||
      p.nom.toLowerCase().includes(search.toLowerCase()) ||
      p.ville.toLowerCase().includes(search.toLowerCase()) ||
      p.categorie.toLowerCase().includes(search.toLowerCase());
    const matchStatut = statutFilter === "tous" || p.statut === statutFilter;
    const matchSource = sourceFilter === "toutes" || p.source === sourceFilter;
    return matchSearch && matchStatut && matchSource;
  });

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-6 px-4">
        <div className="relative group flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30 group-focus-within:text-white transition-colors" />
          <Input
            placeholder="Rechercher un prospect…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-white/[0.03] border-white/10 text-white placeholder:text-white/20 h-9 rounded-lg focus-visible:ring-1 focus-visible:ring-white/20"
          />
        </div>
        <Select value={statutFilter} onValueChange={(v) => { if (v) setStatutFilter(v); }}>
          <SelectTrigger className="w-36 bg-white/[0.03] border-white/10 text-white/70 h-9 rounded-lg">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent className="bg-black border-white/10">
            {STATUT_OPTIONS.map((s) => (
              <SelectItem key={s} value={s} className="text-white/70 focus:bg-white/10 focus:text-white">
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sourceFilter} onValueChange={(v) => { if (v) setSourceFilter(v); }}>
          <SelectTrigger className="w-40 bg-white/[0.03] border-white/10 text-white/70 h-9 rounded-lg">
            <SelectValue placeholder="Source" />
          </SelectTrigger>
          <SelectContent className="bg-black border-white/10">
            {SOURCE_OPTIONS.map((s) => (
              <SelectItem key={s} value={s} className="text-white/70 focus:bg-white/10 focus:text-white">
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="overflow-hidden">
        <Table>
          <TableHeader className="bg-white/[0.02] border-y border-white/[0.05]">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="text-[10px] font-bold text-white/30 uppercase tracking-[0.15em] h-10">Nom</TableHead>
              <TableHead className="text-[10px] font-bold text-white/30 uppercase tracking-[0.15em] h-10">Ville</TableHead>
              <TableHead className="text-[10px] font-bold text-white/30 uppercase tracking-[0.15em] h-10">Catégorie</TableHead>
              <TableHead className="text-[10px] font-bold text-white/30 uppercase tracking-[0.15em] h-10">Source</TableHead>
              <TableHead className="text-[10px] font-bold text-white/30 uppercase tracking-[0.15em] h-10">Statut</TableHead>
              <TableHead className="text-[10px] font-bold text-white/30 uppercase tracking-[0.15em] h-10">Score</TableHead>
              <TableHead className="text-[10px] font-bold text-white/30 uppercase tracking-[0.15em] h-10">Date</TableHead>
              <TableHead className="text-right text-[10px] font-bold text-white/30 uppercase tracking-[0.15em] h-10">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={8} className="text-center text-white/20 py-12 text-xs font-medium uppercase tracking-widest">
                  Aucun prospect trouvé.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((prospect) => (
                <TableRow key={prospect.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors group cursor-pointer" onClick={() => setSelectedProspect(prospect)}>
                  <TableCell className="font-semibold text-white/90 text-sm py-4">{prospect.nom}</TableCell>
                  <TableCell className="text-white/50 text-xs">{prospect.ville}</TableCell>
                  <TableCell className="text-white/50 text-xs">{prospect.categorie}</TableCell>
                  <TableCell className="text-white/30 text-[11px] font-medium">{prospect.source}</TableCell>
                  <TableCell>
                    <StatusBadge status={prospect.statut} className="text-[10px] h-5 px-1.5" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                       <div className="w-12 h-1 bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className={cn(
                              "h-full rounded-full transition-all duration-1000",
                              prospect.score >= 80 ? "bg-white" : prospect.score >= 60 ? "bg-white/60" : "bg-white/20"
                            )}
                            style={{ width: `${prospect.score}%` }}
                          />
                       </div>
                       <span className="text-[11px] font-bold text-white/60">{prospect.score}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-white/30 text-[11px] font-medium">
                    {new Date(prospect.date).toLocaleDateString("fr-CA", { month: 'short', day: 'numeric', year: 'numeric' })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-white/20 group-hover:text-white transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProspect(prospect);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Detail Sheet */}
      <Sheet open={selectedProspect !== null} onOpenChange={(open) => !open && setSelectedProspect(null)}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>{selectedProspect?.nom}</SheetTitle>
            <SheetDescription>{selectedProspect?.categorie} — {selectedProspect?.ville}</SheetDescription>
          </SheetHeader>
          {selectedProspect && (
            <div className="px-4 py-2 flex flex-col gap-3 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground w-24">Statut</span>
                <StatusBadge status={selectedProspect.statut} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground w-24">Score</span>
                <span className="font-semibold">{selectedProspect.score}/100</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground w-24">Source</span>
                <span>{selectedProspect.source}</span>
              </div>
              {selectedProspect.telephone && (
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground w-24">Téléphone</span>
                  <span>{selectedProspect.telephone}</span>
                </div>
              )}
              {selectedProspect.email && (
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground w-24">Email</span>
                  <span className="truncate">{selectedProspect.email}</span>
                </div>
              )}
              {selectedProspect.notes && (
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground">Notes</span>
                  <p className="rounded-lg bg-muted/50 p-3 text-sm leading-relaxed">
                    {selectedProspect.notes}
                  </p>
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
