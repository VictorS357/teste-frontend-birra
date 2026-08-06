'use strict';

const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

const db = require('../../src/models');

const caminhoCsv = path.resolve(
    __dirname,
    '../../dados/csv/equip_recip.csv'
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
        // DD/MM/AAAA
        dia = primeiro;
        mes = segundo;
    } else if (segundo > 12 && primeiro <= 12) {
        // MM/DD/AAAA
        mes = primeiro;
        dia = segundo;
    } else {
        // Data ambígua: assume o formato brasileiro.
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
        /^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?)?$/i
    );

    if (!correspondencia) {
        throw new Error(
            `Data e hora inválidas no campo "${nomeCampo}", ` +
            `linha ${numeroLinha}: "${dataHoraOriginal}".`
        );
    }

    const [
        ,
        primeiroTexto,
        segundoTexto,
        anoTexto,
        horaTexto = '00',
        minutoTexto = '00',
        segundoHorarioTexto = '00',
        periodoTexto
    ] = correspondencia;

    const primeiro = Number(primeiroTexto);
    const segundo = Number(segundoTexto);
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
    const segundoHorario = Number(
        segundoHorarioTexto
    );

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
        segundoHorario < 0 ||
        segundoHorario > 59
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
        segundoHorario
    );

    const dataHoraValida =
        dataHora.getFullYear() === ano &&
        dataHora.getMonth() === mes - 1 &&
        dataHora.getDate() === dia &&
        dataHora.getHours() === hora &&
        dataHora.getMinutes() === minuto &&
        dataHora.getSeconds() === segundoHorario;

    if (!dataHoraValida) {
        throw new Error(
            `Data e hora inexistentes no campo "${nomeCampo}", ` +
            `linha ${numeroLinha}: "${dataHoraOriginal}".`
        );
    }

    return dataHora;
}

