
import { useRef, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Board } from './Board';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Input } from './ui/input';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

export const BoardContainer = () => {
  const { data, addBoard, moveBoard } = useApp();
  const containerRef = useRef<HTMLDivElement>(null);
  const [newBoardTitle, setNewBoardTitle] = useState("");
  
  // Ordenar os quadros pela ordem
  const sortedBoards = [...data.boards].sort((a, b) => a.order - b.order);
  
  const handleAddBoard = () => {
    if (newBoardTitle.trim()) {
      addBoard(newBoardTitle);
      setNewBoardTitle("");
    } else {
      addBoard(`Novo Quadro ${data.boards.length + 1}`);
    }
    
    // Scroll para o fim após adicionar um novo quadro
    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.scrollLeft = containerRef.current.scrollWidth;
      }
    }, 100);
  };
  
  const handleDragEnd = (result: DropResult) => {
    const { destination, source } = result;
    
    // Se não há destino ou se o item voltou para o mesmo lugar
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }
    
    // Move o quadro para a nova posição
    moveBoard(source.index, destination.index);
  };
  
  return (
    <div 
      ref={containerRef}
      className="flex-1 flex overflow-x-auto overflow-y-auto p-4 board-scroll"
    >
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="boards" direction="horizontal" type="BOARD">
          {(provided) => (
            <div 
              className="flex"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {sortedBoards.map((board, index) => (
                <Draggable 
                  key={board.id} 
                  draggableId={board.id} 
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
                      <Board 
                        board={board}
                        index={index}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      
      <div className="flex-shrink-0 w-72 h-fit ml-2">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              className="h-12 w-full border-dashed border-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100/80 flex items-center justify-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Adicionar Quadro
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Adicionar Novo Quadro</AlertDialogTitle>
              <AlertDialogDescription>
                Digite um nome para o novo quadro ou deixe em branco para usar um nome padrão.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="py-4">
              <Input
                placeholder="Nome do quadro"
                value={newBoardTitle}
                onChange={(e) => setNewBoardTitle(e.target.value)}
                autoFocus
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleAddBoard}>
                Adicionar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};
