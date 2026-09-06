"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { AU_STATES } from "@/lib/constants";

// Form validation schema
const healthCheckSchema = z.object({
  state: z.enum(["NSW", "VIC", "QLD", "SA", "WA", "TAS", "NT", "ACT"]),
  visaType: z.enum(["500", "417", "462", "other", "none"]),
  isStudyPeriod: z.boolean(),
  industry: z.enum([
    "restaurant",
    "cafe",
    "catering",
    "hotpot",
    "bubble_tea",
    "retail",
    "cleaning",
    "warehouse",
    "delivery",
    "other",
  ]),
  employmentType: z.enum(["full_time", "part_time", "casual"]),
  hourlyRate: z.number().min(0, "时薪不能为负数"),
  weeklyHours: z.number().min(0, "工时不能为负数"),
  paymentMethod: z.enum(["cash", "bank", "mixed"]),
  hasPayslip: z.boolean(),
  hasSuper: z.boolean(),
  trialShiftHours: z.number().min(0),
  trialPaid: z.boolean(),
  trialRepeated: z.boolean(),
  employmentDurationWeeks: z.number().min(0),
});

type HealthCheckFormValues = z.infer<typeof healthCheckSchema>;

interface HealthCheckFormProps {
  onSubmit: (values: HealthCheckFormValues) => Promise<void>;
  isSubmitting?: boolean;
}

const STEPS = [
  { title: "地点与工作", description: "工作地点和岗位类型" },
  { title: "工资与工时", description: "时薪、工时和付款方式" },
  { title: "权益记录", description: "工资单、养老金和试工" },
];

