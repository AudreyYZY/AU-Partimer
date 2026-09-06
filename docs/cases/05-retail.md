# 零售行业案例 Retail Industry Cases

**Cases: 081-100**

---

## Case 081: 零售店员时薪低于最低工资

### 1. 用户真实描述
```
我在一家便利店打工，每小时$18现金。
一周工作20小时，周末也要上班。
没有合同，没有工资单。
老板说便利店就是这个价。
```

### 2. 已知事实
```json
{
  "employerIndustry": "retail",
  "employerType": "convenience_store",
  "jobTitle": "店员",
  "payRate": 18.00,
  "paymentMethod": "cash",
  "hoursPerWeek": 20,
  "workOnWeekends": true,
  "hasContract": false,
  "receivesPayslips": false
}
```

### 3. 缺失事实
- 雇主信息
- 签证类型
- 是否有super
- 是否有试工
- 具体工作时间

### 4. Agent应该追问的问题
1. "你的签证是什么类型？" (visa_subclass)
2. "老板有没有给你交super？" (super)
3. "你周末工资和平时一样吗？" (penalty_rates)
4. "你有没有做过试工？" (trial_shift)
5. "你能提供你和老板的聊天记录吗？" (evidence)

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "retail",
  "employerType": "convenience_store",
  "jobTitle": "店员",
  "employmentStatus": "casual",
  "payRate": 18.00,
  "paymentMethod": "cash",
  "cashPaymentPercentage": 100,
  "hoursPerWeek": 20,
  "workOnWeekends": true,
  "hasContract": false,
  "receivesPayslips": false,
  "receivesSuper": false,
  "tfnProvided": false,
  "visaSubclass": "500",
  "overallCompleteness": 0.6,
  "averageConfidence": 0.75
}
```

### 6. Findings

#### Finding 081-A: 低于最低工资
```
Name: Below National Minimum Wage
Description: Your hourly rate of $18.00 is below the national minimum wage 
of $26.44 per hour. As a casual employee, you should receive at least 
$33.05 per hour.
Severity: CRITICAL
Confidence: 0.95
```

#### Finding 081-B: 无工资单
```
Name: Missing Payslips
Description: Your employer is not providing payslips.
Severity: HIGH
Confidence: 0.9
```

#### Finding 081-C: 无养老金
```
Name: Missing Superannuation
Description: Your employer is not paying superannuation.
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
| General Retail Industry Award 2020 | Clause 14 | Minimum rates |

### 9. Recommended Actions
1. **Calculate underpayment** - $33.05 - $18.00 = $15.05/hr owed
2. **Report to ATO** - Unpaid super
3. **Keep evidence** - Chat messages

### 10. Evidence Checklist
| Evidence | Status | Priority |
|----------|--------|----------|
| Chat history with employer | COLLECTED | HIGH |
| Roster screenshots | MISSING | HIGH |

---

## Case 082: 零售店员周末无罚款率

### 1. 用户真实描述
```
我在一家服装店工作，周末工资跟平时一样，$22一小时。
老板说零售业没有周末加班费。
我一周工作25小时，周末占了10小时。
```

### 2. 已知事实
```json
{
  "employerIndustry": "retail",
  "employerType": "clothing_store",
  "payRate": 22.00,
  "weekendRateSame": true,
  "receivesPenaltyRates": false,
  "hoursPerWeek": 25,
  "weekendHours": 10
}
```

### 3. 缺失事实
- 合同情况
- 工资单
- 具体工作时间

### 4. Agent应该追问的问题
1. "你的合同上有没有写罚款率？" (contract_penalty)
2. "你有工资单吗？" (payslips)
3. "你是casual还是part-time？" (employment_status)
4. "你公共假日上班吗？" (public_holiday)

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "retail",
  "employerType": "clothing_store",
  "employmentStatus": "casual",
  "payRate": 22.00,
  "receivesPenaltyRates": false,
  "weekendRate": 22.00,
  "hoursPerWeek": 25,
  "weekendHours": 10,
  "visaSubclass": "500",
  "overallCompleteness": 0.6,
  "averageConfidence": 0.8
}
```

### 6. Findings

#### Finding 082-A: 缺少周末罚款率
```
Name: Missing Weekend Penalty Rates
Description: Under the General Retail Industry Award, casual employees 
working on Saturdays should receive 125% and Sundays 150% of their 
base rate.
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
| General Retail Industry Award 2020 | Clause 23 | Penalty rates |

