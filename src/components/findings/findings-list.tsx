import { FindingCard } from "./finding-card";
import type { Finding } from "@/types/findings";
import { sortBySeverity } from "@/services/rule-engine/engine";
import { CheckCircle2 } from "lucide-react";

interface FindingsListProps {
  findings: Finding[];
  defaultExpanded?: boolean;
}

export function FindingsList({ findings, defaultExpanded = false }: FindingsListProps) {
  const sorted = sortBySeverity(findings);

  if (sorted.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed p-8 text-center">
        <CheckCircle2 className="h-12 w-12 text-green-500" />
        <div>
          <h3 className="text-lg font-semibold">No Issues Found</h3>
          <p className="text-sm text-muted-foreground">
            Based on the information provided, no specific workplace rights
            issues were identified. This does not guarantee full compliance — if
            you have concerns, contact the Fair Work Ombudsman.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sorted.map((finding) => (
        <FindingCard
          key={finding.id}
          finding={finding}
          defaultExpanded={defaultExpanded}
        />
      ))}
    </div>
  );
}
