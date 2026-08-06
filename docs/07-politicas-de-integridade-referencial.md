# Políticas de Integridade Referencial

## Objetivo

Este documento define as políticas utilizadas nas Foreign Keys do projeto.

Para cada relacionamento, são documentados:

- tabela que contém a Foreign Key;
- coluna da Foreign Key;
- tabela e coluna referenciadas;
- comportamento em caso de atualização;
- comportamento em caso de exclusão;
- justificativa da decisão.

As Foreign Keys serão adicionadas por Migrations durante a Fase 3 do projeto.

---

# Conceitos

## ON UPDATE CASCADE

Quando o valor da chave primária referenciada for alterado, a Foreign Key será atualizada automaticamente.

Exemplo:

```text
pedidos.id: ABC
        ↓
itens_pedido.pedido_id: ABC
```

Caso o ID do pedido seja alterado para `XYZ`, o banco atualizará automaticamente:

```text
itens_pedido.pedido_id: XYZ
```

Embora UUIDs raramente sejam alterados, utilizaremos `ON UPDATE CASCADE` para manter a consistência entre as tabelas.

---

## ON DELETE CASCADE

Quando o registro pai for excluído, os registros filhos relacionados também serão excluídos.

Será utilizado somente quando o registro filho não possuir significado sem o registro pai.

Exemplo:

```text
Pedido
  └── ItensPedido
```

Um item de pedido não deve continuar existindo após a exclusão do pedido.

---

## ON DELETE RESTRICT

Impede a exclusão do registro referenciado enquanto existirem registros relacionados.

Será utilizado para preservar:

- dados históricos;
- registros obrigatórios;
- entidades compartilhadas;
- informações que não devem ser apagadas em cascata.

Exemplo:

```text
Produto
  └── ItensPedido
```

Um produto já utilizado em pedidos não poderá ser excluído fisicamente.

---

## ON DELETE SET NULL

Quando o registro referenciado for excluído, a Foreign Key será alterada para `NULL`.

Será utilizado somente quando:

- a coluna aceitar `NULL`;
- o registro dependente ainda fizer sentido sem a referência;
- a exclusão não puder remover o histórico principal.

Exemplo:

```text
Pedido
  └── Responsável
```

Caso um usuário seja removido, o pedido continuará existindo, mas ficará sem responsável associado.

---

# Regra geral do projeto

Todas as Foreign Keys utilizarão:

```text
ON UPDATE CASCADE
```

A política de exclusão será definida conforme a relação:

| Situação | Política |
|---|---|
| Filho não existe sem o pai | `ON DELETE CASCADE` |
| Registro histórico ou referência obrigatória | `ON DELETE RESTRICT` |
| Referência opcional e removível | `ON DELETE SET NULL` |

---

# Pedidos

## Cliente do pedido

```text
pedidos.cliente_id
    → clientes.id
```

| Propriedade | Política |
|---|---|
| Obrigatório | Sim |
| ON UPDATE | CASCADE |
| ON DELETE | RESTRICT |

### Justificativa

O pedido não deve existir sem um cliente.

Não será utilizado `CASCADE`, pois excluir um cliente não deve apagar automaticamente todo o histórico de pedidos.

O cliente não poderá ser excluído enquanto possuir pedidos relacionados.

---

## Responsável pelo pedido

```text
pedidos.responsavel_id
    → usuarios.id
```

| Propriedade | Política |
|---|---|
| Obrigatório | Não |
| ON UPDATE | CASCADE |
| ON DELETE | SET NULL |

### Justificativa

O pedido deve permanecer no sistema mesmo que o usuário responsável seja removido.

Como a coluna aceita `NULL`, apenas a referência será removida.

---

# Itens de pedido

## Pedido

```text
itens_pedido.pedido_id
    → pedidos.id
```

| Propriedade | Política |
|---|---|
| Obrigatório | Sim |
| ON UPDATE | CASCADE |
| ON DELETE | CASCADE |

### Justificativa

Um item não possui significado sem o pedido ao qual pertence.

Ao excluir um pedido, seus itens também deverão ser excluídos.

---

## Produto

```text
itens_pedido.produto_id
    → produtos.id
```

| Propriedade | Política |
|---|---|
| Obrigatório | Sim |
| ON UPDATE | CASCADE |
| ON DELETE | RESTRICT |

### Justificativa

Um produto utilizado em um pedido faz parte do histórico comercial.

O produto não poderá ser excluído enquanto existir em algum item de pedido.

