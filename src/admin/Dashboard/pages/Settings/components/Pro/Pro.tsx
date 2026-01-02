import { __ } from '@src/utils';
import Container from '../../../../layout/Container/Container'
import './Pro.scss'
import Button from '@src/admin/Dashboard/layout/Button/Button';

const CheckIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const SparkleIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41L12 0Z" />
    </svg>
);

const Pro = () => {

    const getLink: string = 'https://woocommerce.com/products/stachethemes-seat-planner/';

    const proFeatures = [
        {
            title: __('PROF_NO_OBJECTS_CAP'),
            description: __('PROF_NO_OBJECTS_CAP_DESC'),
        },
        {
            title: __('PROF_DATES'),
            description: __('PROF_DATES_DESC'),
        },
        {
            title: __('PROF_DISCOUNTS'),
            description: __('PROF_DISCOUNTS_DESC'),
        },
        {
            title: __('PROF_CUSTOM_FIELDS'),
            description: __('PROF_CUSTOM_FIELDS_DESC'),
        },
        {
            title: __('PROF_ATTACHMENTS'),
            description: __('PROF_ATTACHMENTS_DESC'),
        },
        {
            title: __('PROF_CSV_IMPORT_EXPORT'),
            description: __('PROF_CSV_IMPORT_EXPORT_DESC'),
        },
        {
            title: __('PROF_APP'),
            description: __('PROF_APP_DESC'),
        },
        {
            title: __('PROF_SUPPORT'),
            description: __('PROF_SUPPORT_DESC'),
        }
    ]

    return (
        <Container className="stachesepl-pro-container">
            <div className="stachesepl-pro-section">
                {/* Premium Header */}
                <div className="stachesepl-pro-header">
                    <div className="stachesepl-pro-badge">
                        <SparkleIcon />
                        <span>PRO</span>
                    </div>
                    <h3 className="stachesepl-pro-title">{__('PRO_FEATURES')}</h3>
                    <p className="stachesepl-pro-subtitle">
                        {__('PRO_FEATURES_DESC')}
                    </p>
                </div>

                {/* Features Grid */}
                <div className="stachesepl-pro-features">
                    {proFeatures.map((feature, index) => (
                        <div 
                            key={index} 
                            className="stachesepl-pro-feature"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <div className="stachesepl-pro-feature-icon">
                                <CheckIcon />
                            </div>
                            <div className="stachesepl-pro-feature-content">
                                <h4 className="stachesepl-pro-feature-title">{feature.title}</h4>
                                <p className="stachesepl-pro-feature-description">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA Section */}
                <div className="stachesepl-pro-cta">
                    <div className="stachesepl-pro-cta-content">
                        <p className="stachesepl-pro-cta-text">{__('PRO_CTA_TEXT') || 'Unlock all features and take your seat planning to the next level'}</p>
                        <Button onClick={() => window.open(getLink, '_blank')}>
                            <SparkleIcon />
                            {__('GET_PRO_VERSION')}
                        </Button>
                    </div>
                </div>
            </div>
        </Container>
    )
}

export default Pro
