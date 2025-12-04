import { __ } from '@src/utils';
import './Round.scss';
import { SeatObjectProps } from "@src/admin/SeatPlanner/components/Editor/components/Workflow/components/Objects/Seat/types";
import { useEditorObjects } from '@src/admin/SeatPlanner/components/Editor/hooks';
import { GenericObjectProps } from '@src/admin/SeatPlanner/components/Editor/components/Workflow/components/Objects/Generic/types';

const Round = (props: {
    objects: SeatObjectProps[] | GenericObjectProps[]
}) => {

    const { setObjects } = useEditorObjects();
    const objectIds = props.objects.map(({ id }) => id);
    const areAllChecked = props.objects.every(object => object.rounded === true);
    const displayValue = areAllChecked;

    const handleValueChange = (value: boolean) => {

        setObjects(prev => {

            return prev.map(object => {

                if (!objectIds.includes(object.id)) return { ...object };

                return {
                    ...object,
                    rounded: value
                }
            })
        });
    }

    return (
        <div className='stachesepl-toolbar-properties-round'>
            <label htmlFor='stachesepl-toolbar-properties-round'>{__('ROUND_CORNERS')}</label>
            
            <button
                type="button"
                role="switch"
                id='stachesepl-toolbar-properties-round'
                aria-checked={displayValue}
                className={`stachesepl-toggle ${displayValue ? 'is-checked' : ''}`}
                onClick={() => handleValueChange(!displayValue)}
            >
                <span className="stachesepl-toggle-track">
                    <span className="stachesepl-toggle-thumb">
                        {displayValue && (
                            <svg 
                                className="stachesepl-toggle-icon" 
                                width="10" 
                                height="10" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="3"
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                            >
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                        )}
                    </span>
                </span>
            </button>
        </div>
    )
}

export default Round