# 清洁行业案例 Cleaning Industry Cases

**Cases: 061-080**

---

## Case 061: 清洁工时薪低于最低工资

### 1. 用户真实描述
```
我在一家清洁公司打工，每小时$16现金。
一周工作25小时，晚上和周末都要做。
没有合同，没有工资单。
老板说清洁工就是这个价。
```

### 2. 已知事实
```json
{
  "employerIndustry": "cleaning",
  "jobTitle": "清洁工",
  "payRate": 16.00,
  "paymentMethod": "cash",
  "hoursPerWeek": 25,
  "workOnWeekends": true,
  "workAtNight": true,
  "hasContract": false,
  "receivesPayslips": false
}
```

### 3. 缺失事实
- 雇主信息
- 签证类型
- 是否有super
- 具体工作地点

### 4. Agent应该追问的问题
1. "你的签证是什么类型？" (visa_subclass)
2. "老板有没有给你交super？" (super)
3. "你周末和晚上的工资和平时一样吗？" (penalty_rates)
4. "你一般在哪里做清洁？" (work_location)
5. "你能提供你和老板的聊天记录吗？" (evidence)

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "cleaning",
  "jobTitle": "清洁工",
  "employmentStatus": "casual",
  "payRate": 16.00,
  "paymentMethod": "cash",
  "cashPaymentPercentage": 100,
  "hoursPerWeek": 25,
  "workOnWeekends": true,
  "workAtNight": true,
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

#### Finding 061-A: 低于最低工资
```
Name: Below National Minimum Wage
Description: Your hourly rate of $16.00 is below the national minimum wage 
of $26.44 per hour. As a casual employee, you should receive at least 
$33.05 per hour.
Severity: CRITICAL
Confidence: 0.95
```

#### Finding 061-B: 无工资单
```
Name: Missing Payslips
Description: Your employer is not providing payslips.
Severity: HIGH
Confidence: 0.9
```

#### Finding 061-C: 无养老金
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
| Cleaning Services Award 2020 | Clause 14 | Minimum rates |

### 9. Recommended Actions
1. **Calculate underpayment** - $33.05 - $16.00 = $17.05/hr owed
2. **Report to ATO** - Unpaid super
3. **Keep evidence** - Chat messages

### 10. Evidence Checklist
| Evidence | Status | Priority |
|----------|--------|----------|
| Chat history with employer | COLLECTED | HIGH |
| Roster screenshots | MISSING | HIGH |

---

## Case 062: 清洁工没有周末和晚间罚款率

### 1. 用户真实描述
```
我做清洁，晚上6点以后和周末工资跟平时一样，$22一小时。
老板说清洁工没有加班费。
我一周工作30小时，其中10小时是晚上或周末。
```

### 2. 已知事实
```json
{
  "employerIndustry": "cleaning",
  "payRate": 22.00,
  "eveningRateSame": true,
  "weekendRateSame": true,
  "receivesPenaltyRates": false,
  "hoursPerWeek": 30,
  "penaltyHours": 10
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
4. "你晚上一般几点开始工作？" (evening_start)

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "cleaning",
  "employmentStatus": "casual",
  "payRate": 22.00,
  "receivesPenaltyRates": false,
  "eveningRate": 22.00,
  "weekendRate": 22.00,
  "hoursPerWeek": 30,
  "penaltyHours": 10,
  "visaSubclass": "500",
  "overallCompleteness": 0.6,
  "averageConfidence": 0.8
}
```

### 6. Findings

