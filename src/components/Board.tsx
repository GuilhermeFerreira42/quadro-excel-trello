
import { useState, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { SpreadsheetItem } from './SpreadsheetItem';
import { CardItem } from './CardItem';
import { Button } from '@/components/ui/button';
import { Plus, GripVertical, X } from 'lucide-react';
import { Board as BoardType } from '@/types';

interface BoardProps {
  board: BoardType;
  index: number;
}

export const Board = ({ board, index }: BoardProps) => {
  const { 
    openItemMenu, 
    deleteBoard, 
    updateBoardTitle 
  } = useApp();
  
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(board.title);
  const titleInputRef = useRef<HTMLInputElement>(null);
  
  // Ordenar os itens pela ordem
  const sortedItems = [...board.items].sort((a, b) => a.order - b.order);
  
  const handleTitleClick = () => {
    setIsEditing(true);
    setTimeout(() => {
      titleInputRef.current?.focus();
      titleInputRef.current?.select();
    }, 10);
  };
  
  const handleTitleSave = () => {
    if (title.trim()) {
      updateBoardTitle(board.id, title);
    } else {
      setTitle(board.title);
    }
    setIsEditing(false);
  };
  
  const handleAddClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    openItemMenu(board.id, { 
      x: rect.left, 
      y: rect.bottom + window.scrollY 
    });
  };
  
  return (
    <div className="flex-shrink-0 w-72 mr-4 bg-trello-board rounded-md shadow flex flex-col max-h-full">
      <div className="p-2 flex items-center justify-between">
        <div className="flex items-center">
          <span className="drag-handle cursor-grab mr-2">
            <GripVertical className="h-4 w-4 text-gray-500" />
          </span>
          
          {isEditing ? (
            <input
              ref={titleInputRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-white p-1 text-sm rounded border border-trello-blue focus:outline-none w-full"
              onBlur={handleTitleSave}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleTitleSave();
                if (e.key === 'Escape') {
                  setTitle(board.title);
                  setIsEditing(false);
                }
              }}
            />
          ) : (
            <h3 
              className="font-semibold text-sm py-1 cursor-pointer"
              onClick={handleTitleClick}
            >
              {board.title}
            </h3>
          )}
        </div>
        
        <Button
          variant="ghost" 
          size="sm"
          className="h-6 w-6 p-0 text-gray-500 hover:text-red-500"
          onClick={() => deleteBoard(board.id)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-2 min-h-[100px]">
        {sortedItems.map((item) => (
          item.type === 'planilha' ? (
            <SpreadsheetItem
              key={item.id}
              boardId={board.id}
              item={item}
              spreadsheet={item.content as any}
            />
          ) : (
            <CardItem
              key={item.id}
              boardId={board.id}
              item={item}
              card={item.content as any}
            />
          )
        ))}
      </div>
      
      <div className="p-2 border-t border-gray-200">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-600 hover:bg-gray-200"
          onClick={handleAddClick}
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar
        </Button>
      </div>
    </div>
  );
};
