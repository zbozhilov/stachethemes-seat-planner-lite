import type { ReactNode } from 'react';
import './Badge.scss';

export type BadgeTone = 'success' | 'accent' | 'neutral';

export type BadgeProps = {
    /**
     * Badge color scheme.
     */
    tone?: BadgeTone;
    className?: string;
    /**
     * When provided, renders the badge contents as HTML.
     * Use only for trusted strings.
     */
    html?: string;
    children?: ReactNode;
    /**
     * Convenience flag for purely decorative badges.
     */
    ariaHidden?: boolean;
};

const Badge = ({
    tone = 'success',
    className,
    html,
    children,
    ariaHidden,
}: BadgeProps) => {
    const rootClassName = [
        'stachesepl-ui-badge',
        `stachesepl-ui-badge--tone-${tone}`,
        className || '',
    ]
        .filter(Boolean)
        .join(' ');

    if (html !== undefined) {
        return (
            <span
                className={rootClassName}
                aria-hidden={ariaHidden || undefined}
                dangerouslySetInnerHTML={{ __html: html }}
            />
        );
    }

    return (
        <span className={rootClassName} aria-hidden={ariaHidden || undefined}>
            {children}
        </span>
    );
};

export default Badge;


