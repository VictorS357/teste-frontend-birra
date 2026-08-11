const planejamentoService = require('../services/planejamentoService');

async function listarPlanejamentos(req, res) {
    try {
        const planejamentos =
            await planejamentoService.listarPlanejamentos();

        return res.status(200).json({
            total: planejamentos.length,
            data: planejamentos
        });
    } catch (error) {
        console.error(
            'Erro ao listar planejamentos:',
            error
        );

        return res.status(500).json({
            error: 'Erro interno ao buscar planejamentos'
        });
    }
}

module.exports = {
    listarPlanejamentos
};