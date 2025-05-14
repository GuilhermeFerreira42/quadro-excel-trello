
import { useApp } from '@/context/AppContext';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export const UserMenu = () => {
  const { data, updateSettings } = useApp();
  
  const handleToggleExpandBoard = () => {
    updateSettings({
      ...data.settings,
      expandirQuadro: !data.settings.expandirQuadro
    });
  };

  return (
    <div className="p-2 w-64">
      <h3 className="text-base font-semibold mb-3">Configurações</h3>
      
      <div className="flex items-center justify-between space-y-1">
        <Label htmlFor="expandir-quadro">
          Expandir quadro conforme o tamanho da planilha
        </Label>
        <Switch
          id="expandir-quadro"
          checked={data.settings.expandirQuadro}
          onCheckedChange={handleToggleExpandBoard}
        />
      </div>
      
      <div className="mt-4 pt-2 border-t border-gray-200 text-xs text-gray-500">
        Versão 1.0.0
      </div>
    </div>
  );
};
