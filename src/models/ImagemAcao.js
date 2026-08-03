const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const ImagemAcao = sequelize.define(
        'ImagemAcao',
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

            acaoId: {
                type: DataTypes.UUID,
                allowNull: true,
                field: 'acao_id'
            },

            img: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'img'
            },

            responsavelId: {
                type: DataTypes.UUID,
                allowNull: true,
                field: 'responsavel_id'
            },

            dataEHora: {
                type: DataTypes.DATE,
                allowNull: true,
                field: 'data_e_hora'
            }
        },
        {
            tableName: 'imagens_acoes',
            timestamps: false
        }
    );

    ImagemAcao.associate = (models) => {
        ImagemAcao.belongsTo(models.Usuario, {
            foreignKey: 'responsavelId',
            as: 'responsavel'
        });
    };

    return ImagemAcao;
};