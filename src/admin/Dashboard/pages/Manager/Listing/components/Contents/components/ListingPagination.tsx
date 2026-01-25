import Pagination from '../../Pagination/Pagination';
import './ListingPagination.scss';

type ListingPaginationProps = {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
};

const ListingPagination = ({ currentPage, totalPages, onPageChange }: ListingPaginationProps) => {
    return (
        <div className="stachesepl-manager-listing-pagination">
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
            />
        </div>
    );
};

export default ListingPagination;

