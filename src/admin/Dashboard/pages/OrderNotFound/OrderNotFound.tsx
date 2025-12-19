import { useNavigate } from "react-router"
import { useEffect, useState } from "react"
import Error from '../Error/Error'
import Button from '../../layout/Button'
import { __ } from "@src/utils"

const OrderNotFound = () => {
    const navigate = useNavigate();
    const [orderId, setOrderId] = useState<string>('');

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const urlOrderId = urlParams.get('order_id');
        
        if (urlOrderId) {
            setOrderId(urlOrderId);
        }

        // Clean up URL without reloading the page
        const newUrl = window.location.pathname + '?page=stachesepl' + window.location.hash;
        window.history.replaceState({}, '', newUrl);
    }, [])

    const handleGoToTools = () => {
        navigate('/tools');
    }

    const errorMessage = orderId 
        ? __('ORDER_NOT_FOUND_MESSAGE_WITH_ID').replace('%s', orderId)
        : __('ORDER_NOT_FOUND_MESSAGE');

    return (
        <Error
            headerLabel={__('ORDER_NOT_FOUND_HEADER')}
            titleLabel={__('ORDER_NOT_FOUND_TITLE')}
            errorMessage={errorMessage}
            customButton={
                <Button onClick={handleGoToTools}>
                    {__('GO_TO_TOOLS')}
                </Button>
            }
        />
    );
}

export default OrderNotFound
