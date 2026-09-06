# 奶茶店案例 Bubble Tea Shop Cases

**Cases: 021-040**

---

## Case 021: 奶茶店员工时薪低于最低工资

### 1. 用户真实描述
```
我在一家奶茶店打工，老板说每小时$17，现金。
一周大概工作20小时，周末也要上班。
没有合同，没有工资单。
我是学生签证，这样正常吗？
```

### 2. 已知事实
```json
{
  "employerIndustry": "food_service",
  "employerType": "bubble_tea",
  "jobTitle": "店员",
  "payRate": 17.00,
  "paymentMethod": "cash",
  "hoursPerWeek": 20,
  "workOnWeekends": true,
  "hasContract": false,
  "receivesPayslips": false,
  "visaSubclass": "500"
}
```

### 3. 缺失事实
- 雇主名称和ABN
- 具体工作时间
- 是否有养老金
- 是否有试工期
- 是否有罚款率
- 是否提供TFN

### 4. Agent应该追问的问题
1. "你的签证工作时间限制是多少？" (visa_hours_limit)
2. "你周末工资和平时一样吗？" (weekend_rate)
3. "老板有没有给你交super？" (super)
4. "你有没有做过试工？" (trial_shift)
5. "你能提供你和老板的聊天记录吗？" (evidence)

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "food_service",
  "employerType": "bubble_tea",
  "jobTitle": "店员",
  "employmentStatus": "casual",
  "payRate": 17.00,
  "payRateType": "hourly",
  "paymentMethod": "cash",
  "cashPaymentPercentage": 100,
  "hoursPerWeek": 20,
  "hasContract": false,
  "receivesPayslips": false,
  "receivesSuper": false,
  "tfnProvided": false,
  "visaSubclass": "500",
  "hoursLimit": 48,
  "visaWorkCompliant": true,
  "overallCompleteness": 0.6,
  "averageConfidence": 0.75
}
```

### 6. Findings

#### Finding 021-A: 低于最低工资
```
Name: Below National Minimum Wage
Description: Your hourly rate of $17.00 is below the national minimum wage 
of $26.44 per hour. As a casual employee, you should receive at least 
$33.05 per hour (25% casual loading).
Severity: CRITICAL
Confidence: 0.95
```

#### Finding 021-B: 无工资单
```
Name: Missing Payslips
Description: Your employer is not providing payslips as required by law.
Severity: HIGH
Confidence: 0.9
```

#### Finding 021-C: 无养老金
```
Name: Missing Superannuation
Description: Your employer is not paying the required superannuation 
guarantee.
Severity: CRITICAL
Confidence: 0.85
```

### 7. Severity Summary
| Finding | Severity | Urgency |
|---------|----------|---------|
| Below Minimum Wage | CRITICAL | Immediate |
| Missing Payslips | HIGH | Within 1 week |
| Missing Super | CRITICAL | Immediate |

### 8. Legal Basis
| Law | Section | Relevance |
|-----|---------|-----------|
| Fair Work Act 2009 | s.284 | National minimum wage |
| Fair Work Act 2009 | s.536 | Payslip requirements |
| Superannuation Guarantee Act 1992 | s.19 | Super guarantee |

### 9. Recommended Actions
1. **Calculate underpayment** - $33.05 - $17.00 = $16.05/hr owed
2. **Request payslips** - Written request
3. **Report to ATO** - Unpaid super
4. **Keep evidence** - Chat messages

### 10. Evidence Checklist
| Evidence | Status | Priority |
|----------|--------|----------|
| Chat history with employer | COLLECTED | HIGH |
| Roster screenshots | MISSING | HIGH |
| Photos of workplace | MISSING | LOW |

---

## Case 022: 奶茶店无薪试工2小时

### 1. 用户真实描述
```
去奶茶店面试，老板让我试工2小时，学习怎么做奶茶。
试工没有工资，说是"培训"。
试工后说可以来上班，时薪$20。
我觉得试工应该要给钱吧？
```

### 2. 已知事实
```json
{
  "employerIndustry": "food_service",
  "employerType": "bubble_tea",
  "hadTrialShift": true,
  "trialShiftDuration": "2 hours",
  "trialShiftPaid": false,
  "trialShiftOutcome": "hired",
  "payRate": 20.00
}
```

### 3. 缺失事实
- 试工日期
- 试工具体内容
- 是否有后续工作安排
- 签证类型

### 4. Agent应该追问的问题
1. "试工那天你具体做了什么？" (trial_tasks)
2. "试工是哪一天？" (trial_date)
3. "你有和老板的聊天记录吗？" (evidence)
4. "试工之前有没有说好有工资？" (trial_agreement)

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "food_service",
  "employerType": "bubble_tea",
  "hadTrialShift": true,
  "trialShiftDate": "2026-05-10",
  "trialShiftDuration": "PT2H",
  "trialShiftPaid": false,
  "trialShiftTasks": ["学习做奶茶", "学习收银"],
  "trialShiftOutcome": "hired",
  "trialShiftProductive": true,
  "payRate": 20.00,
  "visaSubclass": "500",
  "overallCompleteness": 0.55,
  "averageConfidence": 0.7
}
```

### 6. Findings

#### Finding 022-A: 试工应支付工资
```
Name: Unpaid Trial Shift
Description: Your 2-hour trial involved learning productive skills. 
Under Fair Work guidelines, this should be paid at the minimum rate.
Amount Owed: ~$66.10 (2 hours × $33.05)
Severity: MEDIUM
Confidence: 0.8
```

### 7. Severity Summary
| Finding | Severity | Urgency |
|---------|----------|---------|
| Unpaid Trial | MEDIUM | Within 1 month |

### 8. Legal Basis
| Law | Section | Relevance |
|-----|---------|-----------|
| Fair Work Act 2009 | s.284 | Minimum wage for work |

