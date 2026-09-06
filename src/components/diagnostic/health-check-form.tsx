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
  hourlyRate: z.number().min(0, "Hourly rate must be positive"),
  weeklyHours: z.number().min(0, "Hours must be positive"),
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
  { title: "Location & Work", description: "Where and what type of work" },
  { title: "Pay & Hours", description: "Your pay rate and hours" },
  { title: "Entitlements", description: "Payslips, super, and trial shifts" },
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
        <CardTitle>Employment Health Check</CardTitle>
        <CardDescription>
          Answer these questions about your job. All information is anonymous.
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
                      <FormLabel>Which state do you work in?</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select state" />
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
                      <FormLabel>What is your visa status?</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select visa type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">
                            Australian citizen / permanent resident
                          </SelectItem>
                          <SelectItem value="500">
                            Student visa (subclass 500)
                          </SelectItem>
                          <SelectItem value="417">
                            Working Holiday visa (subclass 417)
                          </SelectItem>
                          <SelectItem value="462">
                            Work and Holiday visa (subclass 462)
                          </SelectItem>
                          <SelectItem value="other">Other visa</SelectItem>
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
                            I am currently in a study period (not on course
                            break)
                          </FormLabel>
                          <FormDescription>
                            Student visa holders can work unlimited hours during
                            scheduled course breaks, but only 48 hours per
                            fortnight during study periods.
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
                      <FormLabel>What industry do you work in?</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="restaurant">Restaurant</SelectItem>
                          <SelectItem value="cafe">Café</SelectItem>
                          <SelectItem value="hotpot">Hotpot</SelectItem>
                          <SelectItem value="bubble_tea">Bubble Tea</SelectItem>
                          <SelectItem value="catering">Catering</SelectItem>
                          <SelectItem value="retail">Retail</SelectItem>
                          <SelectItem value="cleaning">Cleaning</SelectItem>
                          <SelectItem value="warehouse">Warehouse</SelectItem>
                          <SelectItem value="delivery">Delivery</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
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
                      <FormLabel>What is your employment type?</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="full_time">Full-time</SelectItem>
                          <SelectItem value="part_time">Part-time</SelectItem>
                          <SelectItem value="casual">Casual</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Casual workers should receive a 25% loading on top of
                        the base rate.
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
                        What is your hourly pay rate? (before tax)
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
                        Enter the amount you are paid per hour. The national
                        minimum wage is $26.44/hr (or $33.05/hr for casual
                        workers).
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
                        How many hours do you work per week on average?
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
                        Standard full-time is 38 hours per week. Hours beyond
                        this should be paid at overtime rates.
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
                      <FormLabel>How are you paid?</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select payment method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="bank">
                            Bank transfer
                          </SelectItem>
                          <SelectItem value="cash">Cash</SelectItem>
                          <SelectItem value="mixed">
                            Mix of cash and bank
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Cash payment without records can make it harder to prove
                        your employment terms.
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
                        How long have you been working there?
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
                            weeks
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
                          I receive payslips from my employer
                        </FormLabel>
                        <FormDescription>
                          Employers must provide payslips within 1 working day
                          of payment. Payslips should show your pay rate, hours,
                          deductions, and super contributions.
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
                          My employer pays superannuation for me
                        </FormLabel>
                        <FormDescription>
                          Employers must pay 12% (from 1 July 2026) of your
                          ordinary time earnings into a super fund. This is on
                          top of your wages.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <div className="rounded-lg border p-4">
                  <h4 className="mb-3 font-medium">Trial / Training Shifts</h4>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Some employers ask workers to do unpaid &quot;trial&quot; or &quot;training&quot;
                    shifts. Short trials (1-4 hours) may be legal, but longer
                    ones must be paid.
                  </p>

                  <div className="space-y-3">
                    <FormField
                      control={form.control}
                      name="trialShiftHours"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            How many hours did you work during trial/training
                            shifts?
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
                            Enter 0 if you did not do any trial shifts.
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
                                  My trial shifts were paid
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
                                  I was asked to do multiple trial shifts
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
                Back
              </Button>

              {currentStep < STEPS.length - 1 ? (
                <Button type="button" onClick={handleNext}>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Check My Rights"
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
