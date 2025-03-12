import { __ } from '@src/utils';
import './SelectedCount.scss';
import { useSelectObjects } from '@src/admin/SeatPlanner/components/Editor/hooks';
const SelectedCount = () => {

    const { selectedObjects } = useSelectObjects();

    const selectedCount = selectedObjects.length;

    return (
        <div className='stsp-tooltip-properties-selectedcount'>
            {__('SELECTED_ITEMS')}: {selectedCount}
        </div>
    )
}

export default SelectedCount