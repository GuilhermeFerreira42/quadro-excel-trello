
import { BoardHeader } from '@/components/BoardHeader';
import { BoardContainer } from '@/components/BoardContainer';
import { EditModal } from '@/components/EditModal';
import { AddItemMenu } from '@/components/AddItemMenu';
import { Sidebar } from '@/components/Sidebar';
import { AppProvider } from '@/context/AppContext';
import { useEffect } from 'react';

const Index = () => {
  // Update page title
  useEffect(() => {
    document.title = "Calendário - Sua organização flexível";
  }, []);

  return (
    <AppProvider>
      <div className="h-screen flex flex-col">
        <BoardHeader />
        <div className="flex-1 flex overflow-hidden">
          <Sidebar />
          <BoardContainer />
        </div>
        <EditModal />
        <AddItemMenu />
      </div>
    </AppProvider>
  );
};

export default Index;
