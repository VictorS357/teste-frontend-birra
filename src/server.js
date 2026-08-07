require('dotenv').config();

const app = require('./app');
const db = require('./models');

const PORT = process.env.PORT || 3000;

async function iniciarServidor() {
    try {
        await db.sequelize.authenticate();

        console.log('Conexão com o banco realizada com sucesso');

        app.listen(PORT, () => {
            console.log(
                `API rodando em https://localhost:${PORT}`
            );
        });
    } catch (error) {
        console.error(
            'Erro ao iniciar a aplicação:',
            error
        );

        process.exit(1);
    }
}

iniciarServidor();