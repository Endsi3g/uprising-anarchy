"use client";

import { useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type ClientStatus = "devis" | "actif" | "termine" | "perdu";

interface ClientCard {
  id: string;
  nom: string;
  valeur: number;
  statut: ClientStatus;
  date: string;
}

const COLUMNS: { id: ClientStatus; label: string; color: string }[] = [
  { id: "devis", label: "Devis", color: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  { id: "actif", label: "Actif", color: "bg-[#264DEB]/10 text-[#264DEB] border-[#264DEB]/20" },
  { id: "termine", label: "Terminé", color: "bg-green-600/10 text-green-600 border-green-600/20" },
  { id: "perdu", label: "Perdu", color: "bg-red-600/10 text-red-600 border-red-600/20" },
];

const INITIAL_CLIENTS: ClientCard[] = [
  { id: "c1", nom: "Clinique Beauté Nathalie", valeur: 4800, statut: "actif", date: "2026-04-01" },
  { id: "c2", nom: "Boulangerie Lemaire", valeur: 2400, statut: "devis", date: "2026-04-12" },
  { id: "c3", nom: "Garage Tremblay Auto", valeur: 1800, statut: "perdu", date: "2026-03-20" },
  { id: "c4", nom: "Resto Chez Marie", valeur: 6200, statut: "actif", date: "2026-02-15" },
  { id: "c5", nom: "Plomberie Landry Inc.", valeur: 3500, statut: "devis", date: "2026-04-10" },
  { id: "c6", nom: "Salon Coiffure Simone", valeur: 1600, statut: "termine", date: "2026-01-30" },
  { id: "c7", nom: "Électro Bouchard", valeur: 5100, statut: "termine", date: "2026-03-05" },
  { id: "c8", nom: "Menuiserie Gagnon", valeur: 2900, statut: "actif", date: "2026-04-08" },
];

function formatCAD(val: number) {
  return new Intl.NumberFormat("fr-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 }).format(val);
}

export default function ClientsPage() {
  const [clients, setClients] = useState<ClientCard[]>(INITIAL_CLIENTS);

  const onDragEnd = (result: DropResult) => {
    const { destination, draggableId } = result;
    if (!destination) return;
    const newStatus = destination.droppableId as ClientStatus;
    setClients((prev) =>
      prev.map((c) => (c.id === draggableId ? { ...c, statut: newStatus } : c))
    );
  };

  const byColumn = (colId: ClientStatus) => clients.filter((c) => c.statut === colId);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-white">Pipeline CRM</h1>
        <p className="text-sm text-white/40 font-medium leading-relaxed">Gérez votre flux de trésorerie et le cycle de vie de vos contrats.</p>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-full items-start">
          {COLUMNS.map((col) => {
            const cards = byColumn(col.id);
            const total = cards.reduce((sum, c) => sum + c.valeur, 0);
            return (
              <div key={col.id} className="flex flex-col gap-4 min-h-0">
                {/* Column header */}
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">{col.label}</span>
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white text-[10px] font-bold text-black translate-y-[-1px]">
                      {cards.length}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-white/50 tracking-tight">{formatCAD(total)}</span>
                </div>

                {/* Drop zone */}
                <Droppable droppableId={col.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={cn(
                        "flex flex-col gap-3 flex-1 min-h-[500px] border border-white/[0.04] rounded-2xl p-2 transition-all duration-300",
                        snapshot.isDraggingOver ? "bg-white/[0.05] border-white/10" : "bg-white/[0.02]"
                      )}
                    >
                      {cards.map((card, index) => (
                        <Draggable key={card.id} draggableId={card.id} index={index}>
                          {(prov, snap) => (
                            <div
                              ref={prov.innerRef}
                              {...prov.draggableProps}
                              {...prov.dragHandleProps}
                              className={cn(
                                "group rounded-xl bg-black border border-white/[0.06] p-4 flex flex-col gap-4 cursor-grab select-none transition-all duration-300 relative overflow-hidden",
                                snap.isDragging ? "shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-white/20 -rotate-1 z-50 scale-105" : "hover:border-white/10 hover:bg-white/[0.02]"
                              )}
                            >
                              <div className="absolute top-0 left-0 w-1 h-full bg-white/10 group-hover:bg-white transition-colors" />
                              <div className="flex items-start justify-between gap-1 pl-1">
                                <span className="text-sm font-bold text-white/90 leading-tight group-hover:text-white transition-colors">{card.nom}</span>
                              </div>
                              <div className="flex items-end justify-between pl-1">
                                <div className="space-y-0.5">
                                    <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest leading-none">Valeur Estimée</p>
                                    <span className="text-lg font-bold tracking-tighter text-white">
                                    {formatCAD(card.valeur)}
                                    </span>
                                </div>
                                <div className="text-[9px] font-bold text-white/30 font-mono">
                                  {new Date(card.date).toLocaleDateString("fr-CA", { month: 'short', day: 'numeric' })}
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      {cards.length === 0 && (
                        <div className="flex-1 flex items-center justify-center opacity-20 group">
                          <span className="text-[10px] font-bold uppercase tracking-[0.2em] transition-all">Vide</span>
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}
