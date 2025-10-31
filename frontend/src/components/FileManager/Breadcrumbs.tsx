import { FileItem } from '@/hooks/useFileManager';
import { ChevronRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BreadcrumbsProps {
    breadcrumbs: FileItem[];
    onNavigate: (folderId: string | null) => void;
}

export const Breadcrumbs = ({ breadcrumbs, onNavigate }: BreadcrumbsProps) => {
    return (
        <div className="flex items-center gap-1 px-6 py-3 border-b border-border bg-card/50">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate(null)}
                className="gap-2 h-8"
            >
                <Home className="h-4 w-4" />
                <span>Home</span>
            </Button>

            {breadcrumbs.map((crumb, i) => (
                <div key={i} className="flex items-center gap-1">
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            onNavigate(crumb.id)
                            console.log(crumb.id);
                        }}
                        className="h-8"
                    >
                        {crumb.name}
                    </Button>
                </div>
            ))}
        </div>
    );
}