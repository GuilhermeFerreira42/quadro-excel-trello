// Função para gerar IDs únicos
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// Funções de formatação
export function formatString(str) {
  return str.trim();
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString();
}

export function formatNumber(num) {
  return Number(num).toLocaleString();
}

// Funções de validação
export function validateInput(value, type = 'string') {
  if (!value) return false;
  
  switch (type) {
    case 'string':
      return typeof value === 'string' && value.trim().length > 0;
    case 'number':
      return !isNaN(value) && isFinite(value);
    case 'array':
      return Array.isArray(value);
    default:
      return true;
  }
}

// Funções de segurança
export function escapeHTML(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

export function sanitizeInput(input) {
  return escapeHTML(input.trim());
}
