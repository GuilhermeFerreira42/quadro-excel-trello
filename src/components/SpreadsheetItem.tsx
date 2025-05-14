
import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { BoardItem, Spreadsheet, CellValue } from '@/types';

interface SpreadsheetItemProps {
  boardId: string;
  item: BoardItem;
  spreadsheet: Spreadsheet;
}

export const SpreadsheetItem = ({ boardId, item, spreadsheet }: SpreadsheetItemProps) => {
  const { openModal, data, updateSpreadsheet } = useApp();
  const expandirQuadro = data.settings.expandirQuadro;
  
  const [editingCell, setEditingCell] = useState<{ rowId: string; columnId: string } | null>(null);
  const [cellValue, setCellValue] = useState<string>('');
  
  const handleCellClick = (rowId: string, columnId: string, value: CellValue) => {
    setEditingCell({ rowId, columnId });
    setCellValue(value !== null ? value.toString() : '');
  };
  
  const handleCellChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCellValue(e.target.value);
  };
  
  const handleCellBlur = () => {
    if (editingCell) {
      const { rowId, columnId } = editingCell;
      
      // Atualiza o valor da célula
      const updatedRows = spreadsheet.rows.map(row => {
        if (row.id === rowId) {
          return {
            ...row,
            cells: {
              ...row.cells,
              [columnId]: cellValue
            }
          };
        }
        return row;
      });
      
      // Atualiza a planilha
      const updatedSpreadsheet = {
        ...spreadsheet,
        rows: updatedRows
      };
      
      updateSpreadsheet(boardId, item.id, updatedSpreadsheet);
      setEditingCell(null);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCellBlur();
    } else if (e.key === 'Escape') {
      setEditingCell(null);
    }
  };
  
  const formatCellValue = (value: CellValue, columnType: string): string => {
    if (value === null) return '';
    
    switch (columnType) {
      case 'moeda':
        return `R$ ${value}`;
      case 'porcentagem':
        return `${value}%`;
      case 'peso':
        return `${value} kg`;
      case 'checkbox':
        return value ? '✓' : '☐';
      default:
        return value.toString();
    }
  };

  // Limita a quantidade de colunas e linhas mostradas na visualização
  const visibleColumns = spreadsheet.columns.slice(0, 3);
  const visibleRows = spreadsheet.rows.slice(0, 3);
  const hasMoreColumns = spreadsheet.columns.length > 3;
  const hasMoreRows = spreadsheet.rows.length > 3;
  
  return (
    <div 
      className="bg-white rounded shadow cursor-pointer hover:shadow-md"
      onClick={() => {
        if (!editingCell) {
          openModal(boardId, item.id, 'planilha');
        }
      }}
    >
      <div 
        className={`overflow-x-auto ${expandirQuadro ? '' : 'max-h-60 overflow-y-auto'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100">
              {visibleColumns.map(column => (
                <th 
                  key={column.id} 
                  className="border-b border-gray-200 px-2 py-1 text-left font-medium text-gray-700"
                >
                  {column.title}
                </th>
              ))}
              {hasMoreColumns && (
                <th className="border-b border-gray-200 px-2 py-1 text-left font-medium text-gray-700">
                  ...
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {visibleRows.map(row => (
              <tr key={row.id}>
                {visibleColumns.map(column => (
                  <td 
                    key={`${row.id}-${column.id}`} 
                    className="border-b border-gray-200 p-0"
                  >
                    {editingCell && 
                     editingCell.rowId === row.id && 
                     editingCell.columnId === column.id ? (
                      <input
                        type="text"
                        value={cellValue}
                        onChange={handleCellChange}
                        onBlur={handleCellBlur}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        className="cell-input"
                      />
                    ) : (
                      <div 
                        className="px-2 py-1 min-h-[28px] hover:bg-gray-50"
                        onClick={() => handleCellClick(
                          row.id, 
                          column.id, 
                          row.cells[column.id] || ''
                        )}
                      >
                        {formatCellValue(row.cells[column.id] || '', column.type)}
                      </div>
                    )}
                  </td>
                ))}
                {hasMoreColumns && (
                  <td className="border-b border-gray-200 px-2 py-1 text-gray-500">...</td>
                )}
              </tr>
            ))}
            {hasMoreRows && (
              <tr>
                <td 
                  colSpan={visibleColumns.length + (hasMoreColumns ? 1 : 0)}
                  className="text-center py-1 text-gray-500 text-xs"
                >
                  ...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
