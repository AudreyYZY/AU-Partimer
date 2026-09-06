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
    title: "兼职机会判断",
    description:
      "适合还没入职或刚看到招聘信息时使用：先判断要不要继续聊、先核实什么、有没有更低风险的同类岗位。",
    icon: SearchCheck,
    href: "/opportunity",
    color: "text-teal-700",
    bgColor: "bg-teal-50",
  },
  {
    title: "工作权益体检",
    description:
      "适合已经在上班时使用：用结构化问题检查工资、工时、工资单、养老金、试工和签证工时。",
    icon: ClipboardCheck,
    href: "/diagnostic/health-check",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "具体情况分析",
    description:
      "适合遇到某个具体事件时使用：例如被扣钱、被要求赔偿、突然改排班、试工不给钱。",
    icon: MessageSquareText,
    href: "/diagnostic/analyze",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    title: "文件材料检查",
    description:
      "适合有工资单、合同、聊天截图或招聘广告时使用：先提取关键信息，再检查潜在问题。",
    icon: FileSearch,
    href: "/diagnostic/documents",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
];

const COMMON_ISSUES = [
  {
    icon: DollarSign,
    title: "工资偏低",
    description: "时薪是否低于当前全国最低基准，或需要进一步核对 award rate？",
  },
  {
    icon: FileText,
    title: "没有工资单",
    description: "没有工资单会让工时、税前工资、税和养老金都更难证明。",
  },
  {
    icon: Building2,
    title: "养老金缺失",
    description: "符合条件的雇员通常应在工资之外获得 superannuation。",
  },
  {
    icon: AlertTriangle,
    title: "无薪试工",
    description: "较长或产生实际劳动成果的试工，需要谨慎核查是否应付薪。",
  },
  {
    icon: GraduationCap,
    title: "签证工时",
    description: "学生签需要按连续 14 天周期核对工作时间。",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="container flex flex-col items-center gap-6 px-4 py-16 text-center md:px-6 md:py-24">
        <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
          <Shield className="h-4 w-4" />
          澳大利亚兼职风险判断工具
        </div>

        <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          先判断这个<span className="text-primary">兼职机会</span>值不值得继续
        </h1>

        <p className="max-w-xl text-lg text-muted-foreground">
          在承诺上班、交资料或投入时间之前，先看诈骗信号、工资风险、工资单、养老金、签证工时和现实现金压力。
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/opportunity" className="flex items-center">
              判断一个兼职
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline">
            <Link href="/diagnostic/health-check">检查工作权益</Link>
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          无需账号 · 给出下一步问题 · 链接官方来源
        </p>
      </section>

      <section className="container px-4 py-16 md:px-6">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold">选择你现在需要的检查</h2>
          <p className="mt-2 text-muted-foreground">
            四个入口处理的是不同阶段的问题，不是同一个功能重复放四遍。
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
                    开始使用
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t bg-muted/50">
        <div className="container px-4 py-16 md:px-6">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold">重点检查哪些风险</h2>
            <p className="mt-2 text-muted-foreground">
              先把最容易造成损失、最需要留证据的部分拎出来。
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

      <section className="container px-4 py-16 md:px-6">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold">这个 agent 怎么工作</h2>
          <p className="mt-2 text-muted-foreground">
            它不是替你做决定，而是把风险、证据和下一步问题整理出来。
          </p>
        </div>

        <div className="mx-auto grid max-w-3xl gap-8 md:grid-cols-3">
          {[
            {
              step: "1",
              title: "输入岗位信息",
              description:
              "填写招聘渠道、工资、工时、付款方式、材料要求和你现在的现金压力。",
            },
            {
              step: "2",
              title: "拆分风险类型",
              description:
              "系统把诈骗、工资权益、证据缺口、签证工时和现实可行性分开判断。",
            },
            {
              step: "3",
              title: "得到行动建议",
              description:
              "输出继续策略、要问雇主的问题、保护措施和更低风险的同类搜索方向。",
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

      <section className="border-t bg-primary text-primary-foreground">
        <div className="container flex flex-col items-center gap-4 px-4 py-16 text-center md:px-6">
          <h2 className="text-3xl font-bold">手上有兼职机会要判断吗？</h2>
          <p className="max-w-md text-primary-foreground/80">
            先用兼职机会判断；如果你已经开始上班，再用工作权益体检做更完整的检查。
          </p>
          <Button size="lg" variant="secondary">
            <Link href="/opportunity" className="flex items-center">
              判断这个机会
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <footer className="border-t">
        <div className="container flex flex-col items-center gap-4 px-4 py-8 text-center text-sm text-muted-foreground md:px-6">
          <p>
            这个工具只提供一般信息，不构成法律建议。具体法律建议请咨询合资格律师，或联系 Fair Work Ombudsman：
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
              工资计算器
            </a>
            <a
              href="https://www.ato.gov.au/businesses-and-organisations/super-for-employers"
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              ATO 养老金
            </a>
          </div>
          <p>© {new Date().getFullYear()} AU-Partimer.</p>
        </div>
      </footer>
    </div>
  );
}
