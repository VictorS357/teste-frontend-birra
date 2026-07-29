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

    return Produto;
};