#### Finding 062-A: 缺少晚间和周末罚款率
```
Name: Missing Penalty Rates
Description: Under the Cleaning Services Award, casual employees working 
evenings (after 6pm) should receive 125%, Saturdays 150%, and Sundays 
200% of their base rate.
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
| Cleaning Services Award 2020 | Clause 23 | Penalty rates |

### 9. Recommended Actions
1. **Calculate underpayment** - Evening: $27.50/hr, Saturday: $33/hr, Sunday: $44/hr
2. **Request backpay** - From employer
3. **Contact Fair Work** - File complaint

### 10. Evidence Checklist
| Evidence | Status | Priority |
|----------|--------|----------|
| Roster showing penalty hours | MISSING | HIGH |
| Payslips showing base rate only | MISSING | HIGH |

---

## Case 063: 清洁工使用危险化学品无培训

### 1. 用户真实描述
```
老板让我用强力清洁剂，但是没有告诉我怎么用。
也没有给我手套和口罩。
有一次清洁剂溅到眼睛里，很疼。
老板说"用水冲一下就好了"。
```

### 2. 已知事实
```json
{
  "employerIndustry": "cleaning",
  "hazardousChemicals": true,
  "chemicalTraining": false,
  "ppeProvided": false,
  "chemicalInjury": true,
  "injuryType": "eye splash",
  "employerMinimizedInjury": true
}
```

### 3. 缺失事实
- 是否有安全数据表
- 是否有急救处理
- 医疗记录

### 4. Agent应该追问的问题
1. "你有没有去看医生？" (medical_records)
2. "老板有没有给你安全数据表(SDS)？" (safety_data_sheet)
3. "你有没有急救处理？" (first_aid)
4. "你有没有记录这个事故？" (evidence)

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "cleaning",
  "hazardousChemicals": true,
  "chemicalTraining": false,
  "ppeProvided": false,
  "safetyDataSheet": false,
  "chemicalInjury": true,
  "injuryType": "eye splash",
  "injuryDate": "2026-05-18",
  "employerMinimizedInjury": true,
  "visaSubclass": "500",
  "overallCompleteness": 0.6,
  "averageConfidence": 0.8
}
```

### 6. Findings

#### Finding 063-A: 危险化学品无培训
```
Name: Chemical Safety Training Missing
Description: You are required to use hazardous chemicals without proper 
training, safety data sheets, or PPE. This is a serious safety breach.
Severity: HIGH
Confidence: 0.9
```

#### Finding 063-B: 工伤未妥善处理
```
Name: Injury Not Properly Managed
Description: Your employer minimized your chemical eye injury and did 
not ensure proper medical attention.
Severity: HIGH
Confidence: 0.85
```

### 7. Severity Summary
| Finding | Severity | Urgency |
|---------|----------|---------|
| Chemical Safety | HIGH | Immediate |
| Injury Management | HIGH | Immediate |

### 8. Legal Basis
| Law | Section | Relevance |
|-----|---------|-----------|
| Work Health and Safety Act 2011 | s.19 | Duty of care |
| Work Health and Safety Regulation 2011 | r.353 | Hazardous chemicals |

### 9. Recommended Actions
1. **Report to SafeWork** - Chemical safety breach
2. **Request SDS and training** - In writing
3. **Keep medical records** - Document injury
4. **Request PPE** - Gloves, mask, goggles

### 10. Evidence Checklist
| Evidence | Status | Priority |
|----------|--------|----------|
| Medical records for eye injury | MISSING | CRITICAL |
| Photos of chemicals used | MISSING | HIGH |
| Messages about injury | MISSING | HIGH |

---

## Case 064: 清洁工被拖欠工资

### 1. 用户真实描述
```
清洁公司已经3周没发工资了。
每次问老板，都说"客户还没付款"。
我已经工作了75小时，应该拿$1650。
```

### 2. 已知事实
```json
{
  "employerIndustry": "cleaning",
  "weeksOwed": 3,
  "hoursWorked": 75,
  "amountOwed": 1650,
  "payRate": 22.00,
  "paymentDelayed": true,
  "employerExcuse": "client hasn't paid"
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
  "employerIndustry": "cleaning",
  "weeksOwed": 3,
  "hoursWorked": 75,
  "amountOwed": 1650,
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

#### Finding 064-A: 拖欠工资
```
Name: Unpaid Wages
Description: Your employer owes you $1,650 for 75 hours of work. 
"Client hasn't paid" is not a valid reason to withhold wages.
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

## Case 065: 清洁工被要求在不安全的环境中工作

### 1. 用户真实描述
```
我做写字楼清洁，晚上一个人在大楼里工作。
没有保安，没有紧急联系电话。
有一次电梯坏了，我被困在里面一个小时。
```

### 2. 已知事实
```json
{
  "employerIndustry": "cleaning",
  "workLocation": "office building",
  "workAlone": true,
  "noSecurity": true,
  "noEmergencyContact": true,
  "elevatorIncident": true
}
```

### 3. 缺失事实
- 是否有安全培训
- 是否有紧急程序

