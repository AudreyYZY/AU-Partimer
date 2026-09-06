# 餐饮行业案例 Restaurant Industry Cases

**Cases: 001-020**

---

## Case 001: 中餐馆服务员低于最低工资

### 1. 用户真实描述
```
我在悉尼一家中餐馆做服务员，老板说每小时给我18刀现金。
我每周工作大概30小时，周末也要上班。
没有合同，没有工资单，工资直接发微信。
做了三个月了，感觉工资好像有点低？
```

### 2. 已知事实
```json
{
  "employerIndustry": "restaurant",
  "jobTitle": "服务员",
  "payRate": 18.00,
  "payRateType": "hourly",
  "paymentMethod": "cash",
  "hoursPerWeek": 30,
  "hasContract": false,
  "receivesPayslips": false,
  "employmentStartDate": "~3 months ago",
  "workOnWeekends": true,
  "paymentChannel": "WeChat"
}
```

### 3. 缺失事实
- 雇主名称和ABN
- 具体工作日期和时间
- 是否有养老金
- 签证类型和工作时间限制
- 是否有试工期
- 具体工作职责
- 是否有罚款率（周末/晚间）
- 是否提供TFN

### 4. Agent应该追问的问题
1. "你的签证是什么类型？学生签证吗？" (visa_subclass)
2. "你有给老板你的税号(TFN)吗？" (tfn_provided)
3. "你周末上班的工资和平时一样吗？" (receives_penalty_rates)
4. "你有没有做过试工？试工有工资吗？" (had_trial_shift)
5. "老板有没有给你交养老金(super)？" (receives_super)
6. "你一般几点开始工作，几点下班？" (start_time, end_time)
7. "你能提供你和老板的聊天记录吗？" (evidence_types)

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "restaurant",
  "employerType": "中餐馆",
  "jobTitle": "服务员",
  "employmentStatus": "casual",
  "employmentType": "ongoing",
  "hasWrittenContract": false,
  "contractType": "verbal",
  "payRate": 18.00,
  "payRateType": "hourly",
  "paymentMethod": "cash",
  "cashPaymentPercentage": 100,
  "hoursPerWeek": 30,
  "regularDays": ["Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
  "startTime": "11:00",
  "endTime": "17:00",
  "receivesPayslips": false,
  "receivesSuper": false,
  "tfnProvided": false,
  "visaSubclass": "500",
  "hoursLimit": 48,
  "visaWorkCompliant": true,
  "evidenceTypes": ["WeChat messages"],
  "hasScreenshots": true,
  "overallCompleteness": 0.65,
  "averageConfidence": 0.7
}
```

### 6. Findings

#### Finding 001-A: 低于最低工资
```
Name: Below National Minimum Wage
Description: Your hourly rate of $18.00 is below the national minimum wage 
of $26.44 per hour (current national benchmark from 1 July 2026). As a casual employee, you should 
receive at least $33.05 per hour (25% casual loading).
Severity: CRITICAL
Confidence: 0.95
```

#### Finding 001-B: 无工资单
```
Name: Missing Payslips
Description: Your employer is not providing payslips as required by law. 
Employers must provide payslips within one day of payment.
Severity: HIGH
Confidence: 0.9
```

#### Finding 001-C: 无养老金
```
Name: Missing Superannuation
Description: Your employer is not paying the required superannuation 
guarantee. You are entitled to super if you earn over $450 per month.
Severity: CRITICAL
Confidence: 0.85
```

#### Finding 001-D: 现金支付风险
```
Name: Cash Payment Tax Risk
Description: Being paid 100% in cash without TFN may indicate tax avoidance. 
This could affect your tax obligations and visa compliance.
Severity: HIGH
Confidence: 0.8
```

### 7. Severity Summary
| Finding | Severity | Urgency |
|---------|----------|---------|
| Below Minimum Wage | CRITICAL | Immediate |
| Missing Payslips | HIGH | Within 1 week |
| Missing Super | CRITICAL | Immediate |
| Cash Payment Risk | HIGH | Within 1 week |

### 8. Legal Basis
| Law | Section | Relevance |
|-----|---------|-----------|
| Fair Work Act 2009 | s.284 | National minimum wage |
| Fair Work Act 2009 | s.536 | Payslip requirements |
| Superannuation Guarantee (Administration) Act 1992 | s.19 | Super guarantee |
| Fair Work Act 2009 | s.323 | Payment requirements |

### 9. Recommended Actions
1. **Calculate underpayment** - Use Fair Work Pay Calculator to determine owed amount
2. **Request payslips in writing** - Send written request to employer
3. **Report unpaid super to ATO** - Use ATO's unpaid super tool
4. **Request bank payments** - Ask for all payments via bank transfer
5. **Provide TFN** - Give Tax File Number to employer
6. **Keep evidence** - Save all WeChat messages and screenshots

### 10. Evidence Checklist
| Evidence | Status | Priority |
|----------|--------|----------|
| WeChat chat history with employer | COLLECTED | HIGH |
| Roster/schedule screenshots | MISSING | HIGH |
| Bank statements showing no deposits | MISSING | MEDIUM |
| Photos of workplace | MISSING | LOW |
| Witness statements | MISSING | MEDIUM |

---

## Case 002: 日本料理店厨师长工作时间超标

### 1. 用户真实描述
```
我在墨尔本一家日本料理店做厨师，每天工作10小时以上。
老板说我是full-time，但是没有合同。
基本工资是$22一小时，没有加班费。
一周工作6天，经常到凌晨。我是学生签证。
```

### 2. 已知事实
```json
{
  "employerIndustry": "restaurant",
  "employerType": "日本料理",
  "jobTitle": "厨师",
  "employmentStatus": "full-time",
  "payRate": 22.00,
  "hoursPerWeek": 60,
  "workDays": 6,
  "hasContract": false,
  "visaSubclass": "500",
  "finishTime": "late night"
}
```

### 3. 缺失事实
- 雇主名称和ABN
- 是否有工资单
- 是否有养老金
- 具体工作时间表
- 是否有罚款率
- 是否提供TFN
- 是否有试工期
- 是否有休息时间

### 4. Agent应该追问的问题
1. "你每周具体工作多少小时？能告诉我每天几点到几点吗？" (exact_hours)
2. "你学生签证的工作时间限制是多少？你知道吗？" (visa_hours_limit)
3. "你有没有收到过工资单(payslip)？" (receives_payslips)
4. "晚上工作有没有额外的加班费或者罚款率？" (penalty_rates)
5. "你工作中间有休息时间吗？" (breaks)
6. "你有没有签过任何文件？" (documents_signed)

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "restaurant",
  "employerType": "日本料理",
  "jobTitle": "厨师",
  "employmentStatus": "full-time",
  "employmentType": "ongoing",
  "hasWrittenContract": false,
  "contractType": "none",
  "payRate": 22.00,
  "payRateType": "hourly",
  "paymentMethod": "bank",
  "hoursPerWeek": 60,
  "regularDays": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  "startTime": "10:00",
  "endTime": "22:00",
  "receivesPayslips": false,
  "receivesSuper": true,
  "superFundName": "Unknown",
  "tfnProvided": true,
  "visaSubclass": "500",
  "hoursLimit": 48,
  "visaHoursCompliant": false,
  "receivesPenaltyRates": false,
  "breakProvided": false,
  "overallCompleteness": 0.6,
  "averageConfidence": 0.75
}
```

