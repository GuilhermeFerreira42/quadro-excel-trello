// Estado global da aplicação
const state = {
  boards: [],
  selectedBoardId: null,
  selectedItem: null,
  expandBoard: false,
  sidebarCollapsed: false,
  planilhaEditando: null,
  blockEditando: null,
  boardEditando: null
};

// Getters
export const getState = () => state;
export const getBoards = () => state.boards;
export const getSelectedBoard = () => state.boards.find(board => board.id === state.selectedBoardId);
export const getExpandBoard = () => state.expandBoard;

// Mutations
export const setBoards = (boards) => {
  state.boards = boards;
};

export const setSelectedBoardId = (id) => {
  state.selectedBoardId = id;
};

export const setSelectedItem = (item) => {
  state.selectedItem = item;
};

export const setExpandBoard = (expand) => {
  state.expandBoard = expand;
};

export const setSidebarCollapsed = (collapsed) => {
  state.sidebarCollapsed = collapsed;
};

export const setPlanilhaEditando = (planilha) => {
  state.planilhaEditando = planilha;
};

export const setBlockEditando = (block) => {
  state.blockEditando = block;
};

export const setBoardEditando = (board) => {
  state.boardEditando = board;
};
