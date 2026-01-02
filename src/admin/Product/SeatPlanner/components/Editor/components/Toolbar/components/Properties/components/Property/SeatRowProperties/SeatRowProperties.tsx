import { __ } from "@src/utils"
import { SeatRowObjectProps } from "../../../../../../Workflow/components/Objects/SeatRow/types"
import Header from "../features/Header/Header"
import Move from "../features/Move/Move"
import PropertiesContent from "../PropertiesContent/PropertiesContent"


const SeatRowProperties = (props: {
    objects: SeatRowObjectProps[]
}) => {
    return (
        <>
            <Header label={__('SEAT_PROPERTIES')} />
            <PropertiesContent>
                <Move objects={props.objects} />
            </PropertiesContent>
        </>
    )
}

export default SeatRowProperties