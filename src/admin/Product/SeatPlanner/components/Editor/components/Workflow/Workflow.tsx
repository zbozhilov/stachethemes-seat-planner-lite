import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useEditorGridEnabled, useEditorGridGap, useEditorObjects, useEditorSeatDisplayLabel, useSelectObjects, useWorkflowProps } from '../../hooks';
import Generic from './components/Objects/Generic/Generic';
import Screen from './components/Objects/Screen/Screen';
import Seat from './components/Objects/Seat/Seat';
import Text from './components/Objects/Text/Text';
import { useCopyPaste, useDeleteAndEscapeKey, useGrid, useHistory, useMarquee, useToggleSeatLabelDisplay } from './hooks';
import './Workflow.scss';
import { __ } from '@src/utils';

type SeatDisplayLabelType = 'label' | 'price' | 'seatid' | 'group' | 'status';

const DISPLAY_LABEL_OPTIONS: { value: SeatDisplayLabelType; label: string }[] = [
    { value: 'seatid', label: 'SEAT_ID' },
    { value: 'label', label: 'SEAT_LABEL' },
    { value: 'price', label: 'SEAT_PRICE' },
    { value: 'group', label: 'SEAT_GROUP' },
    { value: 'status', label: 'SEAT_STATUS' },
];

const Workflow = () => {

    const { objects, getSeatsWithDuplicateSeatIds } = useEditorObjects();
    const { selectedObjects } = useSelectObjects();
    const workflowRef = useRef<HTMLDivElement | null>(null);
    const { workflowProps, setWorkflowProps } = useWorkflowProps();
    const { gridGap } = useEditorGridGap();
    const { gridEnabled } = useEditorGridEnabled();

    // Resize state
    const [isResizing, setIsResizing] = useState(false);
    const [resizeDimensions, setResizeDimensions] = useState<{ width: number; height: number } | null>(null);
    const latestDimensionsRef = useRef<{ width: number; height: number } | null>(null);

    // Display label dropdown state
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    useMarquee(workflowRef);
    useGrid(workflowRef);
    useCopyPaste();
    useDeleteAndEscapeKey();
    useHistory();
    useToggleSeatLabelDisplay();

    const { seatDisplayLabel, setSeatDisplayLabel } = useEditorSeatDisplayLabel();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);

    const handleSelectDisplayLabel = useCallback((value: SeatDisplayLabelType) => {
        setSeatDisplayLabel(value);
        setIsDropdownOpen(false);
    }, [setSeatDisplayLabel]);

    // Snap value to grid
    const snapToGrid = useCallback((value: number) => {
        if (!gridEnabled) {
            return value;
        }
        return Math.round(value / gridGap) * gridGap;
    }, [gridGap, gridEnabled]);

    const handleResizeStart = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        const workflow = workflowRef.current;
        if (!workflow) return;

        setIsResizing(true);

        const handleMouseMove = (moveEvent: MouseEvent) => {
            if (!workflow) return;

            // Get workflow's current bounding rect (updates as it resizes)
            const rect = workflow.getBoundingClientRect();
            
            // Calculate size based on mouse position relative to workflow's top-left
            const rawWidth = moveEvent.clientX - rect.left;
            const rawHeight = moveEvent.clientY - rect.top;

            // Snap to grid with minimum size
            const newWidth = Math.max(550, snapToGrid(rawWidth));
            const newHeight = Math.max(550, snapToGrid(rawHeight));

            const newDimensions = { width: newWidth, height: newHeight };
            latestDimensionsRef.current = newDimensions;
            setResizeDimensions(newDimensions);
        };

        const handleMouseUp = () => {
            setIsResizing(false);
            
            if (latestDimensionsRef.current) {
                setWorkflowProps(prev => ({
                    ...prev,
                    width: latestDimensionsRef.current!.width,
                    height: latestDimensionsRef.current!.height,
                }));
            }
            
            setResizeDimensions(null);
            latestDimensionsRef.current = null;

            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }, [setWorkflowProps, snapToGrid]);

    const currentWidth = resizeDimensions?.width ?? workflowProps.width;
    const currentHeight = resizeDimensions?.height ?? workflowProps.height;

    const workflowStyle: React.CSSProperties = {
        width: currentWidth,
        height: currentHeight,
    }

    const getDisplayLabel = (value: SeatDisplayLabelType) => {
        const option = DISPLAY_LABEL_OPTIONS.find(opt => opt.value === value);
        return option ? __(option.label) : '';
    }

    const getWorkflowWrapperClassName = () => {
        const classNameArray = [
            'stachesepl-workflow-wrapper',
            isResizing ? 'is-resizing' : '',
        ];
        
        if (selectedObjects.length === 1) {
            classNameArray.push('single-selected');
        }   

        return classNameArray.filter(Boolean).join(' ');
    }

    const seatsWithErrors = getSeatsWithDuplicateSeatIds();

    const workflowWrapperClassName = getWorkflowWrapperClassName();

    return (
        <div className={workflowWrapperClassName} style={{
            backgroundColor: workflowProps.backgroundColor
        }}>

            <div className='stachesepl-workflow-overlay'
                style={{
                    ...workflowStyle,
                    backgroundImage: `url(${workflowProps.backgroundImage ?? ''})`,
                    opacity: workflowProps.backgroundOpacity ?? '1'

                }}
            ></div>

            <div 
                className={`stachesepl-seat-display-label-dropdown${isDropdownOpen ? ' is-open' : ''}`}
                ref={dropdownRef}
            >
                <div 
                    className='stachesepl-seat-display-label-tag'
                    onClick={() => setIsDropdownOpen(prev => !prev)}
                    title={__('CLICK_TO_CHANGE_DISPLAY_LABEL')}
                >
                    {getDisplayLabel(seatDisplayLabel)}
                    <span className='stachesepl-seat-display-label-arrow'>▾</span>
                </div>
                
                {isDropdownOpen && (
                    <div className='stachesepl-seat-display-label-menu'>
                        {DISPLAY_LABEL_OPTIONS.map(option => (
                            <div
                                key={option.value}
                                className={`stachesepl-seat-display-label-option${seatDisplayLabel === option.value ? ' is-active' : ''}`}
                                onClick={() => handleSelectDisplayLabel(option.value)}
                            >
                                {__(option.label)}
                            </div>
                        ))}
                    </div>
                )}
            </div>

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

                {/* Resize handle */}
                <div 
                    className='stachesepl-workflow-resize-handle'
                    onMouseDown={handleResizeStart}
                    title={__('RESIZE_WORKFLOW')}
                />
            </div>

            {/* Resize dimensions tooltip */}
            {isResizing && resizeDimensions && (
                <div className='stachesepl-workflow-resize-tooltip'>
                    {Math.round(resizeDimensions.width)} × {Math.round(resizeDimensions.height)}
                </div>
            )}
        </div>
    )
}

export default Workflow