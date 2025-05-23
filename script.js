// Elementos do DOM
const btnCreate = document.getElementById("btnCreate");
const createMenu = document.getElementById("createMenu");
const addBoardBtn = document.getElementById("addBoardBtn");
const addCardBtn = document.getElementById("addCardBtn");
const boardsList = document.getElementById("boardsList");
const boardTitle = document.getElementById("boardTitle");
const boardContent = document.getElementById("boardContent");
const modal = document.getElementById("modal");
const modalContent = document.getElementById("modalContent");
const btnCloseModal = document.getElementById("btnCloseModal");
const btnDelete = document.getElementById("btnDelete");
const btnArchive = document.getElementById("btnArchive");
const btnMaximize = document.getElementById("btnMaximize");
const btnRestore = document.getElementById("btnRestore");
const userAvatar = document.getElementById("userAvatar");
const userSettingsMenu = document.getElementById("userSettingsMenu");
const settingExpandBoard = document.getElementById("expandBoardCheckbox");
const btnSettings = document.getElementById("btnSettings");
const settingsMenu = document.getElementById("settingsMenu");
const settingExpandBoardSidebar = document.getElementById("settingExpandBoard");
const sidebar = document.getElementById("sidebar");
const sidebarToggleBtn = document.getElementById("sidebarToggleBtn");

// Elementos do novo modal de edição avançada de planilhas
const modalPlanilhaEdicaoAvancada = document.getElementById("modalPlanilhaEdicaoAvancada");
const btnCloseModalPlanilhaAvancada = document.getElementById("btnCloseModalPlanilhaAvancada");
const formPlanilhaAvancada = document.getElementById("formPlanilhaAvancada");
const btnAdicionarColunaPlanilhaAvancada = document.getElementById("btnAdicionarColunaPlanilhaAvancada");
const btnAdicionarLinhaPlanilhaAvancada = document.getElementById("btnAdicionarLinhaPlanilhaAvancada");
const btnRemoverLinhasSelecionadasPlanilhaAvancada = document.getElementById("btnRemoverLinhasSelecionadasPlanilhaAvancada");
const btnExcluirPlanilhaAvancada = document.getElementById("btnExcluirPlanilhaAvancada");
const btnArquivarPlanilhaAvancada = document.getElementById("btnArquivarPlanilhaAvancada");
const btnCancelarPlanilhaAvancada = document.getElementById("btnCancelarPlanilhaAvancada");
const btnSalvarPlanilhaAvancada = document.getElementById("btnSalvarPlanilhaAvancada");
const theadColunasAvancada = document.getElementById("theadColunasAvancada");
const tbodyLinhasAvancada = document.getElementById("tbodyLinhasAvancada");

let planilhaEditando = null;
let blockEditando = null;
let boardEditando = null;

// Função utilitária para gerar IDs únicos
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// Estrutura de dados principal
let boards = [];
let selectedBoardId = null;
let selectedItem = null;
let expandBoard = false;
let sidebarCollapsed = false;

// Função para criar um bloco visual
function createBlockElement(block, board) {
  const blockEl = document.createElement("div");
  blockEl.className = "block";
  blockEl.setAttribute("tabindex", "0");
  blockEl.setAttribute("role", "region");
  blockEl.setAttribute("aria-label", `Bloco: ${block.name}`);

  // Container para itens dentro do bloco
  const itemsContainer = document.createElement("div");
  itemsContainer.className = "flex-1 space-y-2";
  itemsContainer.style.minHeight = "0";
  itemsContainer.style.transition = "min-height 0.2s ease";

  // Cabeçalho com nome do bloco e botão de menu
  const header = document.createElement("div");
  header.className = "block-header";

  const titleSpan = document.createElement("span");
  titleSpan.className = "block-title";
  titleSpan.textContent = block.name;

  // Botão de menu
  const menuBtn = document.createElement("button");
  menuBtn.className = "block-menu-btn";
  menuBtn.type = "button";
  menuBtn.setAttribute("aria-haspopup", "true");
  menuBtn.setAttribute("aria-expanded", "false");
  menuBtn.setAttribute("aria-label", `Menu do bloco ${block.name}`);
  menuBtn.innerHTML = '<i class="fas fa-ellipsis-h"></i>';

  // Menu dropdown para opções do bloco
  const menuDropdown = document.createElement("div");
  menuDropdown.className = "block-dropdown-menu";
  menuDropdown.setAttribute("role", "menu");
  menuDropdown.setAttribute("aria-label", `Opções do bloco ${block.name}`);

  // Opção de editar nome
  const editOption = document.createElement("button");
  editOption.type = "button";
  editOption.textContent = "Editar nome";
  editOption.addEventListener("click", () => {
    closeAllMenus();
    const newName = prompt("Digite o novo nome do bloco:", block.name);
    if (newName && newName.trim() !== "") {
      block.name = newName.trim();
      renderBoardContent();
    }
  });

  // Opção de adicionar planilha
  const addSheetOption = document.createElement("button");
  addSheetOption.type = "button";
  addSheetOption.textContent = "+ Nova planilha";
  addSheetOption.addEventListener("click", () => {
    closeAllMenus();
    addNewSheetToBlock(block);
  });

  // Opção de adicionar cartão simples
  const addCardOption = document.createElement("button");
  addCardOption.type = "button";
  addCardOption.textContent = "+ Novo cartão simples";
  addCardOption.addEventListener("click", () => {
    closeAllMenus();
    addNewCardToBlock(block);
  });

  // Opção de arquivar
  const archiveOption = document.createElement("button");
  archiveOption.type = "button";
  archiveOption.textContent = "Arquivar";
  archiveOption.addEventListener("click", () => {
    block.archived = true;
    renderBoardContent();
  });

  // Opção de excluir
  const deleteOption = document.createElement("button");
  deleteOption.type = "button";
  deleteOption.textContent = "Excluir";
  deleteOption.addEventListener("click", () => {
    if (confirm(`Tem certeza que deseja excluir o bloco "${block.name}"? Essa ação não pode ser desfeita.`)) {
      const idx = board.blocks.findIndex(b => b.id === block.id);
      if (idx > -1) {
        board.blocks.splice(idx, 1);
        renderBoardContent();
        closeModal();
      }
    }
  });

  menuDropdown.appendChild(editOption);
  menuDropdown.appendChild(addSheetOption);
  menuDropdown.appendChild(addCardOption);
  menuDropdown.appendChild(archiveOption);
  menuDropdown.appendChild(deleteOption);

  menuBtn.appendChild(menuDropdown);

  menuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const expanded = menuBtn.getAttribute("aria-expanded") === "true";
    closeAllMenus();
    if (!expanded) {
      menuDropdown.style.display = "flex";
      menuDropdown.style.top = menuBtn.offsetHeight + "px";
      menuDropdown.style.right = "0";
      menuBtn.setAttribute("aria-expanded", "true");
    }
  });

  header.appendChild(titleSpan);
  header.appendChild(menuBtn);
  blockEl.appendChild(header);

  // Renderiza itens do bloco
  block.items.forEach(item => {
    if (item.archived) return;
    if (item.type === "card") {
      itemsContainer.appendChild(createCardElement(item, block, board));
    } else if (item.type === "sheet") {
      itemsContainer.appendChild(createSheetElement(item, block, board));
    }
  });

  blockEl.appendChild(itemsContainer);
  return blockEl;
}

