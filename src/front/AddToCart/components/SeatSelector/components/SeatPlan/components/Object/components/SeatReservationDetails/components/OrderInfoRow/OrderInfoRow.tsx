import React from 'react';
import './OrderInfoRow.scss';

type OrderInfoRowProps = {
    label: string;
    value: string | React.ReactNode;
    variant?: 'default' | 'highlight' | 'status' | 'link';
    href?: string;
};

const OrderInfoRow: React.FC<OrderInfoRowProps> = ({
    label,
    value,
    variant = 'default',
    href,
}) => {
    const rowClassName = `stachesepl-order-row ${
        variant !== 'default' ? `stachesepl-order-row-${variant}` : ''
    }`;

    const renderValue = () => {
        if (variant === 'link' && href) {
            return (
                <a
                    href={href}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='stachesepl-order-value'
                >
                    {value}
                </a>
            );
        }

        return <span className='stachesepl-order-value'>{value}</span>;
    };

    return (
        <div className={rowClassName}>
            <span className='stachesepl-order-label'>{label}</span>
            {renderValue()}
        </div>
    );
};

export default OrderInfoRow;

