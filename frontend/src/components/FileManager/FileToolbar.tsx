import { Search, Grid3x3, List, FolderPlus, Upload, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SidebarTrigger } from '@/components/ui/sidebar';

interface FileToolbarProps {
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onSearch: (query: string) => void;
  onNewFolder: () => void;
  onUpload: () => void;
}

export const FileToolbar = ({
  viewMode,
  onViewModeChange,
  onSearch,
  onNewFolder,
  onUpload,
}: FileToolbarProps) => {
  return (
    <div className="border-b border-border bg-card px-6 py-4">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search files and folders..."
              className="pl-10"
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onNewFolder}
            className="gap-2"
          >
            <FolderPlus className="h-4 w-4" />
            <span className="hidden sm:inline">New Folder</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onUpload}
            className="gap-2"
          >
            <Upload className="h-4 w-4" />
            <span className="hidden sm:inline">Upload</span>
          </Button>

          <div className="flex items-center gap-1 ml-2">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => onViewModeChange('grid')}
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => onViewModeChange('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
