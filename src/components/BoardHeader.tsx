
import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Plus, User } from 'lucide-react';
import { UserMenu } from './UserMenu';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const BoardHeader = () => {
  const { addBoard } = useApp();
  const [isAddingBoard, setIsAddingBoard] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleAddBoard = () => {
    if (newBoardTitle.trim()) {
      addBoard(newBoardTitle);
      setNewBoardTitle('');
      setIsAddingBoard(false);
    }
  };

  return (
    <header className="bg-trello-darkBlue text-white p-3 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold">Calendário</h1>
        
        {isAddingBoard ? (
          <div className="flex items-center">
            <input
              type="text"
              value={newBoardTitle}
              onChange={(e) => setNewBoardTitle(e.target.value)}
              className="bg-white/20 text-white placeholder-white/50 rounded py-1 px-2 mr-2 focus:outline-none"
              placeholder="Nome do quadro..."
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddBoard();
                if (e.key === 'Escape') setIsAddingBoard(false);
              }}
            />
            <Button 
              size="sm" 
              variant="secondary" 
              onClick={handleAddBoard}
              className="text-xs"
            >
              Adicionar
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => setIsAddingBoard(false)}
              className="text-xs ml-1"
            >
              Cancelar
            </Button>
          </div>
        ) : (
          <Button 
            onClick={() => setIsAddingBoard(true)} 
            variant="secondary" 
            size="sm"
            className="bg-white/20 hover:bg-white/30 text-white"
          >
            <Plus className="h-4 w-4 mr-1" />
            Adicionar Quadro
          </Button>
        )}
      </div>
      
      <DropdownMenu open={isUserMenuOpen} onOpenChange={setIsUserMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            size="sm" 
            variant="ghost" 
            className="rounded-full h-8 w-8 p-0 bg-white/20 hover:bg-white/30"
          >
            <User className="h-5 w-5 text-white" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <UserMenu />
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};