### 9. Recommended Actions
1. **Calculate underpayment** - Saturday: $27.50/hr, Sunday: $33/hr
2. **Request backpay** - From employer
3. **Contact Fair Work** - File complaint

### 10. Evidence Checklist
| Evidence | Status | Priority |
|----------|--------|----------|
| Roster showing weekend shifts | MISSING | HIGH |
| Payslips showing base rate only | MISSING | HIGH |

---

## Case 083: 零售店员无薪试工

### 1. 用户真实描述
```
去一家超市应聘，老板让我试工一天，看看能不能做。
试工从早上9点到下午5点，8个小时。
试工结束后老板说可以，但是试工那天没有工资。
```

### 2. 已知事实
```json
{
  "employerIndustry": "retail",
  "employerType": "supermarket",
  "hadTrialShift": true,
  "trialShiftDuration": "8 hours",
  "trialShiftPaid": false,
  "trialShiftOutcome": "hired"
}
```

### 3. 缺失事实
- 试工日期
- 试工具体工作内容
- 时薪

### 4. Agent应该追问的问题
1. "试工那天你具体做了什么工作？" (trial_tasks)
2. "试工是哪一天？" (trial_date)
3. "试工结束后你的工资是多少？" (pay_rate)
4. "你有和老板的聊天记录吗？" (evidence)

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "retail",
  "employerType": "supermarket",
  "hadTrialShift": true,
  "trialShiftDate": "2026-05-10",
  "trialShiftDuration": "PT8H",
  "trialShiftPaid": false,
  "trialShiftTasks": ["stacking shelves", "serving customers", "cleaning"],
  "trialShiftOutcome": "hired",
  "trialShiftProductive": true,
  "trialShiftExcessive": true,
  "payRate": 22.00,
  "visaSubclass": "500",
  "overallCompleteness": 0.55,
  "averageConfidence": 0.7
}
```

### 6. Findings

#### Finding 083-A: 无薪试工应支付工资
```
Name: Unpaid Trial Shift
Description: Your 8-hour trial shift involved productive work. Under 
Fair Work guidelines, trial shifts involving productive work should be 
paid at the minimum rate.
Amount Owed: ~$264.40 (8 hours × $33.05)
Severity: HIGH
Confidence: 0.85
```

### 7. Severity Summary
| Finding | Severity | Urgency |
|---------|----------|---------|
| Unpaid Trial | HIGH | Within 1 week |

### 8. Legal Basis
| Law | Section | Relevance |
|-----|---------|-----------|
| Fair Work Act 2009 | s.284 | Minimum wage for work |

### 9. Recommended Actions
1. **Request payment** - For 8 hours
2. **Keep evidence** - Chat messages

### 10. Evidence Checklist
| Evidence | Status | Priority |
|----------|--------|----------|
| Chat messages about trial | MISSING | HIGH |
| Trial date confirmation | MISSING | MEDIUM |

---

## Case 084: 零售店员被拖欠工资

### 1. 用户真实描述
```
超市已经2周没发工资了。
每次问老板，都说"下周给"。
我已经工作了60小时，应该拿$1320。
```

### 2. 已知事实
```json
{
  "employerIndustry": "retail",
  "employerType": "supermarket",
  "weeksOwed": 2,
  "hoursWorked": 60,
  "amountOwed": 1320,
  "payRate": 22.00,
  "paymentDelayed": true
}
```

### 3. 缺失事实
- 是否有合同
- 工资单
- 支付方式

### 4. Agent应该追问的问题
1. "你有和老板的聊天记录吗？" (evidence)
2. "你还在继续工作吗？" (still_working)
3. "你有没有工资单？" (payslips)

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "retail",
  "employerType": "supermarket",
  "weeksOwed": 2,
  "hoursWorked": 60,
  "amountOwed": 1320,
  "payRate": 22.00,
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

#### Finding 084-A: 拖欠工资
```
Name: Unpaid Wages
Description: Your employer owes you $1,320 for 60 hours of work.
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
1. **Send formal demand** - Written request
2. **Contact Fair Work** - File complaint

