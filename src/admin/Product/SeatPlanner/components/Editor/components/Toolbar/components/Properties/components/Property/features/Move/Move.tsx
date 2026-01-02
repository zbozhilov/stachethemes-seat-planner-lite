import { BaseObjectProps } from '@src/admin/Product/SeatPlanner/components/Editor/components/Workflow/components/Objects/types';
import { useEditorObjects, useEditorRef } from '@src/admin/Product/SeatPlanner/components/Editor/hooks';
import { __ } from '@src/utils';
import InputText from '../../../../../../../UI/InputText/InputText';
import InputWrap from '../../../../../../../UI/InputWrap/InputWrap';

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

        <InputWrap>

            <InputText
                id='stachesepl-toolbar-properties-move-width'
                label={__('LEFT')}
                labelFor='stachesepl-toolbar-properties-move-width'
                value={smallestX}
                onChange={(value) => {
                    handleMoveXY(value.toString(), 'x')
                }}
            />

            <InputText
                id='stachesepl-toolbar-properties-move-height'
                label={__('TOP')}
                labelFor='stachesepl-toolbar-properties-move-height'
                value={smallestY}
                onChange={(value) => {
                    handleMoveXY(value.toString(), 'y')
                }}
            />

        </InputWrap>

    )
}

export default Move