### 9. Recommended Actions
1. **Request payment** - For 2 hours
2. **Keep evidence** - Chat messages

### 10. Evidence Checklist
| Evidence | Status | Priority |
|----------|--------|----------|
| Chat messages about trial | MISSING | HIGH |
| Trial date confirmation | MISSING | MEDIUM |

---

## Case 023: 奶茶店员工被扣工资买原料

### 1. 用户真实描述
```
老板说如果客人投诉奶茶不好喝，要从我工资里扣钱。
上个月被扣了$80，说是原料成本。
这合理吗？我又不是老板。
```

### 2. 已知事实
```json
{
  "employerIndustry": "food_service",
  "employerType": "bubble_tea",
  "deductionForComplaints": true,
  "deductionAmount": 80,
  "deductionReason": "customer complaints"
}
```

### 3. 缺失事实
- 时薪
- 合同情况
- 工资单
- 其他扣款

### 4. Agent应该追问的问题
1. "你的时薪是多少？" (pay_rate)
2. "你的合同上有没有写这个扣款条款？" (contract_deduction)
3. "工资单上有没有显示这个扣款？" (payslip_deduction)
4. "你有没有同意过这个扣款？" (consent)

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "food_service",
  "employerType": "bubble_tea",
  "deductionForComplaints": true,
  "deductionAmount": 80,
  "deductionReason": "customer complaints",
  "contractIncludesDeduction": false,
  "employeeConsented": false,
  "payRate": 20.00,
  "visaSubclass": "500",
  "overallCompleteness": 0.55,
  "averageConfidence": 0.8
}
```

### 6. Findings

#### Finding 023-A: 不当扣款
```
Name: Unlawful Deduction
Description: Deducting pay for customer complaints is not a permitted 
deduction under the Fair Work Act. Employers cannot deduct pay for 
business losses.
Severity: HIGH
Confidence: 0.85
```

### 7. Severity Summary
| Finding | Severity | Urgency |
|---------|----------|---------|
| Unlawful Deduction | HIGH | Within 1 week |

### 8. Legal Basis
| Law | Section | Relevance |
|-----|---------|-----------|
| Fair Work Act 2009 | s.324 | Permitted deductions |

### 9. Recommended Actions
1. **Request refund** - For $80 deducted
2. **Refuse future deductions** - Without proper basis
3. **Contact Fair Work** - File complaint

### 10. Evidence Checklist
| Evidence | Status | Priority |
|----------|--------|----------|
| Payslips showing deduction | MISSING | HIGH |
| Messages about deduction policy | MISSING | HIGH |

---

## Case 024: 奶茶店员工连续工作6小时无休息

### 1. 用户真实描述
```
我每天在奶茶店工作6小时，中间没有休息时间。
老板说太忙了不能休息。
有时候连喝水的时间都没有。
而且6小时都不算吃饭时间。
```

### 2. 已知事实
```json
{
  "employerIndustry": "food_service",
  "employerType": "bubble_tea",
  "hoursPerShift": 6,
  "breakProvided": false,
  "mealBreakProvided": false
}
```

### 3. 缺失事实
- 时薪
- 每周工作几天
- 合同情况

### 4. Agent应该追问的问题
1. "你每周工作几天？" (days_per_week)
2. "你的时薪是多少？" (pay_rate)
3. "你有没有向老板要求过休息？" (break_requested)
4. "你有没有签过关于休息的协议？" (break_agreement)

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "food_service",
  "employerType": "bubble_tea",
  "hoursPerShift": 6,
  "breakProvided": false,
  "mealBreakProvided": false,
  "breakRequested": true,
  "breakDenied": true,
  "payRate": 20.00,
  "visaSubclass": "500",
  "overallCompleteness": 0.55,
  "averageConfidence": 0.8
}
```

### 6. Findings

#### Finding 024-A: 缺少休息时间
```
Name: Missing Breaks
Description: For shifts of 6 hours or more, employees are entitled to 
a meal break. Your employer is denying this entitlement.
Severity: MEDIUM
Confidence: 0.85
```

### 7. Severity Summary
| Finding | Severity | Urgency |
|---------|----------|---------|
| Missing Breaks | MEDIUM | Within 1 month |

### 8. Legal Basis
| Law | Section | Relevance |
|-----|---------|-----------|
| Fast Food Award 2020 | Clause 15 | Breaks |

### 9. Recommended Actions
1. **Request breaks in writing** - Formal request
2. **Contact Fair Work** - For advice
3. **Keep records** - Document denied breaks

### 10. Evidence Checklist
| Evidence | Status | Priority |
|----------|--------|----------|
| Messages requesting breaks | MISSING | HIGH |
| Roster showing 6-hour shifts | MISSING | MEDIUM |

---

## Case 025: 奶茶店员工被要求提前上班不给工资

### 1. 用户真实描述
```
老板让我每天提前15分钟来开店准备。
但是工资是从开店时间开始算。
一个月下来大概被少算了5小时。
```

### 2. 已知事实
```json
{
  "employerIndustry": "food_service",
  "employerType": "bubble_tea",
  "unpaidPrepTime": 15,
  "unpaidPrepUnit": "minutes_per_shift",
  "monthlyUnpaidHours": 5
}
```

### 3. 缺失事实
- 时薪
- 每月工作天数
- 合同情况