### 10. Evidence Checklist
| Evidence | Status | Priority |
|----------|--------|----------|
| Chat messages about unpaid wages | MISSING | CRITICAL |
| Roster showing hours worked | MISSING | HIGH |

---

## Case 085: 零售店员没有年假

### 1. 用户真实描述
```
我在一家零售店做full-time，做了1年半了。
想请年假，老板说casual没有年假。
但我的合同写的是full-time。
```

### 2. 已知事实
```json
{
  "employerIndustry": "retail",
  "employmentStatus": "full-time",
  "employmentDuration": "18 months",
  "annualLeaveDenied": true,
  "contractStatus": "full-time"
}
```

### 3. 缺失事实
- 工资单
- 具体合同内容

### 4. Agent应该追问的问题
1. "你的合同上写的是full-time还是casual？" (contract_status)
2. "你有工资单吗？工资单上有没有显示年假余额？" (payslips)
3. "你请假的时候工资有没有被扣？" (leave_deducted)

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "retail",
  "employmentStatus": "full-time",
  "hasWrittenContract": true,
  "contractStatus": "full-time",
  "employmentDuration": "PT18M",
  "annualLeaveEntitled": true,
  "annualLeaveGranted": false,
  "visaSubclass": "500",
  "overallCompleteness": 0.65,
  "averageConfidence": 0.8
}
```

### 6. Findings

#### Finding 085-A: 未提供年假
```
Name: Annual Leave Denied
Description: As a full-time employee, you are entitled to 4 weeks paid 
annual leave per year.
Severity: HIGH
Confidence: 0.9
```

### 7. Severity Summary
| Finding | Severity | Urgency |
|---------|----------|---------|
| Annual Leave Denied | HIGH | Within 1 week |

### 8. Legal Basis
| Law | Section | Relevance |
|-----|---------|-----------|
| Fair Work Act 2009 | s.87 | Annual leave entitlement |

### 9. Recommended Actions
1. **Request leave in writing** - Formal request
2. **Contact Fair Work** - File complaint

### 10. Evidence Checklist
| Evidence | Status | Priority |
|----------|--------|----------|
| Employment contract | COLLECTED | HIGH |
| Leave request records | MISSING | HIGH |

---

## Case 086: 零售店员被要求签放弃权利协议

### 1. 用户真实描述
```
老板让我签一份文件，说放弃所有加班费和罚款率的权利。
不签就不能来上班。
我没办法，只好签了。
```

### 2. 已知事实
```json
{
  "employerIndustry": "retail",
  "forcedToSignWaiver": true,
  "waiverContent": "overtime and penalty rates",
  "coerced": true
}
```

### 3. 缺失事实
- 文件具体内容
- 是否有副本

### 4. Agent应该追问的问题
1. "你有没有那份文件的副本？" (waiver_document)
2. "你签的时候有没有其他人在场？" (witnesses)

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "retail",
  "forcedToSignWaiver": true,
  "waiverContent": "overtime and penalty rates",
  "coerced": true,
  "visaSubclass": "500",
  "overallCompleteness": 0.5,
  "averageConfidence": 0.8
}
```

### 6. Findings

#### Finding 086-A: 强迫签署放弃权利协议
```
Name: Coerced Waiver
Description: You were coerced to sign away your rights to overtime 
and penalty rates. Such waivers are generally unenforceable.
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

### 10. Evidence Checklist
| Evidence | Status | Priority |
|----------|--------|----------|
| Copy of waiver document | MISSING | HIGH |

---

## Case 087: 零售店员被要求免费加班

### 1. 用户真实描述
```
每天下班后老板让我多留30分钟"整理货架"。
不给工资，说是"工作的一部分"。
一个月下来大概被少算了10小时。
```

### 2. 已知事实
```json
{
  "employerIndustry": "retail",
  "unpaidOvertimePerShift": 30,
  "monthlyUnpaidHours": 10,
  "employerExcuse": "part of the job"
}
```

### 3. 缺失事实
- 时薪
- 每月工作天数

### 4. Agent应该追问的问题
1. "你的时薪是多少？" (pay_rate)
2. "你每个月工作多少天？" (days_per_month)
3. "你有没有记录每天的下班时间？" (time_records)

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "retail",
  "unpaidOvertimePerShift": 30,
  "daysPerMonth": 20,
  "monthlyUnpaidHours": 10,
  "payRate": 22.00,
  "visaSubclass": "500",
  "overallCompleteness": 0.55,
  "averageConfidence": 0.8
}
```

