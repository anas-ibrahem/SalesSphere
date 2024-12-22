import React from 'react';
import { NavLink } from 'react-router-dom';

// USAGE EXAMPLE 
{/* <Logo logoChoice={2} size="h-[70px] w-[70px]"/>  */}



function Logo({ logoChoice = 1, size = 'h-16 w-16' }) {
  // Choose the logo based on logoChoice
  const selectedLogo = logoChoice !== 2 ? (
    <img 
      src="https://i.ibb.co/6s0gPZj/Logo-No-Text.png" 
      alt="logo" 
      className={`${size} mr-2`} 
    />
  ) : (
    <img 
      src="https://i.ibb.co/0msg5bm/Copy-of-Sales-Sphere.png"
      alt="logo" 
      className={`${size} mr-2`} 
    />
  );

  return (
    <NavLink to="/">
      {selectedLogo}
    </NavLink>
  );
}


export default Logo;
