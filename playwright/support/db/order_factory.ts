import { faker } from '@faker-js/faker/locale/pt_BR';
import { getDb } from './client';
import { Car, CarColor, getRandomCarConfig, Optionals, Status, WheelType } from '../data/car_config_data';
import { gerarCodigoPedido } from '../data/generate_order_id';

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

export type PaymentMethod = 'avista' | 'financiamento';

export type OrderOverrides = {
    status?: Status;
    paymentMethod?: PaymentMethod;
    car?: Car;
    customerName?: string;
};

// Enum (texto da UI) -> valor gravado no banco
const COLOR_SLUG: Record<CarColor, string> = {
    [CarColor.GlacierBlue]: 'glacier-blue',
    [CarColor.MidnightBlack]: 'midnight-black',
    [CarColor.LunarWhite]: 'lunar-white',
};
const OPTIONAL_SLUG: Record<Optionals, string> = {
    [Optionals.PrecisionPark]: 'precision-park',
    [Optionals.FluxCapacitor]: 'flux-capacitor',
};
// Mesmos valores de src/store/configuratorStore.ts
const BASE_PRICE = 40000;
const SPORT_WHEELS_PRICE = 2000;
const OPTIONAL_PRICE: Record<Optionals, number> = {
    [Optionals.PrecisionPark]: 5500,
    [Optionals.FluxCapacitor]: 5000,
};

function calculatePrice(car: Car, optionals: Optionals[]): number {
    const wheels = car.wheels === WheelType.Sport ? SPORT_WHEELS_PRICE : 0;
    return optionals.reduce((total, opt) => total + OPTIONAL_PRICE[opt], BASE_PRICE + wheels);
}

/** Insere um pedido no banco e devolve os dados esperados na tela de consulta. */
export async function createOrder(overrides: OrderOverrides = {}): Promise<OrderLookupTestData> {
    const car = overrides.car ?? getRandomCarConfig();
    const optionals = [car.optional1, car.optional2].filter((o): o is Optionals => o !== undefined);
    const status = overrides.status ?? Status.Aprovado;
    const paymentMethod = overrides.paymentMethod ?? 'avista';
    const name = overrides.customerName ?? `${faker.person.firstName()} ${faker.person.lastName()}`;
    const email = getEmailFromName(name)
    const customerPhone = '(11) 91234-5678'
    const customerCpf = '529.982.247-25'

    const row = await getDb()
        .insertInto('orders')
        .values({
            order_number: gerarCodigoPedido(),
            color: COLOR_SLUG[car.color],
            wheel_type: car.wheels,
            customer_name: name,
            customer_email: email,
            customer_phone: customerPhone,
            customer_cpf: customerCpf,
            payment_method: paymentMethod,
            total_price: calculatePrice(car, optionals),
            status,
            optionals: optionals.map((o) => OPTIONAL_SLUG[o]),
        })
        .returning('order_number')
        .executeTakeFirstOrThrow();

    return {
        id: row.order_number,
        customer: { name, email },
        status,
        model: 'Velô Sprint',
        color: car.color,
        interior: 'cream', // a UI fixa o interior (coluna removida do banco)
        wheels: `${car.wheels} Wheels`,
        pickupStore: '',
        paymentLabel: paymentMethod === 'avista' ? 'À Vista' : 'Financiamento 12x',
    };
}

export async function deleteOrder(orderNumber: string): Promise<void> {
    await getDb().deleteFrom('orders').where('order_number', '=', orderNumber).execute();
}

function getEmailFromName(name: string): string {
    // 1. Remove acentos, espaços e deixa em minúsculas
    const nomeLimpo: string = name
        .normalize('NFD')                    // Divide os caracteres acentuados em letra + acento
        .replace(/[\u0300-\u036f]/g, '')     // Remove apenas os acentos
        .replace(/\s+/g, '')                 // Remove todos os espaços
        .toLowerCase()                       // Deixa em minúsculas

    // 2. Pega o horário atual (HHMM)
    const agora: Date = new Date()
    const hora: string = agora.getHours().toString().padStart(2, '0')
    const minuto: string = agora.getMinutes().toString().padStart(2, '0')
    const horario: string = `${hora}${minuto}`

    // 3. Junta tudo no formato final
    const email: string = `${nomeLimpo}_${horario}@gmail.com`

    console.log(email)
    return email
}
