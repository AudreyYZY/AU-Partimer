# 仓库行业案例 Warehouse Industry Cases

**Cases: 041-060**

---

## Case 041: 仓库拣货员低于最低工资

### 1. 用户真实描述
```
我在一家仓库做拣货员，每小时$19现金。
一周工作40小时，有时候要加班。
没有合同，没有工资单。
老板说这个工资是正常的。
```

### 2. 已知事实
```json
{
  "employerIndustry": "warehouse",
  "jobTitle": "拣货员",
  "payRate": 19.00,
  "paymentMethod": "cash",
  "hoursPerWeek": 40,
  "hasContract": false,
  "receivesPayslips": false
}
```

### 3. 缺失事实
- 雇主信息
- 签证类型
- 是否有super
- 是否有试工
- 工作时间表

### 4. Agent应该追问的问题
1. "你的签证是什么类型？" (visa_subclass)
2. "你有没有交TFN？" (tfn_provided)
3. "老板有没有给你交super？" (super)
4. "你加班有没有加班费？" (overtime_pay)
5. "你能提供你和老板的聊天记录吗？" (evidence)

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "warehouse",
  "jobTitle": "拣货员",
  "employmentStatus": "casual",
  "payRate": 19.00,
  "paymentMethod": "cash",
  "cashPaymentPercentage": 100,
  "hoursPerWeek": 40,
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

#### Finding 041-A: 低于最低工资
```
Name: Below National Minimum Wage
Description: Your hourly rate of $19.00 is below the national minimum wage 
of $26.44 per hour. As a casual employee, you should receive at least 
$33.05 per hour.
Severity: CRITICAL
Confidence: 0.95
```

#### Finding 041-B: 无工资单
```
Name: Missing Payslips
Description: Your employer is not providing payslips.
Severity: HIGH
Confidence: 0.9
```

#### Finding 041-C: 无养老金
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
| Fair Work Act 2009 | s.536 | Payslip requirements |
| Superannuation Guarantee Act 1992 | s.19 | Super guarantee |

### 9. Recommended Actions
1. **Calculate underpayment** - $33.05 - $19.00 = $14.05/hr owed
2. **Report to ATO** - Unpaid super
3. **Keep evidence** - Chat messages

### 10. Evidence Checklist
| Evidence | Status | Priority |
|----------|--------|----------|
| Chat history with employer | COLLECTED | HIGH |
| Roster screenshots | MISSING | HIGH |

---

## Case 042: 仓库员工连续加班无加班费

### 1. 用户真实描述
```
我在仓库工作，每天8小时，但是经常被要求加班到10小时。
加班没有额外工资，还是基本工资$25一小时。
一个月加班大概40小时。
```

### 2. 已知事实
```json
{
  "employerIndustry": "warehouse",
  "payRate": 25.00,
  "contractedHours": 8,
  "actualHours": 10,
  "unpaidOvertime": 2,
  "monthlyOvertime": 40,
  "receivesPenaltyRates": false
}
```

### 3. 缺失事实
- 合同情况
- 工资单
- 签证类型

