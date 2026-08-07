'use strict';

const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

const db = require('../../src/models');

const caminhoCsv = path.resolve(
    __dirname,
    '../../dados/csv/planejamento.csv'
);

function textoOuNull(valor) {
    if (valor === undefined || valor === null) {
        return null;
    }

    const texto = String(valor).trim();

    return texto === '' ? null : texto;
}

function identificarDiaMes(
    primeiro,
    segundo,
    nomeCampo,
    numeroLinha,
    valorOriginal
) {
    let dia;
    let mes;

    if (primeiro > 12 && segundo <= 12) {
        dia = primeiro;
        mes = segundo;
    } else if (segundo > 12 && primeiro <= 12) {
        mes = primeiro;
        dia = segundo;
    } else {
        dia = primeiro;
        mes = segundo;
    }

    if (
        dia < 1 ||
        dia > 31 ||
        mes < 1 ||
        mes > 12
    ) {
        throw new Error(
            `Data inexistente no campo "${nomeCampo}", ` +
            `linha ${numeroLinha}: "${valorOriginal}".`
        );
    }

    return {
        dia,
        mes
    };
}

function converterData(valor, nomeCampo, numeroLinha) {
    const dataOriginal = textoOuNull(valor);

    if (dataOriginal === null) {
        return null;
    }

    const correspondencia = dataOriginal.match(
        /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/
    );

    if (!correspondencia) {
        throw new Error(
            `Data inválida no campo "${nomeCampo}", ` +
            `linha ${numeroLinha}: "${dataOriginal}".`
        );
    }

    const [
        ,
        primeiroTexto,
        segundoTexto,
        anoTexto
    ] = correspondencia;

    const primeiro = Number(primeiroTexto);
    const segundo = Number(segundoTexto);
    const ano = Number(anoTexto);

    const { dia, mes } = identificarDiaMes(
        primeiro,
        segundo,
        nomeCampo,
        numeroLinha,
        dataOriginal
    );

    const dataValidacao = new Date(
        ano,
        mes - 1,
        dia
    );

    const dataValida =
        dataValidacao.getFullYear() === ano &&
        dataValidacao.getMonth() === mes - 1 &&
        dataValidacao.getDate() === dia;

    if (!dataValida) {
        throw new Error(
            `Data inexistente no campo "${nomeCampo}", ` +
            `linha ${numeroLinha}: "${dataOriginal}".`
        );
    }

    return [
        ano,
        String(mes).padStart(2, '0'),
        String(dia).padStart(2, '0')
    ].join('-');
}

function validarCabecalhos(registros) {
    if (registros.length === 0) {
        throw new Error(
            'O CSV não possui registros para importação.'
        );
    }

    const cabecalhosEsperados = [
        'Row ID',
        'DataSolicitacao',
        'Descricao',
        'Tipo',
        'Status',
        'Responsavel',
        'Urgencia',
        'ParecerDoResponsavel',
        'PrazoDeConclusao',
        'Cliente',
        'ParecerDoCliente',
        'AssinaturaDoCliente',
        'DataDeConclusao',
        'Solicitante',
        'DataInicio',
        'Privacidade',
        'Foto'
    ];

    const cabecalhosRecebidos = Object.keys(
        registros[0]
    );

    const ausentes = cabecalhosEsperados.filter(
        (cabecalho) =>
            !cabecalhosRecebidos.includes(cabecalho)
    );

    if (ausentes.length > 0) {
        throw new Error(
            `Cabeçalhos ausentes no CSV: ` +
            ausentes.join(', ')
        );
    }
}

