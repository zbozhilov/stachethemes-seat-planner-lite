import { ChevronRight } from '@mui/icons-material';
import { useNavigate } from 'react-router';
import './ManagerLayout.scss';

export type BreadcrumbItem = {
    label: string;
    path?: string;
    icon?: React.ReactNode;
};

type ManagerLayoutProps = {
    children: React.ReactNode;
    breadcrumbs: BreadcrumbItem[];
    title: string;
    subtitle?: string;
    actions?: React.ReactNode;
};

const ManagerLayout = ({ children, breadcrumbs, title, subtitle, actions }: ManagerLayoutProps) => {
    const navigate = useNavigate();

    const handleNavigate = (path?: string) => {
        if (path) {
            navigate(path);
        }
    };

    const showBreadcrumbs = breadcrumbs.length > 1;


    return (
        <div className="stachesepl-manager">
            {/* Breadcrumb Navigation */}
            {showBreadcrumbs && <nav className="stachesepl-manager-breadcrumbs" aria-label="Breadcrumb">
                <ol className="stachesepl-manager-breadcrumbs-list">
                    {breadcrumbs.map((crumb, index) => {
                        const isLast = index === breadcrumbs.length - 1;
                        return (
                            <li key={index} className="stachesepl-manager-breadcrumbs-item">
                                {crumb.path && !isLast ? (
                                    <button
                                        onClick={() => handleNavigate(crumb.path)}
                                        className="stachesepl-manager-breadcrumbs-link"
                                    >
                                        {crumb.icon && (
                                            <span className="stachesepl-manager-breadcrumbs-icon">
                                                {crumb.icon}
                                            </span>
                                        )}
                                        <span>{crumb.label}</span>
                                    </button>
                                ) : (
                                    <span className="stachesepl-manager-breadcrumbs-current">
                                        {crumb.icon && (
                                            <span className="stachesepl-manager-breadcrumbs-icon">
                                                {crumb.icon}
                                            </span>
                                        )}
                                        <span>{crumb.label}</span>
                                    </span>
                                )}
                                {!isLast && (
                                    <ChevronRight className="stachesepl-manager-breadcrumbs-separator" />
                                )}
                            </li>
                        );
                    })}
                </ol>
            </nav>}

            {/* Page Header */}
            <header className="stachesepl-manager-header">
                <div className="stachesepl-manager-header-content">
                    <h1 className="stachesepl-manager-header-title">{title}</h1>
                    {subtitle && (
                        <p className="stachesepl-manager-header-subtitle">{subtitle}</p>
                    )}
                </div>
                {actions && (
                    <div className="stachesepl-manager-header-actions">
                        {actions}
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="stachesepl-manager-content">
                {children}
            </main>
        </div>
    );
};

export default ManagerLayout;
