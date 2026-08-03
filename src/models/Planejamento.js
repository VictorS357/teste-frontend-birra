const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Planejamento = sequelize.define(
        'Planejamento',
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                allowNull: false,
                field: 'id'
            },

            dataSolicitacao: {
                type: DataTypes.DATEONLY,
                allowNull: true,
                field: 'data_solicitacao'
            },

            descricao: {
                type: DataTypes.TEXT,
                allowNull: true,
                field: 'descricao'
            },

            tipo: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'tipo'
            },

            status: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'status'
            },

            responsavelId: {
                type: DataTypes.UUID,
                allowNull: true,
                field: 'responsavel_id'
            },

            urgencia: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'urgencia'
            },

            parecerDoResponsavel: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'parecer_do_responsavel'
            },

            prazoDeConclusao: {
                type: DataTypes.DATEONLY,
                allowNull: true,
                field: 'prazo_de_conclusao'
            },

            clienteId: {
                type: DataTypes.UUID,
                allowNull: true,
                field: 'cliente_id'
            },

            parecerDoCliente: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'parecer_do_cliente'
            },

            assinaturaDoCliente: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'assinatura_do_cliente'
            },

            dataDeConclusao: {
                type: DataTypes.DATEONLY,
                allowNull: true,
                field: 'data_de_conclusao'
            },

            solicitanteId: {
                type: DataTypes.UUID,
                allowNull: true,
                field: 'solicitante_id'
            },

            dataInicio: {
                type: DataTypes.DATEONLY,
                allowNull: true,
                field: 'data_inicio'
            },

            privacidade: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'privacidade'
            },

            foto: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'foto'
            }
        },
        {
            tableName: 'planejamento',
            timestamps: false
        }
    );

    Planejamento.associate = (models) => {
        Planejamento.belongsTo(models.Usuario, {
            foreignKey: 'responsavelId',
            as: 'responsavel'
        });

        Planejamento.belongsTo(models.Usuario, {
            foreignKey: 'solicitanteId',
            as: 'solicitante'
        });

        Planejamento.belongsTo(models.Cliente, {
            foreignKey: 'clienteId',
            as: 'cliente'
        });

        Planejamento.hasMany(models.ImagemAcao, {
            foreignKey: 'acaoId',
            as: 'imagens'
        });
    };

    return Planejamento;
};