function mapearPlanejamentos(registros) {
    const idsEncontrados = new Set();

    const camposImportados = [
        'Row ID',
        'DataSolicitacao',
        'Descricao',
        'Tipo',
        'Status',
        'Responsavel',
        'Urgencia',
        'ParecerDoResponsavel',
        'PrazoDeConclusao',
        'Cliente',
        'ParecerDoCliente',
        'AssinaturaDoCliente',
        'DataDeConclusao',
        'Solicitante',
        'DataInicio',
        'Privacidade',
        'Foto'
    ];

    const registrosComLinha = registros.map(
        (registro, indice) => ({
            registro,
            numeroLinha: indice + 2
        })
    );

    const registrosPreenchidos = registrosComLinha.filter(
        ({ registro }) => {
            return camposImportados.some(
                (campo) =>
                    textoOuNull(registro[campo]) !== null
            );
        }
    );

    const planejamentos = registrosPreenchidos.map(
        ({ registro, numeroLinha }) => {
            const id = textoOuNull(
                registro['Row ID']
            );

            if (!id) {
                console.warn(
                    `Planejamento ignorado por ausência de Row ID — ` +
                    `linha ${numeroLinha}.`
                );

                return null;
            }

            if (idsEncontrados.has(id)) {
                throw new Error(
                    `Row ID duplicado no CSV, ` +
                    `linha ${numeroLinha}: "${id}".`
                );
            }

            idsEncontrados.add(id);

            return {
                id,

                dataSolicitacao: converterData(
                    registro.DataSolicitacao,
                    'DataSolicitacao',
                    numeroLinha
                ),

                descricao: textoOuNull(
                    registro.Descricao
                ),

                tipo: textoOuNull(
                    registro.Tipo
                ),

                status: textoOuNull(
                    registro.Status
                ),

                responsavelId: textoOuNull(
                    registro.Responsavel
                ),

                urgencia: textoOuNull(
                    registro.Urgencia
                ),

                parecerDoResponsavel: textoOuNull(
                    registro.ParecerDoResponsavel
                ),

                prazoDeConclusao: converterData(
                    registro.PrazoDeConclusao,
                    'PrazoDeConclusao',
                    numeroLinha
                ),

                clienteId: textoOuNull(
                    registro.Cliente
                ),

                parecerDoCliente: textoOuNull(
                    registro.ParecerDoCliente
                ),

                assinaturaDoCliente: textoOuNull(
                    registro.AssinaturaDoCliente
                ),

                dataDeConclusao: converterData(
                    registro.DataDeConclusao,
                    'DataDeConclusao',
                    numeroLinha
                ),

                solicitanteId: textoOuNull(
                    registro.Solicitante
                ),

                dataInicio: converterData(
                    registro.DataInicio,
                    'DataInicio',
                    numeroLinha
                ),

                privacidade: textoOuNull(
                    registro.Privacidade
                ),

                foto: textoOuNull(
                    registro.Foto
                ),

                numeroLinha
            };
        }
    );

    return planejamentos.filter(
        (planejamento) => planejamento !== null
    );
}

function valoresUnicos(valores) {
    return [
        ...new Set(
            valores.filter(
                (valor) =>
                    valor !== null &&
                    valor !== undefined
            )
        )
    ];
}

function criarConjuntoIds(registros) {
    return new Set(
        registros.map((registro) => registro.id)
    );
}

