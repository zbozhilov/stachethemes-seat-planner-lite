import { __ } from "@src/utils"
import Colors from "../features/Colors/Colors"
import Header from "../features/Header/Header"
import Label from "../features/Label/Label"
import Move from "../features/Move/Move"
import Size from "../features/Size/Size"
import { GenericObjectProps } from "@src/admin/SeatPlanner/components/Editor/components/Workflow/components/Objects/Generic/types"
import FontSize from "../features/FontSize/FontSize"
import Round from "../features/Round/Round"
import PropertiesContent from "../PropertiesContent/PropertiesContent"

const GenericProperties = (props: {
    objects: GenericObjectProps[]
}) => {
    return (
        <>
            <Header label={__('GENERIC_PROPERTIES')} />
            <PropertiesContent>
                <Move objects={props.objects} />
                <Size objects={props.objects} />
                <Round objects={props.objects} />
                <Label objects={props.objects} />
                <FontSize objects={props.objects} />
                <Colors objects={props.objects} />
            </PropertiesContent>
        </>
    )
}

export default GenericProperties