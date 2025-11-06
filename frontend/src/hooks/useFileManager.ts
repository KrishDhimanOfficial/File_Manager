import { useState, useCallback, useEffect } from 'react'
import { toast } from 'sonner'
import Fetch from './Fetch'
import { useContextMenu } from './useContextMenu'

export interface FileItem {
    id: string
    name: string
    type: 'file' | 'folder'
    parentId: string | null
    size?: number
    path?: string
    extension?: string
    createdAt: Date
    updatedAt: Date
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
        updatedAt: new Date('2024-01-01'),
    },
    {
        id: '2',
        name: 'Images',
        type: 'folder',
        parentId: null,
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02'),
    },
    {
        id: '3',
        name: 'Projects',
        type: 'folder',
        parentId: null,
        createdAt: new Date('2024-01-03'),
        updatedAt: new Date('2024-01-03'),
    },
    {
        id: '4',
        name: 'README.md',
        type: 'file',
        parentId: null,
        size: 1024,
        extension: 'md',
        createdAt: new Date('2024-01-04'),
        updatedAt: new Date('2024-01-04'),
        content: '# Welcome to File Manager\n\nThis is a modern file management application.',
    },
]

export const useFileManager = () => {
    const [files, setFiles] = useState([])
    const [currentFolder, setCurrentFolder] = useState<string | null>(null)
    const [selectedItems, setSelectedItems] = useState<string[]>([])
    const [breadcumbs, setbreadcumbs] = useState<Array<any>>([])
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

    const createFolder = useCallback(async (name: string, parentId: string | null = null) => {
        const res = await Fetch.post('/folder', { name, parentId: parentId || currentFolder, type: 'folder' })

        setFiles(prev => [...prev, res.folder])
        res.success ? toast.success(`Folder "${name}" created successfully`) : toast.error(res.message)
        return res.folder
    }, [currentFolder])

    const handleFolders = useCallback(async () => {
        try {
            const res = currentFolder
                ? await Fetch.get(`/folders/${currentFolder}`)
                : await Fetch.get(`/folders`)
            // console.table(res)
            setFiles(res), setbreadcumbs([])

            if (currentFolder) {
                const u: Array<any> = res[0]?.path.split('/')
                u.shift()
                u.pop()

                const base = u?.map((folder: any) => {
                    return {
                        name: folder,
                        id: res[0].parentId
                    }
                })
                setbreadcumbs(base)
            }
        } catch (error) {
            console.error(error);
        }

    }, [currentFolder])

    const trashItems = useCallback(async (id: string, isTrash: boolean) => {
        try {
            const res = await Fetch.patch(`/folder/${id}`, { isTrash })
            res.success && await handleFolders()

            res.success
                ? toast.success(res.success)
                : toast.error(res.error)
        } catch (error) {
            console.error(error)
        }
    }, [handleFolders])
    useEffect(() => { handleFolders() }, [currentFolder, handleFolders])

    const uploadFile = useCallback(async (file: File, parentId: string | null = null) => {
        const formData = new FormData()
        formData.append('file', file)
        const res = await Fetch.post(`/upload/data?parentId=${parentId || currentFolder}`, formData)
        // const newFile: FileItem = {
        //     id: Date.now().toString(),
        //     name: file.name,
        //     type: 'file',
        //     parentId: parentId || currentFolder,
        //     size: file.size,
        //     extension: file.name.split('.').pop(),
        //     createdAt: new Date(),
        //     updatedAt: new Date(),
        // }
        const newFile = res.file
        setFiles(prev => [...prev, newFile])

        if (!res.success) toast.error(res.message)
        toast.success(`File "${file.name}" uploaded successfully`)
        return res.file
    }, [currentFolder])

    const renameItem = useCallback(async (itemId: string, newName: string) => {
        const itemType = files.find(f => f.id === itemId)?.type
        const api = itemType === 'folder' ? `/folder/${itemId}` : `/upload/data/${itemId}`;
        const res = await Fetch.put(api, { name: newName })

        setFiles(prev => prev.map(f =>
            f.id === itemId
                ? { ...f, name: newName }
                : f
        ))
        if (!res.success) {
            toast.error(res.message)
            return
        }
        toast.success(res.message)
    }, [])

    const moveItems = useCallback((itemIds: string[], targetFolderId: string | null) => {
        setFiles(prev => prev.map(f =>
            itemIds.includes(f.id)
                ? { ...f, parentId: targetFolderId, updatedAt: new Date() }
                : f
        ))
        toast.success(`${itemIds.length} item(s) moved successfully`)
    }, [])

    const getItemsByFolder = useCallback(
        (folderId: string | null, { isTrash = false }: { isTrash?: boolean } = {}) => {
            return files.filter(f => f.parentId === folderId && f.isTrash === isTrash);
        },
        [files]
    );


    const getItemById = useCallback((itemId: string) => {
        return files.find(f => f.id === itemId)
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
        trashItems,
        renameItem,
        moveItems,
        getItemsByFolder,
        getItemById,
        breadcumbs,
    }
}