### 4. Agent应该追问的问题
1. "你的时薪是多少？" (pay_rate)
2. "你每个月工作多少天？" (days_per_month)
3. "你有没有记录每天的到店时间？" (time_records)
4. "你有工资单吗？" (payslips)

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "food_service",
  "employerType": "bubble_tea",
  "unpaidPrepTimePerShift": 15,
  "daysPerMonth": 20,
  "monthlyUnpaidHours": 5,
  "payRate": 20.00,
  "visaSubclass": "500",
  "overallCompleteness": 0.6,
  "averageConfidence": 0.8
}
```

### 6. Findings

#### Finding 025-A: 未支付准备工作时间
```
Name: Unpaid Preparation Time
Description: Time spent opening and preparing the shop is work time 
and must be paid. You are owed for approximately 5 hours per month.
Estimated Owed: ~$100/month
Severity: MEDIUM
Confidence: 0.85
```

### 7. Severity Summary
| Finding | Severity | Urgency |
|---------|----------|---------|
| Unpaid Prep Time | MEDIUM | Within 1 month |

### 8. Legal Basis
| Law | Section | Relevance |
|-----|---------|-----------|
| Fair Work Act 2009 | s.323 | Payment for hours worked |

### 9. Recommended Actions
1. **Keep time records** - Log actual arrival times
2. **Request payment** - For all hours worked
3. **Contact Fair Work** - File complaint

### 10. Evidence Checklist
| Evidence | Status | Priority |
|----------|--------|----------|
| Personal time records | MISSING | HIGH |
| Messages about early arrival | MISSING | HIGH |

---

## Case 026: 奶茶店员工周末和公共假日无罚款率

### 1. 用户真实描述
```
我在奶茶店工作，周末和公共假日工资跟平时一样。
圣诞节那天也是$20一小时。
我觉得公共假日应该要double pay吧？
```

### 2. 已知事实
```json
{
  "employerIndustry": "food_service",
  "employerType": "bubble_tea",
  "payRate": 20.00,
  "weekendRateSame": true,
  "publicHolidayRateSame": true,
  "receivesPenaltyRates": false
}
```

### 3. 缺失事实
- 合同情况
- 工资单
- 具体工作时间

### 4. Agent应该追问的问题
1. "你的合同上有没有写罚款率？" (contract_penalty)
2. "你有工资单吗？" (payslips)
3. "你公共假日工作了几天？" (public_holiday_days)
4. "你是casual还是part-time？" (employment_status)

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "food_service",
  "employerType": "bubble_tea",
  "employmentStatus": "casual",
  "payRate": 20.00,
  "receivesPenaltyRates": false,
  "weekendRate": 20.00,
  "publicHolidayRate": 20.00,
  "publicHolidayDaysWorked": 3,
  "visaSubclass": "500",
  "overallCompleteness": 0.6,
  "averageConfidence": 0.8
}
```

### 6. Findings

#### Finding 026-A: 缺少公共假日罚款率
```
Name: Missing Public Holiday Penalty Rates
Description: Under the Fast Food Award, casual employees working on 
public holidays should receive 250% of their base rate. You are 
receiving only the base rate of $20.00.
Estimated Underpayment: ~$90 per public holiday
Severity: HIGH
Confidence: 0.85
```

### 7. Severity Summary
| Finding | Severity | Urgency |
|---------|----------|---------|
| Missing Penalty Rates | HIGH | Within 1 week |

### 8. Legal Basis
| Law | Section | Relevance |
|-----|---------|-----------|
| Fast Food Award 2020 | Clause 23 | Penalty rates |

### 9. Recommended Actions
1. **Calculate underpayment** - Public holiday hours × penalty rate
2. **Request backpay** - From employer
3. **Contact Fair Work** - File complaint

### 10. Evidence Checklist
| Evidence | Status | Priority |
|----------|--------|----------|
| Roster showing public holiday shifts | MISSING | HIGH |
| Payslips showing base rate only | MISSING | HIGH |

---

## Case 027: 奶茶店员工被要求免费清洁

### 1. 用户真实描述
```
每天下班后要留下来打扫卫生，大概30分钟。
老板说这是"分内工作"，不给工资。
一个月下来大概被扣了5小时的清洁时间。
```

### 2. 已知事实
```json
{
  "employerIndustry": "food_service",
  "employerType": "bubble_tea",
  "unpaidCleaningTime": 30,
  "unpaidCleaningUnit": "minutes_per_shift",
  "monthlyUnpaidHours": 5
}
```

### 3. 缺失事实
- 时薪
- 每月工作天数
- 合同情况

### 4. Agent应该追问的问题
1. "你的时薪是多少？" (pay_rate)
2. "你每个月工作多少天？" (days_per_month)
3. "你有记录每天的下班时间吗？" (time_records)

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "food_service",
  "employerType": "bubble_tea",
  "unpaidCleaningTimePerShift": 30,
  "daysPerMonth": 20,
  "monthlyUnpaidHours": 5,
  "payRate": 20.00,
  "visaSubclass": "500",
  "overallCompleteness": 0.55,
  "averageConfidence": 0.8
}
```

### 6. Findings

#### Finding 027-A: 未支付清洁时间
```
Name: Unpaid Cleaning Time
Description: Time spent cleaning after your shift is work time and 
must be paid. You are owed for approximately 5 hours per month.
Estimated Owed: ~$100/month
Severity: MEDIUM
Confidence: 0.85
```

### 7. Severity Summary
| Finding | Severity | Urgency |
|---------|----------|---------|
| Unpaid Cleaning | MEDIUM | Within 1 month |

### 8. Legal Basis
| Law | Section | Relevance |
|-----|---------|-----------|
| Fair Work Act 2009 | s.323 | Payment for hours worked |

### 9. Recommended Actions
1. **Keep time records** - Log actual end times
2. **Request payment** - For all hours worked
3. **Contact Fair Work** - File complaint

### 10. Evidence Checklist
| Evidence | Status | Priority |
|----------|--------|----------|
| Personal time records | MISSING | HIGH |
| Messages about cleaning duties | MISSING | MEDIUM |

---

## Case 028: 奶茶店员工没有年假和病假

### 1. 用户真实描述
```
我在奶茶店做part-time，做了1年了。
生病请假没有工资，说是casual没有sick leave。
但我的合同写的是part-time。
我想请年假也不行。
```

### 2. 已知事实
```json
{
  "employerIndustry": "food_service",
  "employerType": "bubble_tea",
  "employmentStatus": "part-time",
  "employmentDuration": "1 year",
  "sickLeaveDenied": true,
  "annualLeaveDenied": true,
  "contractStatus": "part-time"
}
```

### 3. 缺失事实
- 每周工作小时数
- 工资单
- 具体合同内容

### 4. Agent应该追问的问题
1. "你每周工作多少小时？" (hours_per_week)
2. "你的合同上写的是casual还是part-time？" (contract_status)
3. "你有工资单吗？工资单上有没有显示年假余额？" (payslips)
4. "你请假的时候工资有没有被扣？" (leave_deducted)

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "food_service",
  "employerType": "bubble_tea",
  "employmentStatus": "part-time",
  "hasWrittenContract": true,
  "contractStatus": "part-time",
  "employmentDuration": "PT1Y",
  "hoursPerWeek": 20,
  "sickLeaveEntitled": true,
  "sickLeaveGranted": false,
  "annualLeaveEntitled": true,
  "annualLeaveGranted": false,
  "visaSubclass": "500",
  "overallCompleteness": 0.65,
  "averageConfidence": 0.8
}
```

