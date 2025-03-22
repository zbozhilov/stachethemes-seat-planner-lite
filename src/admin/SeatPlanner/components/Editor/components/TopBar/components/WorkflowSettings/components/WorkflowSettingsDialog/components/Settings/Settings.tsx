import { useWorkflowProps } from "@src/admin/SeatPlanner/components/Editor/hooks";
import { __ } from "@src/utils";
import React, { useState } from "react";
import './Settings.scss';
import { hasBackgroundImage, mediaFrame } from "./utils";
import { Close } from '@mui/icons-material';


const Settings = () => {

    const { workflowProps, setWorkflowProps } = useWorkflowProps();
    const { width, height, backgroundColor, backgroundOpacity = '1' } = workflowProps;
    const [bgColor, setBgColor] = useState(backgroundColor);
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

    const handleBackgroundColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setWorkflowProps(prev => ({
            ...prev,
            backgroundColor: e.target.value
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

    const backgroundImageSource = hasBackgroundImage(workflowProps) ? workflowProps.backgroundImage : '';

    return (
        <div className='stachesepl-workflow-settings'>

            <div>
                <label htmlFor='stachesepl-workflow-settings-width'>{__('WIDTH')}</label>
                <input id='stachesepl-workflow-settings-width' type='text' value={width} onChange={handleWidthChange} />
            </div>

            <div>
                <label htmlFor='stachesepl-workflow-settings-height'>{__('HEIGHT')}</label>
                <input id='stachesepl-workflow-settings-heught' type='text' value={height} onChange={handleHeightChange} />
            </div>

            <div>
                <label htmlFor='stachesepl-workflow-settings-background-color'>{__('BACKGROUND_COLOR')}</label>
                <input
                    id='stachesepl-workflow-settings-background-color'
                    type='color'
                    value={bgColor}
                    onChange={(e) => {
                        setBgColor(e.target.value);
                    }}
                    onBlur={handleBackgroundColorChange}
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

                    {!backgroundImageSource && <div className='stachesepl-workflow-settings-background-image-placeholder'>{__('ADD_IMAGE')}</div>}
                </div>
            </div>

            <div>
                <label htmlFor='stachesepl-workflow-settings-background-opacity'>{__('BACKGROUND_OPACITY')}</label>
                <input
                    id='stachesepl-workflow-settings-background-opacity'
                    type='number'
                    step={0.1}
                    min={0}
                    max={1}
                    value={bgImageOpacity}
                    onChange={(e) => {
                        setBgImageOpacity(e.target.value);
                    }}
                    onBlur={handleBgImageOpacityChange}
                />
            </div>
        </div>
    )
}

export default Settings