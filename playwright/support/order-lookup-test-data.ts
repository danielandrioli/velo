export type OrderLookupTestData = {
    id: string;
    customer: {
        name: string,
        email: string
    }
    status: 'APROVADO' | 'REPROVADO' | 'EM_ANALISE';
    model: string;
    color: string;
    interior: string;
    wheels: string;
    pickupStore: string;
    paymentLabel: string;
};

export function getApprovedOrder(): OrderLookupTestData {
    return {
        id: 'VLO-F3XGFQ',
        customer: {
            name: 'Daniel Test',
            email: 'test@gmail.com'
        },
        status: 'APROVADO',
        model: 'Velô Sprint',
        color: 'Glacier Blue',
        interior: 'cream',
        wheels: 'aero Wheels',
        pickupStore: '',
        paymentLabel: 'À Vista',
    };
}
