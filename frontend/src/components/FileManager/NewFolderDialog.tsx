import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface NewFolderDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (name: string) => void;
}

export const NewFolderDialog = ({
    isOpen,
    onClose,
    onConfirm,
}: NewFolderDialogProps) => {
    const [folderName, setFolderName] = useState('');

    const handleConfirm = () => {
        if (folderName.trim()) {
            onConfirm(folderName.trim());
            setFolderName('');
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Folder</DialogTitle>
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
                                    handleConfirm();
                                }
                            }}
                            autoFocus
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleConfirm} disabled={!folderName.trim()}>
                        Create
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}