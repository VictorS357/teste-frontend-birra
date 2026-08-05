'use strict';

const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

const db = require('../../src/models');

const caminhoCsv = path.resolve(
    __dirname,
    '../../dados/csv/pedidos.csv'
);

function textoOuNull(valor) {
    if (valor === undefined || valor === null) {
        return null;
    }

    const texto = String(valor).trim();

    return texto === '' ? null : texto;
}

function converterData(valor, nomeCampo, numeroLinha) {
    const data = textoOuNull(valor);

    if (data === null) {
        return null;
    }

    const correspondencia = data.match(
        /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/
    );

    if (!correspondencia) {
        throw new Error(
            `Data inválida no campo "${nomeCampo}", linha ${numeroLinha}: ` +
            `"${data}".`
        );
    }

    const [, primeiroTexto, segundoTexto, anoTexto] = correspondencia;

    const primeiro = Number(primeiroTexto);
    const segundo = Number(segundoTexto);
    const ano = Number(anoTexto);

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
        // Caso ambíguo, mantém o padrão brasileiro DD/MM/YYYY
        dia = primeiro;
        mes = segundo;
    }

    const dataValidacao = new Date(ano, mes - 1, dia);

    const dataValida =
        dataValidacao.getFullYear() === ano &&
        dataValidacao.getMonth() === mes - 1 &&
        dataValidacao.getDate() === dia;

    if (!dataValida) {
        throw new Error(
            `Data inexistente no campo "${nomeCampo}", linha ${numeroLinha}: ` +
            `"${data}".`
        );
    }

    return [
        ano,
        String(mes).padStart(2, '0'),
        String(dia).padStart(2, '0')
    ].join('-');
}

function converterHorario(valor, nomeCampo, numeroLinha) {
    const horario = textoOuNull(valor);

    if (horario === null) {
        return null;
    }

    const correspondencia = horario.match(
        /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/
    );

    if (!correspondencia) {
        throw new Error(
            `Horário inválido no campo "${nomeCampo}", linha ${numeroLinha}: ` +
            `"${horario}". Formatos aceitos: HH:mm ou HH:mm:ss.`
        );
    }

    const [, horaTexto, minutoTexto, segundoTexto = '00'] = correspondencia;

    const hora = Number(horaTexto);
    const minuto = Number(minutoTexto);
    const segundo = Number(segundoTexto);

    const horarioValido =
        hora >= 0 &&
        hora <= 23 &&
        minuto >= 0 &&
        minuto <= 59 &&
        segundo >= 0 &&
        segundo <= 59;

    if (!horarioValido) {
        throw new Error(
            `Horário inexistente no campo "${nomeCampo}", linha ${numeroLinha}: ` +
            `"${horario}".`
        );
    }

    return [
        String(hora).padStart(2, '0'),
        String(minuto).padStart(2, '0'),
        String(segundo).padStart(2, '0')
    ].join(':');
}

