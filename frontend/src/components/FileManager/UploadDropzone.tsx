import { useCallback, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UploadDropzoneProps {
    onUpload: (files: File[]) => void;
}

export const UploadDropzone = ({ onUpload }: UploadDropzoneProps) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragging(false);

            const files = Array.from(e.dataTransfer.files);
            if (files.length > 0) {
                onUpload(files);
            }
        },
        [onUpload]
    );

    return (
        <AnimatePresence>
            {isDragging && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-primary bg-card p-12 shadow-elegant">
                        <Upload className="h-16 w-16 text-primary" />
                        <div className="text-center">
                            <p className="text-2xl font-semibold">Drop files here</p>
                            <p className="text-muted-foreground">Release to upload</p>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};