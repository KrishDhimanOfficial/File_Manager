import { FileItem } from '@/hooks/useFileManager';
import { FileIcon, FolderIcon, Image, FileText, File, MoreVertical } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatBytes, formatDate } from '@/lib/fileUtils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface FileListProps {
  items: FileItem[];
  onItemClick: (item: FileItem) => void;
  onItemDoubleClick: (item: FileItem) => void;
  onContextMenu: (e: React.MouseEvent, item: FileItem) => void;
  selectedItems: string[];
}

const getFileIcon = (item: FileItem) => {
  if (item.type === 'folder') {
    return <FolderIcon className="h-5 w-5 text-primary" />;
  }

  switch (item.extension) {
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'webp':
      return <Image className="h-5 w-5 text-primary" />;
    case 'txt':
    case 'md':
    case 'doc':
    case 'docx':
      return <FileText className="h-5 w-5 text-primary" />;
    default:
      return <File className="h-5 w-5 text-muted-foreground" />;
  }
};

export const FileList = ({
  items,
  onItemClick,
  onItemDoubleClick,
  onContextMenu,
  selectedItems,
}: FileListProps) => {
  return (
    <div className="p-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12"></TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Modified</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, index) => {
            const isSelected = selectedItems.includes(item.id);
            return (
              <motion.tr
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.02 }}
                className={`
                  cursor-pointer transition-colors
                  ${isSelected ? 'bg-accent' : 'hover:bg-accent/50'}
                `}
                onClick={() => onItemClick(item)}
                onDoubleClick={() => onItemDoubleClick(item)}
                onContextMenu={(e) => onContextMenu(e, item)}
              >
                <TableCell>
                  {getFileIcon(item)}
                </TableCell>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell className="text-muted-foreground capitalize">
                  {item.type === 'folder' ? 'Folder' : item.extension || 'File'}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {item.type === 'file' && item.size ? formatBytes(item.size) : '—'}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(item.modifiedAt)}
                </TableCell>
                <TableCell>
                  <MoreVertical className="h-4 w-4 text-muted-foreground" />
                </TableCell>
              </motion.tr>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};