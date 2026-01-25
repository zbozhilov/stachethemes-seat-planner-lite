import { __ } from '@src/utils';
import './ListingSummary.scss';

type ListingSummaryProps = {
    total: number;
    page: number;
    totalPages: number;
};

const ListingSummary = ({ total, page, totalPages }: ListingSummaryProps) => {
    return (
        <div className="stachesepl-manager-listing-summary">
            <span className="stachesepl-manager-listing-summary-count">
                {total === 1
                    ? __('PRODUCT_COUNT_SINGULAR')?.replace('%d', total.toString())
                    : __('PRODUCT_COUNT_PLURAL')?.replace('%d', total.toString())}
            </span>
            {totalPages > 1 && (
                <span className="stachesepl-manager-listing-summary-page">
                    {__('PAGE')} {page} / {totalPages}
                </span>
            )}
        </div>
    );
};

export default ListingSummary;

