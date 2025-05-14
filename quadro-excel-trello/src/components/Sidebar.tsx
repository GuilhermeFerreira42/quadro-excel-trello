
import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Edit, MoreHorizontal, ChevronLeft, ChevronRight, User, Trash2, Archive, PenLine } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Sidebar = () => {
  const { data, addBoard, renameBoard, deleteBoard } = useApp();
  const [collapsed, setCollapsed] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  
  const handleCreateBoard = () => {
    if (newBoardName.trim()) {
      addBoard(newBoardName);
      setNewBoardName('');
      setIsAdding(false);
    }
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };
  
  const startAddingBoard = () => {
    setIsAdding(true);
  };
  
  const cancelAdding = () => {
    setIsAdding(false);
    setNewBoardName('');
  };
  
  return (
    <div className={`bg-[#031b30] text-white transition-all duration-300 flex flex-col ${collapsed ? 'w-16' : 'w-64'}`}>
      {/* Header part */}
      <div className="p-3 flex items-center justify-between border-b border-white/10">
        {!collapsed && <h1 className="text-lg font-semibold">Calendário</h1>}
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-white hover:bg-white/10 ml-auto"
          onClick={toggleSidebar}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>
      
      {/* User info */}
      <div className="p-3 flex items-center border-b border-white/10">
        <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
          <User size={16} />
        </div>
        {!collapsed && <span className="ml-2 text-sm">Usuário</span>}
      </div>
      
      {/* Boards list */}
      <div className="flex-1 overflow-y-auto">
        <div className={`p-3 ${collapsed ? '' : 'pb-1'}`}>
          {!collapsed && <h2 className="text-sm font-medium mb-2">Seus quadros</h2>}
          <div className="space-y-1">
            {data.boards.map(board => (
              <div key={board.id} className="flex items-center group justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-left justify-start text-white hover:bg-white/10"
                >
                  {collapsed ? (
                    <div className="h-6 w-6 rounded bg-white/20 flex items-center justify-center text-xs">
                      {board.title.charAt(0)}
                    </div>
                  ) : (
                    <span className="truncate">{board.title}</span>
                  )}
                </Button>
                
                {!collapsed && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 text-white hover:bg-white/10"
                      >
                        <MoreHorizontal size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuItem onClick={() => renameBoard(board.id, board.title)}>
                        <PenLine className="mr-2 h-4 w-4" />
                        <span>Renomear</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => deleteBoard(board.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Excluir</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Archive className="mr-2 h-4 w-4" />
                        <span>Arquivar</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Add board button */}
      <div className="p-3 border-t border-white/10">
        {isAdding && !collapsed ? (
          <div className="space-y-2">
            <Input
              value={newBoardName}
              onChange={(e) => setNewBoardName(e.target.value)}
              placeholder="Nome do quadro"
              className="bg-white/10 border-white/10 text-white"
              autoFocus
            />
            <div className="flex gap-2">
              <Button 
                onClick={handleCreateBoard} 
                size="sm" 
                className="bg-green-500 hover:bg-green-600"
              >
                Criar
              </Button>
              <Button 
                onClick={cancelAdding} 
                size="sm" 
                variant="ghost"
                className="hover:bg-white/10"
              >
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={startAddingBoard}
            className="w-full text-left justify-start text-white hover:bg-white/10"
          >
            <Plus size={16} className="mr-2" />
            {!collapsed && "Adicionar Quadro"}
          </Button>
        )}
      </div>
    </div>
  );
};
