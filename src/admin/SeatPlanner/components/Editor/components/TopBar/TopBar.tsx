import ExportDataButton from './components/ExportData/ExportDataButton';
import ImportDataButton from './components/ImportData/ImportDataButton';
import ThemeSwitchButton from './components/ThemeSwitchButton/ThemeSwitchButton';
import WorkflowCloseButton from './components/WorkflowClose/WorkflowCloseButton';
import WorkflowInfoButton from './components/WorkflowInfo/WorkflowInfoButton';
import WorkflowSettingsButton from './components/WorkflowSettings/WorkflowSettingsButton';
import './TopBar.scss';

const TopBar = (props: {
    onEditorClose: () => void;
}) => {

    return (
        <div className='stachesepl-top'>
            <WorkflowCloseButton onClick={props.onEditorClose} />
            <div className='stachesepl-top-right'>
                <ThemeSwitchButton />
                <div className='stachesepl-top-right-divider' />
                <ImportDataButton />
                <div className='stachesepl-top-right-divider' />
                <ExportDataButton />
                <div className='stachesepl-top-right-divider' />
                <WorkflowInfoButton />
                <div className='stachesepl-top-right-divider' />
                <WorkflowSettingsButton />
            </div>
        </div>
    )
}

export default TopBar