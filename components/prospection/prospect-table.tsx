"use client";

import { useState } from "react";
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
import { ScanSearch, Eye } from "lucide-react";

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
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Input
          placeholder="Rechercher un prospect…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <Select value={statutFilter} onValueChange={(v) => { if (v) setStatutFilter(v); }}>
          <SelectTrigger size="default" className="w-36">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            {STATUT_OPTIONS.map((s) => (
              <SelectItem key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sourceFilter} onValueChange={(v) => { if (v) setSourceFilter(v); }}>
          <SelectTrigger size="default" className="w-40">
            <SelectValue placeholder="Source" />
          </SelectTrigger>
          <SelectContent>
            {SOURCE_OPTIONS.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="ml-auto">
          <Link href="/prospection/scraper">
            <Button>
              <ScanSearch className="mr-1.5 w-4 h-4" />
              Nouveau scraping
            </Button>
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl ring-1 ring-foreground/10 overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Ville</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                  Aucun prospect trouvé.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((prospect) => (
                <TableRow key={prospect.id}>
                  <TableCell className="font-medium">{prospect.nom}</TableCell>
                  <TableCell>{prospect.ville}</TableCell>
                  <TableCell>{prospect.categorie}</TableCell>
                  <TableCell className="text-muted-foreground">{prospect.source}</TableCell>
                  <TableCell>
                    <StatusBadge status={prospect.statut} />
                  </TableCell>
                  <TableCell>
                    <span
                      className={
                        prospect.score >= 80
                          ? "text-green-600 font-semibold"
                          : prospect.score >= 60
                          ? "text-amber-600 font-semibold"
                          : "text-red-600 font-semibold"
                      }
                    >
                      {prospect.score}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(prospect.date).toLocaleDateString("fr-CA")}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setSelectedProspect(prospect)}
                      title="Voir détail"
                    >
                      <Eye />
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