### 4. Agent应该追问的问题
1. "你有没有安全培训？" (safety_training)
2. "老板有没有给你紧急联系电话？" (emergency_contact)
3. "你有没有记录这个事故？" (evidence)

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "cleaning",
  "workLocation": "office building",
  "workAlone": true,
  "noSecurity": true,
  "noEmergencyContact": true,
  "elevatorIncident": true,
  "hasSafetyTraining": false,
  "visaSubclass": "500",
  "overallCompleteness": 0.55,
  "averageConfidence": 0.8
}
```

### 6. Findings

#### Finding 065-A: 独自工作安全隐患
```
Name: Lone Worker Safety Risk
Description: Working alone at night in an office building without security 
or emergency contacts poses significant safety risks.
Severity: MEDIUM
Confidence: 0.85
```

### 7. Severity Summary
| Finding | Severity | Urgency |
|---------|----------|---------|
| Lone Worker Risk | MEDIUM | Within 1 week |

### 8. Legal Basis
| Law | Section | Relevance |
|-----|---------|-----------|
| Work Health and Safety Act 2011 | s.19 | Duty of care |

### 9. Recommended Actions
1. **Request emergency contacts** - In writing
2. **Request security measures** - Access to security
3. **Report to SafeWork** - If not addressed

### 10. Evidence Checklist
| Evidence | Status | Priority |
|----------|--------|----------|
| Messages about safety concerns | MISSING | HIGH |
| Incident report for elevator | MISSING | MEDIUM |

---

## Case 066: 清洁工没有交通补贴

### 1. 用户真实描述
```
我做清洁，每天要去不同的地方。
老板不报销交通费，一个月下来要$200多。
而且有时候要去很远的地方。
```

### 2. 已知事实
```json
{
  "employerIndustry": "cleaning",
  "multipleLocations": true,
  "travelCosts": 200,
  "travelReimbursed": false
}
```

### 3. 缺失事实
- 合同中交通条款
- 具体交通方式

### 4. Agent应该追问的问题
1. "你的合同上有没有写交通补贴？" (contract_travel)
2. "你用什么交通工具？" (transport_mode)
3. "你有没有保存交通费收据？" (receipts)

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "cleaning",
  "multipleLocations": true,
  "travelCosts": 200,
  "travelReimbursed": false,
  "contractIncludesTravel": false,
  "visaSubclass": "500",
  "overallCompleteness": 0.5,
  "averageConfidence": 0.75
}
```

### 6. Findings

#### Finding 066-A: 未报销交通费
```
Name: Unreimbursed Travel Expenses
Description: Travel between work sites should be paid by your employer. 
You are owed approximately $200/month.
Severity: LOW
Confidence: 0.7
```

### 7. Severity Summary
| Finding | Severity | Urgency |
|---------|----------|---------|
| Unreimbursed Travel | LOW | When convenient |

### 8. Legal Basis
| Law | Section | Relevance |
|-----|---------|-----------|
| Cleaning Services Award 2020 | Clause 19 | Travel allowances |

### 9. Recommended Actions
1. **Request reimbursement** - In writing
2. **Keep receipts** - As evidence

### 10. Evidence Checklist
| Evidence | Status | Priority |
|----------|--------|----------|
| Travel receipts | MISSING | MEDIUM |
| Messages about travel | MISSING | MEDIUM |

---

## Case 067: 清洁工被错误分类为承包商

### 1. 用户真实描述
```
老板说我是contractor，让我自己开发票。
但实际上我每天按照老板的时间去不同的地方清洁。
工资是固定的一周$800。
用老板提供的清洁用品。
```

