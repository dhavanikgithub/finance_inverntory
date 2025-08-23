'use client'

import { useRef, ReactNode } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import MainContent from './MainContent';



interface DashboardProps {
    children: ReactNode; // Typing the children prop
}
const Dashboard: React.FC<DashboardProps> = ({ children }) => {
    
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

    return (
        <>
            <div>
                <Navbar toggleSidebarMobileCloseRef={toggleSidebarMobileCloseRef} toggleSidebarMobileHamburgerRef={toggleSidebarMobileHamburgerRef} toggleSidebarMobile={toggleSidebarMobile} />
                <div className="flex overflow-hidden pt-16">
                    <Sidebar sidebarRef={sidebarRef} sidebarBackdropRef={sidebarBackdropRef} toggleSidebarMobile={toggleSidebarMobile}/>
                    <MainContent>
                        {children}
                    </MainContent>
                </div>
            </div>
        </>
    );
};

export default Dashboard;
