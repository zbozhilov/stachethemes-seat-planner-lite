import { AuditoriumProduct } from '../../../../types';
import ProductCard from './ProductCard';
import './ProductsGrid.scss';

type ProductsGridProps = {
    products: AuditoriumProduct[];
    onNavigate: (product: AuditoriumProduct) => void;
};

const ProductsGrid = ({ products, onNavigate }: ProductsGridProps) => {
    return (
        <div className="stachesepl-manager-listing-grid">
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    onNavigate={onNavigate}
                />
            ))}
        </div>
    );
};

export default ProductsGrid;

