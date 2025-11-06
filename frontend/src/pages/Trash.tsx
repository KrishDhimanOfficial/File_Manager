import { useState, useRef, useEffect } from 'react';
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
import { useQuery } from '@tanstack/react-query';
import AlertBox from '@/components/FileManager/AlertBox';

const Trash = () => {
    const {
        files,
        currentFolder,
        setCurrentFolder,
        selectedItems,
        setSelectedItems,
        viewMode,
        setViewMode,
        createFolder,
        trashItems,
        uploadFile,
        renameItem,
        moveItems,
        getItemsByFolder,
        breadcumbs
    } = useFileManager();

    const {
        isOpen: isContextMenuOpen,
        position: contextMenuPosition,
        targetId: contextMenuTargetId,
        handleContextMenu,
        closeMenu,
    } = useContextMenu();
    const [searchQuery, setSearchQuery] = useState('')
    const { data: trashfiles, refetch } = useQuery({
        queryKey: ['trash-folders'],
        queryFn: async () => await Fetch.get(`/trash/folders`),
    })
    const [targetId, setTargetId] = useState<string | null>(null)
    const [previewFile, setPreviewFile] = useState<FileItem | null>(null)
    const [isAlertOpen, setIsAlertOpen] = useState(false)
    const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = useState(false)
    const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const currentItems = getItemsByFolder(currentFolder, { isTrash: true })

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
        setTargetId(item.id)
        setIsAlertOpen(!isAlertOpen)
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
    // function handleFileDrop(files: File[]) {
    //     for (let i = 0; i < files.length; i++) {
    //         uploadFile(files[i]);
    //     }
    // }

    async function restoredTrash() {
        targetId && trashItems(targetId, false)
        refetch()
        return
    }

    // Handle rename button click
    // function handleRename() {
    //     let itemId = contextMenuTargetId;
    //     if (!itemId && selectedItems.length > 0) {
    //         itemId = selectedItems[0];
    //     }

    //     if (itemId) {
    //         const newName = prompt('Enter new name:');
    //         if (newName) {
    //             renameItem(itemId, newName);
    //         }
    //     }
    // }

    // Handle move button click
    // function handleMoveClick() {
    //     setIsMoveDialogOpen(true);
    // }

    // // Handle confirming the move
    // function handleMoveConfirm(targetFolderId: string | null) {
    //     let itemsToMove: string[] = [];

    //     if (contextMenuTargetId) {
    //         itemsToMove = [contextMenuTargetId];
    //     } else {
    //         itemsToMove = selectedItems;
    //     }

    //     if (itemsToMove.length > 0) {
    //         moveItems(itemsToMove, targetFolderId);
    //         setSelectedItems([]);
    //     }
    // }

    // // // Get all folders for the move dialog
    // const allFolders = files.filter(item => item.type === 'folder');

    return (
        <div className="flex flex-col h-screen" onDragOver={(e) => e.preventDefault()}>
            <AlertBox
                title="In trash"
                desc="To open this, restore it first."
                open={isAlertOpen}
                onOpenChange={() => setIsAlertOpen(!isAlertOpen)}
                onCancel={() => setIsAlertOpen(!isAlertOpen)}
                onContinue={restoredTrash}
            />

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
                {trashfiles?.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                        <p className="text-lg">No files or folders</p>
                        <p className="text-sm">Create a new folder or upload files to get started</p>
                    </div>
                ) : viewMode === 'grid' ? (
                    <FileGrid
                        items={trashfiles}
                        onItemClick={handleItemClick}
                        onItemDoubleClick={handleItemDoubleClick}
                        onContextMenu={(e, item) => handleContextMenu(e, item.id)}
                        selectedItems={selectedItems}
                    />
                ) : (
                    <FileList
                        items={trashfiles}
                        onItemClick={handleItemClick}
                        onItemDoubleClick={handleItemDoubleClick}
                        onContextMenu={(e, item) => handleContextMenu(e, item.id)}
                        selectedItems={selectedItems}
                    />
                )}
            </div>

            {/* <ContextMenu
                isOpen={isContextMenuOpen}
                visible={{ delete: true }}
                position={contextMenuPosition}
                onClose={closeMenu}
                // onRename={handleRename}
                onDelete={updateTrash}
                // onMove={handleMoveClick}
                onView={() => {
                    const item = contextMenuTargetId
                        ? currentItems.find(i => i.id === contextMenuTargetId)
                        : null;
                    if (item?.type === 'file') {
                        setPreviewFile(item);
                    }
                }}
            /> */}
            {/* 
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

            <MoveFolderDialog
                isOpen={isMoveDialogOpen}
                onClose={() => setIsMoveDialogOpen(false)}
                onConfirm={handleMoveConfirm}
                folders={allFolders}
                currentItemIds={contextMenuTargetId ? [contextMenuTargetId] : selectedItems}
            />

            <UploadDropzone onUpload={handleFileDrop} /> */}

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

export default Trash;