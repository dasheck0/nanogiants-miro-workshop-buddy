import { useCallback, useState } from "react";

export const useModal = (initiallyIsOpen?: boolean) => {
    const [isOpen, setIsOpen] = useState(initiallyIsOpen ?? false);
    const open = useCallback(() => setIsOpen(true), []);
    const close = useCallback(() => setIsOpen(false), []);
    const toggle = useCallback(() => setIsOpen((isOpen) => !isOpen), []);

    return { isOpen, open, close, toggle }; 
};