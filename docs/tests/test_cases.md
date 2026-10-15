# Documento de Casos de Testes - Velô Sprint

**Sistema:** Velô Sprint - Configurador de Veículo Elétrico  
**Perfil de Usuário:** Cliente (Usuário Comum)

---

### CT01 - Acesso ao Configurador de Veículo a partir da Landing Page

#### Objetivo
Garantir que o usuário consegue navegar da Landing Page para o Configurador de Veículos de forma correta.

#### Pré-Condições
- O sistema deve estar acessível e online.
- Usuário sem sessão ativa (Cliente comum).

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Acessar a URL raiz do sistema (Landing Page). | A página principal é carregada corretamente. |
| 2  | Clicar no botão "Configurar Veículo" ou "Comprar". | O sistema redireciona para a tela do Configurador de Veículo. |

#### Resultados Esperados
- A tela do Configurador de Veículos deve ser exibida com o modelo base carregado.

#### Critérios de Aceitação
- A navegação ocorre sem erros ou tela branca.
- O preço base inicial exibido deve ser de R$ 40.000.

---

### CT02 - Adição de opcionais e validação do preço base

#### Objetivo
Validar se o cálculo do preço do veículo à vista é atualizado corretamente ao selecionar opções adicionais.

#### Pré-Condições
- O usuário deve estar na página do Configurador de Veículo.
- Preço base do carro deve ser R$ 40.000.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Selecionar as rodas "Sport". | O preço total do veículo aumenta para R$ 42.000 (+ R$ 2.000). |
| 2  | Selecionar "Precision Park". | O preço total do veículo aumenta para R$ 47.500 (+ R$ 5.500). |
| 3  | Selecionar "Flux Capacitor". | O preço total do veículo aumenta para R$ 52.500 (+ R$ 5.000). |
| 4  | Desmarcar as rodas "Sport". | O preço total do veículo diminui para R$ 50.500 (- R$ 2.000). |

#### Resultados Esperados
- O sistema deve calcular dinamicamente o valor do carro sempre que um adicional for selecionado ou removido.

#### Critérios de Aceitação
- A soma dos valores de cada opcional deve ser exata.
- O sistema não deve permitir saldo negativo ou cálculos incorretos.

---

### CT03 - Seleção de pagamento parcelado e cálculo de juros compostos

#### Objetivo
Validar a aplicação da regra de juros compostos (2% a.m.) no financiamento travado em 12x.

#### Pré-Condições
- O usuário deve estar na página de Checkout/Pedido, com o carro configurado.
- Exemplo: Veículo apenas base (R$ 40.000).

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | No campo de entrada (down payment), inserir R$ 0. | O valor a ser financiado passa a ser o valor total do veículo. |
| 2  | Selecionar a forma de pagamento "Parcelado". | O sistema seleciona automaticamente 12x (travado). |
| 3  | Visualizar o resumo do cálculo. | O sistema aplica juros compostos de 2% a.m. ao valor financiado (ex: 40.000 * (1,02)^12). |

#### Resultados Esperados
- O sistema exibirá o valor das parcelas e o valor final financiado corretos, refletindo a taxa de 2% ao mês sobre o montante financiado.

#### Critérios de Aceitação
- O prazo de financiamento não pode ser alterado (fixo em 12x).
- A fórmula de juros compostos deve ser calculada estritamente como `Valor Financiado * (1 + 0.02)^12`.

---

### CT04 - Preenchimento do Checkout com validação de campos obrigatórios

#### Objetivo
Garantir que o sistema impeça o envio do pedido caso campos essenciais estejam em branco ou com dados inválidos.

#### Pré-Condições
- Usuário no módulo de Checkout/Pedido.
- Veículo já configurado.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Deixar o campo de CPF, Nome e Email vazios. | Os campos permanecem vazios. |
| 2  | Clicar no botão de "Finalizar Pedido" ou "Enviar". | O sistema bloqueia a ação e exibe mensagens de erro indicando que os campos são obrigatórios. |
| 3  | Preencher o CPF com formato inválido (ex: 123). | O sistema exibe mensagem de CPF inválido. |
| 4  | Preencher um email com formato inválido (ex: nome@dominio). | O sistema exibe mensagem de email inválido. |

#### Resultados Esperados
- O pedido não deve prosseguir para a análise de crédito ou confirmação enquanto houver campos em branco ou inválidos.

#### Critérios de Aceitação
- As validações devem ocorrer no formulário do cliente antes do envio ao backend.
- Feedback visual claro de erro para o usuário.

---

### CT05 - Análise de crédito com Score > 700 (Aprovado)

#### Objetivo
Validar a aprovação automática de crédito quando o usuário possui score superior a 700 e a entrada é menor que 50%.

