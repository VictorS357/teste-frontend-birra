import { useEffect, useState } from "react";

import MetricCard from "../components/MetricCard";
import DataTable from "../components/DataTable";

import { buscarTabela } from "../services/api";

function Usuarios() {
    const [erro, setErro] = useState(null);
    const [usuarios, setUsuarios] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [total, setTotal] = useState(0);
    const [metricas, setMetricas] = useState(null);

    useEffect(() => {
        async function carregarUsuarios() {
            try {
                setCarregando(true);
                setErro(null);

                const resultado = await buscarTabela('usuarios');

                setUsuarios(resultado.data);
                setTotal(resultado.total);
                setMetricas(resultado.metricas);
            } catch (error) {
                console.error(
                    'Erro ao carregar usuários:',
                    error
                );

                setErro(
                    'Não foi possível carregar os usuários'
                );
            } finally {
                setCarregando(false);
            }
        }

        carregarUsuarios();
    }, []);

    const columns = [
        { key: 'id', label: 'id' },
        { key: 'nome', label: 'nome' },
        { key: 'email', label: 'email' },
        { key: 'tipo', label: 'tipo' },
        { key: 'foto', label: 'foto' },
        { key: 'telaInicial', label: 'telaInicial' },
        { key: 'dataInicio', label: 'dataInicio' },
        { key: 'dataFim', label: 'dataFim' }
    ];

    if (carregando) {
        return (
            <div>
                <h2>Usuários</h2>
                <p>Carregando dados...</p>
            </div>
        );
    }

    if (erro) {
        return (
            <div>
                <h2>Usuários</h2>
                <p>{erro}</p>
            </div>
        );
    }

    return (
        <section className="page">
            <header className="page-header">
                <div>
                    <h2>Usuários</h2>

                    <p>
                        Visualização e análise da tabela
                        de usuários migrada.
                    </p>
                </div>
            </header>

            <div className="metrics-grid">
                <MetricCard
                    title="Registros"
                    value={total.toLocaleString('pt-BR')}
                />

                <MetricCard
                    title="Tamanho da resposta"
                    value={`${metricas.tamanhoMB.toFixed(2)} MB`}
                />

                <MetricCard
                    title="Tempo de carregamento"
                    value={`${metricas.tempoMs.toFixed(0)} ms`}
                />
            </div>

            <DataTable
                columns={columns}
                data={usuarios}
            />
        </section>
    );
}

export default Usuarios;