Caso futuramente seja necessário desativar produtos, deverá ser utilizado um campo de status em vez da exclusão física.

---

# Equipamentos e recipientes

## Produto original

```text
equip_recip.produto_id
    → produtos.id
```

| Propriedade | Política |
|---|---|
| Obrigatório | Não |
| ON UPDATE | CASCADE |
| ON DELETE | SET NULL |

### Justificativa

O recipiente pode continuar existindo mesmo que a referência ao produto original seja removida.

A exclusão do produto não deve excluir o equipamento.

---

## Cliente

```text
equip_recip.cliente_id
    → clientes.id
```

| Propriedade | Política |
|---|---|
| Obrigatório | Não |
| ON UPDATE | CASCADE |
| ON DELETE | RESTRICT |

### Justificativa

O cliente é obrigatório no registro

A exclusão do cliente não pode fazer com que o equipamento fique órfão nem que seja apagado automaticamente

---

## Item de separação

```text
equip_recip.item_pedido_sep_id
    → itens_pedido.id
```

| Propriedade | Política |
|---|---|
| Obrigatório | Não |
| ON UPDATE | CASCADE |
| ON DELETE | SET NULL |

### Justificativa

O recipiente possui existência própria.

A exclusão do item de pedido não deve excluir o recipiente, apenas remover sua associação com a separação.

---

## Item de entrada ou entrega

```text
equip_recip.item_pedido_entr_id
    → itens_pedido.id
```

| Propriedade | Política |
|---|---|
| Obrigatório | Não |
| ON UPDATE | CASCADE |
| ON DELETE | SET NULL |

### Justificativa

O recipiente continuará existindo independentemente do item de pedido relacionado à entrada ou entrega.

---

# Movimentação em massa

## Usuário responsável

```text
mov_massa_pai.usuario_id
    → usuarios.id
```

| Propriedade | Política |
|---|---|
| Obrigatório | Sim |
| ON UPDATE | CASCADE |
| ON DELETE | RESTRICT |

### Justificativa

O usuário faz parte do registro de auditoria da movimentação.

Não será permitido excluir o usuário enquanto existirem movimentações registradas em seu nome.

---

## Produto

```text
mov_massa_pai.produto_id
    → produtos.id
```

| Propriedade | Política |
|---|---|
| Obrigatório | Condicional |
| ON UPDATE | CASCADE |
| ON DELETE | RESTRICT |

### Justificativa

Apesar de a coluna aceitar `NULL`, quando preenchida ela representa um dado histórico da movimentação.

Por isso, um produto utilizado em movimentações não deverá ser excluído fisicamente.

A obrigatoriedade condicional continuará sendo validada pela aplicação.

---

## Movimentação pai

```text
mov_massa_filho.mov_massa_pai_id
    → mov_massa_pai.id
```

| Propriedade | Política |
|---|---|
| Obrigatório | Sim |
| ON UPDATE | CASCADE |
| ON DELETE | CASCADE |

### Justificativa

O registro filho não possui sentido sem a movimentação pai.

Ao excluir a movimentação pai, todos os seus itens deverão ser removidos.

---

## Equipamento ou recipiente

```text
mov_massa_filho.equip_recip_id
    → equip_recip.id
```

| Propriedade | Política |
|---|---|
| Obrigatório | Sim |
| ON UPDATE | CASCADE |
| ON DELETE | RESTRICT |

### Justificativa

A movimentação registra que determinado equipamento participou da operação.

O equipamento não poderá ser excluído enquanto fizer parte de uma movimentação registrada.

---

# Planejamento

## Responsável

```text
planejamento.responsavel_id
    → usuarios.id
```

| Propriedade | Política |
|---|---|
| Obrigatório | Não |
| ON UPDATE | CASCADE |
| ON DELETE | SET NULL |

### Justificativa

O planejamento deverá continuar existindo caso o responsável seja removido.

---

## Solicitante

```text
planejamento.solicitante_id
    → usuarios.id
```

| Propriedade | Política |
|---|---|
| Obrigatório | Não |
| ON UPDATE | CASCADE |
| ON DELETE | SET NULL |

### Justificativa

A remoção do usuário solicitante não deverá apagar o planejamento.

A referência será alterada para `NULL`.

---

## Cliente

```text
planejamento.cliente_id
    → clientes.id
```

| Propriedade | Política |
|---|---|
| Obrigatório | Não |
| ON UPDATE | CASCADE |
| ON DELETE | SET NULL |

