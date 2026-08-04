'use strict';

const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

const db = require('../../src/models');

const caminhoCsv = path.resolve(
    __dirname,
    '../../dados/csv/usuarios.csv'
);

/**
 * Converte valores vazios do CSV para null.
 */
function textoOuNull(valor) {
    if (valor === undefined || valor === null) {
        return null;
    }

    const texto = String(valor).trim();

    return texto === '' ? null : texto;
}

/**
 * Converte uma data no formato DD/MM/YYYY
 * para o formato YYYY-MM-DD, usado pelo DATEONLY.
 */
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
            `Data inválida no campo "${nomeCampo}", linha ${numeroLinha}: "${data}". ` +
            'Formatos aceitos: D/M/AAAA ou DD/MM/AAAA.'
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
            `Data inexistente no campo "${nomeCampo}", linha ${numeroLinha}: "${data}".`
        );
    }

    const diaFormatado = String(dia).padStart(2, '0');
    const mesFormatado = String(mes).padStart(2, '0');

    return `${ano}-${mesFormatado}-${diaFormatado}`;
}

/**
 * Valida os cabeçalhos necessários.
 */
function validarCabecalhos(registros) {
    if (registros.length === 0) {
        throw new Error('O CSV não possui registros para importação.');
    }

    const cabecalhosEsperados = [
        'Row ID',
        'Nome',
        'Email',
        'Tipo',
        'Foto',
        'TelaInicial',
        'DataInicio',
        'DataFim'
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

/**
 * Mapeia os nomes do AppSheet para os atributos do Model Usuario.
 */
function mapearUsuarios(registros) {
    const idsEncontrados = new Set();

    return registros.map((registro, indice) => {
        // Linha 1 é o cabeçalho; o primeiro registro está na linha 2.
        const numeroLinha = indice + 2;
        const id = textoOuNull(registro['Row ID']);

        if (!id) {
            throw new Error(
                `O campo "Row ID" está vazio na linha ${numeroLinha}.`
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
            nome: textoOuNull(registro.Nome),
            email: textoOuNull(registro.Email),
            tipo: textoOuNull(registro.Tipo),
            foto: textoOuNull(registro.Foto),
            telaInicial: textoOuNull(registro.TelaInicial),

            dataInicio: converterData(
                registro.DataInicio,
                'DataInicio',
                numeroLinha
            ),

            dataFim: converterData(
                registro.DataFim,
                'DataFim',
                numeroLinha
            )
        };
    });
}

async function importarUsuarios() {
    try {
        if (!fs.existsSync(caminhoCsv)) {
            throw new Error(
                `Arquivo não encontrado: ${caminhoCsv}`
            );
        }

        const conteudoCsv = fs
            .readFileSync(caminhoCsv, 'utf8')
            // Remove BOM que alguns arquivos CSV UTF-8 possuem.
            .replace(/^\uFEFF/, '');

        const registros = parse(conteudoCsv, {
            columns: true,
            delimiter: ';',
            skip_empty_lines: true,
            trim: true
        });

        validarCabecalhos(registros);

        const usuarios = mapearUsuarios(registros);

        console.log(`Registros encontrados no CSV: ${usuarios.length}`);

        const ids = usuarios.map((usuario) => usuario.id);

        const usuariosExistentes = await db.Usuario.findAll({
            attributes: ['id'],
            where: {
                id: ids
            },
            raw: true
        });

        if (usuariosExistentes.length > 0) {
            const idsExistentes = usuariosExistentes
                .map((usuario) => usuario.id)
                .join(', ');

            throw new Error(
                `A importação foi cancelada porque estes IDs já existem no banco: ${idsExistentes}`
            );
        }

        await db.sequelize.transaction(async (transaction) => {
            await db.Usuario.bulkCreate(usuarios, {
                transaction,
                validate: true
            });
        });

        const quantidadeImportada = await db.Usuario.count({
            where: {
                id: ids
            }
        });

        if (quantidadeImportada !== usuarios.length) {
            throw new Error(
                `A conferência falhou: CSV com ${usuarios.length} registros, ` +
                `mas foram encontrados ${quantidadeImportada} no banco.`
            );
        }

        console.log('Importação de usuários concluída com sucesso.');
        console.log(`Usuários importados: ${quantidadeImportada}`);
    } catch (error) {
        console.error('\nFalha ao importar usuários:');
        console.error(error.message);

        process.exitCode = 1;
    } finally {
        await db.sequelize.close();
    }
}

importarUsuarios();