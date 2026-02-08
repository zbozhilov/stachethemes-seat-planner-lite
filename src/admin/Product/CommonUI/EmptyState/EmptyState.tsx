import { ReactNode } from 'react';
import './EmptyState.scss';

interface EmptyStateProps {
    children: ReactNode;
}

const EmptyState = ({ children }: EmptyStateProps) => (
    <div className="stachesepl-empty-state">
        {children}
    </div>
);

export default EmptyState;
