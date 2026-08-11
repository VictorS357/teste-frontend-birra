const express = require('express');

const clienteController = require('../controllers/clienteController');

const router = express.Router();

router.get('/', clienteController.listarClientes);

module.exports = router;