### 6. Findings

#### Finding 028-A: 未提供病假
```
Name: Sick Leave Denied
Description: As a part-time employee, you are entitled to paid sick 
leave. Your employer is denying this entitlement.
Severity: HIGH
Confidence: 0.9
```

#### Finding 028-B: 未提供年假
```
Name: Annual Leave Denied
Description: As a part-time employee, you are entitled to annual leave 
on a pro-rata basis. Your employer is denying this entitlement.
Severity: HIGH
Confidence: 0.9
```

### 7. Severity Summary
| Finding | Severity | Urgency |
|---------|----------|---------|
| Sick Leave Denied | HIGH | Within 1 week |
| Annual Leave Denied | HIGH | Within 1 week |

### 8. Legal Basis
| Law | Section | Relevance |
|-----|---------|-----------|
| Fair Work Act 2009 | s.96 | Personal/carer's leave |
| Fair Work Act 2009 | s.87 | Annual leave |

### 9. Recommended Actions
1. **Request leave entitlements** - In writing
2. **Contact Fair Work** - File complaint
3. **Keep employment records** - Proof of part-time status

### 10. Evidence Checklist
| Evidence | Status | Priority |
|----------|--------|----------|
| Employment contract | COLLECTED | HIGH |
| Leave request records | MISSING | HIGH |
| Messages about leave denial | MISSING | HIGH |

---

## Case 029: 奶茶店员工被错误分类为实习生

### 1. 用户真实描述
```
老板说我是"实习生"，所以没有工资。
但实际上我跟其他员工做一样的工作。
每天工作6小时，一周5天。
已经做了2个月了，一分钱没拿到。
```

### 2. 已知事实
```json
{
  "employerIndustry": "food_service",
  "employerType": "bubble_tea",
  "classification": "intern",
  "hoursPerDay": 6,
  "daysPerWeek": 5,
  "weeklyHours": 30,
  "employmentDuration": "2 months",
  "paid": false,
  "productiveWork": true
}
```

### 3. 缺失事实
- 是否有实习协议
- 是否有学校参与
- 具体工作内容

### 4. Agent应该追问的问题
1. "你有没有签过实习协议？" (internship_agreement)
2. "这个实习是学校安排的吗？" (school_involved)
3. "你跟其他员工做一样的工作吗？" (same_work)
4. "你有没有说过你想要工资？" (requested_pay)

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "food_service",
  "employerType": "bubble_tea",
  "classification": "intern",
  "hoursPerDay": 6,
  "daysPerWeek": 5,
  "weeklyHours": 30,
  "employmentDuration": "PT2M",
  "paid": false,
  "productiveWork": true,
  "sameAsEmployees": true,
  "internshipAgreement": false,
  "schoolInvolved": false,
  "visaSubclass": "500",
  "overallCompleteness": 0.6,
  "averageConfidence": 0.85
}
```

### 6. Findings

#### Finding 029-A: 假实习(Sham Internship)
```
Name: Sham Internship
Description: Despite being classified as an intern, your arrangement 
is actually employment. You perform productive work, work regular hours, 
and are not part of a formal education program. You should be paid 
at minimum wage.
Estimated Owed: ~$7,932.00 (30 hrs × $33.05 × 8 weeks)
Severity: CRITICAL
Confidence: 0.9
```

### 7. Severity Summary
| Finding | Severity | Urgency |
|---------|----------|---------|
| Sham Internship | CRITICAL | Immediate |

### 8. Legal Basis
| Law | Section | Relevance |
|-----|---------|-----------|
| Fair Work Act 2009 | s.12 | Employee definition |
| Fair Work Act 2009 | s.284 | Minimum wage |

### 9. Recommended Actions
1. **Claim employee status** - You are an employee
2. **Request backpay** - Minimum wage for all hours
3. **Contact Fair Work** - File complaint
4. **Seek legal advice** - Community legal center

### 10. Evidence Checklist
| Evidence | Status | Priority |
|----------|--------|----------|
| Roster showing regular hours | MISSING | CRITICAL |
| Evidence of productive work | MISSING | HIGH |
| Messages about internship | MISSING | HIGH |

---

## Case 030: 奶茶店员工工资被拖欠

### 1. 用户真实描述
```
老板已经3周没发工资了。
每次问都说"下周给"。
我已经工作了45小时，应该拿$900。
现在连房租都交不起了。
```

### 2. 已知事实
```json
{
  "employerIndustry": "food_service",
  "employerType": "bubble_tea",
  "weeksOwed": 3,
  "hoursWorked": 45,
  "amountOwed": 900,
  "payRate": 20.00,
  "paymentDelayed": true
}
```

### 3. 缺失事实
- 是否有合同
- 工资单
- 支付方式

### 4. Agent应该追问的问题
1. "你有和老板的聊天记录吗？关于欠薪的？" (evidence)
2. "你还在继续工作吗？" (still_working)
3. "你有没有工资单？" (payslips)
4. "你之前工资是怎么发的？" (payment_method)

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "food_service",
  "employerType": "bubble_tea",
  "weeksOwed": 3,
  "hoursWorked": 45,
  "amountOwed": 900,
  "payRate": 20.00,
  "paymentDelayed": true,
  "stillWorking": true,
  "hasContract": false,
  "receivesPayslips": false,
  "visaSubclass": "500",
  "overallCompleteness": 0.55,
  "averageConfidence": 0.8
}
```

