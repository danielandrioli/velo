import { describe, expect, it } from 'vitest';
import { decideCreditStatus } from './creditDecision';

const TOTAL = 40000;

describe('decideCreditStatus', () => {
  // [descrição, score, entrada, esperado]
  it.each([
    ['score alto (701) sem entrada', 701, 0, 'APROVADO'],
    ['score 700 sem entrada: limite superior do médio', 700, 0, 'EM_ANALISE'],
    ['score 501 sem entrada: limite inferior do médio', 501, 0, 'EM_ANALISE'],
    ['score 500 sem entrada: limite do baixo', 500, 0, 'REPROVADO'],
    ['score baixo com entrada de 49%', 300, TOTAL * 0.49, 'REPROVADO'],
    ['score baixo com entrada de 50%', 300, TOTAL * 0.5, 'APROVADO'],
    ['score 700 com entrada de 50%: regra da entrada exige score < 700', 700, TOTAL * 0.5, 'EM_ANALISE'],
  ] as const)('%s', (_descricao, score, entrada, esperado) => {
    expect(decideCreditStatus(score, entrada, TOTAL)).toBe(esperado);
  });
});
