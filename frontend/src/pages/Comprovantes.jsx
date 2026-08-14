import { useEffect, useState } from "react";

import MetricCard from "../components/MetricCard";
import DataTable from "../components/DataTable";

import { buscarTabela } from "../services/api";

function Comprovantes() {
    const [erro, setErro] = useState(null);
    const [comprovantes, setComprovantes] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [total, setTotal] = useState(0);
    const [metricas, setMetricas] = useState(null);

    useEffect(() => {
        async function carregarComprovantes() {
            try {
                setCarregando(true);
                setErro(null);

                const resultado = await buscarTabela('comprovantes');

                setComprovantes(resultado.data);
                setTotal(resultado.total);
                setMetricas(resultado.metricas);
            } catch (error) {
                console.error(
                    'Erro ao carregar comprovantes:',
                    error
                );

                setErro(
                    'Não foi possível carregar os comprovantes'
                );
            } finally {
                setCarregando(false);
            }
        }

        carregarComprovantes();
    }, []);

    const columns = [
        { key: 'id', label: 'id' },
        { key: 'path', label: 'path' },
        { key: 'file', label: 'file' },
        { key: 'createTime', label: 'createTime' },
        { key: 'lastModifiedBy', label: 'lastModifiedBy' },
        { key: 'mimeType', label: 'mimeType' }
    ];

    if (carregando) {
        return (
            <div>
                <h2>Comprovantes</h2>
                <p>Carregando dados...</p>
            </div>
        );
    }

    if (erro) {
        return (
            <div>
                <h2>Comprovantes</h2>
                <p>{erro}</p>
            </div>
        );
    }

    return (
        <section className="page">
            <header className="page-header">
                <div>
                    <h2>Comprovantes</h2>

                    <p>
                        Visualização e análise da tabela
                        de comprovantes migrada.
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
                data={comprovantes}
            />
        </section>
    );
}

export default Comprovantes;