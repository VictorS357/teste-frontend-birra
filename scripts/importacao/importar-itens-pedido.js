'use strict';

const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

const db = require('../../src/models');

const caminhoCsv = path.resolve(
    __dirname,
    '../../dados/csv/itens_pedido.csv'
);

function textoOuNull(valor) {
    if (valor === undefined || valor === null) {
        return null;
    }

    const texto = String(valor).trim();

    return texto === '' ? null : texto;
}

function converterDecimal(
    valor,
    nomeCampo,
    numeroLinha,
    valorPadrao = null
) {
    const decimal = textoOuNull(valor);

    if (decimal === null) {
        return valorPadrao;
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
            // Formato brasileiro: 1.234,56
            normalizado = normalizado
                .replace(/\./g, '')
                .replace(',', '.');
        } else {
            // Formato internacional: 1,234.56
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

function converterPercentual(valor, nomeCampo, numeroLinha) {
    const percentual = textoOuNull(valor);

    if (percentual === null) {
        return null;
    }

    const semPercentual = percentual.replace('%', '').trim();

    return converterDecimal(
        semPercentual,
        nomeCampo,
        numeroLinha
    );
}

function converterInteiro(
    valor,
    nomeCampo,
    numeroLinha,
    valorPadrao = null
) {
    const inteiro = textoOuNull(valor);

    if (inteiro === null) {
        return valorPadrao;
    }

    if (!/^-?\d+$/.test(inteiro)) {
        throw new Error(
            `Valor inteiro inválido no campo "${nomeCampo}", ` +
            `linha ${numeroLinha}: "${inteiro}".`
        );
    }

    return Number(inteiro);
}

function converterBooleano(valor, nomeCampo, numeroLinha) {
    const booleano = textoOuNull(valor);

    if (booleano === null) {
        return null;
    }

    const normalizado = booleano
        .trim()
        .toLowerCase();

    const valoresVerdadeiros = [
        'y',
        'yes',
        'sim',
        'true',
        'verdadeiro',
        '1'
    ];

    const valoresFalsos = [
        'n',
        'no',
        'não',
        'nao',
        'false',
        'falso',
        '0'
    ];

    if (valoresVerdadeiros.includes(normalizado)) {
        return true;
    }

    if (valoresFalsos.includes(normalizado)) {
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
        'Row ID',
        'Identificador',
        'Pedido',
        'Produto',
        'Qtde',
        'ValorUnit',
        'Ajuste',
        'ValorTotal',
        'Obs',
        'Bonificacao',
        'Volumes',
        'Liberado',
        'Sobra',
        'Entregue',
        'Concluido'
    ];

    const cabecalhosRecebidos = Object.keys(registros[0]);

    const ausentes = cabecalhosEsperados.filter(
        (cabecalho) =>
            !cabecalhosRecebidos.includes(cabecalho)
    );

    if (ausentes.length > 0) {
        throw new Error(
            `Cabeçalhos ausentes no CSV: ${ausentes.join(', ')}`
        );
    }
}

function mapearItens(registros) {
    const idsEncontrados = new Set();

    const registrosComLinha = registros.map((registro, indice) => ({
        registro,
        numeroLinha: indice + 2
    }));

    const registrosPreenchidos = registrosComLinha.filter(
        ({ registro }) => {
            return Object.values(registro).some(
                (valor) => textoOuNull(valor) !== null
            );
        }
    );

    const itensMapeados = registrosPreenchidos.map(
        ({ registro, numeroLinha }) => {
            const id = textoOuNull(registro['Row ID']);
            const pedidoId = textoOuNull(registro.Pedido);
            const produtoId = textoOuNull(registro.Produto);

            if (!id) {
                console.warn(
                    `Item ignorado por ausência de Row ID — ` +
                    `linha ${numeroLinha}.`
                );

                return null;
            }

            if (!pedidoId) {
                console.warn(
                    `Item ignorado por ausência de Pedido — ` +
                    `linha ${numeroLinha}, Row ID="${id}".`
                );

                return null;
            }

            if (!produtoId) {
                console.warn(
                    `Item ignorado por ausência de Produto — ` +
                    `linha ${numeroLinha}, Row ID="${id}", ` +
                    `Pedido="${pedidoId}".`
                );

                return null;
            }

            if (idsEncontrados.has(id)) {
                throw new Error(
                    `Row ID duplicado no CSV, linha ${numeroLinha}: "${id}".`
                );
            }

            idsEncontrados.add(id);

            const qtde = converterDecimal(
                registro.Qtde,
                'Qtde',
                numeroLinha
            );

            const valorUnit = converterDecimal(
                registro.ValorUnit,
                'ValorUnit',
                numeroLinha
            );

            const ajuste = converterPercentual(
                registro.Ajuste,
                'Ajuste',
                numeroLinha
            );

            const valorTotal = converterDecimal(
                registro.ValorTotal,
                'ValorTotal',
                numeroLinha
            );

            /*
             * Um item sem quantidade não pode representar uma movimentação
             * válida. Ele será ignorado, sem inventar quantidade.
             */
            if (qtde === null) {
                console.warn(
                    `Item ignorado por ausência de Qtde — ` +
                    `linha ${numeroLinha}, Row ID="${id}", ` +
                    `Pedido="${pedidoId}", Produto="${produtoId}".`
                );

                return null;
            }

            return {
                id,

                identificador: textoOuNull(
                    registro.Identificador
                ),

                pedidoId,
                produtoId,
                qtde,

                /*
                 * Se ValorUnit estiver vazio no CSV,
                 * converterDecimal retorna null.
                 */
                valorUnit,

                ajuste,
                ajuste2: null,
                valorTotal,

                obs: textoOuNull(
                    registro.Obs
                ),

                bonificacao: converterBooleano(
                    registro.Bonificacao,
                    'Bonificacao',
                    numeroLinha
                ),

                volumes: converterInteiro(
                    registro.Volumes,
                    'Volumes',
                    numeroLinha
                ),

                liberado: converterBooleano(
                    registro.Liberado,
                    'Liberado',
                    numeroLinha
                ),

                sobra: converterDecimal(
                    registro.Sobra,
                    'Sobra',
                    numeroLinha
                ),

                entregue: converterBooleano(
                    registro.Entregue,
                    'Entregue',
                    numeroLinha
                ),

                concluido: converterBooleano(
                    registro.Concluido,
                    'Concluido',
                    numeroLinha
                ),

                numeroLinha
            };
        }
    );

    return itensMapeados.filter(
        (item) => item !== null
    );
}

function valoresUnicos(valores) {
    return [...new Set(valores.filter(Boolean))];
}

function encontrarAusentes(idsEsperados, registrosEncontrados) {
    const idsEncontrados = new Set(
        registrosEncontrados.map((registro) => registro.id)
    );

    return idsEsperados.filter(
        (id) => !idsEncontrados.has(id)
    );
}

async function importarItensPedido() {
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

        const itensMapeados = mapearItens(registros);

        const pedidoIds = valoresUnicos(
            itensMapeados.map((item) => item.pedidoId)
        );

        const produtoIds = valoresUnicos(
            itensMapeados.map((item) => item.produtoId)
        );

        const [pedidosEncontrados, produtosEncontrados] =
            await Promise.all([
                db.Pedido.findAll({
                    attributes: ['id'],
                    where: {
                        id: pedidoIds
                    },
                    raw: true
                }),

                db.Produto.findAll({
                    attributes: ['id'],
                    where: {
                        id: produtoIds
                    },
                    raw: true
                })
            ]);

        const pedidosExistentes = new Set(
            pedidosEncontrados.map((pedido) => pedido.id)
        );

        const itensIgnorados = itensMapeados.filter(
            (item) => !pedidosExistentes.has(item.pedidoId)
        );

        itensIgnorados.forEach((item) => {
            console.warn(
                `Item ignorado porque o pedido não existe — ` +
                `linha ${item.numeroLinha}, ` +
                `Row ID="${item.id}", ` +
                `Pedido="${item.pedidoId}".`
            );
        });

        const itens = itensMapeados
            .filter((item) =>
                pedidosExistentes.has(item.pedidoId)
            )
            .map(({ numeroLinha, ...item }) => item);

        const produtosAusentes = encontrarAusentes(
            produtoIds,
            produtosEncontrados
        );

        if (produtosAusentes.length > 0) {
            throw new Error(
                'Produtos referenciados que não foram encontrados: ' +
                produtosAusentes.join(', ')
            );
        }

        if (itens.length === 0) {
            throw new Error(
                'Nenhum item válido permaneceu para importação.'
            );
        }

        console.log(
            `Registros encontrados no CSV: ${itensMapeados.length}`
        );

        console.log(
            `Itens ignorados por pedido inexistente: ${itensIgnorados.length}`
        );

        console.log(
            `Itens válidos para importação: ${itens.length}`
        );

        const ids = itens.map((item) => item.id);

        const itensExistentes = await db.ItemPedido.findAll({
            attributes: ['id'],
            where: {
                id: ids
            },
            raw: true
        });

        if (itensExistentes.length > 0) {
            throw new Error(
                'Estes itens já existem no banco: ' +
                itensExistentes
                    .map((item) => item.id)
                    .join(', ')
            );
        }

        await db.sequelize.transaction(
            async (transaction) => {
                await db.ItemPedido.bulkCreate(itens, {
                    transaction,
                    validate: true
                });
            }
        );

        const quantidadeImportada =
            await db.ItemPedido.count({
                where: {
                    id: ids
                }
            });

        if (quantidadeImportada !== itens.length) {
            throw new Error(
                `A conferência falhou: deveriam ser importados ` +
                `${itens.length} itens, mas foram encontrados ` +
                `${quantidadeImportada} no banco.`
            );
        }

        console.log(
            'Importação dos itens de pedido concluída com sucesso.'
        );

        console.log(
            `Itens importados: ${quantidadeImportada}`
        );
    } catch (error) {
        console.error('\nFalha ao importar itens de pedido:');
        console.error(error.message);

        process.exitCode = 1;
    } finally {
        await db.sequelize.close();
    }
}

importarItensPedido();