### 6. Findings

#### Finding 002-A: 签证工作时间超标
```
Name: Visa Hours Breach
Description: You are working 60 hours per week, exceeding your student visa 
limit of 48 hours per fortnight during study periods. This could result in 
visa cancellation.
Severity: CRITICAL
Confidence: 0.9
```

#### Finding 002-B: 无合同
```
Name: No Employment Contract
Description: You have no written employment contract. Under the Fair Work Act, 
employers must provide a Fair Work Information Statement and written terms.
Severity: HIGH
Confidence: 0.95
```

#### Finding 002-C: 无加班费
```
Name: Missing Overtime/Penalty Rates
Description: You are not receiving overtime or penalty rates for evening and 
weekend work as required by the Hospitality Industry (General) Award.
Severity: HIGH
Confidence: 0.85
```

### 7. Severity Summary
| Finding | Severity | Urgency |
|---------|----------|---------|
| Visa Hours Breach | CRITICAL | Immediate |
| No Contract | HIGH | Within 1 week |
| Missing Penalty Rates | HIGH | Within 1 week |

### 8. Legal Basis
| Law | Section | Relevance |
|-----|---------|-----------|
| Migration Act 1958 | s.116 | Visa conditions |
| Fair Work Act 2009 | s.15 | Employment records |
| Hospitality Industry (General) Award 2020 | Clause 24 | Overtime |
| Fair Work Act 2009 | s.536 | Payslip requirements |

### 9. Recommended Actions
1. **Reduce hours immediately** - Bring hours within visa limit (48 hrs/fortnight)
2. **Request employment contract** - Ask employer for written terms
3. **Request payslips** - Ask for payslips showing all hours worked
4. **Calculate overtime owed** - Determine backpay for overtime hours
5. **Seek legal advice** - Contact community legal center for visa implications

### 10. Evidence Checklist
| Evidence | Status | Priority |
|----------|--------|----------|
| Roster showing 60-hour weeks | MISSING | CRITICAL |
| Payslips (if any) | MISSING | HIGH |
| Bank statements showing payments | MISSING | HIGH |
| Visa details | COLLECTED | HIGH |
| Communication about hours | MISSING | MEDIUM |

---

## Case 003: 火锅店服务员无薪试工

### 1. 用户真实描述
```
我去一家火锅店应聘，老板让我试工一天，说看看我能不能做。
试工从早上10点到晚上10点，12个小时。
试工结束后老板说可以，但是试工那天没有工资。
我朋友说试工应该要给钱的，是这样吗？
```

### 2. 已知事实
```json
{
  "employerIndustry": "restaurant",
  "employerType": "火锅店",
  "jobTitle": "服务员",
  "hadTrialShift": true,
  "trialShiftDuration": "12 hours",
  "trialShiftPaid": false,
  "trialShiftOutcome": "hired"
}
```

### 3. 缺失事实
- 试工日期
- 试工具体工作内容
- 是否有后续工作安排
- 每小时工资
- 签证类型
- 雇主信息

### 4. Agent应该追问的问题
1. "试工那天你具体做了什么工作？" (trial_tasks)
2. "试工是哪一天？" (trial_date)
3. "试工结束后你的工资是多少？" (pay_rate)
4. "你有和老板的聊天记录吗？关于试工的？" (evidence)
5. "试工之前有没有说好试工有工资？" (trial_agreement)

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "restaurant",
  "employerType": "火锅店",
  "jobTitle": "服务员",
  "hadTrialShift": true,
  "trialShiftDate": "2026-05-15",
  "trialShiftDuration": "PT12H",
  "trialShiftPaid": false,
  "trialShiftTasks": ["端盘子", "清理桌子", "接待客人", "洗碗"],
  "trialShiftOutcome": "hired",
  "trialShiftProductive": true,
  "trialShiftExcessive": true,
  "payRate": 20.00,
  "employmentStartDate": "2026-05-16",
  "visaSubclass": "500",
  "overallCompleteness": 0.55,
  "averageConfidence": 0.7
}
```

### 6. Findings

#### Finding 003-A: 无薪试工应支付工资
```
Name: Unpaid Trial Shift
Description: Your 12-hour trial shift involved productive work (serving 
customers, clearing tables, washing dishes). Under Fair Work guidelines, 
trial shifts involving productive work should be paid at the minimum rate.
Amount Owed: ~$396.60 (12 hours × $33.05 casual rate)
Severity: HIGH
Confidence: 0.85
```

#### Finding 003-B: 试工时间过长
```
Name: Excessive Trial Duration
Description: A 12-hour trial is excessive. Reasonable trials are typically 
1-3 hours to assess skills. This appears to be free labor rather than 
a genuine skill assessment.
Severity: HIGH
Confidence: 0.8
```

### 7. Severity Summary
| Finding | Severity | Urgency |
|---------|----------|---------|
| Unpaid Trial | HIGH | Within 1 week |
| Excessive Trial | HIGH | Within 1 week |

### 8. Legal Basis
| Law | Section | Relevance |
|-----|---------|-----------|
| Fair Work Act 2009 | s.284 | Minimum wage for work performed |
| Fair Work Ombudsman Guidance | Trial shifts | Payment for productive work |

### 9. Recommended Actions
1. **Calculate amount owed** - 12 hours × $33.05 = $396.60
2. **Request payment in writing** - Send formal request to employer
3. **File complaint with Fair Work** - If employer refuses
4. **Keep all evidence** - Screenshots, messages about trial

### 10. Evidence Checklist
| Evidence | Status | Priority |
|----------|--------|----------|
| Chat messages about trial | MISSING | HIGH |
| Roster/trial date confirmation | MISSING | HIGH |
| Witness statements | MISSING | MEDIUM |
| Photos/videos of trial work | MISSING | MEDIUM |

---

## Case 004: 意大利餐厅周末无罚款率

### 1. 用户真实描述
```
我在一家意大利餐厅做服务员，周末和平时工资一样，都是$23一小时。
我问老板周末有没有extra pay，老板说没有，说大家都这样。
我一周工作25小时，周末占了15小时。
有合同，但是合同上只写了基本工资。
```

### 2. 已知事实
```json
{
  "employerIndustry": "restaurant",
  "employerType": "意大利餐厅",
  "jobTitle": "服务员",
  "payRate": 23.00,
  "hoursPerWeek": 25,
  "weekendHours": 15,
  "hasContract": true,
  "receivesPenaltyRates": false
}
```

### 3. 缺失事实
- 合同具体内容
- 是否有工资单
- 养老金情况
- 签证类型
- 雇主ABN
- 具体工作时间

### 4. Agent应该追问的问题
1. "你的合同上有没有提到周末或者公共假日的工资？" (contract_penalty)
2. "你有收到过工资单吗？工资单上有没有显示罚款率？" (payslip_penalty)
3. "你公共假日上班吗？公共假日工资多少？" (public_holiday_rate)
4. "你是full-time还是casual？" (employment_status)
5. "你有交养老金吗？" (super)

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "restaurant",
  "employerType": "意大利餐厅",
  "jobTitle": "服务员",
  "employmentStatus": "casual",
  "hasWrittenContract": true,
  "contractType": "written",
  "payRate": 23.00,
  "payRateType": "hourly",
  "hoursPerWeek": 25,
  "weekendHours": 15,
  "regularDays": ["Friday", "Saturday", "Sunday"],
  "receivesPenaltyRates": false,
  "receivesPayslips": true,
  "payslipContainsPenalty": false,
  "visaSubclass": "500",
  "overallCompleteness": 0.7,
  "averageConfidence": 0.8
}
```

