
import { useState } from 'react';
import { useApp } from "@/context/AppContext";
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Settings, ChevronLeft, ChevronRight, Plus, MoreHorizontal, Pencil, Archive, Trash } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

export function Sidebar() {
  const { data, addBoard, deleteBoard, renameBoard, toggleExpandSheetBlock } = useApp();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [activeBoard, setActiveBoard] = useState<string | null>(data.boards[0]?.id || null);
  const [editingBoardId, setEditingBoardId] = useState<string | null>(null);
  const [editingBoardName, setEditingBoardName] = useState<string>('');

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleBoardSelect = (boardId: string) => {
    setActiveBoard(boardId);
  };

  const handleAddBoard = () => {
    if (newBoardName.trim()) {
      addBoard(newBoardName.trim());
      setNewBoardName('');
    }
  };

  const handleStartRenaming = (board: { id: string, name: string }) => {
    setEditingBoardId(board.id);
    setEditingBoardName(board.name);
  };

  const handleFinishRenaming = () => {
    if (editingBoardId && editingBoardName.trim()) {
      renameBoard(editingBoardId, editingBoardName.trim());
    }
    setEditingBoardId(null);
  };

  return (
    <div className="relative">
      <div className={`h-screen py-4 bg-gray-900 transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0' : 'w-64'} overflow-hidden`}>
        <div className="px-4 mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Meu Workspace</h2>
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="text-gray-400 hover:text-white">
            <ChevronLeft size={20} />
          </Button>
        </div>
        
        <div className="px-4 mb-4">
          <div className="flex items-center mb-2">
            <span className="text-sm font-medium text-gray-400">Quadros</span>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="ml-auto text-gray-400 hover:text-white p-1">
                  <Plus size={16} />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Adicionar Novo Quadro</AlertDialogTitle>
                  <AlertDialogDescription>
                    Digite um nome para o novo quadro.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="py-4">
                  <Input 
                    value={newBoardName}
                    onChange={(e) => setNewBoardName(e.target.value)}
                    placeholder="Nome do quadro"
                    autoFocus
                  />
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleAddBoard}>Adicionar</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          
          <div className="space-y-1">
            {data.boards.map((board) => (
              <div 
                key={board.id} 
                className={`rounded px-2 py-1.5 flex items-center justify-between ${
                  activeBoard === board.id ? 'bg-blue-600/40 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
                } cursor-pointer`}
                onClick={() => handleBoardSelect(board.id)}
              >
                {editingBoardId === board.id ? (
                  <Input
                    value={editingBoardName}
                    onChange={(e) => setEditingBoardName(e.target.value)}
                    className="h-6 py-0 px-1 text-xs bg-gray-700 border-none text-white"
                    onBlur={handleFinishRenaming}
                    onKeyDown={(e) => e.key === 'Enter' && handleFinishRenaming()}
                    autoFocus
                  />
                ) : (
                  <span className="text-sm truncate">{board.name}</span>
                )}
                
                {activeBoard === board.id && editingBoardId !== board.id && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6 p-0 text-gray-400 hover:text-white">
                        <MoreHorizontal size={16} />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-40 p-0 bg-gray-900 border-gray-700">
                      <div className="py-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartRenaming(board);
                          }}
                          className="w-full px-3 py-1.5 text-left text-xs text-gray-300 hover:bg-gray-800 flex items-center"
                        >
                          <Pencil size={14} className="mr-2" /> Renomear
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // TODO: Archive board
                          }}
                          className="w-full px-3 py-1.5 text-left text-xs text-gray-300 hover:bg-gray-800 flex items-center"
                        >
                          <Archive size={14} className="mr-2" /> Arquivar
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm('Tem certeza que deseja excluir este quadro?')) {
                              deleteBoard(board.id);
                              if (activeBoard === board.id) {
                                setActiveBoard(data.boards[0]?.id || null);
                              }
                            }
                          }}
                          className="w-full px-3 py-1.5 text-left text-xs text-red-500 hover:bg-gray-800 flex items-center"
                        >
                          <Trash size={14} className="mr-2" /> Excluir
                        </button>
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="px-4">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Configurações</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-300 cursor-pointer flex-1" htmlFor="expand-sheet-block">
                Expandir bloco conforme o tamanho da planilha
              </label>
              <input
                id="expand-sheet-block"
                type="checkbox"
                checked={data.expandSheetBlock}
                onChange={toggleExpandSheetBlock}
                className="h-4 w-4 rounded text-blue-500 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
      
      {isCollapsed && (
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="absolute top-4 left-3 text-white bg-gray-900 rounded-full p-1.5 shadow-md hover:bg-gray-800"
        >
          <ChevronRight size={20} />
        </Button>
      )}
    </div>
  );
}
