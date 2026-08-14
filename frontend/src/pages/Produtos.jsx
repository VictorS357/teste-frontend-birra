import { useEffect, useState } from "react";

import MetricCard from "../components/MetricCard";
import DataTable from "../components/DataTable";

import { buscarTabela } from "../services/api";

function Produtos() {
    const [produtos, setProdutos] = useState([]);
    const [metricas, setMetricas] = useState(null);
    const [total, setTotal] = useState(0);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);

    useEffect(() => {
        async function carregarProdutos() {
            try {
                setCarregando(true);
                setErro(null);

                const resultado = await buscarTabela('produtos');

                setProdutos(resultado.data);
                setTotal(resultado.total);
                setMetricas(resultado.metricas);
            } catch (error) {
                console.error(
                    'Erro ao carregar produtos:',
                    error
                );

                setErro(
                    'Não foi possível carregar os produtos'
                );
            } finally {
                setCarregando(false);
            }
        }

        carregarProdutos();
    }, []);

    const columns = [
        { key: 'id', label: 'id' },
        { key: 'descricao', label: 'descricao' },
        { key: 'valorUnit', label: 'valorUnit' },
        { key: 'obs', label: 'obs' },
        { key: 'unidadeMedida', label: 'unidadeMedida' },
        { key: 'imagem', label: 'imagem' },
        { key: 'retornavel', label: 'retornavel' },
        { key: 'estoque', label: 'estoque' }
    ];

    if (carregando) {
        return (
            <div>
                <h2>Produtos</h2>
                <p>Carregando dados...</p>
            </div>
        );
    }

    if (erro) {
        return (
            <div>
                <h2>Produtos</h2>
                <p>{erro}</p>
            </div>
        );
    }

    return (
        <section className="page">
            <header className="page-header">
                <div>
                    <h2>Produtos</h2>

                    <p>
                        Visualização e análise da tabela
                        de produtos migrada.
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
                data={produtos}
            />
        </section>
    );
}

export default Produtos;