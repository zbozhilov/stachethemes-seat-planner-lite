import { ScreenObjectProps } from "@src/admin/Product/SeatPlanner/components/Editor/components/Workflow/components/Objects/Screen/types"
import { __ } from "@src/utils"
import PropertiesContent from "../PropertiesContent/PropertiesContent"
import Colors from "../features/Colors/Colors"
import Font from "../features/Font/Font"
import Header from "../features/Header/Header"
import Label from "../features/Label/Label"
import Move from "../features/Move/Move"
import Size from "../features/Size/Size"
import Zindex from "../features/Zindex/Zindex"
import ExtraClass from "../features/ExtraClass/ExtraClass"
import Round from "../features/Round/Round"

const ScreenProperties = (props: {
    objects: ScreenObjectProps[]
}) => {
    return (
        <>
            <Header label={__('SCREEN_PROPERTIES')} />
            <PropertiesContent>
                <Move objects={props.objects} />
                <Size objects={props.objects} />
                <Zindex objects={props.objects} />
                <Round objects={props.objects} />
                <Label objects={props.objects} />
                <Font objects={props.objects} />
                <Colors objects={props.objects} />
                <ExtraClass objects={props.objects} />
            </PropertiesContent>
        </>
    )
}

export default ScreenProperties