export interface SliderProps {
    id?: string;
    value: number | string;
    min?: number;
    max?: number;
    step?: number;
    onChange?: (value: number | string) => void;
    onCommit?: (value: number | string) => void;
    className?: string;
    sliderClassName?: string;
    numberInputClassName?: string;
}

