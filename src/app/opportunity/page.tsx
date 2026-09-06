import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { OpportunityChecker } from "@/components/opportunity/opportunity-checker";

export default function OpportunityPage() {
  return (
    <div className="container px-4 py-8 md:px-6 md:py-10">
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back home
        </Link>
      </div>

      <div className="mb-8">
        <p className="text-sm font-medium text-muted-foreground">
          Part-time opportunity checker
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
          这个兼职要不要继续？
        </h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          先判断诈骗、薪资、payslip、super、签证工时和现实压力，再决定是停止、先确认、短期过渡，还是继续推进。
        </p>
      </div>

      <OpportunityChecker />
    </div>
  );
}
