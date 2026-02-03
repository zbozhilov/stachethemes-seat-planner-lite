import { __ } from '@src/utils';
import AddToCartButton from '../../../AddToCartButton/AddToCartButton';
import './Footer.scss';
import { useTotalAfterOptions } from './hooks';

const Footer = (props: {
    onValidate?: () => boolean;
    onValidateAndShowErrors?: () => boolean;
}) => {

    const totalAfterOptions = useTotalAfterOptions();

    return (
        <div className='stachesepl-options-container-footer'>
            <div className='stachesepl-options-container-total'>
                <div className='stachesepl-options-container-total-label'>
                    {__('TOTAL')}
                </div>
                <div
                    className='stachesepl-options-container-total-value'
                    dangerouslySetInnerHTML={{ __html: totalAfterOptions }}>
                </div>
            </div>

            <AddToCartButton onValidate={props.onValidate} onValidateAndShowErrors={props.onValidateAndShowErrors} />
        </div>
    )

}

export default Footer;