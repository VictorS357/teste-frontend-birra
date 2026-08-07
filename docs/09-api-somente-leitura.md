# API somente leitura

## Objetivo

A API deste projeto possui finalidade predominantemente experimental e de consulta.

Diferentemente de uma aplicação CRUD convencional, o sistema não tem como objetivo principal criar, editar ou excluir os registros migrados.

A API será utilizada para:

- disponibilizar os dados migrados ao frontend;
- validar o acesso ao novo banco de dados relacional;
- analisar o comportamento da aplicação utilizando o MySQL;
- medir o volume de dados transferido pelas tabelas;
- comparar o volume das consultas com os dados anteriormente obtidos através da API do AppSheet.

Por esse motivo, inicialmente serão implementados apenas endpoints HTTP `GET`.

---

# Arquitetura

A API utiliza a seguinte separação:

```text
Frontend
   ↓
Route
   ↓
Controller
   ↓
Service
   ↓
Sequelize
   ↓
MySQL
```

## Routes

As rotas definem os endpoints HTTP disponíveis e encaminham cada requisição para seu respectivo Controller.

Exemplo:

```text
GET /api/pedidos
```

A Route não executa consultas no banco de dados.

## Controllers

Os Controllers representam a camada HTTP da aplicação.

São responsáveis por:

- receber a requisição;
- chamar o Service correspondente;
- definir o status HTTP;
- devolver a resposta JSON;
- tratar erros da requisição.

Não devem concentrar consultas Sequelize ou regras de acesso ao banco.

## Services

Os Services concentram a lógica de consulta aos dados.

São responsáveis por utilizar os Models Sequelize e preparar os dados que serão entregues aos Controllers.

Essa separação permite modificar posteriormente filtros, relacionamentos ou estratégias de consulta sem alterar diretamente a camada HTTP.

## Models

Os Models Sequelize representam as tabelas existentes no MySQL e seus relacionamentos.

Eles constituem a camada de acesso ao banco utilizada pelos Services.

---

# Estratégia de consulta

Em aplicações convencionais com grande volume de dados, seria recomendado utilizar paginação.

Por exemplo:

```text
GET /api/pedidos?page=1&limit=20
```

Entretanto, este projeto possui também o objetivo de medir o volume total das tabelas quando seus registros são serializados e transmitidos através de uma API.

Por esse motivo, os endpoints utilizados para essa análise retornam todos os registros da respectiva tabela.

Exemplo:

```text
GET /api/pedidos
```

Retorna todos os registros existentes em `pedidos`.

---

# Medição individual das tabelas

Para que o tamanho de uma tabela possa ser analisado corretamente, as consultas destinadas à medição não devem utilizar `JOINs` ou `include` de outras entidades.

Por exemplo, a consulta:

```text
Pedido
├── Cliente
└── ItensPedido
    └── Produto
```

não representa exclusivamente o volume da tabela `pedidos`.

Ela adicionaria dados das tabelas:

- `clientes`;
- `itens_pedido`;
- `produtos`.

Além disso, determinadas informações poderiam ser repetidas durante a serialização JSON.

Para as medições, cada endpoint deverá portanto retornar exclusivamente sua própria tabela.

Exemplos:

```text
GET /api/clientes
GET /api/produtos
GET /api/pedidos
GET /api/itens-pedido
GET /api/equip-recip
GET /api/historico-movimentacoes
GET /api/planejamento
```

---

# Formato das respostas

As listagens seguem inicialmente o formato:

```json
{
    "total": 9731,
    "data": [
        {
            "...": "..."
        }
    ]
}
```

O campo `total` informa a quantidade de registros retornados.

O campo `data` contém os registros completos da tabela.

---

# Relacionamentos

Os relacionamentos Sequelize continuam definidos nos Models e poderão ser utilizados em endpoints destinados à visualização detalhada no frontend.

Entretanto, os endpoints utilizados para medição de volume deverão evitar `include`, para não misturar dados de diferentes tabelas.

Dessa forma, poderão existir posteriormente duas finalidades distintas de consulta:

```text
Consulta da tabela
→ dados puros
→ utilizada para medição

Consulta detalhada
→ utiliza relacionamentos
→ utilizada para apresentação no frontend
```

---

# Considerações de desempenho

Retornar milhares de registros em uma única requisição não é recomendado para a maioria dos sistemas em produção.

Neste projeto essa decisão é intencional, porque um dos objetivos é analisar:

- tamanho das respostas JSON;
- volume transferido;
- tempo de consulta;
- comportamento com sincronizações completas;
- impacto do volume atual da base.

Caso o sistema evolua posteriormente para uma aplicação de produção, as consultas destinadas à navegação normal deverão utilizar paginação, filtros e carregamento sob demanda.