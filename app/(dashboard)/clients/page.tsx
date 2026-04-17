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
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-lg font-semibold">Clients</h1>
          <p className="text-sm text-muted-foreground">Gérez votre pipeline CRM</p>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-4 gap-4 h-full">
          {COLUMNS.map((col) => {
            const cards = byColumn(col.id);
            const total = cards.reduce((sum, c) => sum + c.valeur, 0);
            return (
              <div key={col.id} className="flex flex-col gap-2 min-h-0">
                {/* Column header */}
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{col.label}</span>
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                      {cards.length}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">{formatCAD(total)}</span>
                </div>

                {/* Drop zone */}
                <Droppable droppableId={col.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={cn(
                        "flex flex-col gap-2 flex-1 min-h-[200px] rounded-xl p-2 transition-colors",
                        snapshot.isDraggingOver ? "bg-muted/60" : "bg-muted/20"
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
                                "rounded-xl bg-card ring-1 ring-foreground/10 p-3 flex flex-col gap-1.5 cursor-grab select-none",
                                snap.isDragging && "shadow-lg ring-[#264DEB]/30 rotate-1"
                              )}
                            >
                              <div className="flex items-start justify-between gap-1">
                                <span className="text-sm font-medium leading-snug">{card.nom}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-[#264DEB]">
                                  {formatCAD(card.valeur)}
                                </span>
                                <Badge className={cn("border text-xs", col.color)}>
                                  {col.label}
                                </Badge>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {new Date(card.date).toLocaleDateString("fr-CA")}
                              </span>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      {cards.length === 0 && (
                        <div className="flex-1 flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">Glisser ici</span>
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