### 6. Findings

#### Finding 030-A: 拖欠工资
```
Name: Unpaid Wages
Description: Your employer owes you $900 for 45 hours of work. 
This is a breach of the Fair Work Act.
Severity: HIGH
Confidence: 0.95
```

### 7. Severity Summary
| Finding | Severity | Urgency |
|---------|----------|---------|
| Unpaid Wages | HIGH | Immediate |

### 8. Legal Basis
| Law | Section | Relevance |
|-----|---------|-----------|
| Fair Work Act 2009 | s.323 | Payment requirements |

### 9. Recommended Actions
1. **Send formal demand** - Written request for payment
2. **Contact Fair Work** - File complaint
3. **Stop working** - Consider stopping until paid

### 10. Evidence Checklist
| Evidence | Status | Priority |
|----------|--------|----------|
| Chat messages about unpaid wages | MISSING | CRITICAL |
| Roster showing hours worked | MISSING | HIGH |

---

## Case 031: 奶茶店员工被要求签放弃权利协议

### 1. 用户真实描述
```
老板让我签一份文件，说放弃所有加班费和罚款率的权利。
不签就不能来上班。
我没办法，只好签了。
```

### 2. 已知事实
```json
{
  "employerIndustry": "food_service",
  "employerType": "bubble_tea",
  "forcedToSignWaiver": true,
  "waiverContent": "overtime and penalty rates",
  "coerced": true
}
```

### 3. 缺失事实
- 文件具体内容
- 时薪
- 工作时间

### 4. Agent应该追问的问题
1. "你有没有那份文件的副本？" (waiver_document)
2. "你签的时候有没有其他人在场？" (witnesses)
3. "你的时薪是多少？" (pay_rate)
4. "你每周工作多少小时？" (hours)

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "food_service",
  "employerType": "bubble_tea",
  "forcedToSignWaiver": true,
  "waiverContent": "overtime and penalty rates",
  "coerced": true,
  "payRate": 20.00,
  "visaSubclass": "500",
  "overallCompleteness": 0.5,
  "averageConfidence": 0.8
}
```

### 6. Findings

#### Finding 031-A: 强迫签署放弃权利协议
```
Name: Coerced Waiver
Description: You were coerced to sign away your rights to overtime 
and penalty rates. Such waivers are generally unenforceable under 
Australian law.
Severity: HIGH
Confidence: 0.9
```

### 7. Severity Summary
| Finding | Severity | Urgency |
|---------|----------|---------|
| Coerced Waiver | HIGH | Within 1 week |

### 8. Legal Basis
| Law | Section | Relevance |
|-----|---------|-----------|
| Fair Work Act 2009 | s.326 | Unreasonable deductions |

### 9. Recommended Actions
1. **Waiver is likely unenforceable** - Seek legal advice
2. **Claim overtime and penalties** - You are still entitled
3. **Contact Fair Work** - File complaint

### 10. Evidence Checklist
| Evidence | Status | Priority |
|----------|--------|----------|
| Copy of waiver document | MISSING | HIGH |
| Messages about signing | MISSING | HIGH |

---

## Case 032: 奶茶店员工被要求使用个人手机处理工作

### 1. 用户真实描述
```
老板让我用自己手机接单、回复客户。
手机话费一个月多了$30多。
老板说不报销，说这是"工作需要"。
```

### 2. 已知事实
```json
{
  "employerIndustry": "food_service",
  "employerType": "bubble_tea",
  "personalPhoneRequired": true,
  "phoneCostIncrease": 30,
  "employerRefusesReimbursement": true
}
```

### 3. 缺失事实
- 合同中相关条款
- 工作性质

### 4. Agent应该追问的问题
1. "你的合同上有没有写使用个人手机的条款？" (contract_phone)
2. "你有没有保存手机话费账单？" (phone_bills)
3. "你有没有要求老板报销？" (requested_reimbursement)

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "food_service",
  "employerType": "bubble_tea",
  "personalPhoneRequired": true,
  "phoneCostIncrease": 30,
  "employerRefusesReimbursement": true,
  "contractIncludesPhone": false,
  "visaSubclass": "500",
  "overallCompleteness": 0.5,
  "averageConfidence": 0.75
}
```

### 6. Findings

#### Finding 032-A: 未报销工作相关费用
```
Name: Unreimbursed Work Expenses
Description: Using your personal phone for work purposes should be 
reimbursed by your employer. You are owed approximately $30/month.
Severity: LOW
Confidence: 0.7
```

### 7. Severity Summary
| Finding | Severity | Urgency |
|---------|----------|---------|
| Unreimbursed Expenses | LOW | When convenient |

### 8. Legal Basis
| Law | Section | Relevance |
|-----|---------|-----------|
| Fair Work Act 2009 | s.325 | Payment in full |

