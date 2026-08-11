const express = require('express');

const equipClienteController = require('../controllers/equipClienteController');

const router = express.Router();

router.get('/', equipClienteController.listarEquipClientes);

module.exports = router;