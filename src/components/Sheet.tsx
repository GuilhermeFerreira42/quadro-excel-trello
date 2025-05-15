
import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Item } from '@/context/AppContext';
import { Button } from './ui/button';
import { MoreHorizontal, Pencil, Trash, Maximize, Minimize } from 'lucide-react';
import { EditSheetModal } from './EditSheetModal';
import { SheetMenu } from './SheetMenu';

interface SheetProps {
  boardId: string;
  blockId: string;
  item: Item;
  expandSheetBlock: boolean;
}

export const Sheet = ({ boardId, blockId, item, expandSheetBlock }: SheetProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const tableContainerRef = useRef<HTMLDivElement>(null);
  
  const sheetContent = item.content as { columns: Array<{id: string, name: string, type: string}>, rows: any[][] };
  
  useEffect(() => {
    if (sheetRef.current && tableContainerRef.current) {
      // Se expandSheetBlock for true, não define nenhuma largura/altura máxima no contêiner da tabela
      if (expandSheetBlock) {
        tableContainerRef.current.style.maxWidth = 'none';
        tableContainerRef.current.style.maxHeight = 'none';
        tableContainerRef.current.style.overflow = 'visible';
      } else {
        // Se expandSheetBlock for false, restringe o tamanho
        tableContainerRef.current.style.maxWidth = '100%';
        tableContainerRef.current.style.maxHeight = '200px';
        tableContainerRef.current.style.overflow = 'auto';
      }
    }
  }, [expandSheetBlock, sheetContent]);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleOpenEditModal = () => {
    setIsEditModalOpen(true);
    closeMenu();
  };

  const getItemValueDisplay = (value: any, type: string) => {
    if (value === undefined || value === null || value === '') return '';
    
    if (type === 'boolean') {
      return value ? '✓' : '✗';
    }
    
    if (type === 'date' && typeof value === 'string') {
      try {
        const date = new Date(value);
        return date.toLocaleDateString();
      } catch {
        return value;
      }
    }
    
    return String(value);
  };

  return (
    <div 
      ref={sheetRef} 
      className={`sheet-container rounded p-2 ${expandSheetBlock ? 'w-auto' : 'w-full'}`}
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium text-sm text-white truncate">{item.name}</h4>
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 p-0.5 text-gray-400 hover:text-white"
            onClick={handleOpenEditModal}
          >
            <Pencil size={14} />
          </Button>
          <Button
            ref={menuButtonRef}
            variant="ghost"
            size="icon"
            className="h-6 w-6 p-0.5 text-gray-400 hover:text-white"
            onClick={() => setIsMenuOpen(prev => !prev)}
          >
            <MoreHorizontal size={14} />
          </Button>
        </div>
      </div>

      <div 
        ref={tableContainerRef} 
        className={`
          ${expandSheetBlock ? 'overflow-visible' : 'overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-700'} 
          rounded
        `}
      >
        <table className="min-w-full border-collapse text-xs sheet-table">
          <thead>
            <tr>
              {sheetContent.columns.map((col) => (
                <th key={col.id} className="px-2 py-1 text-left font-medium text-white border border-gray-700">
                  {col.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sheetContent.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => {
                  const columnType = sheetContent.columns[cellIndex]?.type || 'text';
                  return (
                    <td 
                      key={`${rowIndex}-${cellIndex}`} 
                      className={`px-2 py-1 border border-gray-700 text-gray-200 ${
                        columnType === 'boolean' ? 'text-center' : ''
                      }`}
                    >
                      {getItemValueDisplay(cell, columnType)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isMenuOpen && (
        <SheetMenu
          anchor={menuButtonRef}
          boardId={boardId}
          blockId={blockId}
          itemId={item.id}
          onOpenEdit={handleOpenEditModal}
          onClickOutside={closeMenu}
        />
      )}

      {isEditModalOpen && (
        <EditSheetModal
          boardId={boardId}
          blockId={blockId}
          item={item}
          onClose={() => setIsEditModalOpen(false)}
          initialIsMaximized={isMaximized}
          onToggleMaximize={(maximized) => setIsMaximized(maximized)}
        />
      )}
    </div>
  );
};
