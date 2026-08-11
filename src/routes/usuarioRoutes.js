const express = require('express');

const usuarioController = require('../controllers/usuarioController');

const router = express.Router();

router.get('/', usuarioController.listarUsuarios);

module.exports = router;