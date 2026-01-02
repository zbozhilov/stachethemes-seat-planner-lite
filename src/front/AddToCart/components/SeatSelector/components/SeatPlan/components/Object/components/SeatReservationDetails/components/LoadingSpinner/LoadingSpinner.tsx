import { __ } from '@src/utils';
import React from 'react';
import './LoadingSpinner.scss';

const LoadingSpinner: React.FC = () => {
    return (
        <div className='stachesepl-loading-spinner'>
            <span>{__('LOADING')}</span>
        </div>
    );
};

export default LoadingSpinner;