### 4. Agent应该追问的问题
1. "你的合同上有没有写加班费？" (contract_overtime)
2. "你有工资单吗？" (payslips)
3. "你有没有签过放弃加班费的文件？" (overtime_waiver)
4. "你每周工作几天？" (days_per_week)

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "warehouse",
  "employmentStatus": "full-time",
  "payRate": 25.00,
  "contractedHoursPerDay": 8,
  "actualHoursPerDay": 10,
  "unpaidOvertimePerDay": 2,
  "monthlyOvertime": 40,
  "receivesPenaltyRates": false,
  "hasWrittenContract": true,
  "visaSubclass": "500",
  "overallCompleteness": 0.65,
  "averageConfidence": 0.8
}
```

### 6. Findings

#### Finding 042-A: 未支付加班费
```
Name: Unpaid Overtime
Description: You are working approximately 40 hours of unpaid overtime 
per month. Under the Warehouse Award, overtime should be paid at 
150% for the first 2 hours and 200% thereafter.
Estimated Owed: ~$3,500 for 3 months
Severity: CRITICAL
Confidence: 0.9
```

### 7. Severity Summary
| Finding | Severity | Urgency |
|---------|----------|---------|
| Unpaid Overtime | CRITICAL | Immediate |

### 8. Legal Basis
| Law | Section | Relevance |
|-----|---------|-----------|
| Storage Services and Wholesale Award 2020 | Clause 24 | Overtime |

### 9. Recommended Actions
1. **Document all overtime** - Keep records
2. **Calculate overtime owed** - 150% first 2hrs, 200% after
3. **Contact Fair Work** - File complaint

### 10. Evidence Checklist
| Evidence | Status | Priority |
|----------|--------|----------|
| Time records showing overtime | MISSING | CRITICAL |
| Payslips without overtime | MISSING | HIGH |

---

## Case 043: 仓库员工工作受伤未获赔偿

### 1. 用户真实描述
```
在仓库搬箱子的时候扭伤了腰。
老板说是我自己不小心，不愿意报工伤。
医药费我自己付了$300。
现在还在疼，但是老板让我继续搬重物。
```

### 2. 已知事实
```json
{
  "employerIndustry": "warehouse",
  "workplaceInjury": true,
  "injuryType": "back strain",
  "medicalCosts": 300,
  "employerRefusedClaim": true,
  "stillDoingHeavyWork": true
}
```

### 3. 缺失事实
- 是否有安全培训
- 是否有PPE
- 是否有保险

### 4. Agent应该追问的问题
1. "你有没有签过安全培训？" (safety_training)
2. "老板有没有给你护腰带？" (ppe)
3. "你有没有去看医生？有医疗记录吗？" (medical_records)
4. "你有没有告诉老板你要报工伤？" (injury_reported)

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "warehouse",
  "workplaceInjury": true,
  "injuryType": "back strain",
  "injuryDate": "2026-05-15",
  "medicalCosts": 300,
  "employerRefusedClaim": true,
  "stillDoingHeavyWork": true,
  "hasSafetyTraining": false,
  "ppeProvided": false,
  "visaSubclass": "500",
  "overallCompleteness": 0.6,
  "averageConfidence": 0.8
}
```

### 6. Findings

#### Finding 043-A: 工伤赔偿权利
```
Name: Workers Compensation Entitlement
Description: You were injured at work and are entitled to workers 
compensation. Your employer cannot refuse to process a claim.
Severity: HIGH
Confidence: 0.9
```

#### Finding 043-B: 缺乏安全培训
```
Name: Missing Safety Training
Description: Your employer did not provide safety training for manual 
handling tasks.
Severity: MEDIUM
Confidence: 0.8
```

### 7. Severity Summary
| Finding | Severity | Urgency |
|---------|----------|---------|
| Workers Comp Entitlement | HIGH | Immediate |
| Missing Safety Training | MEDIUM | Within 1 week |

### 8. Legal Basis
| Law | Section | Relevance |
|-----|---------|-----------|
| Work Health and Safety Act 2011 | s.19 | Employer duties |
| Workers Compensation Act | Various | Compensation entitlements |

### 9. Recommended Actions
1. **Report to SafeWork** - Workplace safety breach
2. **File workers comp claim** - Even if employer refuses
3. **Keep medical records** - Document injury
4. **Seek legal advice** - Workers comp lawyer

### 10. Evidence Checklist
| Evidence | Status | Priority |
|----------|--------|----------|
| Medical records | MISSING | CRITICAL |
| Photos of injury | MISSING | HIGH |
| Messages about injury to employer | MISSING | HIGH |

---

## Case 044: 仓库员工被要求使用危险设备

### 1. 用户真实描述
```
老板让我开叉车，但是我从来没有培训过。
我说我不会，老板说"很简单，自己学"。
我看到有人之前出过事故。
```