### 6. Findings

#### Finding 004-A: 缺少周末罚款率
```
Name: Missing Weekend Penalty Rates
Description: Under the Hospitality Industry (General) Award, casual employees 
working on Saturdays should receive 125% and Sundays 150% of their base rate. 
You are receiving only the base rate of $23.00.
Estimated Underpayment: ~$1,430 over 3 months
Severity: HIGH
Confidence: 0.85
```

#### Finding 004-B: 合同条款不完整
```
Name: Incomplete Contract Terms
Description: Your contract does not include penalty rate provisions as required 
by the applicable award. This is a breach of Fair Work Act requirements.
Severity: MEDIUM
Confidence: 0.8
```

### 7. Severity Summary
| Finding | Severity | Urgency |
|---------|----------|---------|
| Missing Penalty Rates | HIGH | Within 1 week |
| Incomplete Contract | MEDIUM | Within 1 month |

### 8. Legal Basis
| Law | Section | Relevance |
|-----|---------|-----------|
| Hospitality Industry (General) Award 2020 | Clause 23 | Penalty rates |
| Fair Work Act 2009 | s.15 | Employment records |

### 9. Recommended Actions
1. **Calculate penalty rate underpayment** - Saturday: $28.75/hr, Sunday: $34.50/hr
2. **Request backpay** - Calculate amount owed for all weekend hours
3. **Contact Fair Work** - For advice on enforcing penalty rates
4. **Review contract** - Check if award applies

### 10. Evidence Checklist
| Evidence | Status | Priority |
|----------|--------|----------|
| Employment contract | COLLECTED | HIGH |
| Payslips showing base rate only | MISSING | HIGH |
| Roster showing weekend hours | MISSING | HIGH |
| Award lookup confirmation | PENDING | MEDIUM |

---

## Case 005: 烧烤店员工被拖欠工资

### 1. 用户真实描述
```
我在一家烧烤店工作，老板已经两个月没发工资了。
每次问都说下周给，但一直不给。
我现在已经欠了$4000多了。
老板说店里生意不好，让我再等等。
我不知道该怎么办。
```

### 2. 已知事实
```json
{
  "employerIndustry": "restaurant",
  "employerType": "烧烤店",
  "payRate": 22.00,
  "hoursPerWeek": 35,
  "salaryOwed": 4000,
  "weeksOwed": 8,
  "hasContract": false,
  "paymentDelayed": true
}
```

### 3. 缺失事实
- 具体工作开始时间
- 之前是否正常发工资
- 是否有工资单
- 签证类型
- 雇主信息
- 书面或口头协议

### 4. Agent应该追问的问题
1. "你之前工资是怎么发的？现金还是转账？" (payment_method)
2. "你有没有工资单或者任何书面记录？" (payslips)
3. "你有和老板的聊天记录吗？关于欠薪的？" (evidence)
4. "你还在继续工作吗？" (still_working)
5. "你知道老板的全名和店铺地址吗？" (employer_info)

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "restaurant",
  "employerType": "烧烤店",
  "employmentStatus": "casual",
  "payRate": 22.00,
  "hoursPerWeek": 35,
  "paymentMethod": "bank",
  "weeksOwed": 8,
  "totalOwed": 4000,
  "stillWorking": true,
  "paymentDelayed": true,
  "hasContract": false,
  "receivesPayslips": false,
  "visaSubclass": "500",
  "overallCompleteness": 0.5,
  "averageConfidence": 0.7
}
```

### 6. Findings

#### Finding 005-A: 拖欠工资
```
Name: Unpaid Wages
Description: Your employer owes you approximately $4,000 in unpaid wages 
for 8 weeks of work. This is a serious breach of the Fair Work Act which 
requires payment at least monthly.
Severity: CRITICAL
Confidence: 0.95
```

#### Finding 005-B: 违反支付时间要求
```
Name: Late Payment Breach
Description: Under the Fair Work Act, wages must be paid at least monthly. 
Your employer has not paid you for 2 months.
Severity: HIGH
Confidence: 0.9
```

### 7. Severity Summary
| Finding | Severity | Urgency |
|---------|----------|---------|
| Unpaid Wages | CRITICAL | Immediate |
| Late Payment | HIGH | Immediate |

### 8. Legal Basis
| Law | Section | Relevance |
|-----|---------|-----------|
| Fair Work Act 2009 | s.323 | Payment requirements |
| Fair Work Act 2009 | s.325 | Payment in full |

### 9. Recommended Actions
1. **Send formal demand letter** - Request payment within 7 days
2. **Contact Fair Work** - File a complaint for unpaid wages
3. **Stop working** - Consider stopping work until paid
4. **Gather evidence** - Collect all proof of hours worked
5. **Seek legal aid** - Contact community legal center

### 10. Evidence Checklist
| Evidence | Status | Priority |
|----------|--------|----------|
| Bank statements showing no payment | MISSING | CRITICAL |
| Chat messages about unpaid wages | MISSING | CRITICAL |
| Roster/hours worked records | MISSING | HIGH |
| Photos of workplace | MISSING | MEDIUM |
| Witness statements | MISSING | MEDIUM |

---

## Case 006: 韩餐厅厨师无养老金

### 1. 用户真实描述
```
我在一家韩国餐厅做厨师，做了快一年了。
最近查了一下myGov，发现老板从来没给我交过super。
我每周工资$880，都是银行转账。
有工资单，但是工资单上没有super这一项。
```

### 2. 已知事实
```json
{
  "employerIndustry": "restaurant",
  "employerType": "韩国餐厅",
  "jobTitle": "厨师",
  "weeklyPay": 880,
  "paymentMethod": "bank",
  "receivesPayslips": true,
  "payslipContainsSuper": false,
  "receivesSuper": false,
  "employmentDuration": "~1 year"
}
```

### 3. 缺失事实
- 每小时工资
- 每周工作小时数
- 工资单具体内容
- super基金信息
- 合同情况
- 签证类型

### 4. Agent应该追问的问题
1. "你的时薪是多少？" (pay_rate)
2. "每周工作多少小时？" (hours_per_week)
3. "你能发一张工资单的截图给我吗？" (payslip_evidence)
4. "你有没有签过super choice form？" (super_choice)
5. "你的super基金是哪家？" (super_fund)

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "restaurant",
  "employerType": "韩国餐厅",
  "jobTitle": "厨师",
  "employmentStatus": "full-time",
  "payRate": 22.00,
  "hoursPerWeek": 40,
  "weeklyPay": 880,
  "paymentMethod": "bank",
  "receivesPayslips": true,
  "payslipContainsSuper": false,
  "receivesSuper": false,
  "superExpectedAmount": 5082.00,
  "superUnderpayment": 5082.00,
  "employmentDuration": "PT52W",
  "visaSubclass": "500",
  "overallCompleteness": 0.75,
  "averageConfidence": 0.85
}
```

### 6. Findings

#### Finding 006-A: 未支付养老金
```
Name: Missing Superannuation Payments
Description: Your employer has not paid any superannuation for nearly 1 year. 
At the current 12% SG rate, $880/week over 52 weeks would be about $5,491.20 in unpaid super; actual historical calculations should use the rate for each pay period.
Severity: CRITICAL
Confidence: 0.95
```

