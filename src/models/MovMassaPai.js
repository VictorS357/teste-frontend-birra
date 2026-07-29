const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const MovMassaPai = sequelize.define(
        'MovMassaPai',
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                allowNull: false,
                field: 'id'
            },

            usuarioId: {
                type: DataTypes.UUID,
                allowNull: false,
                field: 'usuario_id'
            },

            movimentarPara: {
                type: DataTypes.STRING,
                allowNull: false,
                field: 'movimentar_para'
            },

            timestamp: {
                type: DataTypes.DATE,
                allowNull: true,
                field: 'timestamp'
            },

            tipo: {
                type: DataTypes.STRING,
                allowNull: false,
                field: 'tipo'
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
            }
        },
        {
            tableName: 'mov_massa_pai',
            timestamps: false
        }
    );

    return MovMassaPai;
};