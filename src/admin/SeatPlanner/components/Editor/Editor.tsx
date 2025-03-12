import { useEffect, useRef } from 'react';
import ScreenTooSmall from './components/ScreenTooSmall/ScreenTooSmall';
import Toolbar from './components/Toolbar/Toolbar';
import TopBar from './components/TopBar/TopBar';
import Workflow from './components/Workflow/Workflow';
import EditorProvider from './context/EditorProvider';
import './Editor.scss';
import { useEditorObjects, useWorkflowProps } from './hooks';

const EditorContent = (props: {
    onClose: () => void;
}) => {

    const inputData = document.getElementById('st-seat-planner-editor-data') as HTMLInputElement;
    const { workflowProps, setWorkflowProps } = useWorkflowProps();
    const { objects, setObjects } = useEditorObjects();
    const loaded = useRef(false);

    const storeDataToInput = () => {
        const storeData = {
            workflowProps: workflowProps,
            objects: objects
        }

        inputData.value = JSON.stringify(storeData);
    }

    const handleClose = () => {

        storeDataToInput();

        props.onClose();
    }

    useEffect(() => {

        if (loaded.current) {
            return;
        }

        const inputData = document.getElementById('st-seat-planner-editor-data') as HTMLInputElement;

        if (inputData.value) {

            const data = JSON.parse(inputData.value);

            // determine whether the data is valid
            if (!data || !data.workflowProps || !data.objects || !Array.isArray(data.objects)) {
                return;
            }

            setWorkflowProps(prev => {
                return {
                    ...prev,
                    ...data.workflowProps
                }
            });
            setObjects(prev => {
                return [
                    ...prev,
                    ...data.objects
                ]
            });

            loaded.current = true;
        }

    }, [setObjects, setWorkflowProps]);

    return (
        <>

            <TopBar onEditorClose={handleClose} />

            <div className='stsp-editor-workspace'>
                <Toolbar />
                <Workflow />
            </div>

            <ScreenTooSmall />
        </>
    )

}

const Editor = (props: {
    onClose: () => void;
}) => {

    const editorRef = useRef<HTMLDivElement>(null);

    return (
        <div className='stsp-editor' ref={editorRef}>

            <EditorProvider editorRef={editorRef}>
                <EditorContent onClose={props.onClose} />
            </EditorProvider>
        </div>
    )
}

export default Editor;