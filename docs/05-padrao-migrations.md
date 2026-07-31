# Padrão de Migrations

## Objetivo

Este documento define o padrão utilizado para criação das Migrations do projeto.

As Migrations são responsáveis por versionar a estrutura do banco de dados.

Todo o banco deverá ser criado exclusivamente através delas.

---

# Organização

Cada tabela possuirá:

- 1 Model
- 1 Migration

Exemplo:

Usuario.js

↓

create-usuarios.js

---

# Ordem das Migrations

As Migrations deverão seguir uma ordem lógica de criação.

Inicialmente serão criadas apenas as tabelas.

Os relacionamentos (Foreign Keys) serão adicionados posteriormente em uma nova etapa.

---

# Estrutura

Todas as Migrations deverão seguir o padrão:

```javascript
'use strict';

module.exports = {

    async up(queryInterface, Sequelize) {

    },

    async down(queryInterface) {

    }

};
```

---

# Método up()

Responsável por criar ou modificar a estrutura do banco.

Exemplo:

```javascript
await queryInterface.createTable(
    'usuarios',
    {
        ...
    }
);
```

---

# Método down()

Responsável por desfazer a operação realizada no método up().

Exemplo:

```javascript
await queryInterface.dropTable('usuarios');
```

---

# Tipos

As Migrations deverão utilizar exatamente os mesmos tipos definidos nos Models.

Exemplo:

UUID

```javascript
Sequelize.UUID
```

Texto

```javascript
Sequelize.STRING
```

Texto longo

```javascript
Sequelize.TEXT
```

Data

```javascript
Sequelize.DATEONLY
```

Data e Hora

```javascript
Sequelize.DATE
```

Hora

```javascript
Sequelize.TIME
```

Boolean

```javascript
Sequelize.BOOLEAN
```

Inteiro

```javascript
Sequelize.INTEGER
```

Decimal

```javascript
Sequelize.DECIMAL(10,2)
```

Percentual

```javascript
Sequelize.DECIMAL(5,2)
```

---

# Chave Primária

Todas as tabelas utilizarão:

```javascript
id: {
    type: Sequelize.UUID,
    allowNull: false,
    primaryKey: true
}
```

Não será utilizado:

```javascript
defaultValue: Sequelize.UUIDV4
```

Os UUIDs serão preservados durante a importação dos dados do AppSheet.

---

# Convenção de nomes

Banco:

snake_case

JavaScript:

camelCase

As Migrations representam apenas o banco.

Portanto, todas as colunas deverão utilizar snake_case.

Exemplo:

```text
data_liberacao
usuario_entrega
cliente_id
```

---

# Timestamps

Nenhuma tabela utilizará:

createdAt

updatedAt

Todas as Migrations deverão respeitar:

```javascript
timestamps: false
```

(definido no Model)

---

# Foreign Keys

Durante a Fase 2, nenhuma Foreign Key será criada.

As referências serão adicionadas apenas na Fase 3 através de novas Migrations.

---

# Ordem das colunas

Sempre seguir a mesma ordem existente no AppSheet.

Isso facilita:

- comparação entre AppSheet e banco;
- manutenção;
- depuração;
- importação dos dados.

---

# Sincronização

É proibido utilizar:

- sequelize.sync()
- sync({ force: true })
- sync({ alter: true })

Toda alteração estrutural deverá ser feita através de novas Migrations.

---

# Reversão

Toda Migration deverá ser reversível através do método down().

Nunca criar uma Migration sem implementar o método down().