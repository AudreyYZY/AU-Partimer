import Link from "next/link";
import {
  ClipboardCheck,
  MessageSquareText,
  FileSearch,
  ArrowRight,
  SearchCheck,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const FLOWS = [
  {
    title: "Part-time Opportunity Checker",
    description:
      "Check whether a job is worth continuing, what to verify first, and safer similar options to search for.",
    icon: SearchCheck,
    href: "/opportunity",
    color: "text-teal-700",
    bgColor: "bg-teal-50",
    bestFor: "Best if you are deciding whether to try a new part-time job",
  },
  {
    title: "Employment Health Check",
    description:
      "Answer structured questions about your job — industry, pay rate, hours, entitlements — and get a full diagnostic report.",
    icon: ClipboardCheck,
    href: "/diagnostic/health-check",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    bestFor: "Best if you want a comprehensive check of your employment",
  },
  {
    title: "Situation Analyzer",
    description:
      "Describe a specific workplace problem (e.g., 'my employer wants me to pay for a damaged order') and get guidance.",
    icon: MessageSquareText,
    href: "/diagnostic/analyze",
    color: "text-green-600",
    bgColor: "bg-green-50",
    bestFor: "Best if you have a specific concern or incident",
  },
  {
    title: "Document Analysis",
    description:
      "Upload a payslip, contract, screenshot, or message and we'll analyze it for potential issues.",
    icon: FileSearch,
    href: "/diagnostic/documents",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    bestFor: "Best if you have documents to check",
  },
];

export default function DiagnosticPage() {
  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold">What do you want to check?</h1>
        <p className="mt-2 text-muted-foreground">
          Choose the option that best fits your situation.
        </p>
      </div>

      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-4">
        {FLOWS.map((flow) => (
          <Link key={flow.href} href={flow.href} className="group">
            <Card className="h-full transition-shadow hover:shadow-lg">
              <CardHeader>
                <div
                  className={`mb-3 flex h-12 w-12 items-center justify-center rounded-lg ${flow.bgColor}`}
                >
                  <flow.icon className={`h-6 w-6 ${flow.color}`} />
                </div>
                <CardTitle className="transition-colors group-hover:text-primary">
                  {flow.title}
                </CardTitle>
                <CardDescription>{flow.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-3 text-xs text-muted-foreground">
                  {flow.bestFor}
                </p>
                <div className="flex items-center text-sm font-medium text-primary">
                  Get started
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-sm text-muted-foreground">
          Not sure which to choose? Start with the{" "}
          <Link
            href="/opportunity"
            className="font-medium text-primary underline"
          >
            Part-time Opportunity Checker
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
