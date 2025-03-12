import {
    Check, Close, Warning
} from '@mui/icons-material'
import './DisplayResult.scss'
import { __ } from '@src/utils';
import { qrProductDataProps } from '@src/admin/SeatScanner/types';

const DisplayResult = (props: {
    data: qrProductDataProps | null
}) => {

    const { data } = props;

    const hasData = data !== null && 'order_id' in data && data.order_id;

    const getValidState = (): number => {

        if (!hasData) {
            return 0;
        }

        const hasOrderId = !!data.order_id;
        const isCompleted = data.order_status && data.order_status.toLowerCase() === 'completed';
        const hasSeatId = !!data.seat_id;
        const wasScanned = !!data.scanned;

        let state = 0;

        if (hasOrderId && isCompleted && hasSeatId) {
            state = 1;
        }

        if (wasScanned) {
            state = 2;
        }

        return state;

    };

    const getValidClass = () => {

        const validState = getValidState();

        if (validState === 1) {
            return 'valid';
        }

        if (validState === 2) {
            return 'used';
        }

        return 'invalid';

    }

    const getValidText = () => {

        const validState = getValidState();

        if (validState === 1) {
            return __('TICKET_IS_VALID');
        }

        if (validState === 2) {
            return __('TICKET_IS_USED');
        }

        return __('TICKET_IS_INVALID');
    }

    const getValidIcon = () => {

        const validState = getValidState();

        if (validState === 1) {
            return <Check />;
        }

        if (validState === 2) {
            return <Warning />;
        }

        return <Close />;

    }

    return (
        <div className={`stsp-scan-home-content-result ${getValidClass()}`}>

            <div className="result-valid">
                {getValidIcon()}
                <span>{getValidText()}</span>
            </div>

            <div className="result-product-title">{hasData ? data.product_title : __('PRODUCT_NOT_FOUND')}</div>

            <div className="result-row">
                <span>{__('ORDER_ID')}:</span>
                <span>{hasData ? data.order_id : __('N/A')}</span>
            </div>

            <div className="result-row">
                <span>{__('ORDER_STATUS')}:</span>
                <span>{hasData ? data.order_status : __('N/A')}</span>
            </div>

            <div className="result-row">
                <span>{__('NAME')}:</span>
                <span>{hasData ? data.customer_name : __('N/A')}</span>
            </div>

            <div className="result-row">
                <span>{__('SEAT_ID')}:</span>
                <span>{hasData ? data.seat_id : __('N/A')}</span>
            </div>

        </div>
    )
}

export default DisplayResult