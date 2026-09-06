import Link from "next/link";
import {
  ClipboardCheck,
  MessageSquareText,
  FileSearch,
  ArrowRight,
  Shield,
  AlertTriangle,
  DollarSign,
  FileText,
  Building2,
  GraduationCap,
  SearchCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
  },
  {
    title: "Employment Health Check",
    description:
      "Answer a few questions about your job and get a full report on your workplace rights.",
    icon: ClipboardCheck,
    href: "/diagnostic/health-check",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "Situation Analyzer",
    description:
      "Describe a workplace problem and get guidance on your rights and next steps.",
    icon: MessageSquareText,
    href: "/diagnostic/analyze",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    title: "Document Analysis",
    description:
      "Upload a payslip, contract, or screenshot and we'll check it for issues.",
    icon: FileSearch,
    href: "/diagnostic/documents",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
];

const COMMON_ISSUES = [
  {
    icon: DollarSign,
    title: "Underpayment",
    description: "Is your hourly rate below the minimum wage or award rate?",
  },
  {
    icon: FileText,
    title: "No Payslips",
    description: "Employers must provide payslips within 1 day of payment.",
  },
  {
    icon: Building2,
    title: "Missing Super",
    description: "Your employer must pay superannuation on top of your wages.",
  },
  {
    icon: AlertTriangle,
    title: "Unpaid Trial Shifts",
    description: "Long trial shifts without pay may be illegal.",
  },
  {
    icon: GraduationCap,
    title: "Visa Work Limits",
    description: "Student visa holders have strict work hour limits.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="container flex flex-col items-center gap-6 px-4 py-16 text-center md:px-6 md:py-24">
        <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
          <Shield className="h-4 w-4" />
          Part-time job risk screening
        </div>

        <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Decide if a <span className="text-primary">part-time job</span> is
          worth continuing
        </h1>

        <p className="max-w-xl text-lg text-muted-foreground">
          Spot scam signals, pay risks, missing records, visa-hour issues, and
          practical trade-offs before you commit.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/opportunity" className="flex items-center">
              Check a Job
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline">
            <Link href="/diagnostic/health-check">Check Workplace Rights</Link>
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          No account required · Practical next steps · Official-source links
        </p>
      </section>

      {/* Three Flows */}
      <section className="container px-4 py-16 md:px-6">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold">Choose a check</h2>
          <p className="mt-2 text-muted-foreground">
            Choose the option that best fits your situation.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
                  <div className="flex items-center text-sm font-medium text-primary">
                    Get started
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Common Issues */}
      <section className="border-t bg-muted/50">
        <div className="container px-4 py-16 md:px-6">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold">Common issues we check for</h2>
            <p className="mt-2 text-muted-foreground">
              Many workers in Australia face these problems without knowing.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {COMMON_ISSUES.map((issue) => (
              <div
                key={issue.title}
                className="flex items-start gap-3 rounded-lg border bg-background p-4"
              >
                <issue.icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <h3 className="font-medium">{issue.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {issue.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container px-4 py-16 md:px-6">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold">How it works</h2>
          <p className="mt-2 text-muted-foreground">
            Simple steps to understand your rights.
          </p>
        </div>

        <div className="mx-auto grid max-w-3xl gap-8 md:grid-cols-3">
          {[
            {
              step: "1",
              title: "Tell us about your job",
              description:
              "Enter the job offer, contact channel, pay, hours, documents, and your current pressure level.",
            },
            {
              step: "2",
              title: "We check your rights",
              description:
              "The checker separates scam signals, rights issues, missing facts, visa-hour concerns, and practical risk.",
            },
            {
              step: "3",
              title: "Get your report",
              description:
              "Get a continue strategy, questions to ask the employer, safeguards, and safer search directions.",
            },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                {item.step}
              </div>
              <h3 className="mb-2 font-semibold">{item.title}</h3>
              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-primary text-primary-foreground">
        <div className="container flex flex-col items-center gap-4 px-4 py-16 text-center md:px-6">
          <h2 className="text-3xl font-bold">Have a job offer to check?</h2>
          <p className="max-w-md text-primary-foreground/80">
            Start with the opportunity checker, then use the rights diagnostic
            if you need a deeper employment review.
          </p>
          <Button size="lg" variant="secondary">
            <Link href="/opportunity" className="flex items-center">
              Check This Opportunity
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="container flex flex-col items-center gap-4 px-4 py-8 text-center text-sm text-muted-foreground md:px-6">
          <p>
            This tool provides general information only and does not constitute
            legal advice. For specific legal advice, please consult a qualified
            lawyer or contact the Fair Work Ombudsman on{" "}
            <a href="tel:131394" className="underline">
              13 13 94
            </a>
            .
          </p>
          <div className="flex gap-4">
            <a
              href="https://www.fairwork.gov.au"
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Fair Work Ombudsman
            </a>
            <a
              href="https://calculate.fairwork.gov.au"
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Pay Calculator
            </a>
            <a
              href="https://www.ato.gov.au/businesses-and-organisations/super-for-employers"
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              ATO Super
            </a>
          </div>
          <p>© {new Date().getFullYear()} AU-Partimer. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
