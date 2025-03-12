import { SeatObjectProps } from "@src/admin/SeatPlanner/components/Editor/components/Workflow/components/Objects/Seat/types"
import { __ } from "@src/utils"
import Colors from "../features/Colors/Colors"
import FontSize from "../features/FontSize/FontSize"
import Handicap from "../features/Handicap/Handicap"
import Header from "../features/Header/Header"
import Label from "../features/Label/Label"
import Move from "../features/Move/Move"
import Price from "../features/Price/Price"
import SeatId from "../features/SeatId/SeatId"
import Size from "../features/Size/Size"
import Round from "../features/Round/Round"
import PropertiesContent from "../PropertiesContent/PropertiesContent"


const SeatProperties = (props: {
    objects: SeatObjectProps[]
}) => {
    return (
        <>
            <Header label={__('SEAT_PROPERTIES')} />
            <PropertiesContent>
                <Move objects={props.objects} />
                <Size objects={props.objects} />
                <Round objects={props.objects} />
                <SeatId objects={props.objects} />
                <Label objects={props.objects} />
                <FontSize objects={props.objects} />
                <Price objects={props.objects} />
                <Colors objects={props.objects} />
                <Handicap objects={props.objects} />
            </PropertiesContent>
        </>
    )
}

export default SeatProperties