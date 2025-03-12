import { useSeatPlanData } from '@src/front/AddToCart/components/context/hooks';
import React, { useState } from 'react';
import './Workflow.scss';
import { SeatPlanDataProps } from '@src/front/AddToCart/types';
import { useImageReady } from './hooks';

const Overlay = (props: {
    seatPlanData: SeatPlanDataProps
}) => {

    const { seatPlanData } = props;

    const imageReady = useImageReady(seatPlanData.workflowProps.backgroundImage);

    return <div className='stsp-workflow-overlay' style={{
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

    return (
        <div className='stsp-workflow' style={style}>
            <Overlay seatPlanData={seatPlanData} />
            {
                props.children
            }
        </div>
    )
}

export default Workflow