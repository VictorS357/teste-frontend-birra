const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const HistoricoMovimentacao = sequelize.define(
        'HistoricoMovimentacao',
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                allowNull: false,
                field: 'id'
            },

            equipRecip: {
                type: DataTypes.STRING,
                allowNull: false,
                field: 'equip_recip'
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

            itmSep: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
                field: 'itm_sep'
            },

            itmEntr: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'itm_entr'
            },

            itmConc: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
                field: 'itm_conc'
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
            },

            movimentarDe: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'movimentar_de'
            },

            classe: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'classe'
            },

            doc: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'doc'
            },

            poss: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'poss'
            }
        },
        {
            tableName: 'historico_movimentacoes',
            timestamps: false
        }
    );

    HistoricoMovimentacao.associate = (models) => {
        HistoricoMovimentacao.belongsTo(models.Usuario, {
            foreignKey: 'usuarioId',
            as: 'usuario'
        });

        HistoricoMovimentacao.belongsTo(models.Produto, {
            foreignKey: 'produtoId',
            as: 'produto'
        });

        HistoricoMovimentacao.belongsTo(models.Cliente, {
            foreignKey: 'clienteId',
            as: 'cliente'
        });
    };

    return HistoricoMovimentacao;
};