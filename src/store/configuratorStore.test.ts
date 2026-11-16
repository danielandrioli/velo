import { beforeEach, describe, expect, it } from 'vitest';
import {
  calculateInstallment,
  calculateTotalPrice,
  formatPrice,
  useConfiguratorStore,
  type CarConfiguration,
  type Order,
} from './configuratorStore';

const configPadrao: CarConfiguration = {
  exteriorColor: 'glacier-blue',
  interiorColor: 'carbon-black',
  wheelType: 'aero',
  optionals: [],
};

const estadoInicial = useConfiguratorStore.getState();

const criarPedido = (email: string, id = 'VLO-TEST01'): Order => ({
  id,
  configuration: configPadrao,
  totalPrice: 40000,
  customer: {
    name: 'Fulano',
    surname: 'Teste',
    email,
    phone: '11999999999',
    cpf: '00000000000',
    store: 'Loja Teste',
  },
  paymentMethod: 'avista',
  status: 'APROVADO',
  createdAt: '2026-01-01T00:00:00.000Z',
});

beforeEach(() => {
  // Restaura o estado inicial (true = substitui, não faz merge)
  useConfiguratorStore.setState(estadoInicial, true);
  useConfiguratorStore.setState({ orders: [], currentUserEmail: null });
});

describe('calculateTotalPrice', () => {
  it('retorna o preço base para a configuração padrão', () => {
    expect(calculateTotalPrice(configPadrao)).toBe(40000);
  });

  it('soma 2.000 para rodas sport', () => {
    expect(calculateTotalPrice({ ...configPadrao, wheelType: 'sport' })).toBe(42000);
  });

  it('soma o preço de cada opcional', () => {
    expect(calculateTotalPrice({ ...configPadrao, optionals: ['precision-park'] })).toBe(45500);
    expect(calculateTotalPrice({ ...configPadrao, optionals: ['flux-capacitor'] })).toBe(45000);
  });

  it('soma rodas sport com os dois opcionais', () => {
    const config: CarConfiguration = {
      ...configPadrao,
      wheelType: 'sport',
      optionals: ['precision-park', 'flux-capacitor'],
    };
    expect(calculateTotalPrice(config)).toBe(52500);
  });

  it('ignora opcional desconhecido e optionals que não é array', () => {
    const desconhecido = { ...configPadrao, optionals: ['foo'] } as unknown as CarConfiguration;
    const naoArray = { ...configPadrao, optionals: undefined } as unknown as CarConfiguration;
    expect(calculateTotalPrice(desconhecido)).toBe(40000);
    expect(calculateTotalPrice(naoArray)).toBe(40000);
  });
});

describe('calculateInstallment', () => {
  it('calcula a parcela de 12x com 2% a.m. para 40.000', () => {
    // Valor calculado à mão: 40000 * 0,02 * 1,02^12 / (1,02^12 - 1) ≈ 3782,38
    expect(calculateInstallment(40000)).toBeCloseTo(3782.38, 2);
  });

  it('arredonda para no máximo 2 casas decimais', () => {
    const parcela = calculateInstallment(45500);
    expect(Math.round(parcela * 100) / 100).toBe(parcela);
  });

  it('o total das parcelas é maior que o valor à vista (há juros)', () => {
    expect(calculateInstallment(40000) * 12).toBeGreaterThan(40000);
  });
});

describe('formatPrice', () => {
  it('formata em reais no padrão pt-BR', () => {
    // O Intl usa espaço não separável após "R$"; normalizamos para comparar
    expect(formatPrice(40000).replace(/ /g, ' ')).toBe('R$ 40.000,00');
  });
});

