const express = require('express');

const historicoMovimentacaoController = require('../controllers/historicoMovimentacaoController');

const router = express.Router();

router.get('/', historicoMovimentacaoController.listarHistoricoMovimentacoes);

module.exports = router;