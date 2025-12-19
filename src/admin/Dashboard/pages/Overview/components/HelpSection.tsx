import { __ } from '@src/utils'
import { Article, HelpOutline } from '@mui/icons-material'
import HelpLink from './HelpLink'
import type { HelpLink as HelpLinkType } from './types'

const getHelpLinks = (): HelpLinkType[] => {
    return [
        {
            id: 'documentation',
            icon: <Article sx={{ fontSize: 20 }} />,
            title: __('OVERVIEW_HELP_DOCS'),
            href: 'https://stachethemes.com/seat-planner/documentation/',
        },
        {
            id: 'support',
            icon: <HelpOutline sx={{ fontSize: 20 }} />,
            title: __('OVERVIEW_HELP_SUPPORT'),
            href: 'https://stachethemes.ticksy.com/',
        },
    ]
}

const HelpSection = () => {
    const helpLinks = getHelpLinks()

    return (
        <section className="stachesepl-overview-section">
            <h2 className="stachesepl-overview-section-title">{__('OVERVIEW_HELP_TITLE')}</h2>
            <div className="stachesepl-overview-help">
                {helpLinks.map((link) => (
                    <HelpLink key={link.id} link={link} />
                ))}
            </div>
        </section>
    )
}

export default HelpSection