### 2. 已知事实
```json
{
  "employerIndustry": "warehouse",
  "forkliftRequired": true,
  "forkliftTraining": false,
  "previousAccident": true,
  "employerRefusedTraining": true
}
```

### 3. 缺失事实
- 是否有证书
- 具体设备类型

### 4. Agent应该追问的问题
1. "你有没有叉车证书？" (forklift_license)
2. "你有没有拒绝过开叉车？" (refused_task)
3. "你有没有记录这个安全隐患？" (evidence)

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "warehouse",
  "forkliftRequired": true,
  "forkliftTraining": false,
  "forkliftLicense": false,
  "previousAccident": true,
  "employerRefusedTraining": true,
  "visaSubclass": "500",
  "overallCompleteness": 0.55,
  "averageConfidence": 0.8
}
```

### 6. Findings

#### Finding 044-A: 被要求使用危险设备
```
Name: Required to Use Dangerous Equipment Without Training
Description: You are required to operate a forklift without proper 
training or licensing. This is a serious safety breach.
Severity: CRITICAL
Confidence: 0.9
```

### 7. Severity Summary
| Finding | Severity | Urgency |
|---------|----------|---------|
| Dangerous Equipment | CRITICAL | Immediate |

### 8. Legal Basis
| Law | Section | Relevance |
|-----|---------|-----------|
| Work Health and Safety Act 2011 | s.19 | Duty of care |
| Work Health and Safety Regulation 2011 | r.59 | High risk work |

### 9. Recommended Actions
1. **Refuse to operate** - You have the right
2. **Report to SafeWork** - Immediately
3. **Request training** - Before operating

### 10. Evidence Checklist
| Evidence | Status | Priority |
|----------|--------|----------|
| Messages about forklift requirement | MISSING | CRITICAL |
| Evidence of previous accident | MISSING | HIGH |

---

## Case 045: 仓库员工没有休息时间

### 1. 用户真实描述
```
我每天在仓库工作10小时，只有30分钟吃饭时间。
连喝水、上厕所都要快去快回。
老板说"仓库不养闲人"。
```

### 2. 已知事实
```json
{
  "employerIndustry": "warehouse",
  "hoursPerShift": 10,
  "breakDuration": 30,
  "breakInadequate": true,
  "restBreaks": false
}
```

### 3. 缺失事实
- 时薪
- 合同情况

### 4. Agent应该追问的问题
1. "你的时薪是多少？" (pay_rate)
2. "你有没有签过关于休息的协议？" (break_agreement)
3. "你有没有向老板要求过更多休息？" (break_requested)

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "warehouse",
  "hoursPerShift": 10,
  "breakDuration": 30,
  "breakInadequate": true,
  "restBreaks": false,
  "breakRequested": true,
  "breakDenied": true,
  "payRate": 25.00,
  "visaSubclass": "500",
  "overallCompleteness": 0.55,
  "averageConfidence": 0.8
}
```

### 6. Findings

#### Finding 045-A: 休息时间不足
```
Name: Inadequate Breaks
Description: For 10-hour shifts, you are entitled to additional rest 
breaks beyond a 30-minute meal break.
Severity: MEDIUM
Confidence: 0.85
```

### 7. Severity Summary
| Finding | Severity | Urgency |
|---------|----------|---------|
| Inadequate Breaks | MEDIUM | Within 1 month |

### 8. Legal Basis
| Law | Section | Relevance |
|-----|---------|-----------|
| Storage Services Award 2020 | Clause 15 | Breaks |

### 9. Recommended Actions
1. **Request additional breaks** - In writing
2. **Contact Fair Work** - For advice

### 10. Evidence Checklist
| Evidence | Status | Priority |
|----------|--------|----------|
| Messages requesting breaks | MISSING | HIGH |

---

## Case 046: 仓库员工周末无罚款率

### 1. 用户真实描述
```
我在仓库工作，周末工资跟平时一样，$24一小时。
我问老板有没有周末加班费，老板说没有。
一周工作6天，周末2天。
```

