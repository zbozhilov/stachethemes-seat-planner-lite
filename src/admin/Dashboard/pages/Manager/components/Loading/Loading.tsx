import { __ } from '@src/utils';
import './Loading.scss';

type LoadingProps = {
    message?: string;
};

const Loading = ({ message }: LoadingProps) => {
    return (
        <div className="stachesepl-manager-loading">
            <div className="stachesepl-manager-loading-spinner" />
            <span>{message || __('MANAGER_LOADING')}</span>
        </div>
    );
};

export default Loading;
