const produtoService = require('../services/produtoService');

async function listarProdutos(req, res) {
    try {
        const produtos =
            await produtoService.listarProdutos();

        return res.status(200).json({
            total: produtos.length,
            data: produtos
        });
    } catch (error) {
        console.error(
            'Erro ao listar produtos:',
            error
        );

        return res.status(500).json({
            error: 'Erro interno ao buscar produtos'
        });
    }
}

module.exports = {
    listarProdutos
};