### Checkout e Confirmação - Pagamento à Vista (Fluxo Feliz)

#### Objetivo
Validar a criação de um pedido bem-sucedido com pagamento à vista.

#### Pré-Condições
- Estar na rota de Checkout com um carro de configuração básica (R$ 40.000,00).
- Dados pessoais preenchidos e válidos.

#### Passos

| Id | Ação | Resultado Esperado |
|---:|---|---|
| 1 | Preencher o formulário com dados válidos e selecionar a loja | Os campos não apresentam erros. |
| 2 | Selecionar a aba "À Vista" na Forma de Pagamento | O valor total de "Resumo" e "À Vista" exibem R$ 40.000,00. |
| 3 | Marcar o aceite dos termos de uso e clicar em "Confirmar Pedido" | O botão mostra status de carregamento e o pedido é direcionado para a página de Confirmação (`/success`). |
| 4 | Verificar a página de Confirmação | A página exibe "Pedido Aprovado!", gerando um número de pedido e informações do cliente e resumo. |

#### Resultados Esperados
- Pedido à vista é criado imediatamente com status de `APROVADO`.

#### Critérios de Aceitação
- Pedido `APROVADO` para pagamentos à vista (sem análise de crédito necessária).
