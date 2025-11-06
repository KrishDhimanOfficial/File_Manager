import { useState, useEffect, useRef } from 'react';
import { useFileManager } from '@/hooks/useFileManager';
import { useContextMenu } from '@/hooks/useContextMenu';
import { FileToolbar } from '@/components/FileManager/FileToolbar';
import { FileGrid } from '@/components/FileManager/FileGrid';
import { FileList } from '@/components/FileManager/FileList';
import { Breadcrumbs } from '@/components/FileManager/Breadcrumbs';
import { ContextMenu } from '@/components/FileManager/ContextMenu';
import { FilePreviewModal } from '@/components/FileManager/FilePreviewModal';
import { NewFolderDialog } from '@/components/FileManager/NewFolderDialog';
import { MoveFolderDialog } from '@/components/FileManager/MoveFolderDialog';
import { UploadDropzone } from '@/components/FileManager/UploadDropzone';
import { FloatingActionButton } from '@/components/FileManager/FloatingActionButton';
import { FileItem } from '@/hooks/useFileManager';
import { toast } from 'sonner';
import Fetch from '@/hooks/Fetch';
import { RenameFolderDialog } from '@/components/FileManager/RenameFolderDialog';

const Files = () => {
    const {
        files,
        currentFolder,
        setCurrentFolder,
        selectedItems,
        setSelectedItems,
        viewMode,
        setViewMode,
        createFolder,
        uploadFile,
        trashItems,
        // deleteItems: handleDelete,
        renameItem,
        moveItems,
        getItemsByFolder,
        breadcumbs
        // getBreadcrumbs,
    } = useFileManager();

    const {
        isOpen: isContextMenuOpen,
        position: contextMenuPosition,
        targetId: contextMenuTargetId,
        handleContextMenu,
        closeMenu,
    } = useContextMenu();
    const [searchQuery, setSearchQuery] = useState('');
    const [previewFile, setPreviewFile] = useState<FileItem | null>(null);
    const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false)
    const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = useState(false);
    const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const currentItems = getItemsByFolder(currentFolder);
    const filteredItems = searchQuery
        ? currentItems.filter(item =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : currentItems;

    // const breadcrumbs = getBreadcrumbs(currentFolder);

    // Handle clicking on an item (select/deselect)
    function handleItemClick(item: FileItem) {
        const isAlreadySelected = selectedItems.includes(item.id);

        if (isAlreadySelected) {
            // Remove from selection
            const newSelection = selectedItems.filter(id => id !== item.id);
            setSelectedItems(newSelection);
        } else {
            // Add to selection
            setSelectedItems([item.id]);
        }
    }

    // Handle double clicking an item (open folder or preview file)
    function handleItemDoubleClick(item: FileItem) {
        if (item.type === 'folder') {
            // Open the folder
            setCurrentFolder(item.id);
            setSelectedItems([]);
        } else {
            // Preview the file
            setPreviewFile(item);
        }
    }

    // Handle upload button click
    function handleUpload() {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    }

    // Handle when user selects files from their computer
    function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
        const fileList = e.target.files;
        if (!fileList) return;

        // Upload each file
        for (let i = 0; i < fileList.length; i++) {
            const file = fileList[i];
            uploadFile(file);
        }

        // Reset the input
        if (e.target) {
            e.target.value = '';
        }
    }

    // Handle dropping files
    function handleFileDrop(files: File[]) {
        for (let i = 0; i < files.length; i++) {
            uploadFile(files[i]);
        }
    }

    // Handle delete button click
    async function updateTrash() {
        contextMenuTargetId && trashItems(contextMenuTargetId, true)
    }

    // Handle rename button click
    function handleRename(newName: string) {
        const itemId = localStorage.getItem('targetId')
        if (itemId && newName) renameItem(itemId, newName)
        // let itemId = contextMenuTargetId;
        // if (!itemId && selectedItems.length > 0) {
        //     itemId = selectedItems[0];
        // }

        // if (itemId) {
        //     const newName = prompt('Enter new name:');
        //     if (newName) {
        //         renameItem(itemId, newName);
        //     }
        // }
    }

    // Handle move button click
    function handleMoveClick() {
        setIsMoveDialogOpen(true);
    }

    // Handle confirming the move
    function handleMoveConfirm(targetFolderId: string | null) {
        let itemsToMove: string[] = [];

        if (contextMenuTargetId) {
            itemsToMove = [contextMenuTargetId];
        } else {
            itemsToMove = selectedItems;
        }

        if (itemsToMove.length > 0) {
            moveItems(itemsToMove, targetFolderId);
            setSelectedItems([]);
        }
    }

    // Get all folders for the move dialog
    const allFolders = files.filter(item => item.type === 'folder');

    return (
        <div className="flex flex-col h-screen" onDragOver={(e) => e.preventDefault()}>
            <FileToolbar
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                onSearch={setSearchQuery}
                onNewFolder={() => setIsNewFolderDialogOpen(true)}
                onUpload={handleUpload}
            />

            <Breadcrumbs
                breadcrumbs={breadcumbs}
                onNavigate={setCurrentFolder}
            />

            <div className="flex-1 overflow-auto">
                {filteredItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                        <p className="text-lg">No files or folders</p>
                        <p className="text-sm">Create a new folder or upload files to get started</p>
                    </div>
                ) : viewMode === 'grid' ? (
                    <FileGrid
                        items={filteredItems}
                        onItemClick={handleItemClick}
                        onItemDoubleClick={handleItemDoubleClick}
                        onContextMenu={(e, item) => handleContextMenu(e, item.id)}
                        selectedItems={selectedItems}
                    />
                ) : (
                    <FileList
                        items={filteredItems}
                        onItemClick={handleItemClick}
                        onItemDoubleClick={handleItemDoubleClick}
                        onContextMenu={(e, item) => handleContextMenu(e, item.id)}
                        selectedItems={selectedItems}
                    />
                )}
            </div>

            <ContextMenu
                targetId={contextMenuTargetId}
                isOpen={isContextMenuOpen}
                position={contextMenuPosition}
                onClose={closeMenu}
                onRename={() => setIsRenameDialogOpen(true)}
                onDelete={updateTrash}
                onMove={handleMoveClick}
                onView={() => {
                    const item = contextMenuTargetId
                        ? currentItems.find(i => i.id === contextMenuTargetId)
                        : null;
                    if (item?.type === 'file') {
                        setPreviewFile(item);
                    }
                }}
            />

            <FilePreviewModal
                file={previewFile}
                isOpen={!!previewFile}
                onClose={() => setPreviewFile(null)}
            />

            <NewFolderDialog
                isOpen={isNewFolderDialogOpen}
                onClose={() => setIsNewFolderDialogOpen(false)}
                onConfirm={createFolder}
            />

            <RenameFolderDialog
                isOpen={isRenameDialogOpen}
                onOpenChange={() => setIsRenameDialogOpen(!isRenameDialogOpen)}
                onConfirm={handleRename}
            />

            <MoveFolderDialog
                isOpen={isMoveDialogOpen}
                onClose={() => setIsMoveDialogOpen(false)}
                onConfirm={handleMoveConfirm}
                folders={allFolders}
                currentItemIds={contextMenuTargetId ? [contextMenuTargetId] : selectedItems}
            />

            <UploadDropzone onUpload={handleFileDrop} />

            <FloatingActionButton
                onNewFolder={() => setIsNewFolderDialogOpen(true)}
                onUpload={handleUpload}
            />

            <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleFileSelect}
            />
        </div>
    );
};

export default Files;