const API_URL = 'http://localhost:3000/api'

export async function buscarTabela(endpoint) {
    const inicio = performance.now();

    const response = await fetch(
        `${API_URL}/${endpoint}`
    );

    if (!response.ok) {
        throw new Error(
            `Erro ${response.status} ao buscar ${endpoint}`
        );
    }

    const texto = await response.text();

    const fim = performance.now();

    const tamanhoBytes = new Blob([texto]).size;

    const json = JSON.parse(texto);

    return {
        ...json,

        metricas: {
            tamanhoBytes,
            tamanhoKB: tamanhoBytes / 1024,
            tamanhoMB: tamanhoBytes / 1024 / 1024,
            tempoMs: fim - inicio
        }
    };
}