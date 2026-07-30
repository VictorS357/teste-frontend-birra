const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const RotaDeChopeiraFilho = sequelize.define(
        'RotaDeChopeiraFilho',
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                allowNull: false,
                field: 'id'
            },

            rotaPaiId: {
                type: DataTypes.UUID,
                allowNull: false,
                field: 'rota_pai_id'
            },

            ordem: {
                type: DataTypes.INTEGER,
                allowNull: false,
                field: 'ordem'
            },

            pedidoId: {
                type: DataTypes.UUID,
                allowNull: false,
                field: 'pedido_id'
            }
        },
        {
            tableName: 'rotas_de_chopeira_filho',
            timestamps: false
        }
    );

    return RotaDeChopeiraFilho;
};