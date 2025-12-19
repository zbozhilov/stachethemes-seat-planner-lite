import { __ } from '@src/utils';
import './Move.scss';
import { BaseObjectProps } from '@src/admin/Product/SeatPlanner/components/Editor/components/Workflow/components/Objects/types';
import { useEditorObjects, useEditorRef } from '@src/admin/Product/SeatPlanner/components/Editor/hooks';

const Move = (props: {
    objects: BaseObjectProps[]
}) => {

    const editorRef = useEditorRef();
    const { setObjects } = useEditorObjects();
    const objectIds = props.objects.map(({ id }) => id);

    // Calculate bounds for all selected objects
    const smallestX = Math.min(...props.objects.map(({ move }) => move.x));
    const smallestY = Math.min(...props.objects.map(({ move }) => move.y));
    const biggestX = Math.max(...props.objects.map(({ move, size }) => move.x + size.width));
    const biggestY = Math.max(...props.objects.map(({ move, size }) => move.y + size.height));

    // Get the editor's bounding rectangle
    const editorRefRect = editorRef?.current
        ?.querySelector('.stachesepl-workflow')
        ?.getBoundingClientRect();

    const handleMoveXY = (value: string, direction: 'x' | 'y') => {

        const moveValue = parseInt(value, 10) || 0;
        const isDirectionX = direction === 'x';

        // Find the index of the object at the smallest X or Y
        const smallest = isDirectionX ? smallestX : smallestY;
        const objectIndex = props.objects.findIndex(({ move }) => move[direction] === smallest);

        // Determine the editor boundary for the given direction
        const editorBoundary = isDirectionX
            ? editorRefRect?.width || 0
            : editorRefRect?.height || 0;

        // Calculate the delta to move
        const objectXY = props.objects[objectIndex]?.move[direction] || 0;
        let delta = moveValue - objectXY;

        // Clamp the delta to stay within the editor boundary
        const biggest = isDirectionX ? biggestX : biggestY;
        if (biggest + delta > editorBoundary) {
            delta = editorBoundary - biggest;
        }

        // Update objects with the new position
        setObjects((prev) =>
            prev.map((object) => {
                if (!objectIds.includes(object.id)) return { ...object };

                return {
                    ...object,
                    move: {
                        ...object.move,
                        [direction]: object.move[direction] + delta,
                    },
                };
            })
        );
    };

    return (

        <div className='stachesepl-toolbar-properties-move'>

            <div>
                <label htmlFor='stachesepl-toolbar-properties-move-width'>{__('LEFT')}</label>
                <input id='stachesepl-toolbar-properties-move-width' type="text" placeholder="X" value={smallestX} onChange={(e) => {
                    handleMoveXY(e.target.value, 'x')
                }} />
            </div>

            <div>
                <label htmlFor='stachesepl-toolbar-properties-move-height'>{__('TOP')}</label>
                <input id='stachesepl-toolbar-properties-move-height' type="text" placeholder="Y" value={smallestY} onChange={(e) => {
                    handleMoveXY(e.target.value, 'y')
                }} />
            </div>

        </div>
    )
}

export default Move