// Função para criar elemento de cartão
function createCardElement(card, block, board) {
  const cardEl = document.createElement("div");
  cardEl.className = "bg-[#1e1f22] rounded-md p-3 select-none relative cursor-pointer";
  cardEl.setAttribute("tabindex", "0");
  cardEl.setAttribute("role", "button");
  cardEl.setAttribute("aria-label", `Cartão simples: ${card.title}`);

  const header = document.createElement("div");
  header.className = "flex justify-between items-start";
  const titleSpan = document.createElement("span");
  titleSpan.className = "font-semibold text-xs text-white break-words flex-1";
  
  // Se for um cartão novo, criar input para edição direta
  if (card.isNew) {
    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.value = card.title;
    titleInput.className = "w-full rounded bg-[#2f4a11] border border-[#2f80ed] px-2 py-1 text-white text-xs focus:outline-none focus:ring-1 focus:ring-[#2f80ed]";
    titleInput.addEventListener("blur", () => {
      if (titleInput.value.trim()) {
        card.title = titleInput.value.trim();
        card.isNew = false;
        renderBoardContent();
      }
    });
    titleInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        titleInput.blur();
      }
    });
    titleSpan.appendChild(titleInput);
    // Focar o input automaticamente
    setTimeout(() => titleInput.focus(), 0);
  } else {
    titleSpan.textContent = card.title;
  }

  // Botão de menu
  const menuBtn = document.createElement("button");
  menuBtn.className = "text-[#6b7280] hover:text-white text-xs p-1 rounded";
  menuBtn.type = "button";
  menuBtn.setAttribute("aria-haspopup", "true");
  menuBtn.setAttribute("aria-expanded", "false");
  menuBtn.setAttribute("aria-label", `Menu do cartão simples ${card.title}`);
  menuBtn.innerHTML = `<i class="fas fa-ellipsis-h"></i>`;
  menuBtn.style.position = "relative";

  // Menu dropdown para opções do cartão
  const menuDropdown = document.createElement("div");
  menuDropdown.className = "block-dropdown-menu";
  menuDropdown.setAttribute("role", "menu");
  menuDropdown.setAttribute("aria-label", `Opções do cartão simples ${card.title}`);
  const editOption = document.createElement("button");
  editOption.type = "button";
  editOption.textContent = "Abrir cartão";
  editOption.addEventListener("click", () => {
    closeAllMenus();
    openModal("card", card, block, board);
  });

  const archiveOption = document.createElement("button");
  archiveOption.type = "button";
  archiveOption.textContent = "Arquivar";
  archiveOption.addEventListener("click", () => {
    card.archived = true;
    renderBoardContent();
  });

  const deleteOption = document.createElement("button");
  deleteOption.type = "button";
  deleteOption.textContent = "Excluir";
  deleteOption.addEventListener("click", () => {
    const idx = block.items.findIndex(i => i.id === card.id);
    if (idx > -1) {
      block.items.splice(idx, 1);
      renderBoardContent();
      closeModal();
    }
  });

  menuDropdown.appendChild(editOption);
  menuDropdown.appendChild(archiveOption);
  menuDropdown.appendChild(deleteOption);
  menuBtn.appendChild(menuDropdown);

  menuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const expanded = menuBtn.getAttribute("aria-expanded") === "true";
    closeAllMenus();
    if (!expanded) {
      menuDropdown.style.display = "flex";
      menuDropdown.style.top = menuBtn.offsetHeight + "px";
      menuDropdown.style.right = "0";
      menuBtn.setAttribute("aria-expanded", "true");
    }
  });

  header.appendChild(titleSpan);
  header.appendChild(menuBtn);
  cardEl.appendChild(header);

  // Clique no cartão abre modal de edição (exceto no botão de menu)
  cardEl.addEventListener("click", (e) => {
    if (e.target === menuBtn || menuBtn.contains(e.target)) return;
    openModal("card", card, block, board);
  });

  return cardEl;
}

