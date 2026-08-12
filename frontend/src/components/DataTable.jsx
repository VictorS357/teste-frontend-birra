function DataTable({ columns, data }) {
    return (
        <div className="table-wrapper">
            <table className="data-table">
                <thead>
                    <tr>
                        {columns.map((column) => {
                            <th key={column.key}>
                                {column.label}
                            </th>
                        })}
                    </tr>
                </thead>

                <tbody>
                    {data.map((row) => {
                        <tr key={row.id}>
                            {columns.map((column) => {
                                <td key={column.key}>
                                    {row[column.key] ?? '-'}
                                </td>
                            })}
                        </tr>
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default DataTable;