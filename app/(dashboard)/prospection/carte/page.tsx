import { Map } from "lucide-react";

export default function CartePage() {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
          <Map className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-base font-semibold">Carte interactive</h2>
        <p className="text-sm text-muted-foreground mt-1">Importez des prospects pour les voir sur la carte</p>
      </div>
    </div>
  );
}
