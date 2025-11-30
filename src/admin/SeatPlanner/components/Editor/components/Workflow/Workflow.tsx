import React, { useRef } from 'react';
import { useEditorObjects, useEditorSeatDisplayLabel, useWorkflowProps } from '../../hooks';
import Generic from './components/Objects/Generic/Generic';
import Screen from './components/Objects/Screen/Screen';
import Seat from './components/Objects/Seat/Seat';
import Text from './components/Objects/Text/Text';
import { useCopyPaste, useDeleteAndEscapeKey, useGrid, useHistory, useMarquee, useToggleSeatLabelDisplay } from './hooks';
import './Workflow.scss';
import { __ } from '@src/utils';

const Workflow = () => {

    const { objects, getSeatsWithDuplicateSeatIds } = useEditorObjects();
    const workflowRef = useRef<HTMLDivElement | null>(null);
    const { workflowProps } = useWorkflowProps();

    useMarquee(workflowRef);
    useGrid(workflowRef);
    useCopyPaste();
    useDeleteAndEscapeKey();
    useHistory();
    useToggleSeatLabelDisplay();

    const { seatDisplayLabel } = useEditorSeatDisplayLabel();

    const workflowStyle: React.CSSProperties = {
        width: workflowProps.width,
        height: workflowProps.height,
    }

    const getDisplayLabel = (seatDisplayLabel: "label" | "price" | "seatid" | "group" | "status") => {

        switch (seatDisplayLabel) {
            case 'label': return __('SEAT_LABEL')
            case 'price': return __('SEAT_PRICE')
            case 'seatid': return __('SEAT_ID')
            case 'group': return __('SEAT_GROUP')
            case 'status': return __('SEAT_STATUS')
            default: ''
        }

    }

    const seatsWithErrors = getSeatsWithDuplicateSeatIds();

    return (
        <div className='stachesepl-workflow-wrapper' style={{
            backgroundColor: workflowProps.backgroundColor
        }}>

            <div className='stachesepl-workflow-overlay'
                style={{
                    ...workflowStyle,
                    backgroundImage: `url(${workflowProps.backgroundImage ?? ''})`,
                    opacity: workflowProps.backgroundOpacity ?? '1'

                }}
            ></div>

            {
                seatDisplayLabel !== 'label' && <div className='stachesepl-seat-display-label-tag'>
                    {__('DISPLAY_LABEL')}: {getDisplayLabel(seatDisplayLabel)}
                </div>
            }

            <div className='stachesepl-workflow' ref={workflowRef} style={workflowStyle}>
                {
                    objects.map(object => {

                        switch (object.type) {

                            case 'seat':
                                return <Seat key={object.id} {...object} outlineError={seatsWithErrors.includes(object.seatId)} />

                            case 'generic':
                                return <Generic key={object.id} {...object} />

                            case 'screen':
                                return <Screen key={object.id} {...object} />

                            case 'text':
                                return <Text key={object.id} {...object} />

                            default:
                                return null;

                        }

                    })
                }
            </div>
        </div>
    )
}

export default Workflow