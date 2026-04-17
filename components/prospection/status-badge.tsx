import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type ProspectStatus = "nouveau" | "contacte" | "interesse" | "client" | "perdu";

const statusConfig: Record<
  ProspectStatus,
  { label: string; className: string }
> = {
  nouveau: {
    label: "Nouveau",
    className: "bg-white/10 text-white border-white/20",
  },
  contacte: {
    label: "Contacté",
    className: "bg-white/5 text-white/70 border-white/10",
  },
  interesse: {
    label: "Intéressé",
    className: "bg-white/20 text-white border-white/30 font-bold",
  },
  client: {
    label: "Client",
    className: "bg-green-500/10 text-green-400 border-green-500/20",
  },
  perdu: {
    label: "Perdu",
    className: "bg-red-500/10 text-red-400 border-red-500/20",
  },
};

interface StatusBadgeProps {
  status: ProspectStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <Badge
      className={cn(
        "border font-medium",
        config.className,
        className
      )}
    >
      {config.label}
    </Badge>
  );
}
