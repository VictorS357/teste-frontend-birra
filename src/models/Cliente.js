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
            }
        },
        {
            tableName: 'clientes',
            timestamps: false
        }
    );

    return Cliente;
};