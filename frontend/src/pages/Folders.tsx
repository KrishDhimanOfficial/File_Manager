import { useFileManager } from '@/hooks/useFileManager';
import { FolderIcon, ChevronRight, FileIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { formatDate } from '@/lib/fileUtils';

const Folders = () => {
    const { files, setCurrentFolder } = useFileManager();
    const folders = files.filter(f => f.type === 'folder' && f.parentId === null);

    const getFolderItemCount = (folderId: string) => {
        return files.filter(f => f.parentId === folderId).length
    }

    return (
        <div className="min-h-screen bg-gradient-subtle">
            <div className="container mx-auto px-6 py-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">All Folders</h1>
                    <p className="text-muted-foreground">Browse and manage your folder structure</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {folders?.map((folder, index) => {
                        const itemCount = getFolderItemCount(folder.id);
                        return (
                            <motion.div
                                key={folder.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card
                                    className="cursor-pointer transition-all duration-200 hover:shadow-elegant hover:scale-105"
                                    onClick={() => {
                                        setCurrentFolder(folder.id);
                                        window.location.href = '/files';
                                    }}
                                >
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-3 rounded-lg bg-primary/10">
                                                    <FolderIcon className="h-6 w-6 text-primary" />
                                                </div>
                                                <div>
                                                    <CardTitle className="text-lg">{folder.name}</CardTitle>
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        {itemCount} {itemCount === 1 ? 'item' : 'items'}
                                                    </p>
                                                </div>
                                            </div>
                                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">
                                            Modified {formatDate(new Date(folder?.updatedAt))}
                                        </p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>

                {folders.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <FolderIcon className="h-20 w-20 text-muted-foreground mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No folders yet</h3>
                        <p className="text-muted-foreground">Create your first folder to get started</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Folders;