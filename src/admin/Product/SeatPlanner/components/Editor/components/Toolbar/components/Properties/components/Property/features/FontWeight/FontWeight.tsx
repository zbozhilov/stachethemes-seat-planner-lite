import { BaseObjectProps } from "@src/admin/Product/SeatPlanner/components/Editor/components/Workflow/components/Objects/types";
import { useEditorObjects } from "@src/admin/Product/SeatPlanner/components/Editor/hooks";
import { __ } from '@src/utils';
import Select, { SelectOption } from "../../../../../../../UI/Select/Select";

type FontWeightValue = 'lighter' | 'normal' | 'bold' | 'bolder';

const FontWeight = (props: {
    objects: BaseObjectProps[]
}) => {

    const { setObjects } = useEditorObjects();
    const objectIds = props.objects.map(({ id }) => id);
    const [firstObject] = props.objects;
    const { fontWeight } = firstObject;
    const areSameWeight = props.objects.every(object => object.fontWeight === fontWeight);
    const displayValue = areSameWeight ? (fontWeight || 'normal') : '';

    const options: SelectOption[] = [
        { value: 'lighter', label: __('FONT_WEIGHT_LIGHTER') },
        { value: 'normal', label: __('FONT_WEIGHT_NORMAL') },
        { value: 'bold', label: __('FONT_WEIGHT_BOLD') },
        { value: 'bolder', label: __('FONT_WEIGHT_BOLDER') },
    ];

    const handleChange = (value: FontWeightValue) => {
        setObjects(prev => {
            return prev.map(object => {
                if (!objectIds.includes(object.id)) return { ...object };
                return {
                    ...object,
                    fontWeight: value
                }
            })
        });
    }

    return (

        <Select
            id='stachesepl-toolbar-properties-fontsize'
            label={__('FONT_WEIGHT')}
            options={options}
            value={displayValue}
            onChange={(value) => handleChange(value as FontWeightValue)}
        />

    )
}

export default FontWeight