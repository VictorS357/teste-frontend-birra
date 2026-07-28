const db = require('../src/models');

async function syncDatabase() {
    try {
        console.log('Conectando ao banco...');

        await db.sequelize.authenticate();

        console.log('Conexão realizada com sucesso!');

        await db.sequelize.sync();

        console.log('Banco sincronizado com sucesso!');
    } catch (error) {
        console.error('Erro ao sincronizar o banco:');
        console.error(error);
    } finally {
        await db.sequelize.close();
    }
}

syncDatabase();