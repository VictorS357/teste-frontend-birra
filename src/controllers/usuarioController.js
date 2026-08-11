const usuarioService = require('../services/usuarioService');

async function listarUsuarios(req, res) {
    try {
        const usuarios =
            await usuarioService.listarUsuarios();

        return res.status(200).json({
            total: usuarios.length,
            data: usuarios
        });
    } catch (error) {
        console.error(
            'Erro ao listar usuários:',
            error
        );

        return res.status(500).json({
            error: 'Erro interno ao buscar usuários'
        });
    }
}

module.exports = {
    listarUsuarios
};