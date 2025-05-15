
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';

export type ItemType = 'card' | 'sheet';

export interface Column {
  id: string;
  name: string;
  type: string;
}

export interface Board {
  id: string;
  name: string;
  order: number;
  blocks: Block[];
}

export interface Block {
  id: string;
  name: string;
  order: number;
  items: Item[];
}

export interface Item {
  id: string;
  type: ItemType;
  name: string;
  order: number;
  archived?: boolean;
  content?: any;
}

export interface CardContent {
  description?: string;
  checklist?: Array<{
    id: string;
    text: string;
    checked: boolean;
  }>;
}

export interface SheetContent {
  columns: Column[];
  rows: any[][];
}

interface AppData {
  boards: Board[];
  expandSheetBlock: boolean;
}

export interface AppContextType {
  data: AppData;
  addBoard: (name: string) => void;
  deleteBoard: (id: string) => void;
  renameBoard: (id: string, name: string) => void;
  addBlock: (boardId: string, name: string) => void;
  deleteBlock: (boardId: string, blockId: string) => void;
  renameBlock: (boardId: string, blockId: string, name: string) => void;
  addItem: (boardId: string, blockId: string, type: ItemType, name: string) => void;
  deleteItem: (boardId: string, blockId: string, itemId: string) => void;
  renameItem: (boardId: string, blockId: string, itemId: string, name: string) => void;
  moveBoard: (sourceIndex: number, destinationIndex: number) => void;
  toggleExpandSheetBlock: () => void;
}

const initialData: AppData = {
  boards: [
    {
      id: '1',
      name: 'Meu Quadro',
      order: 0,
      blocks: [
        {
          id: '1',
          name: 'Para Fazer',
          order: 0,
          items: [
            {
              id: '1',
              type: 'card',
              name: 'Desenvolver UI',
              order: 0,
              content: {
                description: 'Criar componentes UI para o projeto',
                checklist: [
                  { id: '1', text: 'Design System', checked: false },
                  { id: '2', text: 'Componentes Base', checked: true },
                ]
              }
            },
            {
              id: '2',
              type: 'sheet',
              name: 'Cronograma',
              order: 1,
              content: {
                columns: [
                  { id: '1', name: 'Tarefa', type: 'text' },
                  { id: '2', name: 'Data', type: 'date' },
                  { id: '3', name: 'Concluído', type: 'boolean' }
                ],
                rows: [
                  ['Pesquisa', '2023-10-20', false],
                  ['Protótipo', '2023-11-05', true],
                  ['Testes', '2023-11-15', false]
                ]
              }
            }
          ]
        }
      ]
    }
  ],
  expandSheetBlock: false
};

export const AppContext = createContext<AppContextType>({} as AppContextType);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<AppData>(initialData);

  const addBoard = (name: string) => {
    const newBoard: Board = {
      id: uuidv4(),
      name,
      order: data.boards.length,
      blocks: []
    };
    setData(prev => ({
      ...prev,
      boards: [...prev.boards, newBoard]
    }));
  };

  const deleteBoard = (id: string) => {
    setData(prev => ({
      ...prev,
      boards: prev.boards.filter(board => board.id !== id)
    }));
  };

  const renameBoard = (id: string, name: string) => {
    setData(prev => ({
      ...prev,
      boards: prev.boards.map(board => 
        board.id === id ? { ...board, name } : board
      )
    }));
  };

  const addBlock = (boardId: string, name: string) => {
    setData(prev => ({
      ...prev,
      boards: prev.boards.map(board => {
        if (board.id === boardId) {
          const newBlock: Block = {
            id: uuidv4(),
            name,
            order: board.blocks.length,
            items: []
          };
          return {
            ...board,
            blocks: [...board.blocks, newBlock]
          };
        }
        return board;
      })
    }));
  };

  const deleteBlock = (boardId: string, blockId: string) => {
    setData(prev => ({
      ...prev,
      boards: prev.boards.map(board => {
        if (board.id === boardId) {
          return {
            ...board,
            blocks: board.blocks.filter(block => block.id !== blockId)
          };
        }
        return board;
      })
    }));
  };

  const renameBlock = (boardId: string, blockId: string, name: string) => {
    setData(prev => ({
      ...prev,
      boards: prev.boards.map(board => {
        if (board.id === boardId) {
          return {
            ...board,
            blocks: board.blocks.map(block => 
              block.id === blockId ? { ...block, name } : block
            )
          };
        }
        return board;
      })
    }));
  };

  const addItem = (boardId: string, blockId: string, type: ItemType, name: string) => {
    setData(prev => ({
      ...prev,
      boards: prev.boards.map(board => {
        if (board.id === boardId) {
          return {
            ...board,
            blocks: board.blocks.map(block => {
              if (block.id === blockId) {
                const newItem: Item = {
                  id: uuidv4(),
                  type,
                  name,
                  order: block.items.length,
                  content: type === 'sheet' ? {
                    columns: [
                      { id: uuidv4(), name: 'Coluna 1', type: 'text' },
                      { id: uuidv4(), name: 'Coluna 2', type: 'text' }
                    ],
                    rows: [
                      ['', ''],
                      ['', '']
                    ]
                  } : {
                    description: '',
                    checklist: []
                  }
                };
                return {
                  ...block,
                  items: [...block.items, newItem]
                };
              }
              return block;
            })
          };
        }
        return board;
      })
    }));
  };

  const deleteItem = (boardId: string, blockId: string, itemId: string) => {
    setData(prev => ({
      ...prev,
      boards: prev.boards.map(board => {
        if (board.id === boardId) {
          return {
            ...board,
            blocks: board.blocks.map(block => {
              if (block.id === blockId) {
                return {
                  ...block,
                  items: block.items.filter(item => item.id !== itemId)
                };
              }
              return block;
            })
          };
        }
        return board;
      })
    }));
  };

  const renameItem = (boardId: string, blockId: string, itemId: string, name: string) => {
    setData(prev => ({
      ...prev,
      boards: prev.boards.map(board => {
        if (board.id === boardId) {
          return {
            ...board,
            blocks: board.blocks.map(block => {
              if (block.id === blockId) {
                return {
                  ...block,
                  items: block.items.map(item => 
                    item.id === itemId ? { ...item, name } : item
                  )
                };
              }
              return block;
            })
          };
        }
        return board;
      })
    }));
  };

  const moveBoard = (sourceIndex: number, destinationIndex: number) => {
    const sortedBoards = [...data.boards].sort((a, b) => a.order - b.order);
    const [removed] = sortedBoards.splice(sourceIndex, 1);
    sortedBoards.splice(destinationIndex, 0, removed);
    
    const updatedBoards = sortedBoards.map((board, index) => ({
      ...board,
      order: index
    }));
    
    setData(prev => ({
      ...prev,
      boards: updatedBoards
    }));
  };

  const toggleExpandSheetBlock = () => {
    setData(prev => ({
      ...prev,
      expandSheetBlock: !prev.expandSheetBlock
    }));
  };

  return (
    <AppContext.Provider value={{ 
      data, 
      addBoard, 
      deleteBoard,
      renameBoard,
      addBlock, 
      deleteBlock,
      renameBlock,
      addItem, 
      deleteItem,
      renameItem,
      moveBoard,
      toggleExpandSheetBlock
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
