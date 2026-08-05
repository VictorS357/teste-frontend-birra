# Políticas de Importação de Dados

## Objetivo

Este documento registra as regras adotadas durante a migração dos dados do AppSheet para o banco MySQL.

A importação prioriza:

- preservação dos dados originais;
- integridade referencial;
- consistência comercial;
- rastreabilidade dos registros ignorados;
- não criação de informações inexistentes na origem.

---

# Princípio geral

Um registro será importado quando possuir os dados mínimos necessários para manter seu significado no novo sistema.

Quando a ausência de um campo comprometer:

- a identificação do registro;
- sua relação com outra entidade;
- sua lógica de existência;
- seu significado comercial;

o registro poderá ser ignorado durante a migração.

A exclusão da importação deverá sempre gerar uma mensagem no terminal contendo, quando possível:

- número da linha;
- identificador do registro;
- entidade relacionada;
- motivo pelo qual o registro foi ignorado.

---

# Dados opcionais

Campos opcionais que estiverem vazios serão armazenados como:

```text
NULL