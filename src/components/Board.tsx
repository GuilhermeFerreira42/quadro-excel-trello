
import { useState, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { SpreadsheetItem } from './SpreadsheetItem';
import { CardItem } from './CardItem';
import { Button } from '@/components/ui/button';
import { Plus, GripVertical, X, MoreVertical } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu';
import { Board as BoardType } from '@/types';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Droppable, Draggable } from 'react-beautiful-dnd';

interface BoardProps {
  board: BoardType;
  index: number;
}

export const Board = ({ board, index }: BoardProps) => {
  const { 
    openItemMenu, 
    deleteBoard, 
    updateBoardTitle,
    moveItem 
  } = useApp();
  
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(board.title);
  const titleInputRef = useRef<HTMLInputElement>(null);
  
  // Sort items by order
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
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    openItemMenu(board.id, { 
      x: rect.left, 
      y: rect.bottom + window.scrollY 
    });
  };
  
  return (
    <div className="flex-shrink-0 w-80 mr-4 bg-white rounded-md shadow-md flex flex-col h-auto">
      <div className="p-3 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center">
          <span className="drag-handle cursor-grab mr-2 text-gray-400">
            <GripVertical className="h-4 w-4" />
          </span>
          
          {isEditing ? (
            <input
              ref={titleInputRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-white p-1 text-sm rounded border border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
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
              className="font-semibold text-gray-800 py-1 cursor-pointer"
              onClick={handleTitleClick}
            >
              {board.title}
            </h3>
          )}
        </div>
        
        <div className="flex items-center">
          <Button
            variant="ghost" 
            size="sm"
            className="h-7 w-7 p-0 mr-1 text-gray-500 hover:bg-gray-100"
            onClick={handleAddClick}
          >
            <Plus className="h-4 w-4" />
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost" 
                size="sm"
                className="h-7 w-7 p-0 text-gray-500 hover:bg-gray-100 hover:text-red-500"
              >
                <X className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir quadro</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir este quadro? Esta ação não poderá ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={() => deleteBoard(board.id)}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      
      <Droppable droppableId={board.id} type="ITEM">
        {(provided) => (
          <div 
            className="flex-1 overflow-y-auto p-2 space-y-2 min-h-[120px] max-h-[calc(100vh-200px)]"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {sortedItems.map((item, index) => (
              <Draggable
                key={item.id}
                draggableId={item.id}
                index={index}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      ...provided.draggableProps.style,
                    }}
                  >
                    {item.type === 'planilha' ? (
                      <SpreadsheetItem
                        boardId={board.id}
                        item={item}
                        spreadsheet={item.content as any}
                      />
                    ) : (
                      <CardItem
                        boardId={board.id}
                        item={item}
                        card={item.content as any}
                      />
                    )}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      
      <div className="p-2 border-t border-gray-100">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-600 hover:bg-gray-100 text-sm"
          onClick={handleAddClick}
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Item
        </Button>
      </div>
    </div>
  );
};
