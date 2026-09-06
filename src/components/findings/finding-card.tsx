"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { SeverityBadge } from "./severity-badge";
import { EvidenceChecklist } from "./evidence-checklist";
import type { Finding } from "@/types/findings";

interface FindingCardProps {
  finding: Finding;
  defaultExpanded?: boolean;
}

export function FindingCard({
  finding,
  defaultExpanded = false,
}: FindingCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <Card className="overflow-hidden">
      <CardHeader
        className="cursor-pointer pb-3"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <SeverityBadge severity={finding.severity} />
              <span className="text-xs text-muted-foreground">
                {finding.type.replace(/_/g, " ")}
              </span>
            </div>
            <CardTitle className="text-lg">{finding.title}</CardTitle>
            <CardDescription className="mt-1 line-clamp-2">
              {finding.explanation}
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" className="shrink-0">
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0">
          <Separator className="mb-4" />

          {/* Full Explanation */}
          <div className="mb-4">
            <h4 className="mb-2 text-sm font-semibold">What this means</h4>
            <p className="text-sm text-muted-foreground">
              {finding.explanation}
            </p>
          </div>

          {/* Legal Basis */}
          {finding.legalRef && (
            <div className="mb-4">
              <h4 className="mb-2 text-sm font-semibold">Legal basis</h4>
              <p className="text-sm text-muted-foreground">
                {finding.legalRef}
              </p>
            </div>
          )}

          {/* Recommended Action */}
          <div className="mb-4">
            <h4 className="mb-2 text-sm font-semibold">What you should do</h4>
            <p className="text-sm text-muted-foreground">
              {finding.recommendedAction}
            </p>
          </div>

          {/* Evidence Checklist */}
          {finding.evidenceToCollect.length > 0 && (
            <div className="mb-4">
              <h4 className="mb-2 text-sm font-semibold">
                Evidence to collect
              </h4>
              <EvidenceChecklist items={finding.evidenceToCollect} />
            </div>
          )}

          {/* Fair Work Link */}
          <div className="rounded-lg bg-muted p-3">
            <p className="text-sm">
              Need help? Contact the{" "}
              <a
                href="https://www.fairwork.gov.au"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium text-primary underline"
              >
                Fair Work Ombudsman
                <ExternalLink className="h-3 w-3" />
              </a>{" "}
              on <strong>13 13 94</strong> for free advice.
            </p>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
