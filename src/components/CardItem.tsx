
import { useApp } from '@/context/AppContext';
import { BoardItem, Card } from '@/types';
import { MoreVertical } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu';

interface CardItemProps {
  boardId: string;
  item: BoardItem;
  card: Card;
}

export const CardItem = ({ boardId, item, card }: CardItemProps) => {
  const { openModal, deleteItem } = useApp();
  
  // Calcular progresso do checklist
  const totalItems = card.checklists.reduce(
    (acc, checklist) => acc + checklist.items.length, 
    0
  );
  
  const completedItems = card.checklists.reduce(
    (acc, checklist) => 
      acc + checklist.items.filter(item => item.checked).length, 
    0
  );
  
  const hasChecklist = totalItems > 0;
  const progress = totalItems > 0 
    ? Math.round((completedItems / totalItems) * 100) 
    : 0;
  
  return (
    <div 
      className="bg-white rounded shadow cursor-pointer hover:shadow-md relative group"
      onClick={() => openModal(boardId, item.id, 'cartao')}
    >
      <div className="p-3">
        <div className="flex justify-between items-start">
          <h4 className="font-medium text-sm mb-2">{card.title}</h4>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button 
                className="h-6 w-6 p-0 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 opacity-0 group-hover:opacity-100"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation();
                  openModal(boardId, item.id, 'cartao');
                }}
              >
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-red-500"
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm("Tem certeza que deseja excluir este item? Esta ação não poderá ser desfeita.")) {
                    deleteItem(boardId, item.id);
                  }
                }}
              >
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {card.description && (
          <p className="text-xs text-gray-600 mb-2 line-clamp-3">{card.description}</p>
        )}
        
        {hasChecklist && (
          <div className="mt-2">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>{completedItems}/{totalItems}</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-blue-500 h-1.5 rounded-full" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
