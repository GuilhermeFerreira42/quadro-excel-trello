import { elements } from '../utils/dom.js';
import { sanitizeInput } from '../utils/helpers.js';

export function openModal(content, options = {}) {
  elements.modalContent.innerHTML = sanitizeInput(content);
  elements.modal.classList.remove('hidden');
  
  if (options.onClose) {
    const closeHandler = () => {
      options.onClose();
      elements.btnCloseModal.removeEventListener('click', closeHandler);
    };
    elements.btnCloseModal.addEventListener('click', closeHandler);
  }
}

export function closeModal() {
  elements.modal.classList.add('hidden');
  elements.modalContent.innerHTML = '';
}

export function renderModalContent(content) {
  elements.modalContent.innerHTML = sanitizeInput(content);
}

export function init() {
  // Inicializar eventos do modal
  elements.btnCloseModal.addEventListener('click', closeModal);
  
  // Fechar modal ao clicar fora
  elements.modal.addEventListener('click', (e) => {
    if (e.target === elements.modal) {
      closeModal();
    }
  });

  // Fechar modal com tecla ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !elements.modal.classList.contains('hidden')) {
      closeModal();
    }
  });
}
