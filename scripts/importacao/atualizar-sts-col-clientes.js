'use strict';

const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

const db = require('../../src/models');

const caminhoCsv = path.resolve(
    __dirname,
    '../../dados/csv/clientes.csv'
);

function textoOuNull(valor) {
    if (valor === undefined || valor === null) {
        return null;
    }

    const texto = String(valor).trim();

    return texto === '' ? null : texto;
}

async function atualizarStsColClientes() {
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

        const atualizacoes = registros
            .map((registro, indice) => ({
                numeroLinha: indice + 2,
                id: textoOuNull(registro['Row ID']),
                stsCol: textoOuNull(registro.stsCol)
            }))
            .filter((registro) => registro.id !== null);

        console.log(
            `Clientes encontrados no CSV: ${atualizacoes.length}`
        );

        let clientesAtualizados = 0;
        let clientesNaoEncontrados = 0;

        await db.sequelize.transaction(
            async (transaction) => {
                for (const registro of atualizacoes) {
                    const [quantidade] = await db.Cliente.update(
                        {
                            stsCol: registro.stsCol
                        },
                        {
                            where: {
                                id: registro.id
                            },
                            transaction
                        }
                    );

                    if (quantidade === 0) {
                        clientesNaoEncontrados += 1;

                        console.warn(
                            `Cliente não encontrado — linha ` +
                            `${registro.numeroLinha}, ` +
                            `Row ID="${registro.id}".`
                        );
                    } else {
                        clientesAtualizados += 1;
                    }
                }
            }
        );

        console.log(
            'Atualização de stsCol concluída com sucesso.'
        );

        console.log(
            `Clientes atualizados: ${clientesAtualizados}`
        );

        console.log(
            `Clientes não encontrados: ${clientesNaoEncontrados}`
        );
    } catch (error) {
        console.error(
            '\nFalha ao atualizar stsCol dos clientes:'
        );

        console.error(error.message);
        process.exitCode = 1;
    } finally {
        await db.sequelize.close();
    }
}

atualizarStsColClientes();