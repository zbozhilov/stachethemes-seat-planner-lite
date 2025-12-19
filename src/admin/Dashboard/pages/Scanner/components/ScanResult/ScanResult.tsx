import './ScanResult.scss'
import { __ } from '@src/utils'

export type TicketData = {
    scanned: boolean
    scan_date: string
    scan_author: string
    order_id: number
    order_key: string
    order_display_status: string
    order_status: string
    product_id: string
    product_title: string
    price: string
    seat_id: string
    order_link: string
    customer_name: string
    seat_status?: string
    date_time?: string
    date_time_timestamp?: number
    custom_fields?: Record<string, string>
}

export type TicketError = {
    error: string
}

export type ScanResultData = TicketData | TicketError | null

type ScanResultProps = {
    data: ScanResultData
}

type TicketState = 'valid' | 'used' | 'expired' | 'invalid'

const ScanResult = ({ data }: ScanResultProps) => {
    const hasData = data !== null && 'order_id' in data && data.order_id;

    const getTicketState = (): TicketState => {
        if (!hasData) return 'invalid';

        const ticketData = data as TicketData;
        const isCompleted = ticketData.order_status?.toLowerCase() === 'completed';
        const wasScanned = ticketData.scanned;
        const isExpired = ticketData.date_time_timestamp && ticketData.date_time_timestamp < Math.floor(Date.now() / 1000);

        if (!isCompleted) return 'invalid';
        if (isExpired) return 'expired';
        if (wasScanned) return 'used';
        
        return 'valid';
    };

    const ticketState = getTicketState();   

    const getStateConfig = () => {
        switch (ticketState) {
            case 'valid':
                return {
                    label: __('TICKET_IS_VALID'),
                    icon: (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                    )
                }
            case 'used': {
                const ticketData = data as TicketData
                const usedLabel = ticketData.scan_author && ticketData.scan_date
                    ? __('TICKET_SCANNED_BY__S__ON__S__').replace('%1$s', ticketData.scan_author).replace('%2$s', ticketData.scan_date)
                    : __('TICKET_IS_USED')
                return {
                    label: usedLabel,
                    icon: (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                    )
                }
            }
            case 'expired':
                return {
                    label: __('TICKET_IS_EXPIRED'),
                    icon: (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                        </svg>
                    )
                }
            default:
                return {
                    label: __('TICKET_IS_INVALID'),
                    icon: (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="15" y1="9" x2="9" y2="15" />
                            <line x1="9" y1="9" x2="15" y2="15" />
                        </svg>
                    )
                }
        }
    }

    const stateConfig = getStateConfig()
    const ticketData = hasData ? (data as TicketData) : null

    return (
        <div className={`stachesepl-scan-result stachesepl-scan-result--${ticketState}`}>
            <div className="stachesepl-scan-result-status">
                <div className="stachesepl-scan-result-status-icon">
                    {stateConfig.icon}
                </div>
                <span className="stachesepl-scan-result-status-label">
                    {stateConfig.label}
                </span>
            </div>

            <div className="stachesepl-scan-result-product">
                {ticketData?.product_title || __('PRODUCT_NOT_FOUND')}
            </div>

            <div className="stachesepl-scan-result-details">
                <div className="stachesepl-scan-result-row">
                    <span className="stachesepl-scan-result-row-label">{__('ORDER_ID')}</span>
                    <span className="stachesepl-scan-result-row-value">
                        {ticketData?.order_id ? `#${ticketData.order_id}` : __('N/A')}
                    </span>
                </div>

                <div className="stachesepl-scan-result-row">
                    <span className="stachesepl-scan-result-row-label">{__('ORDER_STATUS')}</span>
                    <span className="stachesepl-scan-result-row-value">
                        {ticketData?.order_display_status || __('N/A')}
                    </span>
                </div>

                <div className="stachesepl-scan-result-row">
                    <span className="stachesepl-scan-result-row-label">{__('NAME')}</span>
                    <span className="stachesepl-scan-result-row-value">
                        {ticketData?.customer_name || __('N/A')}
                    </span>
                </div>

                <div className="stachesepl-scan-result-row">
                    <span className="stachesepl-scan-result-row-label">{__('SEAT_ID')}</span>
                    <span className="stachesepl-scan-result-row-value">
                        {ticketData?.seat_id || __('N/A')}
                    </span>
                </div>

                {ticketData?.date_time && (
                    <div className="stachesepl-scan-result-row">
                        <span className="stachesepl-scan-result-row-label">{__('DATE')}</span>
                        <span className="stachesepl-scan-result-row-value">
                            {ticketData.date_time}
                        </span>
                    </div>
                )}

                {ticketData?.custom_fields && Object.entries(ticketData.custom_fields).map(([name, value]) => (
                    <div className="stachesepl-scan-result-row" key={name}>
                        <span className="stachesepl-scan-result-row-label">{name}</span>
                        <span className="stachesepl-scan-result-row-value">{value}</span>
                    </div>
                ))}
            </div>

            {ticketData?.order_link && (
                <a 
                    href={ticketData.order_link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="stachesepl-scan-result-order-link"
                >
                    {__('VIEW_ORDER')}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                </a>
            )}
        </div>
    )
}

export default ScanResult
