export type OrderStatus = 'APROVADO' | 'REPROVADO' | 'EM_ANALISE';

/**
 * Decide o status do pedido financiado a partir do score de crédito e da entrada.
 * Regras (ordem de avaliação):
 * 1. Entrada >= 50% do total E score < 700 → APROVADO
 * 2. Score > 700 → APROVADO
 * 3. Score entre 501 e 700 → EM_ANALISE
 * 4. Score <= 500 → REPROVADO
 */
export const decideCreditStatus = (
  score: number,
  entryValue: number,
  totalPrice: number
): OrderStatus => {
  const entryPercentage = entryValue / totalPrice;

  if (entryPercentage >= 0.5 && score < 700) return 'APROVADO';
  if (score > 700) return 'APROVADO';
  if (score >= 501 && score <= 700) return 'EM_ANALISE';
  return 'REPROVADO';
};
