export interface DialogProps {
    open: boolean;
    maxWidth?: number,
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    overrideActions?: {
        onClick: () => void;
        text: string;
    }[];
}