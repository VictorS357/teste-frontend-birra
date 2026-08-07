const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const ItemPedido = sequelize.define(
        'ItemPedido',
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

            pedidoId: {
                type: DataTypes.UUID,
                allowNull: false,
                field: 'pedido_id'
            },

            produtoId: {
                type: DataTypes.UUID,
                allowNull: false,
                field: 'produto_id'
            },

            qtde: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                field: 'qtde'
            },

            valorUnit: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: true,
                field: 'valor_unit'
            },

            ajuste: {
                type: DataTypes.DECIMAL(5, 2),
                allowNull: true,
                field: 'ajuste'
            },

            ajuste2: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'ajuste2'
            },

            valorTotal: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: true,
                field: 'valor_total'
            },

            obs: {
                type: DataTypes.TEXT,
                allowNull: true,
                field: 'obs'
            },

            bonificacao: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
                field: 'bonificacao'
            },

            volumes: {
                type: DataTypes.INTEGER,
                allowNull: true,
                field: 'volumes'
            },

            liberado: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
                field: 'liberado'
            },

            sobra: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: true,
                field: 'sobra'
            },

            entregue: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
                field: 'entregue'
            },

            concluido: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
                field: 'concluido'
            }
        },
        {
            tableName: 'itens_pedido',
            timestamps: false
        }
    );

    ItemPedido.associate = (models) => {
        ItemPedido.belongsTo(models.Pedido, {
            foreignKey: 'pedidoId',
            as: 'pedido'
        });

        ItemPedido.belongsTo(models.Produto, {
            foreignKey: 'produtoId',
            as: 'produto'
        });

        ItemPedido.hasMany(models.EquipRecip, {
            foreignKey: 'itemPedidoSepId',
            as: 'equipamentosSeparados'
        });

        ItemPedido.hasMany(models.EquipRecip, {
            foreignKey: 'itemPedidoEntrId',
            as: 'equipamentosEntrados'
        });
    };  

    return ItemPedido;
};