function converterDataHora(valor, nomeCampo, numeroLinha) {
    const dataHora = textoOuNull(valor);

    if (dataHora === null) {
        return null;
    }

    const correspondencia = dataHora.match(
        /^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?)?$/i
    );

    if (!correspondencia) {
        throw new Error(
            `Data e hora inválidas no campo "${nomeCampo}", linha ${numeroLinha}: ` +
            `"${dataHora}".`
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
        // Caso ambíguo, assume padrão brasileiro.
        dia = primeiro;
        mes = segundo;
    }

    let hora = Number(horaTexto);
    const minuto = Number(minutoTexto);
    const segundoHorario = Number(segundoHorarioTexto);

    if (periodoTexto) {
        const periodo = periodoTexto.toUpperCase();

        if (hora < 1 || hora > 12) {
            throw new Error(
                `Hora inválida no campo "${nomeCampo}", linha ${numeroLinha}: ` +
                `"${dataHora}".`
            );
        }

        if (periodo === 'AM' && hora === 12) {
            hora = 0;
        }

        if (periodo === 'PM' && hora !== 12) {
            hora += 12;
        }
    }

    const data = new Date(
        ano,
        mes - 1,
        dia,
        hora,
        minuto,
        segundoHorario
    );

    const dataValida =
        data.getFullYear() === ano &&
        data.getMonth() === mes - 1 &&
        data.getDate() === dia &&
        data.getHours() === hora &&
        data.getMinutes() === minuto &&
        data.getSeconds() === segundoHorario;

    if (!dataValida) {
        throw new Error(
            `Data e hora inexistentes no campo "${nomeCampo}", ` +
            `linha ${numeroLinha}: "${dataHora}".`
        );
    }

    return data;
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
            // Exemplo brasileiro: 1.234,56
            normalizado = normalizado
                .replace(/\./g, '')
                .replace(',', '.');
        } else {
            // Exemplo internacional: 1,234.56
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
        'Cliente',
        'Data',
        'Hora',
        'TaxaEntrega',
        'LocalCliente',
        'LocalPedido',
        'Obs',
        'Status',
        'AuxOrc',
        'AuxRota',
        'ObsColeta',
        'Solicitado',
        'DataLiberacao',
        'UsuarioLiberacao',
        'DataSeparacao',
        'UsuarioSeparacao',
        'DataEntrega',
        'UsuarioEntrega',
        'DataConclusao',
        'UsuarioConclusao',
        'Assinatura',
        'ComprovanteGerado',
        'ComprovanteEnviado',
        'ColetadoAut',
        'DataHoraColeta',
        'FotoGas',
        'CidadeEntrega',
        'Responsavel',
        'UltNot',
        'Revenda',
        'FotoCopoEntrega',
        'FotoCopoColeta'
    ];

    const cabecalhosRecebidos = Object.keys(registros[0]);

    const cabecalhosAusentes = cabecalhosEsperados.filter(
        (cabecalho) =>
            !cabecalhosRecebidos.includes(cabecalho)
    );

    if (cabecalhosAusentes.length > 0) {
        throw new Error(
            `Cabeçalhos ausentes no CSV: ` +
            cabecalhosAusentes.join(', ')
        );
    }
}

