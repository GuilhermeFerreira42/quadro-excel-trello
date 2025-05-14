
import { useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { Board } from './Board';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export const BoardContainer = () => {
  const { data, addBoard } = useApp();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Ordenar os quadros pela ordem
  const sortedBoards = [...data.boards].sort((a, b) => a.order - b.order);
  
  const handleAddBoard = () => {
    addBoard(`Novo Quadro ${data.boards.length + 1}`);
    
    // Scroll para o fim após adicionar um novo quadro
    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.scrollLeft = containerRef.current.scrollWidth;
      }
    }, 100);
  };
  
  return (
    <div 
      ref={containerRef}
      className="flex-1 flex overflow-x-auto overflow-y-hidden p-4 board-scroll"
    >
      {sortedBoards.map((board, index) => (
        <Board 
          key={board.id}
          board={board}
          index={index}
        />
      ))}
      
      <div className="flex-shrink-0 w-72 h-fit">
        <Button
          onClick={handleAddBoard}
          variant="outline"
          className="h-12 w-full border-dashed border-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100/80 flex items-center justify-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Adicionar Quadro
        </Button>
      </div>
    </div>
  );
};
