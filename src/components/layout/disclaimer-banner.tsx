import { AlertTriangle } from "lucide-react";

export function DisclaimerBanner() {
  return (
    <div className="border-b bg-amber-50 dark:bg-amber-950/30">
      <div className="container flex items-center gap-2 px-4 py-2 text-xs text-amber-800 dark:text-amber-200 md:px-6 md:text-sm">
        <AlertTriangle className="h-4 w-4 shrink-0" />
        <p>
          <strong>Not legal advice.</strong> This is a diagnostic tool to help
          you understand your workplace rights. For specific legal advice,
          contact the{" "}
          <a
            href="https://www.fairwork.gov.au"
            className="underline font-medium"
            target="_blank"
            rel="noopener noreferrer"
          >
            Fair Work Ombudsman
          </a>{" "}
          on <strong>13 13 94</strong>.
        </p>
      </div>
    </div>
  );
}
