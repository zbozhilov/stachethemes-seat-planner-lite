import { useSelectObjects } from '@src/admin/SeatPlanner/components/Editor/hooks';
import Properties from './components/Properties/Properties';
import ToolItems from './components/ToolItems/ToolItems';
import './Toolbar.scss';

const Toolbar = () => {

    const { selectedObjects } = useSelectObjects();
    const hasSelectedObjects = selectedObjects.length > 0;
    const DisplaySection = hasSelectedObjects ? Properties : ToolItems;

    return (
        <div className='stsp-toolbar'>
            <DisplaySection />
        </div>
    )
}

export default Toolbar