### 6. Findings

#### Finding 087-A: 未支付加班时间
```
Name: Unpaid Overtime
Description: Time spent after your shift is work time and must be paid.
Estimated Owed: ~$220/month
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

## Case 088: 零售店员被扣工资买制服

### 1. 用户真实描述
```
老板让我买制服，一件$60，从工资里扣。
我一个月才赚$1800，被扣了$60。
而且制服质量很差，洗了几次就坏了。
```

### 2. 已知事实
```json
{
  "employerIndustry": "retail",
  "uniformRequired": true,
  "uniformCost": 60,
  "deductedFromPay": true,
  "qualityPoor": true,
  "monthlyPay": 1800
}
```

### 3. 缺失事实
- 合同中制服条款
- 是否同意扣款

### 4. Agent应该追问的问题
1. "你的合同上有没有写制服的条款？" (contract_uniform)
2. "工资单上有没有显示制服扣款？" (payslip_deduction)
3. "你有没有同意购买制服？" (consent)

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "retail",
  "uniformRequired": true,
  "uniformCost": 60,
  "deductedFromPay": true,
  "qualityPoor": true,
  "contractIncludesUniform": false,
  "employeeConsented": false,
  "monthlyPay": 1800,
  "visaSubclass": "500",
  "overallCompleteness": 0.55,
  "averageConfidence": 0.8
}
```

### 6. Findings

#### Finding 088-A: 不当制服扣款
```
Name: Unlawful Uniform Deduction
Description: Deducting uniform costs from pay without proper agreement 
may be unlawful.
Severity: MEDIUM
Confidence: 0.75
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
1. **Request refund** - For uniform costs
2. **Refuse future deductions** - Without proper agreement

### 10. Evidence Checklist
| Evidence | Status | Priority |
|----------|--------|----------|
| Payslips showing deduction | MISSING | HIGH |
| Receipts for uniform | MISSING | MEDIUM |

---

## Case 089: 零售店员没有super choice

### 1. 用户真实描述
```
老板帮我选了一个super基金，但是我从来没签过choice form。
我想用我自己的基金，老板说不行。
```

### 2. 已知事实
```json
{
  "employerIndustry": "retail",
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
  "employerIndustry": "retail",
  "superChoiceProvided": false,
  "employerChoseFund": true,
  "employeeWantsOwnFund": true,
  "visaSubclass": "500",
  "overallCompleteness": 0.5,
  "averageConfidence": 0.8
}
```

### 6. Findings

#### Finding 089-A: 未提供Super Choice
```
Name: Missing Super Choice
Description: Your employer did not provide you with a superannuation 
choice form.
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

## Case 090: 零售店员被歧视

### 1. 用户真实描述
```
老板说我"留学生就是来混的"。
还说"你们亚洲人就是慢"。
其他员工也听到了。
```

### 2. 已知事实
```json
{
  "employerIndustry": "retail",
  "discriminationType": ["racial"],
  "harassmentType": ["verbal abuse"],
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

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "retail",
  "experiencedDiscrimination": true,
  "discriminationType": ["racial"],
  "experiencedHarassment": true,
  "harassmentType": ["verbal abuse"],
  "witnessesExist": true,
  "visaSubclass": "500",
  "overallCompleteness": 0.5,
  "averageConfidence": 0.75
}
```

### 6. Findings

#### Finding 090-A: 种族歧视
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

### 10. Evidence Checklist
| Evidence | Status | Priority |
|----------|--------|----------|
| Incident diary | MISSING | HIGH |
| Witness statements | MISSING | HIGH |

---

## Case 091: 零售店员被不当解雇

