const equipClienteService = require('../services/equipClienteService');

async function listarEquipClientes(req, res) {
    try {
        const equipamentos =
            await equipClienteService.listarEquipClientes();

        return res.status(200).json({
            total: equipamentos.length,
            data: equipamentos
        });
    } catch (error) {
        console.error(
            'Erro ao listar equipamentos de clientes:',
            error
        );

        return res.status(500).json({
            error: 'Erro interno ao buscar equipamentos de clientes'
        });
    }
}

module.exports = {
    listarEquipClientes
};