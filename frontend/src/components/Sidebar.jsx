import { NavLink } from "react-router";

function Sidebar() {
    return (
        <aside className="sidebar">
            <h1>Banco Migrado</h1>

            <nav>
                <NavLink to="/">
                    Dashboard
                </NavLink>

                <NavLink to="/clientes">
                    Clientes
                </NavLink>

                <NavLink to="/produtos">
                    Produtos
                </NavLink>

                <NavLink to="/pedidos">
                    Pedidos
                </NavLink>

                <NavLink to="/comprovantes">
                    Comprovantes
                </NavLink>

                <NavLink to="/equip-cliente">
                    EquipCliente
                </NavLink>

                <NavLink to="/equip-recip">
                    EquipRecip
                </NavLink>

                <NavLink to="/etiquetas">
                    Etiquetas
                </NavLink>

                <NavLink to="/files">
                    Files
                </NavLink>

                <NavLink to="/historico-movimentacoes">
                    HistóricoMovimentações
                </NavLink>

                <NavLink to="/imagens-acoes">
                    ImagensAções
                </NavLink>

                <NavLink to="/itens-pedido">
                    ItensPedido
                </NavLink>

                <NavLink to="/planejamento">
                    Planejamento
                </NavLink>

                <NavLink to="/tabela-preco">
                    TabelaPreço
                </NavLink>

                <NavLink to="/usuarios">
                    Usuários
                </NavLink>
            </nav>
        </aside>
    );
}

export default Sidebar;