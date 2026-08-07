const express = require('express');

const pedidoController = require(
    '../controllers/pedidoController'
);

const router = express.Router();

router.get(
    '/',
    pedidoController.listarPedidos
);

module.exports = router;