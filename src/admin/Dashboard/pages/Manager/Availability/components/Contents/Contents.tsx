import { useNavigate, useParams, useLocation } from 'react-router';
import { useAuditoriumProduct, useAuditoriumProductAvailability, useBulkMoveBookingsToDate, useBulkUpdateSeatOverride } from '../../../hooks';
import './Contents.scss';
import { __, getFormattedDateTime } from '@src/utils';
import { CheckCircle, Close, Error as ErrorIcon, EventSeat } from '@mui/icons-material';
import { useState, useEffect, useCallback } from 'react';
import Loading from '../../../components/Loading/Loading';
import StatsCards from './components/StatsCards';
import Toolbar from './components/Toolbar';
import SeatsGrid from './components/SeatsGrid';
import Pagination from './components/Pagination';
import BulkActionBar from './components/BulkActionBar';
import type { SeatAvailabilityStatus, SeatObject } from './types';
import type { FrontWorkflowObject } from '@src/front/AddToCart/types';
import type { SeatStatus } from '../../../types';
import { toast } from 'react-hot-toast';

const SEATS_PER_PAGE = 50;

const isSeatObject = (obj: FrontWorkflowObject): obj is SeatObject => {
    return obj.type === 'seat' && 'seatId' in obj && !!obj.seatId;
};

const getSeatAvailabilityStatus = (seat: SeatObject): SeatAvailabilityStatus => {
    if (!seat.seatId) return 'unavailable';
    if (seat.taken || seat.status === 'sold-out') return 'sold-out';
    if (seat.status === 'unavailable') return 'unavailable';
    if (seat.status === 'on-site') return 'on-site';
    return 'available';
};

type FilterStatus = 'all' | SeatAvailabilityStatus;

type BulkMoveNotice = {
    movedCount: number;
    skippedCount: number;
    notificationsSent: number;
    sourceDate: string;
};

type BulkMoveErrorNotice = {
    message: string;
    errors: string[];
};

