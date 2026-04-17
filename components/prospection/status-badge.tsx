import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type ProspectStatus = "nouveau" | "contacte" | "interesse" | "client" | "perdu";

const statusConfig: Record<
  ProspectStatus,
  { label: string; className: string }
> = {
  nouveau: {
    label: "Nouveau",
    className: "bg-[#264DEB]/10 text-[#264DEB] border-[#264DEB]/20",
  },
  contacte: {
    label: "Contacté",
    className: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  },
  interesse: {
    label: "Intéressé",
    className: "bg-[#6C3AED]/10 text-[#6C3AED] border-[#6C3AED]/20",
  },
  client: {
    label: "Client",
    className: "bg-green-600/10 text-green-600 border-green-600/20",
  },
  perdu: {
    label: "Perdu",
    className: "bg-red-600/10 text-red-600 border-red-600/20",
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