### 2. 已知事实
```json
{
  "employerIndustry": "cleaning",
  "classification": "contractor",
  "weeklyPay": 800,
  "fixedSchedule": true,
  "usesEmployerSupplies": true,
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
  "employerIndustry": "cleaning",
  "classification": "contractor",
  "weeklyPay": 800,
  "fixedSchedule": true,
  "usesEmployerSupplies": true,
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

#### Finding 067-A: 假承包商
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

## Case 068: 清洁工没有病假

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
  "employerIndustry": "cleaning",
  "employmentStatus": "part-time",
  "employmentDuration": "1 year",
  "sickLeaveDenied": true,
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
3. "你有工资单吗？" (payslips)

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "cleaning",
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

#### Finding 068-A: 未提供病假
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

## Case 069: 清洁工被要求免费加班

### 1. 用户真实描述
```
每天做完清洁后，老板让我多留30分钟检查。
不给工资，说是"工作的一部分"。
一个月下来大概被少算了10小时。
```

### 2. 已知事实
```json
{
  "employerIndustry": "cleaning",
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
  "employerIndustry": "cleaning",
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

#### Finding 069-A: 未支付加班时间
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

## Case 070: 清洁工被要求使用自己的设备

### 1. 用户真实描述
```
老板让我自己买清洁用品和工具。
一个月要花$100多。
老板说"这是你的工具，自己买"。
```

### 2. 已知事实
```json
{
  "employerIndustry": "cleaning",
  "personalEquipmentRequired": true,
  "equipmentCosts": 100,
  "employerRefusesReimbursement": true
}
```

### 3. 缺失事实
- 合同中相关条款
- 具体设备类型

### 4. Agent应该追问的问题
1. "你的合同上有没有写设备的条款？" (contract_equipment)
2. "你有没有保存购买收据？" (receipts)
3. "你有没有要求老板报销？" (requested_reimbursement)

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "cleaning",
  "personalEquipmentRequired": true,
  "equipmentCosts": 100,
  "employerRefusesReimbursement": true,
  "contractIncludesEquipment": false,
  "visaSubclass": "500",
  "overallCompleteness": 0.5,
  "averageConfidence": 0.75
}
```

### 6. Findings

#### Finding 070-A: 未报销设备费用
```
Name: Unreimbursed Equipment Costs
Description: Your employer should provide or reimburse you for cleaning 
equipment and supplies.
Severity: LOW
Confidence: 0.7
```

### 7. Severity Summary
| Finding | Severity | Urgency |
|---------|----------|---------|
| Unreimbursed Equipment | LOW | When convenient |

### 8. Legal Basis
| Law | Section | Relevance |
|-----|---------|-----------|
| Cleaning Services Award 2020 | Clause 19 | Equipment |

### 9. Recommended Actions
1. **Request reimbursement** - In writing
2. **Keep receipts** - As evidence

### 10. Evidence Checklist
| Evidence | Status | Priority |
|----------|--------|----------|
| Purchase receipts | MISSING | MEDIUM |
| Messages about equipment | MISSING | MEDIUM |

---

## Case 071: 清洁工被要求在极端天气工作

### 1. 用户真实描述
```
暴雨天老板让我去做室外清洁。
地面很滑，我差点摔倒。
老板说"下雨也要做"。
```

### 2. 已知事实
```json
{
  "employerIndustry": "cleaning",
  "extremeWeather": "heavy rain",
  "outdoorWork": true,
  "slipperyConditions": true,
  "nearMiss": true,
  "employerForcedWork": true
}
```

### 3. 缺失事实
- 是否有安全培训
- 是否有PPE

### 4. Agent应该追问的问题
1. "你有没有受伤？" (injury)
2. "老板有没有给你防滑鞋？" (ppe)
3. "你有没有拒绝过在暴雨天工作？" (refused_task)

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "cleaning",
  "extremeWeather": "heavy rain",
  "outdoorWork": true,
  "slipperyConditions": true,
  "nearMiss": true,
  "employerForcedWork": true,
  "ppeProvided": false,
  "visaSubclass": "500",
  "overallCompleteness": 0.55,
  "averageConfidence": 0.8
}
```

### 6. Findings

#### Finding 071-A: 极端天气安全隐患
```
Name: Extreme Weather Safety Risk
Description: Being required to work outdoors in heavy rain with slippery 
conditions poses safety risks.
Severity: MEDIUM
Confidence: 0.85
```

### 7. Severity Summary
| Finding | Severity | Urgency |
|---------|----------|---------|
| Extreme Weather Risk | MEDIUM | Within 1 week |

### 8. Legal Basis
| Law | Section | Relevance |
|-----|---------|-----------|
| Work Health and Safety Act 2011 | s.19 | Duty of care |

### 9. Recommended Actions
1. **Refuse unsafe work** - If conditions are dangerous
2. **Request PPE** - Non-slip shoes
3. **Report to SafeWork** - If not addressed

### 10. Evidence Checklist
| Evidence | Status | Priority |
|----------|--------|----------|
| Photos of conditions | MISSING | HIGH |
| Messages about forced work | MISSING | HIGH |

---

