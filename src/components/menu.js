import { elements } from '../utils/dom.js';
import * as store from '../store/state.js';
import * as storage from '../services/storage.js';

export function closeAllMenus() {
  const menus = [
    elements.createMenu,
    elements.userSettingsMenu,
    elements.settingsMenu
  ];

  menus.forEach(menu => {
    if (menu) menu.classList.add('hidden');
  });
}

function toggleMenu(menu) {
  const isHidden = menu.classList.contains('hidden');
  closeAllMenus();
  menu.classList.toggle('hidden', !isHidden);
}

export function init() {
  // Inicializar eventos dos menus
  elements.btnCreate?.addEventListener('click', () => {
    toggleMenu(elements.createMenu);
  });

  elements.userAvatar?.addEventListener('click', () => {
    toggleMenu(elements.userSettingsMenu);
  });

  elements.btnSettings?.addEventListener('click', () => {
    toggleMenu(elements.settingsMenu);
  });

  // Fechar menus ao clicar fora
  document.addEventListener('click', (e) => {
    const isMenuClick = e.target.closest('#createMenu, #userSettingsMenu, #settingsMenu, #btnCreate, #userAvatar, #btnSettings');
    if (!isMenuClick) {
      closeAllMenus();
    }
  });

  // Eventos da barra lateral
  elements.sidebarToggleBtn?.addEventListener('click', () => {
    const collapsed = !store.getState().sidebarCollapsed;
    store.setSidebarCollapsed(collapsed);
    elements.sidebar.classList.toggle('collapsed', collapsed);
    storage.saveData('sidebarCollapsed', collapsed);
  });

  // Configuração de expandir quadro
  elements.settingExpandBoard?.addEventListener('change', (e) => {
    const expand = e.target.checked;
    store.setExpandBoard(expand);
    storage.saveData('expandBoard', expand);
  });
}
