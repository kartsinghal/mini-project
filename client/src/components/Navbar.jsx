import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, Menu, X, LogOut, User } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const navLinks = [
  { label: 'Check Symptoms', href: '/#checker' },
  { label: 'First Aid', href: '/#firstaid' },
  { label: 'AI Advisor', href: '/#advisor' },
];

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const go = (href) => {
    setMenuOpen(false);
    if (href.startsWith('/#')) {
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => document.querySelector(href.substring(1))?.scrollIntoView({ behavior: 'smooth' }), 100);
      } else {
        document.querySelector(href.substring(1))?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(href);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const firstName = user?.name?.split(' ')[0] || '';

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-[100] transition-colors duration-300 backdrop-blur-md ${
        scrolled 
          ? isDark ? 'bg-[#0b0f0e]/80 border-b border-[#2b4440]/80' : 'bg-white/80 border-b border-gray-200'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* LEFT SECTION: Logo */}
        <div className="flex-1 flex items-center">
          <a
            href="/"
            onClick={(e) => { e.preventDefault(); go('/'); }}
            className="flex items-center gap-2.5 outline-none group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#0FA77F] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
              <span className="text-white font-extrabold text-sm tracking-tighter">H</span>
            </div>
            <span className={`font-bold text-[17px] tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
              HealthLens<span className="text-[#0FA77F] ml-0.5">.</span>
            </span>
          </a>
        </div>

        {/* CENTER SECTION: Navigation Links */}
        <div className="hidden md:flex flex-1 items-center justify-center gap-6">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => go(link.href)}
              className={`text-sm font-medium transition-colors hover:text-[#0FA77F] ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* RIGHT SECTION: User Actions */}
        <div className="flex-1 flex items-center justify-end gap-3">
          
          <button
            onClick={toggleTheme}
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
              isDark ? 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10' : 'bg-gray-100 text-gray-500 hover:text-gray-800 hover:bg-gray-200'
            }`}
          >
            <AnimatePresence mode="wait">
              <motion.div key={isDark ? 'sun' : 'moon'} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                {isDark ? <Sun size={16} /> : <Moon size={16} />}
              </motion.div>
            </AnimatePresence>
          </button>

          <AnimatePresence mode="wait">
            {isLoggedIn ? (
              <motion.div key="logged-in" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="hidden md:flex items-center gap-3">
                
                <Link
                  to="/dashboard"
                  className={`text-sm font-medium transition-colors hover:text-[#0FA77F] ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
                >
                  Dashboard
                </Link>

                {/* Vertical Divider */}
                <div className={`h-4 w-px mx-1 ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`} />

                {/* Clean User Dropdown/Pill */}
                <div className={`flex items-center gap-2 px-1 py-1 pr-3 rounded-full border transition-colors ${
                  isDark ? 'border-gray-700 bg-gray-800/50 hover:border-gray-600' : 'border-gray-200 bg-white hover:border-gray-300'
                }`}>
                  <div className="w-6 h-6 rounded-full bg-[#0FA77F] flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xs">{firstName.charAt(0).toUpperCase()}</span>
                  </div>
                  <span className={`text-[13px] font-semibold hidden lg:block ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                    {firstName}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className={`ml-1 text-sm font-medium transition-colors hover:text-red-500 ${isDark ? 'text-gray-400' : 'text-gray-400'}`}
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </motion.div>
            ) : (
              <motion.div key="logged-out" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="hidden md:flex items-center gap-3">
                <Link
                  to="/login"
                  className={`text-sm font-medium transition-colors ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="text-sm font-medium px-4 py-2 rounded-lg bg-[#0FA77F] text-white hover:bg-[#0c9470] transition-colors shadow-sm"
                >
                  Sign up
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`md:hidden flex items-center justify-center w-9 h-9 rounded-lg ${isDark ? 'bg-white/5 text-white' : 'bg-gray-100 text-gray-900'}`}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Hidden on md and up) */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className={`md:hidden overflow-hidden border-t ${isDark ? 'border-gray-800 bg-[#0b0f0e]' : 'border-gray-100 bg-white'}`}
          >
            <div className="flex flex-col px-6 py-4 space-y-4">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => go(link.href)}
                  className={`text-left text-base font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
                >
                  {link.label}
                </button>
              ))}

              <div className={`pt-4 mt-2 border-t flex flex-col space-y-4 ${isDark ? 'border-gray-800' : 'border-gray-100'}`}>
                {isLoggedIn ? (
                  <>
                    <Link to="/dashboard" onClick={() => setMenuOpen(false)} className={`text-base font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Dashboard</Link>
                    <button onClick={() => { setMenuOpen(false); handleLogout(); }} className="text-left text-base font-medium text-red-500 flex items-center gap-2">
                      <LogOut size={16} /> Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMenuOpen(false)} className={`text-base font-medium flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      <User size={16} /> Log in
                    </Link>
                    <Link to="/signup" onClick={() => setMenuOpen(false)} className="text-base font-medium text-[#0FA77F]">
                      Sign up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
