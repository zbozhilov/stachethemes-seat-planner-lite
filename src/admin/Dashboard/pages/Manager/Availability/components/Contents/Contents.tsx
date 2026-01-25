import { useNavigate, useParams } from 'react-router';
import { useAuditoriumProductAvailability } from '../../../hooks';
import './Contents.scss';
import { __ } from '@src/utils';
import { EventSeat } from '@mui/icons-material';
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

const Contents = () => {

    const { productId, dateTime } = useParams<{ productId?: string; dateTime?: string }>();
    const productIdNum = productId ? parseInt(productId, 10) : undefined;
    const { data, loading, error, reload } = useAuditoriumProductAvailability(productIdNum, dateTime);
    const navigate = useNavigate();
    const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // Selection mode state
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedSeats, setSelectedSeats] = useState<Set<string>>(new Set());

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
                    onStatusChange={() => {
                        toast.error(__('BULK_UPDATE_NOT_SUPPORTED_IN_LITE_VERSION'));
                    }}
                    onCancel={handleToggleSelectionMode}
                    loading={false}
                />
            )}
        </div>
    );
};

export default Contents;
