'use strict';

const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

const db = require('../../src/models');

const caminhoCsv = path.resolve(
    __dirname,
    '../../dados/csv/tabela_preco.csv'
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

    const possuiVirgula = normalizado.includes(',');
    const possuiPonto = normalizado.includes('.');

    if (possuiVirgula && possuiPonto) {
        const ultimaVirgula = normalizado.lastIndexOf(',');
        const ultimoPonto = normalizado.lastIndexOf('.');

        if (ultimaVirgula > ultimoPonto) {
            // Exemplo: 1.234,56
            normalizado = normalizado
                .replace(/\./g, '')
                .replace(',', '.');
        } else {
            // Exemplo: 1,234.56
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

function validarCabecalhos(registros) {
    if (registros.length === 0) {
        throw new Error('O CSV não possui registros para importação.');
    }

    const cabecalhosEsperados = [
        'Row ID',
        'Identificador',
        'Cliente',
        'Produto',
        'Preco',
        'Obs'
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

function mapearTabelaPreco(registros) {
    const idsEncontrados = new Set();

    const registrosPreenchidos = registros.filter((registro) => {
        const id = textoOuNull(registro['Row ID']);
        const clienteId = textoOuNull(registro.Cliente);
        const produtoId = textoOuNull(registro.Produto);
        const preco = textoOuNull(registro.Preco);

        const linhaTotalmenteVazia =
            id === null &&
            clienteId === null &&
            produtoId === null &&
            preco === null;

        if (linhaTotalmenteVazia) {
            return false;
        }

        if (preco === null) {
            console.warn(
                `Linha ignorada por ausência de preço: ` +
                `Row ID="${id ?? ''}", Cliente="${clienteId ?? ''}", ` +
                `Produto="${produtoId ?? ''}".`
            );

            return false;
        }

        return true;
    });

    return registrosPreenchidos.map((registro, indice) => {
        const numeroLinha = indice + 2;

        const id = textoOuNull(registro['Row ID']);
        const clienteId = textoOuNull(registro.Cliente);
        const produtoId = textoOuNull(registro.Produto);

        const preco = converterDecimal(
            registro.Preco,
            'Preco',
            numeroLinha
        );

        if (!id) {
            throw new Error(
                `O campo "Row ID" está vazio na linha ${numeroLinha}.`
            );
        }

        if (!clienteId) {
            throw new Error(
                `O campo "Cliente" está vazio na linha ${numeroLinha}.`
            );
        }

        if (!produtoId) {
            throw new Error(
                `O campo "Produto" está vazio na linha ${numeroLinha}.`
            );
        }

        if (preco === null) {
            throw new Error(
                `O campo "Preco" está vazio na linha ${numeroLinha}.`
            );
        }

        if (idsEncontrados.has(id)) {
            throw new Error(
                `Row ID duplicado no CSV, linha ${numeroLinha}: "${id}".`
            );
        }

        idsEncontrados.add(id);

        return {
            id,
            identificador: textoOuNull(registro.Identificador),
            clienteId,
            produtoId,
            preco,
            obs: textoOuNull(registro.Obs)
        };
    });
}

function valoresUnicos(valores) {
    return [...new Set(valores)];
}

function encontrarAusentes(idsEsperados, registrosEncontrados) {
    const idsEncontrados = new Set(
        registrosEncontrados.map((registro) => registro.id)
    );

    return idsEsperados.filter((id) => !idsEncontrados.has(id));
}

async function importarTabelaPreco() {
    try {
        if (!fs.existsSync(caminhoCsv)) {
            throw new Error(`Arquivo não encontrado: ${caminhoCsv}`);
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

        const precos = mapearTabelaPreco(registros);

        console.log(
            `Registros encontrados no CSV: ${precos.length}`
        );

        const ids = precos.map((registro) => registro.id);

        const idsClientes = valoresUnicos(
            precos.map((registro) => registro.clienteId)
        );

        const idsProdutos = valoresUnicos(
            precos.map((registro) => registro.produtoId)
        );

        const [
            registrosExistentes,
            clientesEncontrados,
            produtosEncontrados
        ] = await Promise.all([
            db.TabelaPreco.findAll({
                attributes: ['id'],
                where: {
                    id: ids
                },
                raw: true
            }),

            db.Cliente.findAll({
                attributes: ['id'],
                where: {
                    id: idsClientes
                },
                raw: true
            }),

            db.Produto.findAll({
                attributes: ['id'],
                where: {
                    id: idsProdutos
                },
                raw: true
            })
        ]);

        if (registrosExistentes.length > 0) {
            const idsExistentes = registrosExistentes
                .map((registro) => registro.id)
                .join(', ');

            throw new Error(
                'A importação foi cancelada porque estes IDs já existem ' +
                `em tabela_preco: ${idsExistentes}`
            );
        }

        const clientesAusentes = encontrarAusentes(
            idsClientes,
            clientesEncontrados
        );

        if (clientesAusentes.length > 0) {
            throw new Error(
                'Existem referências para clientes que não foram encontrados: ' +
                clientesAusentes.join(', ')
            );
        }

        const produtosAusentes = encontrarAusentes(
            idsProdutos,
            produtosEncontrados
        );

        if (produtosAusentes.length > 0) {
            throw new Error(
                'Existem referências para produtos que não foram encontrados: ' +
                produtosAusentes.join(', ')
            );
        }

        await db.sequelize.transaction(async (transaction) => {
            await db.TabelaPreco.bulkCreate(precos, {
                transaction,
                validate: true
            });
        });

        const quantidadeImportada = await db.TabelaPreco.count({
            where: {
                id: ids
            }
        });

        if (quantidadeImportada !== precos.length) {
            throw new Error(
                `A conferência falhou: CSV com ${precos.length} registros, ` +
                `mas foram encontrados ${quantidadeImportada} no banco.`
            );
        }

        console.log(
            'Importação da tabela de preços concluída com sucesso.'
        );

        console.log(
            `Preços importados: ${quantidadeImportada}`
        );
    } catch (error) {
        console.error('\nFalha ao importar a tabela de preços:');
        console.error(error.message);

        process.exitCode = 1;
    } finally {
        await db.sequelize.close();
    }
}

importarTabelaPreco();