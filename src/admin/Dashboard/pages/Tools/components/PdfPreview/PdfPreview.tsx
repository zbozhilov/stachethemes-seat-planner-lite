import { useState, useRef } from 'react'
import Container from '../../../../layout/Container/Container'
import Button from '../../../../layout/Button/Button'
import Input from '../../../../layout/Input/Input'
import { __ } from '@src/utils'
import './PdfPreview.scss'
import { toast } from 'react-hot-toast'

const PdfPreview = () => {
    const [orderId, setOrderId] = useState('')
    const [error, setError] = useState('')
    const formRef = useRef<HTMLFormElement>(null)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        toast.error(__('PDF_PREVIEW_NOT_SUPPORTED'))
    }

    const handleOrderIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOrderId(e.target.value)
        if (error) setError('')
    }

    return (
        <Container>
            <div className="stachesepl-pdf-preview">
                <div className="stachesepl-pdf-preview-info">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10 9 9 9 8 9" />
                    </svg>
                    <div>
                        <h3 className="stachesepl-pdf-preview-info-title">{__('PDF_PREVIEW_TITLE')}</h3>
                        <p className="stachesepl-pdf-preview-info-description">
                            {__('PDF_PREVIEW_DESCRIPTION')}
                        </p>
                    </div>
                </div>

                <form
                    ref={formRef}
                    method="post"
                    action={`${window.stachesepl_admin_url.admin_url}admin-post.php`}
                    target="_blank"
                    onSubmit={handleSubmit}
                    className="stachesepl-pdf-preview-form"
                >
                    <input type="hidden" name="action" value="stachesepl_pdf_preview" />
                    <input
                        type="hidden"
                        name="_wpnonce"
                        value={window.stachesepl_pdf_preview?.nonce || ''}
                    />

                    <div className="stachesepl-pdf-preview-input-group">
                        <Input
                            type="number"
                            name="stachesepl_pdf_preview_order_id"
                            label={__('PDF_PREVIEW_ORDER_ID_LABEL')}
                            description={__('PDF_PREVIEW_ORDER_ID_DESC')}
                            placeholder={__('PDF_PREVIEW_ORDER_ID_PLACEHOLDER')}
                            value={orderId}
                            onChange={handleOrderIdChange}
                            error={error}
                            min={1}
                        />
                    </div>

                    <Button onClick={() => formRef.current?.requestSubmit()}>
                        {__('PDF_PREVIEW_BUTTON')}
                    </Button>
                </form>

                <div className="stachesepl-pdf-preview-notes">
                    <h4>{__('PDF_PREVIEW_NOTES_TITLE')}</h4>
                    <ul>
                        <li>{__('PDF_PREVIEW_NOTE_1')}</li>
                        <li>{__('PDF_PREVIEW_NOTE_2')}</li>
                        <li>{__('PDF_PREVIEW_NOTE_3')}</li>
                    </ul>
                </div>
            </div>
        </Container>
    )
}

export default PdfPreview
