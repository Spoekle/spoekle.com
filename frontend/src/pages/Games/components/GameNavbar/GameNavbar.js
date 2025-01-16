import React from 'react';
import { NavLink } from 'react-router-dom';
import MobileNavbar from './MobileNav';
import DesktopNavbar from './DefaultNav';
import useWindowWidth from '../../../../hooks/useWindowWidth';

function Navbar() {
    const windowWidth = useWindowWidth();
    const isMobile = windowWidth < 768;
    return (
        <nav className="p-2 z-50 sticky text-neutral-900 dark:text-white bg-neutral-200 dark:bg-neutral-900 transition duration-200">
            <div className="container mx-auto flex items-center justify-between flex-wrap">
                <div className="flex items-center space-x-3">
                    {isMobile ? (
                        <MobileNavbar />
                    ) : (
                        <DesktopNavbar />
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;