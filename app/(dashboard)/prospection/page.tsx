import { ProspectTable } from "@/components/prospection/prospect-table";

export default function ProspectionPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-white">Prospects</h1>
          <p className="text-sm text-white/40 font-medium">Gérez vos opportunités et leur état d'avancement.</p>
        </div>
      </div>
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden shadow-2xl">
        <ProspectTable />
      </div>
    </div>
  );
}
