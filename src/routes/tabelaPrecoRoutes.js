const express = require('express');

const tabelaPrecoController = require('../controllers/tabelaPrecoController');

const router = express.Router();

router.get('/', tabelaPrecoController.listarTabelaPreco);

module.exports = router;