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
            </nav>
        </aside>
    );
}

export default Sidebar;