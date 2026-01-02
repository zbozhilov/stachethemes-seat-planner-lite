import { SeatObjectProps } from "@src/admin/Product/SeatPlanner/components/Editor/components/Workflow/components/Objects/Seat/types"
import { __ } from "@src/utils"
import Colors from "../features/Colors/Colors"
import DiscountGroup from "../features/DiscountGroup/DiscountGroup"
import Font from "../features/Font/Font"
import Handicap from "../features/Handicap/Handicap"
import Header from "../features/Header/Header"
import Label from "../features/Label/Label"
import Move from "../features/Move/Move"
import Price from "../features/Price/Price"
import Round from "../features/Round/Round"
import SeatId from "../features/SeatId/SeatId"
import Size from "../features/Size/Size"
import Status from "../features/Status/Status"
import Zindex from "../features/Zindex/Zindex"
import PropertiesContent from "../PropertiesContent/PropertiesContent"
import ExtraClass from "../features/ExtraClass/ExtraClass"


const SeatProperties = (props: {
    objects: SeatObjectProps[]
}) => {
    return (
        <>
            <Header label={__('SEAT_PROPERTIES')} />
            <PropertiesContent>
                <Move objects={props.objects} />
                <Size objects={props.objects} />
                <Zindex objects={props.objects} />
                <Round objects={props.objects} />
                <Status objects={props.objects} />
                <SeatId objects={props.objects} />
                <Label objects={props.objects} />
                <Font objects={props.objects} />
                <Price objects={props.objects} />
                <DiscountGroup objects={props.objects} />
                <Colors objects={props.objects} />
                <Handicap objects={props.objects} />
                <ExtraClass objects={props.objects} />
            </PropertiesContent>
        </>
    )
}

export default SeatProperties