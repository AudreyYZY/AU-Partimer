// Types for json-rules-engine integration

export interface RuleDefinition {
  id: string;
  name: string;
  description: string;
  category: string;
  conditions: RuleConditions;
  event: RuleEvent;
  legalRef: string;
  sourceUrl?: string;
  effectiveFrom: Date;
  effectiveTo?: Date;
}

export interface RuleConditions {
  all?: RuleCondition[];
  any?: RuleCondition[];
}

export interface RuleCondition {
  fact: string;
  operator: RuleOperator;
  value: unknown;
  path?: string;
}

export type RuleOperator =
  | "equal"
  | "notEqual"
  | "greaterThan"
  | "greaterThanInclusive"
  | "lessThan"
  | "lessThanInclusive"
  | "in"
  | "notIn"
  | "contains"
  | "doesNotContain";

export interface RuleEvent {
  type: string; // finding type, e.g. "UNDERPAYMENT"
  params: {
    severity: string;
    title: string;
    explanationTemplate: string;
    legalRef: string;
    recommendedAction: string;
    evidenceToCollect: string[];
  };
}

export interface RuleEngineResult {
  events: RuleEvent[];
  facts: Record<string, unknown>;
}
