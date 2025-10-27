import { useState, useCallback, useEffect } from 'react';

interface Position {
    x: number;
    y: number;
}

export const useContextMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
    const [targetId, setTargetId] = useState<string | null>(null);

    const handleContextMenu = useCallback((e: React.MouseEvent, itemId?: string) => {
        e.preventDefault();
        setPosition({ x: e.clientX, y: e.clientY });
        setTargetId(itemId || null);
        setIsOpen(true);
    }, []);

    const closeMenu = useCallback(() => {
        setIsOpen(false);
        setTargetId(null);
    }, []);

    useEffect(() => {
        const handleClick = () => closeMenu();
        const handleScroll = () => closeMenu();

        if (isOpen) {
            document.addEventListener('click', handleClick);
            document.addEventListener('scroll', handleScroll, true);
        }

        return () => {
            document.removeEventListener('click', handleClick);
            document.removeEventListener('scroll', handleScroll, true);
        };
    }, [isOpen, closeMenu]);

    return {
        isOpen,
        position,
        targetId,
        handleContextMenu,
        closeMenu,
    };
}