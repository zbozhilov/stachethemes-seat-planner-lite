import { useEffect, useState } from "react";
import { useCheckDoubleBooking } from "./hooks";
import { __, sprintf } from "@src/utils";
import "./Form.scss";

const ExpandSvgIcon = () => {

    return (
        <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M13.9394 12.0001L8.46973 6.53039L9.53039 5.46973L16.0607 12.0001L9.53039 18.5304L8.46973 17.4697L13.9394 12.0001Z" fill="#202020" />
        </svg>
    )

}

const RetractSvgIcon = () => {

    return (
        <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M11.9999 13.9394L17.4696 8.46973L18.5303 9.53039L11.9999 16.0607L5.46961 9.53039L6.53027 8.46973L11.9999 13.9394Z" fill="#202020" />
        </svg>
    )
}

const Form = () => {
    const [isChecking, setIsChecking] = useState(false);
    const [expandedProducts, setExpandedProducts] = useState<number[]>([]);

    const {
        data,
        isLoading,
        ready,
        error,
        currentProductIndex,
        totalProducts,
        resetCheck,
        cancelCheck
    } = useCheckDoubleBooking(isChecking);

    // Reset isChecking when checking is complete
    useEffect(() => {
        if (ready && isChecking) {
            setIsChecking(false);
        }
    }, [ready, isChecking]);

    // Handle cancel button click
    const handleCancelCheck = () => {
        cancelCheck();
        setIsChecking(false);
    };
    
    const handleCheckDoubleBooking = () => {
        // Reset data first
        resetCheck();
        // Then enable checking (which will create a new controller)
        setIsChecking(true);
        setExpandedProducts([]);
    };

    const toggleProductExpand = (productId: number) => {
        setExpandedProducts(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    }

    return (
        <div className='stachesepl-check-double-booking-form'>
            <button
                className='button button-primary'
                onClick={handleCheckDoubleBooking}
                disabled={isLoading}>
                {isLoading ? __('CHECKING') : __('CHECK_FOR_DOUBLE_BOOKING')}
            </button>

            {isLoading && totalProducts > 0 && (
                <div className="stachesepl-loading">
                    <p>{sprintf(__('CHECKING_PRODUCTS'), currentProductIndex + 1, totalProducts)}</p>
                    <div className="stachesepl-progress-bar">
                        <div
                            className="stachesepl-progress"
                            style={{ width: `${Math.round(((currentProductIndex + 1) / totalProducts) * 100)}%` }}
                        ></div>
                    </div>
                    <button
                        className="button stachesepl-cancel-button"
                        onClick={handleCancelCheck}>
                        {__('CANCEL')}
                    </button>
                </div>
            )}

            {isLoading && totalProducts === 0 && (
                <div className="stachesepl-loading">
                    <p>{__('PREPARING_TO_CHECK')}</p>
                    <button
                        className="button stachesepl-cancel-button"
                        onClick={handleCancelCheck}>
                        {__('CANCEL')}
                    </button>
                </div>
            )}

            {error && (
                <div className="stachesepl-error">
                    <p>{__('ERROR_OCCURRED')}</p>
                    <button
                        className="button"
                        onClick={handleCheckDoubleBooking}>
                        {__('TRY_AGAIN')}
                    </button>
                </div>
            )}

            {data && data.length > 0 && (
                <div className="stachesepl-results">
                    <h3>{isLoading ? sprintf(__('RESULTS_COUNT'), data.length, totalProducts) : __('RESULTS')}</h3>

                    {data.map((item, index) => {
                        const productName = item.product_name || `Product #${item.product_id}`;
                        const isExpanded = expandedProducts.includes(item.product_id);

                        return (
                            <div key={item.product_id} className="stachesepl-result-item">
                                <div
                                    className="stachesepl-result-header"
                                    onClick={() => toggleProductExpand(item.product_id)}
                                >
                                    <h4>
                                        {productName}
                                        {item.has_duplicates ?
                                            <span className="stachesepl-duplicate-badge">
                                                {item.duplicates.length === 1 
                                                    ? __('ONE_DUPLICATE')
                                                    : sprintf(__('MULTIPLE_DUPLICATES'), item.duplicates.length)
                                                }
                                            </span>
                                            :
                                            <span className="stachesepl-no-duplicate-badge">
                                                {__('NO_DUPLICATES')}
                                            </span>
                                        }
                                        <span className="stachesepl-expand-icon">
                                            {isExpanded ? <RetractSvgIcon /> : <ExpandSvgIcon />}
                                        </span>
                                    </h4>
                                </div>

                                {isExpanded && item.has_duplicates && (
                                    <div className="stachesepl-duplicate-details">
                                        <table className="widefat">
                                            <thead>
                                                <tr>
                                                    <th>{__('SEAT_ID')}</th>
                                                    <th>{__('BOOKING_COUNT')}</th>
                                                    <th>{__('ORDER_IDS')}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {item.duplicates.map((duplicate, dIndex) => (
                                                    <tr key={dIndex}>
                                                        <td>{duplicate.seat_id}</td>
                                                        <td>{duplicate.count}</td>
                                                        <td>
                                                            {duplicate.order_ids.map((orderId, oIndex) => (
                                                                <span key={oIndex}>
                                                                    <a
                                                                        href={`${window.stachesepl_admin_url.admin_url}post.php?post=${orderId}&action=edit`}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                    >
                                                                        #{orderId}
                                                                    </a>
                                                                    {oIndex < duplicate.order_ids.length - 1 ? ', ' : ''}
                                                                </span>
                                                            ))}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {isExpanded && !item.has_duplicates && (
                                    <div className="stachesepl-no-duplicates">
                                        <p>{__('NO_DUPLICATE_BOOKINGS')}</p>
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {ready && (
                        <div className="stachesepl-check-complete">
                            <p>
                                {data.filter(item => item.has_duplicates).length === 1
                                    ? __('CHECK_COMPLETE_SINGULAR')
                                    : sprintf(__('CHECK_COMPLETE'), data.filter(item => item.has_duplicates).length)
                                }
                            </p>
                        </div>
                    )}
                </div>
            )}

            {ready && data && data.length === 0 && (
                <div className="stachesepl-results">
                    <p>{__('NO_PRODUCTS_FOUND')}</p>
                </div>
            )}
        </div>
    )
}

export default Form