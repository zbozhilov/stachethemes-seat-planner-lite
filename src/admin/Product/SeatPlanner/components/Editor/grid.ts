export const GRID_OPACITY_VALUES = [0.1, 0.2, 0.3, 0.4, 0.5] as const;
export const GRID_COLOR_VALUES = ['0,0,0', '255,255,255'] as const;
export const GRID_GAP_VALUES = [5, 10, 25, 50, 75, 100] as const;

export const getNextInList = <T,>(values: readonly T[], current: T): T => {
    const index = values.indexOf(current);
    return values[index + 1] ?? current;
};

export const getPrevInList = <T,>(values: readonly T[], current: T): T => {
    const index = values.indexOf(current);
    return values[index - 1] ?? current;
};


