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
          返回工具选择
        </Link>
      </div>

      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold">具体情况分析</h1>
        <p className="mt-2 text-muted-foreground">
          描述你遇到的具体问题，系统会帮你拆分风险、需要补充的信息和下一步行动。
        </p>
      </div>

      <ChatInterface
        flowType="SITUATION_ANALYZER"
        systemMessage="你好！请描述你在工作中遇到的具体情况，例如“老板让我赔损坏的餐品”或“我怀疑工资低于最低标准”。我会先问必要的追问，再帮你整理风险、证据和下一步。"
      />

      <div className="mt-6 text-center">
        <p className="text-xs text-muted-foreground">
          这是诊断工具，不是法律建议。具体法律建议请联系 Fair Work Ombudsman：13 13 94。
        </p>
      </div>
    </div>
  );
}
