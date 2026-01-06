import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { __, getFormatteDate, getFormattedTime } from '../../utils';
import CircLoader from '../AddToCart/components/CircLoader/CircLoader';
import DatePicker from './components/DatePicker/DatePicker';
import NotAvailable from './components/NotAvailable/NotAvailable';
import TimePicker from './components/TimePicker/TimePicker';
import './DateTimePicker.scss';
import useAccentColor from './hooks/useAccentColor';
import useAvailableDates from './hooks/useAvailableDates';
import useDatesList from './hooks/useDatesList';
import useDropdownPosition from './hooks/useDropdownPosition';
import useFirstAvailableDate from './hooks/useFirstAvailableDate';
import useMobileBackButton from './hooks/useMobileBackButton';
import useOutsideHandler from './hooks/useOutsideHandler';

const DateTimePicker = (props: {
    dummyDates?: string[];
    productId: number;
    accentColor?: string;
    selectedDateTime?: string;
    onDateTimeSelected?: (dateTime: string) => void;
    onConfirm?: () => void;
}) => {

    const { productId, accentColor, selectedDateTime, dummyDates, onDateTimeSelected, onConfirm } = props;
    const containerRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const selectedDateTimeParts = selectedDateTime?.split('T') || [];
    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    const [selectedDate, setSelectedDate] = useState<string>(selectedDateTimeParts[0] || '');
    const [selectedTime, setSelectedTime] = useState<string>(selectedDateTimeParts[1] || '');
    const [timesList, setTimesList] = useState<string[]>([]);

    const { dropdownPosition, dropdownPositionStyle } = useDropdownPosition({
        containerRef: containerRef,
        dropdownRef: dropdownRef,
        showDropdown
    });

    const { availableDates, dataState } = useAvailableDates({
        productId: productId,
        disabled: showDropdown === false,
        dummyDates: dummyDates,
    });

    const { datesList, initialMonthDate } = useDatesList({
        selectedDate: selectedDate,
        availableDates,
        dataReady: dataState === 'ready',
    });

    const isLoading = dataState !== 'ready';

    const handleSelectedDate = (dateString: string) => {
        const availableTimes = availableDates.filter(dateTime => dateTime.includes(dateString)).map(dateTime => dateTime.split('T')[1]);

        setSelectedDate(dateString);
        setTimesList(availableTimes);

        // Auto-select first available time
        if (availableTimes.length > 0) {
            setSelectedTime(availableTimes[0]);
        } else {
            setSelectedTime('');
        }
    }

    const handleSelectedTime = (timeString: string) => {
        setSelectedTime(timeString);
    }

    const handleConfirm = () => {
        setShowDropdown(false);

        if (selectedDate && selectedTime) {
            onConfirm?.();
        }

    };

    const formatDisplayValue = () => {
        if (!selectedDate) return '';


        return selectedTime ? `${getFormatteDate(selectedDate)} at ${getFormattedTime(selectedTime)}` : getFormatteDate(selectedDate);
    };

    // Apply accent color to container immediately (always rendered)
    const { style: accentStyle } = useAccentColor({
        accentColor: accentColor,
    });

    useFirstAvailableDate({
        isLoading: isLoading,
        availableDates: availableDates,
        selectedDate: selectedDate,
        setSelectedDate: setSelectedDate,
        setSelectedTime: setSelectedTime,
        setTimesList: setTimesList,
    });

    useOutsideHandler({
        containerRef: containerRef,
        dropdownRef: dropdownRef,
        setShowDropdown: setShowDropdown,
    });

    // Handle browser back button on mobile to close modal
    useMobileBackButton({
        showDropdown: showDropdown,
        setShowDropdown: setShowDropdown,
    });

    // Update the context with the selected date and time
    useEffect(() => {

        if (!selectedDate || !selectedTime) {
            return;
        }

        if (selectedDateTime !== `${selectedDate}T${selectedTime}`) {
            // Update only if date changed
            onDateTimeSelected?.(`${selectedDate}T${selectedTime}`);
        }

    }, [selectedDate, selectedTime, onDateTimeSelected, selectedDateTime]);

    // Lock body scroll when modal is open on mobile
    useEffect(() => {
        if (showDropdown && window.innerWidth < 782) {
            document.body.classList.add('stachesepl-date-time-picker-mobile-open');
        } else {
            document.body.classList.remove('stachesepl-date-time-picker-mobile-open');
        }

        return () => {
            document.body.classList.remove('stachesepl-date-time-picker-mobile-open');
        };
    }, [showDropdown]);


    const isInitialState = !selectedDate || !selectedTime;
    const confirmButtonText = isInitialState ? __('CLOSE') : __('SELECT_SEAT');
    const buttonClass = isInitialState ? 'stachesepl-date-time-picker__btn--secondary' : 'stachesepl-date-time-picker__btn--primary';

    return (

        <div className='stachesepl-date-time' style={accentStyle} ref={containerRef}>

            <div
                className={`stachesepl-date-time-input ${showDropdown ? 'stachesepl-date-time-input--active' : ''} ${formatDisplayValue() ? 'stachesepl-date-time-input--filled' : ''}`}
                onClick={() => setShowDropdown(!showDropdown)}
            >
                <span className="stachesepl-date-time-input__icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                </span>
                <span className="stachesepl-date-time-input__text">
                    {formatDisplayValue() || __('SELECT_DATE_AND_TIME')}
                </span>
                <span className={`stachesepl-date-time-input__chevron ${showDropdown ? 'stachesepl-date-time-input__chevron--up' : ''}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </span>
            </div>

            {/* Portal for dropdown - renders outside parent overflow constraints */}
            {showDropdown && createPortal(
                <>

                    {/* Modal overlay for mobile */}
                    <div className='stachesepl-date-time-overlay' onClick={() => setShowDropdown(false)} />

                    {/* This below is a dropdown / modal on mobile */}
                    <div
                        ref={dropdownRef}
                        className={`stachesepl-date-time-picker ${dropdownPosition === 'above' ? 'stachesepl-date-time-picker--above' : ''}`}
                        style={{ ...dropdownPositionStyle, ...accentStyle }}
                    >
                        {/* Mobile header with close button */}
                        <div className='stachesepl-date-time-picker__header'>
                            <div className='stachesepl-date-time-picker__title'>{__('SELECT_DATE_AND_TIME')}</div>
                            <div
                                className='stachesepl-date-time-picker__close-btn'
                                onClick={() => setShowDropdown(false)}
                                aria-label="Close"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </div>
                        </div>

                        <div className={`stachesepl-date-time-picker__content ${isLoading ? 'stachesepl-date-time-picker__content--loading' : ''}`}>

                            {
                                isLoading && <CircLoader
                                    text={__('CHECKING_AVAILABILITY')}
                                    type='large'
                                    accentColor={accentColor}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        backgroundColor: '#fff',
                                        color: 'var(--picker-text)',
                                        zIndex: 100
                                    }} />
                            }

                            {
                                !isLoading && !datesList.length && <NotAvailable />
                            }

                            <DatePicker
                                datesList={datesList}
                                selectedDate={selectedDate}
                                setSelectedDate={handleSelectedDate}
                                initialMonthDate={initialMonthDate}
                            />

                            <TimePicker
                                key={selectedDate} // Force re-render when date changes, this will fix the css transitioning deselection of the time
                                timesList={timesList}
                                selectedTime={selectedTime}
                                setSelectedTime={handleSelectedTime}
                            />


                        </div>

                        <div className='stachesepl-date-time-picker__footer'>
                            <div
                                className={`stachesepl-date-time-picker__btn ${buttonClass}`}
                                onClick={handleConfirm}
                            >
                                {confirmButtonText}
                            </div>
                        </div>
                    </div>
                </>,
                document.body
            )}

        </div>
    )
}

export default DateTimePicker;