import { useState, useEffect, useRef, useCallback } from 'react';
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
import config from '../config/config';

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
        allItems,
        // deleteItems: handleDelete,
        renameItem,
        moveItems,
        getItemsByFolder,
        breadcumbs,
        setbreadcumbs,
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

    async function handleDownload() {
        const Item = files.filter(f => f.id === contextMenuTargetId)
        const folderName = Item[0].name;
        const fileId = Item[0].id
        const type = Item[0].type

        const link = document.createElement('a')
        link.href = type === 'folder'
            ? `${config.serverURL}/download/folder/${folderName}`
            : `${config.serverURL}/download/file/${fileId}`
        link.setAttribute('download', `${folderName}.zip`)

        document.body.appendChild(link)
        link.click()
        link.remove()
    }

    // Handle rename button click
    function handleRename(newName: string) {
        const itemId = localStorage.getItem('targetId')
        if (itemId && newName) renameItem(itemId, newName)
    }

    // Handle move button click
    function handleMoveClick() {
        setIsMoveDialogOpen(true);
    }

    // Handle confirming the move
    function handleMoveConfirm(targetFolderId: string | null) {
        const itemsToMove: string = localStorage.getItem('targetId') || '';
        moveItems(itemsToMove, targetFolderId)
    }

    const handleBreadcrumbClick = useCallback(() => {
        setbreadcumbs(prev => {
            const index = prev.findIndex(f => f.id === currentFolder)
            if (index === -1) return prev // not found
            return prev.slice(0, index + 1) // keep only up to clicked one
        })
        setCurrentFolder(currentFolder)
    }, [currentFolder, setCurrentFolder, setbreadcumbs])

    // Get all folders for the move dialog
    const allFolders = allItems.filter(item => item.type === 'folder')

    useEffect(() => { handleBreadcrumbClick() }, [handleBreadcrumbClick])
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
                onDownload={handleDownload}
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