### 9. Recommended Actions
1. **Request reimbursement** - In writing
2. **Keep phone bills** - As evidence
3. **Consider refusing** - To use personal phone

### 10. Evidence Checklist
| Evidence | Status | Priority |
|----------|--------|----------|
| Phone bills | MISSING | MEDIUM |
| Messages about phone use | MISSING | MEDIUM |

---

## Case 033: 奶茶店员工被要求做超出职责范围的工作

### 1. 用户真实描述
```
我是做奶茶的，但是老板经常让我去送外卖。
送外卖没有额外工资，还是原来的钱。
有一次送外卖出了小车祸，老板说跟我没关系。
```

### 2. 已知事实
```json
{
  "employerIndustry": "food_service",
  "employerType": "bubble_tea",
  "jobTitle": "奶茶制作",
  "additionalDuties": "delivery",
  "additionalPay": false,
  "deliveryIncident": true,
  "employerDeniedResponsibility": true
}
```

### 3. 缺失事实
- 合同中职责范围
- 工伤情况
- 保险情况

### 4. Agent应该追问的问题
1. "你有没有受伤？" (injury)
2. "你有没有签过关于送外卖的协议？" (delivery_agreement)
3. "你的合同上写的工作内容是什么？" (contract_duties)
4. "你有没有报过工伤？" (injury_reported)

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "food_service",
  "employerType": "bubble_tea",
  "jobTitle": "奶茶制作",
  "additionalDuties": ["delivery"],
  "additionalPay": false,
  "deliveryIncident": true,
  "injuryOccurred": false,
  "employerDeniedResponsibility": true,
  "visaSubclass": "500",
  "overallCompleteness": 0.55,
  "averageConfidence": 0.75
}
```

### 6. Findings

#### Finding 033-A: 职责范围扩大未协商
```
Name: Duties Expanded Without Agreement
Description: You were required to perform delivery duties not in your 
original job description without additional pay or agreement.
Severity: MEDIUM
Confidence: 0.75
```

### 7. Severity Summary
| Finding | Severity | Urgency |
|---------|----------|---------|
| Duties Expanded | MEDIUM | Within 1 month |

### 8. Legal Basis
| Law | Section | Relevance |
|-----|---------|-----------|
| Fair Work Act 2009 | s.15 | Employment terms |

### 9. Recommended Actions
1. **Request formal role clarification** - In writing
2. **Request additional pay** - For extra duties
3. **Document all duties** - Keep records

### 10. Evidence Checklist
| Evidence | Status | Priority |
|----------|--------|----------|
| Messages about delivery duties | MISSING | HIGH |
| Original job description | MISSING | MEDIUM |

---

## Case 034: 奶茶店员工被要求参加无偿培训

### 1. 用户真实描述
```
老板每周三晚上让我们去店里培训2小时。
培训不给工资，说是"提升技能"。
已经连续4周了，总共8小时。
```

### 2. 已知事实
```json
{
  "employerIndustry": "food_service",
  "employerType": "bubble_tea",
  "trainingRequired": true,
  "trainingPaid": false,
  "trainingHoursPerWeek": 2,
  "trainingWeeks": 4,
  "totalTrainingHours": 8
}
```

### 3. 缺失事实
- 时薪
- 合同条款

### 4. Agent应该追问的问题
1. "你的时薪是多少？" (pay_rate)
2. "培训是强制的吗？" (mandatory)
3. "你的合同上有没有写培训的条款？" (contract_training)

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "food_service",
  "employerType": "bubble_tea",
  "trainingRequired": true,
  "trainingPaid": false,
  "trainingMandatory": true,
  "trainingHoursPerWeek": 2,
  "trainingWeeks": 4,
  "totalTrainingHours": 8,
  "payRate": 20.00,
  "visaSubclass": "500",
  "overallCompleteness": 0.55,
  "averageConfidence": 0.8
}
```

### 6. Findings

#### Finding 034-A: 无偿培训应支付工资
```
Name: Unpaid Training
Description: Mandatory training must be paid. You are owed for 8 hours 
of training.
Estimated Owed: ~$160
Severity: MEDIUM
Confidence: 0.85
```

### 7. Severity Summary
| Finding | Severity | Urgency |
|---------|----------|---------|
| Unpaid Training | MEDIUM | Within 1 month |

### 8. Legal Basis
| Law | Section | Relevance |
|-----|---------|-----------|
| Fair Work Act 2009 | s.323 | Payment for work |

### 9. Recommended Actions
1. **Request payment** - For training hours
2. **Keep training records** - Attendance

### 10. Evidence Checklist
| Evidence | Status | Priority |
|----------|--------|----------|
| Training schedule | MISSING | HIGH |
| Messages about mandatory training | MISSING | HIGH |

---

## Case 035: 奶茶店员工被不当解雇

### 1. 用户真实描述
```
我在奶茶店做了6个月，上周突然被炒了。
老板说我"服务态度不好"，但从来没给过警告。
而且前一天我刚问过为什么没有super。
```

### 2. 已知事实
```json
{
  "employerIndustry": "food_service",
  "employerType": "bubble_tea",
  "employmentDuration": "6 months",
  "dismissed": true,
  "dismissalReason": "poor service",
  "priorWarning": false,
  "priorComplaint": "asked about super"
}
```

### 3. 缺失事实
- 解雇日期
- 是否有书面通知
- 时间线

