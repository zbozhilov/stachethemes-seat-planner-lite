import { useWorkflowProps } from "@src/admin/Product/SeatPlanner/components/Editor/hooks";
import { __ } from "@src/utils";
import React, { useState } from "react";
import './Settings.scss';
import { hasBackgroundImage, mediaFrame } from "./utils";
import { Close, AddPhotoAlternate } from '@mui/icons-material';
import InputColor from "@src/admin/Product/SeatPlanner/components/Editor/components/Toolbar/components/Properties/components/Property/features/InputColor/InputColor";


const Settings = () => {

    const { workflowProps, setWorkflowProps } = useWorkflowProps();
    const { width, height, backgroundColor, backgroundOpacity = '1' } = workflowProps;
    const [bgImageOpacity, setBgImageOpacity] = useState(backgroundOpacity);

    const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setWorkflowProps(prev => ({
            ...prev,
            width: parseInt(e.target.value, 10) || 0
        }))
    }

    const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setWorkflowProps(prev => ({
            ...prev,
            height: parseInt(e.target.value, 10) || 0
        }))
    }

    const handleBackgroundColorChange = (color: string) => {
        setWorkflowProps(prev => ({
            ...prev,
            backgroundColor: color
        }))
    }

    const handleBackgroundImageChange = async () => {
        const images = await mediaFrame({
            libraryType: 'image',
            multiple: true,
            buttonText: __('ADD_SELECTED_IMAGE'),
            title: __('SELECT_BACKGROUND_IMAGE'),
        });

        if (!images?.length) {
            return;
        }

        const imageUrl = images[0].sizes.full.url;

        setWorkflowProps(prev => ({
            ...prev,
            backgroundImage: imageUrl
        }));
    }

    const handleBackgroundImageClear = (e: React.MouseEvent) => {

        e.stopPropagation();

        setWorkflowProps(prev => ({
            ...prev,
            backgroundImage: ''
        }));
    }

    const handleBgImageOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setWorkflowProps(prev => ({
            ...prev,
            backgroundOpacity: e.target.value
        }));
    }

    const syncBgImageOpacity = () => {
        setWorkflowProps(prev => ({
            ...prev,
            backgroundOpacity: bgImageOpacity
        }));
    }

    const backgroundImageSource = hasBackgroundImage(workflowProps) ? workflowProps.backgroundImage : '';

    return (
        <div className='stachesepl-workflow-settings'>

            <div>
                <label htmlFor='stachesepl-workflow-settings-width'>{__('WIDTH')}</label>
                <input id='stachesepl-workflow-settings-width' type='text' value={width} onChange={handleWidthChange} />
            </div>

            <div>
                <label htmlFor='stachesepl-workflow-settings-height'>{__('HEIGHT')}</label>
                <input id='stachesepl-workflow-settings-height' type='text' value={height} onChange={handleHeightChange} />
            </div>

            <div>
                <label htmlFor='stachesepl-workflow-settings-background-color'>{__('BACKGROUND_COLOR')}</label>
                <InputColor
                    value={backgroundColor}
                    onChange={handleBackgroundColorChange}
                />
            </div>

            <div>
                <label>{__('BACKGROUND_IMAGE')}</label>
                <div className='stachesepl-workflow-settings-background-image' onClick={handleBackgroundImageChange}>
                    {!!backgroundImageSource && <>
                        <div className="stachesepl-workflow-settings-background-image-remove" onClick={handleBackgroundImageClear}>
                            <Close />
                        </div>
                        <img src={backgroundImageSource} alt='' />
                    </>}

                    {!backgroundImageSource && (
                        <div className='stachesepl-workflow-settings-background-image-placeholder'>
                            <AddPhotoAlternate />
                            <span>{__('ADD_IMAGE')}</span>
                        </div>
                    )}
                </div>
            </div>

            <div>
                <label htmlFor='stachesepl-workflow-settings-background-opacity'>{__('BACKGROUND_OPACITY')}</label>
                <div className='stachesepl-workflow-settings-opacity-control'>
                    <input
                        type='range'
                        min={0}
                        max={1}
                        step={0.01}
                        value={bgImageOpacity}
                        onChange={(e) => {
                            setBgImageOpacity(e.target.value);
                        }}
                        onMouseUp={syncBgImageOpacity}
                        onTouchEnd={syncBgImageOpacity}
                        className='stachesepl-workflow-settings-opacity-slider'
                        style={{ '--opacity-value': `${parseFloat(bgImageOpacity) * 100}%` } as React.CSSProperties}
                    />
                    <input
                        id='stachesepl-workflow-settings-background-opacity'
                        type='number'
                        step={0.01}
                        min={0}
                        max={1}
                        value={bgImageOpacity}
                        onChange={(e) => {
                            setBgImageOpacity(e.target.value);
                        }}
                        onBlur={handleBgImageOpacityChange}
                        className='stachesepl-workflow-settings-opacity-number'
                    />
                </div>
            </div>
        </div>
    )
}

export default Settings