describe('ações de configuração', () => {
  it('setExteriorColor altera a cor e muda a visão para exterior', () => {
    useConfiguratorStore.setState({ viewMode: 'interior' });
    useConfiguratorStore.getState().setExteriorColor('midnight-black');
    const { configuration, viewMode } = useConfiguratorStore.getState();
    expect(configuration.exteriorColor).toBe('midnight-black');
    expect(viewMode).toBe('exterior');
  });

  it('setInteriorColor altera a cor e muda a visão para interior', () => {
    useConfiguratorStore.getState().setInteriorColor('deep-blue');
    const { configuration, viewMode } = useConfiguratorStore.getState();
    expect(configuration.interiorColor).toBe('deep-blue');
    expect(viewMode).toBe('interior');
  });

  it('setWheelType altera as rodas sem mexer na visão', () => {
    useConfiguratorStore.getState().setWheelType('sport');
    const { configuration, viewMode } = useConfiguratorStore.getState();
    expect(configuration.wheelType).toBe('sport');
    expect(viewMode).toBe('exterior');
  });

  it('toggleOptional adiciona e depois remove o opcional', () => {
    const { toggleOptional } = useConfiguratorStore.getState();
    toggleOptional('precision-park');
    expect(useConfiguratorStore.getState().configuration.optionals).toEqual(['precision-park']);
    toggleOptional('precision-park');
    expect(useConfiguratorStore.getState().configuration.optionals).toEqual([]);
  });

  it('resetConfiguration volta ao padrão e preserva pedidos e usuário logado', () => {
    const store = useConfiguratorStore.getState();
    store.setExteriorColor('lunar-white');
    store.setWheelType('sport');
    store.toggleOptional('flux-capacitor');
    store.addOrder(criarPedido('a@teste.com'));
    store.login('a@teste.com');

    useConfiguratorStore.getState().resetConfiguration();

    const state = useConfiguratorStore.getState();
    expect(state.configuration).toEqual(configPadrao);
    expect(state.orders).toHaveLength(1);
    expect(state.currentUserEmail).toBe('a@teste.com');
  });
});

describe('pedidos e login', () => {
  it('addOrder acrescenta o pedido e preserva os anteriores', () => {
    const { addOrder } = useConfiguratorStore.getState();
    addOrder(criarPedido('a@teste.com', 'VLO-AAA111'));
    addOrder(criarPedido('b@teste.com', 'VLO-BBB222'));
    expect(useConfiguratorStore.getState().orders.map((o) => o.id)).toEqual(['VLO-AAA111', 'VLO-BBB222']);
  });

  it('login com e-mail que tem pedido retorna true e define o usuário', () => {
    useConfiguratorStore.getState().addOrder(criarPedido('a@teste.com'));
    expect(useConfiguratorStore.getState().login('a@teste.com')).toBe(true);
    expect(useConfiguratorStore.getState().currentUserEmail).toBe('a@teste.com');
  });

  it('login com e-mail sem pedido retorna false e não altera o estado', () => {
    useConfiguratorStore.getState().addOrder(criarPedido('a@teste.com'));
    expect(useConfiguratorStore.getState().login('outro@teste.com')).toBe(false);
    expect(useConfiguratorStore.getState().currentUserEmail).toBeNull();
  });

  it('logout zera o usuário logado', () => {
    useConfiguratorStore.getState().addOrder(criarPedido('a@teste.com'));
    useConfiguratorStore.getState().login('a@teste.com');
    useConfiguratorStore.getState().logout();
    expect(useConfiguratorStore.getState().currentUserEmail).toBeNull();
  });

  it('getUserOrders retorna lista vazia sem usuário logado', () => {
    useConfiguratorStore.getState().addOrder(criarPedido('a@teste.com'));
    expect(useConfiguratorStore.getState().getUserOrders()).toEqual([]);
  });

  it('getUserOrders retorna só os pedidos do usuário logado', () => {
    const { addOrder } = useConfiguratorStore.getState();
    addOrder(criarPedido('a@teste.com', 'VLO-AAA111'));
    addOrder(criarPedido('b@teste.com', 'VLO-BBB222'));
    useConfiguratorStore.getState().login('a@teste.com');
    const ids = useConfiguratorStore.getState().getUserOrders().map((o) => o.id);
    expect(ids).toEqual(['VLO-AAA111']);
  });
});
