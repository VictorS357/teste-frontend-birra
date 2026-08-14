import { useEffect, useState } from "react";

import MetricCard from "../components/MetricCard";
import DataTable from "../components/DataTable";

import { buscarTabela } from "../services/api";

function ImagensAcoes() {
    const [erro, setErro] = useState(null);
    const [imagensAcoes, setImagensAcoes] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [total, setTotal] = useState(0);
    const [metricas, setMetricas] = useState(null);

    useEffect(() => {
        async function carregarImagensAcoes() {
            try {
                setCarregando(true);
                setErro(null);

                const resultado = await buscarTabela('imagens_acoes');

                setImagensAcoes(resultado.data);
                setTotal(resultado.total);
                setMetricas(resultado.metricas);
            } catch (error) {
                console.error(
                    'Erro ao carregar imagensAções:',
                    error
                );

                setErro(
                    'Não foi possível carregar imagensAções'
                );
            } finally {
                setCarregando(false);
            }
        }

        carregarImagensAcoes();
    }, []);

    const columns = [
        { key: 'id', label: 'id' },
        { key: 'descricao', label: 'descricao' },
        { key: 'acaoId', label: 'acaoId' },
        { key: 'img', label: 'img' },
        { key: 'responsavelId', label: 'responsavelId' },
        { key: 'dataEHora', label: 'dataEHora' }
    ];

    if (carregando) {
        return (
            <div>
                <h2>Imagens Ações</h2>
                <p>Carregando dados...</p>
            </div>
        );
    }

    if (erro) {
        return (
            <div>
                <h2>Imagens Ações</h2>
                <p>{erro}</p>
            </div>
        );
    }

    return (
        <section className="page">
            <header className="page-header">
                <div>
                    <h2>Imagens Ações</h2>

                    <p>
                        Visualização e análise da tabela
                        de imagensAções migrada.
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
                data={imagensAcoes}
            />
        </section>
    );
}

export default ImagensAcoes;