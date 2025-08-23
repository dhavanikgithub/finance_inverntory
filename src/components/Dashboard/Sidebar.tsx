import { cloneElement, useRef } from "react";
import { UserRound, ArrowLeftRight, BadgeHelp, Search, Sun, Moon, Github, CreditCard, Landmark, SquareSigma, House } from 'lucide-react'
import Link from "next/link";
import { usePathname } from "next/navigation";


export const navItems = [
    [
        // {
        //     name: "Dashboard",
        //     value: "dashboard",
        //     url: "/",
        //     isDisable: false,
        //     icon: <House />
        // },
        {
            name: "Client",
            value: "client",
            url: "/client",
            isDisable: false,
            icon: <UserRound />
        },
        {
            name: "Transaction",
            value: "transaction",
            url: "/transaction",
            isDisable: false,
            icon: <ArrowLeftRight />
        },
        {
            name: "Card",
            value: "card",
            url: "/card",
            isDisable: false,
            icon: <CreditCard />
        },
        {
            name: "Bank",
            value: "bank",
            url: "/bank",
            isDisable: false,
            icon: <Landmark />
        },
        {
            name: "Charge Calculator",
            value: "charge-calculator",
            url: "/charge-calculator",
            isDisable: false,
            icon: <SquareSigma />
        },
        {
            name: "Finkeda Calculator",
            value: "finkeda-calculator",
            url: "/finkeda-calculator",
            isDisable: false,
            icon: <SquareSigma />
        }
    ],
    [
        {
            name: "Help",
            value: "help",
            url: "#",
            isDisable: false,
            icon: <BadgeHelp />
        }
    ]

]

interface SidebarProps {
    toggleSidebarMobile: () => void;
    sidebarBackdropRef: React.RefObject<HTMLDivElement | null>;
    sidebarRef: React.RefObject<HTMLDivElement | null>;
}

export default function Sidebar({sidebarRef, sidebarBackdropRef, toggleSidebarMobile}: SidebarProps) {
    // Use the Next.js router to get the current route
    const pathname = usePathname()


    const isActive = (path: string) => pathname === path ?
        "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white" :
        "text-gray-600 dark:text-gray-300";

    return (
        <>
            <aside ref={sidebarRef} id="sidebar" className="fixed hidden z-20 h-full top-0 left-0 pt-16 flex lg:flex flex-shrink-0 flex-col w-64 sidebar" aria-label="Sidebar">
                <div className="sidebar-inner">
                    <div className="sidebar-content">
                        <div className="sidebar-links">
                            {navItems.map((sectionItem, index) => (
                                <ul className="space-y-2 pb-2 pt-2" key={`section-${index}`}>
                                    {sectionItem.map((item) => (
                                        <li key={item.value}>
                                            <Link href={item.url} className={`sidebar-link group ${isActive(item.url)}`}>
                                                {cloneElement(item.icon, { className: 'sidebar-link-icon group-hover:text-gray-900  dark:group-hover:text-gray-200' })} {/* 👈 icon class */}
                                                <span className="sidebar-link-text">{item.name}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            ))}
                        </div>
                    </div>
                </div>
            </aside>
            <div ref={sidebarBackdropRef} className="sidebar-backdrop hidden" id="sidebarBackdrop" onClick={() => {
                toggleSidebarMobile();
            }}></div>
        </>
    );
}