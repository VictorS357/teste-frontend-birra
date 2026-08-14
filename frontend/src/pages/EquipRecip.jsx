import { useEffect, useState } from "react";

import MetricCard from "../components/MetricCard";
import DataTable from "../components/DataTable";

import { buscarTabela } from "../services/api";

function EquipRecip() {
    const [erro, setErro] = useState(null);
    const [equipRecip, setEquipRecip] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [total, setTotal] = useState(0);
    const [metricas, setMetricas] = useState(null);

    useEffect(() => {
        async function carregarEquipRecip() {
            try {
                setCarregando(true);
                setErro(null);

                const resultado = await buscarTabela('comprovantes');

                setEquipRecip(resultado.data);
                setTotal(resultado.total);
                setMetricas(resultado.metricas);
            } catch (error) {
                console.error(
                    'Erro ao carregar Equip Recip:',
                    error
                );

                setErro(
                    'Não foi possível carregar Equip Recip'
                );
            } finally {
                setCarregando(false);
            }
        }

        carregarEquipRecip();
    }, []);

    const columns = [
        { key: 'id', label: 'id' },
        { key: 'identificador', label: 'identificador' },
        { key: 'tipo', label: 'tipo' },
        { key: 'capacidade', label: 'capacidade' },
        { key: 'qrcode', label: 'qrcode' },
        { key: 'lote', label: 'lote' },
        { key: 'validade', label: 'validade' },
        { key: 'status', label: 'status' },
        { key: 'produtoId', label: 'produtoId' },
        { key: 'itemPedidoSepId', label: 'itemPedidoSepId' },
        { key: 'descricao', label: 'descricao' },
        { key: 'itemPedidoEntrId', label: 'itemPedidoEntrId' },
        { key: 'auxPdf', label: 'auxPdf' },
        { key: 'produtoAtual', label: 'produtoAtual' },
        { key: 'clienteId', label: 'clienteId' },
        { key: 'ultMov', label: 'ultMov' }
    ];

    if (carregando) {
        return (
            <div>
                <h2>Equip Recip</h2>
                <p>Carregando dados...</p>
            </div>
        );
    }

    if (erro) {
        return (
            <div>
                <h2>Equip Recip</h2>
                <p>{erro}</p>
            </div>
        );
    }

    return (
        <section className="page">
            <header className="page-header">
                <div>
                    <h2>Equip Recip</h2>

                    <p>
                        Visualização e análise da tabela
                        EquipRecip migrada.
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
                data={equipRecip}
            />
        </section>
    );
}

export default EquipRecip;