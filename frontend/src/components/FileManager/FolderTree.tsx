import { FolderIcon } from "lucide-react"

const FolderTree = ({ folders, parentId = null, selectedFolder, setSelectedFolder }) => {
    return (
        <div className="pl-3">
            {folders
                .filter((folder: any) => folder.parentId === parentId)
                .map((folder: any) => {
                    const isFolderSelected = selectedFolder === folder.id
                    return (
                        <div key={folder.id}>
                            <button
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

                            {/* recursively render subfolders */}
                            <FolderTree
                                folders={folders}
                                parentId={folder.id}
                                selectedFolder={selectedFolder}
                                setSelectedFolder={setSelectedFolder}
                            />
                        </div>
                    )
                })}
        </div>
    )
}

export default FolderTree