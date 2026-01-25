import { ChevronLeft, ChevronRight, FirstPage, LastPage } from '@mui/icons-material';
import { __ } from '@src/utils';
import './Pagination.scss';

type PaginationProps = {
    currentPage: number;
    totalPages: number;
    startIndex: number;
    endIndex: number;
    totalItems: number;
    onPageChange: (page: number) => void;
};

const Pagination = ({
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    totalItems,
    onPageChange,
}: PaginationProps) => {
    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className="stachesepl-manager-availability-pagination">
            <span className="stachesepl-manager-availability-pagination-info">
                {startIndex + 1}-{Math.min(endIndex, totalItems)} / {totalItems}
            </span>
            <div className="stachesepl-manager-availability-pagination-controls">
                <button
                    className="stachesepl-manager-availability-pagination-btn"
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1}
                    title={__('FIRST_PAGE')}
                >
                    <FirstPage />
                </button>
                <button
                    className="stachesepl-manager-availability-pagination-btn"
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    title={__('PREVIOUS_PAGE')}
                >
                    <ChevronLeft />
                </button>
                <span className="stachesepl-manager-availability-pagination-pages">
                    {currentPage} / {totalPages}
                </span>
                <button
                    className="stachesepl-manager-availability-pagination-btn"
                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    title={__('NEXT_PAGE')}
                >
                    <ChevronRight />
                </button>
                <button
                    className="stachesepl-manager-availability-pagination-btn"
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    title={__('LAST_PAGE')}
                >
                    <LastPage />
                </button>
            </div>
        </div>
    );
};

export default Pagination;

