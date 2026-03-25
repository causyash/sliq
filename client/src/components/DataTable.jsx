import React from 'react';
import { motion } from 'framer-motion';

const DataTable = ({ columns, data, onRowClick, emptyMessage = "No data found." }) => {
  return (
    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden p-2">
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full border-separate border-spacing-y-2 px-4 pb-4">
          <thead>
            <tr>
              {columns.map((column, i) => (
                <th 
                  key={i}
                  className={`text-left text-[10px] font-black text-gray-400 uppercase tracking-widest px-6 py-4 ${column.className || ''}`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((row, rowIndex) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: rowIndex * 0.05 }}
                  key={rowIndex}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`group hover:bg-indigo-50/30 transition-all cursor-pointer rounded-2xl`}
                >
                  {columns.map((column, colIndex) => (
                    <td 
                      key={colIndex}
                      className={`px-6 py-5 text-sm ${colIndex === 0 ? 'rounded-l-2xl' : ''} ${colIndex === columns.length - 1 ? 'rounded-r-2xl' : ''} ${column.cellClassName || ''}`}
                    >
                      {column.cell ? column.cell(row) : row[column.accessor]}
                    </td>
                  ))}
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center py-20 text-gray-400 font-bold italic">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
