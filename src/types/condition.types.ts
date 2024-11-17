// src/types/condition.types.ts
export interface Tag {
  name: string;
  type: 'static' | 'dynamic';
}

export interface DynamicTag {
  tag: Tag;
  condition: Condition;
}

export interface BaseCondition {
  envKey: string;
  type: 'matcher' | 'range' | 'list';
}

export interface RangeCondition extends BaseCondition {
  type: 'range';
  rangeMin: number;
  rangeMax: number;
}

export interface MatcherCondition extends BaseCondition {
  type: 'matcher';
  evalFunction: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'regex';
  evalValue: string;
}

export interface ListCondition extends BaseCondition {
  type: 'list';
  valueList: string[];
}

export type Condition = RangeCondition | MatcherCondition | ListCondition;