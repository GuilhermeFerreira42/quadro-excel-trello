
import { Button } from '@/components/ui/button';
import { UserMenu } from '@/components/UserMenu';
import { SidebarTrigger } from '@/components/ui/sidebar';

export const BoardHeader = () => {
  return (
    <header className="h-12 bg-[#026AA7] text-white flex items-center px-4 shadow-md z-10">
      <div className="flex items-center space-x-4 flex-1">
        <h1 className="text-lg font-bold">Calendário</h1>
        
        <div className="hidden sm:flex space-x-2">
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
            Quadros
          </Button>
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
            Recentes
          </Button>
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
            Favoritos
          </Button>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
          Criar
        </Button>
        <UserMenu />
      </div>
    </header>
  );
};
