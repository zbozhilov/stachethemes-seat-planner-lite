import Button from '@src/admin/Dashboard/layout/Button/Button';
import './Pagination.scss';
import { __ } from '@src/utils';

type PaginationProps = {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
};

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
    if (totalPages <= 1) {
        return null;
    }

    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const handlePageClick = (page: number) => {
        if (page !== currentPage && page >= 1 && page <= totalPages) {
            onPageChange(page);
        }
    };

    // Generate page numbers to display
    const getPageNumbers = (isMobile: boolean = false) => {
        const pages: (number | string)[] = [];
        const maxVisible = isMobile ? 3 : 5;

        if (totalPages <= maxVisible) {
            // Show all pages if total is small
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (isMobile) {
                // Mobile: Show only current page and adjacent pages
                pages.push(1);

                if (currentPage > 2) {
                    pages.push('ellipsis-start');
                }

                // Show current page and maybe one neighbor
                if (currentPage > 1 && currentPage < totalPages) {
                    pages.push(currentPage);
                }

                if (currentPage < totalPages - 1) {
                    pages.push('ellipsis-end');
                }

                pages.push(totalPages);
            } else {
                // Desktop: Show more pages
                pages.push(1);

                let start = Math.max(2, currentPage - 1);
                let end = Math.min(totalPages - 1, currentPage + 1);

                // Adjust if we're near the start
                if (currentPage <= 3) {
                    end = Math.min(4, totalPages - 1);
                }

                // Adjust if we're near the end
                if (currentPage >= totalPages - 2) {
                    start = Math.max(totalPages - 3, 2);
                }

                // Add ellipsis before middle section if needed
                if (start > 2) {
                    pages.push('ellipsis-start');
                }

                // Add middle pages
                for (let i = start; i <= end; i++) {
                    pages.push(i);
                }

                // Add ellipsis after middle section if needed
                if (end < totalPages - 1) {
                    pages.push('ellipsis-end');
                }

                // Always show last page
                if (totalPages > 1) {
                    pages.push(totalPages);
                }
            }
        }

        return pages;
    };

    const pageNumbersDesktop = getPageNumbers(false);
    const pageNumbersMobile = getPageNumbers(true);

    return (
        <div className="stachesepl-listing-pagination">
            <div className="stachesepl-listing-pagination-prev">
                <Button
                    variant="secondary"
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                >
                    <span className="stachesepl-listing-pagination-btn-full">{__('PREVIOUS_PAGE')} ←</span>
                    <span className="stachesepl-listing-pagination-btn-short">←</span>
                </Button>
            </div>

            {/* Desktop pagination */}
            <div className="stachesepl-listing-pagination-pages stachesepl-listing-pagination-pages--desktop">
                {pageNumbersDesktop.map((page, index) => {
                    if (typeof page === 'string') {
                        return (
                            <span
                                key={`${page}-${index}`}
                                className="stachesepl-listing-pagination-ellipsis"
                            >
                                ...
                            </span>
                        );
                    }

                    return (
                        <button
                            key={page}
                            type="button"
                            className={`stachesepl-listing-pagination-page ${
                                page === currentPage
                                    ? 'stachesepl-listing-pagination-page--active'
                                    : ''
                            }`}
                            onClick={() => handlePageClick(page)}
                        >
                            {page}
                        </button>
                    );
                })}
            </div>

            {/* Mobile pagination */}
            <div className="stachesepl-listing-pagination-pages stachesepl-listing-pagination-pages--mobile">
                {pageNumbersMobile.map((page, index) => {
                    if (typeof page === 'string') {
                        return (
                            <span
                                key={`${page}-${index}`}
                                className="stachesepl-listing-pagination-ellipsis"
                            >
                                ...
                            </span>
                        );
                    }

                    return (
                        <button
                            key={page}
                            type="button"
                            className={`stachesepl-listing-pagination-page ${
                                page === currentPage
                                    ? 'stachesepl-listing-pagination-page--active'
                                    : ''
                            }`}
                            onClick={() => handlePageClick(page)}
                        >
                            {page}
                        </button>
                    );
                })}
            </div>

            <div className="stachesepl-listing-pagination-next">
                <Button
                    variant="secondary"
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                >
                    <span className="stachesepl-listing-pagination-btn-full">{__('NEXT_PAGE')} →</span>
                    <span className="stachesepl-listing-pagination-btn-short">→</span>
                </Button>
            </div>
        </div>
    );
};

export default Pagination;