### Justificativa

O planejamento pode continuar existindo sem um cliente associado.

A exclusão do cliente não deverá remover a atividade ou o chamado registrado.

---

# Imagens de ações

## Planejamento ou ação

```text
imagens_acoes.acao_id
    → planejamento.id
```

| Propriedade | Política |
|---|---|
| Obrigatório | Não |
| ON UPDATE | CASCADE |
| ON DELETE | CASCADE |

### Justificativa

A imagem foi criada especificamente para documentar uma ação de planejamento.

Ao excluir definitivamente o planejamento, os registros de imagens ligados exclusivamente a ele também poderão ser removidos.

A exclusão do arquivo físico deverá ser tratada separadamente pela camada de armazenamento.

---

## Responsável

```text
imagens_acoes.responsavel_id
    → usuarios.id
```

| Propriedade | Política |
|---|---|
| Obrigatório | Não |
| ON UPDATE | CASCADE |
| ON DELETE | SET NULL |

### Justificativa

A imagem deve continuar registrada mesmo que o usuário responsável seja removido.

---

# Rotas de chopeira

## Responsável pela rota

```text
rotas_de_chopeira_pai.resp_id
    → usuarios.id
```

| Propriedade | Política |
|---|---|
| Obrigatório | Não |
| ON UPDATE | CASCADE |
| ON DELETE | SET NULL |

### Justificativa

A rota continuará existindo caso o usuário responsável seja removido.

---

## Rota pai

```text
rotas_de_chopeira_filho.rota_pai_id
    → rotas_de_chopeira_pai.id
```

| Propriedade | Política |
|---|---|
| Obrigatório | Sim |
| ON UPDATE | CASCADE |
| ON DELETE | CASCADE |

### Justificativa

Um item de rota não possui sentido sem sua rota pai.

Ao excluir a rota, todos os seus itens deverão ser removidos.

---

## Pedido da rota

```text
rotas_de_chopeira_filho.pedido_id
    → pedidos.id
```

| Propriedade | Política |
|---|---|
| Obrigatório | Sim |
| ON UPDATE | CASCADE |
| ON DELETE | RESTRICT |

### Justificativa

Um pedido associado a uma rota não deverá ser excluído enquanto essa associação existir.

Primeiro, o pedido deverá ser removido da rota.

Essa política evita que uma rota fique com referências inválidas ou seja silenciosamente alterada por uma exclusão em cascata.

---

# Equipamentos dos clientes

## Cliente

```text
equip_cliente.cliente_id
    → clientes.id
```

| Propriedade | Política |
|---|---|
| Obrigatório | Não |
| ON UPDATE | CASCADE |
| ON DELETE | SET NULL |

### Justificativa

O registro do equipamento poderá ser preservado mesmo que o cliente seja removido.

A referência ao cliente será alterada para `NULL`.

> Esta política poderá ser revisada futuramente caso seja definido que o equipamento existe exclusivamente dentro do cadastro do cliente. Nesse caso, poderá ser utilizado `ON DELETE CASCADE`.

---

# Histórico de movimentações

## Equipamento ou recipiente

```text
historico_movimentacoes.equip_recip_id
    → equip_recip.id
```

| Propriedade | Política |
|---|---|
| Obrigatório | Sim |
| ON UPDATE | CASCADE |
| ON DELETE | RESTRICT |

### Justificativa

O histórico existe para registrar a trajetória do equipamento.

Excluir o equipamento apagaria o significado dos registros históricos. Por isso, sua exclusão será impedida enquanto houver histórico.

---

## Usuário

```text
historico_movimentacoes.usuario_id
    → usuarios.id
```

| Propriedade | Política |
|---|---|
| Obrigatório | Não |
| ON UPDATE | CASCADE |
| ON DELETE | SET NULL |

### Justificativa

O histórico deverá continuar existindo mesmo que o usuário seja removido.

---

## Produto

```text
historico_movimentacoes.produto_id
    → produtos.id
```

| Propriedade | Política |
|---|---|
| Obrigatório | Condicional |
| ON UPDATE | CASCADE |
| ON DELETE | RESTRICT |

### Justificativa

Quando preenchido, o produto faz parte do histórico da movimentação.

O produto não poderá ser excluído enquanto estiver associado a registros históricos.

---

## Cliente

```text
historico_movimentacoes.cliente_id
    → clientes.id
```

| Propriedade | Política |
|---|---|
| Obrigatório | Não |
| ON UPDATE | CASCADE |
| ON DELETE | SET NULL |