function validarCabecalhos(registros) {
    if (registros.length === 0) {
        throw new Error(
            'O CSV não possui registros para importação.'
        );
    }

    const cabecalhosEsperados = [
        'Row ID',
        'Identificador',
        'Tipo',
        'Capacidade',
        'QrCode',
        'Lote',
        'Validade',
        'Status',
        'Produto',
        'ItemPedidoSep',
        'Descricao',
        'ItemPedidoEntr',
        'AuxPDF',
        'ProdutoAtual',
        'Cliente',
        'UltMov'
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

function mapearEquipamentos(registros) {
    const idsEncontrados = new Set();

    const camposImportados = [
        'Row ID',
        'Identificador',
        'Tipo',
        'Capacidade',
        'QrCode',
        'Lote',
        'Validade',
        'Status',
        'Produto',
        'ItemPedidoSep',
        'Descricao',
        'ItemPedidoEntr',
        'AuxPDF',
        'ProdutoAtual',
        'Cliente',
        'UltMov'
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
                return (
                    textoOuNull(registro[campo]) !== null
                );
            });
        }
    );

    const equipamentosMapeados =
        registrosPreenchidos.map(
            ({ registro, numeroLinha }) => {
                const id = textoOuNull(
                    registro['Row ID']
                );

                const identificador = textoOuNull(
                    registro.Identificador
                );

                const tipo = textoOuNull(
                    registro.Tipo
                );

                const clienteId = textoOuNull(
                    registro.Cliente
                );

                const status = textoOuNull(
                    registro.Status
                );

                if (!id) {
                    console.warn(
                        `Equipamento ignorado por ausência de Row ID — ` +
                        `linha ${numeroLinha}.`
                    );

                    return null;
                }

                if (!identificador) {
                    console.warn(
                        `Equipamento ignorado por ausência de ` +
                        `Identificador — linha ${numeroLinha}, ` +
                        `Row ID="${id}".`
                    );

                    return null;
                }

                if (!tipo) {
                    console.warn(
                        `Equipamento ignorado por ausência de Tipo — ` +
                        `linha ${numeroLinha}, Row ID="${id}", ` +
                        `Identificador="${identificador}".`
                    );

                    return null;
                }

                const capacidade = converterDecimal(
                    registro.Capacidade,
                    'Capacidade',
                    numeroLinha
                );

                if (capacidade === null) {
                    console.warn(
                        `Equipamento ignorado por ausência de ` +
                        `Capacidade — linha ${numeroLinha}, ` +
                        `Row ID="${id}", ` +
                        `Identificador="${identificador}".`
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

                if (
                    clienteId === null &&
                    String(status || '')
                        .trim()
                        .toLowerCase() === 'em cliente'
                ) {
                    console.warn(
                        `Equipamento com status "Em Cliente" sem ` +
                        `cliente associado — linha ${numeroLinha}, ` +
                        `Row ID="${id}", ` +
                        `Identificador="${identificador}".`
                    );
                }

                return {
                    id,
                    identificador,
                    tipo,
                    capacidade,

                    qrcode: textoOuNull(
                        registro.QrCode
                    ),

                    lote: textoOuNull(
                        registro.Lote
                    ),

                    validade: converterData(
                        registro.Validade,
                        'Validade',
                        numeroLinha
                    ),

                    status,

                    produtoId: textoOuNull(
                        registro.Produto
                    ),

                    itemPedidoSepId: textoOuNull(
                        registro.ItemPedidoSep
                    ),

                    descricao: textoOuNull(
                        registro.Descricao
                    ),

                    itemPedidoEntrId: textoOuNull(
                        registro.ItemPedidoEntr
                    ),

                    auxPdf: converterDataHora(
                        registro.AuxPDF,
                        'AuxPDF',
                        numeroLinha
                    ),

                    produtoAtual: textoOuNull(
                        registro.ProdutoAtual
                    ),

                    clienteId,

                    ultMov: converterData(
                        registro.UltMov,
                        'UltMov',
                        numeroLinha
                    ),

                    numeroLinha
                };
            }
        );

    return equipamentosMapeados.filter(
        (equipamento) => equipamento !== null
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

async function importarEquipRecip() {
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

        const equipamentosMapeados =
            mapearEquipamentos(registros);

        console.log(
            `Registros encontrados no CSV: ` +
            `${registros.length}`
        );

        console.log(
            `Equipamentos inicialmente válidos: ` +
            `${equipamentosMapeados.length}`
        );

        const clienteIds = valoresUnicos(
            equipamentosMapeados.map(
                (equipamento) =>
                    equipamento.clienteId
            )
        );

        const produtoIds = valoresUnicos(
            equipamentosMapeados.map(
                (equipamento) =>
                    equipamento.produtoId
            )
        );

        const itemPedidoIds = valoresUnicos([
            ...equipamentosMapeados.map(
                (equipamento) =>
                    equipamento.itemPedidoSepId
            ),
            ...equipamentosMapeados.map(
                (equipamento) =>
                    equipamento.itemPedidoEntrId
            )
        ]);

        const idsCsv = equipamentosMapeados.map(
            (equipamento) => equipamento.id
        );

        const [
            clientesEncontrados,
            produtosEncontrados,
            itensEncontrados,
            equipamentosJaExistentes
        ] = await Promise.all([
            clienteIds.length > 0
                ? db.Cliente.findAll({
                    attributes: ['id'],
                    where: {
                        id: clienteIds
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

            itemPedidoIds.length > 0
                ? db.ItemPedido.findAll({
                    attributes: ['id'],
                    where: {
                        id: itemPedidoIds
                    },
                    raw: true
                })
                : Promise.resolve([]),

            idsCsv.length > 0
                ? db.EquipRecip.findAll({
                    attributes: ['id'],
                    where: {
                        id: idsCsv
                    },
                    raw: true
                })
                : Promise.resolve([])
        ]);

        const clientesExistentes =
            criarConjuntoIds(clientesEncontrados);

        const produtosExistentes =
            criarConjuntoIds(produtosEncontrados);

        const itensExistentes =
            criarConjuntoIds(itensEncontrados);

        const equipamentosExistentes =
            criarConjuntoIds(equipamentosJaExistentes);

        let clientesInexistentesRemovidos = 0;
        let produtosInexistentesRemovidos = 0;
        let itensSeparacaoRemovidos = 0;
        let itensEntregaRemovidos = 0;
        let equipamentosJaImportados = 0;

        const equipamentosParaImportar =
            equipamentosMapeados
                .map((equipamento) => {
                    if (
                        equipamentosExistentes.has(
                            equipamento.id
                        )
                    ) {
                        equipamentosJaImportados += 1;

                        return null;
                    }

                    const equipamentoAjustado = {
                        ...equipamento
                    };

                    /*
                     * Cliente vazio é válido.
                     *
                     * Somente removemos a referência quando existe
                     * um ID preenchido, mas esse cliente não foi
                     * encontrado no banco.
                     */
                    if (
                        equipamentoAjustado.clienteId !==
                            null &&
                        !clientesExistentes.has(
                            equipamentoAjustado.clienteId
                        )
                    ) {
                        clientesInexistentesRemovidos += 1;

                        console.warn(
                            `Referência de Cliente removida por ` +
                            `inexistência — linha ` +
                            `${equipamento.numeroLinha}, ` +
                            `Row ID="${equipamento.id}", ` +
                            `Cliente="${equipamento.clienteId}".`
                        );

                        equipamentoAjustado.clienteId = null;
                    }

                    if (
                        equipamentoAjustado.clienteId ===
                            null &&
                        String(
                            equipamentoAjustado.status || ''
                        )
                            .trim()
                            .toLowerCase() === 'em cliente'
                    ) {
                        console.warn(
                            `Equipamento com status "Em Cliente" ` +
                            `sem cliente válido — linha ` +
                            `${equipamento.numeroLinha}, ` +
                            `Row ID="${equipamento.id}", ` +
                            `Identificador="` +
                            `${equipamento.identificador}".`
                        );
                    }

                    if (
                        equipamentoAjustado.produtoId !==
                            null &&
                        !produtosExistentes.has(
                            equipamentoAjustado.produtoId
                        )
                    ) {
                        produtosInexistentesRemovidos += 1;

                        console.warn(
                            `Referência de Produto removida por ` +
                            `inexistência — linha ` +
                            `${equipamento.numeroLinha}, ` +
                            `Row ID="${equipamento.id}", ` +
                            `Produto="${equipamento.produtoId}".`
                        );

                        equipamentoAjustado.produtoId = null;
                    }

                    if (
                        equipamentoAjustado
                            .itemPedidoSepId !== null &&
                        !itensExistentes.has(
                            equipamentoAjustado
                                .itemPedidoSepId
                        )
                    ) {
                        itensSeparacaoRemovidos += 1;

                        console.warn(
                            `Referência ItemPedidoSep removida — ` +
                            `linha ${equipamento.numeroLinha}, ` +
                            `Row ID="${equipamento.id}", ` +
                            `ItemPedidoSep="` +
                            `${equipamento.itemPedidoSepId}".`
                        );

                        equipamentoAjustado
                            .itemPedidoSepId = null;
                    }

                    if (
                        equipamentoAjustado
                            .itemPedidoEntrId !== null &&
                        !itensExistentes.has(
                            equipamentoAjustado
                                .itemPedidoEntrId
                        )
                    ) {
                        itensEntregaRemovidos += 1;

                        console.warn(
                            `Referência ItemPedidoEntr removida — ` +
                            `linha ${equipamento.numeroLinha}, ` +
                            `Row ID="${equipamento.id}", ` +
                            `ItemPedidoEntr="` +
                            `${equipamento.itemPedidoEntrId}".`
                        );

                        equipamentoAjustado
                            .itemPedidoEntrId = null;
                    }

                    delete equipamentoAjustado.numeroLinha;

                    return equipamentoAjustado;
                })
                .filter(
                    (equipamento) =>
                        equipamento !== null
                );

        console.log(
            `Equipamentos já existentes e ignorados: ` +
            `${equipamentosJaImportados}`
        );

        console.log(
            `Referências de cliente inexistentes removidas: ` +
            `${clientesInexistentesRemovidos}`
        );

        console.log(
            `Referências de produto inexistentes removidas: ` +
            `${produtosInexistentesRemovidos}`
        );

        console.log(
            `Referências ItemPedidoSep removidas: ` +
            `${itensSeparacaoRemovidos}`
        );

        console.log(
            `Referências ItemPedidoEntr removidas: ` +
            `${itensEntregaRemovidos}`
        );

        console.log(
            `Equipamentos pendentes para importação: ` +
            `${equipamentosParaImportar.length}`
        );

        if (equipamentosParaImportar.length === 0) {
            console.log(
                'Nenhum equipamento novo precisa ser importado.'
            );

            return;
        }

        const idsParaImportar =
            equipamentosParaImportar.map(
                (equipamento) => equipamento.id
            );

        await db.sequelize.transaction(
            async (transaction) => {
                await db.EquipRecip.bulkCreate(
                    equipamentosParaImportar,
                    {
                        transaction,
                        validate: true
                    }
                );
            }
        );

        const quantidadeImportada =
            await db.EquipRecip.count({
                where: {
                    id: idsParaImportar
                }
            });

        if (
            quantidadeImportada !==
            equipamentosParaImportar.length
        ) {
            throw new Error(
                `A conferência falhou: deveriam ser ` +
                `importados ` +
                `${equipamentosParaImportar.length} ` +
                `equipamentos, mas foram encontrados ` +
                `${quantidadeImportada} no banco.`
            );
        }

        console.log(
            'Importação de equipamentos e recipientes ' +
            'concluída com sucesso.'
        );

        console.log(
            `Equipamentos importados nesta execução: ` +
            `${quantidadeImportada}`
        );

        console.log(
            `Total de equipamentos do CSV já presentes no banco: ` +
            `${
                quantidadeImportada +
                equipamentosJaImportados
            }`
        );
    } catch (error) {
        console.error(
            '\nFalha ao importar equipamentos e recipientes:'
        );

        console.error(error.message);

        process.exitCode = 1;
    } finally {
        await db.sequelize.close();
    }
}

importarEquipRecip();