function mapearPedidos(registros) {
    const idsEncontrados = new Set();

    const camposImportados = [
        'Row ID',
        'Identificador',
        'Cliente',
        'Data',
        'Hora',
        'TaxaEntrega',
        'LocalCliente',
        'LocalPedido',
        'Obs',
        'Status',
        'AuxOrc',
        'AuxRota',
        'ObsColeta',
        'Solicitado',
        'DataLiberacao',
        'UsuarioLiberacao',
        'DataSeparacao',
        'UsuarioSeparacao',
        'DataEntrega',
        'UsuarioEntrega',
        'DataConclusao',
        'UsuarioConclusao',
        'Assinatura',
        'ComprovanteGerado',
        'ComprovanteEnviado',
        'ColetadoAut',
        'DataHoraColeta',
        'FotoGas',
        'CidadeEntrega',
        'Responsavel',
        'UltNot',
        'Revenda',
        'FotoCopoEntrega',
        'FotoCopoColeta'
    ];

    const registrosComLinha = registros.map((registro, indice) => {
        return {
            registro,
            numeroLinha: indice + 2
        };
    });

    const registrosPreenchidos = registrosComLinha.filter(
        ({ registro, numeroLinha }) => {
            const possuiAlgumDado = camposImportados.some((campo) => {
                return textoOuNull(registro[campo]) !== null;
            });

            if (!possuiAlgumDado) {
                return false;
            }

            const clienteId = textoOuNull(registro.Cliente);

            if (clienteId === null) {
                console.warn(
                    `Pedido ignorado por ausência de cliente — ` +
                    `linha ${numeroLinha}, ` +
                    `Row ID="${textoOuNull(registro['Row ID']) ?? ''}", ` +
                    `Identificador="${textoOuNull(registro.Identificador) ?? ''}".`
                );

                return false;
            }

            return true;
        }
    );

    return registrosPreenchidos.map(
        ({ registro, numeroLinha }) => {
            const id = textoOuNull(registro['Row ID']);
            const identificador = textoOuNull(
                registro.Identificador
            );

            const clienteId = textoOuNull(
                registro.Cliente
            );

            const responsavelId = textoOuNull(
                registro.Responsavel
            );

            if (!id) {
                console.error(
                    `Registro problemático na linha ${numeroLinha}:`,
                    registro
                );

                throw new Error(
                    `O campo "Row ID" está vazio na linha ${numeroLinha}.`
                );
            }

            if (!identificador) {
                console.error(
                    `Registro problemático na linha ${numeroLinha}:`,
                    registro
                );

                throw new Error(
                    `O campo "Identificador" está vazio na linha ${numeroLinha}.`
                );
            }

            if (!clienteId) {
                console.error(
                    `Registro problemático na linha ${numeroLinha}:`,
                    registro
                );

                throw new Error(
                    `O campo "Cliente" está vazio na linha ${numeroLinha}.`
                );
            }

            if (idsEncontrados.has(id)) {
                throw new Error(
                    `Row ID duplicado no CSV, linha ${numeroLinha}: "${id}".`
                );
            }

            idsEncontrados.add(id);

            const data = converterData(
                registro.Data,
                'Data',
                numeroLinha
            );

            const hora = converterHorario(
                registro.Hora,
                'Hora',
                numeroLinha
            );

            const solicitado = converterData(
                registro.Solicitado,
                'Solicitado',
                numeroLinha
            );

            if (data === null) {
                throw new Error(
                    `O campo "Data" está vazio na linha ${numeroLinha}.`
                );
            }

            return {
                id,
                identificador,
                clienteId,
                responsavelId,
                data,
                hora,

                taxaEntrega: converterDecimal(
                    registro.TaxaEntrega,
                    'TaxaEntrega',
                    numeroLinha,
                    0
                ),

                localCliente: textoOuNull(
                    registro.LocalCliente
                ),

                localPedido: textoOuNull(
                    registro.LocalPedido
                ),

                obs: textoOuNull(
                    registro.Obs
                ),

                status: textoOuNull(
                    registro.Status
                ),

                auxOrc: converterInteiro(
                    registro.AuxOrc,
                    'AuxOrc',
                    numeroLinha,
                    0
                ),

                auxRota: converterInteiro(
                    registro.AuxRota,
                    'AuxRota',
                    numeroLinha,
                    0
                ),

                obsColeta: textoOuNull(
                    registro.ObsColeta
                ),

                solicitado,

                dataLiberacao: converterData(
                    registro.DataLiberacao,
                    'DataLiberacao',
                    numeroLinha
                ),

                usuarioLiberacao: textoOuNull(
                    registro.UsuarioLiberacao
                ),

                dataSeparacao: converterData(
                    registro.DataSeparacao,
                    'DataSeparacao',
                    numeroLinha
                ),

                usuarioSeparacao: textoOuNull(
                    registro.UsuarioSeparacao
                ),

                dataEntrega: converterData(
                    registro.DataEntrega,
                    'DataEntrega',
                    numeroLinha
                ),

                usuarioEntrega: textoOuNull(
                    registro.UsuarioEntrega
                ),

                dataConclusao: converterData(
                    registro.DataConclusao,
                    'DataConclusao',
                    numeroLinha
                ),

                usuarioConclusao: textoOuNull(
                    registro.UsuarioConclusao
                ),

                assinatura: textoOuNull(
                    registro.Assinatura
                ),

                comprovanteGerado: converterBooleano(
                    registro.ComprovanteGerado,
                    'ComprovanteGerado',
                    numeroLinha
                ),

                comprovanteEnviado: converterBooleano(
                    registro.ComprovanteEnviado,
                    'ComprovanteEnviado',
                    numeroLinha
                ),

                coletadoAut: converterBooleano(
                    registro.ColetadoAut,
                    'ColetadoAut',
                    numeroLinha
                ),

                dataHoraColeta: converterDataHora(
                    registro.DataHoraColeta,
                    'DataHoraColeta',
                    numeroLinha
                ),

                fotoGas: textoOuNull(
                    registro.FotoGas
                ),

                cidadeEntrega: textoOuNull(
                    registro.CidadeEntrega
                ),

                ultNot: converterDataHora(
                    registro.UltNot,
                    'UltNot',
                    numeroLinha
                ),

                revenda: converterBooleano(
                    registro.Revenda,
                    'Revenda',
                    numeroLinha
                ),

                fotoCopoEntrega: textoOuNull(
                    registro.FotoCopoEntrega
                ),

                fotoCopoColeta: textoOuNull(
                    registro.FotoCopoColeta
                )
            };
        }
    );
}

