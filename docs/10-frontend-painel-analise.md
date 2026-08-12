# Frontend — Painel de Visualização e Análise

## Objetivo

O frontend do projeto tem como objetivo disponibilizar uma interface para visualização dos dados migrados do AppSheet para o novo banco de dados MySQL.

Além da consulta dos registros, a aplicação funcionará como um **painel de análise da base migrada**, permitindo observar características relacionadas ao volume e ao carregamento dos dados.

O painel permitirá:

* visualizar os registros das tabelas migradas;
* consultar a quantidade de registros de cada entidade;
* medir o tamanho das respostas JSON recebidas da API;
* medir o tempo necessário para receber cada resposta;
* comparar o volume das diferentes tabelas;
* centralizar informações sobre a base migrada em um Dashboard.

A aplicação possui finalidade de visualização e análise. Não está prevista, nesta etapa, a implementação de operações de criação, edição ou exclusão dos registros.

---

# Tecnologias

O frontend utiliza:

* React;
* Vite;
* React Router;
* JavaScript;
* CSS;
* Fetch API.

A escolha do React permite organizar o painel através de componentes reutilizáveis sem adicionar a complexidade de frameworks mais abrangentes.

O Vite é utilizado como ferramenta de desenvolvimento e build do frontend.

---

# Separação entre frontend e backend

O frontend é mantido separadamente da API Express.

A estrutura geral do projeto segue o formato:

```text
projeto/
│
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── app.js
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    │
    └── package.json
```

Durante o desenvolvimento, backend e frontend são executados como aplicações independentes.

O fluxo de dados é:

```text
MySQL
   ↓
Sequelize
   ↓
Express
   ↓
API REST
   ↓
JSON
   ↓
React
   ↓
Interface
```

O frontend não possui acesso direto ao banco de dados.

Todo acesso aos dados ocorre através dos endpoints disponibilizados pela API Express.

---

# Arquitetura do frontend

A aplicação está organizada inicialmente em três grupos principais:

```text
src/
├── components/
├── pages/
└── services/
```

## Components

A pasta `components` contém elementos reutilizáveis da interface.

Entre os componentes previstos estão:

```text
Layout
Sidebar
MetricCard
DataTable
```

O objetivo é evitar a duplicação de estruturas semelhantes entre as diferentes páginas do painel.

## Pages

A pasta `pages` contém as telas correspondentes às diferentes áreas da aplicação.

Inicialmente foram criadas:

```text
Dashboard
Clientes
Produtos
Pedidos
```

Posteriormente serão adicionadas páginas para as demais entidades disponibilizadas pela API.

## Services

A pasta `services` concentra a comunicação do frontend com a API.

O arquivo `api.js` disponibiliza uma função comum para consultar as tabelas, evitando que cada página implemente novamente a mesma lógica de requisição.

---

# Navegação

A navegação do painel utiliza React Router.

O componente principal define as rotas da aplicação e utiliza um Layout compartilhado entre as páginas.

Exemplos:

```text
/
→ Dashboard

/clientes
→ Clientes

/produtos
→ Produtos

/pedidos
→ Pedidos
```

O `Layout` contém os elementos permanentes da interface, como a barra lateral.

A página correspondente à rota atual é renderizada através do `Outlet` do React Router.

Dessa forma, elementos como a Sidebar permanecem disponíveis durante a navegação sem necessidade de serem repetidos em cada página.

---

# Sidebar

A Sidebar representa a navegação principal do painel.

Os links utilizam `NavLink`, permitindo que o React Router controle a navegação sem recarregar completamente a aplicação.

A rota atualmente selecionada também pode ser identificada visualmente através da classe `active` disponibilizada pelo `NavLink`.

Conforme novas telas forem implementadas, seus respectivos links serão adicionados à Sidebar.

---

# Comunicação com a API

A comunicação com o backend é centralizada em:

```text
frontend/src/services/api.js
```

A URL-base da API é definida em um único local.

Durante o desenvolvimento:

```text
http://localhost:3000/api
```

As páginas informam apenas qual recurso desejam consultar.

Por exemplo:

```javascript
buscarTabela('pedidos');
```

resulta em uma requisição para:

```text
GET /api/pedidos
```

Enquanto:

```javascript
buscarTabela('clientes');
```

consulta:

```text
GET /api/clientes
```

