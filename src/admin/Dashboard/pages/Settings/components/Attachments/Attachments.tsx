import Toggle from '@src/admin/Dashboard/layout/Toggle'
import Container from '../../../../layout/Container/Container'
import Divider from '@src/admin/Dashboard/layout/Divider/Divider'
import Input from '@src/admin/Dashboard/layout/Input'
import { useSettings } from '../../SettingsContext'
import { __ } from '@src/utils'
import { toast } from 'react-hot-toast'

const Attachments = () => {
    const { settings, updateSetting } = useSettings()

    return (
        <Container>
            <Toggle 
                label={__('ENABLE_PDF_ATTACHMENTS')} 
                description={__('ENABLE_PDF_ATTACHMENTS_DESC')} 
                checked={false}
                onChange={() => {
                    toast.error(__('PDF_ATTACHMENTS_NOT_SUPPORTED'))
                }}
            />

            <Divider />

            <Input
                label={__('PDF_FILENAME')}
                description={__('PDF_FILENAME_DESC')}
                placeholder={__('PDF_FILENAME_PLACEHOLDER')}
                value={settings.stachesepl_pdf_attachment_name}
                onChange={(e) => updateSetting('stachesepl_pdf_attachment_name', e.target.value)}
            />
        </Container>
    )
}

export default Attachments
