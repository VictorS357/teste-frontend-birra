const imagemAcaoService = require('../services/imagemAcaoService');

async function listarImagensAcao(req, res) {
    try {
        const imagens =
            await imagemAcaoService.listarImagensAcao();

        return res.status(200).json({
            total: imagens.length,
            data: imagens
        });
    } catch (error) {
        console.error(
            'Erro ao listar imagens de ação:',
            error
        );

        return res.status(500).json({
            error: 'Erro interno ao buscar imagens de ação'
        });
    }
}

module.exports = {
    listarImagensAcao
};