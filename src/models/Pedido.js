const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Pedido = sequelize.define(
        'Pedido',
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                allowNull: false,
                field: 'id'
            },

            clienteId: {
                type: DataTypes.UUID,
                allowNull: false,
                field: 'cliente_id'
            },

            responsavelId: {
                type: DataTypes.UUID,
                allowNull: true,
                field: 'responsavel_id'
            },

            data: {
                type: DataTypes.DATEONLY,
                allowNull: false,
                field: 'data'
            },

            hora: {
                type: DataTypes.TIME,
                allowNull: false,
                field: 'hora'
            },

            taxaEntrega: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                field: 'taxa_entrega'
            },

            localCliente: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'local_cliente'
            },

            localPedido: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'local_pedido'
            },

            obs: {
                type: DataTypes.TEXT,
                allowNull: true,
                field: 'obs'
            },

            status: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'status'
            },

            auxOrc: {
                type: DataTypes.INTEGER,
                allowNull: false,
                field: 'aux_orc'
            },

            auxRota: {
                type: DataTypes.INTEGER,
                allowNull: false,
                field: 'aux_rota'
            },

            obsColeta: {
                type: DataTypes.TEXT,
                allowNull: true,
                field: 'obs_coleta'
            },

            solicitado: {
                type: DataTypes.DATEONLY,
                allowNull: false,
                field: 'solicitado'
            },

            dataLiberacao: {
                type: DataTypes.DATEONLY,
                allowNull: true,
                field: 'data_liberacao'
            },

            usuarioLiberacao: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'usuario_liberacao'
            },

            dataSeparacao: {
                type: DataTypes.DATEONLY,
                allowNull: true,
                field: 'data_separacao'
            },

            usuarioSeparacao: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'usuario_separacao'
            },

            dataEntrega: {
                type: DataTypes.DATEONLY,
                allowNull: true,
                field: 'data_entrega'
            },

            usuarioEntrega: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'usuario_entrega'
            },

            dataConclusao: {
                type: DataTypes.DATEONLY,
                allowNull: true,
                field: 'data_conclusao'
            },

            usuarioConclusao: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'usuario_conclusao'
            },

            assinatura: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'assinatura'
            },

            comprovanteGerado: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
                field: 'comprovante_gerado'
            },

            comprovanteEnviado: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
                field: 'comprovante_enviado'
            },

            coletadoAut: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
                field: 'coletado_aut'
            },

            dataHoraColeta: {
                type: DataTypes.DATE,
                allowNull: true,
                field: 'data_hora_coleta'
            },

            fotoGas: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'foto_gas'
            },

            cidadeEntrega: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'cidade_entrega'
            },
            
            identificador: {
                type: DataTypes.STRING,
                allowNull: false,
                field: 'identificador'
            },

            ultNot: {
                type: DataTypes.DATE,
                allowNull: true,
                field: 'ult_not'
            },

            revenda: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
                field: 'revenda'
            },

            fotoCopoEntrega: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'foto_copo_entrega'
            },

            fotoCopoColeta: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'foto_copo_coleta'
            }
        },
        {
            tableName: 'pedidos',
            timestamps: false
        }
    );

    Pedido.associate = (models) => {
        Pedido.belongsTo(models.Cliente, {
            foreignKey: 'clienteId',
            as: 'cliente'
        });

        Pedido.belongsTo(models.Usuario, {
            foreignKey: 'responsavelId',
            as: 'responsavel'
        });

        Pedido.hasMany(models.ItemPedido, {
            foreignKey: 'pedidoId',
            as: 'itens'
        });

        Pedido.hasMany(models.RotaDeChopeiraFilho, {
            foreignKey: 'pedidoId',
            as: 'rotas'
        });
    };

    return Pedido;
};