#### Pré-Condições
- Todos os dados obrigatórios no formulário de Checkout estão preenchidos corretamente.
- A entrada informada é menor que 50% do valor total do veículo.
- A API de score de crédito (mock/simulada para o teste) retornará um valor > 700 para o CPF informado.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Clicar no botão "Finalizar Pedido" ou "Enviar". | O sistema exibe estado de carregamento/análise. |
| 2  | Aguardar a resposta da simulação. | O sistema redireciona para a tela de Confirmação informando que o pedido foi "Aprovado". |

#### Resultados Esperados
- A compra é concluída com sucesso e o pedido recebe status de aprovado.

#### Critérios de Aceitação
- Uma mensagem de sucesso e o número do pedido (`order_number`) são exibidos ao cliente.

---

### CT06 - Análise de crédito com Score entre 501 e 700 (Em análise)

#### Objetivo
Validar que pedidos com score médio ficam retidos no status "Em análise", caso a entrada seja menor que 50%.

#### Pré-Condições
- Dados corretos no Checkout.
- A entrada é menor que 50% do valor total do veículo.
- API retorna Score = 600 (ou qualquer valor entre 501 e 700).

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Clicar no botão "Finalizar Pedido". | O sistema inicia o processamento. |
| 2  | Aguardar a resposta. | O sistema informa que o pedido foi recebido e está "Em análise" por um consultor. |

#### Resultados Esperados
- O sistema não confirma a compra como garantida, e sim avisa que está sob análise manual.

#### Critérios de Aceitação
- Exibição de mensagem informativa correta sobre o status "Em análise".
- Número do pedido é gerado.

---

### CT07 - Análise de crédito com Score <= 500 (Reprovado)

#### Objetivo
Garantir a recusa automática de financiamento para usuários com baixo score, caso a entrada seja menor que 50%.

#### Pré-Condições
- Dados preenchidos no Checkout.
- A entrada é menor que 50% do valor total do veículo.
- API de Score retorna valor <= 500.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Clicar no botão "Finalizar Pedido". | O sistema envia a requisição. |
| 2  | Aguardar a validação. | O sistema exibe mensagem informando que o financiamento foi "Reprovado". |

#### Resultados Esperados
- O pedido é imediatamente negado pelo sistema por motivo de restrição de crédito.

#### Critérios de Aceitação
- O sistema não gera um pedido ativo.
- O cliente recebe a notificação da recusa do crédito sem travamento ou bugs.

---

### CT08 - Exceção de Análise de Crédito: Entrada >= 50%

#### Objetivo
Validar a regra de negócio onde, se a entrada for maior ou igual a 50% do valor total do veículo, o score de crédito é ignorado e o pedido é aprovado automaticamente.

#### Pré-Condições
- Veículo configurado e preço total definido (Ex: R$ 40.000).
- Dados do Checkout preenchidos corretamente.
- A API de score simulada retorna qualquer valor baixo ou nulo (Ex: <= 500).

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Informar o valor de entrada como R$ 20.000 (exatamente 50%). | O sistema registra a entrada adequadamente. |
| 2  | Clicar em "Finalizar Pedido". | A requisição de envio do pedido é efetuada. |
| 3  | Verificar o status final. | O pedido é "Aprovado" automaticamente, sobrepondo o baixo score. |

#### Resultados Esperados
- O cliente é levado para a página de confirmação de pedido com sucesso.

#### Critérios de Aceitação
- Independentemente do Score, a regra de >= 50% deve ter precedência máxima na aprovação.

---

### CT09 - Consulta de Pedido válida com "order_number"

#### Objetivo
Validar que o cliente consegue consultar o status atualizado do seu pedido informando o número gerado corretamente.

#### Pré-Condições
- O cliente deve ter o número de um pedido (order_number) válido (Ex: "VELO-1234").
- Estar na página de Consulta de Pedidos.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Inserir o "VELO-1234" no campo de pesquisa. | O campo aceita a entrada de dados. |
| 2  | Clicar no botão "Consultar" ou dar Enter. | O sistema processa e exibe as informações daquele pedido na tela. |

#### Resultados Esperados
- Devem ser exibidos os detalhes do pedido: Veículo, opcionais selecionados, valor final, status do pagamento/análise.

#### Critérios de Aceitação
- A visualização é restrita apenas ao pedido consultado (Segurança de Dados).

---

### CT10 - Tentativa de Consulta de Pedido inválida

#### Objetivo
Garantir que a tentativa de consultar um pedido com dados falsos ou sem permissão não retorne dados sensíveis.

#### Pré-Condições
- Estar na página de Consulta de Pedidos.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Tentar consultar sem preencher o campo. | O sistema avisa que o campo é obrigatório. |
| 2  | Inserir um order_number inválido (Ex: "00000"). | O sistema processa a busca. |
| 3  | Verificar a resposta. | O sistema informa "Pedido não encontrado". |

#### Resultados Esperados
- Nenhuma informação deve vazar na interface.
- O sistema lida graciosamente com o erro (sem exibir logs técnicos).

#### Critérios de Aceitação
- Campo numérico/alfanumérico deve ser validado.
- Mensagem amigável de pedido não encontrado.