// Função para criar elemento de planilha
function createSheetElement(sheet, block, board) {
  const sheetEl = document.createElement("div");
  sheetEl.className = "bg-[#1e1f22] rounded-md p-3 select-none relative cursor-pointer";
  sheetEl.setAttribute("tabindex", "0");
  sheetEl.setAttribute("role", "button");
  sheetEl.setAttribute("aria-label", `Planilha: ${sheet.name || "Sem nome"}`);

  const header = document.createElement("div");
  header.className = "flex justify-between items-start";

  const titleSpan = document.createElement("span");
  titleSpan.className = "font-semibold text-xs text-white break-words flex-1";
  titleSpan.textContent = sheet.name || "Planilha";

  // Botão de menu
  const menuBtn = document.createElement("button");
  menuBtn.className = "text-[#6b7280] hover:text-white text-xs p-1 rounded";
  menuBtn.type = "button";
  menuBtn.setAttribute("aria-haspopup", "true");
  menuBtn.setAttribute("aria-expanded", "false");
  menuBtn.setAttribute("aria-label", `Menu da planilha ${sheet.name || "Sem nome"}`);
  menuBtn.innerHTML = "<i class=\"fas fa-ellipsis-h\"></i>";
  menuBtn.style.position = "relative";

  // Menu dropdown para opções da planilha
  const menuDropdown = document.createElement("div");
  menuDropdown.className = "block-dropdown-menu";
  menuDropdown.setAttribute("role", "menu");
  menuDropdown.setAttribute("aria-label", `Opções da planilha ${sheet.name || "Sem nome"}`);
  const editOption = document.createElement("button");
  editOption.type = "button";
  editOption.textContent = "Abrir planilha";
  editOption.addEventListener("click", () => {
    closeAllMenus();
    openModalPlanilhaAvancada(sheet, block, board);
  });

  const archiveOption = document.createElement("button");
  archiveOption.type = "button";
  archiveOption.textContent = "Arquivar";
  archiveOption.addEventListener("click", () => {
    sheet.archived = true;
    renderBoardContent();
  });

  const deleteOption = document.createElement("button");
  deleteOption.type = "button";
  deleteOption.textContent = "Excluir";
  deleteOption.addEventListener("click", () => {
    if (confirm("Tem certeza que deseja excluir esta planilha? Essa ação não pode ser desfeita.")) {
      const idx = block.items.findIndex(i => i.id === sheet.id);
      if (idx > -1) {
        block.items.splice(idx, 1);
        renderBoardContent();
      }
    }
  });

  menuDropdown.appendChild(editOption);
  menuDropdown.appendChild(archiveOption);
  menuDropdown.appendChild(deleteOption);
  menuBtn.appendChild(menuDropdown);

  menuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const expanded = menuBtn.getAttribute("aria-expanded") === "true";
    closeAllMenus();
    if (!expanded) {
      menuDropdown.style.display = "flex";
      menuDropdown.style.top = menuBtn.offsetHeight + "px";
      menuDropdown.style.right = "0";
      menuBtn.setAttribute("aria-expanded", "true");
    }
  });

  header.appendChild(titleSpan);
  header.appendChild(menuBtn);
  sheetEl.appendChild(header);
  // Renderiza tabela inline
  if (sheet.columns && sheet.data) {
    const tableWrapper = document.createElement("div");
    tableWrapper.className = "sheet-table-wrapper mt-2";

    const table = document.createElement("table");
    table.className = "sheet-table";

    // Cabeçalho da tabela
    const thead = document.createElement("thead");
    const trHead = document.createElement("tr");
    sheet.columns.forEach(col => {
      const th = document.createElement("th");
      th.textContent = col.name;
      trHead.appendChild(th);
    });
    thead.appendChild(trHead);
    table.appendChild(thead);

    // Corpo da tabela com células editáveis
    const tbody = document.createElement("tbody");
    sheet.data.forEach((row, rowIndex) => {
      const tr = document.createElement("tr");
      row.forEach((cell, colIndex) => {
        const td = document.createElement("td");
        td.setAttribute("contenteditable", "true");
        td.setAttribute("data-row", rowIndex);
        td.setAttribute("data-col", colIndex);

        // Define o tipo de entrada baseado no tipo da coluna
        const coluna = sheet.columns[colIndex];
        if (coluna.type === "checkbox") {
          td.setAttribute("contenteditable", "false");
          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.checked = cell === true || cell === "true";
          checkbox.className = "cursor-pointer";
          checkbox.addEventListener("change", () => {
            sheet.data[rowIndex][colIndex] = checkbox.checked;
          });
          td.appendChild(checkbox);
        } else {
          td.textContent = cell ?? "";
          td.addEventListener("input", () => {
            let valor = td.textContent;
            
            // Converte o valor baseado no tipo da coluna
            if (coluna.type === "numero" || coluna.type === "peso" || coluna.type === "porcentagem") {
              valor = valor === "" ? "" : Number(valor);
            } else if (coluna.type === "moeda") {
              valor = valor === "" ? "" : Number(valor.replace(/[^0-9.-]+/g, ""));
            }
            
            sheet.data[rowIndex][colIndex] = valor;
          });
          
          // Formatação específica para tipos especiais
          td.addEventListener("blur", () => {
            let valor = td.textContent;
            if (coluna.type === "moeda" && valor) {
              td.textContent = Number(valor).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
              });
            } else if (coluna.type === "porcentagem" && valor) {
              td.textContent = Number(valor) + "%";
            } else if (coluna.type === "peso" && valor) {
              td.textContent = Number(valor) + " kg";
            }
          });
        }
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    tableWrapper.appendChild(table);
    sheetEl.appendChild(tableWrapper);
  }

  return sheetEl;
}

// Função para renderizar lista de quadros na barra lateral
function renderBoardsList() {
  if (!boardsList) return;
  boardsList.innerHTML = "";
  boards.forEach(board => {
    const isSelected = board.id === selectedBoardId;
    const boardEl = document.createElement("div");
    boardEl.className = `flex items-center justify-between rounded px-2 py-1 text-xs cursor-pointer ${
      isSelected ? "bg-[#6b7280]/30 text-white" : "text-[#9ca3af] hover:text-white"
    }`;

    const leftDiv = document.createElement("div");
    leftDiv.className = "flex items-center space-x-2";
    
    const colorBox = document.createElement("div");
    colorBox.className = "w-3 h-3 rounded-sm bg-[#6b7280]";
    
    const nameSpan = document.createElement("span");
    nameSpan.textContent = board.name;
    nameSpan.className = "board-name";
    
    leftDiv.appendChild(colorBox);
    leftDiv.appendChild(nameSpan);
    boardEl.appendChild(leftDiv);

    // Botão de menu com três pontinhos
    const menuBtn = document.createElement("button");
    menuBtn.className = "text-[#6b7280] hover:text-white text-xs p-1 rounded";
    menuBtn.type = "button";
    menuBtn.setAttribute("aria-haspopup", "true");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", `Menu do quadro ${board.name}`);
    menuBtn.innerHTML = `<i class="fas fa-ellipsis-h"></i>`;
    menuBtn.style.position = "relative";

    // Menu dropdown para opções do quadro
    const menuDropdown = document.createElement("div");
    menuDropdown.className = "dropdown-menu";
    menuDropdown.setAttribute("role", "menu");
    menuDropdown.setAttribute("aria-label", `Opções do quadro ${board.name}`);

    // Opção de editar
    const editOption = document.createElement("button");
    editOption.type = "button";
    editOption.textContent = "Editar nome";
    editOption.addEventListener("click", () => {
      closeAllMenus();
      const newName = prompt("Digite o novo nome do quadro:", board.name);
      if (newName && newName.trim() !== "") {
        board.name = newName.trim();
        renderBoardsList();
        if (selectedBoardId === board.id) {
          renderBoardContent();
        }
      }
    });

    // Opção de excluir
    const deleteOption = document.createElement("button");
    deleteOption.type = "button";
    deleteOption.textContent = "Excluir quadro";
    deleteOption.addEventListener("click", () => {
      if (confirm(`Tem certeza que deseja excluir o quadro "${board.name}"? Essa ação não pode ser desfeita.`)) {
        const idx = boards.findIndex(b => b.id === board.id);
        if (idx > -1) {
          boards.splice(idx, 1);
          if (selectedBoardId === board.id) {
            selectedBoardId = boards.length ? boards[0].id : null;
          }
          renderBoardsList();
          renderBoardContent();
          closeModal();
        }
      }
    });

    menuDropdown.appendChild(editOption);
    menuDropdown.appendChild(deleteOption);
    menuBtn.appendChild(menuDropdown);

    menuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const expanded = menuBtn.getAttribute("aria-expanded") === "true";
      closeAllMenus();
      if (!expanded) {
        menuDropdown.style.display = "flex";
        menuDropdown.style.top = menuBtn.offsetHeight + "px";
        menuDropdown.style.right = "0";
        menuBtn.setAttribute("aria-expanded", "true");
      }
    });

    boardEl.appendChild(menuBtn);

    // Seleciona quadro ao clicar fora do menu
    boardEl.addEventListener("click", (e) => {
      if (e.target === menuBtn || menuBtn.contains(e.target)) return;
      selectedBoardId = board.id;
      renderBoardsList();
      renderBoardContent();
    });

    boardsList.appendChild(boardEl);
  });
}

