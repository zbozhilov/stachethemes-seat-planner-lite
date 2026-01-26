import { __ } from '@src/utils';
import './NoDataMessage.scss';

const NoDataMessage: React.FC = () => {
    return (
        <p className='stachesepl-no-data'>{__('NO_ORDER_DATA_FOUND')}</p>
    );
};

export default NoDataMessage;

