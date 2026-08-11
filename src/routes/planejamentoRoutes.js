const express = require('express');

const planejamentoController = require('../controllers/planejamentoController');

const router = express.Router();

router.get('/', planejamentoController.listarPlanejamentos);

module.exports = router;