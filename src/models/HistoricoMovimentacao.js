const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const HistoricoMovimentacoes = sequelize.define(
        'HistoricoMovimentacoes',
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                allowNull: false,
                field: 'id'
            },

            equipRecipId: {
                type: DataTypes.UUID,
                allowNull: false,
                field: 'equip_recip_id'
            },

            data: {
                type: DataTypes.DATE,
                allowNull: false,
                field: 'data'
            },

            tipo: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'tipo'
            },

            descricao: {
                type: DataTypes.TEXT,
                allowNull: true,
                field: 'descricao'
            },

            usuarioId: {
                type: DataTypes.UUID,
                allowNull: true,
                field: 'usuario_id'
            },

            qtde: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: true,
                field: 'qtde'
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

            produtoId: {
                type: DataTypes.UUID,
                allowNull: true,
                field: 'produto_id'
            },

            movimentarPara: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'movimentar_para'
            },

            itmSepId: {
                type: DataTypes.UUID,
                allowNull: true,
                field: 'itm_sep_id'
            },

            itmEntrId: {
                type: DataTypes.UUID,
                allowNull: true,
                field: 'itm_entr_id'
            },

            itmConcId: {
                type: DataTypes.UUID,
                allowNull: true,
                field: 'itm_conc_id'
            },

            nivel: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'nivel'
            },

            clienteId: {
                type: DataTypes.UUID,
                allowNull: true,
                field: 'cliente_id'
            }
        },
        {
            tableName: 'historico_movimentacoes',
            timestamps: false
        }
    );

    return HistoricoMovimentacoes;
};