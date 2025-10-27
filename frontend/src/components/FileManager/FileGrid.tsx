import { FileItem } from '@/hooks/useFileManager';
import { FileIcon, FolderIcon, Image, FileText, File } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatBytes, formatDate } from '@/lib/fileUtils';
import { Card } from '@/components/ui/card';

interface FileGridProps {
  items: FileItem[];
  onItemClick: (item: FileItem) => void;
  onItemDoubleClick: (item: FileItem) => void;
  onContextMenu: (e: React.MouseEvent, item: FileItem) => void;
  selectedItems: string[];
}

const getFileIcon = (item: FileItem) => {
  if (item.type === 'folder') {
    return <FolderIcon className="h-12 w-12 text-primary" />;
  }

  switch (item.extension) {
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'webp':
      return <Image className="h-12 w-12 text-primary" />;
    case 'txt':
    case 'md':
    case 'doc':
    case 'docx':
      return <FileText className="h-12 w-12 text-primary" />;
    default:
      return <File className="h-12 w-12 text-muted-foreground" />;
  }
};

export const FileGrid = ({
  items,
  onItemClick,
  onItemDoubleClick,
  onContextMenu,
  selectedItems,
}: FileGridProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-6">
      {items.map((item, index) => {
        const isSelected = selectedItems.includes(item.id);
        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
          >
            <Card
              className={`
                p-4 cursor-pointer transition-all duration-200
                hover:shadow-elegant hover:scale-105
                ${isSelected ? 'ring-2 ring-primary bg-accent' : 'hover:bg-accent/50'}
              `}
              onClick={() => onItemClick(item)}
              onDoubleClick={() => onItemDoubleClick(item)}
              onContextMenu={(e) => onContextMenu(e, item)}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="mb-2">
                  {getFileIcon(item)}
                </div>
                <p className="text-sm font-medium text-center truncate w-full" title={item.name}>
                  {item.name}
                </p>
                {item.type === 'file' && item.size && (
                  <p className="text-xs text-muted-foreground">
                    {formatBytes(item.size)}
                  </p>
                )}
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};