const Contents = () => {

    const { productId, dateTime } = useParams<{ productId?: string; dateTime?: string }>();
    const productIdNum = productId ? parseInt(productId, 10) : undefined;
    const { data, loading, error, reload } = useAuditoriumProductAvailability(productIdNum, dateTime);
    const { data: productData } = useAuditoriumProduct(productIdNum);
    const navigate = useNavigate();
    const location = useLocation();
    const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // Selection mode state
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedSeats, setSelectedSeats] = useState<Set<string>>(new Set());
    const { bulkUpdateOverride, loading: bulkLoading } = useBulkUpdateSeatOverride();
    const { bulkMoveToDate, loading: movingToDate } = useBulkMoveBookingsToDate();
    
    // Bulk move notice state
    const [bulkMoveNotice, setBulkMoveNotice] = useState<BulkMoveNotice | null>(null);
    const [bulkMoveErrorNotice, setBulkMoveErrorNotice] = useState<BulkMoveErrorNotice | null>(null);
    
    // Check if product has dates
    const hasDates = productData?.has_dates ?? false;

    // Read bulk move result from navigation state
    useEffect(() => {
        const state = location.state as { bulkMoveResult?: BulkMoveNotice } | null;
        if (state?.bulkMoveResult) {
            setBulkMoveNotice(state.bulkMoveResult);
            // Clear the state so it doesn't persist on refresh
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    const handleEditSeat = (seatId: string) => {
        if (isSelectionMode) return; // Don't navigate when in selection mode
        if (dateTime) {
            navigate(`/manager/product/${productId}/date/${dateTime}/availability/edit/${seatId}`);
        } else {
            navigate(`/manager/product/${productId}/availability/edit/${seatId}`);
        }
    };

    const handleToggleSelectionMode = useCallback(() => {
        setIsSelectionMode(prev => {
            if (prev) {
                // Exiting selection mode, clear selections
                setSelectedSeats(new Set());
            }
            return !prev;
        });
    }, []);

    const handleToggleSeatSelection = useCallback((seatId: string) => {
        setSelectedSeats(prev => {
            const next = new Set(prev);
            if (next.has(seatId)) {
                next.delete(seatId);
            } else {
                next.add(seatId);
            }
            return next;
        });
    }, []);

    const handleSelectAll = useCallback((seats: SeatObject[]) => {
        setSelectedSeats(new Set(seats.map(s => s.seatId)));
    }, []);

    const handleDeselectAll = useCallback(() => {
        setSelectedSeats(new Set());
    }, []);

    const handleBulkStatusChange = useCallback(async (status: SeatStatus | 'default') => {
        if (!productIdNum || selectedSeats.size === 0) return;

        // toast updating message
        const toastId = toast.loading(__('UPDATING'));

        const result = await bulkUpdateOverride(
            productIdNum,
            Array.from(selectedSeats),
            status,
            dateTime
        );

        if (result?.success) {
            toast.success(__('BULK_UPDATE_SUCCESS'), { id: toastId });
            setSelectedSeats(new Set());
            setIsSelectionMode(false);
            reload();       
        } else {
            toast.error(result?.message || __('BULK_UPDATE_FAILED'), { id: toastId });
        }
    }, [productIdNum, selectedSeats, dateTime, bulkUpdateOverride, reload]);

    const handleBulkMoveToDate = useCallback(async (targetDateTime: string, sendNotifications: boolean) => {
        if (!productIdNum || selectedSeats.size === 0 || !targetDateTime) return;

        // Clear any previous error notice
        setBulkMoveErrorNotice(null);

        const toastId = toast.loading(__('BULK_MOVING_BOOKINGS'));

        const result = await bulkMoveToDate(
            productIdNum,
            Array.from(selectedSeats),
            dateTime || '',
            targetDateTime,
            sendNotifications
        );

        if (result?.success) {
            if (result.movedCount > 0) {
                toast.success(__('BULK_MOVE_SUCCESS'), { id: toastId });
                setSelectedSeats(new Set());
                setIsSelectionMode(false);
                // Navigate to the target date's availability page with result data
                navigate(`/manager/product/${productId}/date/${targetDateTime}/availability`, {
                    state: {
                        bulkMoveResult: {
                            movedCount: result.movedCount,
                            skippedCount: result.skippedCount,
                            notificationsSent: result.notificationsSent,
                            sourceDate: dateTime || '',
                        }
                    }
                });
            } else {
                // No bookings were moved (all skipped)
                toast.error(result.message || __('BULK_MOVE_PARTIAL_SUCCESS'), { id: toastId });
            }
        } else {
            // Check if we have blocking errors to display
            if (result?.blockingErrors && result.blockingErrors.length > 0) {
                toast.error(result.error || __('BULK_MOVE_FAILED'), { id: toastId });
                setBulkMoveErrorNotice({
                    message: result.error || __('BULK_MOVE_FAILED'),
                    errors: result.blockingErrors,
                });
            } else {
                toast.error(result?.error || result?.message || __('BULK_MOVE_FAILED'), { id: toastId });
            }
        }
    }, [productIdNum, productId, selectedSeats, dateTime, bulkMoveToDate, navigate]);

    const seats = data?.objects.filter(isSeatObject) || [];

    const statusCounts = seats.reduce((acc, seat) => {
        const status = getSeatAvailabilityStatus(seat);
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {} as Record<SeatAvailabilityStatus, number>);

    // Filter seats
    const filteredSeats = seats.filter(seat => {
        const status = getSeatAvailabilityStatus(seat);
        const matchesStatus = filterStatus === 'all' || status === filterStatus;
        const matchesSearch = !searchTerm || seat.seatId.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    // Pagination
    const totalPages = Math.ceil(filteredSeats.length / SEATS_PER_PAGE);
    const startIndex = (currentPage - 1) * SEATS_PER_PAGE;
    const endIndex = startIndex + SEATS_PER_PAGE;
    const paginatedSeats = filteredSeats.slice(startIndex, endIndex);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [filterStatus, searchTerm]);

    if (loading) {
        return (
            <div className="stachesepl-manager-availability">
                <Loading />
            </div>
        );
    }

    if (error) {
        return (
            <div className="stachesepl-manager-availability">
                <div className="stachesepl-manager-availability-error">
                    <span className="stachesepl-manager-availability-error-icon">⚠</span>
                    <span>{error}</span>
                </div>
            </div>
        );
    }

    if (!data || seats.length === 0) {
        return (
            <div className="stachesepl-manager-availability">
                <div className="stachesepl-manager-availability-empty">
                    <EventSeat className="stachesepl-manager-availability-empty-icon" />
                    <p className="stachesepl-manager-availability-empty-title">
                        {__('NO_SEATS_FOUND')}
                    </p>
                    <p className="stachesepl-manager-availability-empty-description">
                        {__('NO_SEATS_CONFIGURED_FOR_PRODUCT')}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="stachesepl-manager-availability">
            {/* Stats Cards */}
            <StatsCards
                totalSeats={seats.length}
                statusCounts={statusCounts}
                filterStatus={filterStatus}
                onFilterChange={setFilterStatus}
            />

            {/* Search and Filter Bar */}
            <Toolbar
                filterStatus={filterStatus}
                searchTerm={searchTerm}
                filteredSeatsCount={filteredSeats.length}
                onSearchChange={setSearchTerm}
                onClearSearch={() => setSearchTerm('')}
                onClearFilter={() => setFilterStatus('all')}
                isSelectionMode={isSelectionMode}
                onToggleSelectionMode={handleToggleSelectionMode}
                selectedCount={selectedSeats.size}
                onSelectAll={() => handleSelectAll(filteredSeats)}
                onDeselectAll={handleDeselectAll}
            />

            {/* Bulk Move Notice */}
            {bulkMoveNotice && (
                <div className="stachesepl-manager-availability-notice stachesepl-manager-availability-notice--success">
                    <CheckCircle className="stachesepl-manager-availability-notice-icon" />
                    <div className="stachesepl-manager-availability-notice-content">
                        <strong>{__('BULK_MOVE_COMPLETE')}</strong>
                        <span>
                            {__('BULK_MOVE_NOTICE_TEXT')
                                ?.replace('%1$d', bulkMoveNotice.movedCount.toString())
                                ?.replace('%2$s', getFormattedDateTime(bulkMoveNotice.sourceDate))
                                ?.replace('%3$d', bulkMoveNotice.notificationsSent.toString())}
                        </span>
                        {bulkMoveNotice.skippedCount > 0 && (
                            <span className="stachesepl-manager-availability-notice-secondary">
                                {__('BULK_MOVE_SKIPPED_TEXT')?.replace('%d', bulkMoveNotice.skippedCount.toString())}
                            </span>
                        )}
                    </div>
                    <button
                        className="stachesepl-manager-availability-notice-close"
                        onClick={() => setBulkMoveNotice(null)}
                        aria-label={__('CLOSE')}
                    >
                        <Close />
                    </button>
                </div>
            )}

            {/* Bulk Move Error Notice */}
            {bulkMoveErrorNotice && (
                <div className="stachesepl-manager-availability-notice stachesepl-manager-availability-notice--error">
                    <ErrorIcon className="stachesepl-manager-availability-notice-icon" />
                    <div className="stachesepl-manager-availability-notice-content">
                        <strong>{bulkMoveErrorNotice.message}</strong>
                        <ul className="stachesepl-manager-availability-notice-list">
                            {bulkMoveErrorNotice.errors.map((error, index) => (
                                <li key={index}>{error}</li>
                            ))}
                        </ul>
                    </div>
                    <button
                        className="stachesepl-manager-availability-notice-close"
                        onClick={() => setBulkMoveErrorNotice(null)}
                        aria-label={__('CLOSE')}
                    >
                        <Close />
                    </button>
                </div>
            )}

            {/* Seats Grid */}
            <SeatsGrid
                seats={filteredSeats}
                paginatedSeats={paginatedSeats}
                getSeatAvailabilityStatus={getSeatAvailabilityStatus}
                handleEditSeat={handleEditSeat}
                isSelectionMode={isSelectionMode}
                selectedSeats={selectedSeats}
                onToggleSeatSelection={handleToggleSeatSelection}
            />

            {/* Pagination */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                startIndex={startIndex}
                endIndex={endIndex}
                totalItems={filteredSeats.length}
                onPageChange={setCurrentPage}
            />

            {/* Bulk Action Bar */}
            {isSelectionMode && selectedSeats.size > 0 && (
                <BulkActionBar
                    selectedCount={selectedSeats.size}
                    selectedSeatIds={Array.from(selectedSeats)}
                    discounts={data?.discounts || []}
                    customFields={data?.customFields || []}
                    onStatusChange={handleBulkStatusChange}
                    onCancel={handleToggleSelectionMode}
                    loading={bulkLoading}
                    hasDates={hasDates}
                    currentDateTime={dateTime}
                    onMoveToDate={handleBulkMoveToDate}
                    movingToDate={movingToDate}
                    onSuccess={reload}
                />
            )}
        </div>
    );
};

export default Contents;
