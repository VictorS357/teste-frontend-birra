# Deploy e medição de infraestrutura no Google Cloud Platform

## Objetivo

Esta etapa do projeto tem como objetivo implantar o sistema desenvolvido em uma infraestrutura real no Google Cloud Platform (GCP).

Diferentemente de um deploy voltado exclusivamente à publicação de uma aplicação, esta implantação possui também caráter experimental.

O ambiente será utilizado para:

- validar o funcionamento do sistema utilizando infraestrutura em nuvem;
- hospedar o banco de dados migrado em um banco relacional gerenciado;
- executar a API Node.js/Express em uma máquina virtual;
- disponibilizar o frontend React;
- armazenar arquivos e imagens utilizados pelo sistema;
- analisar o volume de dados transferido;
- observar o comportamento das consultas completas realizadas pela API;
- acompanhar os custos reais dos recursos utilizados;
- comparar os custos observados com as estimativas realizadas anteriormente.

---

## Arquitetura proposta

A arquitetura inicial será composta pelos seguintes serviços:

```text
                    Usuário
                       │
                       ▼
               Frontend React
                       │
                Cloud Storage
                       │
                       ▼
                 API REST
              Node.js + Express
                       │
                Compute Engine
                       │
                       ▼
                  Cloud SQL
                    MySQL
```

Arquivos e imagens poderão ser armazenados separadamente no Cloud Storage.

A arquitetura poderá posteriormente receber um Cloud Load Balancer para avaliação de um cenário mais próximo da arquitetura completa anteriormente estimada.

---

## Componentes da infraestrutura

### Cloud SQL

O Cloud SQL será responsável por hospedar o banco de dados MySQL utilizado pelo sistema.

O banco atualmente utilizado no ambiente local será migrado para uma instância Cloud SQL.

A aplicação continuará utilizando Sequelize para realizar as consultas.

```text
API
 ↓
Sequelize
 ↓
Cloud SQL
 ↓
MySQL
```

O Cloud SQL deverá utilizar, sempre que possível, configurações equivalentes às utilizadas anteriormente na estimativa de custos.

### Compute Engine

O backend Node.js será executado em uma máquina virtual do Compute Engine.

A VM será responsável por executar:

- Node.js;
- Express;
- Sequelize;
- API REST.

A aplicação será configurada para se conectar ao banco hospedado no Cloud SQL.

Inicialmente será utilizada uma única VM, já que o objetivo principal desta etapa é validar a arquitetura e medir seu custo.

### Cloud Storage

O Cloud Storage poderá possuir duas funções distintas.

#### Hospedagem do frontend

O frontend React será compilado através do Vite:

```bash
npm run build
```

O resultado da compilação será disponibilizado no Cloud Storage.

#### Armazenamento de arquivos

As imagens e demais arquivos associados ao sistema não deverão ser versionados junto ao código-fonte.

Quando necessário para o experimento, esses arquivos poderão ser enviados diretamente para um bucket do Cloud Storage.

Isso permitirá medir separadamente:

- quantidade de arquivos;
- volume total armazenado;
- custo de armazenamento;
- transferência desses arquivos.

### Load Balancing

O Cloud Load Balancing não será obrigatório durante a primeira etapa da implantação.

Inicialmente, o objetivo será validar:

```text
Frontend
   ↓
Compute Engine
   ↓
Cloud SQL
```

Após a validação desse ambiente, um Load Balancer poderá ser adicionado para reproduzir de forma mais próxima o cenário completo utilizado anteriormente na estimativa de TCO.

Isso também permitirá comparar o impacto financeiro da adição desse componente.

---

## Região

Sempre que os serviços utilizados permitirem, será priorizada a região de São Paulo.

A utilização da mesma região entre os recursos busca:

- reduzir latência;
- evitar transferências desnecessárias entre regiões;
- manter consistência com as estimativas de infraestrutura realizadas anteriormente.

---

## Operação dos recursos

Para permitir comparação com os cálculos anteriores, inicialmente será considerada operação contínua dos principais recursos.

Premissa:

```text
24 horas/dia
≈ 730 horas/mês
```

Essa premissa se aplica principalmente a:

- Compute Engine;
- Cloud SQL.

Posteriormente poderão ser realizados testes desligando recursos quando não utilizados para avaliar possíveis reduções de custo.

---

## Etapas do deploy

### Etapa 1 — Preparação do projeto GCP

Será criado ou selecionado um projeto no Google Cloud Platform.

Nesta etapa serão configurados:

- projeto GCP;
- conta de faturamento;
- APIs necessárias;
- orçamento;
- alertas de custo.

Nenhum recurso relevante deverá ser criado antes da configuração dos mecanismos básicos de acompanhamento financeiro.

### Etapa 2 — Cloud SQL

Será criada uma instância MySQL no Cloud SQL.

Depois da criação:

1. será criado o banco da aplicação;
2. o banco local será exportado;
3. os dados serão importados para o Cloud SQL;
4. a integridade das tabelas será validada;
5. a quantidade de registros será comparada com o banco local.

### Etapa 3 — Compute Engine

Será criada uma máquina virtual destinada ao backend.

A VM deverá receber:

- Node.js;
- dependências da aplicação;
- código do backend;
- variáveis de ambiente necessárias.

O backend deverá ser iniciado na VM e configurado para acessar o Cloud SQL.

### Etapa 4 — Validação da API

Antes da implantação do frontend, os endpoints da API serão testados diretamente.

Exemplos:

```text
GET /api/clientes
GET /api/produtos
GET /api/pedidos
GET /api/itens-pedido
GET /api/usuarios
```

Será verificado:

- status HTTP;
- quantidade de registros;
- tempo de resposta;
- tamanho da resposta;
- consistência dos dados.

### Etapa 5 — Frontend

O frontend React será compilado utilizando:

```bash
npm run build
```

O conteúdo gerado pelo Vite será publicado no ambiente destinado ao frontend.

O endereço da API utilizado pelo frontend deverá ser alterado do ambiente local:

```text
http://localhost:3000
```

para o endereço disponibilizado pelo backend na infraestrutura GCP.

### Etapa 6 — Arquivos e imagens

Os arquivos utilizados no experimento poderão ser enviados para um bucket específico do Cloud Storage.

Eles permanecerão separados do código-fonte.

A análise deverá registrar:

- quantidade de arquivos;
- volume armazenado;
- custo de armazenamento;
- volume transferido.

Essa informação deverá ser analisada separadamente do tamanho das respostas JSON.

### Etapa 7 — Medição

Após o ambiente estar funcionando, serão realizadas medições reais.

Serão observados principalmente:

- custo do Compute Engine;
- custo do Cloud SQL;
- custo do Cloud Storage;
- volume de Data Transfer;
- volume das respostas da API;
- tempo das consultas;
- quantidade de requisições;
- armazenamento utilizado.

Caso o Load Balancer seja posteriormente adicionado, seus custos também serão registrados.

---

## Volume de dados

É importante diferenciar três métricas.

### Volume das respostas JSON

Representa o volume dos dados serializados e transferidos pela API.

Exemplo:

```text
GET /api/pedidos

Registros: 9.731
Resposta JSON: X MB
Tempo: X ms
```

Essa métrica é especialmente relevante para comparação com as sincronizações anteriormente realizadas pelo AppSheet.

### Volume físico do banco

O tamanho físico ocupado pelo MySQL não é necessariamente igual ao tamanho das respostas JSON.

O armazenamento do banco pode incluir:

- dados;
- índices;
- estruturas internas do MySQL/InnoDB;
- outros metadados.

Por esse motivo, o tamanho físico do Cloud SQL deverá ser tratado como uma métrica distinta.

### Volume de arquivos

Imagens e outros arquivos binários também não devem ser confundidos com o volume JSON.

```text
Banco/JSON             X MB
Imagens e arquivos     Y MB
```

Quando necessário, poderá ser calculado:

```text
Volume total do sistema
=
dados estruturados
+
arquivos
```

---

## Comparação com AppSheet

Uma das finalidades do experimento é comparar o comportamento da nova arquitetura com os dados anteriormente obtidos através da API do AppSheet.

Os volumes do AppSheet foram obtidos através de chamadas de API realizadas via Postman.

As respostas eram transmitidas em JSON. Esse formato possui overhead decorrente da repetição dos nomes dos campos em cada objeto retornado.

Exemplo:

```json
[
    {
        "cliente": "...",
        "produto": "...",
        "quantidade": 10
    },
    {
        "cliente": "...",
        "produto": "...",
        "quantidade": 20
    }
]
```

Portanto, o volume observado em uma resposta JSON não representa diretamente o espaço físico ocupado pelos mesmos registros dentro de um banco relacional.

Essa diferença deverá ser considerada durante a análise dos resultados.

---

## Monitoramento de custos

O projeto deverá utilizar as ferramentas de faturamento do Google Cloud para acompanhar os custos reais da infraestrutura.

Antes da execução prolongada dos recursos, deverão ser configurados:

- orçamento;
- alertas de faturamento;
- acompanhamento por serviço.

Os custos deverão ser registrados separadamente por componente sempre que possível.

| Serviço | Custo estimado | Custo observado |
|---|---:|---:|
| Compute Engine | R$ X | R$ X |
| Cloud SQL | R$ X | R$ X |
| Cloud Storage | R$ X | R$ X |
| Data Transfer | R$ X | R$ X |
| Load Balancing | R$ X | R$ X |
| **Total** | **R$ X** | **R$ X** |

---

## Comparação estimativa × ambiente real

Ao final do período de testes, os valores observados serão comparados com os valores calculados anteriormente no Google Cloud Pricing Calculator.

A análise deverá considerar que cobranças podem depender de fatores como:

- período durante o qual o recurso permaneceu ativo;
- volume efetivamente armazenado;
- volume de tráfego;
- região;
- configuração das máquinas;
- utilização real dos serviços.

Por esse motivo, períodos menores que um mês deverão ser normalizados com cautela antes de serem comparados diretamente com estimativas mensais.

---

## Segurança

Nenhuma credencial deverá ser armazenada diretamente no código-fonte.

Informações como:

```text
DB_HOST
DB_PORT
DB_NAME
DB_USER
DB_PASSWORD
```

deverão permanecer em variáveis de ambiente.

O arquivo `.env` não deverá ser versionado.

O repositório deverá possuir apenas um `.env.example`, sem credenciais reais.

O acesso ao banco também deverá ser restrito à infraestrutura necessária para executar a aplicação.

---

## Objetivo final

Ao final da implantação, o ambiente deverá permitir analisar experimentalmente:

```text
Banco migrado
      ↓
Cloud SQL
      ↓
API Node/Express
      ↓
Compute Engine
      ↓
Frontend React
      ↓
consultas completas
      ↓
medição de volume e desempenho
      ↓
custos reais da infraestrutura
```

Os resultados obtidos serão utilizados para comparar:

1. a infraestrutura estimada;
2. a infraestrutura efetivamente utilizada;
3. o comportamento do banco migrado;
4. os custos reais observados no Google Cloud Platform.

Essa análise servirá como complemento prático ao estudo de viabilidade e TCO realizado anteriormente.
