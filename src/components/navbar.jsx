import { useState } from "react";
export default function Navbar({activeNav, setActiveNav}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  return (
    <nav className='bg-white shadow-md w-full fixed top-0 left-0 z-10'>
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center h-20 w-24">
          <button onClick={() => setActiveNav('home')}><img src="/assets/logo.png" alt="KodeIn Logo"/></button>
        </div>
        <div className="hidden md:flex">
          <div className="px-4 text-lg">
            <button onClick={() => setActiveNav('home')}
            className={`${activeNav === 'home' ? 'text-blue-600 font-bold ' : 'text-gray-600'} hover:text-blue-500`}>
              Home
            </button>
          </div>
          <div className="px-4 text-lg">
            <button onClick={() => setActiveNav('about')}
            className={`${activeNav === 'about' ? 'text-blue-600 font-bold' : 'text-gray-600'} hover:text-blue-500`}>
              About
            </button>
          </div>
          <div className="px-4 text-lg">
            <button onClick={() => setActiveNav('tutorial')}
              className={`${activeNav === 'tutorial' ? 'text-blue-600 font-bold' : 'text-gray-600'} hover:text-blue-500`}>
              Tutorial
            </button>
          </div>
        </div>
      </div>
      <div className="md:hidden">
        <button onClick={toggleMenu} className="text-gray-600">
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {menuOpen && (
        <div className="md:hidden bg-white py-2 px-4 shadow-lg">
          <div className="flex flex-col space-y-3">
            <button 
              onClick={() => {
                setActiveNav('home');
                setMenuOpen(false);
              }}
              className={`${activeNav === 'home' ? 'text-blue-600 font-bold' : 'text-gray-600'} py-2 hover:text-blue-500`}
            >
              Home
            </button>
            <button 
              onClick={() => {
                setActiveNav('about');
                setMenuOpen(false);
              }}
              className={`${activeNav === 'about' ? 'text-blue-600 font-bold' : 'text-gray-600'} py-2 hover:text-blue-500`}
            >
              About
            </button>
            <button 
              onClick={() => {
                setActiveNav('tutorial');
                setMenuOpen(false);
              }}
              className={`${activeNav === 'tutorial' ? 'text-blue-600 font-bold' : 'text-gray-600'} py-2 hover:text-blue-500`}
            >
              Tutorial
            </button>
          </div>
        </div>
      )}

    </nav>
  )
}