### 4. Agent应该追问的问题
1. "你是什么时候被炒的？" (dismissal_date)
2. "你问过super之后多久被炒的？" (timeline)
3. "老板有没有给过你任何警告？" (warnings)
4. "你有没有收到书面解雇通知？" (written_notice)

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "food_service",
  "employerType": "bubble_tea",
  "employmentDuration": "PT6M",
  "wasDismissed": true,
  "dismissalDate": "2026-05-28",
  "dismissalReason": "poor service",
  "priorWarning": false,
  "priorComplaintAboutSuper": true,
  "timeBetweenComplaintAndDismissal": "1 day",
  "visaSubclass": "500",
  "overallCompleteness": 0.6,
  "averageConfidence": 0.8
}
```

### 6. Findings

#### Finding 035-A: 可能的报复性解雇
```
Name: Potential Adverse Action
Description: You were dismissed the day after asking about superannuation. 
This may constitute adverse action for exercising a workplace right.
Severity: HIGH
Confidence: 0.85
```

### 7. Severity Summary
| Finding | Severity | Urgency |
|---------|----------|---------|
| Adverse Action | HIGH | Within 1 week |

### 8. Legal Basis
| Law | Section | Relevance |
|-----|---------|-----------|
| Fair Work Act 2009 | s.340 | Adverse action protections |

### 9. Recommended Actions
1. **File unfair dismissal claim** - Within 21 days
2. **Document timeline** - When you complained, when fired
3. **Contact Fair Work** - For advice

### 10. Evidence Checklist
| Evidence | Status | Priority |
|----------|--------|----------|
| Messages about super complaint | MISSING | CRITICAL |
| Evidence of dismissal | MISSING | HIGH |

---

## Case 036: 奶茶店员工没有super choice

### 1. 用户真实描述
```
老板帮我选了一个super基金，但是我从来没签过choice form。
我想用我自己的基金，老板说不行。
```

### 2. 已知事实
```json
{
  "employerIndustry": "food_service",
  "employerType": "bubble_tea",
  "superChoiceProvided": false,
  "employerChoseFund": true,
  "employeeWantsOwnFund": true
}
```

### 3. 缺失事实
- 目前super基金
- super支付情况

### 4. Agent应该追问的问题
1. "你知道老板帮你选的是哪个基金吗？" (current_fund)
2. "你有没有收到super choice form？" (choice_form)
3. "你的super有没有按时交？" (super_paid)

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "food_service",
  "employerType": "bubble_tea",
  "superChoiceProvided": false,
  "employerChoseFund": true,
  "employeeWantsOwnFund": true,
  "visaSubclass": "500",
  "overallCompleteness": 0.5,
  "averageConfidence": 0.8
}
```

### 6. Findings

#### Finding 036-A: 未提供Super Choice
```
Name: Missing Super Choice
Description: Your employer did not provide you with a superannuation 
choice form. You have the right to choose your own super fund.
Severity: MEDIUM
Confidence: 0.9
```

### 7. Severity Summary
| Finding | Severity | Urgency |
|---------|----------|---------|
| Missing Super Choice | MEDIUM | Within 1 month |

### 8. Legal Basis
| Law | Section | Relevance |
|-----|---------|-----------|
| Superannuation Guarantee Act 1992 | s.32C | Choice of fund |

### 9. Recommended Actions
1. **Request choice form** - You have the right to choose
2. **Contact ATO** - If employer refuses

### 10. Evidence Checklist
| Evidence | Status | Priority |
|----------|--------|----------|
| Messages about super choice | MISSING | MEDIUM |

---

## Case 037: 奶茶店员工工作环境不安全

### 1. 用户真实描述
```
店里的制冰机漏水，地板经常很滑。
我滑倒过一次，幸好没受伤。
老板说"小心点就行了"，不愿意修。
```

### 2. 已知事实
```json
{
  "employerIndustry": "food_service",
  "employerType": "bubble_tea",
  "hazardSlipperyFloor": true,
  "nearMiss": true,
  "employerAware": true,
  "employerRefusedFix": true
}
```

### 3. 缺失事实
- 是否有安全培训
- 是否有PPE

### 4. Agent应该追问的问题
1. "你有没有向任何部门投诉过？" (complaints)
2. "老板有没有提供防滑鞋？" (ppe)
3. "你有没有记录这个安全隐患？" (evidence)

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "food_service",
  "employerType": "bubble_tea",
  "workplaceHazards": ["slippery floor from leaking ice machine"],
  "nearMiss": true,
  "employerAware": true,
  "employerRefusedFix": true,
  "hasSafetyTraining": false,
  "ppeProvided": false,
  "visaSubclass": "500",
  "overallCompleteness": 0.55,
  "averageConfidence": 0.8
}
```

### 6. Findings

#### Finding 037-A: 工作环境不安全
```
Name: Unsafe Workplace
Description: Slippery floors from a leaking ice machine pose a safety 
risk. Your employer has refused to fix the issue.
Severity: MEDIUM
Confidence: 0.85
```

### 7. Severity Summary
| Finding | Severity | Urgency |
|---------|----------|---------|
| Unsafe Workplace | MEDIUM | Within 1 week |

### 8. Legal Basis
| Law | Section | Relevance |
|-----|---------|-----------|
| Work Health and Safety Act 2011 | s.19 | Duty of care |

### 9. Recommended Actions
1. **Report to SafeWork** - Safety breach
2. **Document hazards** - Photos
3. **Refuse unsafe work** - If necessary

### 10. Evidence Checklist
| Evidence | Status | Priority |
|----------|--------|----------|
| Photos of hazard | MISSING | HIGH |
| Messages to employer about safety | MISSING | HIGH |

---

## Case 038: 奶茶店员工被要求免费加班

### 1. 用户真实描述
```
每天下班后老板让我多留30分钟"整理一下"。
不给工资，说是"正常工作"。
一个月下来大概被少算了5小时。
```

### 2. 已知事实
```json
{
  "employerIndustry": "food_service",
  "employerType": "bubble_tea",
  "unpaidOvertimePerShift": 30,
  "unpaidOvertimeUnit": "minutes",
  "monthlyUnpaidHours": 5
}
```

### 3. 缺失事实
- 时薪
- 每月工作天数

### 4. Agent应该追问的问题
1. "你的时薪是多少？" (pay_rate)
2. "你每个月工作多少天？" (days_per_month)
3. "你有记录每天的下班时间吗？" (time_records)

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "food_service",
  "employerType": "bubble_tea",
  "unpaidOvertimePerShift": 30,
  "daysPerMonth": 20,
  "monthlyUnpaidHours": 5,
  "payRate": 20.00,
  "visaSubclass": "500",
  "overallCompleteness": 0.55,
  "averageConfidence": 0.8
}
```

