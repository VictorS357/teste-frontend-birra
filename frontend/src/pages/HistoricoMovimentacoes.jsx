import { useEffect, useState } from "react";

import MetricCard from "../components/MetricCard";
import DataTable from "../components/DataTable";

import { buscarTabela } from "../services/api";

function HistoricoMovimentacoes() {
    const [erro, setErro] = useState(null);
    const [historico, setHistorico] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [total, setTotal] = useState(0);
    const [metricas, setMetricas] = useState(null);

    useEffect(() => {
        async function carregarHistorico() {
            try {
                setCarregando(true);
                setErro(null);

                const resultado = await buscarTabela('historico-movimentacoes');

                setHistorico(resultado.data);
                setTotal(resultado.total);
                setMetricas(resultado.metricas);
            } catch (error) {
                console.error(
                    'Erro ao carregar históricoMovimentações:',
                    error
                );

                setErro(
                    'Não foi possível carregar o histórico'
                );
            } finally {
                setCarregando(false);
            }
        }

        carregarHistorico();
    }, []);

    const columns = [
        { key: 'id', label: 'id' },
        { key: 'equipRecip', label: 'equipRecip' },
        { key: 'data', label: 'data' },
        { key: 'tipo', label: 'tipo' },
        { key: 'descricao', label: 'descricao' },
        { key: 'usuarioId', label: 'usuarioId' },
        { key: 'qtde', label: 'qtde' },
        { key: 'lote', label: 'lote' },
        { key: 'validade', label: 'validade' },
        { key: 'produtoId', label: 'produtoId' },
        { key: 'movimentarPara', label: 'movimentarPara' },
        { key: 'itmSep', label: 'itmSep' },
        { key: 'itmEntr', label: 'itmEntr' },
        { key: 'itmConc', label: 'itmConc' },
        { key: 'nivel', label: 'nivel' },
        { key: 'clienteId', label: 'clienteId' },
        { key: 'movimentarDe', label: 'movimentarDe' },
        { key: 'classe', label: 'classe' },
        { key: 'doc', label: 'doc' },
        { key: 'poss', label: 'poss' }
    ];

    if (carregando) {
        return (
            <div>
                <h2>Histórico Movimentações</h2>
                <p>Carregando dados...</p>
            </div>
        );
    }

    if (erro) {
        return (
            <div>
                <h2>Histórico Movimentações</h2>
                <p>{erro}</p>
            </div>
        );
    }

    return (
        <section className="page">
            <header className="page-header">
                <div>
                    <h2>Histórico Movimentações</h2>

                    <p>
                        Visualização e análise da tabela
                        de histórico de movimentações migrada.
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
                data={historico}
            />
        </section>
    );
}

export default HistoricoMovimentacoes;