import Button from '../../../../../layout/Button/Button'
import Input from '../../../../../layout/Input/Input'
import InfoBox from '../../../../../layout/InfoBox/InfoBox'
import { __ } from '@src/utils'

type OrderSearchFormProps = {
    orderId: string
    onOrderIdChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
    onSearch: () => void
    isLoading: boolean
    error?: string
}

const OrderSearchForm = ({
    orderId,
    onOrderIdChange,
    onKeyDown,
    onSearch,
    isLoading,
    error,
}: OrderSearchFormProps) => (
    <>
        <InfoBox
            icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
            }
            title={__('EDIT_ORDER_TITLE')}
            description={__('EDIT_ORDER_DESCRIPTION')}
        />

        <div className="stachesepl-eoi-search">
            <div className="stachesepl-eoi-search-input">
                <Input
                    type="number"
                    label={__('ORDER_ID')}
                    placeholder={__('EDIT_ORDER_ORDER_ID_PLACEHOLDER')}
                    value={orderId}
                    onChange={onOrderIdChange}
                    onKeyDown={onKeyDown}
                    error={error}
                    min={1}
                />
            </div>
            <Button onClick={onSearch} disabled={isLoading}>
                {isLoading ? __('EDIT_ORDER_LOADING') : __('EDIT_ORDER_SEARCH')}
            </Button>
        </div>
    </>
)

export default OrderSearchForm
