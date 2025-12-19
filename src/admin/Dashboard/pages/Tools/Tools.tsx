import { useState } from 'react'
import './Tools.scss'
import TabbedMenu from '../../layout/TabbedMenu/TabbedMenu'
import PageHeader from '../../layout/PageHeader/PageHeader'
import BookingIntegrityChecker from './components/BookingIntegrityChecker/BookingIntegrityChecker'
import PdfPreview from './components/PdfPreview/PdfPreview'
import { __ } from '@src/utils'

const Tools = () => {
    type SupportedTabs = 'booking_integrity' | 'pdf_preview'

    const [activeTab, setActiveTab] = useState<SupportedTabs>('booking_integrity')

    const getActiveComponent = () => {
        switch (activeTab) {
            case 'booking_integrity': {
                return <BookingIntegrityChecker />
            }
            case 'pdf_preview': {
                return <PdfPreview />
            }
            default: {
                return null
            }
        }
    }

    return (
        <div className='stachesepl-page-tools'>
            <PageHeader
                title={__('TOOLS_PAGE_TITLE')}
                description={__('TOOLS_PAGE_DESCRIPTION')}
            />

            <TabbedMenu
                activeTab={activeTab}
                setActiveTab={(tab) => setActiveTab(tab as SupportedTabs)}
                tabs={[
                    {
                        id: 'booking_integrity',
                        label: __('TOOLS_TAB_BOOKING_INTEGRITY'),
                    },
                    {
                        id: 'pdf_preview',
                        label: __('TOOLS_TAB_PDF_PREVIEW'),
                    }
                ]}
            />

            <div className="stachesepl-page-tools-content">
                {getActiveComponent()}
            </div>
        </div>
    )
}

export default Tools

