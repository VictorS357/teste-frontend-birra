# Planejamento do Projeto

## Objetivo

Este documento define oficialmente as fases do desenvolvimento da aplicação.

Todas as atividades deverão respeitar esta sequência.

---

# Fase 1 — Modelagem

Objetivo:

Criar toda a estrutura da aplicação utilizando Sequelize.

Nesta fase será realizado:

- criação dos Models;
- padronização dos tipos;
- revisão da modelagem.

Não será realizado:

- relacionamentos;
- migrations;
- importação de dados;
- API;
- frontend.

---

# Fase 2 — Banco de Dados

Objetivo:

Criar definitivamente o banco de dados.

Nesta fase será realizado:

- criação das Migrations;
- criação das tabelas;
- validação da estrutura do banco.

---

# Fase 3 — Relacionamentos

Objetivo:

Adicionar os relacionamentos entre os Models.

Nesta fase serão implementados:

- belongsTo();
- hasMany();
- belongsToMany();

Também serão criadas as migrations das chaves estrangeiras.

---

# Fase 4 — Migração dos Dados

Objetivo:

Migrar os dados existentes no AppSheet.

Nesta fase será realizado:

- exportação para CSV;
- importação para MySQL;
- preservação dos UUIDs;
- validação da integridade dos relacionamentos.

---

# Fase 5 — API

Objetivo:

Construir toda a camada de backend.

Nesta fase serão implementados:

- Controllers;
- Services;
- Routes;
- Middlewares;
- Validações;
- Tratamento de erros.

---

# Fase 6 — Frontend

Objetivo:

Desenvolver a interface da aplicação.

Nesta fase será realizada toda a integração com a API.

---

# Fase 7 — Google Cloud

Objetivo:

Publicar a aplicação em ambiente de produção.

Nesta fase serão configurados:

- Google Cloud SQL;
- Storage;
- Deploy;
- Variáveis de ambiente;
- Segurança;
- Backup.

---

# Regra Geral

Nenhuma atividade deverá ser iniciada antes da conclusão da fase anterior, salvo decisão técnica documentada.