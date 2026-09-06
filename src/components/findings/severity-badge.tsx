import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Severity } from "@/types/findings";
import {
  AlertCircle,
  AlertTriangle,
  Info,
} from "lucide-react";

interface SeverityBadgeProps {
  severity: Severity;
  className?: string;
}

const severityConfig: Record<
  Severity,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    className: string;
    icon: typeof AlertCircle;
  }
> = {
  CRITICAL: {
    label: "Critical",
    variant: "destructive",
    className: "bg-red-600 text-white hover:bg-red-700",
    icon: AlertCircle,
  },
  HIGH: {
    label: "High",
    variant: "destructive",
    className: "bg-orange-500 text-white hover:bg-orange-600",
    icon: AlertTriangle,
  },
  MEDIUM: {
    label: "Medium",
    variant: "secondary",
    className: "bg-yellow-500 text-black hover:bg-yellow-600",
    icon: AlertTriangle,
  },
  LOW: {
    label: "Low",
    variant: "outline",
    className: "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-300",
    icon: Info,
  },
  INFO: {
    label: "Info",
    variant: "outline",
    className: "bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-300",
    icon: Info,
  },
};

export function SeverityBadge({ severity, className }: SeverityBadgeProps) {
  const config = severityConfig[severity];
  const Icon = config.icon;

  return (
    <Badge
      variant={config.variant}
      className={cn("gap-1.5 font-medium", config.className, className)}
    >
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </Badge>
  );
}
