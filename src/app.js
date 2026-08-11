const express = require('express');
const cors = require('cors');

const pedidoRoutes = require('./routes/pedidoRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const produtoRoutes = require('./routes/produtoRoutes');
const ItemPedidoRoutes = require('./routes/itemPedidoRoutes');
const equipRecipRoutes = require('./routes/equipRecipRoutes');
const equipClienteRoutes = require('./routes/equipClienteRoutes');
const historicoMovimentacaoRoutes = require('./routes/historicoMovimentacaoRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
    return res.status(200).json({
        status: 'ok'
    });
});

app.use('/api/pedidos', pedidoRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/produtos', produtoRoutes);
app.use('/api/itens-pedido', ItemPedidoRoutes);
app.use('/api/equip-recip', equipRecipRoutes);
app.use('/api/equip-clientes', equipClienteRoutes);
app.use('/api/historico-movimentacoes', historicoMovimentacaoRoutes);

module.exports = app;