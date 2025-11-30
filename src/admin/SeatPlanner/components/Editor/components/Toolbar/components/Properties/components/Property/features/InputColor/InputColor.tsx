import { useEffect, useRef, useState } from 'react';
import { ColorPicker, useColor } from 'react-color-palette';
import "react-color-palette/css";
import { Portal } from 'react-portal';
import { useOutsideHandler } from './hooks';
import './InputColor.scss';
import { InputColorProps } from './types';

const InputColor = (props: InputColorProps) => {
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [color, setColor] = useColor(props.value);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const previewRef = useRef<HTMLDivElement>(null);
    const pendingColor = useRef<string>(props.value);
    const classNameArray = ['stachesepl-input-color'];
    const portalNode = document.getElementsByClassName('stachesepl-sesat-planner-editor-portal');

    const handlePreviewClick = () => {
        setShowColorPicker(!showColorPicker);
    }

    useOutsideHandler([dropdownRef, previewRef], () => {
        if (showColorPicker) {
            setShowColorPicker(false);
            props.onChange(pendingColor.current);

        }
    });

    useEffect(() => {
        if (!showColorPicker || !dropdownRef.current || !previewRef.current) {
            return;
        }

        const dropdownElement = dropdownRef.current;
        const previewRect = previewRef.current.getBoundingClientRect();
        const scrollX = window.scrollX;
        const scrollY = window.scrollY;
        
        // Calculate if there's enough space below the preview
        const showAbovePreview = (window.innerHeight - dropdownElement.clientHeight - 50) < previewRect.top;
        
        // Position dropdown horizontally
        dropdownElement.style.left = `${previewRect.left + scrollX}px`;
        
        // Position dropdown vertically based on available space
        if (showAbovePreview) {
            dropdownElement.style.top = `${previewRect.top - dropdownElement.clientHeight - 8 + scrollY}px`;
            dropdownElement.classList.add('stachesepl-input-color-content-top');
        } else {
            dropdownElement.style.top = `${previewRect.top + previewRect.height + scrollY}px`;
            dropdownElement.classList.remove('stachesepl-input-color-content-top');
        }
    }, [showColorPicker]);


    return (
        <div className={classNameArray.join(' ')}>

            <div className='stachesepl-input-color-preview-wrap'>
                <div ref={previewRef} tabIndex={0} className='stachesepl-input-color-preview' style={{
                    backgroundColor: color.hex
                }} onClick={handlePreviewClick}></div>
            </div>

            {
                showColorPicker &&
                <Portal node={portalNode[0]}>
                    <div className='stachesepl-input-color-content' ref={dropdownRef}>
                        <ColorPicker
                            hideAlpha={false}
                            hideInput={['rgb', 'hsv']}
                            color={color}
                            onChange={(color) => {
                                setColor(color);
                                pendingColor.current = color.hex;
                            }}
                        />
                    </div>
                </Portal>
            }
        </div>
    );
};

export default InputColor;