import { useState } from 'react';

function DataTable({
  columns = [],
  data = [],
  pageSize = 50
}) {
  const [paginaAtual, setPaginaAtual] = useState(1);

  if (!Array.isArray(data)) {
    return (
      <p>
        Os dados recebidos não possuem formato de lista.
      </p>
    );
  }

  if (data.length === 0) {
    return (
      <p>
        Nenhum registro encontrado.
      </p>
    );
  }

  const totalPaginas = Math.ceil(
    data.length / pageSize
  );

  const inicio = (
    paginaAtual - 1
  ) * pageSize;

  const fim = inicio + pageSize;

  const dadosDaPagina = data.slice(
    inicio,
    fim
  );

  function paginaAnterior() {
    setPaginaAtual((pagina) =>
      Math.max(pagina - 1, 1)
    );
  }

  function proximaPagina() {
    setPaginaAtual((pagina) =>
      Math.min(
        pagina + 1,
        totalPaginas
      )
    );
  }

  return (
    <div className="data-table-container">
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key}>
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {dadosDaPagina.map((row, rowIndex) => (
              <tr
                key={
                  row.id ??
                  row.identificador ??
                  rowIndex
                }
              >
                {columns.map((column) => {
                  const valor = row[column.key];

                  const valorExibido =
                    valor === null ||
                      valor === undefined ||
                      valor === ''
                      ? '-'
                      : String(valor);

                  return (
                    <td
                      key={column.key}
                      title={valorExibido}
                    >
                      {valorExibido}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <span>
          Mostrando{' '}
          {inicio + 1}–{Math.min(
            fim,
            data.length
          )}{' '}
          de{' '}
          {data.length.toLocaleString(
            'pt-BR'
          )}
        </span>

        <div className="pagination-controls">
          <button
            type="button"
            onClick={paginaAnterior}
            disabled={
              paginaAtual === 1
            }
          >
            Anterior
          </button>

          <span>
            Página {paginaAtual} de{' '}
            {totalPaginas}
          </span>

          <button
            type="button"
            onClick={proximaPagina}
            disabled={
              paginaAtual ===
              totalPaginas
            }
          >
            Próxima
          </button>
        </div>
      </div>
    </div>
  );
}

export default DataTable;