// Função para fechar todos os menus
function closeAllMenus() {
  document.querySelectorAll("[aria-expanded='true']").forEach(el => {
    el.setAttribute("aria-expanded", "false");
  });
  document.querySelectorAll(".dropdown-menu, .block-dropdown-menu").forEach(menu => {
    menu.style.display = "none";
  });
}

// Função para abrir modal
function openModal(type, item, block, board) {
  selectedItem = { type, item, block, board };
  modal.classList.remove("hidden");
  document.getElementById("modalTitle").textContent = type === "card" ? item.title : "Editar";
  renderModalContent(type, item, block, board);
}

// Função para renderizar conteúdo do modal
function renderModalContent(type, item, block, board) {
  modalContent.innerHTML = "";
  if (type === "card") {
    renderCardModal(item);
  }
}

// Função para abrir modal de edição avançada de planilha
function openModalPlanilhaAvancada(sheet, block, board) {  planilhaEditando = structuredClone(sheet); // Clona para permitir cancelar edição
  blockEditando = block;
  boardEditando = board;
  modalPlanilhaEdicaoAvancada.classList.remove("hidden");
  document.getElementById("nomePlanilhaAvancada").value = planilhaEditando.name || "";
  renderizarPlanilhaAvancada();
}

// Função para fechar modal de edição avançada de planilha
function closeModalPlanilhaAvancada() {
  modalPlanilhaEdicaoAvancada.classList.add("hidden");
  planilhaEditando = null;
  blockEditando = null;
  boardEditando = null;
}

