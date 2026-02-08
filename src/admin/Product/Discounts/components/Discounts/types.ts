export interface discountData {
    role?: string,
    group?: string,
    name: string,
    type: 'percentage' | 'fixed',
    value: number
}