### 1. 用户真实描述
```
我在一家零售店做了8个月，上周突然被炒了。
老板说"生意不好要裁员"，但是马上就请了新人。
我觉得是因为我之前问过为什么没有super。
```

### 2. 已知事实
```json
{
  "employerIndustry": "retail",
  "employmentDuration": "8 months",
  "dismissed": true,
  "dismissalReason": "redundancy",
  "replacementHired": true,
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

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "retail",
  "employmentDuration": "PT8M",
  "wasDismissed": true,
  "dismissalDate": "2026-05-25",
  "dismissalReason": "redundancy",
  "replacementHired": true,
  "priorComplaintAboutSuper": true,
  "timeBetweenComplaintAndDismissal": "2 weeks",
  "visaSubclass": "500",
  "overallCompleteness": 0.6,
  "averageConfidence": 0.8
}
```

### 6. Findings

#### Finding 091-A: 可能的报复性解雇
```
Name: Potential Adverse Action
Description: You were dismissed shortly after asking about superannuation. 
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

### 10. Evidence Checklist
| Evidence | Status | Priority |
|----------|--------|----------|
| Messages about super complaint | MISSING | CRITICAL |

---

## Case 092: 零售店员被要求做超出职责的工作

### 1. 用户真实描述
```
我是做收银的，但是老板让我去仓库搬货。
搬货不在我的工作范围内。
而且搬重物很容易受伤。
```

### 2. 已知事实
```json
{
  "employerIndustry": "retail",
  "jobTitle": "收银员",
  "additionalDuties": "warehouse work",
  "notInJobDescription": true,
  "injuryRisk": true
}
```

### 3. 缺失事实
- 合同职责范围
- 是否拒绝过

### 4. Agent应该追问的问题
1. "你的合同上写的工作内容是什么？" (contract_duties)
2. "你有没有拒绝过搬货？" (refused_task)
3. "你有没有受过伤？" (injury)

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "retail",
  "jobTitle": "收银员",
  "additionalDuties": ["warehouse work"],
  "notInJobDescription": true,
  "injuryRisk": true,
  "visaSubclass": "500",
  "overallCompleteness": 0.5,
  "averageConfidence": 0.75
}
```

### 6. Findings

#### Finding 092-A: 职责范围扩大未协商
```
Name: Duties Expanded Without Agreement
Description: You were required to perform warehouse duties not in your 
original job description.
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
2. **Refuse unsafe duties** - If injury risk

### 10. Evidence Checklist
| Evidence | Status | Priority |
|----------|--------|----------|
| Messages about warehouse duties | MISSING | HIGH |

---

## Case 093: 零售店员没有病假

### 1. 用户真实描述
```
我生病请假，老板说没有工资。
我做part-time已经1年了。
老板说casual没有sick leave。
但我的合同写的是part-time。
```

### 2. 已知事实
```json
{
  "employerIndustry": "retail",
  "employmentStatus": "part-time",
  "employmentDuration": "1 year",
  "sickLeaveDenied": true,
  "contractStatus": "part-time"
}
```

### 3. 缺失事实
- 每周工作小时数
- 工资单

### 4. Agent应该追问的问题
1. "你每周工作多少小时？" (hours_per_week)
2. "你的合同上写的是casual还是part-time？" (contract_status)
3. "你有工资单吗？" (payslips)

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "retail",
  "employmentStatus": "part-time",
  "hasWrittenContract": true,
  "contractStatus": "part-time",
  "employmentDuration": "PT1Y",
  "hoursPerWeek": 20,
  "sickLeaveEntitled": true,
  "sickLeaveGranted": false,
  "visaSubclass": "500",
  "overallCompleteness": 0.6,
  "averageConfidence": 0.8
}
```

### 6. Findings

#### Finding 093-A: 未提供病假
```
Name: Sick Leave Denied
Description: As a part-time employee, you are entitled to paid sick 
leave on a pro-rata basis.
Severity: HIGH
Confidence: 0.9
```

### 7. Severity Summary
| Finding | Severity | Urgency |
|---------|----------|---------|
| Sick Leave Denied | HIGH | Within 1 week |

