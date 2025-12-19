import { useState, useRef, useEffect, useCallback } from 'react'
import Container from '../../../../layout/Container/Container'
import Button from '../../../../layout/Button/Button'
import Select from '../../../../layout/Select/Select'
import { __ } from '@src/utils'
import './BookingIntegrityChecker.scss'

type CheckType = 'double_booking' | 'ghost_booking'

type DuplicateResult = {
    seat_id: string
    selected_date: string
    count: number
    order_ids: number[]
}

type GhostResult = {
    seat_id: string
    selected_date: string
    order_ids: number[]
    order_count: number
    fixed?: boolean
    fixing?: boolean
}

type ProductResult = {
    product_id: number
    product_name: string
    duplicates?: DuplicateResult[]
    ghost_seats?: GhostResult[]
    has_duplicates?: boolean
    has_ghost_seats?: boolean
}

const BookingIntegrityChecker = () => {
    const [checkType, setCheckType] = useState<CheckType>('double_booking')
    const [isChecking, setIsChecking] = useState(false)
    const [progress, setProgress] = useState({ current: 0, total: 0 })
    const [results, setResults] = useState<ProductResult[]>([])
    const [hasChecked, setHasChecked] = useState(false)
    const abortControllerRef = useRef<AbortController | null>(null)

    const fetchProductIds = async (signal: AbortSignal): Promise<number[]> => {
        const response = await fetch(window.stachesepl_ajax.ajax_url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                action: 'seatplanner',
                task: 'get_product_ids',
                nonce: window.stachesepl_ajax.nonce,
            }),
            signal
        })

        const data = await response.json()
        if (!data.success) throw new Error(data.data?.error || 'Failed to fetch product IDs')
        return data.data.product_ids || []
    }

    const checkProductDoubleBooking = async (productId: number, signal: AbortSignal): Promise<ProductResult> => {
        const response = await fetch(window.stachesepl_ajax.ajax_url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                action: 'seatplanner',
                task: 'check_product_booking',
                product_id: productId.toString(),
                nonce: window.stachesepl_ajax.nonce,
            }),
            signal
        })

        const data = await response.json()
        if (!data.success) throw new Error(data.data?.error || 'Failed to check product')
        return data.data
    }

    const checkProductGhostBooking = async (productId: number, signal: AbortSignal): Promise<ProductResult> => {
        const response = await fetch(window.stachesepl_ajax.ajax_url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                action: 'seatplanner',
                task: 'check_product_ghost_booking',
                product_id: productId.toString(),
                nonce: window.stachesepl_ajax.nonce,
            }),
            signal
        })

        const data = await response.json()
        if (!data.success) throw new Error(data.data?.error || 'Failed to check product')
        return data.data
    }

    const fixGhostBooking = async (productId: number, seatId: string, selectedDate: string): Promise<boolean> => {
        const response = await fetch(window.stachesepl_ajax.ajax_url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                action: 'seatplanner',
                task: 'fix_ghost_booking',
                product_id: productId.toString(),
                seat_id: seatId,
                selected_date: selectedDate,
                nonce: window.stachesepl_ajax.nonce,
            }),
        })

        const data = await response.json()
        return data.success
    }

    const handleCheck = useCallback(async () => {
        setIsChecking(true)
        setResults([])
        setHasChecked(false)
        setProgress({ current: 0, total: 0 })

        abortControllerRef.current = new AbortController()
        const signal = abortControllerRef.current.signal

        try {
            const productIds = await fetchProductIds(signal)

            if (productIds.length === 0) {
                setHasChecked(true)
                setIsChecking(false)
                return
            }

            setProgress({ current: 0, total: productIds.length })

            const allResults: ProductResult[] = []

            for (let i = 0; i < productIds.length; i++) {
                if (signal.aborted) break

                const productId = productIds[i]
                const result = checkType === 'double_booking'
                    ? await checkProductDoubleBooking(productId, signal)
                    : await checkProductGhostBooking(productId, signal)

                allResults.push(result)
                setResults([...allResults])
                setProgress({ current: i + 1, total: productIds.length })
            }

            setHasChecked(true)
        } catch (error) {
            if (!(error instanceof DOMException && error.name === 'AbortError')) {
                console.error('Check failed:', error)
            }
        } finally {
            setIsChecking(false)
        }
    }, [checkType])

    const handleCancel = () => {
        abortControllerRef.current?.abort()
        setIsChecking(false)
    }

    const handleFixGhost = async (productId: number, seatId: string, selectedDate: string) => {
        setResults(prev => prev.map(product => {
            if (product.product_id !== productId) return product
            return {
                ...product,
                ghost_seats: product.ghost_seats?.map(seat =>
                    seat.seat_id === seatId && seat.selected_date === selectedDate
                        ? { ...seat, fixing: true }
                        : seat
                )
            }
        }))

        const success = await fixGhostBooking(productId, seatId, selectedDate)

        setResults(prev => prev.map(product => {
            if (product.product_id !== productId) return product
            return {
                ...product,
                ghost_seats: product.ghost_seats?.map(seat =>
                    seat.seat_id === seatId && seat.selected_date === selectedDate
                        ? { ...seat, fixing: false, fixed: success }
                        : seat
                )
            }
        }))
    }

    useEffect(() => {
        return () => {
            abortControllerRef.current?.abort()
        }
    }, [])

    // Clear results when check type changes
    useEffect(() => {
        setResults([])
        setHasChecked(false)
    }, [checkType])

    const getIssueCount = (product: ProductResult): number => {
        if (checkType === 'double_booking') {
            return product.duplicates?.length || 0
        }
        return product.ghost_seats?.length || 0
    }

    const getTotalIssues = (): number => {
        return results.reduce((total, product) => total + getIssueCount(product), 0)
    }

    const getProductsWithIssues = (): number => {
        return results.filter(product => getIssueCount(product) > 0).length
    }

    const getStatusBadge = (product: ProductResult) => {
        const count = getIssueCount(product)
        if (count === 0) {
            return <span className="stachesepl-bic-badge stachesepl-bic-badge--success">{__('NO_ISSUES')}</span>
        }
        if (count === 1) {
            return (
                <span className="stachesepl-bic-badge stachesepl-bic-badge--warning">
                    {checkType === 'double_booking' ? __('ONE_DUPLICATE') : __('ONE_GHOST_SEAT')}
                </span>
            )
        }
        const text = checkType === 'double_booking'
            ? __('MULTIPLE_DUPLICATES').replace('%d', count.toString())
            : __('MULTIPLE_GHOST_SEATS').replace('%d', count.toString())
        return <span className="stachesepl-bic-badge stachesepl-bic-badge--warning">{text}</span>
    }

    const renderSummary = () => {
        if (!hasChecked) return null

        const productsWithIssues = getProductsWithIssues()
        let message: string

        if (checkType === 'double_booking') {
            if (productsWithIssues === 0) {
                message = __('DOUBLE_CHECK_COMPLETE_NONE')
            } else if (productsWithIssues === 1) {
                message = __('DOUBLE_CHECK_COMPLETE_SINGULAR')
            } else {
                message = __('DOUBLE_CHECK_COMPLETE').replace('%d', productsWithIssues.toString())
            }
        } else {
            if (productsWithIssues === 0) {
                message = __('GHOST_CHECK_COMPLETE_NONE')
            } else if (productsWithIssues === 1) {
                message = __('GHOST_CHECK_COMPLETE_SINGULAR')
            } else {
                message = __('GHOST_CHECK_COMPLETE').replace('%d', productsWithIssues.toString())
            }
        }

        return (
            <div className={`stachesepl-bic-summary ${productsWithIssues > 0 ? 'stachesepl-bic-summary--warning' : 'stachesepl-bic-summary--success'}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {productsWithIssues > 0 ? (
                        <>
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                            <line x1="12" y1="9" x2="12" y2="13" />
                            <line x1="12" y1="17" x2="12.01" y2="17" />
                        </>
                    ) : (
                        <>
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                        </>
                    )}
                </svg>
                <span>{message}</span>
            </div>
        )
    }

    const renderDoubleBookingDetails = (product: ProductResult) => {
        if (!product.duplicates || product.duplicates.length === 0) {
            return <p className="stachesepl-bic-no-issues">{__('NO_DUPLICATE_BOOKINGS')}</p>
        }

        return (
            <table className="stachesepl-bic-table">
                <thead>
                    <tr>
                        <th>{__('SEAT_ID')}</th>
                        <th>{__('EVENT_DATE')}</th>
                        <th>{__('BOOKING_COUNT')}</th>
                        <th>{__('ORDER_IDS')}</th>
                    </tr>
                </thead>
                <tbody>
                    {product.duplicates.map((dup, idx) => (
                        <tr key={idx}>
                            <td>{dup.seat_id}</td>
                            <td>{dup.selected_date || __('NO_DATE')}</td>
                            <td>{dup.count}</td>
                            <td>
                                {dup.order_ids.map((orderId, i) => (
                                    <span key={orderId}>
                                        <a
                                            href={`${window.stachesepl_admin_url.admin_url}post.php?post=${orderId}&action=edit`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            #{orderId}
                                        </a>
                                        {i < dup.order_ids.length - 1 && ', '}
                                    </span>
                                ))}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )
    }

    const renderGhostBookingDetails = (product: ProductResult) => {
        if (!product.ghost_seats || product.ghost_seats.length === 0) {
            return <p className="stachesepl-bic-no-issues">{__('NO_GHOST_BOOKINGS')}</p>
        }

        return (
            <table className="stachesepl-bic-table">
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
                    {product.ghost_seats.map((ghost, idx) => (
                        <tr key={idx}>
                            <td>{ghost.seat_id}</td>
                            <td>{ghost.selected_date || __('NO_DATE')}</td>
                            <td>{ghost.order_count}</td>
                            <td>
                                {ghost.order_ids.map((orderId, i) => (
                                    <span key={orderId}>
                                        <a
                                            href={`${window.stachesepl_admin_url.admin_url}post.php?post=${orderId}&action=edit`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            #{orderId}
                                        </a>
                                        {i < ghost.order_ids.length - 1 && ', '}
                                    </span>
                                ))}
                            </td>
                            <td>
                                {ghost.fixed ? (
                                    <span className="stachesepl-bic-fixed">{__('FIXED')}</span>
                                ) : (
                                    <button
                                        className="stachesepl-bic-fix-button"
                                        onClick={() => handleFixGhost(product.product_id, ghost.seat_id, ghost.selected_date)}
                                        disabled={ghost.fixing}
                                    >
                                        {ghost.fixing ? __('FIXING') : __('FIX_GHOST_BOOKING')}
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )
    }

    return (
        <Container>
            <div className="stachesepl-bic">
                <div className="stachesepl-bic-controls">
                    <div className="stachesepl-bic-select-wrapper">
                        <Select
                            label={__('SELECT_CHECK_TYPE')}
                            value={checkType}
                            onChange={(e) => setCheckType(e.target.value as CheckType)}
                            disabled={isChecking}
                            options={[
                                { value: 'double_booking', label: __('CHECK_TYPE_DOUBLE_BOOKING') },
                                { value: 'ghost_booking', label: __('CHECK_TYPE_GHOST_BOOKING') }
                            ]}
                        />
                        <p className="stachesepl-bic-description">
                            {checkType === 'double_booking'
                                ? __('CHECK_TYPE_DOUBLE_DESC')
                                : __('CHECK_TYPE_GHOST_DESC')
                            }
                        </p>
                    </div>

                    <div className="stachesepl-bic-actions">
                        {isChecking ? (
                            <Button variant="secondary" onClick={handleCancel}>
                                {__('CANCEL')}
                            </Button>
                        ) : (
                            <Button onClick={handleCheck}>
                                {__('CHECK_NOW')}
                            </Button>
                        )}
                    </div>
                </div>

                {isChecking && progress.total > 0 && (
                    <div className="stachesepl-bic-progress">
                        <div className="stachesepl-bic-progress-bar">
                            <div
                                className="stachesepl-bic-progress-fill"
                                style={{ width: `${(progress.current / progress.total) * 100}%` }}
                            />
                        </div>
                        <span className="stachesepl-bic-progress-text">
                            {checkType === 'double_booking'
                                ? __('CHECKING_DOUBLE_BOOKING').replace('%1$d', progress.current.toString()).replace('%2$d', progress.total.toString())
                                : __('CHECKING_GHOST_BOOKING').replace('%1$d', progress.current.toString()).replace('%2$d', progress.total.toString())
                            }
                        </span>
                    </div>
                )}

                {renderSummary()}

                {results.length > 0 && (
                    <div className="stachesepl-bic-results">
                        <h3 className="stachesepl-bic-results-title">
                            {hasChecked
                                ? __('RESULTS')
                                : __('RESULTS_COUNT').replace('%1$d', progress.current.toString()).replace('%2$d', progress.total.toString())
                            }
                        </h3>

                        {results.map((product) => (
                            <details key={product.product_id} className="stachesepl-bic-product" open={getIssueCount(product) > 0}>
                                <summary className="stachesepl-bic-product-header">
                                    <div className="stachesepl-bic-product-header-content">
                                        {getStatusBadge(product)}
                                        <span className="stachesepl-bic-product-name">
                                            <p>{product.product_name}</p>
                                            <span className="stachesepl-bic-product-id">
                                                <a href={`${window.stachesepl_admin_url.admin_url}post.php?post=${product.product_id}&action=edit`} target="_blank" rel="noopener noreferrer">
                                                    #{product.product_id}
                                                </a>
                                            </span>
                                        </span>
                                    </div>
                                </summary>
                                <div className="stachesepl-bic-product-content">
                                    {checkType === 'double_booking'
                                        ? renderDoubleBookingDetails(product)
                                        : renderGhostBookingDetails(product)
                                    }
                                </div>
                            </details>
                        ))}
                    </div>
                )}

                {hasChecked && results.length === 0 && (
                    <div className="stachesepl-bic-empty">
                        <p>{__('NO_PRODUCTS_FOUND')}</p>
                    </div>
                )}
            </div>
        </Container>
    )
}

export default BookingIntegrityChecker
