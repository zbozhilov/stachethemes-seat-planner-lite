import { GenericObjectProps } from "@src/admin/Product/SeatPlanner/components/Editor/components/Workflow/components/Objects/Generic/types"
import { __ } from "@src/utils"
import Colors from "../features/Colors/Colors"
import Font from "../features/Font/Font"
import Header from "../features/Header/Header"
import Label from "../features/Label/Label"
import Move from "../features/Move/Move"
import Round from "../features/Round/Round"
import Size from "../features/Size/Size"
import TextDirection from "../features/TextDirection/TextDirection"
import Zindex from "../features/Zindex/Zindex"
import PropertiesContent from "../PropertiesContent/PropertiesContent"
import ExtraClass from "../features/ExtraClass/ExtraClass"

const GenericProperties = (props: {
    objects: GenericObjectProps[]
}) => {
    return (
        <>
            <Header label={__('GENERIC_PROPERTIES')} />
            <PropertiesContent>
                <Move objects={props.objects} />
                <Size objects={props.objects} />
                <Zindex objects={props.objects} />
                <Round objects={props.objects} />
                <Label objects={props.objects} />
                <Font objects={props.objects} />
                <TextDirection objects={props.objects} />
                <Colors objects={props.objects} />
                <ExtraClass objects={props.objects} />
            </PropertiesContent>
        </>
    )
}

export default GenericProperties