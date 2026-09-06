import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ChatInterface } from "@/components/diagnostic/chat-interface";

export default function AnalyzePage() {
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

      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold">Situation Analyzer</h1>
        <p className="mt-2 text-muted-foreground">
          Describe your workplace situation and I&apos;ll help you understand your
          rights.
        </p>
      </div>

      <ChatInterface
        flowType="SITUATION_ANALYZER"
        systemMessage="Hi! I'm here to help you understand your workplace rights. Please describe what's happening at your work — for example, 'My employer wants me to pay for a damaged food order' or 'I think I'm being underpaid'. I'll ask some follow-up questions to understand the full picture."
      />

      <div className="mt-6 text-center">
        <p className="text-xs text-muted-foreground">
          This is a diagnostic tool, not legal advice. For specific legal
          advice, contact the Fair Work Ombudsman on 13 13 94.
        </p>
      </div>
    </div>
  );
}
