import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock do client do Supabase: nenhum teste toca no banco real
const { fromMock } = vi.hoisted(() => ({ fromMock: vi.fn() }));
vi.mock('@/integrations/supabase/client', () => ({
  supabase: { from: fromMock },
}));

import { createOrder, getOrderByNumber } from './useOrders';

const entrada = {
  configuration: {
    exteriorColor: 'lunar-white',
    interiorColor: 'carbon-black',
    wheelType: 'sport',
    optionals: ['precision-park'],
  },
  totalPrice: 47500,
  customer: {
    name: 'Maria',
    surname: 'da Silva',
    email: 'maria@teste.com',
    phone: '11999999999',
    cpf: '000.000.000-00',
    store: 'Loja Centro',
  },
  paymentMethod: 'avista',
  status: 'APROVADO',
} as const;

// Simula a cadeia insert().select().single() e devolve o payload do insert como linha
const mockInsert = (error: { message: string } | null = null) => {
  const insert = vi.fn((payload: Record<string, unknown>) => ({
    select: () => ({
      single: async () =>
        error
          ? { data: null, error }
          : { data: { ...payload, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' }, error: null },
    }),
  }));
  fromMock.mockReturnValue({ insert });
  return insert;
};

// Simula a cadeia select().eq().maybeSingle()
const mockSelect = (data: unknown) => {
  const eq = vi.fn(() => ({ maybeSingle: async () => ({ data, error: null }) }));
  fromMock.mockReturnValue({ select: () => ({ eq }) });
  return eq;
};

beforeEach(() => {
  fromMock.mockReset();
});

describe('createOrder', () => {
  it('mapeia os dados da UI para as colunas do banco', async () => {
    const insert = mockInsert();
    await createOrder(entrada as never);

    expect(fromMock).toHaveBeenCalledWith('orders');
    expect(insert).toHaveBeenCalledWith(
      expect.objectContaining({
        color: 'lunar-white',
        wheel_type: 'sport',
        optionals: ['precision-park'],
        customer_name: 'Maria da Silva',
        customer_email: 'maria@teste.com',
        customer_phone: '11999999999',
        customer_cpf: '000.000.000-00',
        payment_method: 'avista',
        total_price: 47500,
        status: 'APROVADO',
      })
    );
  });

  it('gera o número do pedido no formato VLO-XXXXXX', async () => {
    const insert = mockInsert();
    await createOrder(entrada as never);

    const payload = insert.mock.calls[0][0] as { order_number: string };
    expect(payload.order_number).toMatch(/^VLO-[A-Z0-9]{6}$/);
  });

  it('retorna o pedido com a loja do input (que não existe no banco)', async () => {
    mockInsert();
    const { order, error } = await createOrder(entrada as never);

    expect(error).toBeNull();
    expect(order?.customer.store).toBe('Loja Centro');
    expect(order?.customer.name).toBe('Maria');
    expect(order?.customer.surname).toBe('da Silva');
  });

  it('retorna order null e a mensagem quando o supabase falha', async () => {
    mockInsert({ message: 'falha no insert' });
    vi.spyOn(console, 'error').mockImplementation(() => {});

    const resultado = await createOrder(entrada as never);

    expect(resultado).toEqual({ order: null, error: 'falha no insert' });
  });
});

describe('getOrderByNumber', () => {
  it('normaliza o número (trim + maiúsculas) antes de consultar', async () => {
    const eq = mockSelect(null);
    await getOrderByNumber('  vlo-abc123 ');

    expect(eq).toHaveBeenCalledWith('order_number', 'VLO-ABC123');
  });

  it('retorna order null e error null quando o pedido não existe', async () => {
    mockSelect(null);
    expect(await getOrderByNumber('VLO-NAOEXI')).toEqual({ order: null, error: null });
  });
});
