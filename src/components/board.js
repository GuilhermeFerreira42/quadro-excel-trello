import { elements } from '../utils/dom.js';
import { generateId } from '../utils/helpers.js';
import * as store from '../store/state.js';
import * as storage from '../services/storage.js';

// Funções de renderização do quadro
export function createBlockElement(block, board) {
  const blockEl = document.createElement("div");
  blockEl.className = "block";
  blockEl.setAttribute("tabindex", "0");
  blockEl.setAttribute("role", "region");
  blockEl.setAttribute("aria-label", `Bloco: ${block.name}`);

  const itemsContainer = document.createElement("div");
  itemsContainer.className = "flex-1 space-y-2";
  itemsContainer.style.minHeight = "0";
  itemsContainer.style.transition = "min-height 0.2s ease";

  const header = document.createElement("div");
  header.className = "block-header";
  header.innerHTML = `
    <span class="block-title">${block.name}</span>
    <button type="button" class="block-menu-btn" aria-haspopup="true" aria-expanded="false">
      <i class="fas fa-ellipsis-h"></i>
    </button>
  `;

  blockEl.appendChild(header);
  blockEl.appendChild(itemsContainer);

  return blockEl;
}

export function renderBoardContent() {
  const board = store.getSelectedBoard();
  if (!board) return;

  elements.boardTitle.textContent = board.name;
  elements.boardContent.innerHTML = '';

  board.blocks.forEach(block => {
    const blockEl = createBlockElement(block, board);
    elements.boardContent.appendChild(blockEl);
  });
}

export function renderBoardsList() {
  const boards = store.getBoards();
  elements.boardsList.innerHTML = '';

  boards.forEach(board => {
    const li = document.createElement('li');
    li.innerHTML = `
      <button class="board-item ${board.id === store.getSelectedBoardId() ? 'active' : ''}"
              data-board-id="${board.id}">
        ${board.name}
      </button>
    `;
    elements.boardsList.appendChild(li);
  });
}

export function addNewBlock() {
  const board = store.getSelectedBoard();
  if (!board) return;

  const blockName = prompt('Nome do novo bloco:');
  if (!blockName?.trim()) return;

  const newBlock = {
    id: generateId(),
    name: blockName.trim(),
    items: []
  };

  board.blocks.push(newBlock);
  storage.saveData('boards', store.getBoards());
  renderBoardContent();
}

export function init() {
  // Inicializar eventos do quadro
  elements.addBoardBtn.addEventListener('click', () => {
    const boardName = prompt('Nome do novo quadro:');
    if (!boardName?.trim()) return;

    const newBoard = {
      id: generateId(),
      name: boardName.trim(),
      blocks: []
    };

    const boards = store.getBoards();
    boards.push(newBoard);
    store.setBoards(boards);
    store.setSelectedBoardId(newBoard.id);
    
    storage.saveData('boards', boards);
    renderBoardsList();
    renderBoardContent();
  });

  elements.boardsList.addEventListener('click', (e) => {
    const boardBtn = e.target.closest('.board-item');
    if (!boardBtn) return;

    const boardId = boardBtn.dataset.boardId;
    store.setSelectedBoardId(boardId);
    renderBoardsList();
    renderBoardContent();
  });

  // Renderizar estado inicial
  renderBoardsList();
  if (store.getSelectedBoardId()) {
    renderBoardContent();
  }
}
