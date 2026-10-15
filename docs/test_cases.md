# Documento de Casos de Testes - Velô Sprint

**Sistema:** Velô Sprint - Configurador de Veículo Elétrico  
**Perfil de Usuário:** Cliente (Usuário Comum)

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

