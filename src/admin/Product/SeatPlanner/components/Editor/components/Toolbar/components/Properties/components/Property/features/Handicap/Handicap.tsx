import { __ } from '@src/utils';
import './Handicap.scss';
import { SeatObjectProps } from "@src/admin/Product/SeatPlanner/components/Editor/components/Workflow/components/Objects/Seat/types";
import { useEditorObjects } from '@src/admin/Product/SeatPlanner/components/Editor/hooks';

const Handicap = (props: {
    objects: SeatObjectProps[]
}) => {

    const { setObjects } = useEditorObjects();
    const objectIds = props.objects.map(({ id }) => id);
    const areAllChecked = props.objects.every(object => object.isHandicap === true);
    const displayValue = areAllChecked;

    const handleValueChange = (value: boolean) => {

        setObjects(prev => {

            return prev.map(object => {

                if (!objectIds.includes(object.id)) return { ...object };

                return {
                    ...object,
                    isHandicap: value
                }
            })
        });
    }

    return (
        <div className='stachesepl-toolbar-properties-handicap'>
            <label htmlFor='stachesepl-toolbar-properties-handicap'>{__('HANDICAP_SEAT')}</label>
            
            <button
                type="button"
                role="switch"
                id='stachesepl-toolbar-properties-handicap'
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

export default Handicap