import { motion, AnimatePresence } from 'framer-motion';
import {
  Download,
  Edit,
  Trash2,
  Copy,
  Scissors,
  FolderInput,
  Eye,
} from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface ContextMenuProps {
  isOpen: boolean;
  position: { x: number; y: number };
  onClose?: () => void;
  onRename?: () => void;
  onDelete?: () => void;
  onMove?: () => void;
  onView?: () => void;
  visible?: {
    rename?: boolean;
    delete?: boolean;
    move?: boolean;
    view?: boolean;
    copy?: boolean;
    download?: boolean;
    cut?: boolean;
  };
}

export const ContextMenu = ({
  isOpen,
  position,
  onClose,
  onRename,
  onDelete,
  onMove,
  onView,
  visible = {
    rename: true,
    delete: true,
    move: true,
    view: true,
    copy: true,
    download: true,
    cut: true,
  },
}: ContextMenuProps) => {
  const location = useLocation()
  // Simple function to handle clicking a menu item
  function handleMenuClick(action: (() => void) | undefined) {
    if (action) {
      action();
    }
    onClose();
  }

  // Don't show menu if not open
  if (!isOpen) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.1 }}
      className="fixed z-50 min-w-[200px] rounded-lg border border-border bg-popover shadow-elegant"
      style={{
        top: position.y,
        left: position.x,
      }}
    >
      <div className="p-1">
        {/* View button - only show if onView is provided */}
        {(onView && visible.view) && (
          <button
            onClick={() => handleMenuClick(onView)}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent"
          >
            <Eye className="h-4 w-4" />
            <span>View</span>
          </button>
        )}

        {/* Rename button */}
        {
          visible.rename && (
            <button
              onClick={() => handleMenuClick(onRename)}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent"
            >
              <Edit className="h-4 w-4" />
              <span>Rename</span>
            </button>
          )
        }

        {/* Copy button */}
        {visible.copy && (
          <button
            onClick={() => handleMenuClick(undefined)}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent"
          >
            <Copy className="h-4 w-4" />
            <span>Copy</span>
          </button>
        )}

        {/* Cut button */}
        {
          visible.cut && (
            <button
              onClick={() => handleMenuClick(undefined)}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent"
            >
              <Scissors className="h-4 w-4" />
              <span>Cut</span>
            </button>
          )
        }

        {/* Move button */}
        {
          visible.move && (
            <button
              onClick={() => handleMenuClick(onMove)}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent"
            >
              <FolderInput className="h-4 w-4" />
              <span>Move to...</span>
            </button>
          )
        }

        {/* Download button */}
        {
          visible.download && (
            <button
              onClick={() => handleMenuClick(undefined)}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent"
            >
              <Download className="h-4 w-4" />
              <span>Download</span>
            </button>
          )
        }

        {/* Delete button - styled as danger */}
        {
          visible.delete && (
            <button
              onClick={() => handleMenuClick(onDelete)}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
              <span>
                {location.pathname.includes('trash') ? 'Restore' : 'Move to Trash'}
              </span>
            </button>
          )
        }
      </div>
    </motion.div>
  );
};
