import { GenericObjectProps } from "@src/admin/Product/SeatPlanner/components/Editor/components/Workflow/components/Objects/Generic/types";
import { TextObjectProps } from "@src/admin/Product/SeatPlanner/components/Editor/components/Workflow/components/Objects/Text/types";
import { TextDirection as TextDirectionType } from "@src/admin/Product/SeatPlanner/components/Editor/components/Workflow/components/Objects/types";
import { useEditorObjects } from "@src/admin/Product/SeatPlanner/components/Editor/hooks";
import { __ } from '@src/utils';
import InputWrap from "../../../../../../../UI/InputWrap/InputWrap";
import Select from "../../../../../../../UI/Select/Select";

interface TextDirectionOption {
    value: TextDirectionType;
    label: string;
}

const TextDirection = (props: {
    objects: TextObjectProps[] | GenericObjectProps[]
}) => {

    const { setObjects } = useEditorObjects();
    const objectIds = props.objects.map(({ id }) => id);
    const [firstObject] = props.objects;
    const textDirection = firstObject.textDirection || 'horizontal';
    const areSameDirection = props.objects.every(object => (object.textDirection || 'horizontal') === textDirection);
    const displayValue = areSameDirection ? textDirection : 'horizontal';

    const options: TextDirectionOption[] = [
        { value: 'horizontal', label: __('TEXT_DIR_HORIZONTAL') },
        { value: 'vertical-upright', label: __('TEXT_DIR_VERTICAL_UPRIGHT') },
        { value: 'rotated-cw', label: __('TEXT_DIR_ROTATED_CW') },
    ];

    const handleDirectionChange = (value: TextDirectionType) => {
        setObjects(prev => {
            return prev.map(object => {
                if (!objectIds.includes(object.id)) return { ...object };
                return {
                    ...object,
                    textDirection: value
                }
            })
        });
    }

    return (

        <InputWrap>
            <Select 
                id='stachesepl-toolbar-properties-textdirection'
                label={__('TEXT_DIRECTION')}
                options={options}
                value={displayValue}
                onChange={(value) => handleDirectionChange(value as TextDirectionType)}
            />
        </InputWrap>
    )
}

export default TextDirection

