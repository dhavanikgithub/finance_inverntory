'use client'

import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef, ReactNode } from 'react';
import { House, UserRound, ArrowLeftRight, LayoutDashboard, BadgeHelp, Search, Sun, Moon, Facebook, Instagram, Twitter, Github, Dribbble, CreditCard, Landmark, SquareSigma } from 'lucide-react'
import { Section } from './Section';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import Logo from '@/components/Logo';

export const defaultNavItems = [
    // {
    //     name: "Dashboard",
    //     value: "dashboard",
    //     url: "/",
    //     isDisable: false,
    //     selectedIcon: <House className="w-4 h-4 text mr-3 text-white dark:text-zinc-950 " />,
    //     icon: <House className="w-4 h-4 text mr-3 text-zinc-950 dark:text-white" />
    // },
    {
        name: "Client",
        value: "client",
        url: "/client",
        isDisable: false,
        selectedIcon: <UserRound className="w-4 h-4 text mr-3 text-white dark:text-zinc-950 " />,
        icon: <UserRound className="w-4 h-4 text mr-3 text-zinc-950 dark:text-white" />
    },
    {
        name: "Transaction",
        value: "transaction",
        url: "/transaction",
        isDisable: false,
        selectedIcon: <ArrowLeftRight className="w-4 h-4 text mr-3 font-semibold text-white dark:text-zinc-950 " />,
        icon: <ArrowLeftRight className="w-4 h-4 text mr-3 font-semibold text-zinc-950 dark:text-white" />
    },
    {
        name: "Card",
        value: "card",
        url: "/card",
        isDisable: false,
        selectedIcon: <CreditCard className="w-4 h-4 text mr-3 font-semibold text-white dark:text-zinc-950 " />,
        icon: <CreditCard className="w-4 h-4 text mr-3 font-semibold text-zinc-950 dark:text-white" />
    },
    {
        name: "Bank",
        value: "bank",
        url: "/bank",
        isDisable: false,
        selectedIcon: <Landmark className="w-4 h-4 text mr-3 font-semibold text-white dark:text-zinc-950 " />,
        icon: <Landmark className="w-4 h-4 text mr-3 font-semibold text-zinc-950 dark:text-white" />
    }
]