### 8. Legal Basis
| Law | Section | Relevance |
|-----|---------|-----------|
| Fair Work Act 2009 | s.96 | Personal/carer's leave |

### 9. Recommended Actions
1. **Request sick leave** - In writing
2. **Contact Fair Work** - File complaint

### 10. Evidence Checklist
| Evidence | Status | Priority |
|----------|--------|----------|
| Employment contract | COLLECTED | HIGH |
| Leave request records | MISSING | HIGH |

---

## Case 094: 零售店员被要求参加无偿培训

### 1. 用户真实描述
```
老板让我参加产品培训，但是不给工资。
培训是周六，4小时。
说是"必须参加"，但是不给钱。
```

### 2. 已知事实
```json
{
  "employerIndustry": "retail",
  "trainingRequired": true,
  "trainingPaid": false,
  "trainingDuration": 4,
  "trainingDay": "Saturday",
  "trainingMandatory": true
}
```

### 3. 缺失事实
- 时薪
- 合同条款

### 4. Agent应该追问的问题
1. "你的时薪是多少？" (pay_rate)
2. "你的合同上有没有写培训的条款？" (contract_training)

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "retail",
  "trainingRequired": true,
  "trainingPaid": false,
  "trainingDuration": 4,
  "trainingDay": "Saturday",
  "trainingMandatory": true,
  "payRate": 22.00,
  "visaSubclass": "500",
  "overallCompleteness": 0.55,
  "averageConfidence": 0.8
}
```

### 6. Findings

#### Finding 094-A: 无偿培训应支付工资
```
Name: Unpaid Mandatory Training
Description: Mandatory training must be paid. You are owed for 4 hours.
Estimated Owed: ~$88
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

### 10. Evidence Checklist
| Evidence | Status | Priority |
|----------|--------|----------|
| Training schedule | MISSING | HIGH |

---

## Case 095: 零售店员被要求使用个人手机

### 1. 用户真实描述
```
老板让我用自己手机接单、回复客户。
手机话费一个月多了$40多。
老板说不报销，说这是"工作需要"。
```

### 2. 已知事实
```json
{
  "employerIndustry": "retail",
  "personalPhoneRequired": true,
  "phoneCostIncrease": 40,
  "employerRefusesReimbursement": true
}
```

### 3. 缺失事实
- 合同中相关条款

### 4. Agent应该追问的问题
1. "你的合同上有没有写使用个人手机的条款？" (contract_phone)
2. "你有没有保存手机话费账单？" (phone_bills)

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "retail",
  "personalPhoneRequired": true,
  "phoneCostIncrease": 40,
  "employerRefusesReimbursement": true,
  "contractIncludesPhone": false,
  "visaSubclass": "500",
  "overallCompleteness": 0.5,
  "averageConfidence": 0.75
}
```

### 6. Findings

#### Finding 095-A: 未报销工作相关费用
```
Name: Unreimbursed Work Expenses
Description: Using your personal phone for work purposes should be 
reimbursed by your employer.
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

### 10. Evidence Checklist
| Evidence | Status | Priority |
|----------|--------|----------|
| Phone bills | MISSING | MEDIUM |

---

## Case 096: 零售店员被要求在不安全的环境中工作

### 1. 用户真实描述
```
店铺的灭火器过期了，我跟老板说过好几次。
老板说"没钱修"。
而且紧急出口被货物堵住了。
```

### 2. 已知事实
```json
{
  "employerIndustry": "retail",
  "hazardExpiredFireExtinguisher": true,
  "hazardBlockedExit": true,
  "employerAware": true,
  "employerRefusedFix": true
}
```

### 3. 缺失事实
- 是否有安全培训
- 是否有事故记录

