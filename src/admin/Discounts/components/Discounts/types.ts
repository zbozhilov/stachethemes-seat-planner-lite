export interface discountData {
    group?: string,
    name: string,
    type: 'percentage' | 'fixed',
    value: number
}