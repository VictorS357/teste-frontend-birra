const express = require('express');

const itemPedidoController = require('../controllers/itemPedidoController');

const router = express.Router();

router.get('/', itemPedidoController.listarItensPedido);

module.exports = router;