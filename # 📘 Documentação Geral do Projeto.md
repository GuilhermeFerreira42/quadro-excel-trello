# 📘 Documentação Geral do Projeto “Calendário” (Trello + Excel)

## 🧩 Visão Geral

Estamos desenvolvendo um sistema chamado **Calendário**, que é uma fusão entre um **gerenciador visual de tarefas (estilo Trello)** e a **flexibilidade de planilhas (estilo Excel)**.

O objetivo é criar um ambiente visual, personalizável e funcional, onde o usuário possa organizar todas as áreas da sua vida em blocos visuais com planilhas dinâmicas e cartões simples.

Este sistema serve como uma plataforma de produtividade pessoal, mas pode ser adaptado futuramente para equipes, projetos, estudos ou metas de vida.

---

## ✅ Funcionalidades Implementadas

### 1. Estrutura visual estilo Trello

* Implementamos um **quadro central** com colunas (blocos) dispostos horizontalmente.
* Cada bloco representa uma área da vida ou tema específico (ex: **SAÚDE**, **DINHEIRO**, **ESPIRITUAL**).
* Blocos são arrastáveis (drag-and-drop).
* Layout responsivo e fluído, com interface moderna utilizando Tailwind CSS.

### 2. Blocos dinâmicos

* Cada **bloco** pode conter:

  * Uma ou mais **planilhas personalizadas**.
  * Vários **cartões simples** (tarefas, metas ou anotações rápidas).
* Os blocos têm **altura dinâmica**, se adaptando ao conteúdo.

  * Vazio → tamanho mínimo com botão "Adicionar conteúdo".
  * Com planilha/cartão → cresce proporcionalmente ao conteúdo.
* Cada bloco possui **menu de três pontinhos (`...`)** com ações de:

  * Editar nome
  * Excluir bloco
  * (em breve) Duplicar bloco

### 3. Planilhas personalizadas dentro dos blocos

* É possível adicionar planilhas dentro de qualquer bloco.
* As planilhas têm estrutura semelhante ao Excel:

  * Suporte a **colunas dinâmicas**
  * Suporte a **linhas editáveis**
  * Cada célula pode ter um **tipo de dado personalizado**:

    * Data
    * Texto
    * Número
    * Moeda (R\$)
    * Peso (kg)
    * Checklist
    * Tempo, entre outros
* O usuário pode adicionar colunas e linhas conforme desejar.
* As células são editáveis diretamente.

### 4. Cartões simples

* Além das planilhas, o usuário pode adicionar **cartões simples**.
* São pequenos cards com texto, prazos, anotações rápidas ou lembretes.
* Representam ações rápidas ou microtarefas.

### 5. Menu contextual de conteúdo

* Ao clicar no botão “Adicionar novo conteúdo” dentro de um bloco, o usuário pode escolher:

  * Criar **nova planilha**
  * Criar **novo cartão simples**
* Corrigimos o posicionamento do menu: agora ele aparece **perto do botão clicado**, sem exigir scroll.

### 6. Barra lateral (menu lateral esquerdo)

* A barra lateral lista os **quadros ativos** do sistema.
* Cada quadro pode conter múltiplos blocos.
* Cada item da barra lateral agora tem **três pontinhos (`...`)** para ações:

  * Editar nome do quadro
  * Excluir quadro
* A barra lateral é **retrátil por completo**:

  * Ao clicar no botão de retração, ela **desaparece completamente**.
  * Resta apenas um botão (`>` ou `<`) que permite **expandir novamente a barra lateral**.

### 7. Pop-up de edição

* Criamos uma **modal (janela pop-up)** para editar o conteúdo das planilhas.
* Essa modal é acionada ao clicar na planilha.
* Possui:

  * Campo para editar o nome da planilha
  * Botões para adicionar colunas e linhas
  * Estrutura de tabela com tipos personalizados de célula
  * Botões “Salvar” e “Cancelar”

---

## 🧪 Melhorias e ajustes finais aplicados

* Redução do tamanho do botão “Adicionar novo bloco” (agora tem altura padrão de linha).
* Altura dos blocos ajustada para se adaptar ao conteúdo real (sem ocupar a tela toda).
* Corrigido o menu “Adicionar novo conteúdo” para aparecer ao lado do botão (não mais no rodapé da tela).
* Menu de três pontinhos adicionado tanto em **blocos do quadro** quanto nos **quadros da barra lateral**.
* Nome do usuário no topo agora será **editável** (em fase de implementação).
* Layout refinado com foco em legibilidade, clareza e personalização.

---

## 📌 Ponto central do conceito: Trello + Excel

O sistema **Calendário** é uma evolução do Trello e do Excel em um só ambiente.
A diferença principal é:

* No Trello tradicional: você só tem **cartões com listas de tarefas**.
* No Excel: você tem **planilhas super flexíveis**, mas sem interface visual clara.

**No Calendário**, você une o melhor dos dois mundos:

* Visual de blocos (como quadros do Trello)
* Cada bloco pode conter **planilhas avançadas**
* Organização por tema: SAÚDE, FINANÇAS, ESPIRITUALIDADE, etc.
* Uso pessoal, mas com potencial para escalar para equipes e projetos colaborativos.

---

## 🧭 O que ainda pode ser adicionado

1. **Sistema de login/usuário** (opcional)
2. **Salvar estado local ou via backend**
3. **Exportar planilhas para Excel ou PDF**
4. **Visualização por calendário real (com datas e prazos visíveis)**
5. **Animações de transição (abrir pop-up, colapsar bloco, etc.)**
6. **Temas escuros e leves**
7. **Checklist dentro de cartões simples**
8. **Sistema de metas por categoria com progresso visual**


