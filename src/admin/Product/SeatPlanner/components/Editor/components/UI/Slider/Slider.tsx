import React, { useState, useEffect } from 'react';
import './Slider.scss';
import { SliderProps } from './types';

const Slider = (props: SliderProps) => {
    const {
        id,
        value,
        min = 0,
        max = 1,
        step = 0.01,
        onChange,
        onCommit,
        className = '',
        sliderClassName = '',
    } = props;

    const [localValue, setLocalValue] = useState<number | string>(value);

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setLocalValue(newValue);
        onChange?.(newValue);
    }

    const handleSliderCommit = () => {
        onCommit?.(localValue);
    }

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setLocalValue(newValue);
        onChange?.(newValue);
    }

    const handleNumberBlur = () => {
        onCommit?.(localValue);
    }

    const percentageValue = `${((parseFloat(String(localValue)) - min) / (max - min)) * 100}%`;

    return (
        <div className={`stachesepl-slider ${className}`}>
            <input
                type='range'
                min={min}
                max={max}
                step={step}
                value={localValue}
                onChange={handleSliderChange}
                onMouseUp={handleSliderCommit}
                onTouchEnd={handleSliderCommit}
                className={`stachesepl-slider-range ${sliderClassName}`}
                style={{ '--slider-value': percentageValue } as React.CSSProperties}
            />
            <input
                id={id}
                type='number'
                step={step}
                min={min}
                max={max}
                value={localValue}
                onChange={handleNumberChange}
                onBlur={handleNumberBlur}
                className={`stachesepl-slider-number`}
            />
        </div>
    );
};

export default Slider;

