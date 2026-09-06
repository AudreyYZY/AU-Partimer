// POST /api/diagnostic/health-check
// Processes a health check submission and returns findings

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import type { WorkplaceFacts } from "@/types/facts";
import { generateReport } from "@/services/findings/generator";

// Request validation schema
const HealthCheckRequestSchema = z.object({
  sessionId: z.string().optional(),
  answers: z.object({
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
    employmentType: z.enum(["full_time", "part_time", "casual"]),
    hourlyRate: z.number().min(0),
    weeklyHours: z.number().min(0),
    paymentMethod: z.enum(["cash", "bank", "mixed"]),
    hasPayslip: z.boolean(),
    hasSuper: z.boolean(),
    trialShiftHours: z.number().min(0).default(0),
    trialPaid: z.boolean().default(true),
    trialRepeated: z.boolean().default(false),
    employmentDurationWeeks: z.number().min(0),
  }),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request
    const parsed = HealthCheckRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid request",
          details: parsed.error.issues,
        },
        { status: 400 }
      );
    }

    const { answers, sessionId } = parsed.data;

    // Convert answers to WorkplaceFacts
    const facts: WorkplaceFacts = {
      state: answers.state,
      visaType: answers.visaType,
      isStudyPeriod: answers.isStudyPeriod,
      industry: answers.industry,
      employmentType: answers.employmentType,
      hourlyRate: answers.hourlyRate,
      weeklyHours: answers.weeklyHours,
      paymentMethod: answers.paymentMethod,
      hasPayslip: answers.hasPayslip,
      hasSuper: answers.hasSuper,
      trialShiftHours: answers.trialShiftHours,
      trialPaid: answers.trialPaid,
      trialRepeated: answers.trialRepeated,
      employmentDurationWeeks: answers.employmentDurationWeeks,
    };

    // Generate report using rule engine
    const report = await generateReport({
      facts,
      sessionId: sessionId ?? `session_${Date.now()}`,
    });

    return NextResponse.json({
      sessionId: report.sessionId,
      findings: report.findings,
      summary: report.summary,
      overallAssessment: report.overallAssessment,
      nextSteps: report.nextSteps,
      resources: report.resources,
      disclaimer: report.disclaimer,
    });
  } catch (error) {
    console.error("Health check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