export function HealthCheckForm({ onSubmit, isSubmitting }: HealthCheckFormProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const form = useForm<HealthCheckFormValues>({
    resolver: zodResolver(healthCheckSchema),
    defaultValues: {
      isStudyPeriod: false,
      hourlyRate: 0,
      weeklyHours: 0,
      hasPayslip: false,
      hasSuper: false,
      trialShiftHours: 0,
      trialPaid: true,
      trialRepeated: false,
      employmentDurationWeeks: 0,
    },
  });

  const watchVisaType = useWatch({
    control: form.control,
    name: "visaType",
  });
  const watchTrialShiftHours = useWatch({
    control: form.control,
    name: "trialShiftHours",
  });

  const handleNext = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = form.handleSubmit(onSubmit);

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle>工作权益体检</CardTitle>
        <CardDescription>
          回答几个关于现有工作的结构化问题，系统会检查常见工资和权益风险。
        </CardDescription>
        {/* Progress */}
        <div className="pt-4">
          <div className="mb-2 flex justify-between text-sm">
            {STEPS.map((step, index) => (
              <span
                key={step.title}
                className={
                  index <= currentStep
                    ? "text-primary font-medium"
                    : "text-muted-foreground"
                }
              >
                {step.title}
              </span>
            ))}
          </div>
          <Progress
            value={((currentStep + 1) / STEPS.length) * 100}
            className="h-2"
          />
        </div>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Location & Work */}
            {currentStep === 0 && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>你在哪个州工作？</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="选择州" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {AU_STATES.map((state) => (
                            <SelectItem key={state} value={state}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="visaType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>你的签证/身份状态是？</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="选择签证/身份" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">
                            澳大利亚公民 / 永久居民
                          </SelectItem>
                          <SelectItem value="500">
                            学生签证 500
                          </SelectItem>
                          <SelectItem value="417">
                            打工度假签证 417
                          </SelectItem>
                          <SelectItem value="462">
                            打工与度假签证 462
                          </SelectItem>
                          <SelectItem value="other">其他签证</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {watchVisaType === "500" && (
                  <FormField
                    control={form.control}
                    name="isStudyPeriod"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            现在是上课期间，不是学校假期
                          </FormLabel>
                          <FormDescription>
                            学生签在学校假期通常可以工作更多时间；上课期间需要按连续 14 天周期核对工时限制。
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>你在哪个行业工作？</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="选择行业" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="restaurant">餐厅</SelectItem>
                          <SelectItem value="cafe">咖啡店</SelectItem>
                          <SelectItem value="hotpot">火锅/中餐</SelectItem>
                          <SelectItem value="bubble_tea">奶茶店</SelectItem>
                          <SelectItem value="catering">餐饮活动</SelectItem>
                          <SelectItem value="retail">零售</SelectItem>
                          <SelectItem value="cleaning">清洁</SelectItem>
                          <SelectItem value="warehouse">仓库</SelectItem>
                          <SelectItem value="delivery">外卖/配送</SelectItem>
                          <SelectItem value="other">其他</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="employmentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>你的雇佣类型是？</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="选择类型" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="full_time">全职 Full-time</SelectItem>
                          <SelectItem value="part_time">兼职 Part-time</SelectItem>
                          <SelectItem value="casual">临时工 Casual</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Casual 通常应在基础工资之上包含 25% loading。
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Step 2: Pay & Hours */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="hourlyRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        你的税前时薪是多少？
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-muted-foreground">
                            $
                          </span>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            className="pl-7"
                            value={field.value}
                            onChange={(event) =>
                              field.onChange(event.target.valueAsNumber || 0)
                            }
                            onBlur={field.onBlur}
                            name={field.name}
                            ref={field.ref}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        填你每小时税前工资。当前全国最低工资基准为 $26.44/h，成人 casual 基准为 $33.05/h。
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="weeklyHours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        你平均每周工作多少小时？
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          value={field.value}
                          onChange={(event) =>
                            field.onChange(event.target.valueAsNumber || 0)
                          }
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormDescription>
                        标准全职工时通常是每周 38 小时；超过部分可能涉及加班费，需要结合 award 或协议核对。
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>你通常怎么收工资？</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="选择付款方式" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="bank">
                            银行转账
                          </SelectItem>
                          <SelectItem value="cash">现金</SelectItem>
                          <SelectItem value="mixed">
                            现金 + 银行转账
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        如果现金付款没有工资单和记录，之后会更难证明工资和工时。
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="employmentDurationWeeks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        你已经在那里工作多久？
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="number"
                            placeholder="0"
                            value={field.value}
                            onChange={(event) =>
                              field.onChange(event.target.valueAsNumber || 0)
                            }
                            onBlur={field.onBlur}
                            name={field.name}
                            ref={field.ref}
                          />
                          <span className="absolute right-3 top-2.5 text-muted-foreground text-sm">
                            周
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Step 3: Entitlements */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="hasPayslip"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          雇主会给我工资单
                        </FormLabel>
                        <FormDescription>
                          雇主通常需要在发薪日后 1 个工作日内提供工资单。工资单应显示工资、工时、扣款和养老金信息。
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hasSuper"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          雇主会为我支付养老金
                        </FormLabel>
                        <FormDescription>
                          当前 super guarantee 为 12%。符合条件时，养老金通常是在工资之外支付到你的 super fund。
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <div className="rounded-lg border p-4">
                  <h4 className="mb-3 font-medium">试工 / 培训班次</h4>
                  <p className="mb-4 text-sm text-muted-foreground">
                    有些雇主会要求无薪“试工”或“培训”。短时间、仅用于展示技能且被监督的试工可能合理；较长或实际产出劳动的班次需要谨慎核查是否应付薪。
                  </p>

                  <div className="space-y-3">
                    <FormField
                      control={form.control}
                      name="trialShiftHours"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            你试工/培训一共做了多少小时？
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0"
                              value={field.value}
                              onChange={(event) =>
                                field.onChange(event.target.valueAsNumber || 0)
                              }
                              onBlur={field.onBlur}
                              name={field.name}
                              ref={field.ref}
                            />
                          </FormControl>
                          <FormDescription>
                            如果没有试工，填 0。
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {Number(watchTrialShiftHours) > 0 && (
                      <>
                        <FormField
                          control={form.control}
                          name="trialPaid"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>
                                  试工/培训有付薪
                                </FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="trialRepeated"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>
                                  我被要求做了多次试工
                                </FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 0}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                上一步
              </Button>

              {currentStep < STEPS.length - 1 ? (
                <Button type="button" onClick={handleNext}>
                  下一步
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      分析中...
                    </>
                  ) : (
                    "检查我的权益"
                  )}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function getFieldsForStep(step: number): (keyof HealthCheckFormValues)[] {
  switch (step) {
    case 0:
      return ["state", "visaType", "industry", "employmentType"];
    case 1:
      return ["hourlyRate", "weeklyHours", "paymentMethod", "employmentDurationWeeks"];
    case 2:
      return ["hasPayslip", "hasSuper"];
    default:
      return [];
  }
}
