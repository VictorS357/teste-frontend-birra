# Convenções do Projeto

## Objetivo

Este documento define as convenções adotadas durante o desenvolvimento da aplicação, garantindo padronização entre código, banco de dados e documentação.

---

# Convenções de Nomenclatura

## Banco de Dados (MySQL)

As tabelas e colunas seguirão o padrão **snake_case**, utilizando letras minúsculas e separando palavras por underscore (`_`).

### Exemplos

| Correto | Incorreto |
|----------|------------|
| clientes | Clientes |
| pedidos | Pedidos |
| cpf_cnpj | CPF/CNPJ |
| razao_social | RazaoSocial |
| ultima_limpeza | UltimaLimpeza |

---

## JavaScript / Node.js

No código JavaScript será utilizado o padrão **camelCase** para propriedades, variáveis e funções.

### Exemplos

| Correto | Incorreto |
|----------|------------|
| cliente.nome | cliente.Nome |
| cliente.razaoSocial | cliente.RazaoSocial |
| cliente.cpfCnpj | cliente["CPF/CNPJ"] |

---

## Models do Sequelize

Os Models utilizarão:

- Nome no singular;
- Primeira letra maiúscula (PascalCase).

### Exemplos

| Tabela | Model |
|---------|-------|
| clientes | Cliente |
| produtos | Produto |
| pedidos | Pedido |
| usuarios | Usuario |

---

## Tabelas do Banco

As tabelas permanecerão no plural.

### Exemplos

- clientes
- produtos
- pedidos
- usuarios

---

## Chaves Primárias

Todas as tabelas utilizarão a coluna:

id

Independentemente do nome utilizado originalmente no AppSheet.

Exemplo:

| AppSheet | MySQL |
|-----------|--------|
| Row ID | id |

---

## Chaves Estrangeiras

As chaves estrangeiras seguirão o padrão:

nome_da_tabela_id

### Exemplos

| Relacionamento | Banco |
|----------------|--------|
| Cliente | cliente_id |
| Produto | produto_id |
| Usuario | usuario_id |

No JavaScript:

| Banco | JavaScript |
|--------|------------|
| cliente_id | clienteId |
| produto_id | produtoId |
| usuario_id | usuarioId |

---

# Organização do Projeto

A estrutura principal do projeto seguirá o seguinte padrão:

```text
config/
docs/
migrations/
models/
public/
scripts/
seeders/
```

Cada pasta possui uma responsabilidade específica.

---

# Decisão Arquitetural

O projeto utilizará:

- MySQL como banco de dados;
- Sequelize como ORM;
- Sequelize CLI para gerenciamento de migrations;
- Express como framework HTTP;
- Variáveis de ambiente através do `.env`;
- Git para versionamento;
- Documentação em Markdown dentro da pasta `docs`.

---

# Observações

As convenções definidas neste documento deverão ser utilizadas durante todo o desenvolvimento do projeto.

Qualquer alteração futura deverá ser registrada neste documento.