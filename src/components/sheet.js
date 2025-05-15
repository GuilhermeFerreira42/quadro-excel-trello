import { elements } from '../utils/dom.js';
import { generateId } from '../utils/helpers.js';
import * as store from '../store/state.js';
import * as storage from '../services/storage.js';

export function renderizarPlanilhaAvancada(planilha) {
  store.setPlanilhaEditando(planilha);
  
  // Renderizar cabeçalho
  elements.theadColunasAvancada.innerHTML = `
    <tr>
      <th class="select-cell"></th>
      ${planilha.colunas.map(coluna => `
        <th>${coluna.nome}</th>
      `).join('')}
    </tr>
  `;

  // Renderizar linhas
  elements.tbodyLinhasAvancada.innerHTML = planilha.linhas.map(linha => `
    <tr>
      <td class="select-cell">
        <input type="checkbox" class="linha-checkbox">
      </td>
      ${linha.map(celula => `
        <td contenteditable="true">${celula}</td>
      `).join('')}
    </tr>
  `).join('');

  atualizarBotaoRemoverLinhas();
}

export function addNewSheetToBlock(blockId) {
  const board = store.getSelectedBoard();
  if (!board) return;

  const block = board.blocks.find(b => b.id === blockId);
  if (!block) return;

  const sheetName = prompt('Nome da nova planilha:');
  if (!sheetName?.trim()) return;

  const newSheet = {
    id: generateId(),
    type: 'sheet',
    name: sheetName.trim(),
    colunas: [],
    linhas: []
  };

  block.items.push(newSheet);
  storage.saveData('boards', store.getBoards());
  return newSheet;
}

function atualizarBotaoRemoverLinhas() {
  const checkboxes = elements.tbodyLinhasAvancada.querySelectorAll('.linha-checkbox:checked');
  elements.btnRemoverLinhasSelecionadasPlanilhaAvancada.disabled = checkboxes.length === 0;
}

export function init() {
  // Inicializar eventos da planilha
  elements.btnAdicionarColunaPlanilhaAvancada.addEventListener('click', () => {
    const colunaNome = prompt('Nome da nova coluna:');
    if (!colunaNome?.trim()) return;

    const planilha = store.getPlanilhaEditando();
    if (!planilha) return;

    planilha.colunas.push({ nome: colunaNome.trim() });
    planilha.linhas.forEach(linha => linha.push(''));
    
    renderizarPlanilhaAvancada(planilha);
  });

  elements.btnAdicionarLinhaPlanilhaAvancada.addEventListener('click', () => {
    const planilha = store.getPlanilhaEditando();
    if (!planilha) return;

    const novaLinha = new Array(planilha.colunas.length).fill('');
    planilha.linhas.push(novaLinha);
    
    renderizarPlanilhaAvancada(planilha);
  });

  elements.tbodyLinhasAvancada.addEventListener('change', (e) => {
    if (e.target.matches('.linha-checkbox')) {
      atualizarBotaoRemoverLinhas();
    }
  });

  elements.btnRemoverLinhasSelecionadasPlanilhaAvancada.addEventListener('click', () => {
    const planilha = store.getPlanilhaEditando();
    if (!planilha) return;

    const linhasParaRemover = [];
    elements.tbodyLinhasAvancada.querySelectorAll('.linha-checkbox:checked').forEach((checkbox, index) => {
      linhasParaRemover.unshift(index); // Adiciona no início para remover de trás para frente
    });

    linhasParaRemover.forEach(index => {
      planilha.linhas.splice(index, 1);
    });

    renderizarPlanilhaAvancada(planilha);
  });
}