### 2. 已知事实
```json
{
  "employerIndustry": "warehouse",
  "payRate": 24.00,
  "weekendRateSame": true,
  "receivesPenaltyRates": false,
  "daysPerWeek": 6,
  "weekendDays": 2
}
```

### 3. 缺失事实
- 合同情况
- 工资单
- 具体工作时间

### 4. Agent应该追问的问题
1. "你的合同上有没有写罚款率？" (contract_penalty)
2. "你有工资单吗？" (payslips)
3. "你是casual还是full-time？" (employment_status)

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "warehouse",
  "employmentStatus": "casual",
  "payRate": 24.00,
  "receivesPenaltyRates": false,
  "weekendRate": 24.00,
  "daysPerWeek": 6,
  "weekendDays": 2,
  "visaSubclass": "500",
  "overallCompleteness": 0.6,
  "averageConfidence": 0.8
}
```

### 6. Findings

#### Finding 046-A: 缺少周末罚款率
```
Name: Missing Weekend Penalty Rates
Description: Under the Storage Services Award, casual employees working 
on Saturdays should receive 125% and Sundays 150% of their base rate.
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
| Storage Services and Wholesale Award 2020 | Clause 23 | Penalty rates |

### 9. Recommended Actions
1. **Calculate underpayment** - Saturday: $30/hr, Sunday: $36/hr
2. **Request backpay** - From employer
3. **Contact Fair Work** - File complaint

### 10. Evidence Checklist
| Evidence | Status | Priority |
|----------|--------|----------|
| Roster showing weekend shifts | MISSING | HIGH |
| Payslips showing base rate only | MISSING | HIGH |

---

## Case 047: 仓库员工被拖欠工资

### 1. 用户真实描述
```
老板已经2周没发工资了。
每次问都说"资金周转困难"。
我已经工作了80小时，应该拿$2000。
```

### 2. 已知事实
```json
{
  "employerIndustry": "warehouse",
  "weeksOwed": 2,
  "hoursWorked": 80,
  "amountOwed": 2000,
  "payRate": 25.00,
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
  "employerIndustry": "warehouse",
  "weeksOwed": 2,
  "hoursWorked": 80,
  "amountOwed": 2000,
  "payRate": 25.00,
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

#### Finding 047-A: 拖欠工资
```
Name: Unpaid Wages
Description: Your employer owes you $2,000 for 80 hours of work.
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

## Case 048: 仓库员工被错误分类为承包商

### 1. 用户真实描述
```
老板说我是contractor，让我自己开发票。
但实际上我每天按照老板的时间上班，用老板的设备。
工资是固定的一周$900。
```

### 2. 已知事实
```json
{
  "employerIndustry": "warehouse",
  "classification": "contractor",
  "weeklyPay": 900,
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
4. "你可以找别人代替你工作吗？" (substitution)

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "warehouse",
  "classification": "contractor",
  "weeklyPay": 900,
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

#### Finding 048-A: 假承包商
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
3. **Claim employee entitlements** - Super, leave, etc.

### 10. Evidence Checklist
| Evidence | Status | Priority |
|----------|--------|----------|
| Roster showing fixed hours | MISSING | CRITICAL |
| Messages showing employer direction | MISSING | HIGH |

---

## Case 049: 仓库员工没有安全装备

### 1. 用户真实描述
```
在仓库工作，老板没有给我安全鞋和手套。
搬重物的时候经常伤到手。
老板说"自己去买"。
```

### 2. 已知事实
```json
{
  "employerIndustry": "warehouse",
  "ppeRequired": ["safety shoes", "gloves"],
  "ppeProvided": false,
  "minorInjuries": true,
  "employerRefusedPPE": true
}
```

### 3. 缺失事实
- 是否有安全培训
- 具体工作内容

### 4. Agent应该追问的问题
1. "你有没有签过安全培训？" (safety_training)
2. "你有没有受过伤？" (injuries)
3. "你有没有记录这个安全隐患？" (evidence)

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "warehouse",
  "ppeRequired": ["safety shoes", "gloves"],
  "ppeProvided": false,
  "minorInjuries": true,
  "employerRefusedPPE": true,
  "hasSafetyTraining": false,
  "visaSubclass": "500",
  "overallCompleteness": 0.55,
  "averageConfidence": 0.8
}
```

