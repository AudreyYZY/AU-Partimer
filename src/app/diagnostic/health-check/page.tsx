"use client";

import { useState } from "react";
import { HealthCheckForm } from "@/components/diagnostic/health-check-form";
import { FindingsList } from "@/components/findings/findings-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText } from "lucide-react";
import Link from "next/link";
import type { Finding } from "@/types/findings";

interface DiagnosticResult {
  sessionId: string;
  findings: Finding[];
  summary: string;
  overallAssessment: string;
  nextSteps: string[];
  resources: Array<{ name: string; url?: string; phone?: string }>;
  disclaimer: string;
}

export default function HealthCheckPage() {
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: Record<string, unknown>) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/diagnostic/health-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: values }),
      });

      if (!response.ok) {
        throw new Error("Failed to process health check");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (result) {
    return <ResultsView result={result} onReset={() => setResult(null)} />;
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="mb-8">
        <Link
          href="/diagnostic"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to options
        </Link>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      <HealthCheckForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}

function ResultsView({
  result,
  onReset,
}: {
  result: DiagnosticResult;
  onReset: () => void;
}) {
  const criticalCount = result.findings.filter(
    (f) => f.severity === "CRITICAL"
  ).length;
  const highCount = result.findings.filter(
    (f) => f.severity === "HIGH"
  ).length;

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Your Workplace Health Check</h1>
        <p className="mt-2 text-muted-foreground">
          Review the findings below and take action on any issues identified.
        </p>
      </div>

      {/* Summary Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{result.summary}</p>
          {result.findings.length > 0 && (
            <div className="mt-4 flex gap-4">
              {criticalCount > 0 && (
                <div className="rounded-lg bg-red-50 px-4 py-2">
                  <span className="text-2xl font-bold text-red-600">
                    {criticalCount}
                  </span>
                  <span className="ml-2 text-sm text-red-800">
                    Critical Issues
                  </span>
                </div>
              )}
              {highCount > 0 && (
                <div className="rounded-lg bg-orange-50 px-4 py-2">
                  <span className="text-2xl font-bold text-orange-600">
                    {highCount}
                  </span>
                  <span className="ml-2 text-sm text-orange-800">
                    High Priority
                  </span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Findings */}
      <div className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">Findings</h2>
        <FindingsList findings={result.findings} defaultExpanded={false} />
      </div>

      {/* Next Steps */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Recommended Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3">
            {result.nextSteps.map((step, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {index + 1}
                </span>
                <span className="text-sm">{step}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* Resources */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Helpful Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {result.resources.map((resource, index) => (
              <li key={index} className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                {resource.url ? (
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-primary underline"
                  >
                    {resource.name}
                  </a>
                ) : (
                  <span className="text-sm">{resource.name}</span>
                )}
                {resource.phone && (
                  <span className="text-sm text-muted-foreground">
                    — {resource.phone}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <div className="mb-8 rounded-lg border bg-muted/50 p-4">
        <p className="text-xs text-muted-foreground">{result.disclaimer}</p>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Button variant="outline" onClick={onReset}>
          Start New Check
        </Button>
        <Button>
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </div>
  );
}
