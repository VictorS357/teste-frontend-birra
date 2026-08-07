'use strict';

const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

const db = require('../../src/models');

const caminhoCsv = path.resolve(
    __dirname,
    '../../dados/csv/imagens_acao.csv'
);

function textoOuNull(valor) {
    if (valor === undefined || valor === null) {
        return null;
    }

    const texto = String(valor).trim();

    return texto === '' ? null : texto;
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
        dia = primeiro;
        mes = segundo;
    } else if (segundo > 12 && primeiro <= 12) {
        mes = primeiro;
        dia = segundo;
    } else {
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

function validarCabecalhos(registros) {
    if (registros.length === 0) {
        throw new Error(
            'O CSV não possui registros para importação.'
        );
    }

    const cabecalhosEsperados = [
        'Row ID',
        'Descricao',
        'Acao',
        'Img',
        'Responsavel',
        'DataEHora'
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

function mapearImagensAcao(registros) {
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
                'Row ID',
                'Descricao',
                'Acao',
                'Img',
                'Responsavel',
                'DataEHora'
            ].some(
                (campo) =>
                    textoOuNull(registro[campo]) !== null
            );
        }
    );

    const imagens = registrosPreenchidos.map(
        ({ registro, numeroLinha }) => {
            const id = textoOuNull(
                registro['Row ID']
            );

            if (!id) {
                console.warn(
                    `ImagemAcao ignorada por ausência de Row ID — ` +
                    `linha ${numeroLinha}.`
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

            return {
                id,

                descricao: textoOuNull(
                    registro.Descricao
                ),

                acaoId: textoOuNull(
                    registro.Acao
                ),

                img: textoOuNull(
                    registro.Img
                ),

                responsavelId: textoOuNull(
                    registro.Responsavel
                ),

                dataEHora: converterDataHora(
                    registro.DataEHora,
                    'DataEHora',
                    numeroLinha
                ),

                numeroLinha
            };
        }
    );

    return imagens.filter(
        (imagem) => imagem !== null
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

async function importarImagensAcao() {
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

        const imagensMapeadas =
            mapearImagensAcao(registros);

        console.log(
            `Registros encontrados no CSV: ` +
            `${registros.length}`
        );

        console.log(
            `Imagens inicialmente válidas: ` +
            `${imagensMapeadas.length}`
        );

        const acaoIds = valoresUnicos(
            imagensMapeadas.map(
                (imagem) => imagem.acaoId
            )
        );

        const responsavelIds = valoresUnicos(
            imagensMapeadas.map(
                (imagem) => imagem.responsavelId
            )
        );

        const idsCsv = imagensMapeadas.map(
            (imagem) => imagem.id
        );

        const [
            acoesEncontradas,
            responsaveisEncontrados,
            imagensExistentes
        ] = await Promise.all([
            acaoIds.length > 0
                ? db.Planejamento.findAll({
                    attributes: ['id'],
                    where: {
                        id: acaoIds
                    },
                    raw: true
                })
                : Promise.resolve([]),

            responsavelIds.length > 0
                ? db.Usuario.findAll({
                    attributes: ['id'],
                    where: {
                        id: responsavelIds
                    },
                    raw: true
                })
                : Promise.resolve([]),

            idsCsv.length > 0
                ? db.ImagemAcao.findAll({
                    attributes: ['id'],
                    where: {
                        id: idsCsv
                    },
                    raw: true
                })
                : Promise.resolve([])
        ]);

        const acoesExistentes =
            criarConjuntoIds(acoesEncontradas);

        const responsaveisExistentes =
            criarConjuntoIds(responsaveisEncontrados);

        const imagensJaExistentes =
            criarConjuntoIds(imagensExistentes);

        let acoesRemovidas = 0;
        let responsaveisRemovidos = 0;
        let registrosJaExistentes = 0;

        const imagensParaImportar =
            imagensMapeadas
                .map((imagem) => {
                    if (
                        imagensJaExistentes.has(
                            imagem.id
                        )
                    ) {
                        registrosJaExistentes += 1;

                        return null;
                    }

                    const imagemAjustada = {
                        ...imagem
                    };

                    if (
                        imagemAjustada.acaoId !== null &&
                        !acoesExistentes.has(
                            imagemAjustada.acaoId
                        )
                    ) {
                        acoesRemovidas += 1;

                        console.warn(
                            `Referência de Acao removida — ` +
                            `linha ${imagem.numeroLinha}, ` +
                            `Row ID="${imagem.id}", ` +
                            `Acao="${imagem.acaoId}".`
                        );

                        imagemAjustada.acaoId = null;
                    }

                    if (
                        imagemAjustada.responsavelId !== null &&
                        !responsaveisExistentes.has(
                            imagemAjustada.responsavelId
                        )
                    ) {
                        responsaveisRemovidos += 1;

                        console.warn(
                            `Referência de Responsavel removida — ` +
                            `linha ${imagem.numeroLinha}, ` +
                            `Row ID="${imagem.id}", ` +
                            `Responsavel="${imagem.responsavelId}".`
                        );

                        imagemAjustada.responsavelId = null;
                    }

                    delete imagemAjustada.numeroLinha;

                    return imagemAjustada;
                })
                .filter(
                    (imagem) => imagem !== null
                );

        console.log(
            `Imagens já existentes e ignoradas: ` +
            `${registrosJaExistentes}`
        );

        console.log(
            `Referências de ações removidas: ` +
            `${acoesRemovidas}`
        );

        console.log(
            `Referências de responsáveis removidas: ` +
            `${responsaveisRemovidos}`
        );

        console.log(
            `Imagens pendentes para importação: ` +
            `${imagensParaImportar.length}`
        );

        if (imagensParaImportar.length === 0) {
            console.log(
                'Nenhuma imagem de ação nova precisa ser importada.'
            );

            return;
        }

        const idsParaImportar =
            imagensParaImportar.map(
                (imagem) => imagem.id
            );

        await db.sequelize.transaction(
            async (transaction) => {
                await db.ImagemAcao.bulkCreate(
                    imagensParaImportar,
                    {
                        transaction,
                        validate: true
                    }
                );
            }
        );

        const quantidadeImportada =
            await db.ImagemAcao.count({
                where: {
                    id: idsParaImportar
                }
            });

        if (
            quantidadeImportada !==
            imagensParaImportar.length
        ) {
            throw new Error(
                `A conferência falhou: deveriam ser importadas ` +
                `${imagensParaImportar.length} imagens, ` +
                `mas foram encontradas ${quantidadeImportada}.`
            );
        }

        console.log(
            'Importação de ImagensAcao concluída com sucesso.'
        );

        console.log(
            `Imagens importadas nesta execução: ` +
            `${quantidadeImportada}`
        );
    } catch (error) {
        console.error(
            '\nFalha ao importar ImagensAcao:'
        );

        console.error(error.message);

        process.exitCode = 1;
    } finally {
        await db.sequelize.close();
    }
}

importarImagensAcao();