### 6. Findings

#### Finding 049-A: 缺少安全装备
```
Name: Missing PPE
Description: Your employer has not provided required safety equipment 
(safety shoes, gloves) for warehouse work.
Severity: MEDIUM
Confidence: 0.85
```

### 7. Severity Summary
| Finding | Severity | Urgency |
|---------|----------|---------|
| Missing PPE | MEDIUM | Within 1 week |

### 8. Legal Basis
| Law | Section | Relevance |
|-----|---------|-----------|
| Work Health and Safety Act 2011 | s.19 | Duty of care |

### 9. Recommended Actions
1. **Request PPE** - In writing
2. **Report to SafeWork** - If not provided

### 10. Evidence Checklist
| Evidence | Status | Priority |
|----------|--------|----------|
| Messages requesting PPE | MISSING | HIGH |
| Photos of minor injuries | MISSING | MEDIUM |

---

## Case 050: 仓库员工被要求在危险环境中工作

### 1. 用户真实描述
```
仓库里有很多箱子堆得很高，随时可能掉下来。
通风也不好，夏天热得要死。
老板说"干不了就走人"。
```

### 2. 已知事实
```json
{
  "employerIndustry": "warehouse",
  "hazardUnstableStacking": true,
  "hazardPoorVentilation": true,
  "employerAware": true,
  "employerRefusedFix": true
}
```

### 3. 缺失事实
- 是否有安全培训
- 是否有事故记录

### 4. Agent应该追问的问题
1. "有没有人因为箱子掉下来受伤？" (injuries)
2. "你有没有向任何部门投诉过？" (complaints)
3. "你有没有记录这些安全隐患？" (evidence)

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "warehouse",
  "workplaceHazards": ["unstable stacking", "poor ventilation"],
  "employerAware": true,
  "employerRefusedFix": true,
  "hasSafetyTraining": false,
  "visaSubclass": "500",
  "overallCompleteness": 0.55,
  "averageConfidence": 0.8
}
```

### 6. Findings

#### Finding 050-A: 工作环境不安全
```
Name: Unsafe Workplace
Description: Multiple safety hazards exist: unstable stacking and poor 
ventilation. Your employer has a duty to provide a safe workplace.
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
3. **Refuse unsafe work** - You have the right

### 10. Evidence Checklist
| Evidence | Status | Priority |
|----------|--------|----------|
| Photos of hazards | MISSING | CRITICAL |
| Messages to employer about safety | MISSING | HIGH |

---

## Case 051: 仓库员工被要求做超出职责的工作

### 1. 用户真实描述
```
我是做拣货的，但是老板让我去操作起重机。
我说我没有证书，老板说"没关系，我教你"。
这很危险吧？
```

### 2. 已知事实
```json
{
  "employerIndustry": "warehouse",
  "jobTitle": "拣货员",
  "additionalDuties": "crane operation",
  "requiredLicense": true,
  "hasLicense": false,
  "employerRefusedTraining": true
}
```

### 3. 缺失事实
- 合同职责范围
- 是否拒绝过

