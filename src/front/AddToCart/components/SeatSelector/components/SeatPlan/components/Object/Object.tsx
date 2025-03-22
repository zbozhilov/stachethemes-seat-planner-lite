import { Accessible } from '@mui/icons-material';
import { useSelectedSeats } from '@src/front/AddToCart/components/context/hooks';
import React from 'react';
import { FrontWorkflowObject } from 'src/front/AddToCart/types';
import './Object.scss';
import { getFontSizeByType, hasBackgroundColor, isRounded } from './utils';

const Object = (props: {
    data: FrontWorkflowObject,
}) => {

    const { selectedSeats, setSelectedSeats } = useSelectedSeats();

    const style: React.CSSProperties = {
        left: props.data.move.x,
        top: props.data.move.y,
        width: props.data.size.width,
        height: props.data.size.height,
        color: props.data.color,
        fontSize: getFontSizeByType(props.data.fontSize),
        backgroundColor: hasBackgroundColor(props.data) ? props.data.backgroundColor : 'transparent',
        borderRadius: isRounded(props.data) ? '50%' : undefined
    }

    const handleSeatSelectToggle = (seatId: string) => {

        if (selectedSeats.includes(seatId)) {
            setSelectedSeats(selectedSeats.filter((id) => id !== seatId));
        } else {
            setSelectedSeats([...selectedSeats, seatId]);
        }

    }

    const disablePanning = (e: React.MouseEvent) => {
        e.stopPropagation();
    }

    switch (props.data.type) {

        case 'screen': {

            const { backgroundColor, ...baseStyle } = style;

            return (
                <div className="stachesepl-object stachesepl-object-type-screen" style={baseStyle}>
                    <div className="stachesepl-object-type-screen-label">{props.data.label}</div>
                    <div className="stachesepl-screen-persepective">
                        <div className="stachesepl-screen-vis" style={{
                            backgroundColor: backgroundColor
                        }}></div>
                    </div>
                </div>
            );
        }

        case 'seat': {

            const isSelected = selectedSeats.includes(props.data.seatId);

            const classNameArray = ['stachesepl-object', 'stachesepl-object-seat'];

            if (isSelected) {
                classNameArray.push('selected');
            }

            if (!props.data.seatId) {
                classNameArray.push('disabled');
            }

            if (props.data.taken) {
                classNameArray.push('taken');
            }

            return (
                <div
                    className={classNameArray.join(' ')}
                    style={style}
                    onMouseDown={disablePanning}
                    onClick={(e) => {

                        if (props.data.type === 'seat' && props.data.seatId && !props.data.taken) {
                            handleSeatSelectToggle(props.data.seatId);
                        }

                    }}>
                    {props.data.isHandicap && <Accessible />}
                    {!props.data.isHandicap && props.data.label}
                </div>
            )
        }

        case 'text': {

            const classNameArray = ['stachesepl-object','stachesepl-object-text'];

            return (
                <div
                    className={classNameArray.join(' ')}
                    style={style}
                    onMouseDown={disablePanning}>
                    {props.data.label}
                </div>
            )
        }

        case 'generic': {

            const classNameArray = ['stachesepl-object','stachesepl-object-generic'];

            return (
                <div
                    className={classNameArray.join(' ')}
                    style={style}
                    onMouseDown={disablePanning}>
                    {props.data.label}
                </div>
            )
        }

        default: {
            return null;
        }

    }

}

export default Object