## Case 072: 清洁工没有年假

### 1. 用户真实描述
```
我在清洁公司做full-time，做了2年了。
想请年假，老板说"清洁工没有年假"。
```

### 2. 已知事实
```json
{
  "employerIndustry": "cleaning",
  "employmentStatus": "full-time",
  "employmentDuration": "2 years",
  "annualLeaveDenied": true
}
```

### 3. 缺失事实
- 合同情况
- 工资单

### 4. Agent应该追问的问题
1. "你的合同上写的是什么状态？" (contract_status)
2. "你有工资单吗？" (payslips)
3. "你请假的时候工资有没有被扣？" (leave_deducted)

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "cleaning",
  "employmentStatus": "full-time",
  "employmentDuration": "PT2Y",
  "annualLeaveEntitled": true,
  "annualLeaveGranted": false,
  "visaSubclass": "500",
  "overallCompleteness": 0.55,
  "averageConfidence": 0.8
}
```

### 6. Findings

#### Finding 072-A: 未提供年假
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
| Employment contract | MISSING | HIGH |
| Leave request records | MISSING | HIGH |

---

## Case 073: 清洁工被歧视

### 1. 用户真实描述
```
老板说我"留学生就是来混的"。
还说"你们中国人就是慢"。
其他员工也听到了。
```

### 2. 已知事实
```json
{
  "employerIndustry": "cleaning",
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
  "employerIndustry": "cleaning",
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

#### Finding 073-A: 种族歧视
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

## Case 074: 清洁工被不当解雇

### 1. 用户真实描述
```
我在清洁公司做了1年，上周突然被炒了。
老板说"客户不满意"，但是从来没告诉过我。
我觉得是因为我之前问过为什么没有super。
```

### 2. 已知事实
```json
{
  "employerIndustry": "cleaning",
  "employmentDuration": "1 year",
  "dismissed": true,
  "dismissalReason": "client dissatisfaction",
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

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "cleaning",
  "employmentDuration": "PT1Y",
  "wasDismissed": true,
  "dismissalDate": "2026-05-28",
  "dismissalReason": "client dissatisfaction",
  "priorWarning": false,
  "priorComplaintAboutSuper": true,
  "timeBetweenComplaintAndDismissal": "1 week",
  "visaSubclass": "500",
  "overallCompleteness": 0.6,
  "averageConfidence": 0.8
}
```

### 6. Findings

#### Finding 074-A: 可能的报复性解雇
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

## Case 075: 清洁工没有super choice

### 1. 用户真实描述
```
老板帮我选了一个super基金，但是我从来没签过choice form。
我想用我自己的基金，老板说不行。
```

### 2. 已知事实
```json
{
  "employerIndustry": "cleaning",
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
  "employerIndustry": "cleaning",
  "superChoiceProvided": false,
  "employerChoseFund": true,
  "employeeWantsOwnFund": true,
  "visaSubclass": "500",
  "overallCompleteness": 0.5,
  "averageConfidence": 0.8
}
```

### 6. Findings

#### Finding 075-A: 未提供Super Choice
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

## Case 076: 清洁工被要求签放弃权利协议

### 1. 用户真实描述
```
老板让我签一份文件，说放弃所有加班费和罚款率的权利。
不签就不能来上班。
我没办法，只好签了。
```

### 2. 已知事实
```json
{
  "employerIndustry": "cleaning",
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
  "employerIndustry": "cleaning",
  "forcedToSignWaiver": true,
  "waiverContent": "overtime and penalty rates",
  "coerced": true,
  "visaSubclass": "500",
  "overallCompleteness": 0.5,
  "averageConfidence": 0.8
}
```

### 6. Findings

#### Finding 076-A: 强迫签署放弃权利协议
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

## Case 077: 清洁工被要求使用危险设备

### 1. 用户真实描述
```
老板让我操作高压水枪，但是我从来没有培训过。
我说我不会，老板说"很简单，自己学"。
```

### 2. 已知事实
```json
{
  "employerIndustry": "cleaning",
  "equipmentRequired": "pressure washer",
  "equipmentTraining": false,
  "employerRefusedTraining": true
}
```

### 3. 缺失事实
- 是否有安全培训
- 是否拒绝过

### 4. Agent应该追问的问题
1. "你有没有拒绝过操作这个设备？" (refused_task)
2. "你有没有记录这个要求？" (evidence)

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "cleaning",
  "equipmentRequired": "pressure washer",
  "equipmentTraining": false,
  "employerRefusedTraining": true,
  "visaSubclass": "500",
  "overallCompleteness": 0.5,
  "averageConfidence": 0.8
}
```

### 6. Findings

#### Finding 077-A: 被要求使用设备无培训
```
Name: Equipment Training Missing
Description: You are required to use a pressure washer without proper 
training.
Severity: MEDIUM
Confidence: 0.85
```

### 7. Severity Summary
| Finding | Severity | Urgency |
|---------|----------|---------|
| Equipment Training | MEDIUM | Within 1 week |

### 8. Legal Basis
| Law | Section | Relevance |
|-----|---------|-----------|
| Work Health and Safety Act 2011 | s.19 | Duty of care |

### 9. Recommended Actions
1. **Request training** - In writing
2. **Refuse to use** - Until trained

### 10. Evidence Checklist
| Evidence | Status | Priority |
|----------|--------|----------|
| Messages about equipment requirement | MISSING | HIGH |

---

## Case 078: 清洁工被要求在不安全的时间工作

### 1. 用户真实描述
```
老板让我凌晨2点去做清洁。
大楼没有灯，很黑。
我说不安全，老板说"干不了就走人"。
```

### 2. 已知事实
```json
{
  "employerIndustry": "cleaning",
  "unsafeWorkingHours": true,
  "startTime": "02:00",
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

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "cleaning",
  "unsafeWorkingHours": true,
  "startTime": "02:00",
  "noLighting": true,
  "employerAware": true,
  "employerRefusedFix": true,
  "visaSubclass": "500",
  "overallCompleteness": 0.55,
  "averageConfidence": 0.8
}
```

### 6. Findings

#### Finding 078-A: 不安全的工作环境
```
Name: Unsafe Working Conditions
Description: Working in a dark building without lighting at 2am poses 
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
| Messages about conditions | MISSING | HIGH |