### 4. Agent应该追问的问题
1. "你有没有向任何部门投诉过？" (complaints)
2. "你有没有记录这些安全隐患？" (evidence)

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "retail",
  "workplaceHazards": ["expired fire extinguisher", "blocked emergency exit"],
  "employerAware": true,
  "employerRefusedFix": true,
  "hasSafetyTraining": false,
  "visaSubclass": "500",
  "overallCompleteness": 0.55,
  "averageConfidence": 0.8
}
```

### 6. Findings

#### Finding 096-A: 工作环境不安全
```
Name: Unsafe Workplace
Description: Multiple safety hazards exist: expired fire extinguisher and 
blocked emergency exit. Your employer has a duty to provide a safe workplace.
Severity: HIGH
Confidence: 0.9
```

### 7. Severity Summary
| Finding | Severity | Urgency |
|---------|----------|---------|
| Unsafe Workplace | HIGH | Immediate |

### 8. Legal Basis
| Law | Section | Relevance |
|-----|---------|-----------|
| Work Health and Safety Act 2011 | s.19 | Duty of care |

### 9. Recommended Actions
1. **Report to SafeWork** - Immediately
2. **Document hazards** - Photos

### 10. Evidence Checklist
| Evidence | Status | Priority |
|----------|--------|----------|
| Photos of hazards | MISSING | HIGH |
| Messages to employer about safety | MISSING | HIGH |

---

## Case 097: 零售店员被要求在极端天气工作

### 1. 用户真实描述
```
夏天店铺里面没有空调，热得要死。
老板说"忍忍就好了"。
有人中暑了，老板说"喝点水就好了"。
```

### 2. 已知事实
```json
{
  "employerIndustry": "retail",
  "extremeHeat": true,
  "noAirConditioning": true,
  "heatstrokeIncident": true,
  "employerMinimizedRisk": true
}
```

### 3. 缺失事实
- 是否有安全培训
- 是否有PPE

### 4. Agent应该追问的问题
1. "你有没有受过热伤？" (heat_injury)
2. "老板有没有提供水和休息？" (water_rest)
3. "你有没有记录这些安全隐患？" (evidence)

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "retail",
  "extremeHeat": true,
  "noAirConditioning": true,
  "heatstrokeIncident": true,
  "employerMinimizedRisk": true,
  "waterProvided": false,
  "restBreaksInadequate": true,
  "visaSubclass": "500",
  "overallCompleteness": 0.55,
  "averageConfidence": 0.8
}
```

### 6. Findings

#### Finding 097-A: 极端天气安全隐患
```
Name: Extreme Weather Hazards
Description: Working in extreme heat without air conditioning poses 
serious health risks.
Severity: MEDIUM
Confidence: 0.85
```

### 7. Severity Summary
| Finding | Severity | Urgency |
|---------|----------|---------|
| Extreme Weather Hazards | MEDIUM | Within 1 week |

### 8. Legal Basis
| Law | Section | Relevance |
|-----|---------|-----------|
| Work Health and Safety Act 2011 | s.19 | Duty of care |

### 9. Recommended Actions
1. **Report to SafeWork** - Safety breach
2. **Request air conditioning** - In writing

### 10. Evidence Checklist
| Evidence | Status | Priority |
|----------|--------|----------|
| Temperature records | MISSING | HIGH |
| Messages about conditions | MISSING | HIGH |

---

## Case 098: 零售店员被要求免费清洁

### 1. 用户真实描述
```
每天下班后要留下来打扫卫生，大概30分钟。
老板说这是"分内工作"，不给工资。
一个月下来大概被扣了10小时的清洁时间。
```

### 2. 已知事实
```json
{
  "employerIndustry": "retail",
  "unpaidCleaningTime": 30,
  "monthlyUnpaidHours": 10
}
```

### 3. 缺失事实
- 时薪
- 每月工作天数

### 4. Agent应该追问的问题
1. "你的时薪是多少？" (pay_rate)
2. "你每个月工作多少天？" (days_per_month)

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "retail",
  "unpaidCleaningTimePerShift": 30,
  "daysPerMonth": 20,
  "monthlyUnpaidHours": 10,
  "payRate": 22.00,
  "visaSubclass": "500",
  "overallCompleteness": 0.55,
  "averageConfidence": 0.8
}
```

### 6. Findings

#### Finding 098-A: 未支付清洁时间
```
Name: Unpaid Cleaning Time
Description: Time spent cleaning after your shift is work time and 
must be paid.
Estimated Owed: ~$220/month
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

### 10. Evidence Checklist
| Evidence | Status | Priority |
|----------|--------|----------|
| Personal time records | MISSING | HIGH |

---