### 4. Agent应该追问的问题
1. "你有没有拒绝过操作起重机？" (refused_task)
2. "你的合同上写的工作内容是什么？" (contract_duties)
3. "你有没有记录这个要求？" (evidence)

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "warehouse",
  "jobTitle": "拣货员",
  "additionalDuties": ["crane operation"],
  "requiredLicense": true,
  "hasLicense": false,
  "employerRefusedTraining": true,
  "visaSubclass": "500",
  "overallCompleteness": 0.55,
  "averageConfidence": 0.8
}
```

### 6. Findings

#### Finding 051-A: 被要求使用危险设备
```
Name: Required Dangerous Work Without License
Description: You are required to operate a crane without proper licensing.
Severity: CRITICAL
Confidence: 0.9
```

### 7. Severity Summary
| Finding | Severity | Urgency |
|---------|----------|---------|
| Dangerous Work | CRITICAL | Immediate |

### 8. Legal Basis
| Law | Section | Relevance |
|-----|---------|-----------|
| Work Health and Safety Act 2011 | s.19 | Duty of care |

### 9. Recommended Actions
1. **Refuse to operate** - You have the right
2. **Report to SafeWork** - Immediately

### 10. Evidence Checklist
| Evidence | Status | Priority |
|----------|--------|----------|
| Messages about crane requirement | MISSING | CRITICAL |

---

## Case 052: 仓库员工被要求在极端天气工作

### 1. 用户真实描述
```
夏天仓库里面40多度，老板不开空调。
有人中暑了，老板说"喝点水就好了"。
冬天又冷得要死，没有暖气。
```

### 2. 已知事实
```json
{
  "employerIndustry": "warehouse",
  "extremeHeat": true,
  "extremeCold": true,
  "heatstrokeIncident": true,
  "noClimateControl": true
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
  "employerIndustry": "warehouse",
  "extremeHeat": true,
  "extremeCold": true,
  "heatstrokeIncident": true,
  "noClimateControl": true,
  "waterProvided": false,
  "restBreaksInadequate": true,
  "visaSubclass": "500",
  "overallCompleteness": 0.55,
  "averageConfidence": 0.8
}
```

### 6. Findings

#### Finding 052-A: 极端天气安全隐患
```
Name: Extreme Weather Hazards
Description: Working in extreme heat without climate control or adequate 
breaks poses serious health risks.
Severity: HIGH
Confidence: 0.85
```

### 7. Severity Summary
| Finding | Severity | Urgency |
|---------|----------|---------|
| Extreme Weather Hazards | HIGH | Immediate |

### 8. Legal Basis
| Law | Section | Relevance |
|-----|---------|-----------|
| Work Health and Safety Act 2011 | s.19 | Duty of care |

### 9. Recommended Actions
1. **Report to SafeWork** - Safety breach
2. **Request climate control** - In writing
3. **Refuse unsafe work** - If necessary

### 10. Evidence Checklist
| Evidence | Status | Priority |
|----------|--------|----------|
| Temperature records | MISSING | HIGH |
| Messages about conditions | MISSING | HIGH |

---

## Case 053: 仓库员工被要求免费加班

### 1. 用户真实描述
```
每天下班后老板让我多留1小时"帮忙"。
不给工资，说是"团队精神"。
一个月下来大概被少算了20小时。
```

### 2. 已知事实
```json
{
  "employerIndustry": "warehouse",
  "unpaidOvertimePerShift": 1,
  "monthlyUnpaidHours": 20,
  "employerExcuse": "team spirit"
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
  "employerIndustry": "warehouse",
  "unpaidOvertimePerShift": 1,
  "daysPerMonth": 20,
  "monthlyUnpaidHours": 20,
  "payRate": 25.00,
  "visaSubclass": "500",
  "overallCompleteness": 0.55,
  "averageConfidence": 0.8
}
```

### 6. Findings

#### Finding 053-A: 未支付加班时间
```
Name: Unpaid Overtime
Description: Time spent after your shift is work time and must be paid.
Estimated Owed: ~$500/month
Severity: HIGH
Confidence: 0.85
```

### 7. Severity Summary
| Finding | Severity | Urgency |
|---------|----------|---------|
| Unpaid Overtime | HIGH | Within 1 week |

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

## Case 054: 仓库员工没有年假

### 1. 用户真实描述
```
我在仓库做full-time，做了2年了。
想请年假，老板说casual没有年假。
但我的合同写的是full-time。
```

### 2. 已知事实
```json
{
  "employerIndustry": "warehouse",
  "employmentStatus": "full-time",
  "employmentDuration": "2 years",
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
  "employerIndustry": "warehouse",
  "employmentStatus": "full-time",
  "hasWrittenContract": true,
  "contractStatus": "full-time",
  "employmentDuration": "PT2Y",
  "annualLeaveEntitled": true,
  "annualLeaveGranted": false,
  "visaSubclass": "500",
  "overallCompleteness": 0.65,
  "averageConfidence": 0.8
}
```

### 6. Findings

#### Finding 054-A: 未提供年假
```
Name: Annual Leave Denied
Description: As a full-time employee, you are entitled to 4 weeks paid 
annual leave per year. You have accumulated 8 weeks over 2 years.
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

