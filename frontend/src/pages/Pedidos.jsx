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
        { key: 'id', label: 'id' },
        { key: 'clienteId', label: 'clienteId' },
        { key: 'responsavelId', label: 'responsavelId' },
        { key: 'data', label: 'data' },
        { key: 'hora', label: 'hora' },
        { key: 'taxaEntrega', label: 'taxaEntrega' },
        { key: 'localCliente', label: 'localCliente' },
        { key: 'localPedido', label: 'localPedido' },
        { key: 'obs', label: 'obs' },
        { key: 'status', label: 'status' },
        { key: 'auxOrc', label: 'auxOrc' },
        { key: 'auxRota', label: 'auxRota' },
        { key: 'obsColeta', label: 'obsColeta' },
        { key: 'solicitado', label: 'solicitado' },
        { key: 'dataLiberacao', label: 'dataLiberacao' },
        { key: 'usuarioLiberacao', label: 'usuarioLiberacao' },
        { key: 'dataSeparacao', label: 'dataSeparacao' },
        { key: 'usuarioSeparacao', label: 'usuarioSeparacao' },
        { key: 'dataEntrega', label: 'dataEntrega' },
        { key: 'usuarioEntrega', label: 'usuarioEntrega' },
        { key: 'dataConclusao', label: 'dataConclusao' },
        { key: 'usuarioConclusao', label: 'usuarioConclusao' },
        { key: 'assinatura', label: 'assinatura' },
        { key: 'comprovanteGerado', label: 'comprovanteGerado' },
        { key: 'comprovanteEnviado', label: 'comprovanteEnviado' },
        { key: 'coletadoAut', label: 'coletadoAut' },
        { key: 'dataHoraColeta', label: 'dataHoraColeta' },
        { key: 'fotoGas', label: 'fotoGas' },
        { key: 'cidadeEntrega', label: 'cidadeEntrega' },
        { key: 'identificador', label: 'identificador' },
        { key: 'ultNot', label: 'ultNot' },
        { key: 'revenda', label: 'revenda' },
        { key: 'fotoCopoEntrega', label: 'fotoCopoEntrega' },
        { key: 'fotoCopoColeta', label: 'fotoCopoColeta' }
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
                    title="Tempo de carregamento"
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