#### Finding 006-B: 工资单缺少必要信息
```
Name: Incomplete Payslip
Description: Your payslip does not show superannuation contributions as 
required by Fair Work regulations.
Severity: HIGH
Confidence: 0.9
```

### 7. Severity Summary
| Finding | Severity | Urgency |
|---------|----------|---------|
| Missing Super | CRITICAL | Immediate |
| Incomplete Payslip | HIGH | Within 1 week |

### 8. Legal Basis
| Law | Section | Relevance |
|-----|---------|-----------|
| Superannuation Guarantee (Administration) Act 1992 | s.19 | SG obligations |
| Fair Work Act 2009 | s.536 | Payslip requirements |

### 9. Recommended Actions
1. **Report to ATO** - Use ATO's unpaid super tool
2. **Calculate total owed** - current SG rate × gross pay × weeks worked
3. **Request super choice form** - Choose your own fund
4. **Keep all payslips** - As evidence

### 10. Evidence Checklist
| Evidence | Status | Priority |
|----------|--------|----------|
| Payslips without super | COLLECTED | HIGH |
| myGov super balance | COLLECTED | HIGH |
| Bank statements showing payments | MISSING | HIGH |
| Employment contract | MISSING | MEDIUM |

---

## Case 007: 泰餐厅员工被错误分类为承包商

### 1. 用户真实描述
```
老板说我是contractor，不是employee。
让我自己报税，不给我交super。
但实际上我每天要按照老板的时间上班，
老板告诉我怎么做，用老板的材料。
每周固定工资$800。
```

### 2. 已知事实
```json
{
  "employerIndustry": "restaurant",
  "employerType": "泰餐厅",
  "classification": "contractor",
  "weeklyPay": 800,
  "fixedSchedule": true,
  "usesEmployerMaterials": true,
  "directedByEmployer": true,
  "receivesSuper": false
}
```

### 3. 缺失事实
- 具体工作内容
- 是否有ABN
- 是否自己开发票
- 工作时间
- 合同类型
- 签证类型

### 4. Agent应该追问的问题
1. "你有没有ABN？" (has_abn)
2. "你需要自己开发票(invoice)给老板吗？" (invoices)
3. "你能决定自己的工作时间吗？" (controls_hours)
4. "你可以找别人代替你工作吗？" (substitution)
5. "你用自己的工具还是老板的？" (tools)

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "restaurant",
  "employerType": "泰餐厅",
  "classification": "contractor",
  "weeklyPay": 800,
  "fixedSchedule": true,
  "usesEmployerMaterials": true,
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

#### Finding 007-A: 假承包商(Sham Contracting)
```
Name: Sham Contracting
Description: Despite being classified as a contractor, your working 
arrangement indicates you are actually an employee. You work fixed hours, 
use employer's materials, and are directed by the employer. This is sham 
contracting under the Fair Work Act.
Severity: CRITICAL
Confidence: 0.9
```

#### Finding 007-B: 未支付养老金
```
Name: Missing Superannuation
Description: As a de facto employee, you are entitled to superannuation 
guarantee payments. Your employer has not paid any super.
Severity: CRITICAL
Confidence: 0.9
```

### 7. Severity Summary
| Finding | Severity | Urgency |
|---------|----------|---------|
| Sham Contracting | CRITICAL | Immediate |
| Missing Super | CRITICAL | Immediate |

### 8. Legal Basis
| Law | Section | Relevance |
|-----|---------|-----------|
| Fair Work Act 2009 | s.357 | Sham contracting |
| Superannuation Guarantee Act 1992 | s.12 | Employee definition |

### 9. Recommended Actions
1. **Document working arrangement** - Keep evidence of employer control
2. **Report to Fair Work** - Sham contracting is illegal
3. **Claim employee entitlements** - Super, leave, etc.
4. **Seek legal advice** - Contact community legal center

### 10. Evidence Checklist
| Evidence | Status | Priority |
|----------|--------|----------|
| Roster showing fixed hours | MISSING | CRITICAL |
| Messages showing employer direction | MISSING | HIGH |
| Evidence of using employer materials | MISSING | HIGH |
| Payment records | MISSING | HIGH |

---

## Case 008: 餐厅员工工作受伤未获赔偿

### 1. 用户真实描述
```
我在餐厅厨房工作时被热油烫伤了手。
老板说是我自己不小心，不愿意帮我报工伤。
医药费我自己付了$500多。
现在手还没好，但是老板让我继续上班。
我不知道我有没有工伤保险。
```

### 2. 已知事实
```json
{
  "employerIndustry": "restaurant",
  "jobTitle": "厨房",
  "workplaceInjury": true,
  "injuryType": "burn",
  "medicalCosts": 500,
  "employerRefusedClaim": true,
  "stillWorking": true
}
```

### 3. 缺失事实
- 受伤具体经过
- 是否有安全培训
- 是否提供PPE
- 雇主是否有工伤保险
- 合同情况
- 签证类型

### 4. Agent应该追问的问题
1. "你有没有签过安全培训？" (safety_training)
2. "老板有没有给你手套或者其他保护设备？" (ppe_provided)
3. "你有没有去看医生？有医疗记录吗？" (medical_records)
4. "你有没有告诉老板你要报工伤？" (injury_reported)
5. "你有保险吗？" (insurance)

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "restaurant",
  "jobTitle": "厨房",
  "workplaceInjury": true,
  "injuryType": "burn",
  "injuryDate": "2026-05-20",
  "injuryReported": true,
  "employerRefusedClaim": true,
  "medicalCosts": 500,
  "hasSafetyTraining": false,
  "ppeProvided": false,
  "stillWorking": true,
  "visaSubclass": "500",
  "overallCompleteness": 0.6,
  "averageConfidence": 0.75
}
```

### 6. Findings

#### Finding 008-A: 工伤赔偿权利
```
Name: Workers Compensation Entitlement
Description: You were injured at work and are entitled to workers 
compensation, regardless of whose fault it was. Your employer cannot 
refuse to process a claim.
Severity: HIGH
Confidence: 0.9
```

#### Finding 008-B: 缺乏安全培训
```
Name: Missing Safety Training
Description: Your employer did not provide safety training for kitchen work, 
which is a breach of Work Health and Safety laws.
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
3. **Keep all medical records** - Document injury
4. **Seek legal advice** - Contact workers comp lawyer
5. **Stop working if injured** - You have the right

### 10. Evidence Checklist
| Evidence | Status | Priority |
|----------|--------|----------|
| Medical records | MISSING | CRITICAL |
| Photos of injury | MISSING | HIGH |
| Messages about injury to employer | MISSING | HIGH |
| Medical receipts | MISSING | HIGH |
| Witness statements | MISSING | MEDIUM |

---

## Case 009: 餐厅经理克扣小费

### 1. 用户真实描述
```
我们餐厅有小费，但是经理说小费要统一收，然后分给所有人。
但实际上我从来没收到过小费分成。
客人有时候直接给我现金小费，经理说要上交。
我一个月大概有$300-400的小费被收走。
```

### 2. 已知事实
```json
{
  "employerIndustry": "restaurant",
  "jobTitle": "服务员",
  "tipsCollected": true,
  "tipsKeptByManager": true,
  "monthlyTipsKept": 350,
  "tipsShared": false
}
```

