import { BaseObjectProps } from '@src/admin/Product/SeatPlanner/components/Editor/components/Workflow/components/Objects/types';
import { useEditorObjects } from "@src/admin/Product/SeatPlanner/components/Editor/hooks";
import { __ } from '@src/utils';
import { getHasValidPattern, getIncrementValueByRegex } from '../utils';
import './Label.scss';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { AutoAwesome } from '@mui/icons-material';
import PatternBuilder from '../PatternBuilder/PatternBuilder';

const Label = (props: {
    objects: BaseObjectProps[]
}) => {

    const [showPatternBuilder, setShowPatternBuilder] = useState(false);
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

    const handlePatternApply = (pattern: string) => {
        handleValueChange(pattern);
    };

    const showPatternBuilderButton = props.objects.length > 1;

    return (

        <div className='stachesepl-toolbar-properties-label'>

            <label htmlFor='stachesepl-toolbar-properties-label'>{__('LABEL')}</label>
            <input id='stachesepl-toolbar-properties-label' type="text" placeholder={__('LABEL')} value={displayLabel} onChange={(e) => {
                handleValueChange(e.target.value)
            }} />

            {showPatternBuilderButton && (
                <div className='stachesepl-pattern-builder-wrapper'>
                    <button
                        className='stachesepl-pattern-builder-trigger'
                        onClick={() => setShowPatternBuilder(true)}
                    >
                        <AutoAwesome sx={{ fontSize: 16 }} />
                        {__('AUTO_INCREMENT')}
                    </button>

                    {showPatternBuilder && (
                        <PatternBuilder
                            onApply={handlePatternApply}
                            onClose={() => setShowPatternBuilder(false)}
                            numItems={props.objects.length}
                        />
                    )}
                </div>
            )}

        </div>
    )
}

export default Label