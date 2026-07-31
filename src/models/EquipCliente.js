const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const EquipCliente = sequelize.define(
        'EquipCliente',
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                allowNull: false,
                field: 'id'
            },

            clienteId: {
                type: DataTypes.UUID,
                allowNull: true,
                field: 'cliente_id'
            },

            desc: {
                type: DataTypes.TEXT,
                allowNull: true,
                field: 'desc'
            },

            foto: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'foto'
            }
        },
        {
            tableName: 'equip_cliente',
            timestamps: false
        }
    );

    return EquipCliente;
};