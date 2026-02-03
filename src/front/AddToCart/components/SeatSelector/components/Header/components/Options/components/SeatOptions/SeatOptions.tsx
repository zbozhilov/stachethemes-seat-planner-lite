import { ConfirmationNumber } from "@mui/icons-material";
import { useCustomFields, useDiscounts } from "@src/front/AddToCart/components/context/hooks";
import { __ } from "@src/utils";
import CustomFields from "../CustomFields/CustomFields";
import DiscountSelector from "../DiscountSelector/DiscountSelector";
import Section from "../ui/Section/Section";
import './SeatOptions.scss';

const SeatOptions = (props: {
    seatId: string;
    validationErrors?: { [fieldUid: string]: boolean };
    onFieldChange?: () => void;
}) => {

    const { hasDiscounts } = useDiscounts();
    const { hasCustomFields } = useCustomFields();

    return (
        <div className='stachesepl-options-seat-options'>

            <div className='stachesepl-options-seat-options-header'>
                <div className='stachesepl-seat-icon'>
                    <ConfirmationNumber style={{ fontSize: 22 }} />
                </div>
                <div className='stachesepl-seat-info'>
                    <span className='stachesepl-seat-label'>{__('SEAT')}</span>
                    <span className='stachesepl-seat-id'>{props.seatId}</span>
                </div>
            </div>

            <div className='stachesepl-options-seat-options-body'>
                {hasDiscounts && (
                    <DiscountSelector key={`discount-${props.seatId}`} seatId={props.seatId} />
                )}
                {hasCustomFields && (
                    <Section>
                        <CustomFields
                            key={`custom-fields-${props.seatId}`}
                            seatId={props.seatId}
                            validationErrors={props.validationErrors}
                            onFieldChange={props.onFieldChange}
                        />
                    </Section>
                )}
            </div>
        </div>
    );

}

export default SeatOptions;
