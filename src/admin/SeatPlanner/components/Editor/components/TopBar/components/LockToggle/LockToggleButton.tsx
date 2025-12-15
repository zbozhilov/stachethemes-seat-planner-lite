import { Lock, LockOpen } from '@mui/icons-material'
import { useEditorObjects, useSelectObjects } from '@src/admin/SeatPlanner/components/Editor/hooks';
import { __ } from "@src/utils";

const LockToggleButton = () => {

    const { selectedObjects } = useSelectObjects();
    const { objects, setObjects } = useEditorObjects();

    const hasSelection = selectedObjects.length > 0;

    // Check if all selected objects are locked
    const selectedObjectsData = objects.filter(obj => selectedObjects.includes(obj.id));
    const allLocked = selectedObjectsData.length > 0 && selectedObjectsData.every(obj => obj.locked);
    const someLocked = selectedObjectsData.some(obj => obj.locked);

    const handleToggleLock = () => {
        if (!hasSelection) return;

        // If all are locked, unlock all. Otherwise, lock all.
        const newLockedState = !allLocked;

        setObjects(prevObjects => 
            prevObjects.map(obj => {
                if (selectedObjects.includes(obj.id)) {
                    return { ...obj, locked: newLockedState };
                }
                return obj;
            })
        );
    }

    const Icon = allLocked ? Lock : LockOpen;
    const title = allLocked ? __('UNLOCK_SELECTED') : __('LOCK_SELECTED');

    const classNames = [
        'stachesepl-top-button',
        !hasSelection && 'disabled',
        someLocked && !allLocked && 'partial',
    ].filter(Boolean).join(' ');

    return (
        <div 
            className={classNames} 
            title={hasSelection ? title : __('NO_SELECTION')}
            onClick={handleToggleLock}
        >
            <Icon />
        </div>
    )
}

export default LockToggleButton

