import { ReactNode } from 'react';
import './EmptyState.scss';

type EmptyStateProps = {
    icon: ReactNode;
    title: string;
    description: string;
};

const EmptyState = ({ icon, title, description }: EmptyStateProps) => {
    return (
        <div className="stachesepl-manager-dates-empty">
            <div className="stachesepl-manager-dates-empty-icon">{icon}</div>
            <p className="stachesepl-manager-dates-empty-title">{title}</p>
            <p className="stachesepl-manager-dates-empty-description">{description}</p>
        </div>
    );
};

export default EmptyState;
