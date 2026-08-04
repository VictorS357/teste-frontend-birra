const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Produto = sequelize.define(
        'Produto',
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                allowNull: false,
                field: 'id'
            },

            descricao: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'descricao'
            },

            valorUnit: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: true,
                field: 'valor_unit'
            },

            obs: {
                type: DataTypes.TEXT,
                allowNull: true,
                field: 'obs'
            },

            unidadeMedida: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'unidade_medida'
            },

            imagem: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'imagem'
            },

            retornavel: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
                field: 'retornavel'
            },

            estoque: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: true,
                field: 'estoque'
            }
        },
        {
            tableName: 'produtos',
            timestamps: false
        }
    );

    Produto.associate = (models) => {
        Produto.hasMany(models.ItemPedido, {
            foreignKey: 'produtoId',
            as: 'itensPedido'
        });

        Produto.hasMany(models.EquipRecip, {
            foreignKey: 'produtoId',
            as: 'equipamentosOriginais'
        });

        Produto.hasMany(models.EquipRecip, {
            foreignKey: 'produtoAtualId',
            as: 'equipamentosAtuais'
        });

        Produto.hasMany(models.MovMassaPai, {
            foreignKey: 'produtoId',
            as: 'movimentacoesMassa'
        });

        Produto.hasMany(models.HistoricoMovimentacoes, {
            foreignKey: 'produtoId',
            as: 'historicos'
        });

        Produto.hasMany(models.TabelaPreco, {
            foreignKey: 'produtoId',
            as: 'tabelasPreco'
        });
    };

    return Produto;
};