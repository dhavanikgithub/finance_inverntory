import React from "react";
import { ContextMenuItem, ContextMenuProps } from "./types";
import { SquareChevronRight } from "lucide-react";

const ContextMenu: React.FC<ContextMenuProps> = ({ items, onItemClick }) => {
  const renderItems = (menuItems: ContextMenuItem[], depth = 0) => (
    <ul
      className={`flex flex-col min-w-[180px] rounded-md shadow-md z-[${1000 + depth}]
        ${depth === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-100 dark:bg-gray-700"}
      `}
    >
      {menuItems.map((item, index) => {
        const hasChildren = !!item.children;

        return (
          <li key={index} className="relative group/item">
            <div
              className={`flex items-center justify-between gap-2 px-4 py-2 cursor-pointer select-none
                transition-colors duration-150
                text-gray-800 dark:text-gray-200
                ${item.disabled
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-200 dark:hover:bg-gray-600"}
              `}
              onClick={(e) => {
                e.stopPropagation();
                if (!item.disabled && !hasChildren) {
                  onItemClick(item);
                }
              }}
            >
              {item.icon && <span className="text-lg">{item.icon}</span>}
              <span className="flex-1">{item.label}</span>
            </div>
          </li>
        );
      })}
    </ul>
  );

  return <>{renderItems(items)}</>;
};

export default ContextMenu;