### Justificativa

O histórico será preservado mesmo que o cliente seja removido.

---

## Item de separação

```text
historico_movimentacoes.itm_sep_id
    → itens_pedido.id
```

| Propriedade | Política |
|---|---|
| Obrigatório | Não |
| ON UPDATE | CASCADE |
| ON DELETE | SET NULL |

### Justificativa

O histórico continuará existindo mesmo que o item relacionado não exista mais.

---

## Item de entrada ou entrega

```text
historico_movimentacoes.itm_entr_id
    → itens_pedido.id
```

| Propriedade | Política |
|---|---|
| Obrigatório | Não |
| ON UPDATE | CASCADE |
| ON DELETE | SET NULL |

### Justificativa

O histórico não deverá ser excluído juntamente com o item do pedido.

---

## Item de conclusão

```text
historico_movimentacoes.itm_conc_id
    → itens_pedido.id
```

| Propriedade | Política |
|---|---|
| Obrigatório | Condicional |
| ON UPDATE | CASCADE |
| ON DELETE | SET NULL |

### Justificativa

O registro histórico permanecerá no banco mesmo que o item de conclusão seja removido.

A obrigatoriedade condicional do campo `nivel` continuará sendo tratada na aplicação.

---

# Tabelas sem Foreign Keys

Os seguintes Models não possuem Foreign Keys nesta etapa:

- `Comprovante`;
- `File`;
- `Etiqueta`.

Essas tabelas armazenam metadados de arquivos e permanecem independentes.

---

# Resumo das políticas

| Tabela filha | Foreign Key | Tabela pai | ON DELETE |
|---|---|---|---|
| pedidos | cliente_id | clientes | RESTRICT |
| pedidos | responsavel_id | usuarios | SET NULL |
| itens_pedido | pedido_id | pedidos | CASCADE |
| itens_pedido | produto_id | produtos | RESTRICT |
| equip_recip | produto_id | produtos | SET NULL |
| equip_recip | produto_atual_id | produtos | SET NULL |
| equip_recip | item_pedido_sep_id | itens_pedido | SET NULL |
| equip_recip | item_pedido_entr_id | itens_pedido | SET NULL |
| mov_massa_pai | usuario_id | usuarios | RESTRICT |
| mov_massa_pai | produto_id | produtos | RESTRICT |
| mov_massa_filho | mov_massa_pai_id | mov_massa_pai | CASCADE |
| mov_massa_filho | equip_recip_id | equip_recip | RESTRICT |
| planejamento | responsavel_id | usuarios | SET NULL |
| planejamento | solicitante_id | usuarios | SET NULL |
| planejamento | cliente_id | clientes | SET NULL |
| imagens_acoes | acao_id | planejamento | CASCADE |
| imagens_acoes | responsavel_id | usuarios | SET NULL |
| rotas_de_chopeira_pai | resp_id | usuarios | SET NULL |
| rotas_de_chopeira_filho | rota_pai_id | rotas_de_chopeira_pai | CASCADE |
| rotas_de_chopeira_filho | pedido_id | pedidos | RESTRICT |
| equip_cliente | cliente_id | clientes | SET NULL |
| historico_movimentacoes | equip_recip_id | equip_recip | RESTRICT |
| historico_movimentacoes | usuario_id | usuarios | SET NULL |
| historico_movimentacoes | produto_id | produtos | RESTRICT |
| historico_movimentacoes | cliente_id | clientes | SET NULL |
| historico_movimentacoes | itm_sep_id | itens_pedido | SET NULL |
| historico_movimentacoes | itm_entr_id | itens_pedido | SET NULL |
| historico_movimentacoes | itm_conc_id | itens_pedido | SET NULL |

Todas utilizarão:

```text
ON UPDATE CASCADE
```

---

# Observação sobre exclusão física

Em entidades históricas ou amplamente referenciadas, a aplicação deverá preferir desativação lógica em vez de exclusão física.

Exemplos:

- usuários;
- clientes;
- produtos;
- equipamentos;
- pedidos.

Futuramente, poderão ser adicionados campos como:

```text
ativo
arquivado
data_exclusao
```

Essa abordagem preserva o histórico e reduz o risco de perda de dados.

---

# Revisões

As políticas deste documento poderão ser revistas caso as regras de negócio sejam alteradas durante o desenvolvimento da API.

Toda alteração deverá ser implementada por uma nova Migration.