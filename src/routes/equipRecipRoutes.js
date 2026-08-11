const express = require('express');

const equipRecipController = require('../controllers/equipRecipController');

const router = express.Router();

router.get('/', equipRecipController.listarEquipRecip);

module.exports = router;