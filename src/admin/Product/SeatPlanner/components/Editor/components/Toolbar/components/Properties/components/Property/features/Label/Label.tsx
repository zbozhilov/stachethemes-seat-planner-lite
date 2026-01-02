import { AutoAwesome } from '@mui/icons-material';
import { BaseObjectProps } from '@src/admin/Product/SeatPlanner/components/Editor/components/Workflow/components/Objects/types';
import { useEditorObjects } from "@src/admin/Product/SeatPlanner/components/Editor/hooks";
import { __ } from '@src/utils';
import { useState } from 'react';
import toast from 'react-hot-toast';
import InputText from '../../../../../../../UI/InputText/InputText';
import InputWrap from '../../../../../../../UI/InputWrap/InputWrap';
import PatternBuilder from '../PatternBuilder/PatternBuilder';
import { getHasValidPattern, getIncrementValueByRegex } from '../utils';

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

        <InputWrap flexDirection='column'>

            <InputText
                id='stachesepl-toolbar-properties-label'
                label={__('LABEL')}
                labelFor='stachesepl-toolbar-properties-label'
                placeholder={__('LABEL')}
                value={displayLabel}
                onChange={(value) => {
                    handleValueChange(value.toString());
                }}
            />

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

        </InputWrap>
    )
}

export default Label