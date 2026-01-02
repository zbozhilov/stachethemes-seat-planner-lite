import { BaseObjectProps } from "@src/admin/Product/SeatPlanner/components/Editor/components/Workflow/components/Objects/types";
import InputWrap from "../../../../../../../UI/InputWrap/InputWrap";
import FontSize from "../FontSize/FontSize";
import FontWeight from "../FontWeight/FontWeight";

const Font = (props: {
    objects: BaseObjectProps[]
}) => {

    return (

        <InputWrap>
            <FontSize objects={props.objects} />
            <FontWeight objects={props.objects} />
        </InputWrap>

    )
}

export default Font