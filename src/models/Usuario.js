const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Usuario = sequelize.define(
        'Usuario',
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                allowNull: false,
                field: 'id'
            },

            nome: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'nome'
            },

            email: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'email'
            },

            tipo: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'tipo'
            },

            foto: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'foto'
            },

            telaInicial: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'tela_inicial'
            },

            dataInicio: {
                type: DataTypes.DATEONLY,
                allowNull: true,
                field: 'data_inicio'
            },

            dataFim: {
                type: DataTypes.DATEONLY,
                allowNull: true,
                field: 'data_fim'
            }
        },
        {
            tableName: 'usuarios',
            timestamps: false
        }
    );

    Usuario.associate = (models) => {
        Usuario.hasMany(models.Pedido, {
            foreignKey: 'responsavelId',
            as: 'pedidosResponsavel'
        });

        Usuario.hasMany(models.MovMassaPai, {
            foreignKey: 'usuarioId',
            as: 'movimentacoesMassa'
        });

        Usuario.hasMany(models.Planejamento, {
            foreignKey: 'responsavelId',
            as: 'planejamentosResponsavel'
        });

        Usuario.hasMany(models.Planejamneto, {
            foreignKey: 'solicitanteId',
            as: 'planejamentosSolicitados'
        });

        Usuario.hasMany(models.ImagemAcao, {
            foreignKey: 'responsavelId',
            as: 'imagensAcoes'
        });

        Usuario.hasMany(models.HistoricoMovimentacoes, {
            foreignKey: 'usuarioId',
            as: 'historicos'
        });

        Usuario.hasMany(models.RotaDeChopeiraPai, {
            foreignKey: 'respId',
            as: 'rotasResponsavel'
        });
    };

    return Usuario;
};