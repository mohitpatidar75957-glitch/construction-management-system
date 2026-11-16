import React from 'react';

export default function GlassTable({ columns, data, keyField = 'id', emptyMessage = 'No records found' }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/60 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {columns.map((col, idx) => (
              <th key={idx} className={`py-3 px-3 sm:px-4 ${col.className || ''}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-xs sm:text-sm text-slate-800">
          {(!data || data.length === 0) ? (
            <tr>
              <td colSpan={columns.length} className="py-8 text-center text-slate-400">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIdx) => (
              <tr 
                key={row[keyField] || rowIdx} 
                className="border-b border-white/40 hover:bg-white/30 transition-colors duration-150"
              >
                {columns.map((col, colIdx) => (
                  <td key={colIdx} className={`py-3.5 px-3 sm:px-4 ${col.className || ''}`}>
                    {col.render ? col.render(row, rowIdx) : row[col.accessor]}
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
