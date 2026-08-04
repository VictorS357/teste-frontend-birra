const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const TabelaPreco = sequelize.define(
        'TabelaPreco',
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                allowNull: false,
                field: 'id'
            },

            identificador: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'identificador'
            },

            clienteId: {
                type: DataTypes.UUID,
                allowNull: false,
                field: 'cliente_id'
            },

            produtoId: {
                type: DataTypes.UUID,
                allowNull: false,
                field: 'produto_id'
            },

            preco: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                field: 'preco'
            },

            obs: {
                type: DataTypes.TEXT,
                allowNull: true,
                field: 'obs'
            }
        },
        {
            tableName: 'tabela_preco',
            timestamps: false
        }
    );

    TabelaPreco.associate = (models) => {
        TabelaPreco.belongsTo(models.Cliente, {
            foreignKey: 'clienteId',
            as: 'cliente'
        });

        TabelaPreco.belongsTo(models.Produto, {
            foreignKey: 'produtoId',
            as: 'produto'
        });
    };

    return TabelaPreco;
};