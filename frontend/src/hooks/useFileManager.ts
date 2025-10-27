import { useState, useCallback } from 'react'
import { toast } from 'sonner'

export interface FileItem {
    id: string
    name: string
    type: 'file' | 'folder'
    parentId: string | null
    size?: number
    extension?: string
    createdAt: Date
    modifiedAt: Date
    content?: string // For text files
}

// Initial mock data
const initialFiles: FileItem[] = [
    {
        id: '1',
        name: 'Documents',
        type: 'folder',
        parentId: null,
        createdAt: new Date('2024-01-01'),
        modifiedAt: new Date('2024-01-01'),
    },
    {
        id: '2',
        name: 'Images',
        type: 'folder',
        parentId: null,
        createdAt: new Date('2024-01-02'),
        modifiedAt: new Date('2024-01-02'),
    },
    {
        id: '3',
        name: 'Projects',
        type: 'folder',
        parentId: null,
        createdAt: new Date('2024-01-03'),
        modifiedAt: new Date('2024-01-03'),
    },
    {
        id: '4',
        name: 'README.md',
        type: 'file',
        parentId: null,
        size: 1024,
        extension: 'md',
        createdAt: new Date('2024-01-04'),
        modifiedAt: new Date('2024-01-04'),
        content: '# Welcome to File Manager\n\nThis is a modern file management application.',
    },
]

export const useFileManager = () => {
    const [files, setFiles] = useState<FileItem[]>(initialFiles)
    const [currentFolder, setCurrentFolder] = useState<string | null>(null)
    const [selectedItems, setSelectedItems] = useState<string[]>([])
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

    const createFolder = useCallback((name: string, parentId: string | null = null) => {
        const newFolder: FileItem = {
            id: Date.now().toString(),
            name,
            type: 'folder',
            parentId: parentId || currentFolder,
            createdAt: new Date(),
            modifiedAt: new Date(),
        }
        setFiles(prev => [...prev, newFolder])
        toast.success(`Folder "${name}" created successfully`)
        return newFolder
    }, [currentFolder])

    const uploadFile = useCallback((file: File, parentId: string | null = null) => {
        const newFile: FileItem = {
            id: Date.now().toString(),
            name: file.name,
            type: 'file',
            parentId: parentId || currentFolder,
            size: file.size,
            extension: file.name.split('.').pop(),
            createdAt: new Date(),
            modifiedAt: new Date(),
        }
        setFiles(prev => [...prev, newFile])
        toast.success(`File "${file.name}" uploaded successfully`)
        return newFile
    }, [currentFolder])


    const deleteItems = useCallback((itemIds: string[]) => {
        const deleteRecursive = (id: string): string[] => {
            const item = files.find(f => f.id === id)
            if (!item) return [id]

            if (item.type === 'folder') {
                const children = files.filter(f => f.parentId === id)
                return [id, ...children.flatMap(child => deleteRecursive(child.id))]
            }
            return [id]
        }

        const allIdsToDelete = itemIds.flatMap(deleteRecursive)
        setFiles(prev => prev.filter(f => !allIdsToDelete.includes(f.id)))
        setSelectedItems([])
        toast.success(`${itemIds.length} item(s) deleted successfully`)
    }, [files])

    const renameItem = useCallback((itemId: string, newName: string) => {
        setFiles(prev => prev.map(f =>
            f.id === itemId
                ? { ...f, name: newName, modifiedAt: new Date() }
                : f
        ))
        toast.success('Item renamed successfully')
    }, [])

    const moveItems = useCallback((itemIds: string[], targetFolderId: string | null) => {
        setFiles(prev => prev.map(f =>
            itemIds.includes(f.id)
                ? { ...f, parentId: targetFolderId, modifiedAt: new Date() }
                : f
        ))
        toast.success(`${itemIds.length} item(s) moved successfully`)
    }, [])

    const getItemsByFolder = useCallback((folderId: string | null) => {
        return files.filter(f => f.parentId === folderId)
    }, [files])

    const getItemById = useCallback((itemId: string) => {
        return files.find(f => f.id === itemId)
    }, [files])

    const getBreadcrumbs = useCallback((folderId: string | null): FileItem[] => {
        if (!folderId) return []
        const folder = files.find(f => f.id === folderId)
        if (!folder) return []
        return [...getBreadcrumbs(folder.parentId), folder]
    }, [files])

    return {
        files,
        currentFolder,
        setCurrentFolder,
        selectedItems,
        setSelectedItems,
        viewMode,
        setViewMode,
        createFolder,
        uploadFile,
        deleteItems,
        renameItem,
        moveItems,
        getItemsByFolder,
        getItemById,
        getBreadcrumbs,
    }
}