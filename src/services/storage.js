// Funções de armazenamento local
export function saveData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Erro ao salvar dados:', error);
    return false;
  }
}

export function loadData(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
    return null;
  }
}

export function deleteData(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Erro ao deletar dados:', error);
    return false;
  }
}

export function updateData(key, updateFn) {
  try {
    const data = loadData(key);
    if (data) {
      const updatedData = updateFn(data);
      return saveData(key, updatedData);
    }
    return false;
  } catch (error) {
    console.error('Erro ao atualizar dados:', error);
    return false;
  }
}
