import { elements } from './utils/dom.js';
import { generateId } from './utils/helpers.js';
import * as store from './store/state.js';
import * as storage from './services/storage.js';

// Carregar dados salvos
const savedBoards = storage.loadData('boards');
if (savedBoards) {
  store.setBoards(savedBoards);
}

// Carregar preferências
const savedExpandBoard = storage.loadData('expandBoard');
if (savedExpandBoard !== null) {
  store.setExpandBoard(savedExpandBoard);
}

// Inicializar eventos
document.addEventListener('DOMContentLoaded', () => {
  // Aqui vamos importar e inicializar os outros módulos conforme necessário
  Promise.all([
    import('./components/board.js'),
    import('./components/modal.js'),
    import('./components/sheet.js'),
    import('./components/menu.js')
  ]).then(([boardModule, modalModule, sheetModule, menuModule]) => {
    // Inicializar componentes
    boardModule.init();
    modalModule.init();
    sheetModule.init();
    menuModule.init();
  });
});