### 3. 缺失事实
- 小费政策是否写在合同里
- 是否有书面记录
- 工资单是否显示小费
- 雇主信息
- 签证类型

### 4. Agent应该追问的问题
1. "你有没有签过关于小费的协议？" (tip_agreement)
2. "你能证明小费被收走了吗？" (tip_evidence)
3. "其他同事有收到小费分成吗？" (colleague_tips)
4. "你的合同上有没有写小费的条款？" (contract_tips)

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "restaurant",
  "jobTitle": "服务员",
  "tipsCollected": true,
  "tipsKeptByManager": true,
  "monthlyTipsKept": 350,
  "tipsShared": false,
  "tipPolicyInContract": false,
  "visaSubclass": "500",
  "overallCompleteness": 0.5,
  "averageConfidence": 0.7
}
```

### 6. Findings

#### Finding 009-A: 小费被不当扣留
```
Name: Tips Withheld Unlawfully
Description: Your manager is collecting tips but not distributing them. 
While Australian law doesn't specifically regulate tips, keeping tips 
that were intended for workers may constitute wage theft in some states.
Estimated Loss: ~$350/month
Severity: MEDIUM
Confidence: 0.7
```

### 7. Severity Summary
| Finding | Severity | Urgency |
|---------|----------|---------|
| Tips Withheld | MEDIUM | Within 1 month |

### 8. Legal Basis
| Law | Section | Relevance |
|-----|---------|-----------|
| Fair Work Act 2009 | s.323 | Payment to employee |
| State wage theft laws | Various | Depending on state |

### 9. Recommended Actions
1. **Document tip collection** - Keep records of tips given
2. **Request tip policy in writing** - Ask employer for policy
3. **Contact Fair Work** - For advice on tip entitlements
4. **Talk to colleagues** - See if others have same issue

### 10. Evidence Checklist
| Evidence | Status | Priority |
|----------|--------|----------|
| Records of tips collected | MISSING | HIGH |
| Messages about tips | MISSING | HIGH |
| Witness statements from colleagues | MISSING | MEDIUM |
| Contract terms about tips | MISSING | MEDIUM |

---

## Case 010: 海鲜餐厅员工签证过期仍在工作

### 1. 用户真实描述
```
我的学生签证上个月过期了，但是我还继续在餐厅工作。
老板知道我签证过期了，但是说没关系，可以继续做。
我正在申请新的签证，但是还没批下来。
我不知道这样工作合不合法。
```

### 2. 已知事实
```json
{
  "employerIndustry": "restaurant",
  "visaExpired": true,
  "visaExpiryDate": "2026-05-01",
  "stillWorking": true,
  "newVisaApplied": true,
  "newVisaPending": true,
  "employerAware": true
}
```

### 3. 缺失事实
- 原签证类型
- 新签证类型
- 工资情况
- 工作时间
- 雇主信息

### 4. Agent应该追问的问题
1. "你原来是什么签证？" (original_visa)
2. "你申请的是什么签证？" (new_visa_type)
3. "你现在有桥签(bridging visa)吗？" (bridging_visa)
4. "你现在的工资是多少？" (current_pay)
5. "你每周工作多少小时？" (hours)

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "restaurant",
  "visaExpired": true,
  "visaExpiryDate": "2026-05-01",
  "originalVisaSubclass": "500",
  "newVisaApplied": true,
  "newVisaPending": true,
  "bridgingVisaHeld": false,
  "stillWorking": true,
  "employerAware": true,
  "overallCompleteness": 0.5,
  "averageConfidence": 0.8
}
```

### 6. Findings

#### Finding 010-A: 签证过期非法工作
```
Name: Working Without Valid Visa
Description: You are working with an expired visa. This is a breach of the 
Migration Act and could result in detention, deportation, and a ban on 
returning to Australia.
Severity: CRITICAL
Confidence: 0.95
```

#### Finding 010-B: 雇主雇佣非法工人
```
Name: Employer Employing Illegal Worker
Description: Your employer knowingly employs someone without valid work 
rights. This is illegal and employer faces significant penalties.
Severity: CRITICAL
Confidence: 0.9
```

### 7. Severity Summary
| Finding | Severity | Urgency |
|---------|----------|---------|
| Working Without Valid Visa | CRITICAL | Immediate |
| Employer Employing Illegal Worker | CRITICAL | Immediate |

### 8. Legal Basis
| Law | Section | Relevance |
|-----|---------|-----------|
| Migration Act 1958 | s.14 | Unlawful non-citizens |
| Migration Act 1958 | s.245 | Employer sanctions |

### 9. Recommended Actions
1. **Stop working immediately** - Until visa status resolved
2. **Apply for bridging visa** - Contact immigration lawyer
3. **Contact Department of Home Affairs** - Seek advice
4. **Do not tell employer about immigration status** - Protect yourself

### 10. Evidence Checklist
| Evidence | Status | Priority |
|----------|--------|----------|
| Visa grant letter (expired) | MISSING | CRITICAL |
| New visa application confirmation | MISSING | HIGH |
| Employment records | MISSING | HIGH |
| Communication with employer about visa | MISSING | HIGH |

---

## Case 011: 西餐厅厨师被迫无偿加班

### 1. 用户真实描述
```
我在一家西餐厅做厨师，合同写的是每天8小时。
但实际上每天都要做10-12小时，多出来的时间没有工资。
老板说这是行业惯例，大家都这样。
我一个月大概加班60小时，一分钱没拿到。
```

### 2. 已知事实
```json
{
  "employerIndustry": "restaurant",
  "employerType": "西餐厅",
  "jobTitle": "厨师",
  "contractedHours": 8,
  "actualHours": 11,
  "unpaidOvertime": 3,
  "monthlyOvertime": 60,
  "hasContract": true
}
```

### 3. 缺失事实
- 每小时工资
- 合同具体内容
- 是否有工资单
- 签证类型
- 养老金情况

### 4. Agent应该追问的问题
1. "你的时薪是多少？" (pay_rate)
2. "合同上有没有写加班费的条款？" (contract_overtime)
3. "你有工资单吗？工资单上有没有显示加班时间？" (payslip_overtime)
4. "你有没有签过任何放弃加班费的文件？" (overtime_waiver)

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "restaurant",
  "employerType": "西餐厅",
  "jobTitle": "厨师",
  "employmentStatus": "full-time",
  "hasWrittenContract": true,
  "contractedHoursPerDay": 8,
  "actualHoursPerDay": 11,
  "unpaidOvertimePerDay": 3,
  "monthlyOvertime": 60,
  "payRate": 25.00,
  "receivesPenaltyRates": false,
  "visaSubclass": "500",
  "overallCompleteness": 0.7,
  "averageConfidence": 0.8
}
```

### 6. Findings

#### Finding 011-A: 未支付加班费
```
Name: Unpaid Overtime
Description: You are working approximately 60 hours of unpaid overtime 
per month. Under the Hospitality Award, overtime should be paid at 
150% for the first 2 hours and 200% thereafter.
Estimated Owed: ~$6,750 for 3 months
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
| Hospitality Industry (General) Award 2020 | Clause 24 | Overtime rates |
| Fair Work Act 2009 | s.323 | Payment requirements |

### 9. Recommended Actions
1. **Document all overtime** - Keep records of actual hours
2. **Calculate overtime owed** - 150% first 2hrs, 200% after
3. **Request backpay** - Formal written request
4. **Contact Fair Work** - File complaint if not paid