### 6. Findings

#### Finding 038-A: 未支付加班时间
```
Name: Unpaid Overtime
Description: Time spent after your shift is work time and must be paid.
Estimated Owed: ~$100/month
Severity: MEDIUM
Confidence: 0.85
```

### 7. Severity Summary
| Finding | Severity | Urgency |
|---------|----------|---------|
| Unpaid Overtime | MEDIUM | Within 1 month |

### 8. Legal Basis
| Law | Section | Relevance |
|-----|---------|-----------|
| Fair Work Act 2009 | s.323 | Payment for hours worked |

### 9. Recommended Actions
1. **Keep time records** - Log actual end times
2. **Request payment** - For all hours worked

### 10. Evidence Checklist
| Evidence | Status | Priority |
|----------|--------|----------|
| Personal time records | MISSING | HIGH |

---

## Case 039: 奶茶店员工被种族歧视

### 1. 用户真实描述
```
老板当着客人的面说我"英文不好，笨"。
还说"你们中国人就是慢"。
其他员工也听到了。
我觉得很丢脸。
```

### 2. 已知事实
```json
{
  "employerIndustry": "food_service",
  "employerType": "bubble_tea",
  "discriminationType": ["racial"],
  "harassmentType": ["verbal abuse"],
  "publicHumiliation": true,
  "witnesses": true
}
```

### 3. 缺失事实
- 具体日期
- 其他事件
- 证据

### 4. Agent应该追问的问题
1. "你能告诉我具体的日期和时间吗？" (incident_date)
2. "有没有其他员工也受到同样的对待？" (other_victims)
3. "你有没有录音或者截图？" (evidence)
4. "你想继续在这家店工作吗？" (desired_outcome)

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "food_service",
  "employerType": "bubble_tea",
  "experiencedDiscrimination": true,
  "discriminationType": ["racial"],
  "experiencedHarassment": true,
  "harassmentType": ["verbal abuse"],
  "publicHumiliation": true,
  "witnessesExist": true,
  "visaSubclass": "500",
  "overallCompleteness": 0.5,
  "averageConfidence": 0.75
}
```

### 6. Findings

#### Finding 039-A: 种族歧视
```
Name: Racial Discrimination
Description: You are experiencing racial discrimination in the workplace.
Severity: HIGH
Confidence: 0.85
```

### 7. Severity Summary
| Finding | Severity | Urgency |
|---------|----------|---------|
| Racial Discrimination | HIGH | Within 1 week |

### 8. Legal Basis
| Law | Section | Relevance |
|-----|---------|-----------|
| Racial Discrimination Act 1975 | s.9 | Racial discrimination |

### 9. Recommended Actions
1. **Document incidents** - Keep records
2. **Report to AHRC** - Human Rights Commission
3. **Seek support** - Migrant worker center

### 10. Evidence Checklist
| Evidence | Status | Priority |
|----------|--------|----------|
| Incident diary | MISSING | HIGH |
| Witness statements | MISSING | HIGH |

---

## Case 040: 奶茶店员工被要求支付客户退款

### 1. 用户真实描述
```
有客人投诉奶茶不好喝要求退款。
老板说从我工资里扣$15。
我一个月才赚$1600，被扣了$15。
这合理吗？
```

### 2. 已知事实
```json
{
  "employerIndustry": "food_service",
  "employerType": "bubble_tea",
  "deductionForRefund": true,
  "deductionAmount": 15,
  "monthlyPay": 1600
}
```

### 3. 缺失事实
- 合同条款
- 是否同意扣款

### 4. Agent应该追问的问题
1. "你的合同上有没有写这个扣款条款？" (contract_deduction)
2. "你有没有同意过这个扣款？" (consent)
3. "工资单上有没有显示这个扣款？" (payslip_deduction)

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "food_service",
  "employerType": "bubble_tea",
  "deductionForRefund": true,
  "deductionAmount": 15,
  "contractIncludesDeduction": false,
  "employeeConsented": false,
  "monthlyPay": 1600,
  "visaSubclass": "500",
  "overallCompleteness": 0.55,
  "averageConfidence": 0.8
}
```

### 6. Findings

#### Finding 040-A: 不当扣款
```
Name: Unlawful Deduction
Description: Deducting customer refunds from your pay is not a permitted 
deduction under the Fair Work Act.
Severity: MEDIUM
Confidence: 0.85
```

### 7. Severity Summary
| Finding | Severity | Urgency |
|---------|----------|---------|
| Unlawful Deduction | MEDIUM | Within 1 month |

### 8. Legal Basis
| Law | Section | Relevance |
|-----|---------|-----------|
| Fair Work Act 2009 | s.324 | Permitted deductions |

### 9. Recommended Actions
1. **Request refund** - For amount deducted
2. **Refuse future deductions** - Without proper basis
3. **Contact Fair Work** - For advice

### 10. Evidence Checklist
| Evidence | Status | Priority |
|----------|--------|----------|
| Payslips showing deduction | MISSING | HIGH |
| Messages about deduction | MISSING | MEDIUM |

---

*End of Bubble Tea Cases (021-040)*