// Função para renderizar planilha no modal avançado
function renderizarPlanilhaAvancada() {
  if (!planilhaEditando) return;

  // Renderiza cabeçalho com colunas editáveis
  theadColunasAvancada.innerHTML = "";
  const trHead = document.createElement("tr");
  
  planilhaEditando.columns.forEach((col, index) => {
    const th = document.createElement("th");
    th.className = "relative";

    const divCol = document.createElement("div");
    divCol.className = "flex flex-col space-y-1 p-2";

    // Input para nome da coluna
    const inputNome = document.createElement("input");
    inputNome.type = "text";
    inputNome.value = col.name;
    inputNome.className = "w-full bg-transparent border border-[#2f80ed] rounded px-2 py-1 text-white text-sm";
    inputNome.placeholder = "Nome da coluna";
    inputNome.addEventListener("input", (e) => {
      planilhaEditando.columns[index].name = e.target.value;
    });

    // Select para tipo da coluna
    const selectTipo = document.createElement("select");
    selectTipo.className = "w-full bg-transparent border border-[#2f80ed] rounded px-2 py-1 text-white text-sm";
    const tipos = [
      { value: "texto", label: "Texto" },
      { value: "numero", label: "Número" },
      { value: "moeda", label: "Moeda (R$)" },
      { value: "data", label: "Data" },
      { value: "hora", label: "Hora" },
      { value: "tempo", label: "Tempo/Duração" },
      { value: "porcentagem", label: "Porcentagem" },
      { value: "checkbox", label: "Checkbox" },
      { value: "peso", label: "Peso (kg)" }
    ];

    tipos.forEach(tipo => {
      const option = document.createElement("option");
      option.value = tipo.value;
      option.textContent = tipo.label;
      if (col.type === tipo.value) option.selected = true;
      selectTipo.appendChild(option);
    });

    selectTipo.addEventListener("change", (e) => {
      planilhaEditando.columns[index].type = e.target.value;
    });

    // Botão remover coluna
    const btnRemover = document.createElement("button");
    btnRemover.type = "button";
    btnRemover.className = "absolute top-1 right-1 text-red-500 hover:text-red-700";
    btnRemover.innerHTML = '<i class="fas fa-times"></i>';
    btnRemover.addEventListener("click", () => {
      if (planilhaEditando.columns.length <= 1) {
        alert("A planilha deve ter pelo menos uma coluna");
        return;
      }
      planilhaEditando.columns.splice(index, 1);
      planilhaEditando.data.forEach(row => {
        row.splice(index, 1);
      });
      renderizarPlanilhaAvancada();
    });

    divCol.appendChild(inputNome);
    divCol.appendChild(selectTipo);
    th.appendChild(divCol);
    th.appendChild(btnRemover);
    trHead.appendChild(th);
  });

  // Checkbox header para selecionar todas as linhas
  const thCheckbox = document.createElement("th");
  thCheckbox.className = "w-10 p-2";
  const checkboxAll = document.createElement("input");
  checkboxAll.type = "checkbox";
  checkboxAll.className = "cursor-pointer";
  checkboxAll.addEventListener("change", () => {
    const checkboxes = tbodyLinhasAvancada.querySelectorAll("input[type=checkbox]");
    checkboxes.forEach(cb => cb.checked = checkboxAll.checked);
    atualizarBotaoRemoverLinhas();
  });
  thCheckbox.appendChild(checkboxAll);
  trHead.appendChild(thCheckbox);

  theadColunasAvancada.appendChild(trHead);

  // Renderiza corpo da tabela
  tbodyLinhasAvancada.innerHTML = "";
  planilhaEditando.data.forEach((row, rowIndex) => {
    const tr = document.createElement("tr");
    
    row.forEach((cell, colIndex) => {
      const td = document.createElement("td");
      td.className = "p-2";
      
      const coluna = planilhaEditando.columns[colIndex];
      let input;

      switch (coluna.type) {
        case "checkbox":
          input = document.createElement("input");
          input.type = "checkbox";
          input.checked = cell;
          input.className = "cursor-pointer";
          break;
        case "numero":
        case "peso":
          input = document.createElement("input");
          input.type = "number";
          input.step = "any";
          input.value = cell || "";
          break;
        case "data":
          input = document.createElement("input");
          input.type = "date";
          input.value = cell || "";
          break;
        case "hora":
          input = document.createElement("input");
          input.type = "time";
          input.value = cell || "";
          break;
        case "moeda":
          input = document.createElement("input");
          input.type = "number";
          input.step = "0.01";
          input.min = "0";
          input.value = cell || "";
          break;
        case "porcentagem":
          input = document.createElement("input");
          input.type = "number";
          input.min = "0";
          input.max = "100";
          input.value = cell || "";
          break;
        default:
          input = document.createElement("input");
          input.type = "text";
          input.value = cell || "";
      }

      input.className = "w-full bg-transparent border border-[#2f2f33] rounded px-2 py-1 text-white text-sm";
      input.addEventListener("input", (e) => {
        let valor = e.target.value;
        if (coluna.type === "checkbox") valor = e.target.checked;
        else if (coluna.type === "numero" || coluna.type === "moeda" || coluna.type === "peso" || coluna.type === "porcentagem") {
          valor = valor === "" ? "" : Number(valor);
        }
        planilhaEditando.data[rowIndex][colIndex] = valor;
      });

      td.appendChild(input);
      tr.appendChild(td);
    });

    // Checkbox para seleção da linha
    const tdCheckbox = document.createElement("td");
    tdCheckbox.className = "p-2";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "cursor-pointer";
    checkbox.addEventListener("change", atualizarBotaoRemoverLinhas);
    tdCheckbox.appendChild(checkbox);
    tr.appendChild(tdCheckbox);

    tbodyLinhasAvancada.appendChild(tr);
  });

  atualizarBotaoRemoverLinhas();
}

