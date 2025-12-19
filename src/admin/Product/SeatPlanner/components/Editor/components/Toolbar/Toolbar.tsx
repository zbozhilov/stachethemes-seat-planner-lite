import { useSelectObjects } from '@src/admin/Product/SeatPlanner/components/Editor/hooks';
import ToolItems from './components/ToolItems/ToolItems';
import Properties from './components/Properties/Properties';
import './Toolbar.scss';

const Toolbar = () => {

    const { selectedObjects } = useSelectObjects();
    const hasSelectedObjects = selectedObjects.length > 0;
    const DisplaySection = hasSelectedObjects ? Properties : ToolItems;

    return (
        <div className='stachesepl-toolbar'>
            <DisplaySection />
        </div>
    )
}

export default Toolbar