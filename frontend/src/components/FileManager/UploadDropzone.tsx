import { useEffect, useState } from 'react'
import { Upload } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface UploadDropzoneProps {
    onUpload: (files: File[]) => void
}

export const UploadDropzone = ({ onUpload }: UploadDropzoneProps) => {
    const [isDragging, setIsDragging] = useState(false)

    useEffect(() => {
        function handleDragEnter(e: DragEvent) {
            e.preventDefault()
            if (e.dataTransfer?.types.includes('Files')) {
                setIsDragging(true)
            }
        }

        function handleDragOver(e: DragEvent) {
            e.preventDefault()
            if (e.dataTransfer?.types.includes('Files')) {
                setIsDragging(true)
            }
        }

        function handleDragLeave(e: DragEvent) {
            e.preventDefault()
            // Only hide if leaving the window
            if (e.clientX === 0 && e.clientY === 0) {
                setIsDragging(false)
            }
        }

        function handleDrop(e: DragEvent) {
            e.preventDefault()
            setIsDragging(false)

            const files = Array.from(e.dataTransfer?.files || [])
            if (files.length > 0) {
                onUpload(files)
            }
        }

        // Add listeners to window to catch drag from system
        window.addEventListener('dragenter', handleDragEnter)
        window.addEventListener('dragover', handleDragOver)
        window.addEventListener('dragleave', handleDragLeave)
        window.addEventListener('drop', handleDrop)

        return () => {
            window.removeEventListener('dragenter', handleDragEnter)
            window.removeEventListener('dragover', handleDragOver)
            window.removeEventListener('dragleave', handleDragLeave)
            window.removeEventListener('drop', handleDrop)
        }
    }, [onUpload])

    return (
        <AnimatePresence onExitComplete={() => setIsDragging(false)}>
            {isDragging && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm pointer-events-none"
                >
                    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-primary bg-card p-12 shadow-lg">
                        <Upload className="h-16 w-16 text-primary" />
                        <div className="text-center">
                            <p className="text-2xl font-semibold">Drop files here</p>
                            <p className="text-muted-foreground">Release to upload</p>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}