async function importarPlanejamento() {
    try {
        if (!fs.existsSync(caminhoCsv)) {
            throw new Error(
                `Arquivo não encontrado: ${caminhoCsv}`
            );
        }

        const conteudoCsv = fs
            .readFileSync(caminhoCsv, 'utf8')
            .replace(/^\uFEFF/, '');

        const registros = parse(conteudoCsv, {
            columns: true,
            delimiter: ';',
            skip_empty_lines: true,
            trim: true
        });

        validarCabecalhos(registros);

        const planejamentosMapeados =
            mapearPlanejamentos(registros);

        console.log(
            `Registros encontrados no CSV: ` +
            `${registros.length}`
        );

        console.log(
            `Planejamentos inicialmente válidos: ` +
            `${planejamentosMapeados.length}`
        );

        const usuarioIds = valoresUnicos([
            ...planejamentosMapeados.map(
                (planejamento) =>
                    planejamento.responsavelId
            ),
            ...planejamentosMapeados.map(
                (planejamento) =>
                    planejamento.solicitanteId
            )
        ]);

        const clienteIds = valoresUnicos(
            planejamentosMapeados.map(
                (planejamento) =>
                    planejamento.clienteId
            )
        );

        const idsCsv = planejamentosMapeados.map(
            (planejamento) => planejamento.id
        );

        const [
            usuariosEncontrados,
            clientesEncontrados,
            planejamentosExistentes
        ] = await Promise.all([
            usuarioIds.length > 0
                ? db.Usuario.findAll({
                    attributes: ['id'],
                    where: {
                        id: usuarioIds
                    },
                    raw: true
                })
                : Promise.resolve([]),

            clienteIds.length > 0
                ? db.Cliente.findAll({
                    attributes: ['id'],
                    where: {
                        id: clienteIds
                    },
                    raw: true
                })
                : Promise.resolve([]),

            idsCsv.length > 0
                ? db.Planejamento.findAll({
                    attributes: ['id'],
                    where: {
                        id: idsCsv
                    },
                    raw: true
                })
                : Promise.resolve([])
        ]);

        const usuariosExistentes =
            criarConjuntoIds(usuariosEncontrados);

        const clientesExistentes =
            criarConjuntoIds(clientesEncontrados);

        const planejamentosJaExistentes =
            criarConjuntoIds(planejamentosExistentes);

        let responsaveisRemovidos = 0;
        let solicitantesRemovidos = 0;
        let clientesRemovidos = 0;
        let registrosJaExistentes = 0;

        const planejamentosParaImportar =
            planejamentosMapeados
                .map((planejamento) => {
                    if (
                        planejamentosJaExistentes.has(
                            planejamento.id
                        )
                    ) {
                        registrosJaExistentes += 1;

                        return null;
                    }

                    const planejamentoAjustado = {
                        ...planejamento
                    };

                    if (
                        planejamentoAjustado.responsavelId !==
                            null &&
                        !usuariosExistentes.has(
                            planejamentoAjustado.responsavelId
                        )
                    ) {
                        responsaveisRemovidos += 1;

                        console.warn(
                            `Referência de Responsavel removida — ` +
                            `linha ${planejamento.numeroLinha}, ` +
                            `Row ID="${planejamento.id}", ` +
                            `Responsavel="` +
                            `${planejamento.responsavelId}".`
                        );

                        planejamentoAjustado.responsavelId = null;
                    }

                    if (
                        planejamentoAjustado.solicitanteId !==
                            null &&
                        !usuariosExistentes.has(
                            planejamentoAjustado.solicitanteId
                        )
                    ) {
                        solicitantesRemovidos += 1;

                        console.warn(
                            `Referência de Solicitante removida — ` +
                            `linha ${planejamento.numeroLinha}, ` +
                            `Row ID="${planejamento.id}", ` +
                            `Solicitante="` +
                            `${planejamento.solicitanteId}".`
                        );

                        planejamentoAjustado.solicitanteId = null;
                    }

                    if (
                        planejamentoAjustado.clienteId !==
                            null &&
                        !clientesExistentes.has(
                            planejamentoAjustado.clienteId
                        )
                    ) {
                        clientesRemovidos += 1;

                        console.warn(
                            `Referência de Cliente removida — ` +
                            `linha ${planejamento.numeroLinha}, ` +
                            `Row ID="${planejamento.id}", ` +
                            `Cliente="` +
                            `${planejamento.clienteId}".`
                        );

                        planejamentoAjustado.clienteId = null;
                    }

                    delete planejamentoAjustado.numeroLinha;

                    return planejamentoAjustado;
                })
                .filter(
                    (planejamento) =>
                        planejamento !== null
                );

        console.log(
            `Planejamentos já existentes e ignorados: ` +
            `${registrosJaExistentes}`
        );

        console.log(
            `Referências de responsáveis removidas: ` +
            `${responsaveisRemovidos}`
        );

        console.log(
            `Referências de solicitantes removidas: ` +
            `${solicitantesRemovidos}`
        );

        console.log(
            `Referências de clientes removidas: ` +
            `${clientesRemovidos}`
        );

        console.log(
            `Planejamentos pendentes para importação: ` +
            `${planejamentosParaImportar.length}`
        );

        if (planejamentosParaImportar.length === 0) {
            console.log(
                'Nenhum planejamento novo precisa ser importado.'
            );

            return;
        }

        const idsParaImportar =
            planejamentosParaImportar.map(
                (planejamento) => planejamento.id
            );

        await db.sequelize.transaction(
            async (transaction) => {
                await db.Planejamento.bulkCreate(
                    planejamentosParaImportar,
                    {
                        transaction,
                        validate: true
                    }
                );
            }
        );

        const quantidadeImportada =
            await db.Planejamento.count({
                where: {
                    id: idsParaImportar
                }
            });

        if (
            quantidadeImportada !==
            planejamentosParaImportar.length
        ) {
            throw new Error(
                `A conferência falhou: deveriam ser importados ` +
                `${planejamentosParaImportar.length} planejamentos, ` +
                `mas foram encontrados ${quantidadeImportada}.`
            );
        }

        console.log(
            'Importação de Planejamento concluída com sucesso.'
        );

        console.log(
            `Planejamentos importados nesta execução: ` +
            `${quantidadeImportada}`
        );
    } catch (error) {
        console.error(
            '\nFalha ao importar Planejamento:'
        );

        console.error(error.message);

        process.exitCode = 1;
    } finally {
        await db.sequelize.close();
    }
}

importarPlanejamento();