import { LucideIcon } from "lucide-react";

export interface ContextMenuItem {
    label: string;
    icon?: LucideIcon;
    onClick?: (data: any) => void;
    children?: ContextMenuItem[];
    disabled?: boolean; // Alias for isDisabled

}

export interface ContextMenuProps {
    items: ContextMenuItem[];
    onItemClick: (item: ContextMenuItem) => void;
}

export interface ContextMenuHandle {
    show: (e: React.MouseEvent, data?: any) => void;
    hide: () => void;
}