Essa abordagem reduz duplicação e centraliza o tratamento das requisições.

---

# Medição das respostas

Além de recuperar os dados, o frontend coleta métricas relacionadas às respostas da API.

Atualmente são consideradas:

* quantidade de registros;
* tamanho da resposta em bytes;
* tamanho da resposta em KB;
* tamanho da resposta em MB;
* tempo da requisição em milissegundos.

O tempo é medido através de `performance.now()` antes e depois da requisição.

A resposta é inicialmente recebida como texto para permitir a medição do tamanho do conteúdo JSON.

Posteriormente, o conteúdo é convertido para objeto JavaScript através de `JSON.parse()`.

As métricas calculadas são adicionadas ao resultado disponibilizado para as páginas.

---

# Estratégia de carregamento

Diferentemente de uma aplicação convencional, as páginas de análise poderão solicitar todos os registros de uma tabela em uma única requisição.

Essa decisão é intencional.

Um dos objetivos do projeto é analisar o comportamento da aplicação durante a transferência integral das tabelas migradas, aproximando o experimento do processo de sincronização completa analisado anteriormente no AppSheet.

Portanto, para os endpoints utilizados nessa análise:

```text
Tabela
   ↓
Consulta completa
   ↓
Serialização JSON
   ↓
Transferência HTTP
   ↓
Frontend
   ↓
Medição e visualização
```

A ausência de paginação nesses endpoints faz parte do experimento e não representa uma recomendação de arquitetura para aplicações convencionais em produção.

---

# Páginas de dados

Cada página destinada à análise de uma tabela deverá apresentar, inicialmente, dois grupos de informação.

O primeiro grupo apresenta métricas da consulta, como:

```text
Registros
9.731

Tamanho da resposta
X MB

Tempo de carregamento
X ms
```

O segundo apresenta os registros recebidos através de uma tabela visual.

O objetivo é permitir que o usuário visualize simultaneamente os dados e as características da transferência realizada pela API.

---

# Dashboard

O Dashboard será a visão consolidada da base migrada.

Ele deverá reunir informações das diferentes entidades, permitindo comparar características como:

* quantidade de registros;
* tamanho das respostas;
* tempo de carregamento;
* participação de cada tabela no volume total analisado.

Exemplo conceitual:

```text
Painel do Banco Migrado

Clientes                  1.926
Produtos                    191
Pedidos                   9.731
Itens de Pedido          23.774
Histórico                27.053
```

Além dos indicadores numéricos, poderão ser utilizados gráficos para facilitar a comparação entre as tabelas.

---

# Componentes reutilizáveis

Para evitar a implementação repetida da mesma interface em todas as páginas, serão criados componentes reutilizáveis.

## MetricCard

Responsável por apresentar indicadores como:

```text
Quantidade de registros
Tamanho da resposta
Tempo da requisição
```

## DataTable

Responsável por apresentar os registros recebidos da API em formato tabular.

O componente poderá ser reutilizado por diferentes páginas através da configuração das colunas e dos dados apresentados.

Essa abordagem permite que páginas como Clientes, Produtos, Pedidos e Equipamentos compartilhem a mesma estrutura básica de visualização.

---

# Escopo

Nesta etapa, o frontend será direcionado exclusivamente para consulta e análise.

Não fazem parte do escopo atual:

* formulários de cadastro;
* edição de registros;
* exclusão de registros;
* operações `POST`;
* operações `PUT` ou `PATCH`;
* operações `DELETE`.

Caso o sistema seja posteriormente transformado em uma aplicação operacional, essas funcionalidades poderão ser implementadas separadamente.

---

# Considerações de desempenho

O carregamento integral de tabelas com milhares de registros pode produzir respostas grandes e tempos de carregamento superiores aos de aplicações que utilizam paginação.

Neste projeto, esse comportamento faz parte da análise.

As métricas apresentadas pelo frontend devem ser interpretadas dentro desse contexto experimental.

Caso o sistema evolua para utilização em produção, deverão ser consideradas estratégias como:

* paginação;
* filtros executados no backend;
* carregamento sob demanda;
* seleção apenas das colunas necessárias;
* cache;
* otimização das respostas da API.

Dessa forma, o painel atual deve ser entendido como uma ferramenta de **visualização e análise da base migrada**, e não como definição definitiva da arquitetura de uma futura aplicação de produção.
