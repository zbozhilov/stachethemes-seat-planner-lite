export type PatternType = 'linear' | 'linear-repeat' | 'cyclic';
export type ValueType = 'number' | 'letter';

export interface PatternSegment {
    id: string;
    type: PatternType;
    valueType: ValueType;
    startValue: string;
    count: number;
    separator: string;
}

export interface ModeOption {
    value: PatternType;
    label: string;
    description: string;
}

