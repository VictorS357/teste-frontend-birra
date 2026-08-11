const equipRecipService = require('../services/equipRecipService');

async function listarEquipRecip(req, res) {
    try {
        const equipamentos =
            await equipRecipService.listarEquipRecip();

        return res.status(200).json({
            total: equipamentos.length,
            data: equipamentos
        });
    } catch (error) {
        console.error(
            'Erro ao listar equipamentos:',
            error
        );

        return res.status(500).json({
            error: 'Erro interno ao buscar equipamentos'
        });
    }
}

module.exports = {
    listarEquipRecip
};