### 10. Evidence Checklist
| Evidence | Status | Priority |
|----------|--------|----------|
| Employment contract | COLLECTED | HIGH |
| Time records showing overtime | MISSING | CRITICAL |
| Payslips without overtime | MISSING | HIGH |
| Roster showing extended hours | MISSING | HIGH |

---

## Case 012: 餐厅员工被种族歧视

### 1. 用户真实描述
```
老板经常用中文骂我，说"你们留学生就是笨"。
还说"不想干就滚，有的是人排队"。
其他中国员工也经常被骂。
有一次老板当着客人的面羞辱我。
我觉得很委屈，但是不知道怎么办。
```

### 2. 已知事实
```json
{
  "employerIndustry": "restaurant",
  "discriminationType": ["racial", "verbal abuse"],
  "harassmentType": ["verbal", "workplace bullying"],
  "frequency": "regular",
  "witnesses": true
}
```

### 3. 缺失事实
- 具体事件记录
- 其他受影响员工
- 是否有证据
- 工资和合同情况
- 签证类型

### 4. Agent应该追问的问题
1. "你能告诉我具体的事件吗？日期和时间？" (incident_details)
2. "有没有其他员工也受到同样的对待？" (other_victims)
3. "你有没有录音或者截图？" (evidence)
4. "你有没有向任何人投诉过？" (complaints_made)
5. "你想继续在这家店工作吗？" (desired_outcome)

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "restaurant",
  "experiencedDiscrimination": true,
  "discriminationType": ["racial"],
  "experiencedHarassment": true,
  "harassmentType": ["verbal abuse", "workplace bullying"],
  "experiencedBullying": true,
  "incidentFrequency": "regular",
  "witnessesExist": true,
  "otherVictimsExist": true,
  "evidenceAvailable": false,
  "visaSubclass": "500",
  "overallCompleteness": 0.55,
  "averageConfidence": 0.7
}
```

### 6. Findings

#### Finding 012-A: 种族歧视
```
Name: Racial Discrimination
Description: You are experiencing racial discrimination in the workplace. 
Under the Fair Work Act and Racial Discrimination Act, this is illegal.
Severity: HIGH
Confidence: 0.85
```

#### Finding 012-B: 工作场所欺凌
```
Name: Workplace Bullying
Description: Regular verbal abuse and humiliation constitutes workplace 
bullying under the Fair Work Act.
Severity: HIGH
Confidence: 0.85
```

### 7. Severity Summary
| Finding | Severity | Urgency |
|---------|----------|---------|
| Racial Discrimination | HIGH | Within 1 week |
| Workplace Bullying | HIGH | Within 1 week |

### 8. Legal Basis
| Law | Section | Relevance |
|-----|---------|-----------|
| Fair Work Act 2009 | s.789FD | Workplace bullying |
| Racial Discrimination Act 1975 | s.9 | Racial discrimination |
| Fair Work Act 2009 | Part 3-1 | General protections |

### 9. Recommended Actions
1. **Document incidents** - Keep detailed records
2. **Report to Fair Work** - File bullying complaint
3. **Contact AHRC** - Australian Human Rights Commission
4. **Seek support** - Contact migrant worker center
5. **Consider leaving** - Your mental health matters

### 10. Evidence Checklist
| Evidence | Status | Priority |
|----------|--------|----------|
| Incident diary with dates | MISSING | CRITICAL |
| Witness statements | MISSING | HIGH |
| Messages/recordings | MISSING | HIGH |
| Medical records (if stress) | MISSING | MEDIUM |

---

## Case 013: 餐饮员工被不当解雇

### 1. 用户真实描述
```
我在一家餐厅做了8个月，上周突然被老板炒了。
老板说是因为"生意不好要裁员"，但是马上就请了新人。
我觉得是因为我之前问过为什么没有super。
我没有收到任何书面通知。
```

### 2. 已知事实
```json
{
  "employerIndustry": "restaurant",
  "employmentDuration": "8 months",
  "dismissed": true,
  "dismissalReason": "redundancy",
  "replacementHired": true,
  "priorComplaint": "asked about super",
  "writtenNotice": false
}
```

### 3. 缺失事实
- 解雇日期
- 是否有合同
- 通知期
- 工资情况
- 是否收到解雇信

### 4. Agent应该追问的问题
1. "你是什么时候被炒的？" (dismissal_date)
2. "老板有没有给你书面的解雇通知？" (written_notice)
3. "你问过super之后多久被炒的？" (timeline)
4. "你有没有签过任何解雇文件？" (documents_signed)
5. "你想拿回工作还是想要赔偿？" (desired_outcome)

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "restaurant",
  "employmentDuration": "PT8M",
  "wasDismissed": true,
  "dismissalDate": "2026-05-25",
  "dismissalReason": "redundancy",
  "dismissalNoticeGiven": false,
  "dismissalWrittenNotice": false,
  "replacementHired": true,
  "priorComplaintAboutSuper": true,
  "timeBetweenComplaintAndDismissal": "2 weeks",
  "visaSubclass": "500",
  "overallCompleteness": 0.65,
  "averageConfidence": 0.8
}
```

### 6. Findings

#### Finding 013-A: 可能的报复性解雇
```
Name: Potential Adverse Action
Description: You were dismissed shortly after asking about superannuation 
entitlements. This may constitute adverse action (retaliation) for 
exercising a workplace right.
Severity: HIGH
Confidence: 0.8
```

#### Finding 013-B: 未收到适当通知
```
Name: Insufficient Notice
Description: You did not receive written notice of termination as required 
by the Fair Work Act. Minimum notice period is 1 week for less than 1 year.
Severity: MEDIUM
Confidence: 0.85
```

### 7. Severity Summary
| Finding | Severity | Urgency |
|---------|----------|---------|
| Adverse Action | HIGH | Within 1 week |
| Insufficient Notice | MEDIUM | Within 1 month |

### 8. Legal Basis
| Law | Section | Relevance |
|-----|---------|-----------|
| Fair Work Act 2009 | s.340 | Adverse action protections |
| Fair Work Act 2009 | s.117 | Notice of termination |

### 9. Recommended Actions
1. **File unfair dismissal claim** - Within 21 days
2. **Document timeline** - When you complained, when fired
3. **Contact Fair Work** - For advice
4. **Seek legal aid** - Community legal center

### 10. Evidence Checklist
| Evidence | Status | Priority |
|----------|--------|----------|
| Messages about super complaint | MISSING | CRITICAL |
| Evidence of replacement hire | MISSING | HIGH |
| Employment records | MISSING | HIGH |
| Timeline of events | MISSING | HIGH |

---

## Case 014: 餐厅洗碗工被少算工时

### 1. 用户真实描述
```
我在餐厅洗碗，老板说每天只算7小时，但我实际要做8-9小时。
老板说"吃饭时间不算"，但实际上我吃饭的时候还要洗碗。
一个月下来被少算了大概30-40小时。
```

### 2. 已知事实
```json
{
  "employerIndustry": "restaurant",
  "jobTitle": "洗碗工",
  "paidHours": 7,
  "actualHours": 8.5,
  "unpaidBreak": true,
  "breakWorking": true,
  "monthlyHoursUnderpaid": 35
}
```

### 3. 缺失事实
- 时薪
- 合同情况
- 工资单
- 签证类型

