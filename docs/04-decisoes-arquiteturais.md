# Decisões Arquiteturais

## Objetivo

Este documento registra as principais decisões arquiteturais tomadas durante o desenvolvimento do projeto, bem como suas justificativas.

---

# UUID como chave primária

## Decisão

Todas as tabelas utilizarão UUID como chave primária.

## Justificativa

O AppSheet já utiliza identificadores únicos.

Preservar esses identificadores simplifica a migração dos dados e mantém todos os relacionamentos existentes.

---

# Não utilizar ENUM do MySQL

## Decisão

Os campos Enum serão armazenados como VARCHAR.

## Justificativa

Essa abordagem oferece maior flexibilidade para inclusão ou alteração de valores permitidos sem necessidade de novas migrations.

A validação será responsabilidade da aplicação.

---

# Utilização de DECIMAL para valores monetários

## Decisão

Todos os campos financeiros utilizarão DECIMAL.

## Justificativa

Evita erros de arredondamento presentes em FLOAT e DOUBLE.

---

# Não migrar colunas virtuais

## Decisão

As colunas virtuais do AppSheet não serão armazenadas no banco.

## Justificativa

Essas colunas representam cálculos ou relacionamentos realizados automaticamente pelo AppSheet.

Na nova aplicação, serão substituídas por consultas utilizando Sequelize.

---

# Armazenamento de arquivos

## Decisão

Image, Thumbnail, Signature e File armazenarão apenas o caminho ou URL.

## Justificativa

O banco de dados não deve armazenar arquivos binários.

O armazenamento físico será tratado posteriormente.

---

# Separação entre Modelagem e Relacionamentos

## Decisão

Primeiro serão criados todos os Models.

Somente depois serão implementados os relacionamentos.

## Justificativa

Essa abordagem reduz retrabalho e facilita a revisão completa da modelagem antes da criação das chaves estrangeiras.

---

# Utilização de Migrations

## Decisão

O banco de dados será criado exclusivamente através de Migrations.

## Justificativa

As Migrations permitem controle de versão do banco, reprodutibilidade do ambiente e rastreabilidade das alterações.

---

# Preservação da nomenclatura do AppSheet

## Decisão

Os nomes dos campos permanecerão iguais aos existentes no AppSheet.

As únicas adaptações permitidas são:

- camelCase no JavaScript;
- snake_case no banco de dados;
- remoção de acentos;
- acréscimo do sufixo "Id" em campos Ref.

## Justificativa

Preservar a nomenclatura facilita a migração dos dados, reduz erros de interpretação e torna a comparação entre os dois sistemas mais simples.

---

# Estratégia de Desenvolvimento

## Decisão

O projeto seguirá obrigatoriamente as seguintes fases:

1. Modelagem
2. Banco de Dados
3. Relacionamentos
4. Migração dos Dados
5. API
6. Frontend
7. Google Cloud

## Justificativa

A divisão em fases reduz a complexidade do desenvolvimento, facilita a validação incremental e diminui o risco de retrabalho.

---

# Revisão das Decisões

Este documento poderá ser atualizado caso novas decisões arquiteturais sejam tomadas durante o desenvolvimento do projeto.

Toda alteração deverá conter sua respectiva justificativa.