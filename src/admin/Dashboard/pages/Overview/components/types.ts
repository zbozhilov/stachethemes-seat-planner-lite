export type OverviewStats = {
    total_products: number
    total_seats: number
    total_revenue: string
}

export type StatCard = {
    id: string
    label: string
    value: string | number
    isHtml?: boolean
    icon: React.ReactNode
    color: 'primary' | 'success' | 'warning' | 'info'
}

export type QuickAction = {
    id: string
    icon: React.ReactNode
    title: string
    description: string
    href: string
    external?: boolean
}

export type HelpLink = {
    id: string
    icon: React.ReactNode
    title: string
    href: string
}
