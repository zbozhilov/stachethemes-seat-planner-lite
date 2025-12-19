import { useEffect, useState } from "react";
import { useBookingIntegrityCheck, useFixGhostBooking } from "./hooks";
import { __, sprintf } from "@src/utils";
import { CheckType, DoubleBookingResult, GhostBookingResult, GhostSeat, FixStatus } from "./types";
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

type FixButtonProps = {
    productId: number;
    ghostSeat: GhostSeat;
}

const FixButton = ({ productId, ghostSeat }: FixButtonProps) => {
    const [status, setStatus] = useState<FixStatus>('idle');
    const { fixGhostBooking } = useFixGhostBooking();

    const handleFix = async () => {
        if (status === 'fixing' || status === 'fixed') return;

        setStatus('fixing');

        const success = await fixGhostBooking(
            productId,
            ghostSeat.seat_id,
            ghostSeat.selected_date
        );

        setStatus(success ? 'fixed' : 'error');
    };

    const getButtonText = () => {
        switch (status) {
            case 'fixing':
                return __('FIXING');
            case 'fixed':
                return __('FIXED');
            case 'error':
                return __('FIX_FAILED');
            default:
                return __('FIX_GHOST_BOOKING');
        }
    };

    return (
        <button
            className={`button stachesepl-fix-button ${status}`}
            onClick={handleFix}
            disabled={status === 'fixing' || status === 'fixed'}
        >
            {getButtonText()}
        </button>
    );
};

// Type guards
const isDoubleBookingResult = (item: DoubleBookingResult | GhostBookingResult): item is DoubleBookingResult => {
    return 'has_duplicates' in item;
}

const isGhostBookingResult = (item: DoubleBookingResult | GhostBookingResult): item is GhostBookingResult => {
    return 'has_ghost_seats' in item;
}

