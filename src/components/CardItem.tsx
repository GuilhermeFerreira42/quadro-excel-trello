
import { useApp } from '@/context/AppContext';
import { BoardItem, Card, ChecklistItem } from '@/types';

interface CardItemProps {
  boardId: string;
  item: BoardItem;
  card: Card;
}

export const CardItem = ({ boardId, item, card }: CardItemProps) => {
  const { openModal } = useApp();
  
  // Calcula o progresso dos checklists
  const calculateProgress = () => {
    if (card.checklists.length === 0) return 0;
    
    let totalItems = 0;
    let completedItems = 0;
    
    card.checklists.forEach(checklist => {
      totalItems += checklist.items.length;
      completedItems += checklist.items.filter(item => item.checked).length;
    });
    
    return totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
  };
  
  const progress = calculateProgress();
  
  // Conta o total de itens de checklist
  const totalItems = card.checklists.reduce(
    (acc, list) => acc + list.items.length, 0
  );
  
  // Conta os itens concluídos
  const completedItems = card.checklists.reduce(
    (acc, list) => acc + list.items.filter(item => item.checked).length, 0
  );
  
  // Limita a descrição para exibição
  const shortDescription = card.description.length > 100 
    ? card.description.substring(0, 100) + '...' 
    : card.description;
  
  return (
    <div 
      className="bg-white rounded shadow p-3 cursor-pointer hover:shadow-md"
      onClick={() => openModal(boardId, item.id, 'cartao')}
    >
      <h3 className="font-medium mb-2">{card.title}</h3>
      
      {card.description && (
        <p className="text-sm text-gray-600 mb-2">{shortDescription}</p>
      )}
      
      {totalItems > 0 && (
        <div className="mt-2">
          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
            <span>Checklist</span>
            <span>{completedItems} de {totalItems}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className="bg-trello-green h-1.5 rounded-full" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
