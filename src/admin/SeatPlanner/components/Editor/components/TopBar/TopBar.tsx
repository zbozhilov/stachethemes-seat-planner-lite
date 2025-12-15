import ExportDataButton from './components/ExportData/ExportDataButton';
import ImportDataButton from './components/ImportData/ImportDataButton';
import LockToggleButton from './components/LockToggle/LockToggleButton';
import GridToggleButton from './components/GridToggle/GridToggleButton';
import GridSizeDecreaseButton from './components/GridSizeDecrease/GridSizeDecreaseButton';
import GridSizeIncreaseButton from './components/GridSizeIncrease/GridSizeIncreaseButton';
import GridContrastButton from './components/GridContrast/GridContrastButton';
import GridColorButton from './components/GridColor/GridColorButton';
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
            <div className='stachesepl-top-center'>
                <LockToggleButton />
                <div className='stachesepl-top-divider' />
                <GridToggleButton />
                <div className='stachesepl-top-divider' />
                <GridSizeDecreaseButton />
                <div className='stachesepl-top-divider' />
                <GridSizeIncreaseButton />
                <div className='stachesepl-top-divider' />
                <GridContrastButton />
                <div className='stachesepl-top-divider' />
                <GridColorButton />
            </div>
            <div className='stachesepl-top-right'>
                <ThemeSwitchButton />
                <div className='stachesepl-top-divider' />
                <ImportDataButton />
                <div className='stachesepl-top-divider' />
                <ExportDataButton />
                <div className='stachesepl-top-divider' />
                <WorkflowInfoButton />
                <div className='stachesepl-top-divider' />
                <WorkflowSettingsButton />
            </div>
        </div>
    )
}

export default TopBar