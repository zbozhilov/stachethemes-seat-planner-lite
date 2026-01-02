import { AddPhotoAlternate, Close } from '@mui/icons-material';
import { mediaFrame } from '@src/admin/Product/SeatPlanner/components/Editor/components/TopBar/components/WorkflowSettings/components/WorkflowSettingsDialog/components/Settings/utils';
import { __ } from '@src/utils';
import React from 'react';
import './AddImage.scss';

export interface AddImageProps {
    value?: string;
    onChange: (imageUrl: string) => void;
    onClear?: () => void;
    width?: number | string;
    height?: number | string;
    placeholderText?: string;
    buttonText?: string;
    title?: string;
    className?: string;
}

const AddImage: React.FC<AddImageProps> = ({
    value,
    onChange,
    onClear,
    width = 120,
    height = 90,
    placeholderText,
    buttonText,
    title,
    className = ''
}) => {

    const handleImageChange = async () => {
        const images = await mediaFrame({
            libraryType: 'image',
            multiple: true,
            buttonText: buttonText || __('ADD_SELECTED_IMAGE'),
            title: title || __('SELECT_BACKGROUND_IMAGE'),
        });

        if (!images?.length) {
            return;
        }

        const imageUrl = images[0].sizes.full.url;
        onChange(imageUrl);
    }

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onClear) {
            onClear();
        } else {
            onChange('');
        }
    }

    return (
        <div 
            className={`stachesepl-add-image ${className}`}
            style={{ width, height }}
            onClick={handleImageChange}
        >
            {!!value && (
                <>
                    <div className="stachesepl-add-image-remove" onClick={handleClear}>
                        <Close />
                    </div>
                    <img src={value} alt='' />
                </>
            )}

            {!value && (
                <div className='stachesepl-add-image-placeholder'>
                    <AddPhotoAlternate />
                    <span>{placeholderText || __('ADD_IMAGE')}</span>
                </div>
            )}
        </div>
    );
}

export default AddImage;
