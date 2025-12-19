import PageHeader from '../../layout/PageHeader/PageHeader'
import Container from '../../layout/Container/Container'
import { __ } from '@src/utils'
import StatsSection from './components/StatsSection'
import QuickActionsSection from './components/QuickActionsSection'
import HelpSection from './components/HelpSection'
import './Overview.scss'

const Overview = () => {
    return (
        <div className="stachesepl-page-overview">
            <PageHeader
                title={__('OVERVIEW_TITLE')}
                description={__('OVERVIEW_DESCRIPTION')}
            />

            <Container>
                <StatsSection />
                <QuickActionsSection />
                <HelpSection />
                <p className="stachesepl-overview-version">
                    Stachethemes Seat Planner <span className="stachesepl-overview-version-number">{window.stachesepl_version.version}</span>
                </p>
            </Container>
        </div>
    )
}

export default Overview
