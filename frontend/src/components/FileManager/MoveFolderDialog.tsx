import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FolderIcon, Home } from 'lucide-react';
import { FileItem } from '@/hooks/useFileManager';

interface MoveFolderDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (targetFolderId: string | null) => void;
    folders: FileItem[];
    currentItemIds: string[];
}

export const MoveFolderDialog = ({
    isOpen,
    onClose,
    onConfirm,
    folders,
    currentItemIds,
}: MoveFolderDialogProps) => {
    // Which folder is selected (null means root folder)
    const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

    // Reset selection when dialog closes
    useEffect(() => {
        if (!isOpen) {
            setSelectedFolder(null);
        }
    }, [isOpen]);

    // Handle clicking the "Move Here" button
    function handleMoveClick() {
        onConfirm(selectedFolder);
        onClose();
    }

    // Filter out folders that user is trying to move
    // (can't move a folder into itself)
    const availableFolders: FileItem[] = [];
    for (let i = 0; i < folders.length; i++) {
        const folder = folders[i];
        let canUseThisFolder = true;

        // Check if this folder is being moved
        for (let j = 0; j < currentItemIds.length; j++) {
            if (folder.id === currentItemIds[j]) {
                canUseThisFolder = false;
                break;
            }
        }

        if (canUseThisFolder) {
            availableFolders.push(folder);
        }
    }

    // Check if root folder is selected
    const isRootSelected = selectedFolder === null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Move to Folder</DialogTitle>
                    <DialogDescription>
                        Select a destination folder for the selected item(s)
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="h-[300px] rounded-md border">
                    <div className="p-2 space-y-1">
                        {/* Root folder option */}
                        <button
                            onClick={() => setSelectedFolder(null)}
                            className={
                                isRootSelected
                                    ? 'flex items-center gap-3 w-full px-3 py-2 rounded-md transition-colors text-left bg-accent text-accent-foreground'
                                    : 'flex items-center gap-3 w-full px-3 py-2 rounded-md transition-colors text-left hover:bg-accent/50'
                            }
                        >
                            <Home className="h-5 w-5" />
                            <span className="font-medium">Root Folder</span>
                        </button>

                        {/* Show message if no folders available */}
                        {availableFolders.length === 0 && (
                            <div className="text-sm text-muted-foreground text-center py-8">
                                No folders available
                            </div>
                        )}

                        {/* List all available folders */}
                        {availableFolders.map((folder) => {
                            const isFolderSelected = selectedFolder === folder.id;

                            return (
                                <button
                                    key={folder.id}
                                    onClick={() => setSelectedFolder(folder.id)}
                                    className={
                                        isFolderSelected
                                            ? 'flex items-center gap-3 w-full px-3 py-2 rounded-md transition-colors text-left bg-accent text-accent-foreground'
                                            : 'flex items-center gap-3 w-full px-3 py-2 rounded-md transition-colors text-left hover:bg-accent/50'
                                    }
                                >
                                    <FolderIcon className="h-5 w-5" />
                                    <span>{folder.name}</span>
                                </button>
                            );
                        })}
                    </div>
                </ScrollArea>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleMoveClick}>
                        Move Here
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}