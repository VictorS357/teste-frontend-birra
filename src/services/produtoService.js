const db = require('../models');

async function listarProdutos() {
    const produtos = await db.Produto.findAll({
        order: [
            ['descricao', 'ASC']
        ]
    });

    return produtos;
}

module.exports = {
    listarProdutos
};