interface DashboardProps {
    children: ReactNode; // Typing the children prop
}
const Dashboard: React.FC<DashboardProps> = ({ children }) => {
    const [selectedNavItem, setSelectedNavItem] = useState("");
    const [navItems, setNavItems] = useState(defaultNavItems);
    const [isMounted, setIsMounted] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const sidebarRef = useRef<HTMLDivElement | null>(null); // Typing for HTMLDivElement
    const sidebarBackdropRef = useRef<HTMLDivElement | null>(null); // Typing for HTMLDivElement
    const toggleSidebarMobileHamburgerRef = useRef<SVGSVGElement | null>(null); // Typing for SVGSVGElement
    const toggleSidebarMobileCloseRef = useRef<SVGSVGElement | null>(null); // Typing for SVGSVGElement

    const toggleSidebarMobile = () => {
        if (sidebarRef.current && sidebarBackdropRef.current && toggleSidebarMobileCloseRef.current && toggleSidebarMobileHamburgerRef.current) {
            sidebarRef.current.classList.toggle('hidden');
            sidebarBackdropRef.current.classList.toggle('hidden');
            toggleSidebarMobileHamburgerRef.current.classList.toggle('hidden');
            toggleSidebarMobileCloseRef.current.classList.toggle('hidden');
        }
    }

    // Use the Next.js router to get the current route
    const pathname = usePathname()

    // Ensure that the router logic runs only on the client
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Set the selectedNavItem based on the current path
    useEffect(() => {
        if (isMounted) {
            const currentPath = pathname;
            const selectedItem = navItems.find(item => item.url === currentPath);
            if (selectedItem) {
                setSelectedNavItem(selectedItem.value);
            }
        }
    }, [pathname, navItems, isMounted]);

    return (
        <>
            <div>
                <nav className="navbar">
                    <div className="px-3 py-3 lg:px-5 lg:pl-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center justify-start">
                                <button id="toggleSidebarMobile"
                                    onClick={() => {
                                        toggleSidebarMobile();
                                    }} aria-expanded="true" aria-controls="sidebar"
                                    className="lg:hidden mr-2 text-gray-600 hover:text-gray-900 cursor-pointer p-2 hover:bg-gray-100 rounded transition duration-100
                                    dark:hover:bg-gray-700 dark:text-gray-300 
                                    ">
                                    <svg ref={toggleSidebarMobileHamburgerRef} id="toggleSidebarMobileHamburger" className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path>
                                    </svg>
                                    <svg ref={toggleSidebarMobileCloseRef} id="toggleSidebarMobileClose" className="w-6 h-6 hidden" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                    </svg>
                                </button>
                                <a href="#" className="text-xl font-bold flex items-center lg:ml-2.5">
                                    <Logo className="h-6 mr-2 text-black dark:text-white" />
                                    <span className="self-center whitespace-nowrap">Finance</span>
                                </a>
                                {/* <form action="#" method="GET" className="form-search">
                                    <label htmlFor="topbar-search" className="form-search-label">Search</label>
                                    <div className="form-search-wrapper">
                                        <div className="form-search-icon-container">
                                            <Search className="form-search-icon" />
                                        </div>
                                        <input type="text" name="email" id="topbar-search"
                                            className="form-search-input"
                                            placeholder="Search" />
                                    </div>
                                </form> */}
                            </div>
                            <div className="flex items-center gap-4">
                                <button
                                    id="toggleSidebarMobileSearch"
                                    type="button"
                                    onClick={() => {
                                        toggleSidebarMobile();
                                    }}
                                    className="lg:hidden text-gray-500 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-lg transition duration-100
                                    dark:hover:bg-gray-700 dark:text-gray-300
                                    ">
                                    <Search />
                                </button>
                                <div className="items-center">
                                    <div
                                        className='cursor-pointer text-gray-500 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-lg transition duration-100
                                    dark:hover:bg-gray-700 dark:text-gray-300'
                                        onClick={toggleTheme}>
                                        {theme === 'dark' ?
                                            <Sun />
                                            :
                                            <Moon />
                                        }
                                    </div>
                                </div>
                                {/* <a
                                    href="#"
                                    className="hidden sm:inline-flex btn-primary ml-5 mr-3 ">
                                    <svg
                                        className="svg-inline--fa fa-gem -ml-1 mr-2 h-4 w-4"
                                        aria-hidden="true"
                                        focusable="false"
                                        data-prefix="fas"
                                        data-icon="gem"
                                        role="img"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 512 512">
                                        <path fill="currentColor" d="M378.7 32H133.3L256 182.7L378.7 32zM512 192l-107.4-141.3L289.6 192H512zM107.4 50.67L0 192h222.4L107.4 50.67zM244.3 474.9C247.3 478.2 251.6 480 256 480s8.653-1.828 11.67-5.062L510.6 224H1.365L244.3 474.9z"></path>
                                    </svg>
                                    Upgrade to Pro
                                </a> */}
                            </div>
                        </div>
                    </div>
                </nav>
                <div className="flex overflow-hidden pt-16">
                    <aside ref={sidebarRef} id="sidebar" className="fixed hidden z-20 h-full top-0 left-0 pt-16 flex lg:flex flex-shrink-0 flex-col w-64 sidebar" aria-label="Sidebar">
                        <div className="sidebar-inner">
                            <div className="sidebar-content">
                                <div className="sidebar-links">
                                    <ul className="space-y-2 pb-2">
                                        <li>
                                            <form action="#" method="GET" className="lg:hidden">
                                                <label htmlFor="mobile-search" className="form-search-label">Search</label>
                                                <div className="relative">
                                                    <div className="form-search-icon-container">
                                                        <Search className="form-search-icon" />
                                                    </div>
                                                    <input type="text" name="email" id="mobile-search" className="form-search-input " placeholder="Search" />
                                                </div>
                                            </form>
                                        </li>
                                        {/* <li>
                                            <Link href="/" className="sidebar-link group">
                                                <LayoutDashboard className="sidebar-link-icon group-hover:text-gray-900  dark:group-hover:text-gray-200" />
                                                <span className="sidebar-link-text">Dashboard</span>
                                            </Link>
                                        </li> */}
                                        <li>
                                            <Link href="/client" className="sidebar-link group">
                                                <UserRound className="sidebar-link-icon group-hover:text-gray-900  dark:group-hover:text-gray-200" />
                                                <span className="sidebar-link-text">Clients</span>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/transaction" className="sidebar-link group">
                                                <ArrowLeftRight className="sidebar-link-icon group-hover:text-gray-900  dark:group-hover:text-gray-200" />
                                                <span className="sidebar-link-text">Transactions</span>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/card" className="sidebar-link group">
                                                <CreditCard className="sidebar-link-icon group-hover:text-gray-900  dark:group-hover:text-gray-200" />
                                                <span className="sidebar-link-text">Card</span>
                                            </Link>
                                        </li>
                                         <li>
                                            <Link href="/bank" className="sidebar-link group">
                                                <Landmark className="sidebar-link-icon group-hover:text-gray-900  dark:group-hover:text-gray-200" />
                                                <span className="sidebar-link-text">Bank</span>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/charge-calculator" className="sidebar-link group">
                                                <SquareSigma className="sidebar-link-icon group-hover:text-gray-900  dark:group-hover:text-gray-200" />
                                                <span className="sidebar-link-text">Charge Calculator</span>
                                            </Link>
                                        </li>
                                    </ul>
                                    <div className="space-y-2 pt-2">
                                        <a href="#" target="_blank" className="sidebar-link group">
                                            <BadgeHelp className="sidebar-link-icon group-hover:text-gray-900 dark:group-hover:text-gray-200" />
                                            <span className="ml-3">Help</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>
                    <div ref={sidebarBackdropRef} className="sidebar-backdrop hidden" id="sidebarBackdrop" onClick={() => {
                        toggleSidebarMobile();
                    }}></div>
                    <div id="main-content" className="main-content">
                        <main>
                            <div className="main-content-section">
                                <Section>
                                    {children}
                                </Section>
                            </div>
                        </main>
                        <footer className="footer">
                            <ul className="footer-list">
                                <li><a href="#" className="footer-item">Terms and conditions</a></li>
                                <li><a href="#" className="footer-item">Privacy Policy</a></li>
                                <li><a href="#" className="footer-item">Licensing</a></li>
                                <li><a href="#" className="footer-item">Cookie Policy</a></li>
                                <li><a href="#" className="footer-item">Contact</a></li>
                            </ul>
                            <div className="footer-social-links">
                                {/* <a href="#" className="footer-social-icon">
                                    <Facebook className="h-5 w-5" />
                                </a>
                                <a href="#" className="footer-social-icon">
                                    <Instagram className="h-5 w-5" />
                                </a>
                                <a href="#" className="footer-social-icon">
                                    <Twitter className="h-5 w-5" />
                                </a> */}
                                <a href="https://github.com/dhavanikgithub/finance_inverntory" className="footer-social-icon">
                                    <Github className="h-5 w-5" />
                                </a>
                                {/* <a href="#" className="footer-social-icon">
                                    <Dribbble className="h-5 w-5" />
                                </a> */}
                            </div>
                        </footer>
                        <p className="footer-text">
                            &copy; 2025 <a href="#" className="hover:underline" target="_blank">Dhavanik</a>. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;