// Função para atualizar estado do botão de remover linhas selecionadas
function atualizarBotaoRemoverLinhas() {
  const checkboxes = Array.from(tbodyLinhasAvancada.querySelectorAll("input[type=checkbox]"));
  const temLinhasSelecionadas = checkboxes.some(cb => cb.checked);
  btnRemoverLinhasSelecionadasPlanilhaAvancada.disabled = !temLinhasSelecionadas;
}

// Event listeners para o modal de edição avançada de planilha
btnCloseModalPlanilhaAvancada.addEventListener("click", () => {
  if (confirm("Tem certeza que deseja fechar? Alterações não salvas serão perdidas.")) {
    closeModalPlanilhaAvancada();
  }
});

btnCancelarPlanilhaAvancada.addEventListener("click", () => {
  if (confirm("Tem certeza que deseja cancelar? Alterações não salvas serão perdidas.")) {
    closeModalPlanilhaAvancada();
  }
});

btnAdicionarColunaPlanilhaAvancada.addEventListener("click", () => {
  const novaColuna = {
    name: `Coluna ${planilhaEditando.columns.length + 1}`,
    type: "texto"
  };
  planilhaEditando.columns.push(novaColuna);
  planilhaEditando.data.forEach(row => {
    row.push("");
  });
  renderizarPlanilhaAvancada();
});

btnAdicionarLinhaPlanilhaAvancada.addEventListener("click", () => {
  const novaLinha = planilhaEditando.columns.map(() => "");
  planilhaEditando.data.push(novaLinha);
  renderizarPlanilhaAvancada();
});

btnRemoverLinhasSelecionadasPlanilhaAvancada.addEventListener("click", () => {
  const checkboxes = Array.from(tbodyLinhasAvancada.querySelectorAll("input[type=checkbox]"));
  const linhasParaRemover = [];
  checkboxes.forEach((cb, index) => {
    if (cb.checked) linhasParaRemover.push(index);
  });

  // Remove do último para o primeiro para não afetar os índices
  for (let i = linhasParaRemover.length - 1; i >= 0; i--) {
    planilhaEditando.data.splice(linhasParaRemover[i], 1);
  }

  renderizarPlanilhaAvancada();
});

btnExcluirPlanilhaAvancada.addEventListener("click", () => {
  if (confirm("Tem certeza que deseja excluir esta planilha? Esta ação não pode ser desfeita.")) {
    const idx = blockEditando.items.findIndex(i => i.id === planilhaEditando.id);
    if (idx > -1) {
      blockEditando.items.splice(idx, 1);
      renderBoardContent();
      closeModalPlanilhaAvancada();
    }
  }
});

btnArquivarPlanilhaAvancada.addEventListener("click", () => {
  if (confirm("Tem certeza que deseja arquivar esta planilha?")) {
    const idx = blockEditando.items.findIndex(i => i.id === planilhaEditando.id);
    if (idx > -1) {
      blockEditando.items[idx].archived = true;
      renderBoardContent();
      closeModalPlanilhaAvancada();
    }
  }
});

formPlanilhaAvancada.addEventListener("submit", (e) => {
  e.preventDefault();
  const novoNome = document.getElementById("nomePlanilhaAvancada").value.trim();
  if (!novoNome) {
    alert("O nome da planilha é obrigatório");
    return;
  }
  planilhaEditando.name = novoNome;
  const idx = blockEditando.items.findIndex(i => i.id === planilhaEditando.id);
  if (idx > -1) {
    blockEditando.items[idx] = planilhaEditando;
    renderBoardContent();
    closeModalPlanilhaAvancada();
  }
});

