import { Routes, Route } from "react-router";

import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import Produtos from './pages/Produtos';
import Pedidos from './pages/Pedidos';
import Comprovantes from "./pages/Comprovantes";
import EquipCliente from "./pages/EquipCliente";
import EquipRecip from "./pages/EquipRecip";
import Etiquetas from "./pages/Etiquetas";
import Files from "./pages/Files";
import HistoricoMovimentacoes from "./pages/HistoricoMovimentacoes";
import ImagensAcoes from "./pages/ImagensAcoes";
import ItensPedido from "./pages/ItensPedido";
import Planejamento from "./pages/Planejamento";
import TabelaPreco from "./pages/TabelaPreco";
import Usuarios from "./pages/Usuarios";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/produtos" element={<Produtos />} />
        <Route path="/pedidos" element={<Pedidos />} />
        <Route path="/comprovantes" element={<Comprovantes />} />
        <Route path="/equip-cliente" element={<EquipCliente />} />
        <Route path="/equip-recip" element={<EquipRecip />} />
        <Route path="/etiquetas" element={<Etiquetas />} />
        <Route path="/files" element={<Files />} />
        <Route path="/historico-movimentacoes" element={<HistoricoMovimentacoes />} />
        <Route path="/imagens-acoes" element={<ImagensAcoes />} />
        <Route path="/itens-pedido" element={<ItensPedido />} />
        <Route path="/planejamento" element={<Planejamento />} />
        <Route path="/tabela-preco" element={<TabelaPreco />} />
        <Route path="/usuarios" element={<Usuarios />} />
      </Route>
    </Routes>
  );
}

export default App;