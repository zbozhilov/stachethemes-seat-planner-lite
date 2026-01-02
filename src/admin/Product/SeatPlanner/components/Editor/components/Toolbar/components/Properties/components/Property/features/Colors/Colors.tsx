import { BaseObjectProps } from '@src/admin/Product/SeatPlanner/components/Editor/components/Workflow/components/Objects/types';
import BackgroundColor from '../BackgroundColor/BackgroundColor';
import Color from '../Color/Color';
import InputWrap from '../../../../../../../UI/InputWrap/InputWrap';

type AcceptType = BaseObjectProps & { backgroundColor: string };

const Colors = (props: {
    objects: AcceptType[]
}) => {
    return (
        <InputWrap>
            <Color objects={props.objects} />
            <BackgroundColor objects={props.objects} />
        </InputWrap>
    )
}

export default Colors