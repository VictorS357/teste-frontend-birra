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
                allowNull: false,
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

            produtoAtualId: {
                type: DataTypes.UUID,
                allowNull: true,
                field: 'produto_atual_id'
            }
        },
        {
            tableName: 'equip_recip',
            timestamps: false
        }
    );

    return EquipRecip;
};