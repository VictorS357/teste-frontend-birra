const db = require('./src/models');

async function teste() {
    try {
        const pedidos = await db.Pedido.findAll({
            include: [
                {
                    model: db.Cliente,
                    as: 'cliente'
                },
                {
                    model: db.Usuario,
                    as: 'responsavel'
                },
                {
                    model: db.ItemPedido,
                    as: 'itens'
                },
                {
                    model: db.RotaDeChopeiraFilho,
                    as: 'rotas'
                }
            ],
            limit: 5
        });

        console.dir(pedidos, { depth: null });

    } catch (error) {
        console.error(error);
    } finally {
        await db.sequelize.close();
    }
}

teste();