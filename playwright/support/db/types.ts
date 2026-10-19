import type { ColumnType, Generated } from 'kysely';

// Espelha public.orders (ver supabase/migrations). total_price é NUMERIC: o driver pg o devolve como string.
export interface OrdersTable {
    id: Generated<string>;
    order_number: string;
    color: string;
    wheel_type: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    customer_cpf: string;
    payment_method: 'avista' | 'financiamento';
    total_price: ColumnType<string, number, number>;
    status: 'APROVADO' | 'REPROVADO' | 'EM_ANALISE';
    created_at: Generated<Date>;
    updated_at: Generated<Date>;
    optionals: string[];
}

export interface Database {
    orders: OrdersTable;
}
