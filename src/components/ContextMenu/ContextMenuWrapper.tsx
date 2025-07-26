import React, {
    useState,
    useRef,
    useEffect,
    useLayoutEffect,
    forwardRef,
    useImperativeHandle,
} from "react";
import ReactDOM from "react-dom";
import ContextMenu from "./ContextMenu";
import { ContextMenuItem, ContextMenuHandle } from "./types";

interface WrapperProps {
    items: ContextMenuItem[];
}

const ContextMenuWrapper = forwardRef<ContextMenuHandle, WrapperProps>(
    ({ items }, ref) => {
        const menuRef = useRef<HTMLDivElement>(null);
        const [visible, setVisible] = useState(false);
        const [position, setPosition] = useState({ x: 0, y: 0 });
        const [contextData, setContextData] = useState<any>(null);
        const [requestedPos, setRequestedPos] = useState<{ x: number; y: number } | null>(null);

        useImperativeHandle(ref, () => ({
            show: (e, data) => {
                e.preventDefault();

                setContextData(data);
                setRequestedPos({ x: e.clientX, y: e.clientY }); // client coords
                setVisible(true);
            },
            hide: () => setVisible(false),
        }));

        useLayoutEffect(() => {
            if (visible && requestedPos && menuRef.current) {
                const menu = menuRef.current;
                const menuWidth = menu.offsetWidth;
                const menuHeight = menu.offsetHeight;

                let posX = requestedPos.x;
                let posY = requestedPos.y;

                if (posX + menuWidth > window.innerWidth) {
                    posX = window.innerWidth - menuWidth;
                }

                if (posY + menuHeight > window.innerHeight) {
                    posY = window.innerHeight - menuHeight;
                }

                setPosition({ x: posX, y: posY });
                setRequestedPos(null);
            }
        }, [visible, requestedPos]);

        useEffect(() => {
            const handleClick = () => setVisible(false);
            document.addEventListener("click", handleClick);
            return () => document.removeEventListener("click", handleClick);
        }, []);

        const handleItemClick = (item: ContextMenuItem) => {
            item.onClick?.(contextData);
            setVisible(false);
        };

        if (!visible) return null;

        // Portal to body to avoid container positioning issues
        return ReactDOM.createPortal(
            <div
                ref={menuRef}
                style={{
                    top: position.y,
                    left: position.x,
                    position: "fixed", // changed to fixed!
                    boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
                    zIndex: 9999,
                }}
            >
                <ContextMenu items={items} onItemClick={handleItemClick} />
            </div>,
            document.body
        );
    }
);

export default ContextMenuWrapper;
