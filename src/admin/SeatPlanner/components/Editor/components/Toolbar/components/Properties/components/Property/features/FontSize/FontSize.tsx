import { BaseObjectProps } from "@src/admin/SeatPlanner/components/Editor/components/Workflow/components/Objects/types";
import { useEditorObjects } from "@src/admin/SeatPlanner/components/Editor/hooks";
import { __ } from '@src/utils';
import './FontSize.scss';

const FontSize = (props: {
    objects: BaseObjectProps[]
}) => {

    const { setObjects } = useEditorObjects();
    const objectIds = props.objects.map(({ id }) => id);
    const [firstObject] = props.objects;
    const { fontSize } = firstObject;
    const areSameSize = props.objects.every(object => object.fontSize === fontSize);
    const displayValue = areSameSize ? fontSize : '';

    const handleLabelChange = (value: 'small' | 'medium' | 'large') => {
        
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

        <div className='stsp-toolbar-properties-fontsize'>

            <label htmlFor='stsp-toolbar-properties-fontsize'>{__('FONT_SIZE')}</label>

            <select id='stsp-toolbar-properties-fontsize' value={displayValue} onChange={e => {
                handleLabelChange(e.target.value as 'small' | 'medium' | 'large')
            }}>
                <option value='' disabled>{__('SELECT_FONT_SIZE')}</option>
                <option value='small' onClick={() => handleLabelChange('small')}>{__('FONT_SIZE_SMALL')}</option>
                <option value='medium' onClick={() => handleLabelChange('medium')}>{__('FONT_SIZE_MEDIUM')}</option>
                <option value='large' onClick={() => handleLabelChange('large')}>{__('FONT_SIZE_LARGE')}</option>
            </select>

        </div>
    )
}

export default FontSize