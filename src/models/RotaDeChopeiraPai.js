const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const RotaDeChopeiraPai = sequelize.define(
        'RotaDeChopeiraPai',
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                allowNull: false,
                field: 'id'
            },

            cor: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'cor'
            },

            respId: {
                type: DataTypes.UUID,
                allowNull: true,
                field: 'resp_id'
            },

            data: {
                type: DataTypes.DATEONLY,
                allowNull: false,
                field: 'data'
            },

            status: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'status'
            }
        },
        {
            tableName: 'rotas_de_chopeira_pai',
            timestamps: false
        }
    );

    return RotaDeChopeiraPai;
};