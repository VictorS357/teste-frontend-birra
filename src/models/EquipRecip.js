const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const EquipRecip = sequelize.define(
        'EquipRecip',
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                allowNull: false,
                field: 'id'
            },

            identificador: {
                type: DataTypes.STRING,
                allowNull: false,
                field: 'identificador'
            },

            tipo: {
                type: DataTypes.STRING,
                allowNull: false,
                field: 'tipo'
            },

            capacidade: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                field: 'capacidade'
            },

            qrcode: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'qrcode'
            },

            lote: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'lote'
            },

            validade: {
                type: DataTypes.DATEONLY,
                allowNull: true,
                field: 'validade'
            },

            status: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'status'
            },

            produtoId: {
                type: DataTypes.UUID,
                allowNull: true,
                field: 'produto_id'
            },

            itemPedidoSepId: {
                type: DataTypes.UUID,
                allowNull: true,
                field: 'item_pedido_sep_id'
            },

            descricao: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'descricao'
            },

            itemPedidoEntrId: {
                type: DataTypes.UUID,
                allowNull: true,
                field: 'item_pedido_entr_id'
            },

            auxPdf: {
                type: DataTypes.DATE,
                allowNull: true,
                field: 'aux_pdf'
            },

            produtoAtual: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'produto_atual'
            },

            clienteId: {
                type: DataTypes.UUID,
                allowNull: false,
                field: 'cliente_id'
            },

            ultMov: {
                type: DataTypes.DATEONLY,
                allowNull: true,
                field: 'ult_mov'
            }
        },
        {
            tableName: 'equip_recip',
            timestamps: false
        }
    );

    EquipRecip.associate = (models) => {
        EquipRecip.belongsTo(models.Produto, {
            foreignKey: 'produtoId',
            as: 'produto'
        });

        EquipRecip.belongsTo(models.Cliente, {
            foreignKey: 'clienteId',
            as: 'cliente'
        });

        EquipRecip.belongsTo(models.ItemPedido, {
            foreignKey: 'itemPedidoSepId',
            as: 'itemSeparacao'
        });

        EquipRecip.belongsTo(models.ItemPedido, {
            foreignKey: 'itemPedidoEntrId',
            as: 'itemEntrega'
        });

        EquipRecip.hasMany(models.MovMassaFilho, {
            foreignKey: 'equipRecipId',
            as: 'movimentacoesMassa'
        });

        EquipRecip.hasMany(models.HistoricoMovimentacoes, {
            foreignKey: 'equipRecipId',
            as: 'historicos'
        });
    }

    return EquipRecip;
};