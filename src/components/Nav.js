import React, { useEffect, useState } from 'react';
import netflixLogo from '../images/netflix-logo-rgb.png';
import netflixUserAvatar from '../images/netflix-profile-icon-320.png';
import './Nav.css';

function Nav() {
    const [showBackground, setShowBackground] = useState(false);

    useEffect(() => {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                setShowBackground(true);
            } else {
                setShowBackground(false);
            }
        });

        return () => {
            window.removeEventListener('scroll');
        };
    }, []);

    return (
        <div className={`nav ${showBackground && "nav-black"}`}>
            <img
                className='nav-logo'
                src={netflixLogo}
                alt='Netflix Logo'
            />

            <img
                className='nav-avatar'
                src={netflixUserAvatar}
                alt='Netflix User Avatar'
            />
        </div>
    )
}

export default Nav;
