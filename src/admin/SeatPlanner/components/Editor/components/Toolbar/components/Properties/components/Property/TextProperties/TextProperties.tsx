import { TextObjectProps } from "@src/admin/SeatPlanner/components/Editor/components/Workflow/components/Objects/Text/types"
import { __ } from "@src/utils"
import Color from "../features/Color/Color"
import FontSize from "../features/FontSize/FontSize"
import Header from "../features/Header/Header"
import Label from "../features/Label/Label"
import Move from "../features/Move/Move"
import Size from "../features/Size/Size"
import PropertiesContent from "../PropertiesContent/PropertiesContent"

const TextProperties = (props: {
    objects: TextObjectProps[]
}) => {
    return (
        <>
            <Header label={__('TEXT_PROPERTIES')} />
            <PropertiesContent>
                <Move objects={props.objects} />
                <Size objects={props.objects} />
                <Label objects={props.objects} />
                <FontSize objects={props.objects} />
                <Color objects={props.objects} />
            </PropertiesContent>
        </>
    )
}

export default TextProperties