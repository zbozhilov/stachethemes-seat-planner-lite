import { BaseObjectProps } from '@src/admin/SeatPlanner/components/Editor/components/Workflow/components/Objects/types';
import BackgroundColor from '../BackgroundColor/BackgroundColor';
import Color from '../Color/Color';
import './Colors.scss';

type AcceptType = BaseObjectProps & { backgroundColor: string };

const Colors = (props: {
    objects: AcceptType[]
}) => {
    return (
        <div className='stsp-toolbar-properties-colors'>

            <Color objects={props.objects} />
            <BackgroundColor objects={props.objects} />

        </div>
    )
}

export default Colors