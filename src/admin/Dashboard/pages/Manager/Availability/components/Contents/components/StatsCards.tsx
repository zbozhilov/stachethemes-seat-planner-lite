import { EventSeat, CheckCircle, Cancel, Block, Storefront } from '@mui/icons-material';
import { __ } from '@src/utils';
import type { SeatAvailabilityStatus } from '../types';
import './StatsCards.scss';

type StatusCounts = Record<SeatAvailabilityStatus, number>;

type FilterStatus = 'all' | SeatAvailabilityStatus;

type StatsCardsProps = {
    totalSeats: number;
    statusCounts: StatusCounts;
    filterStatus: FilterStatus;
    onFilterChange: (status: FilterStatus) => void;
};

const StatsCards = ({ totalSeats, statusCounts, filterStatus, onFilterChange }: StatsCardsProps) => {
    return (
        <div className="stachesepl-manager-availability-stats">
            <button
                className={`stachesepl-manager-availability-stat ${filterStatus === 'all' ? 'stachesepl-manager-availability-stat--active' : ''}`}
                onClick={() => onFilterChange('all')}
            >
                <div className="stachesepl-manager-availability-stat-icon stachesepl-manager-availability-stat-icon--total">
                    <EventSeat />
                </div>
                <div className="stachesepl-manager-availability-stat-content">
                    <span className="stachesepl-manager-availability-stat-value">{totalSeats}</span>
                    <span className="stachesepl-manager-availability-stat-label">{__('TOTAL_SEATS')}</span>
                </div>
            </button>

            <button
                className={`stachesepl-manager-availability-stat ${filterStatus === 'available' ? 'stachesepl-manager-availability-stat--active' : ''}`}
                onClick={() => onFilterChange('available')}
            >
                <div className="stachesepl-manager-availability-stat-icon stachesepl-manager-availability-stat-icon--available">
                    <CheckCircle />
                </div>
                <div className="stachesepl-manager-availability-stat-content">
                    <span className="stachesepl-manager-availability-stat-value">{statusCounts['available'] || 0}</span>
                    <span className="stachesepl-manager-availability-stat-label">{__('STATUS_AVAILABLE')}</span>
                </div>
            </button>

            <button
                className={`stachesepl-manager-availability-stat ${filterStatus === 'sold-out' ? 'stachesepl-manager-availability-stat--active' : ''}`}
                onClick={() => onFilterChange('sold-out')}
            >
                <div className="stachesepl-manager-availability-stat-icon stachesepl-manager-availability-stat-icon--sold-out">
                    <Cancel />
                </div>
                <div className="stachesepl-manager-availability-stat-content">
                    <span className="stachesepl-manager-availability-stat-value">{statusCounts['sold-out'] || 0}</span>
                    <span className="stachesepl-manager-availability-stat-label">{__('STATUS_SOLD_OUT')}</span>
                </div>
            </button>

            <button
                className={`stachesepl-manager-availability-stat ${filterStatus === 'on-site' ? 'stachesepl-manager-availability-stat--active' : ''}`}
                onClick={() => onFilterChange('on-site')}
            >
                <div className="stachesepl-manager-availability-stat-icon stachesepl-manager-availability-stat-icon--on-site">
                    <Storefront />
                </div>
                <div className="stachesepl-manager-availability-stat-content">
                    <span className="stachesepl-manager-availability-stat-value">{statusCounts['on-site'] || 0}</span>
                    <span className="stachesepl-manager-availability-stat-label">{__('STATUS_ON_SITE')}</span>
                </div>
            </button>

            <button
                className={`stachesepl-manager-availability-stat ${filterStatus === 'unavailable' ? 'stachesepl-manager-availability-stat--active' : ''}`}
                onClick={() => onFilterChange('unavailable')}
            >
                <div className="stachesepl-manager-availability-stat-icon stachesepl-manager-availability-stat-icon--unavailable">
                    <Block />
                </div>
                <div className="stachesepl-manager-availability-stat-content">
                    <span className="stachesepl-manager-availability-stat-value">{statusCounts['unavailable'] || 0}</span>
                    <span className="stachesepl-manager-availability-stat-label">{__('STATUS_UNAVAILABLE')}</span>
                </div>
            </button>
        </div>
    );
};

export default StatsCards;