// Função para renderizar modal de cartão
function renderCardModal(card) {
  const container = document.createElement("div");
  container.className = "space-y-4";

  // Input do título
  const titleLabel = document.createElement("label");
  titleLabel.className = "block text-xs font-semibold mb-1";
  titleLabel.textContent = "Título";
  const titleInput = document.createElement("input");
  titleInput.type = "text";
  titleInput.value = card.title;
  titleInput.className = "w-full rounded bg-[#2f4a11] border border-[#2f80ed] px-2 py-1 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#2f80ed]";
  titleInput.addEventListener("input", (e) => {
    card.title = e.target.value;
    renderBoardContent();
  });

  // Textarea da descrição
  const descLabel = document.createElement("label");
  descLabel.className = "block text-xs font-semibold mb-1";
  descLabel.textContent = "Descrição";
  const descTextarea = document.createElement("textarea");
  descTextarea.value = card.description || "";
  descTextarea.rows = 4;
  descTextarea.className = "w-full rounded bg-[#2f4a11] border border-[#2f80ed] px-2 py-1 text-white text-sm resize-none focus:outline-none focus:ring-1 focus:ring-[#2f80ed]";
  descTextarea.addEventListener("input", (e) => {
    card.description = e.target.value;
  });

  // Checklist
  const checklistLabel = document.createElement("label");
  checklistLabel.className = "block text-xs font-semibold mb-1";
  checklistLabel.textContent = "Checklist";
  const checklistContainer = document.createElement("div");
  checklistContainer.className = "space-y-1 max-h-40 overflow-auto";

  function renderChecklist() {
    checklistContainer.innerHTML = "";
    card.checklist.forEach((item, idx) => {
      const itemDiv = document.createElement("div");
      itemDiv.className = "flex items-center space-x-2";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = item.checked || false;
      checkbox.className = "cursor-pointer";
      checkbox.addEventListener("change", () => {
        card.checklist[idx].checked = checkbox.checked;
      });

      const textInput = document.createElement("input");
      textInput.type = "text";
      textInput.value = item.text || "";
      textInput.className = "flex-1 bg-[#2f4a11] border border-[#2f80ed] rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#2f80ed]";
      textInput.addEventListener("input", (e) => {
        card.checklist[idx].text = e.target.value;
      });

      const delBtn = document.createElement("button");
      delBtn.type = "button";
      delBtn.className = "text-red-600 hover:text-red-800 text-sm px-1 rounded";
      delBtn.title = "Remover item";
      delBtn.innerHTML = '<i class="fas fa-times"></i>';
      delBtn.addEventListener("click", () => {
        card.checklist.splice(idx, 1);
        renderChecklist();
      });

      itemDiv.appendChild(checkbox);
      itemDiv.appendChild(textInput);
      itemDiv.appendChild(delBtn);
      checklistContainer.appendChild(itemDiv);
    });
  }
  renderChecklist();

  const addChecklistBtn = document.createElement("button");
  addChecklistBtn.type = "button";
  addChecklistBtn.className = "mt-1 bg-[#6b7280]/40 hover:bg-[#6b7280]/60 rounded px-2 py-1 text-xs font-semibold flex items-center space-x-1";
  addChecklistBtn.innerHTML = '<i class="fas fa-plus"></i><span>Adicionar item</span>';
  addChecklistBtn.addEventListener("click", () => {
    card.checklist.push({ text: "", checked: false });
    renderChecklist();
  });

  container.appendChild(titleLabel);
  container.appendChild(titleInput);
  container.appendChild(descLabel);
  container.appendChild(descTextarea);
  container.appendChild(checklistLabel);
  container.appendChild(checklistContainer);
  container.appendChild(addChecklistBtn);

  modalContent.appendChild(container);
}

// Event listeners para menus
btnCreate.addEventListener("click", (e) => {
  e.stopPropagation();
  const isHidden = createMenu.classList.contains("hidden");
  if (isHidden) {
    const rect = btnCreate.getBoundingClientRect();
    createMenu.style.top = `${rect.bottom + window.scrollY + 4}px`;
    createMenu.style.left = `${rect.left + window.scrollX}px`;
    createMenu.classList.remove("hidden");
    btnCreate.setAttribute("aria-expanded", "true");
  } else {
    createMenu.classList.add("hidden");
    btnCreate.setAttribute("aria-expanded", "false");
  }
});

// Fechar menus ao clicar fora
document.addEventListener("click", () => {
  createMenu.classList.add("hidden");
  btnCreate.setAttribute("aria-expanded", "false");
  userSettingsMenu.classList.add("hidden");
  closeAllMenus();
});

