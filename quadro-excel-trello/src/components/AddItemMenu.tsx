
import { useEffect, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Table, FileText } from 'lucide-react';

export const AddItemMenu = () => {
  const { itemMenu, addSpreadsheet, addCard, closeItemMenu } = useApp();
  const menuRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeItemMenu();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closeItemMenu]);
  
  if (!itemMenu.isOpen || !itemMenu.boardId || !itemMenu.position) return null;
  
  const { boardId } = itemMenu;
  const { x, y } = itemMenu.position;
  
  const handleAddSpreadsheet = () => {
    addSpreadsheet(boardId);
    closeItemMenu();
  };
  
  const handleAddCard = () => {
    addCard(boardId);
    closeItemMenu();
  };
  
  return (
    <div 
      ref={menuRef}
      className="absolute bg-white shadow-lg rounded-md z-50 w-64 p-2"
      style={{ top: y, left: x }}
    >
      <h3 className="text-sm font-medium mb-2 px-2">Adicionar ao quadro</h3>
      
      <div className="space-y-1">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-left" 
          onClick={handleAddSpreadsheet}
        >
          <Table className="h-4 w-4 mr-2" />
          <span>Planilha</span>
        </Button>
        
        <Button 
          variant="ghost" 
          className="w-full justify-start text-left" 
          onClick={handleAddCard}
        >
          <FileText className="h-4 w-4 mr-2" />
          <span>Cartão</span>
        </Button>
      </div>
    </div>
  );
};
