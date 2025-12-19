import { OpenInNew } from '@mui/icons-material'
import type { HelpLink as HelpLinkType } from './types'

type HelpLinkProps = {
    link: HelpLinkType
}

const HelpLink = ({ link }: HelpLinkProps) => {
    return (
        <a
            href={link.href}
            className="stachesepl-overview-help-link"
            target="_blank"
            rel="noopener noreferrer"
        >
            <span className="stachesepl-overview-help-link-icon">{link.icon}</span>
            <span className="stachesepl-overview-help-link-title">{link.title}</span>
            <OpenInNew className="stachesepl-overview-help-link-external" sx={{ fontSize: 14 }} />
        </a>
    )
}

export default HelpLink
