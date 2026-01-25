import { Inventory2 } from '@mui/icons-material';
import { __ } from '@src/utils';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import Loading from '../../../components/Loading/Loading';
import { useAuditoriumProducts } from '../../../hooks';
import ListingPagination from './components/ListingPagination';
import ListingSummary from './components/ListingSummary';
import ProductsGrid from './components/ProductsGrid';
import './Contents.scss';

type ContentsProps = {
    search: string;
    page: number;
    perPage: number;
    onPageChange: (page: number) => void;
};

const Contents = ({ search, page, perPage, onPageChange }: ContentsProps) => {
    const { data, loading, error, search: activeSearch } = useAuditoriumProducts(search, page, perPage);
    const navigate = useNavigate();

    useEffect(() => {
        if (data && data.total_pages > 0 && page > data.total_pages) {
            onPageChange(1);
        }
    }, [data, page, onPageChange]);

    const handleNavigateToAvailability = (product: { id: number; has_dates: boolean }) => {
        const { id, has_dates } = product;

        if (has_dates) {
            navigate(`/manager/product/${id}/dates`);
            return;
        }

        navigate(`/manager/product/${id}/availability`);
    };

    if (loading) {
        return (
            <div className="stachesepl-manager-listing">
                <Loading />
            </div>
        );
    }

    if (error) {
        return (
            <div className="stachesepl-manager-listing">
                <div className="stachesepl-manager-listing-error">
                    <span className="stachesepl-manager-listing-error-icon">⚠</span>
                    <span>{error}</span>
                </div>
            </div>
        );
    }

    if (!data || data.products.length === 0) {
        return (
            <div className="stachesepl-manager-listing">
                <div className="stachesepl-manager-listing-empty">
                    <Inventory2 className="stachesepl-manager-listing-empty-icon" />
                    <p className="stachesepl-manager-listing-empty-title">
                        {activeSearch ? __('NO_PRODUCTS_MATCH_SEARCH') : __('NO_PRODUCTS_FOUND')}
                    </p>
                    <p className="stachesepl-manager-listing-empty-description">
                        {activeSearch
                            ? __('TRY_DIFFERENT_SEARCH_TERM')
                            : __('CREATE_AUDITORIUM_PRODUCT_TO_GET_STARTED')}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="stachesepl-manager-listing">
            <ListingSummary total={data.total} page={data.page} totalPages={data.total_pages} />

            <ProductsGrid products={data.products} onNavigate={handleNavigateToAvailability} />

            {data.total_pages > 1 && (
                <ListingPagination
                    currentPage={data.page}
                    totalPages={data.total_pages}
                    onPageChange={onPageChange}
                />
            )}
        </div>
    );
};

export default Contents;
