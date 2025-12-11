// src/components/UI/Table.jsx
export default function Table({ columns, data }) {
  return (
    <table className="table table-striped">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key}>{col.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? (
          data.map((row, i) => (
            <tr key={i}>
              {columns.map((col) => (
                <td key={col.key}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={columns.length} className="text-center">
              No hay datos disponibles
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
