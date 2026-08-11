const historicoMovimentacaoService = require('../services/historicoMovimentacaoService');

async function listarHistoricoMovimentacoes(req, res) {
    try {
        const historicos =
            await historicoMovimentacaoService.listarHistoricoMovimentacoes();

        return res.status(200).json({
            total: historicos.length,
            data: historicos
        });
    } catch (error) {
        console.error(
            'Erro ao listar histórico de movimentações:',
            error
        );

        return res.status(500).json({
            error: 'Erro interno ao buscar histórico de movimentações'
        });
    }
}

module.exports = {
    listarHistoricoMovimentacoes
};