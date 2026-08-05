const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Cliente = sequelize.define(
        'Cliente',
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                allowNull: false,
                field: 'id'
            },

            nome: {
                type: DataTypes.STRING,
                allowNull: false,
                field: 'nome'
            },

            tipo: {
                type: DataTypes.STRING,
                allowNull: false,
                field: 'tipo'
            },

            razaoSocial: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'razao_social'
            },

            cpfCnpj: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'cpf_cnpj'
            },

            contato: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'contato'
            },

            telefone: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'telefone'
            },

            abre: {
                type: DataTypes.TIME,
                allowNull: true,
                field: 'abre'
            },

            fecha: {
                type: DataTypes.TIME,
                allowNull: true,
                field: 'fecha'
            },

            local: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'local'
            },

            condPgto: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'cond_pgto'
            },

            obs: {
                type: DataTypes.TEXT,
                allowNull: true,
                field: 'obs'
            },

            cidade: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'cidade'
            },

            imagem: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'imagem'
            },

            ultimaLimpeza: {
                type: DataTypes.DATEONLY,
                allowNull: true,
                field: 'ultima_limpeza'
            },

            inadi: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: true,
                field: 'inadi'
            },

            stsCol: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'sts_col'
            }
        },
        {
            tableName: 'clientes',
            timestamps: false
        }
    );

    Cliente.associate = (models) => {
        Cliente.hasMany(models.Pedido, {
            foreignKey: 'clienteId',
            as: 'pedidos'
        });

        Cliente.hasMany(models.Planejamento, {
            foreignKey: 'clienteId',
            as: 'planejamentos'
        });

        Cliente.hasMany(models.EquipCliente, {
            foreignKey: 'clienteId',
            as: 'equipamentos'
        });

        Cliente.hasMany(models.HistoricoMovimentacoes, {
            foreignKey: 'clienteId',
            as: 'historicos'
        });

        Cliente.hasMany(models.TabelaPreco, {
            foreignKey: 'clienteId',
            as: 'tabelasPreco'
        });
    };

    return Cliente;
};