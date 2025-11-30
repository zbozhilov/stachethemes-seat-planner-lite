import { __ } from '@src/utils';
import './Loader.scss';

const Loader = () => {
    return (
        <div className='stachesepl-loader'>
            <svg width="28px" height="28px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="SVGRepo_bgCarrier" strokeWidth="0" />
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                <g id="SVGRepo_iconCarrier"> <path d="M4.97498 12H7.89998" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" /> <path d="M11.8 5V8" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" /> <path d="M18.625 12H15.7" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" /> <path d="M11.8 19V16" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" /> <path d="M6.97374 16.95L9.04203 14.8287" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" /> <path d="M6.97374 7.05001L9.04203 9.17133" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" /> <path d="M16.6262 7.05001L14.5579 9.17133" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" /> <path d="M16.6262 16.95L14.5579 14.8287" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" /> </g>
            </svg>
            <span>{__('JUST_A_MOMENT')}</span>
        </div>
    )
}

export default Loader