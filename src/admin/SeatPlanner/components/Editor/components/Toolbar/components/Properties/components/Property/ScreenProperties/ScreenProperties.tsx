import { __ } from "@src/utils"
import Colors from "../features/Colors/Colors"
import FontSize from "../features/FontSize/FontSize"
import Header from "../features/Header/Header"
import Label from "../features/Label/Label"
import Move from "../features/Move/Move"
import Size from "../features/Size/Size"
import { ScreenObjectProps } from "@src/admin/SeatPlanner/components/Editor/components/Workflow/components/Objects/Screen/types"
import PropertiesContent from "../PropertiesContent/PropertiesContent"
import Zindex from "../features/Zindex/Zindex"

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
                <Label objects={props.objects} />
                <FontSize objects={props.objects} />
                <Colors objects={props.objects} />
            </PropertiesContent>
        </>
    )
}

export default ScreenProperties