const Form = () => {
    const [checkType, setCheckType] = useState<CheckType>('double_booking');
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
    } = useBookingIntegrityCheck(isChecking, checkType);

    useEffect(() => {
        if (ready && isChecking) {
            setIsChecking(false);
        }
    }, [ready, isChecking]);

    const handleCancelCheck = () => {
        cancelCheck();
        setIsChecking(false);
    };

    const handleStartCheck = () => {
        resetCheck();
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

    const handleCheckTypeChange = (type: CheckType) => {
        if (isLoading) return;
        setCheckType(type);
        resetCheck();
    }

    const getCheckingMessage = () => {
        if (checkType === 'double_booking') {
            return sprintf(__('CHECKING_DOUBLE_BOOKING'), currentProductIndex + 1, totalProducts);
        }
        return sprintf(__('CHECKING_GHOST_BOOKING'), currentProductIndex + 1, totalProducts);
    }

    const getErrorMessage = () => {
        if (checkType === 'double_booking') {
            return __('ERROR_DOUBLE_BOOKING');
        }
        return __('ERROR_GHOST_BOOKING');
    }

    const getIssueCount = () => {
        if (!data) return 0;
        
        if (checkType === 'double_booking') {
            return (data as DoubleBookingResult[]).filter(item => item.has_duplicates).length;
        }
        return (data as GhostBookingResult[]).filter(item => item.has_ghost_seats).length;
    }

    const getCompletionMessage = () => {
        const count = getIssueCount();
        
        if (checkType === 'double_booking') {
            if (count === 0) return __('DOUBLE_CHECK_COMPLETE_NONE');
            if (count === 1) return __('DOUBLE_CHECK_COMPLETE_SINGULAR');
            return sprintf(__('DOUBLE_CHECK_COMPLETE'), count);
        } else {
            if (count === 0) return __('GHOST_CHECK_COMPLETE_NONE');
            if (count === 1) return __('GHOST_CHECK_COMPLETE_SINGULAR');
            return sprintf(__('GHOST_CHECK_COMPLETE'), count);
        }
    }

    const renderDoubleBookingDetails = (item: DoubleBookingResult) => {
        const isExpanded = expandedProducts.includes(item.product_id);
        
        return (
            <div key={item.product_id} className="stachesepl-result-item">
                <div
                    className="stachesepl-result-header"
                    onClick={() => toggleProductExpand(item.product_id)}
                >
                    <h4>
                        {item.product_name}
                        {item.has_duplicates ?
                            <span className="stachesepl-issue-badge">
                                {item.duplicates.length === 1
                                    ? __('ONE_DUPLICATE')
                                    : sprintf(__('MULTIPLE_DUPLICATES'), item.duplicates.length)
                                }
                            </span>
                            :
                            <span className="stachesepl-no-issue-badge">
                                {__('NO_DUPLICATES')}
                            </span>
                        }
                        <span className="stachesepl-expand-icon">
                            {isExpanded ? <RetractSvgIcon /> : <ExpandSvgIcon />}
                        </span>
                    </h4>
                </div>

                {isExpanded && item.has_duplicates && (
                    <div className="stachesepl-details">
                        <table className="widefat">
                            <thead>
                                <tr>
                                    <th>{__('SEAT_ID')}</th>
                                    <th>{__('EVENT_DATE')}</th>
                                    <th>{__('BOOKING_COUNT')}</th>
                                    <th>{__('ORDER_IDS')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {item.duplicates.map((duplicate, dIndex) => (
                                    <tr key={dIndex}>
                                        <td>{duplicate.seat_id}</td>
                                        <td>
                                            {duplicate.selected_date ? (
                                                duplicate.selected_date
                                            ) : (
                                                <span className="stachesepl-no-date">
                                                    {__('NO_DATE')}
                                                </span>
                                            )}
                                        </td>
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
                    <div className="stachesepl-no-issues">
                        <p>{__('NO_DUPLICATE_BOOKINGS')}</p>
                    </div>
                )}
            </div>
        );
    }

    const renderGhostBookingDetails = (item: GhostBookingResult) => {
        const isExpanded = expandedProducts.includes(item.product_id);
        
        return (
            <div key={item.product_id} className="stachesepl-result-item">
                <div
                    className="stachesepl-result-header"
                    onClick={() => toggleProductExpand(item.product_id)}
                >
                    <h4>
                        {item.product_name}
                        {item.has_ghost_seats ?
                            <span className="stachesepl-issue-badge">
                                {item.ghost_seats.length === 1
                                    ? __('ONE_GHOST_SEAT')
                                    : sprintf(__('MULTIPLE_GHOST_SEATS'), item.ghost_seats.length)
                                }
                            </span>
                            :
                            <span className="stachesepl-no-issue-badge">
                                {__('NO_GHOST_SEATS')}
                            </span>
                        }
                        <span className="stachesepl-expand-icon">
                            {isExpanded ? <RetractSvgIcon /> : <ExpandSvgIcon />}
                        </span>
                    </h4>
                </div>

                {isExpanded && item.has_ghost_seats && (
                    <div className="stachesepl-details">
                        <table className="widefat">
                            <thead>
                                <tr>
                                    <th>{__('SEAT_ID')}</th>
                                    <th>{__('EVENT_DATE')}</th>
                                    <th>{__('ORDER_COUNT')}</th>
                                    <th>{__('ORDER_IDS')}</th>
                                    <th>{__('ACTIONS')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {item.ghost_seats.map((ghostSeat, gIndex) => (
                                    <tr key={gIndex}>
                                        <td>{ghostSeat.seat_id}</td>
                                        <td>
                                            {ghostSeat.selected_date ? (
                                                ghostSeat.selected_date
                                            ) : (
                                                <span className="stachesepl-no-date">
                                                    {__('NO_DATE')}
                                                </span>
                                            )}
                                        </td>
                                        <td>{ghostSeat.order_count}</td>
                                        <td>
                                            {ghostSeat.order_ids.map((orderId, oIndex) => (
                                                <span key={oIndex}>
                                                    <a
                                                        href={`${window.stachesepl_admin_url.admin_url}post.php?post=${orderId}&action=edit`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        #{orderId}
                                                    </a>
                                                    {oIndex < ghostSeat.order_ids.length - 1 ? ', ' : ''}
                                                </span>
                                            ))}
                                        </td>
                                        <td>
                                            <FixButton
                                                productId={item.product_id}
                                                ghostSeat={ghostSeat}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {isExpanded && !item.has_ghost_seats && (
                    <div className="stachesepl-no-issues">
                        <p>{__('NO_GHOST_BOOKINGS')}</p>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className='stachesepl-booking-integrity-form'>
            <div className="stachesepl-check-type-selector">
                <h3>{__('SELECT_CHECK_TYPE')}</h3>
                <div className="stachesepl-check-type-options">
                    <div 
                        className={`stachesepl-check-type-option ${checkType === 'double_booking' ? 'selected' : ''}`}
                        onClick={() => handleCheckTypeChange('double_booking')}
                    >
                        <label>
                            <input
                                type="radio"
                                name="check_type"
                                value="double_booking"
                                checked={checkType === 'double_booking'}
                                onChange={() => handleCheckTypeChange('double_booking')}
                                disabled={isLoading}
                            />
                            <div className="stachesepl-option-content">
                                <div className="stachesepl-option-title">{__('CHECK_TYPE_DOUBLE_BOOKING')}</div>
                                <div className="stachesepl-option-desc">{__('CHECK_TYPE_DOUBLE_DESC')}</div>
                            </div>
                        </label>
                    </div>
                    <div 
                        className={`stachesepl-check-type-option ${checkType === 'ghost_booking' ? 'selected' : ''}`}
                        onClick={() => handleCheckTypeChange('ghost_booking')}
                    >
                        <label>
                            <input
                                type="radio"
                                name="check_type"
                                value="ghost_booking"
                                checked={checkType === 'ghost_booking'}
                                onChange={() => handleCheckTypeChange('ghost_booking')}
                                disabled={isLoading}
                            />
                            <div className="stachesepl-option-content">
                                <div className="stachesepl-option-title">{__('CHECK_TYPE_GHOST_BOOKING')}</div>
                                <div className="stachesepl-option-desc">{__('CHECK_TYPE_GHOST_DESC')}</div>
                            </div>
                        </label>
                    </div>
                </div>

                <div className="stachesepl-check-actions">
                    <button
                        className='button button-primary'
                        onClick={handleStartCheck}
                        disabled={isLoading}>
                        {isLoading ? __('CHECKING') : __('CHECK_NOW')}
                    </button>
                </div>
            </div>

            {isLoading && totalProducts > 0 && (
                <div className="stachesepl-loading">
                    <p>{getCheckingMessage()}</p>
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
                    <p>{getErrorMessage()}</p>
                    <button
                        className="button"
                        onClick={handleStartCheck}>
                        {__('TRY_AGAIN')}
                    </button>
                </div>
            )}

            {data && data.length > 0 && (
                <div className="stachesepl-results">
                    <h3>{isLoading ? sprintf(__('RESULTS_COUNT'), data.length, totalProducts) : __('RESULTS')}</h3>

                    {data.map((item) => {
                        if (checkType === 'double_booking' && isDoubleBookingResult(item)) {
                            return renderDoubleBookingDetails(item);
                        } else if (checkType === 'ghost_booking' && isGhostBookingResult(item)) {
                            return renderGhostBookingDetails(item);
                        }
                        return null;
                    })}

                    {ready && (
                        <div className="stachesepl-check-complete">
                            <p>{getCompletionMessage()}</p>
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

