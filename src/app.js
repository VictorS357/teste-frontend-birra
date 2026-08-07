const express = require('express');
const cors = require('cors');

const pedidoRoutes = require('./routes/pedidoRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
    return res.status(200).json({
        status: 'ok'
    });
});

app.use('/api/pedidos', pedidoRoutes);

module.exports = app;