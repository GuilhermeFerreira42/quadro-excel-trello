
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
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    openItemMenu(board.id, { 
      x: rect.left, 
      y: rect.bottom + window.scrollY 
    });
  };
  
  return (
    <div className="flex-shrink-0 w-72 mr-4 bg-trello-board rounded-md shadow flex flex-col h-auto min-h-[120px]">
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
        
        <div className="flex items-center">
          <Button
            variant="ghost" 
            size="sm"
            className="h-6 w-6 p-0 mr-1"
            onClick={handleAddClick}
          >
            <Plus className="h-4 w-4 text-gray-600" />
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost" 
                size="sm"
                className="h-6 w-6 p-0 text-gray-500 hover:text-red-500"
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
            className="flex-1 overflow-y-auto p-2 space-y-2 min-h-[100px]"
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
