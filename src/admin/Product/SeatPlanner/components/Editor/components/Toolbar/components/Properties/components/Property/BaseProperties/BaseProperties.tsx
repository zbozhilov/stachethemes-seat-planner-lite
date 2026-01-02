import { BaseObjectProps } from "@src/admin/Product/SeatPlanner/components/Editor/components/Workflow/components/Objects/types"
import { __ } from "@src/utils"
import Color from "../features/Color/Color"
import Font from "../features/Font/Font"
import Header from "../features/Header/Header"
import Label from "../features/Label/Label"
import Move from "../features/Move/Move"
import Size from "../features/Size/Size"
import PropertiesContent from "../PropertiesContent/PropertiesContent"
import Zindex from "../features/Zindex/Zindex"
import InputWrap from "../../../../../../UI/InputWrap/InputWrap"
import ExtraClass from "../features/ExtraClass/ExtraClass"

const BaseProperties = (props: {
    objects: BaseObjectProps[]
}) => {
    return (
        <>
            <Header label={__('PROPERTIES')} />
            <PropertiesContent>
                <Move objects={props.objects} />
                <Size objects={props.objects} />
                <Zindex objects={props.objects} />
                <Label objects={props.objects} />
                <Font objects={props.objects} />
                <InputWrap>
                    <Color objects={props.objects} />
                </InputWrap>
                <ExtraClass objects={props.objects} />
            </PropertiesContent>
        </>
    )
}

export default BaseProperties