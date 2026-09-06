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
    title: "兼职机会判断",
    description:
      "还没入职或刚看到招聘时使用：判断是否值得继续、先核实什么，以及有哪些更低风险的同类选择。",
    icon: SearchCheck,
    href: "/opportunity",
    color: "text-teal-700",
    bgColor: "bg-teal-50",
    bestFor: "适合：正在决定要不要试一个新兼职",
  },
  {
    title: "工作权益体检",
    description:
      "已经在上班时使用：系统检查工资、工时、工资单、养老金、试工、签证工时等权益问题。",
    icon: ClipboardCheck,
    href: "/diagnostic/health-check",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    bestFor: "适合：已经工作，想做完整权益检查",
  },
  {
    title: "具体情况分析",
    description:
      "遇到具体事件时使用：描述被扣钱、被要求赔偿、临时改班、威胁辞退等情况，获取下一步建议。",
    icon: MessageSquareText,
    href: "/diagnostic/analyze",
    color: "text-green-600",
    bgColor: "bg-green-50",
    bestFor: "适合：有一个具体 workplace problem",
  },
  {
    title: "文件材料检查",
    description:
      "有材料时使用：上传工资单、合同、截图或招聘信息，先提取关键信息，再检查潜在风险。",
    icon: FileSearch,
    href: "/diagnostic/documents",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    bestFor: "适合：手上有文件或聊天截图",
  },
];

export default function DiagnosticPage() {
  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold">你现在想检查什么？</h1>
        <p className="mt-2 text-muted-foreground">
          四个入口对应求职前、工作中、具体事件和材料核查四种场景。
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
                  开始使用
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-sm text-muted-foreground">
          不确定选哪个？先从{" "}
          <Link
            href="/opportunity"
            className="font-medium text-primary underline"
          >
            兼职机会判断
          </Link>
          开始。
        </p>
      </div>
    </div>
  );
}
