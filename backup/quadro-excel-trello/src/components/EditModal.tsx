import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  Dialog, 
  DialogContent,
  DialogTitle,
  DialogHeader
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Maximize, 
  Minimize, 
  X, 
  Plus, 
  Trash2 
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { 
  Column, 
  CellType, 
  Row, 
  Card, 
  Spreadsheet,
  ChecklistItem,
  Checklist as ChecklistType
} from '@/types';
import { Checkbox } from './ui/checkbox';

export const EditModal = () => {
  const { 
    modal, 
    closeModal, 
    toggleMaximizeModal, 
    data, 
    updateSpreadsheet, 
    updateCard, 
    deleteItem 
  } = useApp();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [columns, setColumns] = useState<Column[]>([]);
  const [rows, setRows] = useState<Row[]>([]);
  const [checklists, setChecklists] = useState<ChecklistType[]>([]);
  const [newColumn, setNewColumn] = useState('');
  const [newChecklistTitle, setNewChecklistTitle] = useState('');
  const [selectedColumnType, setSelectedColumnType] = useState<CellType>('texto');
  
  useEffect(() => {
    if (modal.isOpen && modal.boardId && modal.itemId && modal.type) {
      const board = data.boards.find(b => b.id === modal.boardId);
      if (!board) return;
      
      const item = board.items.find(i => i.id === modal.itemId);
      if (!item) return;
      
      if (modal.type === 'planilha') {
        const spreadsheet = item.content as Spreadsheet;
        setColumns(spreadsheet.columns);
        setRows(spreadsheet.rows);
      } else if (modal.type === 'cartao') {
        const card = item.content as Card;
        setTitle(card.title);
        setDescription(card.description);
        setChecklists(card.checklists);
      }
    }
  }, [modal, data.boards]);
  
  const handleSave = () => {
    if (!modal.boardId || !modal.itemId || !modal.type) return;
    
    if (modal.type === 'planilha') {
      const updatedSpreadsheet: Spreadsheet = {
        id: modal.itemId,
        columns,
        rows
      };
      updateSpreadsheet(modal.boardId, modal.itemId, updatedSpreadsheet);
    } else if (modal.type === 'cartao') {
      const updatedCard: Card = {
        id: modal.itemId,
        title,
        description,
        checklists
      };
      updateCard(modal.boardId, modal.itemId, updatedCard);
    }
    
    closeModal();
  };
  
  const handleAddColumn = () => {
    if (!newColumn.trim()) return;
    
    const column: Column = {
      id: crypto.randomUUID(),
      title: newColumn,
      type: selectedColumnType
    };
    
    setColumns([...columns, column]);
    setNewColumn('');
  };
  
  const handleRemoveColumn = (columnId: string) => {
    setColumns(columns.filter(col => col.id !== columnId));
    
    // Remover também as células desta coluna de todas as linhas
    setRows(rows.map(row => {
      const updatedCells = { ...row.cells };
      delete updatedCells[columnId];
      return { ...row, cells: updatedCells };
    }));
  };
  
  const handleAddRow = () => {
    const row: Row = {
      id: crypto.randomUUID(),
      cells: {}
    };
    
    setRows([...rows, row]);
  };
  
  const handleRemoveRow = (rowId: string) => {
    setRows(rows.filter(row => row.id !== rowId));
  };
  
  // Corrigido: Tratamento correto do tipo de valor da célula
  const handleCellChange = (rowId: string, columnId: string, value: string) => {
    setRows(rows.map(row => {
      if (row.id === rowId) {
        return {
          ...row,
          cells: {
            ...row.cells,
            [columnId]: value
          }
        };
      }
      return row;
    }));
  };
  
  const handleAddChecklist = () => {
    if (!newChecklistTitle.trim()) return;
    
    const checklist: ChecklistType = {
      id: crypto.randomUUID(),
      title: newChecklistTitle,
      items: []
    };
    
    setChecklists([...checklists, checklist]);
    setNewChecklistTitle('');
  };
  
  const handleRemoveChecklist = (checklistId: string) => {
    setChecklists(checklists.filter(cl => cl.id !== checklistId));
  };
  
  const handleAddChecklistItem = (checklistId: string, text: string) => {
    if (!text.trim()) return;
    
    const item: ChecklistItem = {
      id: crypto.randomUUID(),
      text,
      checked: false
    };
    
    setChecklists(checklists.map(cl => {
      if (cl.id === checklistId) {
        return {
          ...cl,
          items: [...cl.items, item]
        };
      }
      return cl;
    }));
  };
  
  const handleRemoveChecklistItem = (checklistId: string, itemId: string) => {
    setChecklists(checklists.map(cl => {
      if (cl.id === checklistId) {
        return {
          ...cl,
          items: cl.items.filter(item => item.id !== itemId)
        };
      }
      return cl;
    }));
  };
  
  // Corrigido: Agora a mudança de estado do checkbox está correta
  const handleToggleChecklistItem = (checklistId: string, itemId: string) => {
    setChecklists(checklists.map(cl => {
      if (cl.id === checklistId) {
        return {
          ...cl,
          items: cl.items.map(item => {
            if (item.id === itemId) {
              return {
                ...item,
                checked: !item.checked
              };
            }
            return item;
          })
        };
      }
      return cl;
    }));
  };
  
  const renderCardContent = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1"
        />
      </div>
      
      <div>
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 min-h-[100px]"
        />
      </div>
      
      <Separator />
      
      <div className="space-y-2">
        <h3 className="text-base font-medium">Checklists</h3>
        
        {checklists.map(checklist => (
          <div key={checklist.id} className="border rounded-md p-3">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium">{checklist.title}</h4>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => handleRemoveChecklist(checklist.id)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
            
            <div className="space-y-2">
              {checklist.items.map(item => (
                <div key={item.id} className="flex items-center">
                  <Checkbox
                    id={`item-${item.id}`}
                    checked={item.checked}
                    onCheckedChange={() => handleToggleChecklistItem(checklist.id, item.id)}
                    className="mr-2"
                  />
                  <label 
                    htmlFor={`item-${item.id}`}
                    className={item.checked ? 'line-through text-gray-500' : ''}
                  >
                    {item.text}
                  </label>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 ml-auto"
                    onClick={() => handleRemoveChecklistItem(checklist.id, item.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              
              <div className="flex items-center mt-2">
                <Input
                  placeholder="Novo item..."
                  className="text-sm"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddChecklistItem(checklist.id, e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
              </div>
            </div>
          </div>
        ))}
        
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Título do checklist"
            value={newChecklistTitle}
            onChange={(e) => setNewChecklistTitle(e.target.value)}
          />
          <Button
            onClick={handleAddChecklist}
            size="sm"
            variant="outline"
          >
            <Plus className="h-4 w-4 mr-1" />
            Adicionar
          </Button>
        </div>
      </div>
    </div>
  );
  
  const renderSpreadsheetContent = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-base font-medium">Colunas</h3>
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Nome da coluna"
            className="w-40 text-sm"
            value={newColumn}
            onChange={(e) => setNewColumn(e.target.value)}
          />
          <select
            className="h-9 rounded-md border border-input px-3 py-1 text-sm"
            value={selectedColumnType}
            onChange={(e) => setSelectedColumnType(e.target.value as CellType)}
          >
            <option value="texto">Texto</option>
            <option value="numero">Número</option>
            <option value="moeda">Moeda (R$)</option>
            <option value="data">Data</option>
            <option value="hora">Hora</option>
            <option value="tempo">Tempo/Duração</option>
            <option value="porcentagem">Porcentagem</option>
            <option value="checkbox">Checkbox</option>
            <option value="peso">Peso (kg)</option>
            <option value="personalizado">Personalizado</option>
          </select>
          <Button
            onClick={handleAddColumn}
            size="sm"
            variant="outline"
          >
            <Plus className="h-4 w-4 mr-1" />
            Adicionar
          </Button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {columns.map(column => (
                <th 
                  key={column.id} 
                  className="border p-2 text-left font-medium text-sm bg-gray-100"
                >
                  <div className="flex items-center justify-between">
                    <span>{column.title}</span>
                    <span className="text-gray-500 text-xs">({column.type})</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => handleRemoveColumn(column.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </th>
              ))}
              <th className="border p-2 text-left font-medium text-sm bg-gray-100">
                <Button
                  onClick={handleAddRow}
                  size="sm"
                  variant="outline"
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Nova linha
                </Button>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.id}>
                {columns.map(column => (
                  <td key={`${row.id}-${column.id}`} className="border p-0">
                    <Input
                      value={row.cells[column.id] !== undefined ? String(row.cells[column.id]) : ''}
                      onChange={(e) => handleCellChange(row.id, column.id, e.target.value)}
                      className="border-0 h-8"
                    />
                  </td>
                ))}
                <td className="border p-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => handleRemoveRow(row.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
  
  const getModalTitle = () => {
    if (!modal.type) return '';
    
    if (modal.type === 'planilha') {
      return 'Editar Planilha';
    } else {
      return title || 'Novo Cartão';
    }
  };
  
  return (
    <Dialog 
      open={modal.isOpen} 
      onOpenChange={(open) => {
        if (!open) {
          handleSave();
        }
      }}
    >
      <DialogContent 
        className={`${modal.isMaximized ? 'w-[90vw] h-[90vh] max-w-none' : 'max-w-2xl'}`}
      >
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>{getModalTitle()}</DialogTitle>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={toggleMaximizeModal}
            >
              {modal.isMaximized ? (
                <Minimize className="h-4 w-4" />
              ) : (
                <Maximize className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => {
                if (modal.boardId && modal.itemId) {
                  deleteItem(modal.boardId, modal.itemId);
                }
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={closeModal}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className={`${modal.isMaximized ? 'overflow-y-auto h-[calc(90vh-130px)]' : ''} pt-4`}>
          {modal.type === 'cartao' && renderCardContent()}
          {modal.type === 'planilha' && renderSpreadsheetContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
};
