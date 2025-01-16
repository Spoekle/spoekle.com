import { NavLink } from 'react-router-dom';

function DesktopNavbar() {

    return (
        <>
            <div className="flex items-center space-x-3">
                <div className="flex space-x-3">
                    <NavLink
                        to="/games/beatsaber"
                        className={({ isActive }) =>
                            `text-md ${isActive ? 'underline bg-black/20 scale-110' : 'hover:bg-black/20 hover:scale-110'} rounded-md py-2 px-3 transition duration-200 text-left`
                        }
                    >
                        Beat Saber
                    </NavLink>
                    <NavLink
                        to="/games/minecraft"
                        className={({ isActive }) =>
                            `text-md ${isActive ? 'underline bg-black/20 scale-110' : 'hover:bg-black/20 hover:scale-110'} rounded-md py-2 px-3 transition duration-200 text-left`
                        }
                    >
                        Minecraft
                    </NavLink>
                </div>
            </div>
        </>
    );
}

export default DesktopNavbar;