const express = require('express');

const imagemAcaoController = require('../controllers/imagemAcaoController');

const router = express.Router();

router.get('/', imagemAcaoController.listarImagensAcao);

module.exports = router;