import { useEffect, useState } from "react";

import MetricCard from "../components/MetricCard";
import DataTable from "../components/DataTable";

import { buscarTabela } from "../services/api,";

function Pedidos() {
    const [pedidos, setPedidos] = useState([]);
    const [metricas, setMetricas] = useState(null);
    const [total, setTotal] = useState(0);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);

    useEffect(() => {
        async function carregarPedidos() {
            try {
                setCarregando(true);
                setErro(null);

                const resultado = await buscarTabela('pedidos');

                setPedidos(resultado.data);
                setTotal(resultado.total);
                setMetricas(resultado.metricas);
            } catch (error) {
                console.error(
                    'Erro ao carregar pedidos:',
                    error
                );

                setErro(
                    'Não foi possível carregar os pedidos'
                );
            } finally {
                setCarregando(false);
            }
        }

        carregarPedidos();
    }, []);

    const columns = [
        {
            key: 'identificador',
            label: 'Identificador'
        },
        {
            key: 'clienteId',
            label: 'Cliente'
        },
        {
            key: 'data',
            label: 'Data'
        },
        {
            key: 'hora',
            label: 'Hora'
        },
        {
            key: 'status',
            label: 'Status'
        },
        {
            key: 'taxaEntrega',
            label: 'Taxa de entrega'
        },
        {
            key: 'cidadeEntrega',
            label: 'Cidade'
        }
    ];

    if (carregando) {
        return (
            <div>
                <h2>Pedidos</h2>
                <p>Carregando dados...</p>
            </div>
        );
    }

    if (erro) {
        return (
            <div>
                <h2>Pedidos</h2>
                <p>{erro}</p>
            </div>
        );
    }

    return (
        <section className="page">
            <header className="page-header">
                <div>
                    <h2>Pedidos</h2>

                    <p>
                        Visualização e análise da tabela
                        de pedidos migrada.
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
                    title="Registros"
                    value={`${metricas.tempoMs.toFixed(0)} ms`}
                />
            </div>

            <DataTable 
                columns={columns}
                data={pedidos}
            />
        </section>
    );
}

export default Pedidos;