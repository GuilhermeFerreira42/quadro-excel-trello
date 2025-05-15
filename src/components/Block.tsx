
import { useState, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { Card } from './Card';
import { Sheet } from './Sheet';
import { Item, ItemType } from '@/context/AppContext';
import { Button } from './ui/button';
import { Plus, MoreHorizontal } from 'lucide-react';
import { AddItemMenu } from './AddItemMenu';
import { BlockMenu } from './BlockMenu';

interface BlockProps {
  boardId: string;
  block: {
    id: string;
    name: string;
    items: Item[];
  };
}

export const Block = ({ boardId, block }: BlockProps) => {
  const { data, addItem } = useApp();
  const [isAddItemMenuOpen, setIsAddItemMenuOpen] = useState(false);
  const [isBlockMenuOpen, setIsBlockMenuOpen] = useState(false);
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const blockRef = useRef<HTMLDivElement>(null);
  
  const handleAddItem = (type: ItemType) => {
    const itemName = type === 'card' ? 'Novo Cartão' : 'Nova Planilha';
    addItem(boardId, block.id, type, itemName);
    setIsAddItemMenuOpen(false);
  };

  const closeMenus = () => {
    setIsAddItemMenuOpen(false);
    setIsBlockMenuOpen(false);
  };

  // Calcular se há planilhas no bloco que podem ser expandidas
  const hasExpandableSheets = block.items.some(item => item.type === 'sheet');

  return (
    <div 
      ref={blockRef}
      className={`
        block-container rounded-md shadow-md p-3 flex flex-col
        ${data.expandSheetBlock && hasExpandableSheets ? 'max-w-none w-auto' : 'max-w-[280px] w-[280px]'}
        ${data.expandSheetBlock && hasExpandableSheets ? 'overflow-visible' : 'overflow-hidden'}
      `}
    >
      <div className="flex items-center justify-between mb-2 board-header px-2 py-1 rounded">
        <h3 className="font-semibold text-white text-sm">{block.name}</h3>
        <div className="flex space-x-1">
          <Button
            ref={addButtonRef}
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-gray-400 hover:text-white"
            onClick={() => {
              setIsBlockMenuOpen(false);
              setIsAddItemMenuOpen(prev => !prev);
            }}
          >
            <Plus size={16} />
          </Button>
          <Button
            ref={menuButtonRef}
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-gray-400 hover:text-white"
            onClick={() => {
              setIsAddItemMenuOpen(false);
              setIsBlockMenuOpen(prev => !prev);
            }}
          >
            <MoreHorizontal size={16} />
          </Button>
        </div>
      </div>

      {/* Container dos itens - ajusta a altura máxima com base na configuração expandSheetBlock */}
      <div 
        className={`
          space-y-2 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-700
          ${data.expandSheetBlock && hasExpandableSheets ? 'max-h-none' : 'max-h-[calc(100vh-160px)]'}
        `}
      >
        {block.items.map(item => (
          <div key={item.id} className="w-full">
            {item.type === 'card' ? (
              <Card 
                boardId={boardId}
                blockId={block.id}
                item={item}
              />
            ) : (
              <Sheet 
                boardId={boardId}
                blockId={block.id}
                item={item}
                expandSheetBlock={data.expandSheetBlock}
              />
            )}
          </div>
        ))}
      </div>

      {isAddItemMenuOpen && (
        <AddItemMenu 
          anchor={addButtonRef}
          onAddCard={() => handleAddItem('card')}
          onAddSheet={() => handleAddItem('sheet')}
          onClickOutside={closeMenus}
        />
      )}

      {isBlockMenuOpen && (
        <BlockMenu
          anchor={menuButtonRef}
          boardId={boardId}
          blockId={block.id}
          blockName={block.name}
          onClickOutside={closeMenus}
        />
      )}
    </div>
  );
};
