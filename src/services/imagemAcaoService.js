const db = require('../models');

async function listarImagensAcao() {
    const ImagensAcao = await db.ImagemAcao.findAll({
        order: [
            ['dataEHora', 'DESC']
        ]
    });

    return ImagensAcao;
}

module.exports = {
    listarImagensAcao
};