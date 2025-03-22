import { BaseObjectProps } from '@src/admin/SeatPlanner/components/Editor/components/Workflow/components/Objects/types';
import { useEditorObjects } from "@src/admin/SeatPlanner/components/Editor/hooks";
import { __ } from '@src/utils';
import { getHasValidPattern, getIncrementValueByRegex } from '../utils';
import './Label.scss';
import toast from 'react-hot-toast';

const Label = (props: {
    objects: BaseObjectProps[]
}) => {

    const { setObjects } = useEditorObjects();
    const objectIds = props.objects.map(({ id }) => id);
    const [firstObject] = props.objects;
    const { label } = firstObject;
    const areSameLabel = props.objects.every(object => object.label === label);
    const displayLabel = areSameLabel ? label : '';

    const handleValueChange = (value: string) => {

        const foundPattern = getHasValidPattern(value);

        setObjects(prev =>

            prev.map((object) => {

                if (!objectIds.includes(object.id)) {
                    return { ...object };
                }

                const objectIndex = objectIds.indexOf(object.id);

                let theValue = getIncrementValueByRegex(value, objectIndex);

                return {
                    ...object,
                    label: theValue
                };
            })
        );

        if (foundPattern) {
            toast.success(__('PATTERN_APPLIED'));   
        }
    }

    return (

        <div className='stachesepl-toolbar-properties-label'>

            <label htmlFor='stachesepl-toolbar-properties-label'>{__('LABEL')}</label>
            <input id='stachesepl-toolbar-properties-label' type="text" placeholder={__('LABEL')} value={displayLabel} onChange={(e) => {
                handleValueChange(e.target.value)
            }} />

        </div>
    )
}

export default Label