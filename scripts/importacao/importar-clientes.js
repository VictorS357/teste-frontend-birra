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
            `"${data}". Formatos aceitos: D/M/AAAA ou DD/MM/AAAA.`
        );
    }

    const [, diaTexto, mesTexto, anoTexto] = correspondencia;

    const dia = Number(diaTexto);
    const mes = Number(mesTexto);
    const ano = Number(anoTexto);

    const dataConvertida = new Date(ano, mes - 1, dia);

    const dataValida =
        dataConvertida.getFullYear() === ano &&
        dataConvertida.getMonth() === mes - 1 &&
        dataConvertida.getDate() === dia;

    if (!dataValida) {
        throw new Error(
            `Data inexistente no campo "${nomeCampo}", ` +
            `linha ${numeroLinha}: "${data}".`
        );
    }

    const diaFormatado = String(dia).padStart(2, '0');
    const mesFormatado = String(mes).padStart(2, '0');

    return `${ano}-${mesFormatado}-${diaFormatado}`;
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
            `"${horario}". Formato esperado: HH:mm ou HH:mm:ss.`
        );
    }

    const [, horaTexto, minutoTexto, segundoTexto = '00'] = correspondencia;

    const hora = Number(horaTexto);
    const minuto = Number(minutoTexto);
    const segundo = Number(segundoTexto);

    if (
        hora < 0 ||
        hora > 23 ||
        minuto < 0 ||
        minuto > 59 ||
        segundo < 0 ||
        segundo > 59
    ) {
        throw new Error(
            `Horário inexistente no campo "${nomeCampo}", ` +
            `linha ${numeroLinha}: "${horario}".`
        );
    }

    return [
        String(hora).padStart(2, '0'),
        String(minuto).padStart(2, '0'),
        String(segundo).padStart(2, '0')
    ].join(':');
}

function converterDecimal(valor, nomeCampo, numeroLinha) {
    const decimal = textoOuNull(valor);

    if (decimal === null) {
        return null;
    }

    // Aceita tanto "12,50" quanto "12.50".
    const normalizado = decimal
        .replace(/\s/g, '')
        .replace(',', '.');

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
        'Nome',
        'Tipo',
        'RazaoSocial',
        'CPF/CNPJ',
        'Contato',
        'Telefone',
        'Abre',
        'Fecha',
        'Local',
        'CondPgto',
        'Obs',
        'Cidade',
        'Imagem',
        'UltimaLimpeza',
        'Inadi',
        'stsCol'
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

function mapearClientes(registros) {
    const idsEncontrados = new Set();

    const camposImportados = [
        'Row ID',
        'Nome',
        'Tipo',
        'RazaoSocial',
        'CPF/CNPJ',
        'Contato',
        'Telefone',
        'Abre',
        'Fecha',
        'Local',
        'CondPgto',
        'Obs',
        'Cidade',
        'Imagem',
        'UltimaLimpeza',
        'Inadi',
        'stsCol'
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

    return registrosPreenchidos.map(
        ({ registro, numeroLinha }) => {
            const id = textoOuNull(registro['Row ID']);
            const nome = textoOuNull(registro.Nome);
            const tipo = textoOuNull(registro.Tipo);

            if (!id) {
                console.error(
                    `Registro problemático na linha ${numeroLinha}:`,
                    registro
                );

                throw new Error(
                    `O campo "Row ID" está vazio na linha ${numeroLinha}.`
                );
            }

            if (!nome) {
                throw new Error(
                    `O campo "Nome" está vazio na linha ${numeroLinha}.`
                );
            }

            if (!tipo) {
                throw new Error(
                    `O campo "Tipo" está vazio na linha ${numeroLinha}.`
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
                nome,
                tipo,

                razaoSocial: textoOuNull(
                    registro.RazaoSocial
                ),

                cpfCnpj: textoOuNull(
                    registro['CPF/CNPJ']
                ),

                contato: textoOuNull(
                    registro.Contato
                ),

                telefone: textoOuNull(
                    registro.Telefone
                ),

                abre: converterHorario(
                    registro.Abre,
                    'Abre',
                    numeroLinha
                ),

                fecha: converterHorario(
                    registro.Fecha,
                    'Fecha',
                    numeroLinha
                ),

                local: textoOuNull(
                    registro.Local
                ),

                condPgto: textoOuNull(
                    registro.CondPgto
                ),

                obs: textoOuNull(
                    registro.Obs
                ),

                cidade: textoOuNull(
                    registro.Cidade
                ),

                imagem: textoOuNull(
                    registro.Imagem
                ),

                ultimaLimpeza: converterData(
                    registro.UltimaLimpeza,
                    'UltimaLimpeza',
                    numeroLinha
                ),

                inadi: converterDecimal(
                    registro.Inadi,
                    'Inadi',
                    numeroLinha
                ),

                stsCol: textoOuNull(
                    registro.stsCol
                )
            };
        }
    );
}

async function importarClientes() {
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

        const clientes = mapearClientes(registros);

        console.log(`Registros encontrados no CSV: ${clientes.length}`);

        const ids = clientes.map((cliente) => cliente.id);

        const clientesExistentes = await db.Cliente.findAll({
            attributes: ['id'],
            where: {
                id: ids
            },
            raw: true
        });

        if (clientesExistentes.length > 0) {
            const idsExistentes = clientesExistentes
                .map((cliente) => cliente.id)
                .join(', ');

            throw new Error(
                'A importação foi cancelada porque estes IDs já existem ' +
                `no banco: ${idsExistentes}`
            );
        }

        await db.sequelize.transaction(async (transaction) => {
            await db.Cliente.bulkCreate(clientes, {
                transaction,
                validate: true
            });
        });

        const quantidadeImportada = await db.Cliente.count({
            where: {
                id: ids
            }
        });

        if (quantidadeImportada !== clientes.length) {
            throw new Error(
                `A conferência falhou: CSV com ${clientes.length} registros, ` +
                `mas foram encontrados ${quantidadeImportada} no banco.`
            );
        }

        console.log('Importação de clientes concluída com sucesso.');
        console.log(`Clientes importados: ${quantidadeImportada}`);
    } catch (error) {
        console.error('\nFalha ao importar clientes:');
        console.error(error.message);

        process.exitCode = 1;
    } finally {
        await db.sequelize.close();
    }
}

importarClientes();