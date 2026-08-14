import { useEffect, useState } from "react";

import MetricCard from "../components/MetricCard";
import DataTable from "../components/DataTable";

import { buscarTabela } from "../services/api";

function ItensPedido() {
    const [erro, setErro] = useState(null);
    const [itensPedido, setItensPedido] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [total, setTotal] = useState(0);
    const [metricas, setMetricas] = useState(null);

    useEffect(() => {
        async function carregarItensPedido() {
            try {
                setCarregando(true);
                setErro(null);

                const resultado = await buscarTabela('itens-pedido');

                setItensPedido(resultado.data);
                setTotal(resultado.total);
                setMetricas(resultado.metricas);
            } catch (error) {
                console.error(
                    'Erro ao carregar itens pedido:',
                    error
                );

                setErro(
                    'Não foi possível carregar os itens de pedido'
                );
            } finally {
                setCarregando(false);
            }
        }

        carregarItensPedido();
    }, []);

    const columns = [
        { key: 'id', label: 'id' },
        { key: 'identificador', label: 'identificador' },
        { key: 'pedidoId', label: 'pedidoId' },
        { key: 'produtoId', label: 'produtoId' },
        { key: 'qtde', label: 'qtde' },
        { key: 'valorUnit', label: 'valorUnit' },
        { key: 'ajuste', label: 'ajuste' },
        { key: 'ajuste2', label: 'ajuste2' },
        { key: 'valorTotal', label: 'valorTotal' },
        { key: 'obs', label: 'obs' },
        { key: 'bonificacao', label: 'bonificacao' },
        { key: 'volumes', label: 'volumes' },
        { key: 'liberado', label: 'liberado' },
        { key: 'sobra', label: 'sobra' },
        { key: 'entregue', label: 'entregue' },
        { key: 'concluido', label: 'concluido' }
    ];

    if (carregando) {
        return (
            <div>
                <h2>Itens Pedido</h2>
                <p>Carregando dados...</p>
            </div>
        );
    }

    if (erro) {
        return (
            <div>
                <h2>Itens Pedido</h2>
                <p>{erro}</p>
            </div>
        );
    }

    return (
        <section className="page">
            <header className="page-header">
                <div>
                    <h2>Itens Pedido</h2>

                    <p>
                        Visualização e análise da tabela
                        de itens de pedido migrada.
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
                data={itensPedido}
            />
        </section>
    );
}

export default ItensPedido;