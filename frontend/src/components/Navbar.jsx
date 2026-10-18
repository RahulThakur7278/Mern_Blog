import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/');
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const handleLinkClick = () => setIsMenuOpen(false);

  const isActive = (path) => location.pathname === path;
  
  // Special check to keep Admin Dashboard highlighted while on admin sub-pages
  const isAdminActive = location.pathname.startsWith('/admin');

  const linkClasses = (path, customActiveCheck = false) => {
    const active = customActiveCheck ? isAdminActive : isActive(path);
    return `transition-colors duration-200 ${
      active ? 'text-indigo-600 font-medium' : 'text-slate-600 hover:text-slate-900'
    }`;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md bg-white/80 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          <Link to="/" className="text-xl font-semibold text-slate-900 tracking-tight transition-transform duration-200 hover:scale-105">
            MERN Blog
          </Link>

          {/* DESKTOP LINKS */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className={linkClasses('/')}>Home</Link>

            {isLoggedIn && (
              <>
                <Link to="/dashboard" className={linkClasses('/dashboard')}>Dashboard</Link>
                <Link to="/create" className={linkClasses('/create')}>Create Blog</Link>
              </>
            )}

            {/* ADMIN LINKS */}
            {isLoggedIn && user?.role === 'admin' && (
              <>
                <Link to="/admin/analytics" className={linkClasses('/admin/analytics')}>Analytics</Link>
                <Link to="/admin/pending" className={linkClasses('/admin/pending')}>Pending Blogs</Link>
              </>
            )}

            {isLoggedIn ? (
              <button onClick={handleLogout} className="text-slate-600 hover:text-rose-600 transition-colors duration-200">
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className={linkClasses('/login')}>Login</Link>
                <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 active:scale-[0.98] transition-all duration-200">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* MOBILE HAMBURGER */}
          <button className="md:hidden p-2 text-slate-600 hover:text-slate-900 transition-colors duration-200" onClick={toggleMenu} aria-label="Toggle menu">
            <div className="w-6 h-5 relative flex flex-col justify-between">
              <span className={`block h-0.5 w-6 bg-current rounded-full transition-all duration-300 origin-center ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`block h-0.5 w-6 bg-current rounded-full transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block h-0.5 w-6 bg-current rounded-full transition-all duration-300 origin-center ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </div>
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-4 py-4 space-y-1 border-t border-slate-100 bg-white/90">
          <Link to="/" onClick={handleLinkClick} className={`block py-2 px-3 rounded-lg transition-colors duration-200 ${isActive('/') ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}>Home</Link>

          {isLoggedIn && (
            <>
              <Link to="/dashboard" onClick={handleLinkClick} className={`block py-2 px-3 rounded-lg transition-colors duration-200 ${isActive('/dashboard') ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}>Dashboard</Link>
              <Link to="/create" onClick={handleLinkClick} className={`block py-2 px-3 rounded-lg transition-colors duration-200 ${isActive('/create') ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}>Create Blog</Link>
            </>
          )}

          {/* ADMIN MOBILE LINKS */}
          {isLoggedIn && user?.role === 'admin' && (
            <>
              <Link to="/admin/analytics" onClick={handleLinkClick} className={`block py-2 px-3 rounded-lg transition-colors duration-200 ${isActive('/admin/analytics') ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}>Analytics</Link>
              <Link to="/admin/pending" onClick={handleLinkClick} className={`block py-2 px-3 rounded-lg transition-colors duration-200 ${isActive('/admin/pending') ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}>Pending Blogs</Link>
            </>
          )}

          {isLoggedIn ? (
            <button onClick={handleLogout} className="block w-full text-left py-2 px-3 rounded-lg text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-colors duration-200">Logout</button>
          ) : (
            <>
              <Link to="/login" onClick={handleLinkClick} className={`block py-2 px-3 rounded-lg transition-colors duration-200 ${isActive('/login') ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}>Login</Link>
              <Link to="/register" onClick={handleLinkClick} className="block py-2 px-3 mt-2 text-center bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 active:scale-[0.98] transition-all duration-200">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;