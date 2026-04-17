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
import { CheckCircle, MapPin, Leaf, Map, ChevronRight, Search } from "lucide-react";

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
    // Simulating progress
    await new Promise(r => setTimeout(r, 1500));
    setResults(
      Array.from({ length: 8 }, (_, i) => ({
        nom: `${keyword} ${i + 1}`,
        ville,
        telephone: `514-555-0${100 + i}`,
        categorie: keyword || "Service",
      }))
    );
    setLoading(false);
    setStep(3);
  };

  const handleImport = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    setImported(true);
    setStep(4);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Page header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-white">Nouveau Scraping</h1>
        <p className="text-sm text-white/40 font-medium leading-relaxed">Récoltez des prospects qualifiés depuis les meilleures sources du marché.</p>
      </div>

      {/* Origin Stepper */}
      <div className="flex items-center gap-1.5 p-1 bg-white/[0.03] border border-white/[0.06] rounded-xl w-fit">
        {STEPS.map((label, index) => (
          <div key={label} className="flex items-center">
             <div 
              className={cn(
                "px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-[0.1em] transition-all cursor-default",
                index === step ? "bg-white text-black shadow-xl" : "text-white/30 hover:text-white/50"
              )}
            >
              {label}
            </div>
            {index < STEPS.length - 1 && (
              <ChevronRight className="w-3 h-3 text-white/10 mx-0.5" />
            )}
          </div>
        ))}
      </div>

      {/* Step 0 — Choose source */}
      {step === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-white/5 pt-10">
          {SOURCES.map((s) => {
            const Icon = s.icon;
            const isSelected = source === s.id;
            return (
              <Card 
                key={s.id}
                onClick={() => setSource(s.id)}
                className={cn(
                  "cursor-pointer transition-all duration-300 relative group overflow-hidden border-white/[0.06]",
                  isSelected ? "bg-white/[0.08] border-white/20 shadow-2xl" : "bg-white/[0.02] hover:bg-white/[0.04] grayscale opacity-60 hover:opacity-100 hover:grayscale-0"
                )}
              >
                <div className={cn("absolute top-0 left-0 w-full h-1 transition-opacity", isSelected ? "bg-white opacity-100" : "opacity-0")} />
                <CardHeader className="flex flex-col items-center gap-4 py-8">
                  <div className={cn("p-4 rounded-2xl transition-colors", isSelected ? "bg-white/10" : "bg-white/5")}>
                    <Icon className={cn("w-10 h-10", isSelected ? "text-white" : "text-white/40")} />
                  </div>
                  <div className="text-center space-y-1">
                    <CardTitle className={cn("text-sm font-bold tracking-tight", isSelected ? "text-white" : "text-white/50")}>{s.label}</CardTitle>
                    <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">{s.description}</p>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
          <div className="md:col-span-3 flex justify-end mt-4">
            <Button 
                onClick={() => setStep(1)} 
                disabled={!source}
                className="bg-white text-black hover:bg-white/90 h-10 px-8 font-bold text-xs uppercase tracking-widest"
            >
              Suivant
            </Button>
          </div>
        </div>
      )}

      {/* Step 1 — Parameters */}
      {step === 1 && (
        <Card className="bg-white/[0.02] border-white/[0.06] overflow-hidden">
          <CardHeader className="px-8 pt-8">
            <h3 className="text-xs font-bold tracking-[0.2em] text-white/30 uppercase">PARAMÈTRES DE RECHERCHE</h3>
          </CardHeader>
          <CardContent className="px-8 pb-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label htmlFor="keyword" className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Mot-clé / Catégorie</Label>
                <div className="relative group">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-white transition-colors" />
                   <Input
                    id="keyword"
                    placeholder="ex: restaurant, plombier..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="pl-10 h-11 bg-white/[0.03] border-white/10 text-white placeholder:text-white/10 rounded-xl"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ville" className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Ville</Label>
                <div className="relative group">
                   <Map className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-white transition-colors" />
                   <Input
                    id="ville"
                    placeholder="ex: Montréal, Québec..."
                    value={ville}
                    onChange={(e) => setVille(e.target.value)}
                    className="pl-10 h-11 bg-white/[0.03] border-white/10 text-white placeholder:text-white/10 rounded-xl"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-4 pt-4 border-t border-white/5">
              <div className="flex items-center justify-between">
                <Label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Nombre de résultats</Label>
                <span className="text-xl font-bold tracking-tighter text-white">{limit}</span>
              </div>
              <input
                type="range"
                min={10}
                max={100}
                step={5}
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="w-full accent-white h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-white/5">
              <Button variant="ghost" onClick={() => setStep(0)} className="text-white/40 hover:text-white hover:bg-white/5">
                Retour
              </Button>
              <Button onClick={() => setStep(2)} disabled={!keyword || !ville} className="bg-white text-black hover:bg-white/90 font-bold text-xs uppercase tracking-widest h-10 px-8">
                Calculer l'extraction
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2 — Launch */}
      {step === 2 && (
        <Card className="bg-white/[0.03] border-white/10 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
           <CardHeader className="px-8 pt-8">
            <h3 className="text-xs font-bold tracking-[0.2em] text-white/30 uppercase text-center">RÉCAPITULATIF DE L'EXTRACTION</h3>
          </CardHeader>
          <CardContent className="px-8 pb-10 flex flex-col items-center gap-8">
            <div className="grid grid-cols-2 w-full gap-4 max-w-sm">
                {[
                  { l: "SOURCE", v: SOURCES.find(s => s.id === source)?.label },
                  { l: "MOT-CLÉ", v: keyword },
                  { l: "VILLE", v: ville },
                  { l: "LIMITE", v: `${limit} résultats` },
                ].map(item => (
                  <div key={item.l} className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center">
                    <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mb-1">{item.l}</p>
                    <p className="text-sm font-bold text-white/90">{item.v}</p>
                  </div>
                ))}
            </div>

            <div className="space-y-4 w-full pt-4">
              <Button
                className="w-full bg-white text-black hover:bg-white/90 h-14 rounded-2xl font-bold text-sm tracking-tight group"
                onClick={handleScrape}
                disabled={loading}
              >
                {loading ? (
                    <div className="flex items-center gap-3">
                       <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                       Initialisation des moteurs...
                    </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    Lancer l'extraction sécurisée
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </Button>
              <Button variant="ghost" onClick={() => setStep(1)} className="w-full text-white/30 h-10 uppercase text-[10px] tracking-widest font-bold">
                Modifier les paramètres
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3 — Results preview */}
      {step === 3 && (
        <Card className="bg-white/[0.02] border-white/10 overflow-hidden shadow-2xl">
           <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold tracking-[0.2em] text-white/30 uppercase">RÉSULTATS TROUVÉS</h3>
                <p className="text-[10px] text-white/20 font-bold uppercase mt-1 tracking-widest">{results.length} PROSPECTS PRÊTS À L'IMPORT</p>
              </div>
              <Button onClick={handleImport} disabled={loading} className="bg-white text-black hover:bg-white/90 font-bold text-xs uppercase tracking-widest h-9 px-6 shrink-0">
                {loading ? "Import..." : `Importer tout`}
              </Button>
           </div>
           <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-white/5">
                  <TableRow className="hover:bg-transparent border-none">
                    <TableHead className="text-[10px] font-bold text-white/30 uppercase tracking-widest py-3">Nom</TableHead>
                    <TableHead className="text-[10px] font-bold text-white/30 uppercase tracking-widest py-3">Ville</TableHead>
                    <TableHead className="text-[10px] font-bold text-white/30 uppercase tracking-widest py-3">Téléphone</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((r, i) => (
                    <TableRow key={i} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                      <TableCell className="font-bold text-white/90 text-sm py-4">{r.nom}</TableCell>
                      <TableCell className="text-white/50 text-xs">{r.ville}</TableCell>
                      <TableCell className="text-white/30 font-mono text-xs">{r.telephone}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
           </CardContent>
        </Card>
      )}

      {/* Step 4 — Success */}
      {step === 4 && imported && (
        <Card className="bg-white/[0.04] border-white/10 shadow-2xl animate-in zoom-in-95 duration-500 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-green-500/10 to-transparent pointer-events-none" />
          <CardContent className="flex flex-col items-center gap-8 py-20 text-center relative z-10">
            <div className="w-24 h-24 rounded-3xl bg-white flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.2)]">
              <CheckCircle className="w-12 h-12 text-black" />
            </div>
            <div className="space-y-3">
                <h2 className="text-3xl font-bold tracking-tight text-white">Extraction Terminée</h2>
                <p className="text-base text-white/40 font-medium max-w-sm mx-auto">
                    {results.length} prospects hautement qualifiés ont été injectés dans votre pipeline.
                </p>
            </div>
            <div className="flex flex-col gap-3 w-full max-w-xs">
                <Button onClick={() => router.push("/prospection")} className="bg-white text-black hover:bg-white/90 h-12 rounded-xl font-bold">
                Accéder au pipeline
                </Button>
                <Button variant="ghost" onClick={() => { setStep(0); setResults([]); setImported(false); }} className="text-white/30 hover:text-white uppercase text-[10px] font-bold tracking-[0.2em]">
                Nouvelle Extraction
                </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
