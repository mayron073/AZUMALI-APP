import { createContext, useState } from 'react';

const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(prevState => !prevState);
    };

    return (
        <MenuContext.Provider 
            value={{ 
                menuOpen, 
                toggleMenu 
                }}>
            {children}
        </MenuContext.Provider>
    );
};


export default MenuContext;
