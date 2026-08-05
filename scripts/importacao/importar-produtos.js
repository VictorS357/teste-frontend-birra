'use strict';

const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

const db = require('../../src/models');

const caminhoCsv = path.resolve(
    __dirname,
    '../../dados/csv/produtos.csv'
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
        .trim()
        .replace(/^R\$\s*/i, '')
        .replace(/\s/g, '');

    /*
     * Formatos aceitos:
     * 11
     * 11.00
     * 11,00
     * 1.234,56
     * 1,234.56
     */

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
        // Formato brasileiro sem milhar: 11,00
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

function converterBooleano(valor, nomeCampo, numeroLinha) {
    const booleano = textoOuNull(valor);

    if (booleano === null) {
        return null;
    }

    const normalizado = booleano.toLowerCase();

    const valoresVerdadeiros = [
        'y',
        'yes',
        'sim',
        'true',
        '1'
    ];

    const valoresFalsos = [
        'n',
        'no',
        'não',
        'nao',
        'false',
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
        'Descricao',
        'ValorUnit',
        'Obs',
        'UnidadeMedida',
        'Imagem',
        'Retornavel',
        'Estoque'
    ];

    const cabecalhosRecebidos = Object.keys(registros[0]);

    const ausentes = cabecalhosEsperados.filter(
        (cabecalho) => !cabecalhosRecebidos.includes(cabecalho)
    );

    if (ausentes.length > 0) {
        throw new Error(
            `Cabeçalhos ausentes no CSV: ${ausentes.join(', ')}`
        );
    }
}

function mapearProdutos(registros) {
    const idsEncontrados = new Set();

    /*
     * Ignora linhas formadas apenas por delimitadores,
     * como: ;;;;;;;
     */
    const registrosPreenchidos = registros.filter((registro) => {
        return Object.values(registro).some((valor) => {
            return textoOuNull(valor) !== null;
        });
    });

    return registrosPreenchidos.map((registro, indice) => {
        const numeroLinha = indice + 2;
        const id = textoOuNull(registro['Row ID']);

        if (!id) {
            console.error('Registro problemático:', registro);

            throw new Error(
                `O campo "Row ID" está vazio na linha processada ${numeroLinha}.`
            );
        }

        if (idsEncontrados.has(id)) {
            throw new Error(
                `Row ID duplicado no CSV, linha processada ` +
                `${numeroLinha}: "${id}".`
            );
        }

        idsEncontrados.add(id);

        return {
            id,
            descricao: textoOuNull(registro.Descricao),

            valorUnit: converterDecimal(
                registro.ValorUnit,
                'ValorUnit',
                numeroLinha
            ),

            obs: textoOuNull(registro.Obs),
            unidadeMedida: textoOuNull(registro.UnidadeMedida),
            imagem: textoOuNull(registro.Imagem),

            retornavel: converterBooleano(
                registro.Retornavel,
                'Retornavel',
                numeroLinha
            ),

            estoque: converterDecimal(
                registro.Estoque,
                'Estoque',
                numeroLinha
            )
        };
    });
}

async function importarProdutos() {
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

        const produtos = mapearProdutos(registros);

        console.log(
            `Registros encontrados no CSV: ${produtos.length}`
        );

        const ids = produtos.map((produto) => produto.id);

        const produtosExistentes = await db.Produto.findAll({
            attributes: ['id'],
            where: {
                id: ids
            },
            raw: true
        });

        if (produtosExistentes.length > 0) {
            const idsExistentes = produtosExistentes
                .map((produto) => produto.id)
                .join(', ');

            throw new Error(
                'A importação foi cancelada porque estes IDs já existem ' +
                `no banco: ${idsExistentes}`
            );
        }

        await db.sequelize.transaction(async (transaction) => {
            await db.Produto.bulkCreate(produtos, {
                transaction,
                validate: true
            });
        });

        const quantidadeImportada = await db.Produto.count({
            where: {
                id: ids
            }
        });

        if (quantidadeImportada !== produtos.length) {
            throw new Error(
                `A conferência falhou: CSV com ${produtos.length} ` +
                `registros, mas foram encontrados ` +
                `${quantidadeImportada} no banco.`
            );
        }

        console.log(
            'Importação de produtos concluída com sucesso.'
        );

        console.log(
            `Produtos importados: ${quantidadeImportada}`
        );
    } catch (error) {
        console.error('\nFalha ao importar produtos:');
        console.error(error.message);

        process.exitCode = 1;
    } finally {
        await db.sequelize.close();
    }
}

importarProdutos();