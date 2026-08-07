'use strict';

const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

const db = require('../../src/models');

const caminhoCsv = path.resolve(
    __dirname,
    '../../dados/csv/historico_movimentacoes.csv'
);

function textoOuNull(valor) {
    if (valor === undefined || valor === null) {
        return null;
    }

    const texto = String(valor).trim();

    return texto === '' ? null : texto;
}

function converterDecimal(valor, nomeCampo, numeroLinha) {
    const decimal = textoOuNull(valor);

    if (decimal === null) {
        return null;
    }

    let normalizado = decimal
        .replace(/^R\$\s*/i, '')
        .replace(/\s/g, '');

    const possuiVirgula = normalizado.includes(',');
    const possuiPonto = normalizado.includes('.');

    if (possuiVirgula && possuiPonto) {
        const ultimaVirgula = normalizado.lastIndexOf(',');
        const ultimoPonto = normalizado.lastIndexOf('.');

        if (ultimaVirgula > ultimoPonto) {
            normalizado = normalizado
                .replace(/\./g, '')
                .replace(',', '.');
        } else {
            normalizado = normalizado.replace(/,/g, '');
        }
    } else if (possuiVirgula) {
        normalizado = normalizado.replace(',', '.');
    }

    if (!/^-?\d+(?:\.\d+)?$/.test(normalizado)) {
        throw new Error(
            `Valor decimal inválido no campo "${nomeCampo}", ` +
            `linha ${numeroLinha}: "${decimal}".`
        );
    }

    const numero = Number(normalizado);

    if (!Number.isFinite(numero)) {
        throw new Error(
            `Valor numérico inválido no campo "${nomeCampo}", ` +
            `linha ${numeroLinha}: "${decimal}".`
        );
    }

    return numero;
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
        // DD/MM/YYYY
        dia = primeiro;
        mes = segundo;
    } else if (segundo > 12 && primeiro <= 12) {
        // MM/DD/YYYY
        mes = primeiro;
        dia = segundo;
    } else {
        // Caso ambíguo: assume padrão brasileiro.
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

    const [, primeiroTexto, segundoTexto, anoTexto] =
        correspondencia;

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

function converterDataHora(valor, nomeCampo, numeroLinha) {
    const dataHoraOriginal = textoOuNull(valor);

    if (dataHoraOriginal === null) {
        return null;
    }

    const correspondencia = dataHoraOriginal.match(
        /^(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?$/i
    );

    if (!correspondencia) {
        throw new Error(
            `Data e hora inválidas no campo "${nomeCampo}", ` +
            `linha ${numeroLinha}: "${dataHoraOriginal}".`
        );
    }

    const [
        ,
        primeiroDataTexto,
        segundoDataTexto,
        anoTexto,
        horaTexto,
        minutoTexto,
        segundosTexto = '00',
        periodoTexto
    ] = correspondencia;

    const primeiro = Number(primeiroDataTexto);
    const segundo = Number(segundoDataTexto);
    const ano = Number(anoTexto);

    const { dia, mes } = identificarDiaMes(
        primeiro,
        segundo,
        nomeCampo,
        numeroLinha,
        dataHoraOriginal
    );

    let hora = Number(horaTexto);
    const minuto = Number(minutoTexto);
    const segundos = Number(segundosTexto);

    if (periodoTexto) {
        const periodo = periodoTexto.toUpperCase();

        if (hora < 1 || hora > 12) {
            throw new Error(
                `Hora inválida no campo "${nomeCampo}", ` +
                `linha ${numeroLinha}: "${dataHoraOriginal}".`
            );
        }

        if (periodo === 'AM' && hora === 12) {
            hora = 0;
        }

        if (periodo === 'PM' && hora !== 12) {
            hora += 12;
        }
    }

    if (
        hora < 0 ||
        hora > 23 ||
        minuto < 0 ||
        minuto > 59 ||
        segundos < 0 ||
        segundos > 59
    ) {
        throw new Error(
            `Horário inexistente no campo "${nomeCampo}", ` +
            `linha ${numeroLinha}: "${dataHoraOriginal}".`
        );
    }

    const dataHora = new Date(
        ano,
        mes - 1,
        dia,
        hora,
        minuto,
        segundos
    );

    const dataHoraValida =
        dataHora.getFullYear() === ano &&
        dataHora.getMonth() === mes - 1 &&
        dataHora.getDate() === dia &&
        dataHora.getHours() === hora &&
        dataHora.getMinutes() === minuto &&
        dataHora.getSeconds() === segundos;

    if (!dataHoraValida) {
        throw new Error(
            `Data e hora inexistentes no campo "${nomeCampo}", ` +
            `linha ${numeroLinha}: "${dataHoraOriginal}".`
        );
    }

    return dataHora;
}

function converterBooleano(valor, nomeCampo, numeroLinha) {
    const booleano = textoOuNull(valor);

    if (booleano === null) {
        return null;
    }

    const normalizado = booleano
        .trim()
        .toLowerCase();

    const verdadeiros = [
        'y',
        'yes',
        'sim',
        'true',
        'verdadeiro',
        '1'
    ];

    const falsos = [
        'n',
        'no',
        'não',
        'nao',
        'false',
        'falso',
        '0'
    ];

    if (verdadeiros.includes(normalizado)) {
        return true;
    }

    if (falsos.includes(normalizado)) {
        return false;
    }

    throw new Error(
        `Valor booleano inválido no campo "${nomeCampo}", ` +
        `linha ${numeroLinha}: "${booleano}".`
    );
}

function validarCabecalhos(registros) {
    if (registros.length === 0) {
        throw new Error(
            'O CSV não possui registros para importação.'
        );
    }

    const cabecalhosEsperados = [
        'Id',
        'EquipRecip',
        'Data',
        'Tipo',
        'Descricao',
        'Usuario',
        'Qtde',
        'Lote',
        'Validade',
        'Produto',
        'MovimentarDe',
        'MovimentarPara',
        'ItmSep',
        'ItmEntr',
        'ItmConc',
        'Nivel',
        'Cliente',
        'Classe',
        'Doc',
        'Poss'
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

function mapearHistoricos(registros) {
    const idsEncontrados = new Set();

    const camposImportados = [
        'Id',
        'EquipRecip',
        'Data',
        'Tipo',
        'Descricao',
        'Usuario',
        'Qtde',
        'Lote',
        'Validade',
        'Produto',
        'MovimentarDe',
        'MovimentarPara',
        'ItmSep',
        'ItmEntr',
        'ItmConc',
        'Nivel',
        'Cliente',
        'Classe',
        'Doc',
        'Poss'
    ];

    const registrosComLinha = registros.map(
        (registro, indice) => ({
            registro,
            numeroLinha: indice + 2
        })
    );

    const registrosPreenchidos = registrosComLinha.filter(
        ({ registro }) => {
            return camposImportados.some((campo) => {
                return textoOuNull(registro[campo]) !== null;
            });
        }
    );

    const historicos = registrosPreenchidos.map(
        ({ registro, numeroLinha }) => {
            const id = textoOuNull(
                registro.Id
            );

            const equipRecip = textoOuNull(
                registro.EquipRecip
            );

            if (!id) {
                console.warn(
                    `Histórico ignorado por ausência de Id — ` +
                    `linha ${numeroLinha}.`
                );

                return null;
            }

            if (!equipRecip) {
                console.warn(
                    `Histórico ignorado por ausência de EquipRecip — ` +
                    `linha ${numeroLinha}, Id="${id}".`
                );

                return null;
            }

            const data = converterDataHora(
                registro.Data,
                'Data',
                numeroLinha
            );

            if (data === null) {
                console.warn(
                    `Histórico ignorado por ausência de Data — ` +
                    `linha ${numeroLinha}, Id="${id}".`
                );

                return null;
            }

            if (idsEncontrados.has(id)) {
                throw new Error(
                    `Id duplicado no CSV, ` +
                    `linha ${numeroLinha}: "${id}".`
                );
            }

            idsEncontrados.add(id);

            return {
                id,

                equipRecip,

                data,

                tipo: textoOuNull(
                    registro.Tipo
                ),

                descricao: textoOuNull(
                    registro.Descricao
                ),

                usuarioId: textoOuNull(
                    registro.Usuario
                ),

                qtde: converterDecimal(
                    registro.Qtde,
                    'Qtde',
                    numeroLinha
                ),

                lote: textoOuNull(
                    registro.Lote
                ),

                validade: converterData(
                    registro.Validade,
                    'Validade',
                    numeroLinha
                ),

                produtoId: textoOuNull(
                    registro.Produto
                ),

                movimentarDe: textoOuNull(
                    registro.MovimentarDe
                ),

                movimentarPara: textoOuNull(
                    registro.MovimentarPara
                ),

                itmSep: converterBooleano(
                    registro.ItmSep,
                    'ItmSep',
                    numeroLinha
                ),

                /*
                 * ItmEntr apresentou valores textuais como
                 * "Mantido" nos dados reais, portanto não deve
                 * ser convertido para booleano.
                 */
                itmEntr: textoOuNull(
                    registro.ItmEntr
                ),

                itmConc: converterBooleano(
                    registro.ItmConc,
                    'ItmConc',
                    numeroLinha
                ),

                nivel: textoOuNull(
                    registro.Nivel
                ),

                clienteId: textoOuNull(
                    registro.Cliente
                ),

                classe: textoOuNull(
                    registro.Classe
                ),

                doc: textoOuNull(
                    registro.Doc
                ),

                poss: textoOuNull(
                    registro.Poss
                ),

                numeroLinha
            };
        }
    );

    return historicos.filter(
        (historico) => historico !== null
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

async function importarHistoricoMovimentacoes() {
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
            trim: true,
            relax_column_count: true
        });

        validarCabecalhos(registros);

        const historicosMapeados =
            mapearHistoricos(registros);

        console.log(
            `Registros encontrados no CSV: ` +
            `${registros.length}`
        );

        console.log(
            `Históricos inicialmente válidos: ` +
            `${historicosMapeados.length}`
        );

        const usuarioIds = valoresUnicos(
            historicosMapeados.map(
                (historico) => historico.usuarioId
            )
        );

        const produtoIds = valoresUnicos(
            historicosMapeados.map(
                (historico) => historico.produtoId
            )
        );

        const clienteIds = valoresUnicos(
            historicosMapeados.map(
                (historico) => historico.clienteId
            )
        );

        const idsCsv = historicosMapeados.map(
            (historico) => historico.id
        );

        const [
            usuariosEncontrados,
            produtosEncontrados,
            clientesEncontrados,
            historicosExistentes
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

            produtoIds.length > 0
                ? db.Produto.findAll({
                    attributes: ['id'],
                    where: {
                        id: produtoIds
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
                ? db.HistoricoMovimentacoes.findAll({
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

        const produtosExistentes =
            criarConjuntoIds(produtosEncontrados);

        const clientesExistentes =
            criarConjuntoIds(clientesEncontrados);

        const historicosJaExistentes =
            criarConjuntoIds(historicosExistentes);

        let usuariosRemovidos = 0;
        let produtosRemovidos = 0;
        let clientesRemovidos = 0;
        let historicosIgnoradosPorExistencia = 0;

        const historicosParaImportar =
            historicosMapeados
                .map((historico) => {
                    if (
                        historicosJaExistentes.has(
                            historico.id
                        )
                    ) {
                        historicosIgnoradosPorExistencia += 1;

                        return null;
                    }

                    const historicoAjustado = {
                        ...historico
                    };

                    if (
                        historicoAjustado.usuarioId !== null &&
                        !usuariosExistentes.has(
                            historicoAjustado.usuarioId
                        )
                    ) {
                        usuariosRemovidos += 1;

                        console.warn(
                            `Referência de Usuario removida — ` +
                            `linha ${historico.numeroLinha}, ` +
                            `Id="${historico.id}", ` +
                            `Usuario="${historico.usuarioId}".`
                        );

                        historicoAjustado.usuarioId = null;
                    }

                    if (
                        historicoAjustado.produtoId !== null &&
                        !produtosExistentes.has(
                            historicoAjustado.produtoId
                        )
                    ) {
                        produtosRemovidos += 1;

                        console.warn(
                            `Referência de Produto removida — ` +
                            `linha ${historico.numeroLinha}, ` +
                            `Id="${historico.id}", ` +
                            `Produto="${historico.produtoId}".`
                        );

                        historicoAjustado.produtoId = null;
                    }

                    if (
                        historicoAjustado.clienteId !== null &&
                        !clientesExistentes.has(
                            historicoAjustado.clienteId
                        )
                    ) {
                        clientesRemovidos += 1;

                        console.warn(
                            `Referência de Cliente removida — ` +
                            `linha ${historico.numeroLinha}, ` +
                            `Id="${historico.id}", ` +
                            `Cliente="${historico.clienteId}".`
                        );

                        historicoAjustado.clienteId = null;
                    }

                    delete historicoAjustado.numeroLinha;

                    return historicoAjustado;
                })
                .filter(
                    (historico) => historico !== null
                );

        console.log(
            `Históricos já existentes e ignorados: ` +
            `${historicosIgnoradosPorExistencia}`
        );

        console.log(
            `Referências de usuários removidas: ` +
            `${usuariosRemovidos}`
        );

        console.log(
            `Referências de produtos removidas: ` +
            `${produtosRemovidos}`
        );

        console.log(
            `Referências de clientes removidas: ` +
            `${clientesRemovidos}`
        );

        console.log(
            `Históricos pendentes para importação: ` +
            `${historicosParaImportar.length}`
        );

        if (historicosParaImportar.length === 0) {
            console.log(
                'Nenhum histórico novo precisa ser importado.'
            );

            return;
        }

        const idsParaImportar =
            historicosParaImportar.map(
                (historico) => historico.id
            );

        await db.sequelize.transaction(
            async (transaction) => {
                await db.HistoricoMovimentacoes.bulkCreate(
                    historicosParaImportar,
                    {
                        transaction,
                        validate: true
                    }
                );
            }
        );

        const quantidadeImportada =
            await db.HistoricoMovimentacoes.count({
                where: {
                    id: idsParaImportar
                }
            });

        if (
            quantidadeImportada !==
            historicosParaImportar.length
        ) {
            throw new Error(
                `A conferência falhou: deveriam ser ` +
                `${historicosParaImportar.length} históricos ` +
                `importados, mas foram encontrados ` +
                `${quantidadeImportada} no banco.`
            );
        }

        console.log(
            'Importação do histórico de movimentações ' +
            'concluída com sucesso.'
        );

        console.log(
            `Históricos importados nesta execução: ` +
            `${quantidadeImportada}`
        );
    } catch (error) {
        console.error(
            '\nFalha ao importar histórico de movimentações:'
        );

        console.error(error.message);

        process.exitCode = 1;
    } finally {
        await db.sequelize.close();
    }
}

importarHistoricoMovimentacoes();