### 4. Agent应该追问的问题
1. "你的时薪是多少？" (pay_rate)
2. "你有签过关于休息时间的协议吗？" (break_agreement)
3. "你有记录实际工作时间吗？" (time_records)
4. "你有工资单吗？" (payslips)

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "restaurant",
  "jobTitle": "洗碗工",
  "employmentStatus": "casual",
  "paidHoursPerDay": 7,
  "actualHoursPerDay": 8.5,
  "breakDuration": 1,
  "breakPaid": false,
  "breakWorking": true,
  "monthlyHoursUnderpaid": 35,
  "payRate": 21.00,
  "visaSubclass": "500",
  "overallCompleteness": 0.6,
  "averageConfidence": 0.75
}
```

### 6. Findings

#### Finding 014-A: 工时被少算
```
Name: Hours Underreported
Description: Your employer is not paying you for all hours worked. 
Break time where you continue working must be paid.
Estimated Owed: ~$2,205 for 3 months
Severity: HIGH
Confidence: 0.85
```

### 7. Severity Summary
| Finding | Severity | Urgency |
|---------|----------|---------|
| Hours Underreported | HIGH | Within 1 week |

### 8. Legal Basis
| Law | Section | Relevance |
|-----|---------|-----------|
| Fair Work Act 2009 | s.323 | Payment for hours worked |
| Hospitality Award 2020 | Clause 15 | Breaks |

### 9. Recommended Actions
1. **Keep time records** - Log actual start/end times
2. **Request correction** - Ask employer to pay all hours
3. **Contact Fair Work** - File complaint
4. **Calculate owed amount** - Unpaid hours × hourly rate

### 10. Evidence Checklist
| Evidence | Status | Priority |
|----------|--------|----------|
| Personal time records | MISSING | CRITICAL |
| Roster showing start/end times | MISSING | HIGH |
| Payslips showing 7 hours | MISSING | HIGH |
| Witness statements | MISSING | MEDIUM |

---

## Case 015: 餐饮员工没有年假

### 1. 用户真实描述
```
我在餐厅做full-time，做了1年半了。
我想请年假，老板说casual没有年假。
但我的合同写的是full-time。
去年过年我想回国，老板说请一天扣一天工资。
```

### 2. 已知事实
```json
{
  "employerIndustry": "restaurant",
  "employmentStatus": "full-time",
  "employmentDuration": "18 months",
  "annualLeaveRequested": true,
  "annualLeaveDenied": true,
  "leaveDeducted": true
}
```

### 3. 缺失事实
- 合同具体内容
- 工资情况
- 是否有工资单
- 签证类型

### 4. Agent应该追问的问题
1. "你的合同上写的是full-time还是casual？" (contract_status)
2. "你有收到过工资单吗？工资单上有没有显示年假余额？" (leave_balance)
3. "你请假的时候工资有没有被扣？" (leave_deducted)
4. "你有没有签过任何放弃年假的文件？" (leave_waiver)

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "restaurant",
  "employmentStatus": "full-time",
  "hasWrittenContract": true,
  "contractStatus": "full-time",
  "employmentDuration": "PT18M",
  "annualLeaveEntitled": true,
  "annualLeaveGranted": false,
  "leaveDeductedFromPay": true,
  "visaSubclass": "500",
  "overallCompleteness": 0.65,
  "averageConfidence": 0.8
}
```

### 6. Findings

#### Finding 015-A: 未提供年假
```
Name: Annual Leave Denied
Description: As a full-time employee, you are entitled to 4 weeks paid 
annual leave per year. Your employer is denying this entitlement.
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
| National Employment Standards | s.90 | Payment for leave |

### 9. Recommended Actions
1. **Request leave in writing** - Formal written request
2. **Calculate leave owed** - 4 weeks × weekly pay
3. **Contact Fair Work** - File complaint
4. **Keep employment records** - Proof of full-time status

### 10. Evidence Checklist
| Evidence | Status | Priority |
|----------|--------|----------|
| Employment contract | COLLECTED | HIGH |
| Payslips without leave accrual | MISSING | HIGH |
| Leave request records | MISSING | HIGH |
| Messages about leave denial | MISSING | MEDIUM |

---

## Case 016: 餐饮员工周末被要求无偿工作

### 1. 用户真实描述
```
老板说周末太忙了，让我来"帮忙"，但是不算工资。
说就当是"团队建设"，以后会补偿。
我已经连续3个周末去帮忙了，每次8小时。
一分钱没拿到。
```

### 2. 已知事实
```json
{
  "employerIndustry": "restaurant",
  "weekendWorkRequired": true,
  "weekendWorkPaid": false,
  "weekendHours": 8,
  "consecutiveWeekends": 3,
  "totalUnpaidHours": 24,
  "promiseOfFutureCompensation": true
}
```

### 3. 缺失事实
- 时薪
- 是否有合同
- 工作性质
- 签证类型

### 4. Agent应该追问的问题
1. "你平时工作日的时薪是多少？" (weekday_rate)
2. "老板有没有说过什么时候补偿你？" (compensation_timeline)
3. "你有没有聊天记录证明周末工作？" (evidence)
4. "你有没有说过你不愿意？" (consent)

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "restaurant",
  "weekendWorkRequired": true,
  "weekendWorkPaid": false,
  "weekendHoursPerDay": 8,
  "consecutiveWeekends": 3,
  "totalUnpaidHours": 24,
  "promiseOfFutureCompensation": true,
  "compensationTimeline": "unspecified",
  "payRate": 23.00,
  "visaSubclass": "500",
  "overallCompleteness": 0.55,
  "averageConfidence": 0.75
}
```

### 6. Findings

#### Finding 016-A: 无偿工作
```
Name: Unpaid Work
Description: You have worked 24 hours over 3 weekends without pay. 
All hours worked must be paid at minimum wage. "Team building" is 
not a valid reason to withhold pay.
Estimated Owed: ~$793.20 (24 hrs × $33.05 casual rate)
Severity: HIGH
Confidence: 0.9
```

### 7. Severity Summary
| Finding | Severity | Urgency |
|---------|----------|---------|
| Unpaid Work | HIGH | Immediate |

### 8. Legal Basis
| Law | Section | Relevance |
|-----|---------|-----------|
| Fair Work Act 2009 | s.323 | Payment for work |

### 9. Recommended Actions
1. **Refuse further unpaid work** - You have the right
2. **Request payment** - For all hours worked
3. **Document hours** - Keep records
4. **Contact Fair Work** - File complaint

### 10. Evidence Checklist
| Evidence | Status | Priority |
|----------|--------|----------|
| Messages about weekend work | MISSING | CRITICAL |
| Roster for weekends | MISSING | HIGH |
| Witness statements | MISSING | MEDIUM |

---

## Case 017: 餐厅员工被要求自费购买制服

### 1. 用户真实描述
```
老板让我买制服，一件$50，从工资里扣。
我一个月才赚$2000，被扣了$50。
而且制服质量很差，洗了几次就坏了。
老板说每3个月要换新的，都要自己买。
```

### 2. 已知事实
```json
{
  "employerIndustry": "restaurant",
  "uniformRequired": true,
  "uniformCost": 50,
  "deductedFromPay": true,
  "replacementFrequency": "3 months",
  "qualityPoor": true
}
```

### 3. 缺失事实
- 合同中关于制服的条款
- 工资单
- 是否有其他扣款

