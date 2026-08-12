function DataTable({ columns = [], data = [] }) {
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

    return (
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
                    {data.map((row, rowIndex) => (
                        <tr
                            key={
                                row.id ??
                                row.identificador ??
                                rowIndex
                            }
                        >
                            {columns.map((column) => (
                                <td key={column.key}>
                                    {row[column.key] === null ||
                                        row[column.key] === undefined ||
                                        row[column.key] === ''
                                        ? '-'
                                        : String(row[column.key])}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default DataTable;