---

## Case 079: 清洁工被要求免费培训

### 1. 用户真实描述
```
老板让我参加安全培训，但是不给工资。
培训是周六，3小时。
说是"必须参加"，但是不给钱。
```

### 2. 已知事实
```json
{
  "employerIndustry": "cleaning",
  "trainingRequired": true,
  "trainingPaid": false,
  "trainingDuration": 3,
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
  "employerIndustry": "cleaning",
  "trainingRequired": true,
  "trainingPaid": false,
  "trainingDuration": 3,
  "trainingDay": "Saturday",
  "trainingMandatory": true,
  "payRate": 22.00,
  "visaSubclass": "500",
  "overallCompleteness": 0.55,
  "averageConfidence": 0.8
}
```

### 6. Findings

#### Finding 079-A: 无偿培训应支付工资
```
Name: Unpaid Mandatory Training
Description: Mandatory training must be paid. You are owed for 3 hours.
Estimated Owed: ~$66
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

## Case 080: 清洁工被要求做超出职责的工作

### 1. 用户真实描述
```
我是做清洁的，但是老板让我去搬家具。
搬家具不在我的工作范围内。
而且搬重物很容易受伤。
```

### 2. 已知事实
```json
{
  "employerIndustry": "cleaning",
  "jobTitle": "清洁工",
  "additionalDuties": "moving furniture",
  "notInJobDescription": true,
  "injuryRisk": true
}
```

### 3. 缺失事实
- 合同职责范围
- 是否拒绝过

### 4. Agent应该追问的问题
1. "你的合同上写的工作内容是什么？" (contract_duties)
2. "你有没有拒绝过搬家具？" (refused_task)
3. "你有没有受过伤？" (injury)

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "cleaning",
  "jobTitle": "清洁工",
  "additionalDuties": ["moving furniture"],
  "notInJobDescription": true,
  "injuryRisk": true,
  "visaSubclass": "500",
  "overallCompleteness": 0.5,
  "averageConfidence": 0.75
}
```

### 6. Findings

#### Finding 080-A: 职责范围扩大未协商
```
Name: Duties Expanded Without Agreement
Description: You were required to perform furniture moving duties not in 
your original job description.
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
| Messages about furniture moving | MISSING | HIGH |
| Original job description | MISSING | MEDIUM |

---

*End of Cleaning Cases (061-080)*
