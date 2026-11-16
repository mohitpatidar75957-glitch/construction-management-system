import React from 'react';

export default function DataTable({ columns, data, keyField = 'id', emptyMessage = 'No records found' }) {
  return (
    <div className="table-responsive-box">
      <table className="dubai-data-table">
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} style={{ whiteSpace: 'nowrap', textAlign: col.align || 'left' }}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: 'center', padding: '36px', color: '#71717a' }}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={row[keyField]}>
                {columns.map((col, idx) => (
                  <td key={idx} style={{ textAlign: col.align || 'left', whiteSpace: col.nowrap ? 'nowrap' : 'normal' }}>
                    {col.render ? col.render(row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

