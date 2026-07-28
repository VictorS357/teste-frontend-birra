const sequelize = require('../src/database/database');

async function testConnection() {
    try {
        await sequelize.authenticate();

        console.log('Conexão com o MySQL realizada com sucesso');
    } catch (error) {
        console.error('Erro ao conectar com o banco de dados');
        console.error(error);
    } finally {
        await sequelize.close();
    }
}

testConnection();