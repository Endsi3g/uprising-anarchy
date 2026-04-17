import { ProspectTable } from "@/components/prospection/prospect-table";

export default function ProspectionPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-lg font-semibold">Prospects</h1>
          <p className="text-sm text-muted-foreground">Gérez vos prospects et leur statut</p>
        </div>
      </div>
      <ProspectTable />
    </div>
  );
}
