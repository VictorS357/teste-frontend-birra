# Mapeamento de Tipos - AppSheet → Sequelize → MySQL

## Objetivo

Este documento define como cada tipo de dado utilizado no AppSheet será representado na nova aplicação desenvolvida em Node.js utilizando Sequelize ORM e MySQL.

Todas as tabelas do projeto deverão seguir este padrão.

---

# Mapeamento de Tipos

| AppSheet | Sequelize | MySQL | Justificativa |
|----------|-----------|--------|---------------|
| Text | DataTypes.STRING | VARCHAR(255) | Texto curto de tamanho variável. |
| LongText | DataTypes.TEXT | TEXT | Campos com textos extensos, como observações. |
| Name | DataTypes.STRING | VARCHAR(255) | O tipo Name do AppSheet é armazenado como texto. |
| Phone | DataTypes.STRING | VARCHAR(30) | Telefones não devem ser armazenados como números. |
| Email | DataTypes.STRING | VARCHAR(255) | Armazenado como texto. Validação será feita pela aplicação. |
| URL | DataTypes.STRING | VARCHAR(500) | Armazena links e endereços web. |
| Address | DataTypes.STRING | VARCHAR(500) | Endereços completos serão armazenados como texto. |
| Enum | DataTypes.STRING | VARCHAR(255) | Os valores serão validados pela aplicação, evitando o uso de ENUM do MySQL. |
| Number | DataTypes.INTEGER | INT | Números inteiros. |
| Decimal | DataTypes.DECIMAL(10,2) | DECIMAL(10,2) | Valores decimais genéricos. |
| Price | DataTypes.DECIMAL(10,2) | DECIMAL(10,2) | Valores monetários. Utilizamos DECIMAL para evitar problemas de precisão. |
| Percent | DataTypes.DECIMAL(5,2) | DECIMAL(5,2) | Percentuais armazenados com precisão decimal. |
| Yes/No | DataTypes.BOOLEAN | BOOLEAN | Valores booleanos. |
| Date | DataTypes.DATEONLY | DATE | Armazena apenas a data. |
| Time | DataTypes.TIME | TIME | Armazena apenas o horário. |
| DateTime | DataTypes.DATE | DATETIME | Armazena data e hora. |
| Duration | DataTypes.INTEGER | INT | Armazenado em segundos. Caso seja necessário outro formato, será documentado futuramente. |
| ChangeTimestamp | DataTypes.DATE | DATETIME | Data e hora da última alteração. |
| ChangeCounter | DataTypes.INTEGER | INT | Contador de alterações. |
| Thumbnail | DataTypes.STRING | VARCHAR(500) | Armazena apenas o caminho ou URL da imagem. |
| Image | DataTypes.STRING | VARCHAR(500) | Armazena apenas o caminho ou URL da imagem. |
| File | DataTypes.STRING | VARCHAR(500) | Armazena apenas o caminho ou URL do arquivo. |
| Signature | DataTypes.STRING | VARCHAR(500) | Armazena apenas o caminho ou URL da assinatura. |
| Ref | DataTypes.UUID | CHAR(36) | Referência para outra tabela utilizando UUID como chave primária. |
| Color    | DataTypes.STRING | VARCHAR(20) | Armazena valores de cores (HEX, RGB ou nome da cor). |


---

# Campos Obrigatórios

Quando uma coluna estiver marcada como **Required** no AppSheet, ela será representada no Sequelize com:

```javascript
allowNull: false
```

---

# Tipo da Chave Primária

Todas as tabelas utilizarão UUID como chave primária.

Essa decisão foi tomada para preservar os identificadores já existentes no AppSheet e facilitar a migração dos dados e dos relacionamentos entre as tabelas.

---

## Relacionamentos no Sequelize

Todos os relacionamentos do AppSheet serão convertidos para associações nativas do Sequelize.

Exemplos:

- Pedido.belongsTo(Cliente)
- Cliente.hasMany(Pedido)

As colunas "Related ..." existentes no AppSheet não serão migradas para o banco, pois elas serão representadas automaticamente pelas associações entre os Models.

---

# Colunas Virtuais

As colunas virtuais do AppSheet **não serão migradas para o MySQL**.

Essas colunas são calculadas dinamicamente pela plataforma e serão substituídas por consultas utilizando Sequelize e relacionamentos entre Models.

Exemplos:

- Related Pedidos
- Related ItensPedido
- Related Produtos

---

# Imagens e Arquivos

Os arquivos utilizados pelo AppSheet (Image, Thumbnail, File e Signature) não serão armazenados diretamente no banco de dados.

Será armazenado apenas o caminho (path) ou URL do arquivo.

A responsabilidade pelo armazenamento físico ficará para uma etapa futura do projeto.

---

# Convenções Gerais

- Banco de dados em **snake_case**.
- Código JavaScript em **camelCase**.
- Models no singular.
- Tabelas no plural.
- Chave primária sempre chamada `id`.

---

## Revisões

Este documento poderá ser atualizado durante o desenvolvimento caso novos tipos do AppSheet sejam identificados.