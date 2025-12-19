import './TabbedMenu.scss'

type Tab = {
    id: string
    label: string
}

const TabbedMenu = (props: {
    tabs: Tab[]
    activeTab: string
    setActiveTab: (tab: string) => void
}) => {

    return (

        <div className='stachesepl-tabbed-menu'>
            {
                props.tabs.map((tab) => {

                    const classNameArray = ['stachesepl-tabbed-menu-tab']
                    if (props.activeTab === tab.id) {
                        classNameArray.push('stachesepl-tabbed-menu-tab-active')
                    }

                    return (
                        <div key={tab.id} className={classNameArray.join(' ')} onClick={() => props.setActiveTab(tab.id)}>
                            {tab.label}
                        </div>
                    )
                })
            }
        </div>

    )

}

export default TabbedMenu