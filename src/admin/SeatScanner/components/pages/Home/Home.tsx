import Toaster from '@src/admin/SeatPlanner/components/Toaster/Toaster'
import { __ } from '@src/utils'
import toast from 'react-hot-toast'
import Button from '../../layouts/Button/Button'
import PageContainer from '../../layouts/PageContainer/PageContainer'
import PageHeader from '../../layouts/PageHeader/PageHeader'
import './Home.scss'

const Home = () => {

    return (

        <div className='stachesepl-scan-home'>

            <Toaster />

            <PageHeader title={__('SEAT_SCANNER')} />

            <PageContainer>
                <div className='stachesepl-scan-home-content'>
                    <div className='stachesepl-scan-home-content-start'>
                        <h2>{__('QR_CODE_SCANNER')}</h2>
                        <p>{__('SCAN_THE_QR_CODE_TO_GET_SEAT_DETAILS')}</p>
                        <Button onClick={() => {
                            toast.error(__('SCAN_NOT_ALLOWED'));
                        }}>{__('SCAN_NOW')}</Button>
                    </div>
                </div>
            </PageContainer>

        </div>
    )
}

export default Home

