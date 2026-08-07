'use strict';

const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

const db = require('../../src/models');

const caminhoCsv = path.resolve(
    __dirname,
    '../../dados/csv/equip_cliente.csv'
);

function textoOuNull(valor) {
    if (valor === undefined || valor === null) {
        return null;
    }

    const texto = String(valor).trim();

    return texto === '' ? null : texto;
}

function validarCabecalhos(registros) {
    if (registros.length === 0) {
        throw new Error(
            'O CSV não possui registros para importação.'
        );
    }

    const cabecalhosEsperados = [
        'ID_EQUIPCLIENTE',
        'F_CLIENTE',
        'DESC',
        'FOTO'
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
            `Cabeçalhos ausentes no CSV: ${ausentes.join(', ')}`
        );
    }
}

function mapearEquipClientes(registros) {
    const idsEncontrados = new Set();

    const registrosComLinha = registros.map(
        (registro, indice) => ({
            registro,
            numeroLinha: indice + 2
        })
    );

    const registrosPreenchidos = registrosComLinha.filter(
        ({ registro }) => {
            return [
                'ID_EQUIPCLIENTE',
                'F_CLIENTE',
                'DESC',
                'FOTO'
            ].some(
                (campo) =>
                    textoOuNull(registro[campo]) !== null
            );
        }
    );

    const equipamentos = registrosPreenchidos.map(
        ({ registro, numeroLinha }) => {
            const id = textoOuNull(
                registro.ID_EQUIPCLIENTE
            );

            if (!id) {
                console.warn(
                    `EquipCliente ignorado por ausência de ID — ` +
                    `linha ${numeroLinha}.`
                );

                return null;
            }

            if (idsEncontrados.has(id)) {
                throw new Error(
                    `ID duplicado no CSV, linha ${numeroLinha}: "${id}".`
                );
            }

            idsEncontrados.add(id);

            return {
                id,

                clienteId: textoOuNull(
                    registro.F_CLIENTE
                ),

                desc: textoOuNull(
                    registro.DESC
                ),

                foto: textoOuNull(
                    registro.FOTO
                ),

                numeroLinha
            };
        }
    );

    return equipamentos.filter(
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

async function importarEquipCliente() {
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

        const equipamentosMapeados =
            mapearEquipClientes(registros);

        console.log(
            `Registros encontrados no CSV: ${registros.length}`
        );

        console.log(
            `EquipClientes inicialmente válidos: ` +
            `${equipamentosMapeados.length}`
        );

        const clienteIds = valoresUnicos(
            equipamentosMapeados.map(
                (equipamento) => equipamento.clienteId
            )
        );

        const idsCsv = equipamentosMapeados.map(
            (equipamento) => equipamento.id
        );

        const [
            clientesEncontrados,
            equipamentosExistentes
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

            idsCsv.length > 0
                ? db.EquipCliente.findAll({
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

        const equipClientesExistentes =
            criarConjuntoIds(equipamentosExistentes);

        let referenciasClienteRemovidas = 0;
        let registrosJaExistentes = 0;

        const equipamentosParaImportar =
            equipamentosMapeados
                .map((equipamento) => {
                    if (
                        equipClientesExistentes.has(
                            equipamento.id
                        )
                    ) {
                        registrosJaExistentes += 1;

                        return null;
                    }

                    const equipamentoAjustado = {
                        ...equipamento
                    };

                    if (
                        equipamentoAjustado.clienteId !== null &&
                        !clientesExistentes.has(
                            equipamentoAjustado.clienteId
                        )
                    ) {
                        referenciasClienteRemovidas += 1;

                        console.warn(
                            `Referência de Cliente removida — ` +
                            `linha ${equipamento.numeroLinha}, ` +
                            `ID="${equipamento.id}", ` +
                            `Cliente="${equipamento.clienteId}".`
                        );

                        equipamentoAjustado.clienteId = null;
                    }

                    delete equipamentoAjustado.numeroLinha;

                    return equipamentoAjustado;
                })
                .filter(
                    (equipamento) => equipamento !== null
                );

        console.log(
            `EquipClientes já existentes e ignorados: ` +
            `${registrosJaExistentes}`
        );

        console.log(
            `Referências de cliente removidas: ` +
            `${referenciasClienteRemovidas}`
        );

        console.log(
            `EquipClientes pendentes para importação: ` +
            `${equipamentosParaImportar.length}`
        );

        if (equipamentosParaImportar.length === 0) {
            console.log(
                'Nenhum EquipCliente novo precisa ser importado.'
            );

            return;
        }

        const idsParaImportar =
            equipamentosParaImportar.map(
                (equipamento) => equipamento.id
            );

        await db.sequelize.transaction(
            async (transaction) => {
                await db.EquipCliente.bulkCreate(
                    equipamentosParaImportar,
                    {
                        transaction,
                        validate: true
                    }
                );
            }
        );

        const quantidadeImportada =
            await db.EquipCliente.count({
                where: {
                    id: idsParaImportar
                }
            });

        if (
            quantidadeImportada !==
            equipamentosParaImportar.length
        ) {
            throw new Error(
                `A conferência falhou: deveriam ser importados ` +
                `${equipamentosParaImportar.length} registros, ` +
                `mas foram encontrados ${quantidadeImportada}.`
            );
        }

        console.log(
            'Importação de EquipCliente concluída com sucesso.'
        );

        console.log(
            `EquipClientes importados nesta execução: ` +
            `${quantidadeImportada}`
        );
    } catch (error) {
        console.error(
            '\nFalha ao importar EquipCliente:'
        );

        console.error(error.message);

        process.exitCode = 1;
    } finally {
        await db.sequelize.close();
    }
}

importarEquipCliente();