# 09 — Relacionamentos do Banco de Dados

## Objetivo

Esta etapa tem como objetivo adicionar a integridade referencial ao banco de dados.

Ao final desta fase:

- todos os Models possuirão seus relacionamentos Sequelize;
- todas as Foreign Keys existirão no MySQL;
- será possível utilizar include(), eager loading e lazy loading;
- o banco garantirá consistência dos dados.

---

# Estratégia adotada

A modelagem foi dividida em três etapas.

## Fase 1

Modelagem das entidades.

Resultado:

- Models criados.
- Nenhum relacionamento.

---

## Fase 2

Estrutura física do banco.

Resultado:

- Todas as tabelas criadas.
- Nenhuma Foreign Key.

---

## Fase 3

Relacionamentos.

Resultado:

- belongsTo()
- hasMany()
- hasOne()
- Foreign Keys

---

# Ordem da implementação

Os relacionamentos serão adicionados nesta ordem.

## Bloco 1

Usuários

↓

Clientes

↓

Produtos

---

## Bloco 2

Pedidos

↓

ItensPedido

---

## Bloco 3

EquipRecip

↓

MovMassaPai

↓

MovMassaFilho

↓

HistoricoMovimentacoes

---

## Bloco 4

Planejamento

↓

RotasDeChopeiraPai

↓

RotasDeChopeiraFilho

---

## Bloco 5

Arquivos

- Files
- Comprovantes
- Etiquetas

---

## Bloco 6

EquipCliente

↓

ImagemAcao

---

# Regra importante

Nesta fase NÃO serão alteradas as colunas existentes.

Apenas serão adicionados:

- belongsTo()
- hasMany()
- hasOne()

e posteriormente as Foreign Keys através de novas migrations.

Nenhum dado será migrado nesta etapa.

---

# Ordem das migrations

As migrations desta fase utilizarão apenas:

queryInterface.addConstraint()

ou

queryInterface.addColumn(... references ...)

Jamais serão recriadas tabelas.

---

# Resultado esperado

Ao final desta fase:

✓ Banco completamente relacionado

✓ Integridade referencial

✓ Includes funcionando

✓ Base pronta para importação dos CSVs na Fase 4