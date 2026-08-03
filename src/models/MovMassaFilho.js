const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const MovMassaFilho = sequelize.define(
        'MovMassaFilho',
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                allowNull: false,
                field: 'id'
            },

            movMassaPaiId: {
                type: DataTypes.UUID,
                allowNull: false,
                field: 'mov_massa_pai_id'
            },

            equipRecipId: {
                type: DataTypes.UUID,
                allowNull: false,
                field: 'equip_recip_id'
            },

            timestamp: {
                type: DataTypes.DATE,
                allowNull: true,
                field: 'timestamp'
            }
        },
        {
            tableName: 'mov_massa_filho',
            timestamps: false
        }
    );

    MovMassaFilho.associate = (models) => {
        MovMassaFilho.belongsTo(models.MovMassaPai, {
            foreignKey: 'movMassaPaiId',
            as: 'movimentacao'
        });

        MovMassaFilho.belongsTo(models.EquipRecip, {
            foreignKey: 'equipRecipId',
            as: 'equipamento'
        });
    };

    return MovMassaFilho;
};