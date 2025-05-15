
export type CellType = 
  | 'texto' 
  | 'numero' 
  | 'moeda' 
  | 'data' 
  | 'hora' 
  | 'tempo' 
  | 'porcentagem' 
  | 'checkbox' 
  | 'peso' 
  | 'personalizado';

export type CellValue = string | number | boolean | null;

export interface Column {
  id: string;
  title: string;
  type: CellType;
  width?: number;
  unit?: string;
}

export interface Row {
  id: string;
  cells: Record<string, CellValue>;
}

export interface Spreadsheet {
  id: string;
  columns: Column[];
  rows: Row[];
}

export interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

export interface Checklist {
  id: string;
  title: string;
  items: ChecklistItem[];
}

export interface Card {
  id: string;
  title: string;
  description: string;
  checklists: Checklist[];
}

export type ItemType = 'planilha' | 'cartao';

export interface BoardItem {
  id: string;
  type: ItemType;
  content: Spreadsheet | Card;
  order: number;
}

export interface Board {
  id: string;
  title: string;
  items: BoardItem[];
  order: number;
}

export interface UserSettings {
  expandirQuadro: boolean;
}

export type AppData = {
  boards: Board[];
  settings: UserSettings;
};

export type ModalData = {
  isOpen: boolean;
  itemId: string | null;
  boardId: string | null;
  type: ItemType | null;
  isMaximized: boolean;
};

export type ItemMenuData = {
  isOpen: boolean;
  boardId: string | null;
  position: { x: number; y: number } | null;
};