## Case 055: 仓库员工被不当解雇

### 1. 用户真实描述
```
我在仓库做了1年，上周突然被炒了。
老板说"业务调整"，但是马上就请了新人。
我觉得是因为我之前报过安全问题。
```

### 2. 已知事实
```json
{
  "employerIndustry": "warehouse",
  "employmentDuration": "1 year",
  "dismissed": true,
  "dismissalReason": "business restructuring",
  "replacementHired": true,
  "priorComplaint": "safety issue report"
}
```

### 3. 缺失事实
- 解雇日期
- 是否有书面通知
- 时间线

### 4. Agent应该追问的问题
1. "你是什么时候被炒的？" (dismissal_date)
2. "你报告安全问题之后多久被炒的？" (timeline)
3. "老板有没有给你书面解雇通知？" (written_notice)

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "warehouse",
  "employmentDuration": "PT1Y",
  "wasDismissed": true,
  "dismissalDate": "2026-05-25",
  "dismissalReason": "business restructuring",
  "replacementHired": true,
  "priorComplaintAboutSafety": true,
  "timeBetweenComplaintAndDismissal": "2 weeks",
  "visaSubclass": "500",
  "overallCompleteness": 0.6,
  "averageConfidence": 0.8
}
```

### 6. Findings

#### Finding 055-A: 可能的报复性解雇
```
Name: Potential Adverse Action
Description: You were dismissed shortly after reporting safety issues. 
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
2. **Document timeline** - When you reported, when fired
3. **Contact Fair Work** - For advice

### 10. Evidence Checklist
| Evidence | Status | Priority |
|----------|--------|----------|
| Safety complaint records | MISSING | CRITICAL |
| Evidence of replacement hire | MISSING | HIGH |

---

## Case 056: 仓库员工被歧视

### 1. 用户真实描述
```
老板说我"留学生就是来混的"。
还说"你们亚洲人就是慢"。
其他员工也听到了。
```

### 2. 已知事实
```json
{
  "employerIndustry": "warehouse",
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
  "employerIndustry": "warehouse",
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

#### Finding 056-A: 种族歧视
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

## Case 057: 仓库员工没有super choice

### 1. 用户真实描述
```
老板帮我选了一个super基金，但是我从来没签过choice form。
我想用我自己的基金，老板说不行。
```

### 2. 已知事实
```json
{
  "employerIndustry": "warehouse",
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
  "employerIndustry": "warehouse",
  "superChoiceProvided": false,
  "employerChoseFund": true,
  "employeeWantsOwnFund": true,
  "visaSubclass": "500",
  "overallCompleteness": 0.5,
  "averageConfidence": 0.8
}
```

### 6. Findings

#### Finding 057-A: 未提供Super Choice
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

## Case 058: 仓库员工被要求签放弃权利协议

### 1. 用户真实描述
```
老板让我签一份文件，说放弃所有工伤赔偿的权利。
不签就不能来上班。
我没办法，只好签了。
```

### 2. 已知事实
```json
{
  "employerIndustry": "warehouse",
  "forcedToSignWaiver": true,
  "waiverContent": "workers compensation rights",
  "coerced": true
}
```

### 3. 缺失事实
- 文件具体内容
- 是否有副本

### 4. Agent应该追问的问题
1. "你有没有那份文件的副本？" (waiver_document)
2. "你签的时候有没有其他人在场？" (witnesses)
3. "你有没有向任何人投诉过？" (complaints)

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "warehouse",
  "forcedToSignWaiver": true,
  "waiverContent": "workers compensation rights",
  "coerced": true,
  "visaSubclass": "500",
  "overallCompleteness": 0.5,
  "averageConfidence": 0.8
}
```

