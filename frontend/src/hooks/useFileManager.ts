import { useState, useCallback, useEffect } from 'react'
import { toast } from 'sonner'
import Fetch from './Fetch'

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
    const [allItems, setAllItems] = useState([])
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
            // console.log(res)
            setFiles(res)
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
                ? { ...f, name: res.name }
                : f
        ))
        if (!res.success) {
            toast.error(res.message)
            return
        }
        toast.success(res.message)
    }, [files])

    const moveItems = useCallback(async (itemId: string, targetFolderId: string | null) => {
        const itemType = files.find(f => f.id === itemId)?.type
        const api = itemType === 'folder' ? `/move/folder/${targetFolderId}/${itemId}` : `/move/file/${targetFolderId}/${itemId}`;
        const res: any = await Fetch.put(api)
        if (!res.success) {
            toast.error(res.message)
            return
        }

        setFiles(prev => [
            ...prev.map(f =>
                f.id === itemId
                    ? { ...f, parentId: targetFolderId }
                    : f
            )
        ])
        toast.success(`${res.item.name} item moved successfully`)
    }, [files])

    const getItemsByFolder = useCallback(
        (folderId: string | null, { isTrash = false }: { isTrash?: boolean } = {}) => {
            return files.filter(f => f.parentId === folderId && f.isTrash === isTrash);
        },
        [files]
    )

    const getItemById = useCallback((itemId: string) => {
        return files.find(f => f.id === itemId)
    }, [files])

    const handleGetAllItems = async () => {
        const res = await Fetch.get('/all/items')
        setAllItems(res)
    }

    useEffect(() => {
        handleGetAllItems()
        const view = (localStorage.getItem('defaultView') as 'grid' | 'list') || 'grid'
        setViewMode(view)
    }, [])

    useEffect(() => {
        if (!currentFolder) return setbreadcumbs([])
        const selected = allItems.filter(f => f.type === 'folder' && f.id === currentFolder)

        setbreadcumbs(prev => {
            const updated = [...prev, ...selected]
            const unique = updated.filter(
                (item, index, self) => index === self.findIndex(f => f.id === item.id)
            )
            return unique
        })
    }, [currentFolder, allItems])

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
        allItems,
        setbreadcumbs
    }
}