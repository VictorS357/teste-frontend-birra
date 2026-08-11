const express = require('express');

const produtoController = require('../controllers/produtoController');

const router = express.Router();

router.get('/', produtoController.listarProdutos);

module.exports = router;