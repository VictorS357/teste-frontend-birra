import { useEffect, useState } from "react";

import MetricCard from "../components/MetricCard";
import DataTable from "../components/DataTable";

import { buscarTabela } from "../services/api";

function EquipCliente() {
    const [erro, setErro] = useState(null);
    const [equipCliente, setEquipCliente] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [total, setTotal] = useState(0);
    const [metricas, setMetricas] = useState(null);

    useEffect(() => {
        async function carregarEquipcliente() {
            try {
                setCarregando(true);
                setErro(null);

                const resultado = await buscarTabela('comprovantes');

                setEquipCliente(resultado.data);
                setTotal(resultado.total);
                setMetricas(resultado.metricas);
            } catch (error) {
                console.error(
                    'Erro ao carregar Equip Cliente:',
                    error
                );

                setErro(
                    'Não foi possível carregar Equip Cliente'
                );
            } finally {
                setCarregando(false);
            }
        }

        carregarEquipcliente();
    }, []);

    const columns = [
        { key: 'id', label: 'id' },
        { key: 'clienteId', label: 'clienteId' },
        { key: 'desc', label: 'desc' },
        { key: 'foto', label: 'foto' }
    ];

    if (carregando) {
        return (
            <div>
                <h2>Equip Cliente</h2>
                <p>Carregando dados...</p>
            </div>
        );
    }

    if (erro) {
        return (
            <div>
                <h2>Equip Cliente</h2>
                <p>{erro}</p>
            </div>
        );
    }

    return (
        <section className="page">
            <header className="page-header">
                <div>
                    <h2>Equip Cliente</h2>

                    <p>
                        Visualização e análise da tabela
                        EquipCliente migrada.
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
                data={equipCliente}
            />
        </section>
    );
}

export default EquipCliente;