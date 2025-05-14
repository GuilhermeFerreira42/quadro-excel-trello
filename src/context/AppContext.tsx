
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  AppData, 
  Board, 
  BoardItem, 
  Card, 
  Checklist, 
  ModalData, 
  ItemMenuData, 
  Spreadsheet,
  Column,
  Row,
  CellValue,
  ItemType,
  ChecklistItem,
  UserSettings
} from '@/types';
import { getInitialData, loadData, saveData } from '@/utils/localStorage';
import { toast } from 'sonner';

interface AppContextType {
  data: AppData;
  modal: ModalData;
  itemMenu: ItemMenuData;
  addBoard: (title: string) => void;
  updateBoardTitle: (boardId: string, title: string) => void;
  moveBoard: (oldIndex: number, newIndex: number) => void;
  deleteBoard: (boardId: string) => void;
  addSpreadsheet: (boardId: string) => void;
  addCard: (boardId: string) => void;
  updateSpreadsheet: (boardId: string, itemId: string, spreadsheet: Spreadsheet) => void;
  updateCard: (boardId: string, itemId: string, card: Card) => void;
  deleteItem: (boardId: string, itemId: string) => void;
  moveItem: (boardId: string, oldIndex: number, newIndex: number) => void;
  moveItemBetweenBoards: (sourceBoardId: string, targetBoardId: string, itemId: string) => void;
  openModal: (boardId: string, itemId: string, type: ItemType) => void;
  closeModal: () => void;
  toggleMaximizeModal: () => void;
  openItemMenu: (boardId: string, position: { x: number; y: number }) => void;
  closeItemMenu: () => void;
  updateSettings: (settings: UserSettings) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<AppData>(getInitialData());
  const [modal, setModal] = useState<ModalData>({
    isOpen: false,
    itemId: null,
    boardId: null,
    type: null,
    isMaximized: false,
  });
  const [itemMenu, setItemMenu] = useState<ItemMenuData>({
    isOpen: false,
    boardId: null,
    position: null,
  });

  useEffect(() => {
    const savedData = loadData();
    if (savedData) {
      setData(savedData);
    }
  }, []);

  useEffect(() => {
    saveData(data);
  }, [data]);

  // Funções de manipulação de quadros
  const addBoard = (title: string) => {
    const newBoard: Board = {
      id: crypto.randomUUID(),
      title,
      items: [],
      order: data.boards.length,
    };

    setData(prev => ({
      ...prev,
      boards: [...prev.boards, newBoard]
    }));
    
    toast.success("Quadro adicionado com sucesso");
  };

  const updateBoardTitle = (boardId: string, title: string) => {
    setData(prev => ({
      ...prev,
      boards: prev.boards.map(board => 
        board.id === boardId ? { ...board, title } : board
      )
    }));
  };

  const moveBoard = (oldIndex: number, newIndex: number) => {
    const newBoards = [...data.boards];
    const [movedBoard] = newBoards.splice(oldIndex, 1);
    newBoards.splice(newIndex, 0, movedBoard);
    
    // Atualiza a ordem
    const updatedBoards = newBoards.map((board, index) => ({
      ...board,
      order: index
    }));

    setData(prev => ({
      ...prev,
      boards: updatedBoards
    }));
  };

  const deleteBoard = (boardId: string) => {
    setData(prev => ({
      ...prev,
      boards: prev.boards.filter(board => board.id !== boardId)
    }));
    
    toast.success("Quadro removido com sucesso");
  };

  // Funções de manipulação de itens
  const createDefaultSpreadsheet = (): Spreadsheet => {
    return {
      id: crypto.randomUUID(),
      columns: [
        { id: crypto.randomUUID(), title: 'Coluna 1', type: 'texto' },
        { id: crypto.randomUUID(), title: 'Coluna 2', type: 'texto' },
      ],
      rows: [
        { 
          id: crypto.randomUUID(), 
          cells: {} 
        }
      ]
    };
  };

  const createDefaultCard = (): Card => {
    return {
      id: crypto.randomUUID(),
      title: 'Novo Cartão',
      description: '',
      checklists: []
    };
  };

  const addSpreadsheet = (boardId: string) => {
    const board = data.boards.find(b => b.id === boardId);
    if (!board) return;

    const newItem: BoardItem = {
      id: crypto.randomUUID(),
      type: 'planilha',
      content: createDefaultSpreadsheet(),
      order: board.items.length,
    };

    setData(prev => ({
      ...prev,
      boards: prev.boards.map(b => 
        b.id === boardId 
          ? { ...b, items: [...b.items, newItem] } 
          : b
      )
    }));
    
    toast.success("Planilha adicionada com sucesso");
  };

