
import { FileItem } from '@/hooks/useFileManager';
import { X, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { isImageFile, isTextFile } from '@/lib/fileUtils';
import config from '../../config/config';
interface FilePreviewModalProps {
  file: FileItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const FilePreviewModal = ({
  file,
  isOpen,
  onClose,
}: FilePreviewModalProps) => {
  if (!file) return null;

  const renderPreview = () => {
    if (!file.extension) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
          <FileText className="h-16 w-16 mb-4" />
          <p>No preview available</p>
        </div>
      );
    }

    if (isImageFile(file.extension)) {
      return (
        <div className="flex items-center justify-center bg-muted/20 rounded-lg p-4">
          <img
            src={`${config.serverURL}/${file.path}`}
            alt={file.name}
            className="max-w-full max-h-96 rounded-lg"
          />
        </div>
      );
    }

    if (isTextFile(file.extension) && file.content) {
      return (
        <div className="bg-muted/20 rounded-lg p-4 max-h-96 overflow-auto">
          <pre className="text-sm whitespace-pre-wrap font-mono">
            {file.content}
          </pre>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
        <FileText className="h-16 w-16 mb-4" />
        <p>Preview not available for this file type</p>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{file.name}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {renderPreview()}
        </div>
      </DialogContent>
    </Dialog>
  );
};