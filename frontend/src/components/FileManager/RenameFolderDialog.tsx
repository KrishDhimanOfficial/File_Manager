import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface RenameFolderDialog {
    isOpen: boolean
    onOpenChange: any
    onConfirm: (name: string) => void
}

export const RenameFolderDialog = React.memo((
    {
        isOpen,
        onOpenChange,
        onConfirm,
    }: RenameFolderDialog) => {
    const [folderName, setFolderName] = useState('')

    const handleConfirm = () => {
        if (folderName.trim()) {
            onConfirm(folderName.trim())
            setFolderName('')
            localStorage.removeItem("targetId")
            onOpenChange(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Rename Folder</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="folder-name">Folder Name</Label>
                        <Input
                            id="folder-name"
                            placeholder="Enter folder name..."
                            value={folderName}
                            onChange={(e) => setFolderName(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleConfirm()
                                }
                            }}
                            autoFocus
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onOpenChange}>
                        Cancel
                    </Button>
                    <Button onClick={handleConfirm} disabled={!folderName.trim()}>
                        Rename
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
})