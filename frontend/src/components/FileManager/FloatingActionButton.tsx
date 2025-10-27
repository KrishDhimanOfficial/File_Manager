import { useState } from 'react';
import { Plus, FolderPlus, Upload, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface FloatingActionButtonProps {
  onNewFolder: () => void;
  onUpload: () => void;
}

export const FloatingActionButton = ({
  onNewFolder,
  onUpload,
}: FloatingActionButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    { icon: FolderPlus, label: 'New Folder', action: onNewFolder },
    { icon: Upload, label: 'Upload File', action: onUpload },
  ];

  return (
    <div className="fixed bottom-8 right-8 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="flex flex-col gap-3 mb-3"
          >
            {actions.map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
              >
                <Button
                  size="lg"
                  onClick={() => {
                    action.action();
                    setIsOpen(false);
                  }}
                  className="gap-3 shadow-elegant hover:shadow-xl transition-shadow"
                >
                  <action.icon className="h-5 w-5" />
                  <span>{action.label}</span>
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        size="lg"
        onClick={() => setIsOpen(!isOpen)}
        className="h-14 w-14 rounded-full shadow-elegant hover:shadow-xl transition-all hover:scale-110"
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <Plus className="h-6 w-6" />
        </motion.div>
      </Button>
    </div>
  );
};