### 4. Agent应该追问的问题
1. "你的合同上有没有写制服的条款？" (contract_uniform)
2. "工资单上有没有显示制服扣款？" (payslip_deduction)
3. "你有没有同意购买制服？" (consent)
4. "除了制服还有其他扣款吗？" (other_deductions)

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "restaurant",
  "uniformRequired": true,
  "uniformCost": 50,
  "deductedFromPay": true,
  "replacementFrequency": "PT3M",
  "annualUniformCost": 200,
  "contractIncludesUniform": false,
  "visaSubclass": "500",
  "overallCompleteness": 0.6,
  "averageConfidence": 0.8
}
```

### 6. Findings

#### Finding 017-A: 不当制服扣款
```
Name: Unlawful Uniform Deduction
Description: Deducting uniform costs from pay without proper agreement 
may be unlawful. Employers generally cannot deduct uniform costs unless 
allowed by award, agreement, or with employee consent.
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
| Fair Work Act 2009 | s.325 | Payment in full |

### 9. Recommended Actions
1. **Request refund** - For uniform costs
2. **Refuse future deductions** - Without proper agreement
3. **Contact Fair Work** - For advice

### 10. Evidence Checklist
| Evidence | Status | Priority |
|----------|--------|----------|
| Payslips showing deduction | MISSING | HIGH |
| Receipts for uniform | MISSING | MEDIUM |
| Contract terms about uniform | MISSING | MEDIUM |

---

## Case 018: 餐厅员工工作环境不安全

### 1. 用户真实描述
```
厨房地板很滑，已经好几个人滑倒了。
油烟机坏了两个月没修，厨房全是烟。
灭火器过期了。
我跟老板说过好几次，老板说没钱修。
```

### 2. 已知事实
```json
{
  "employerIndustry": "restaurant",
  "hazardSlipperyFloor": true,
  "hazardBrokenVentilation": true,
  "hazardExpiredFireExtinguisher": true,
  "multipleIncidents": true,
  "employerAware": true,
  "employerRefusedFix": true
}
```

### 3. 缺失事实
- 是否有安全培训
- 是否有PPE
- 具体受伤情况

### 4. Agent应该追问的问题
1. "有没有人因为滑倒受伤？" (injuries)
2. "你有没有向任何部门投诉过？" (complaints)
3. "老板有没有提供防滑鞋？" (ppe)
4. "你有没有记录这些安全隐患？" (evidence)

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "restaurant",
  "workplaceHazards": ["slippery floor", "broken ventilation", "expired fire extinguisher"],
  "multipleIncidents": true,
  "employerAware": true,
  "employerRefusedFix": true,
  "hasSafetyTraining": false,
  "ppeProvided": false,
  "visaSubclass": "500",
  "overallCompleteness": 0.6,
  "averageConfidence": 0.8
}
```

### 6. Findings

#### Finding 018-A: 工作环境不安全
```
Name: Unsafe Workplace
Description: Multiple safety hazards exist: slippery floors, broken 
ventilation, expired fire extinguisher. Your employer has a duty to 
provide a safe workplace and has failed to do so.
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
| Work Health and Safety Act 2011 | s.19 | Primary duty of care |

### 9. Recommended Actions
1. **Report to SafeWork** - Immediately
2. **Document hazards** - Photos and videos
3. **Refuse unsafe work** - You have the right
4. **Seek medical attention** - If injured

### 10. Evidence Checklist
| Evidence | Status | Priority |
|----------|--------|----------|
| Photos of hazards | MISSING | CRITICAL |
| Incident reports | MISSING | HIGH |
| Messages to employer about safety | MISSING | HIGH |
| Medical records | MISSING | MEDIUM |

---

## Case 019: 餐饮员工被威胁解雇

### 1. 用户真实描述
```
老板说如果我告诉别人我的工资，就炒了我。
还说如果我去投诉，就让同行都不请我。
我觉得老板是在威胁我，因为我的工资比别人低。
```

### 2. 已知事实
```json
{
  "employerIndustry": "restaurant",
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
4. "你想继续在这家店工作吗？" (desired_outcome)

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "restaurant",
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

#### Finding 019-A: 不当威胁
```
Name: Unlawful Threats
Description: Threatening dismissal for discussing pay is illegal. 
Employees have the right to discuss their pay. Blacklisting threats 
are also unlawful.
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
4. **Seek legal advice** - Community legal center

### 10. Evidence Checklist
| Evidence | Status | Priority |
|----------|--------|----------|
| Messages about threats | MISSING | CRITICAL |
| Witness statements | MISSING | HIGH |
| Pay comparison evidence | MISSING | MEDIUM |

---

## Case 020: 餐饮员工被强制要求参加无偿培训

### 1. 用户真实描述
```
老板让我参加餐厅的培训，每周六下午3小时。
培训没有工资，说是"必须参加"。
已经连续2个月了，总共24小时。
培训内容是服务技巧和食品安全。
```

### 2. 已知事实
```json
{
  "employerIndustry": "restaurant",
  "trainingRequired": true,
  "trainingPaid": false,
  "trainingHoursPerWeek": 3,
  "trainingWeeks": 8,
  "totalTrainingHours": 24,
  "trainingContent": ["service skills", "food safety"]
}
```

### 3. 缺失事实
- 时薪
- 合同中培训条款
- 是否是工作时间外

### 4. Agent应该追问的问题
1. "培训是在你正常工作时间之外吗？" (outside_hours)
2. "你的合同上有没有写培训的条款？" (contract_training)
3. "培训是强制的吗？不参加会怎样？" (mandatory)
4. "你有培训的记录吗？" (training_records)

### 5. 最终EmploymentFacts
```json
{
  "employerIndustry": "restaurant",
  "trainingRequired": true,
  "trainingPaid": false,
  "trainingOutsideHours": true,
  "trainingHoursPerWeek": 3,
  "trainingWeeks": 8,
  "totalTrainingHours": 24,
  "trainingMandatory": true,
  "payRate": 23.00,
  "visaSubclass": "500",
  "overallCompleteness": 0.65,
  "averageConfidence": 0.8
}
```

### 6. Findings

#### Finding 020-A: 无偿培训应支付工资
```
Name: Unpaid Mandatory Training
Description: Mandatory training must be paid at your hourly rate. 
Your employer has required 24 hours of unpaid training.
Estimated Owed: ~$552 (24 hrs × $23.00)
Severity: HIGH
Confidence: 0.85
```

### 7. Severity Summary
| Finding | Severity | Urgency |
|---------|----------|---------|
| Unpaid Training | HIGH | Within 1 week |

### 8. Legal Basis
| Law | Section | Relevance |
|-----|---------|-----------|
| Fair Work Act 2009 | s.323 | Payment for work |
| Fair Work Ombudsman Guidance | Training | Payment for mandatory training |

### 9. Recommended Actions
1. **Request payment** - For all training hours
2. **Keep training records** - Attendance logs
3. **Contact Fair Work** - File complaint
4. **Refuse future unpaid training** - It's your right

### 10. Evidence Checklist
| Evidence | Status | Priority |
|----------|--------|----------|
| Training schedule | MISSING | HIGH |
| Messages about mandatory training | MISSING | HIGH |
| Attendance records | MISSING | MEDIUM |
| Contract training clause | MISSING | MEDIUM |

---

*End of Restaurant Cases (001-020)*
