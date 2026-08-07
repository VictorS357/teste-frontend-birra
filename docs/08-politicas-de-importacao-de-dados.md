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

# Limitações encontradas nas exportações do AppSheet

Durante o processo de migração foi identificado que algumas tabelas exportadas pelo AppSheet não apresentavam uma estrutura adequada para importação automática.

Os principais problemas encontrados foram:

- ausência do cabeçalho original;
- cabeçalhos substituídos por valores numéricos;
- exportações contendo apenas visualizações (views) da aplicação, e não a tabela original;
- planilhas contendo informações de outras entidades, apesar de estarem agrupadas no mesmo arquivo;
- ausência de padronização entre as páginas do mesmo arquivo.

## Caso da tabela EquipRecip

O arquivo exportado referente aos equipamentos possuía cinco páginas.

Após análise, foi identificado que apenas uma delas correspondia à estrutura original da tabela `EquipRecip`.

### Página 1

Contém a estrutura completa da tabela e foi utilizada na importação.

Exemplo de cabeçalho:

```text
Row ID
Identificador
Tipo
Capacidade
QrCode
Lote
Validade
Status
Produto
ItemPedidoSep
Descricao
ItemPedidoEntr
AuxPDF
ProdutoAtual
Cliente
UltMov

# Inconsistências nos dados de origem

Durante a migração também foram identificadas diversas inconsistências entre a configuração das tabelas no AppSheet e os dados efetivamente armazenados.

Em vários casos, campos definidos como **Required** na modelagem da aplicação continham registros com valores ausentes.

Essa inconsistência impactou diretamente o desenvolvimento dos scripts de importação, exigindo análises adicionais para distinguir entre:

- campos que realmente deveriam impedir a importação;
- campos cuja obrigatoriedade existia apenas na modelagem, mas não era respeitada pelos dados históricos;
- campos que poderiam ser alterados para aceitar `NULL` sem comprometer a integridade do domínio.

Como consequência, diversas regras de importação precisaram ser revisadas durante o desenvolvimento.

---

## Exemplos encontrados

### Pedidos

Foram encontrados registros sem informações consideradas obrigatórias, como:

- Hora;
- Solicitado;
- Cliente (em alguns registros).

As decisões adotadas foram:

| Campo | Política |
|--------|-----------|
| Hora | Alterado para aceitar `NULL`. |
| Solicitado | Alterado para aceitar `NULL`. |
| Cliente | Registro ignorado, pois o pedido perde seu significado comercial sem um cliente associado. |

---

### Itens de Pedido

Também foram identificados diversos registros contendo ausência de informações importantes.

Exemplos:

- ValorUnit vazio;
- Produto vazio;
- Quantidade vazia;
- Pedido inexistente em decorrência da exclusão de pedidos inválidos.

As decisões adotadas foram:

| Campo | Política |
|--------|-----------|
| ValorUnit | Alterado para aceitar `NULL`, preservando o dado original sem inferências. |
| Produto | Registro ignorado. |
| Qtde | Registro ignorado. |
| Pedido inexistente | Registro ignorado. |

---

### EquipRecip

Foi identificada divergência entre a estrutura originalmente modelada no banco e os dados exportados pelo AppSheet.

Alguns campos possuíam natureza diferente da inicialmente prevista.

Exemplos:

| Campo | Situação encontrada |
|--------|---------------------|
| ProdutoAtual | Identificado como campo do tipo Enum, e não uma referência para Produto. |
| Cliente | Campo obrigatório não modelado inicialmente. |
| UltMov | Campo do tipo Date não existente na primeira versão do banco. |

Essas diferenças exigiram ajustes estruturais no banco de dados antes do início da importação.

---

## Impacto na migração

Essas inconsistências aumentaram significativamente a complexidade do processo de migração.

Além do desenvolvimento dos scripts de importação, foi necessário:

- revisar continuamente a modelagem do banco;
- comparar a estrutura do AppSheet com os dados efetivamente exportados;
- adaptar Models e Migrations para refletir a realidade dos dados;
- implementar políticas específicas para tratamento de registros inconsistentes;
- registrar todas as decisões técnicas adotadas durante o processo.

Em razão dessas inconsistências, o tempo necessário para concluir a migração foi superior ao inicialmente estimado.

Entretanto, a adoção dessas verificações permitiu preservar a integridade referencial do banco de dados e evitar a inserção de registros incompletos ou inconsistentes.

## Tabelas ausentes na exportação

Durante a migração, algumas tabelas previstas na aplicação não estavam presentes no material exportado recebido.

Foram identificadas como ausentes:

- `Comprovantes`;
- `Files`;
- `Etiquetas`;
- `MovMassaPai`;
- `MovMassaFilho`;
- `RotasDeChopeiraPai`;
- `RotasDeChopeiraFilho`.

Em alguns casos, foram disponibilizados apenas arquivos físicos, como imagens, mas sem os registros estruturados correspondentes no AppSheet.

Sem os dados originais das tabelas, não é possível reconstruir com segurança informações como:

- identificadores;
- relacionamentos com outras entidades;
- datas;
- caminhos;
- nomes de arquivo;
- metadados;
- demais atributos específicos de cada registro.

Por esse motivo, optou-se por não criar registros artificiais no banco de dados.

As estruturas das tabelas e seus Models permanecem no sistema para uso futuro e para criação de novos registros.

Caso uma exportação estruturada dessas tabelas seja disponibilizada posteriormente, a importação poderá ser realizada em uma nova etapa.