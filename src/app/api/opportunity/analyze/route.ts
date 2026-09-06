import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { assessOpportunity } from "@/services/opportunity/decision-engine";
import type { OpportunityFacts } from "@/types/opportunity";

const OptionalNumberSchema = z.preprocess((value) => {
  if (value === "" || value === null || value === undefined) return undefined;
  return Number(value);
}, z.number().min(0).optional());

const OpportunityRequestSchema = z.object({
  state: z.enum(["NSW", "VIC", "QLD", "SA", "WA", "TAS", "NT", "ACT"]),
  visaType: z.enum(["500", "417", "462", "other", "none"]),
  isStudyPeriod: z.boolean().default(false),
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
  employerNameOrAbn: z.string().trim().optional(),
  roleTitle: z.string().trim().optional(),
  employmentType: z.enum(["full_time", "part_time", "casual", "unknown"]),
  offeredHourlyRate: OptionalNumberSchema,
  weeklyHours: OptionalNumberSchema,
  paymentMethod: z.enum(["bank", "cash", "mixed", "unknown"]),
  hasPayslip: z.enum(["yes", "no", "unknown"]),
  superMentioned: z.enum(["yes", "no", "unknown"]),
  hasWrittenAgreement: z.enum(["yes", "no", "unknown"]),
  employerIdentityStatus: z
    .enum(["verified", "provided_unverified", "not_provided", "unknown"])
    .default("unknown"),
  trialShiftHours: OptionalNumberSchema,
  trialPaid: z.enum(["yes", "no", "unknown"]),
  contactChannel: z.enum([
    "official_email",
    "phone",
    "job_platform",
    "wechat",
    "whatsapp",
    "telegram",
    "sms",
    "other",
  ]),
  requiresUpfrontPayment: z.boolean().default(false),
  asksForBankOrCrypto: z.boolean().default(false),
  asksForIdentityDocsEarly: z.boolean().default(false),
  urgentStartOrPressure: z.boolean().default(false),
  hasOtherOptions: z.enum(["none", "some", "several"]),
  cashPressure: z.enum(["low", "medium", "high"]),
  commuteMinutes: OptionalNumberSchema,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = OpportunityRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "请求内容不完整或格式不正确", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const report = assessOpportunity(parsed.data as OpportunityFacts);

    return NextResponse.json(report);
  } catch (error) {
    console.error("Opportunity analysis error:", error);
    return NextResponse.json(
      { error: "兼职机会分析失败" },
      { status: 500 }
    );
  }
}
