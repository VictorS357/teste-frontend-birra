const db = require('../models');

async function listarEquipRecip() {
    const equipRecip = await db.EquipRecip.findAll({
        order: [
            ['identificador', 'ASC']
        ]
    });

    return equipRecip;
}

module.exports = {
    listarEquipRecip
};