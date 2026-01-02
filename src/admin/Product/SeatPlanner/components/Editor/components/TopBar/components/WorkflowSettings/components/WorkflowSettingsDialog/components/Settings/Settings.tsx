import { useWorkflowProps } from "@src/admin/Product/SeatPlanner/components/Editor/hooks";
import { __ } from "@src/utils";
import './Settings.scss';
import { hasBackgroundImage } from "./utils";
// @todo own color component?
import InputColor from "@src/admin/Product/SeatPlanner/components/Editor/components/UI/InputColor/InputColor";
import InputText from "@src/admin/Product/SeatPlanner/components/Editor/components/UI/InputText/InputText";
import AddImage from "@src/admin/Product/SeatPlanner/components/Editor/components/UI/AddImage/AddImage";
import Slider from "@src/admin/Product/SeatPlanner/components/Editor/components/UI/Slider/Slider";

const Settings = () => {

    const { workflowProps, setWorkflowProps } = useWorkflowProps();
    const { width, height, backgroundColor, backgroundOpacity = '1' } = workflowProps;

    const handleWidthChange = (value: string | number) => {
        setWorkflowProps(prev => ({
            ...prev,
            width: parseInt(value as string, 10) || 0
        }))
    }

    const handleHeightChange = (value: string | number) => {
        setWorkflowProps(prev => ({
            ...prev,
            height: parseInt(value as string, 10) || 0
        }))
    }

    const handleBackgroundColorChange = (color: string) => {
        setWorkflowProps(prev => ({
            ...prev,
            backgroundColor: color
        }))
    }

    const handleBackgroundImageChange = (imageUrl: string) => {
        setWorkflowProps(prev => ({
            ...prev,
            backgroundImage: imageUrl
        }));
    }

    const handleBackgroundImageClear = () => {
        setWorkflowProps(prev => ({
            ...prev,
            backgroundImage: ''
        }));
    }

    const handleBgImageOpacityChange = (value: string | number) => {
        setWorkflowProps(prev => ({
            ...prev,
            backgroundOpacity: String(value)
        }));
    }

    const backgroundImageSource = hasBackgroundImage(workflowProps) ? workflowProps.backgroundImage : '';

    return (
        <div className='stachesepl-workflow-settings'>

            <div>
                <label htmlFor='stachesepl-workflow-settings-width'>{__('WIDTH')}</label>
                <InputText id='stachesepl-workflow-settings-width' value={width} onChange={handleWidthChange} />
            </div>

            <div>
                <label htmlFor='stachesepl-workflow-settings-height'>{__('HEIGHT')}</label>
                <InputText id='stachesepl-workflow-settings-height' value={height} onChange={handleHeightChange} />
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
                <AddImage
                    value={backgroundImageSource}
                    onChange={handleBackgroundImageChange}
                    onClear={handleBackgroundImageClear}
                />
            </div>

            <div>
                <label htmlFor='stachesepl-workflow-settings-background-opacity'>{__('BACKGROUND_OPACITY')}</label>
                <Slider
                    id='stachesepl-workflow-settings-background-opacity'
                    value={backgroundOpacity}
                    min={0}
                    max={1}
                    step={0.01}
                    onChange={handleBgImageOpacityChange}
                    onCommit={handleBgImageOpacityChange}
                />
            </div>
        </div>
    )
}

export default Settings