## Case 099: 零售店员被错误分类为承包商

### 1. 用户真实描述
```
老板说我是contractor，让我自己开发票。
但实际上我每天按照老板的时间上班，用老板的设备。
工资是固定的一周$800。
```

### 2. 已知事实
```json
{
  "employerIndustry": "retail",
  "classification": "contractor",
  "weeklyPay": 800,
  "fixedSchedule": true,
  "usesEmployerEquipment": true,
  "directedByEmployer": true
}
```

### 3. 缺失事实
- 是否有ABN
- 是否自己开发票
- 工作时间

### 4. Agent应该追问的问题
1. "你有没有ABN？" (has_abn)
2. "你需要自己开发票吗？" (invoices)
3. "你能决定自己的工作时间吗？" (controls_hours)

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "retail",
  "classification": "contractor",
  "weeklyPay": 800,
  "fixedSchedule": true,
  "usesEmployerEquipment": true,
  "directedByEmployer": true,
  "controlsHours": false,
  "canSubstitute": false,
  "hasAbn": false,
  "invoicesRequired": false,
  "receivesSuper": false,
  "isEmployeeDeFacto": true,
  "visaSubclass": "500",
  "overallCompleteness": 0.6,
  "averageConfidence": 0.8
}
```

### 6. Findings

#### Finding 099-A: 假承包商
```
Name: Sham Contracting
Description: Despite being classified as a contractor, your working 
arrangement indicates you are actually an employee.
Severity: CRITICAL
Confidence: 0.9
```

### 7. Severity Summary
| Finding | Severity | Urgency |
|---------|----------|---------|
| Sham Contracting | CRITICAL | Immediate |

### 8. Legal Basis
| Law | Section | Relevance |
|-----|---------|-----------|
| Fair Work Act 2009 | s.357 | Sham contracting |

### 9. Recommended Actions
1. **Document working arrangement** - Keep evidence
2. **Report to Fair Work** - Sham contracting

### 10. Evidence Checklist
| Evidence | Status | Priority |
|----------|--------|----------|
| Roster showing fixed hours | MISSING | CRITICAL |
| Messages showing employer direction | MISSING | HIGH |

---

## Case 100: 零售店员被威胁解雇

### 1. 用户真实描述
```
老板说如果我告诉别人我的工资，就炒了我。
还说如果我去投诉，就让同行都不请我。
我觉得老板是在威胁我，因为我的工资比别人低。
```

### 2. 已知事实
```json
{
  "employerIndustry": "retail",
  "threatenedDismissal": true,
  "threatReason": "discussing pay",
  "blacklistingThreat": true,
  "payBelowMarket": true
}
```

### 3. 缺失事实
- 具体工资数额
- 合同情况
- 证据

### 4. Agent应该追问的问题
1. "你有老板威胁你的证据吗？" (evidence)
2. "你的时薪是多少？" (pay_rate)
3. "你知道同事的工资吗？" (colleague_pay)

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "retail",
  "threatenedDismissal": true,
  "threatReason": "discussing pay",
  "blacklistingThreat": true,
  "payBelowMarket": true,
  "visaSubclass": "500",
  "overallCompleteness": 0.5,
  "averageConfidence": 0.75
}
```

### 6. Findings

#### Finding 100-A: 不当威胁
```
Name: Unlawful Threats
Description: Threatening dismissal for discussing pay is illegal. 
Employees have the right to discuss their pay.
Severity: HIGH
Confidence: 0.85
```

### 7. Severity Summary
| Finding | Severity | Urgency |
|---------|----------|---------|
| Unlawful Threats | HIGH | Immediate |

### 8. Legal Basis
| Law | Section | Relevance |
|-----|---------|-----------|
| Fair Work Act 2009 | s.340 | Workplace rights |
| Fair Work Act 2009 | s.343 | Threats |

### 9. Recommended Actions
1. **Document threats** - Keep evidence
2. **Report to Fair Work** - Adverse action
3. **You can discuss pay** - It's your legal right

### 10. Evidence Checklist
| Evidence | Status | Priority |
|----------|--------|----------|
| Messages about threats | MISSING | CRITICAL |

---

*End of Retail Cases (081-100)*