### 6. Findings

#### Finding 058-A: 强迫签署放弃权利协议
```
Name: Coerced Waiver
Description: You were coerced to sign away your workers compensation 
rights. Such waivers are generally unenforceable.
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
| Workers Compensation Act | Various | Rights cannot be waived |

### 9. Recommended Actions
1. **Waiver is likely unenforceable** - Seek legal advice
2. **Claim workers comp if injured** - Your rights remain
3. **Contact Fair Work** - File complaint

### 10. Evidence Checklist
| Evidence | Status | Priority |
|----------|--------|----------|
| Copy of waiver document | MISSING | HIGH |
| Messages about signing | MISSING | HIGH |

---

## Case 059: 仓库员工被要求在不安全的时间工作

### 1. 用户真实描述
```
老板让我凌晨3点来仓库工作。
仓库没有灯，很黑。
我说不安全，老板说"干不了就走人"。
```

### 2. 已知事实
```json
{
  "employerIndustry": "warehouse",
  "unsafeWorkingHours": true,
  "startTime": "03:00",
  "noLighting": true,
  "employerAware": true,
  "employerRefusedFix": true
}
```

### 3. 缺失事实
- 是否有安全培训
- 是否有PPE

### 4. Agent应该追问的问题
1. "你有没有记录这个安全隐患？" (evidence)
2. "你有没有拒绝过在这个时间工作？" (refused_task)
3. "你有没有向任何部门投诉过？" (complaints)

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "warehouse",
  "unsafeWorkingHours": true,
  "startTime": "03:00",
  "noLighting": true,
  "employerAware": true,
  "employerRefusedFix": true,
  "visaSubclass": "500",
  "overallCompleteness": 0.55,
  "averageConfidence": 0.8
}
```

### 6. Findings

#### Finding 059-A: 不安全的工作环境
```
Name: Unsafe Working Conditions
Description: Working in a dark warehouse without lighting at 3am poses 
serious safety risks.
Severity: HIGH
Confidence: 0.85
```

### 7. Severity Summary
| Finding | Severity | Urgency |
|---------|----------|---------|
| Unsafe Conditions | HIGH | Immediate |

### 8. Legal Basis
| Law | Section | Relevance |
|-----|---------|-----------|
| Work Health and Safety Act 2011 | s.19 | Duty of care |

### 9. Recommended Actions
1. **Refuse unsafe work** - You have the right
2. **Report to SafeWork** - Safety breach

### 10. Evidence Checklist
| Evidence | Status | Priority |
|----------|--------|----------|
| Photos of dark warehouse | MISSING | HIGH |
| Messages about conditions | MISSING | HIGH |

---

## Case 060: 仓库员工被要求免费培训

### 1. 用户真实描述
```
老板让我参加安全培训，但是不给工资。
培训是周六，4小时。
说是"必须参加"，但是不给钱。
```

### 2. 已知事实
```json
{
  "employerIndustry": "warehouse",
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
3. "你有没有培训的记录？" (training_records)

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "warehouse",
  "trainingRequired": true,
  "trainingPaid": false,
  "trainingDuration": 4,
  "trainingDay": "Saturday",
  "trainingMandatory": true,
  "payRate": 25.00,
  "visaSubclass": "500",
  "overallCompleteness": 0.55,
  "averageConfidence": 0.8
}
```

### 6. Findings

#### Finding 060-A: 无偿培训应支付工资
```
Name: Unpaid Mandatory Training
Description: Mandatory training must be paid. You are owed for 4 hours.
Estimated Owed: ~$100
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

*End of Warehouse Cases (041-060)*
