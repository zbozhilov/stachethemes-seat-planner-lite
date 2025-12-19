import { BaseObjectProps } from "@src/admin/Product/SeatPlanner/components/Editor/components/Workflow/components/Objects/types";
import { useEditorObjects } from "@src/admin/Product/SeatPlanner/components/Editor/hooks";
import { __ } from '@src/utils';
import InputColor from "../InputColor/InputColor";
import './BackgroundColor.scss';

type AcceptType = BaseObjectProps & { backgroundColor: string };

const BackgroundColor = (props: {
    objects: AcceptType[]
}) => {

    const { setObjects } = useEditorObjects();
    const objectIds = props.objects.map(({ id }) => id);
    const [firstObject] = props.objects;
    const { backgroundColor } = firstObject;
    const areSameBGColor = props.objects.every(object => object.backgroundColor === backgroundColor);
    const displayValue = areSameBGColor ? backgroundColor : '';

    const handleColorChange = (color: string) => {

        if (color === displayValue) {
            return;
        }

        setObjects(prev => {

            return prev.map(object => {

                if (!objectIds.includes(object.id)) return { ...object };

                return {
                    ...object,
                    backgroundColor: color
                }
            })
        });
    }

    return (

        <div className='stachesepl-toolbar-properties-bgcolor'>

            <label htmlFor='stachesepl-toolbar-properties-bgcolor'>{__('BACKGROUND_COLOR')}</label>

            <InputColor
                value={displayValue}
                onChange={handleColorChange}
            />

            {/* <input
                id='stachesepl-toolbar-properties-bgcolor'
                type="color"
                placeholder={__('BACKGROUND_COLOR')}
                value={displayValue}
                onChange={(e) => {
                    setUpdateBGColor(e.target.value)
                }}

                onBlur={handleLabelChange}
            /> */}

        </div>
    )
}

export default BackgroundColor