  const addCard = (boardId: string) => {
    const board = data.boards.find(b => b.id === boardId);
    if (!board) return;

    const newItem: BoardItem = {
      id: crypto.randomUUID(),
      type: 'cartao',
      content: createDefaultCard(),
      order: board.items.length,
    };

    setData(prev => ({
      ...prev,
      boards: prev.boards.map(b => 
        b.id === boardId 
          ? { ...b, items: [...b.items, newItem] } 
          : b
      )
    }));
    
    toast.success("Cartão adicionado com sucesso");
  };

  const updateSpreadsheet = (boardId: string, itemId: string, spreadsheet: Spreadsheet) => {
    setData(prev => ({
      ...prev,
      boards: prev.boards.map(board => 
        board.id === boardId 
          ? {
              ...board,
              items: board.items.map(item => 
                item.id === itemId 
                  ? { ...item, content: spreadsheet }
                  : item
              )
            }
          : board
      )
    }));
  };

  const updateCard = (boardId: string, itemId: string, card: Card) => {
    setData(prev => ({
      ...prev,
      boards: prev.boards.map(board => 
        board.id === boardId 
          ? {
              ...board,
              items: board.items.map(item => 
                item.id === itemId 
                  ? { ...item, content: card }
                  : item
              )
            }
          : board
      )
    }));
  };

  const deleteItem = (boardId: string, itemId: string) => {
    setData(prev => ({
      ...prev,
      boards: prev.boards.map(board => 
        board.id === boardId 
          ? {
              ...board,
              items: board.items.filter(item => item.id !== itemId)
            }
          : board
      )
    }));
    
    closeModal();
    toast.success("Item removido com sucesso");
  };

  const moveItem = (boardId: string, oldIndex: number, newIndex: number) => {
    const board = data.boards.find(b => b.id === boardId);
    if (!board) return;

    const items = [...board.items];
    const [movedItem] = items.splice(oldIndex, 1);
    items.splice(newIndex, 0, movedItem);

    // Atualiza a ordem
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index
    }));

    setData(prev => ({
      ...prev,
      boards: prev.boards.map(b => 
        b.id === boardId 
          ? { ...b, items: updatedItems } 
          : b
      )
    }));
  };

  const moveItemBetweenBoards = (sourceBoardId: string, targetBoardId: string, itemId: string) => {
    const sourceBoard = data.boards.find(b => b.id === sourceBoardId);
    const targetBoard = data.boards.find(b => b.id === targetBoardId);
    
    if (!sourceBoard || !targetBoard) return;
    
    const itemToMove = sourceBoard.items.find(item => item.id === itemId);
    if (!itemToMove) return;
    
    // Remove do quadro de origem
    const updatedSourceItems = sourceBoard.items.filter(item => item.id !== itemId);
    
    // Adiciona ao quadro de destino
    const updatedTargetItems = [...targetBoard.items, {...itemToMove, order: targetBoard.items.length}];
    
    setData(prev => ({
      ...prev,
      boards: prev.boards.map(board => {
        if (board.id === sourceBoardId) {
          return { ...board, items: updatedSourceItems };
        }
        if (board.id === targetBoardId) {
          return { ...board, items: updatedTargetItems };
        }
        return board;
      })
    }));
  };

  // Funções de controle de modal
  const openModal = (boardId: string, itemId: string, type: ItemType) => {
    setModal({
      isOpen: true,
      itemId,
      boardId,
      type,
      isMaximized: false,
    });
  };

  const closeModal = () => {
    setModal({
      isOpen: false,
      itemId: null,
      boardId: null,
      type: null,
      isMaximized: false,
    });
  };

  const toggleMaximizeModal = () => {
    setModal(prev => ({
      ...prev,
      isMaximized: !prev.isMaximized,
    }));
  };

  // Funções de controle de menu de adicionar item
  const openItemMenu = (boardId: string, position: { x: number; y: number }) => {
    setItemMenu({
      isOpen: true,
      boardId,
      position,
    });
  };

  const closeItemMenu = () => {
    setItemMenu({
      isOpen: false,
      boardId: null,
      position: null,
    });
  };

  // Configurações do usuário
  const updateSettings = (settings: UserSettings) => {
    setData(prev => ({
      ...prev,
      settings
    }));
    
    toast.success("Configurações atualizadas com sucesso");
  };

  const value = {
    data,
    modal,
    itemMenu,
    addBoard,
    updateBoardTitle,
    moveBoard,
    deleteBoard,
    addSpreadsheet,
    addCard,
    updateSpreadsheet,
    updateCard,
    deleteItem,
    moveItem,
    moveItemBetweenBoards,
    openModal,
    closeModal,
    toggleMaximizeModal,
    openItemMenu,
    closeItemMenu,
    updateSettings,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp deve ser usado dentro de um AppProvider');
  }
  return context;
};
