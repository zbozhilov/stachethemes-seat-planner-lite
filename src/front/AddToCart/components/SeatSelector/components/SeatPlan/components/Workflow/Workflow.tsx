import { useSeatPlanData } from '@src/front/AddToCart/components/context/hooks';
import { SeatPlanDataProps } from '@src/front/AddToCart/types';
import React from 'react';
import { useImageReady } from './hooks';
import './Workflow.scss';

const Overlay = (props: {
    seatPlanData: SeatPlanDataProps
}) => {

    const { seatPlanData } = props;

    const imageReady = useImageReady(seatPlanData.workflowProps.backgroundImage);

    return <div className='stachesepl-workflow-overlay' style={{
        opacity: imageReady ? (seatPlanData.workflowProps.backgroundOpacity ?? 1) : 0,
        backgroundImage: imageReady ? `url(${seatPlanData.workflowProps.backgroundImage})` : 'none',
    }} />
}

const Workflow = (props: {
    children: React.ReactNode
}) => {

    const { seatPlanData } = useSeatPlanData();

    if (!seatPlanData) {
        return null;
    }

    const { width, height, backgroundColor } = seatPlanData.workflowProps;

    const style: React.CSSProperties = {
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: backgroundColor,
    }

    const classNameArray = [
        'stachesepl-workflow',
    ];

    return (
        <div className={classNameArray.join(' ')} style={style}>
            <Overlay seatPlanData={seatPlanData} />
            {
                props.children
            }
        </div>
    )
}

export default Workflow