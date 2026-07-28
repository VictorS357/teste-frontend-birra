const sequelize = require('../src/database/database');
const Usuario = require('../src/models/Usuario')(sequelize);
const Cliente = require('../src/models/Cliente')(sequelize);

async function syncDatabase() {
    try {
        console.log('Conectando ao banco...');

        await sequelize.authenticate();

        console.log('Conexão realizada com sucesso!');

        await sequelize.sync();

        console.log('Banco sincronizado com sucesso!');
    } catch (error) {
        console.error('Erro ao sincronizar o banco:');
        console.error(error);
    } finally {
        await sequelize.close();
    }
}

syncDatabase();