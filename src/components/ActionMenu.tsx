'use client';

import { useState, useRef, useEffect } from 'react';
import { MoreVertical } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type MenuItem<T> = {
  label: string;
  icon: LucideIcon;
  onClick: (data: T) => void;
};

type ActionMenuProps<T> = {
  items: MenuItem<T>[];
  data: T;
};

export default function ActionMenu<T>({ items, data }: ActionMenuProps<T>) {
  const [open, setOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // ✅ Close dropdown on outside click (use 'click' instead of 'mousedown')
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node) &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Calculate menu position
  const handleToggle = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const estimatedHeight = items.length * 44;

      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      const top = spaceBelow >= estimatedHeight
        ? rect.bottom + window.scrollY
        : rect.top - estimatedHeight + window.scrollY;

      setMenuStyle({
        top: top,
        left: rect.left + rect.width / 2,
        transform: 'translateX(-100%)',
      });
      setOpen(prev => !prev);
    }
  };

  const handleClick = (item: MenuItem<T>) => {
    item.onClick(data);
    setOpen(false); // Close the menu after clicking an item
  };

  return (
    <div className="relative inline-block text-left">
      <button
        ref={buttonRef}
        onClick={handleToggle}
        className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition"
      >
        <MoreVertical size={18} />
      </button>

      {open && (
        <div
          ref={menuRef}
          style={menuStyle}
          className="fixed z-50 w-48 rounded-xl shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black/10 dark:ring-white/10 p-1"
        >
          <ul className="py-1">
            {items.map((item, index) => (
              <li key={index}>
                <button
                  onClick={() => handleClick(item)}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition"
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
