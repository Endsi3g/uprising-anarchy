"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { CheckCircle, MapPin, Leaf, Map } from "lucide-react";

type Source = "pages-jaunes" | "pages-vertes" | "google-maps";

interface ScrapedResult {
  nom: string;
  ville: string;
  telephone: string;
  categorie: string;
}

const STEPS = ["Source", "Paramètres", "Scraping", "Import"];

const SOURCES: { id: Source; label: string; description: string; icon: React.ComponentType<{ className?: string }> }[] = [
  {
    id: "pages-jaunes",
    label: "Pages Jaunes",
    description: "Annuaire commercial canadien",
    icon: ({ className }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
      </svg>
    ),
  },
  {
    id: "pages-vertes",
    label: "Pages Vertes",
    description: "Répertoire éco-responsable",
    icon: Leaf,
  },
  {
    id: "google-maps",
    label: "Google Maps",
    description: "Commerces locaux géolocalisés",
    icon: MapPin,
  },
];

export default function ScraperPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [source, setSource] = useState<Source | null>(null);
  const [keyword, setKeyword] = useState("");
  const [ville, setVille] = useState("");
  const [limit, setLimit] = useState(30);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ScrapedResult[]>([]);
  const [imported, setImported] = useState(false);

  const handleScrape = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/scrape/${source}?keyword=${encodeURIComponent(keyword)}&ville=${encodeURIComponent(ville)}&limit=${limit}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.results ?? []);
      } else {
        // Mock results for demo
        setResults(
          Array.from({ length: Math.min(limit, 8) }, (_, i) => ({
            nom: `Entreprise ${keyword} ${i + 1}`,
            ville,
            telephone: `514-555-0${100 + i}`,
            categorie: keyword || "Commerce",
          }))
        );
      }
    } catch {
      // Use mock data on error
      setResults(
        Array.from({ length: Math.min(limit, 8) }, (_, i) => ({
          nom: `${keyword} Pro ${i + 1}`,
          ville,
          telephone: `514-555-0${100 + i}`,
          categorie: keyword || "Commerce",
        }))
      );
    } finally {
      setLoading(false);
      setStep(3);
    }
  };

  const handleImport = async () => {
    setLoading(true);
    try {
      await fetch("/api/prospects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prospects: results, source }),
      });
    } catch {
      // Silent — mock mode
    } finally {
      setLoading(false);
      setImported(true);
      setStep(4);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-lg font-semibold">Nouveau scraping</h1>
        <p className="text-sm text-muted-foreground">Récoltez des prospects depuis des annuaires en ligne</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center mb-8 px-2">
        {STEPS.map((label, index) => (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-colors",
                  index < step
                    ? "bg-[#264DEB] border-[#264DEB] text-white"
                    : index === step
                    ? "border-[#264DEB] text-[#264DEB] bg-white"
                    : "border-border text-muted-foreground bg-white"
                )}
              >
                {index < step ? <CheckCircle className="w-4 h-4" /> : index + 1}
              </div>
              <span
                className={cn(
                  "text-xs whitespace-nowrap",
                  index === step ? "text-[#264DEB] font-medium" : "text-muted-foreground"
                )}
              >
                {label}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-2 mb-5 transition-colors",
                  index < step ? "bg-[#264DEB]" : "bg-border"
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 0 — Choose source */}
      {step === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Choisir une source</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-3">
            {SOURCES.map((s) => {
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSource(s.id)}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-all hover:border-[#264DEB]/50 hover:bg-[#264DEB]/5",
                    source === s.id
                      ? "border-[#264DEB] bg-[#264DEB]/5"
                      : "border-border"
                  )}
                >
                  <Icon className="w-8 h-8 text-[#264DEB]" />
                  <span className="text-sm font-medium">{s.label}</span>
                  <span className="text-xs text-muted-foreground">{s.description}</span>
                </button>
              );
            })}
          </CardContent>
          <div className="px-4 pb-4 flex justify-end">
            <Button onClick={() => setStep(1)} disabled={!source}>
              Suivant
            </Button>
          </div>
        </Card>
      )}

      {/* Step 1 — Parameters */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Paramètres du scraping</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="keyword">Mot-clé / Catégorie</Label>
              <Input
                id="keyword"
                placeholder="ex: restaurant, plombier, dentiste…"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ville">Ville</Label>
              <Input
                id="ville"
                placeholder="ex: Montréal, Québec, Laval…"
                value={ville}
                onChange={(e) => setVille(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Nombre de résultats : <span className="font-semibold text-[#264DEB]">{limit}</span></Label>
              <input
                type="range"
                min={10}
                max={100}
                step={5}
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="w-full accent-[#264DEB]"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>10</span>
                <span>100</span>
              </div>
            </div>
          </CardContent>
          <div className="px-4 pb-4 flex justify-between">
            <Button variant="outline" onClick={() => setStep(0)}>Retour</Button>
            <Button onClick={() => setStep(2)} disabled={!keyword || !ville}>
              Suivant
            </Button>
          </div>
        </Card>
      )}

      {/* Step 2 — Launch */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Lancer le scraping</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg bg-muted/50 p-4 text-sm space-y-1 mb-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Source</span>
                <span className="font-medium">{SOURCES.find((s) => s.id === source)?.label}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mot-clé</span>
                <span className="font-medium">{keyword}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ville</span>
                <span className="font-medium">{ville}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Limite</span>
                <span className="font-medium">{limit} résultats</span>
              </div>
            </div>
            <Button
              className="w-full"
              onClick={handleScrape}
              disabled={loading}
            >
              {loading ? "Scraping en cours…" : "Lancer le scraping"}
            </Button>
          </CardContent>
          <div className="px-4 pb-4">
            <Button variant="ghost" size="sm" onClick={() => setStep(1)}>
              Retour
            </Button>
          </div>
        </Card>
      )}

      {/* Step 3 — Results preview */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Résultats — {results.length} prospects trouvés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl ring-1 ring-foreground/10 overflow-hidden mb-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Ville</TableHead>
                    <TableHead>Téléphone</TableHead>
                    <TableHead>Catégorie</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((r, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{r.nom}</TableCell>
                      <TableCell>{r.ville}</TableCell>
                      <TableCell className="text-muted-foreground">{r.telephone}</TableCell>
                      <TableCell>{r.categorie}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <Button className="w-full" onClick={handleImport} disabled={loading}>
              {loading ? "Import en cours…" : `Importer ${results.length} prospects`}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 4 — Success */}
      {step === 4 && imported && (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
            <div className="w-16 h-16 rounded-full bg-green-600/10 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold">Import réussi !</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {results.length} prospects ont été ajoutés à votre pipeline.
              </p>
            </div>
            <Button onClick={() => router.push("/prospection")}>
              Voir les prospects
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
