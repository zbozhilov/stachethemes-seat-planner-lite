import toast from 'react-hot-toast'
import Toggle from '@src/admin/Dashboard/layout/Toggle'
import Container from '../../../../layout/Container/Container'
import Divider from '@src/admin/Dashboard/layout/Divider/Divider'
import Input from '@src/admin/Dashboard/layout/Input'
import { useSettings } from '../../SettingsContext'
import { __ } from '@src/utils'

const Attachments = () => {
    const { settings, updateSetting } = useSettings()

    const handlePdfAttachmentsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            toast.error(__('PDF_ATTACHMENTS_NOT_SUPPORTED_IN_LITE'))
        } else {
            updateSetting('stachesepl_pdf_attachments', 'no')
        }
    }

    return (
        <Container>
            <Toggle
                label={__('ENABLE_QR_CODE')}
                description={__('ENABLE_QR_CODE_DESC')}
                checked={settings.stachesepl_qr_code_enabled === 'yes'}
                onChange={(e) => updateSetting('stachesepl_qr_code_enabled', e.target.checked ? 'yes' : 'no')}
            />

            <Divider />

            <Toggle
                label={__('ENABLE_PDF_ATTACHMENTS')}
                description={__('ENABLE_PDF_ATTACHMENTS_DESC')}
                checked={settings.stachesepl_pdf_attachments === 'yes'}
                onChange={handlePdfAttachmentsChange}
            />

            {settings.stachesepl_pdf_attachments === 'yes' && <>
                <Divider />
                <Input
                    label={__('PDF_FILENAME')}
                    description={__('PDF_FILENAME_DESC')}
                    placeholder={__('PDF_FILENAME_PLACEHOLDER')}
                    value={settings.stachesepl_pdf_attachment_name}
                    onChange={(e) => updateSetting('stachesepl_pdf_attachment_name', e.target.value)}
                />
            </>}

        </Container>
    )
}

export default Attachments
