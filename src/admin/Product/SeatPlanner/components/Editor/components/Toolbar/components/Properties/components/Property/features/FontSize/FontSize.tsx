import { BaseObjectProps } from "@src/admin/Product/SeatPlanner/components/Editor/components/Workflow/components/Objects/types";
import { useEditorObjects } from "@src/admin/Product/SeatPlanner/components/Editor/hooks";
import { __ } from '@src/utils';
import Select, { SelectOption } from "../../../../../../../UI/Select/Select";

type FontSizeValue = 'small' | 'medium' | 'large';

const FontSize = (props: {
    objects: BaseObjectProps[]
}) => {

    const { setObjects } = useEditorObjects();
    const objectIds = props.objects.map(({ id }) => id);
    const [firstObject] = props.objects;
    const { fontSize } = firstObject;
    const areSameSize = props.objects.every(object => object.fontSize === fontSize);
    const displayValue = areSameSize ? fontSize : '';

    const options: SelectOption[] = [
        { value: 'small', label: __('FONT_SIZE_SMALL') },
        { value: 'medium', label: __('FONT_SIZE_MEDIUM') },
        { value: 'large', label: __('FONT_SIZE_LARGE') },
    ];

    const handleChange = (value: FontSizeValue) => {
        setObjects(prev => {
            return prev.map(object => {
                if (!objectIds.includes(object.id)) return { ...object };
                return {
                    ...object,
                    fontSize: value
                }
            })
        });
    }

    return (

        <Select
            id='stachesepl-toolbar-properties-fontsize'
            label={__('FONT_SIZE')}
            options={options}
            value={displayValue}
            onChange={(value) => handleChange(value as FontSizeValue)}
        />


    )
}

export default FontSize