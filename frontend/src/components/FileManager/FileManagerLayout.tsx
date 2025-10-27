import { ReactNode } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { FileManagerSidebar } from './FileManagerSidebar';

interface FileManagerLayoutProps {
  children: ReactNode;
}

export const FileManagerLayout = ({ children }: FileManagerLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-subtle">
        <FileManagerSidebar />
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};
