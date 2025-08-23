import { useTheme } from "@/context/ThemeContext";
import Logo from "../Logo";
import { Moon, Sun } from "lucide-react";

interface NavbarProps {
    toggleSidebarMobile: () => void;
    toggleSidebarMobileHamburgerRef: React.RefObject<SVGSVGElement | null>;
    toggleSidebarMobileCloseRef: React.RefObject<SVGSVGElement | null>;
}
export default function Navbar({toggleSidebarMobileCloseRef, toggleSidebarMobileHamburgerRef, toggleSidebarMobile}: NavbarProps) {
    const { theme, toggleTheme } = useTheme();
    return (
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
                        <a href="/" className="text-xl font-bold flex items-center lg:ml-2.5">
                            <Logo className="h-8 mr-2 dark:fill-white" />
                            <span className="self-center whitespace-nowrap">Bapa Sitaram</span>
                        </a>
                    </div>
                    <div className="flex items-center gap-4">

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
                    </div>
                </div>
            </div>
        </nav>
    )
}