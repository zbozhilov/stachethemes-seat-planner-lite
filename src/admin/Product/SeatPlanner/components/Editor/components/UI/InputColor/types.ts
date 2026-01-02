export interface InputColorProps {
    id?: string;
    label?: string;
    value: string;
    className?: string;
    onChange: (value: string) => void;
}