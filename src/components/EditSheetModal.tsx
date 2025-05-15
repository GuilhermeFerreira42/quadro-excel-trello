
import { useState, useEffect } from 'react';
import { Item } from '@/context/AppContext';
import { Button } from './ui/button';
import { X, Plus, Trash, Maximize, Minimize } from 'lucide-react';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useApp } from '@/context/AppContext';

interface EditSheetModalProps {
  boardId: string;
  blockId: string;
  item: Item;
  onClose: () => void;
  initialIsMaximized?: boolean;
  onToggleMaximize?: (isMaximized: boolean) => void;
}

export const EditSheetModal = ({ boardId, blockId, item, onClose, initialIsMaximized = false, onToggleMaximize }: EditSheetModalProps) => {
  const { renameItem } = useApp();
  const [name, setName] = useState(item.name);
  const [isMaximized, setIsMaximized] = useState(initialIsMaximized);
  const [columns, setColumns] = useState<Array<{id: string, name: string, type: string}>>([]);
  const [rows, setRows] = useState<any[][]>([]);
  
  // Deep copy content from item for safe editing
  useEffect(() => {
    if (item.content) {
      setColumns(JSON.parse(JSON.stringify(item.content.columns || [])));
      setRows(JSON.parse(JSON.stringify(item.content.rows || [])));
    }
  }, [item]);

  const handleSave = () => {
    // Save updated name
    if (name !== item.name) {
      renameItem(boardId, blockId, item.id, name);
    }
    
    // Save other sheet data
    // This is a simplified version - in a real app, you'd update the full sheet content
    
    onClose();
  };

  const addColumn = () => {
    const newColumn = { id: `col-${Date.now()}`, name: `Nova Coluna ${columns.length + 1}`, type: 'text' };
    setColumns([...columns, newColumn]);
    
    // Add an empty cell for this column in each existing row
    const updatedRows = rows.map(row => [...row, '']);
    setRows(updatedRows);
  };

  const addRow = () => {
    // Create a new empty row with a cell for each column
    const newRow = new Array(columns.length).fill('');
    setRows([...rows, newRow]);
  };

  const updateColumnName = (columnIndex: number, newName: string) => {
    const updatedColumns = [...columns];
    updatedColumns[columnIndex] = { ...updatedColumns[columnIndex], name: newName };
    setColumns(updatedColumns);
  };

  const updateColumnType = (columnIndex: number, newType: string) => {
    const updatedColumns = [...columns];
    updatedColumns[columnIndex] = { ...updatedColumns[columnIndex], type: newType };
    setColumns(updatedColumns);
  };

  const deleteColumn = (columnIndex: number) => {
    if (columns.length > 1) {
      const updatedColumns = columns.filter((_, index) => index !== columnIndex);
      
      // Remove this column's cell from each row
      const updatedRows = rows.map(row => row.filter((_, index) => index !== columnIndex));
      
      setColumns(updatedColumns);
      setRows(updatedRows);
    }
  };

  const deleteRow = (rowIndex: number) => {
    const updatedRows = rows.filter((_, index) => index !== rowIndex);
    setRows(updatedRows);
  };

  const updateCellValue = (rowIndex: number, columnIndex: number, value: any) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex] = [...updatedRows[rowIndex]];
    
    // Handle different types of inputs
    if (columns[columnIndex]?.type === 'boolean') {
      updatedRows[rowIndex][columnIndex] = value === 'true';
    } else if (columns[columnIndex]?.type === 'number') {
      updatedRows[rowIndex][columnIndex] = value === '' ? '' : Number(value);
    } else {
      updatedRows[rowIndex][columnIndex] = value;
    }
    
    setRows(updatedRows);
  };

  const toggleMaximize = () => {
    const newMaximizedState = !isMaximized;
    setIsMaximized(newMaximizedState);
    if (onToggleMaximize) {
      onToggleMaximize(newMaximizedState);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm">
      <div 
        className={`
          bg-gray-900 rounded-md shadow-2xl border border-gray-700
          ${isMaximized 
            ? 'fixed inset-4 w-auto h-auto flex flex-col overflow-hidden' 
            : 'max-w-3xl w-[90vw] max-h-[90vh] overflow-auto'}
        `}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="max-w-md font-semibold bg-gray-800 border-gray-700 text-white"
          />
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-400 hover:text-white"
              onClick={toggleMaximize}
            >
              {isMaximized ? <Minimize size={20} /> : <Maximize size={20} />}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-400 hover:text-white"
              onClick={onClose}
            >
              <X size={20} />
            </Button>
          </div>
        </div>

        <div className={`p-4 ${isMaximized ? 'overflow-auto flex-1' : ''}`}>
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <h3 className="text-lg font-medium text-white">Planilha</h3>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-green-800/30 hover:bg-green-700 border-green-700"
                  onClick={addColumn}
                >
                  <Plus size={16} className="mr-1" /> Coluna
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-green-800/30 hover:bg-green-700 border-green-700"
                  onClick={addRow}
                >
                  <Plus size={16} className="mr-1" /> Linha
                </Button>
              </div>
            </div>
            
            <div className="border border-gray-700 rounded overflow-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-green-900/70">
                    {columns.map((column, columnIndex) => (
                      <th key={column.id} className="p-2 relative min-w-[120px] border-r border-gray-700">
                        <Input
                          value={column.name}
                          onChange={(e) => updateColumnName(columnIndex, e.target.value)}
                          className="bg-transparent border-gray-600 text-white text-xs mb-1"
                          size={1}
                        />
                        <div className="flex items-center gap-1">
                          <Select
                            value={column.type}
                            onValueChange={(value) => updateColumnType(columnIndex, value)}
                          >
                            <SelectTrigger className="h-7 text-xs bg-gray-800 border-gray-600">
                              <SelectValue placeholder="Tipo" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-600 text-white">
                              <SelectItem value="text">Texto</SelectItem>
                              <SelectItem value="number">Número</SelectItem>
                              <SelectItem value="boolean">Checkbox</SelectItem>
                              <SelectItem value="date">Data</SelectItem>
                            </SelectContent>
                          </Select>
                          
                          {columns.length > 1 && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 p-0.5 text-red-500 hover:text-red-400"
                              onClick={() => deleteColumn(columnIndex)}
                            >
                              <Trash size={14} />
                            </Button>
                          )}
                        </div>
                      </th>
                    ))}
                    <th className="w-12 p-2 text-center bg-green-900/70 text-gray-400">#</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, rowIndex) => (
                    <tr key={rowIndex} className="even:bg-gray-800/50 odd:bg-gray-700/20">
                      {row.map((cell, cellIndex) => {
                        const columnType = columns[cellIndex]?.type;
                        return (
                          <td key={`${rowIndex}-${cellIndex}`} className="p-1 border-r border-gray-700">
                            {columnType === 'boolean' ? (
                              <select
                                value={String(cell)}
                                onChange={(e) => updateCellValue(rowIndex, cellIndex, e.target.value)}
                                className="w-full p-1 bg-gray-800 border border-gray-600 rounded text-white text-xs"
                              >
                                <option value="true">✓</option>
                                <option value="false">✗</option>
                              </select>
                            ) : columnType === 'date' ? (
                              <input
                                type="date"
                                value={cell || ''}
                                onChange={(e) => updateCellValue(rowIndex, cellIndex, e.target.value)}
                                className="w-full p-1 bg-gray-800 border border-gray-600 rounded text-white text-xs"
                              />
                            ) : columnType === 'number' ? (
                              <input
                                type="number"
                                value={cell || ''}
                                onChange={(e) => updateCellValue(rowIndex, cellIndex, e.target.value)}
                                className="w-full p-1 bg-gray-800 border border-gray-600 rounded text-white text-xs"
                              />
                            ) : (
                              <input
                                type="text"
                                value={cell || ''}
                                onChange={(e) => updateCellValue(rowIndex, cellIndex, e.target.value)}
                                className="w-full p-1 bg-gray-800 border border-gray-600 rounded text-white text-xs"
                              />
                            )}
                          </td>
                        );
                      })}
                      <td className="p-1 text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 p-0.5 text-red-500 hover:text-red-400"
                          onClick={() => deleteRow(rowIndex)}
                        >
                          <Trash size={12} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              Salvar Alterações
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