// Função para renderizar o conteúdo do quadro
function renderBoardContent() {
  boardContent.innerHTML = "";
  if (!selectedBoardId) {
    boardTitle.textContent = "Selecione ou crie um quadro";
    return;
  }
  const board = boards.find((b) => b.id === selectedBoardId);
  if (!board) return;
  boardTitle.textContent = board.name;

  // Each block is a container of sheets and cards
  board.blocks.forEach((block) => {
    if (block.archived) return; // skip archived
    boardContent.appendChild(createBlockElement(block, board));
  });

  // Add new block button (versão simplificada)
  const addBlockBtn = document.createElement("button");
  addBlockBtn.className = "bg-[#6b7280]/40 hover:bg-[#6b7280]/60 rounded-md px-3 text-xs font-semibold flex items-center space-x-2 flex-shrink-0 select-none h-7";
  addBlockBtn.type = "button";
  addBlockBtn.innerHTML = `<i class="fas fa-plus"></i><span>Adicionar novo bloco</span>`;
  
  // Adiciona o evento de clique direto para criar novo bloco
  addBlockBtn.addEventListener("click", () => {
    addNewBlock(board);
  });

  boardContent.appendChild(addBlockBtn);
}

// Função para inicializar os dados
function initExampleData() {
  boards = [];
  selectedBoardId = null;
}

// Event listeners principais
addBoardBtn.addEventListener("click", () => {
  const newBoard = {
    id: generateId(),
    name: "Novo Quadro",
    blocks: [],
  };
  boards.push(newBoard);
  selectedBoardId = newBoard.id;
  renderBoardsList();
  renderBoardContent();
});

// Botão de configurações
btnSettings.addEventListener("click", (e) => {
  e.stopPropagation();
  const isHidden = settingsMenu.classList.contains("hidden");
  if (isHidden) {
    settingsMenu.classList.remove("hidden");
    btnSettings.setAttribute("aria-expanded", "true");
  } else {
    settingsMenu.classList.add("hidden");
    btnSettings.setAttribute("aria-expanded", "false");
  }
});

// Botão de alternância da barra lateral
sidebarToggleBtn.addEventListener("click", () => {
  sidebarCollapsed = !sidebarCollapsed;
  if (sidebarCollapsed) {
    sidebar.classList.add("sidebar-collapsed");
    sidebarToggleBtn.style.left = "0";
    sidebarToggleBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
  } else {
    sidebar.classList.remove("sidebar-collapsed");
    sidebarToggleBtn.style.left = "15rem"; // Ajuste conforme a largura da sua barra lateral
    sidebarToggleBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
  }
});

// Funções para manipulação de blocos
function addNewBlock(board) {
  const newBlock = {
    id: generateId(),
    name: "Novo Bloco",
    items: [],
    archived: false,
  };
  board.blocks.push(newBlock);
  renderBoardContent();
}

// Função para fechar o modal
function closeModal() {
  modal.classList.add("hidden");
  selectedItem = null;
  modalContent.innerHTML = "";
  btnDelete.classList.remove("hidden");
  btnArchive.classList.remove("hidden");
  btnMaximize.classList.remove("hidden");
  btnRestore.classList.add("hidden");
}

// Funções para gerenciar blocos, cartões e planilhas
function addNewSheetToBlock(block) {
  const newSheet = {
    id: generateId(),
    type: "sheet",
    name: "Nova Planilha",
    columns: [
      { name: "Data", type: "date" },
      { name: "Descrição", type: "texto" },
      { name: "Status", type: "checkbox" }
    ],
    data: [
      ["", "", false],
      ["", "", false],
      ["", "", false]
    ],
    archived: false,
  };
  block.items.push(newSheet);
  renderBoardContent();
  // Abre o modal avançado para edição imediata
  const selectedBoard = boards.find(b => b.blocks.includes(block));
  openModalPlanilhaAvancada(newSheet, block, selectedBoard);
}

function addNewCardToBlock(block) {
  const newCard = {
    id: generateId(),
    type: "card",
    title: "Novo Cartão Simples",
    description: "",
    checklist: [],
    archived: false,
    isNew: true // Flag para indicar que é um cartão novo
  };
  block.items.push(newCard);
  renderBoardContent();
}

// Event listeners do modal
btnCloseModal.addEventListener("click", closeModal);

// Modal maximize/restore
btnMaximize.addEventListener("click", () => {
  modal.querySelector("div").classList.add("fixed", "inset-0", "m-0", "max-w-full", "max-h-full", "rounded-none", "p-6", "overflow-auto");
  btnMaximize.classList.add("hidden");
  btnRestore.classList.remove("hidden");
});

btnRestore.addEventListener("click", () => {
  modal.querySelector("div").classList.remove("fixed", "inset-0", "m-0", "max-w-full", "max-h-full", "rounded-none", "p-6", "overflow-auto");
  btnMaximize.classList.remove("hidden");
  btnRestore.classList.add("hidden");
});

// Modal delete button
btnDelete.addEventListener("click", () => {
  if (!selectedItem) return;
  const { type, item, block, board } = selectedItem;
  if (confirm(`Tem certeza que deseja excluir ${type === "card" ? "este cartão" : "esta planilha"}? Essa ação não pode ser desfeita.`)) {
    const idx = block.items.findIndex(i => i.id === item.id);
    if (idx > -1) {
      block.items.splice(idx, 1);
      renderBoardContent();
      closeModal();
    }
  }
});

// Modal archive button
btnArchive.addEventListener("click", () => {
  if (!selectedItem) return;
  const { item } = selectedItem;
  if (confirm(`Tem certeza que deseja arquivar ${item.type === "card" ? "este cartão" : "esta planilha"}?`)) {
    item.archived = true;
    renderBoardContent();
    closeModal();
  }
});

// Inicializa a aplicação
initExampleData();