function valoresUnicos(valores) {
    return [
        ...new Set(
            valores.filter((valor) => valor !== null)
        )
    ];
}

function encontrarAusentes(
    idsEsperados,
    registrosEncontrados
) {
    const idsEncontrados = new Set(
        registrosEncontrados.map((registro) => registro.id)
    );

    return idsEsperados.filter(
        (id) => !idsEncontrados.has(id)
    );
}

async function importarPedidos() {
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

        const pedidos = mapearPedidos(registros);

        console.log(
            `Registros encontrados no CSV: ${pedidos.length}`
        );

        const ids = pedidos.map(
            (pedido) => pedido.id
        );

        const clienteIds = valoresUnicos(
            pedidos.map(
                (pedido) => pedido.clienteId
            )
        );

        const responsavelIds = valoresUnicos(
            pedidos.map(
                (pedido) => pedido.responsavelId
            )
        );

        const [
            pedidosExistentes,
            clientesEncontrados,
            responsaveisEncontrados
        ] = await Promise.all([
            db.Pedido.findAll({
                attributes: ['id'],
                where: {
                    id: ids
                },
                raw: true
            }),

            db.Cliente.findAll({
                attributes: ['id'],
                where: {
                    id: clienteIds
                },
                raw: true
            }),

            responsavelIds.length > 0
                ? db.Usuario.findAll({
                    attributes: ['id'],
                    where: {
                        id: responsavelIds
                    },
                    raw: true
                })
                : Promise.resolve([])
        ]);

        if (pedidosExistentes.length > 0) {
            const idsExistentes = pedidosExistentes
                .map((pedido) => pedido.id)
                .join(', ');

            throw new Error(
                'A importação foi cancelada porque estes IDs ' +
                `já existem em pedidos: ${idsExistentes}`
            );
        }

        const clientesAusentes = encontrarAusentes(
            clienteIds,
            clientesEncontrados
        );

        if (clientesAusentes.length > 0) {
            throw new Error(
                'Clientes não encontrados no banco: ' +
                clientesAusentes.join(', ')
            );
        }

        const responsaveisAusentes = encontrarAusentes(
            responsavelIds,
            responsaveisEncontrados
        );

        if (responsaveisAusentes.length > 0) {
            throw new Error(
                'Usuários responsáveis não encontrados no banco: ' +
                responsaveisAusentes.join(', ')
            );
        }

        await db.sequelize.transaction(
            async (transaction) => {
                await db.Pedido.bulkCreate(pedidos, {
                    transaction,
                    validate: true
                });
            }
        );

        const quantidadeImportada = await db.Pedido.count({
            where: {
                id: ids
            }
        });

        if (quantidadeImportada !== pedidos.length) {
            throw new Error(
                `A conferência falhou: CSV com ${pedidos.length} ` +
                `registros, mas foram encontrados ` +
                `${quantidadeImportada} no banco.`
            );
        }

        console.log(
            'Importação de pedidos concluída com sucesso.'
        );

        console.log(
            `Pedidos importados: ${quantidadeImportada}`
        );
    } catch (error) {
        console.error('\nFalha ao importar pedidos:');
        console.error(error.message);

        process.exitCode = 1;
    } finally {
        await db.sequelize.close();
    }
}

importarPedidos();