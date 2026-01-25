import { CalendarMonth, ChevronRight, Edit, EventSeat, OpenInNew } from '@mui/icons-material';
import { __ } from '@src/utils';
import { AuditoriumProduct } from '../../../../types';
import './ProductCard.scss';

type ProductCardProps = {
    product: AuditoriumProduct;
    onNavigate: (product: AuditoriumProduct) => void;
};

const ProductCard = ({ product, onNavigate }: ProductCardProps) => {
    return (
        <div className="stachesepl-manager-product-card">
            <div className="stachesepl-manager-product-card-header">
                <div className="stachesepl-manager-product-card-icon">
                    {!!product.image && <img loading="lazy" src={product.image} alt={product.name} />}
                    {!product.image && <>
                        {product.has_dates ? <CalendarMonth /> : <EventSeat />}
                    </>}
                </div>
                <div className="stachesepl-manager-product-card-info">
                    <span className="stachesepl-manager-product-card-id">#{product.id}</span>
                    <h3 className="stachesepl-manager-product-card-title">{product.name}</h3>
                </div>
            </div>

            <div className="stachesepl-manager-product-card-badge">
                {product.has_dates ? (
                    <span className="stachesepl-manager-product-card-badge-item stachesepl-manager-product-card-badge-item--dated">
                        {__('DATED_EVENT')}
                    </span>
                ) : (
                    <span className="stachesepl-manager-product-card-badge-item stachesepl-manager-product-card-badge-item--standard">
                        {__('STANDARD')}
                    </span>
                )}
            </div>

            <div className="stachesepl-manager-product-card-actions">
                <button
                    className="stachesepl-manager-product-card-action stachesepl-manager-product-card-action--primary"
                    onClick={() => onNavigate(product)}
                >
                    <span>{product.has_dates ? __('VIEW_DATES') : __('CHECK_AVAILABILITY')}</span>
                    <ChevronRight />
                </button>
                <div className="stachesepl-manager-product-card-links">
                    <a
                        href={product.edit_link}
                        className="stachesepl-manager-product-card-link"
                        target="_blank"
                        rel="noopener noreferrer"
                        title={__('EDIT_PRODUCT')}
                    >
                        <Edit />
                    </a>
                    <a
                        href={product.permalink}
                        className="stachesepl-manager-product-card-link"
                        target="_blank"
                        rel="noopener noreferrer"
                        title={__('VIEW_PRODUCT')}
                    >
                        <OpenInNew />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;

