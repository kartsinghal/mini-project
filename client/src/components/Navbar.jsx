import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, Menu, X, LogOut, User } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import ProfileModal from './ProfileModal';

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
  const [profileOpen, setProfileOpen] = useState(false);

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
    <div className="fixed top-4 left-0 right-0 z-[100] flex justify-center px-4 pointer-events-none">
      <motion.nav
        initial={{ y: -40, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`pointer-events-auto relative flex items-center justify-between w-full max-w-[1000px] h-[60px] px-3 rounded-full backdrop-blur-xl transition-all duration-500 will-change-transform ${
          scrolled
            ? isDark
              ? 'bg-[#0b0f0e]/60 border border-[#0FA77F]/30 shadow-[0_8px_32px_rgba(15,167,127,0.15)]'
              : 'bg-white/60 border border-[#0FA77F]/20 shadow-[0_8px_32px_rgba(15,167,127,0.1)]'
            : isDark
            ? 'bg-[#0b0f0e]/30 border border-white/5 shadow-[0_4px_24px_rgba(0,0,0,0.2)]'
            : 'bg-white/40 border border-black/5 shadow-[0_4px_24px_rgba(0,0,0,0.04)]'
        }`}
      >
        {/* LEFT SECTION: Logo */}
        <div className="flex pl-2 items-center">
          <a
            href="/"
            onClick={(e) => { e.preventDefault(); go('/'); }}
            className="flex items-center gap-2 outline-none group"
          >
            <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-[#0FA77F] to-[#22c55e] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300 shadow-[0_0_12px_rgba(15,167,127,0.4)] group-hover:shadow-[0_0_20px_rgba(15,167,127,0.6)]">
              <span className="text-white font-extrabold text-[15px] tracking-tighter">H</span>
            </div>
            <span className={`font-bold text-[17px] tracking-tight ml-1 ${isDark ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>
              HealthLens<span className="text-[#0FA77F] ml-[1px] group-hover:animate-pulse">.</span>
            </span>
          </a>
        </div>

        {/* CENTER SECTION: Nav Links (Glassy Hover) */}
        <div className="hidden lg:flex items-center justify-center gap-1">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => go(link.href)}
              className="relative group px-4 py-2 rounded-full overflow-hidden"
            >
              <div className={`absolute inset-0 rounded-full transition-transform duration-300 scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-100 ${
                isDark ? 'bg-white/10' : 'bg-[#0FA77F]/10'
              }`} />
              <span className={`relative z-10 text-[14px] font-semibold transition-colors duration-300 ${
                isDark ? 'text-gray-300 group-hover:text-white' : 'text-gray-600 group-hover:text-[#0FA77F]'
              }`}>
                {link.label}
              </span>
            </button>
          ))}
        </div>

        {/* RIGHT SECTION: Actions */}
        <div className="flex items-center justify-end gap-2 pr-1">
          {/* Theme Toggle (Magnetic style) */}
          <button
            onClick={toggleTheme}
            className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 group ${
              isDark ? 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white' : 'bg-black/5 text-gray-600 hover:bg-black/10 hover:text-gray-900'
            }`}
          >
            <AnimatePresence mode="wait">
              <motion.div key={isDark ? 'sun' : 'moon'} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.3, ease: 'backOut' }}>
                {isDark ? <Sun size={17} className="group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" /> : <Moon size={17} />}
              </motion.div>
            </AnimatePresence>
          </button>

          <AnimatePresence mode="wait">
            {isLoggedIn ? (
              <motion.div key="logged-in" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="hidden md:flex items-center gap-2">
                
                <Link
                  to="/dashboard"
                  className={`text-[14px] font-semibold px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 ${
                    isDark ? 'text-gray-300 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-[#0FA77F] hover:bg-[#0FA77F]/10'
                  }`}
                >
                  Dashboard
                </Link>

                {/* Cyberpill user badge */}
                <button 
                  onClick={() => setProfileOpen(true)}
                  className={`flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-transparent transition-all duration-300 hover:scale-[1.02] cursor-pointer ${
                    isDark ? 'bg-gradient-to-r from-white/5 to-white/10 hover:border-[#0FA77F]/40' : 'bg-gradient-to-r from-gray-100 to-gray-50 hover:border-[#0FA77F]/30'
                  }`}
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#0FA77F] to-[#22c55e] flex items-center justify-center flex-shrink-0 shadow-[0_0_10px_rgba(15,167,127,0.3)]">
                    <span className="text-white font-bold text-xs">{firstName.charAt(0).toUpperCase()}</span>
                  </div>
                  <span className={`text-[13.5px] font-bold tracking-tight hidden lg:block ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    {firstName}
                  </span>
                </button>

                <button
                  onClick={handleLogout}
                  className={`ml-1 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-red-500/10 hover:text-red-500 ${isDark ? 'text-gray-400' : 'text-gray-400'}`}
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </motion.div>
            ) : (
              <motion.div key="logged-out" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="hidden md:flex items-center gap-1.5 ml-1">
                <Link
                  to="/login"
                  className={`text-[14px] font-semibold px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 ${isDark ? 'text-gray-300 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-gray-900 hover:bg-black/5'}`}
                >
                  Log in
                </Link>
                {/* Glowing antigravity button */}
                <Link
                  to="/signup"
                  className="relative group overflow-hidden rounded-full ml-1"
                >
                  {/* Outer glow */}
                  <span className="absolute inset-0 rounded-full bg-gradient-to-r from-[#0FA77F] to-[#22c55e] blur-md opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                  {/* Button surface */}
                  <div className="relative flex items-center justify-center bg-gradient-to-r from-[#0e9672] to-[#1cb054] px-5 py-[9px] rounded-full text-white text-[13.5px] font-bold tracking-wide transition-transform duration-300 group-hover:scale-[1.02]">
                    Sign up
                  </div>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`lg:hidden flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 hover:scale-105 ${isDark ? 'bg-white/10 text-white' : 'bg-black/5 text-gray-900'}`}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Mobile Floating Drawer */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className={`absolute top-[70px] left-0 right-0 p-3 rounded-3xl backdrop-blur-2xl shadow-2xl border ${
                isDark ? 'bg-[#0b0f0e]/90 border-white/10' : 'bg-white/95 border-black/10'
              }`}
            >
              <div className="flex flex-col space-y-1">
                {navLinks.map((link) => (
                  <button
                    key={link.label}
                    onClick={() => go(link.href)}
                    className={`text-left text-[15px] font-semibold px-5 py-3 rounded-2xl transition-colors ${
                      isDark ? 'text-gray-200 hover:bg-white/10' : 'text-gray-700 hover:bg-black/5'
                    }`}
                  >
                    {link.label}
                  </button>
                ))}

                <div className={`my-2 h-px w-full ${isDark ? 'bg-white/10' : 'bg-black/5'}`} />

                {isLoggedIn ? (
                  <div className="flex flex-col space-y-1">
                    <button onClick={() => { setMenuOpen(false); setProfileOpen(true); }} className={`text-left flex items-center gap-2 text-[15px] font-semibold px-5 py-3 rounded-2xl transition-colors ${isDark ? 'text-gray-200 hover:bg-white/10' : 'text-gray-700 hover:bg-black/5'}`}>
                      <User size={16} /> Profile
                    </button>
                    <Link to="/dashboard" onClick={() => setMenuOpen(false)} className={`text-[15px] font-semibold px-5 py-3 rounded-2xl transition-colors ${isDark ? 'text-gray-200 hover:bg-white/10' : 'text-gray-700 hover:bg-black/5'}`}>Dashboard</Link>
                    <button onClick={() => { setMenuOpen(false); handleLogout(); }} className="text-left text-[15px] font-semibold text-red-500 flex items-center gap-2 px-5 py-3 rounded-2xl hover:bg-red-500/10 transition-colors">
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-1 pb-1">
                    <Link to="/login" onClick={() => setMenuOpen(false)} className={`text-[15px] font-semibold flex items-center gap-2 px-5 py-3 rounded-2xl transition-colors ${isDark ? 'text-gray-200 hover:bg-white/10' : 'text-gray-700 hover:bg-black/5'}`}>
                      <User size={16} /> Log in
                    </Link>
                    <Link to="/signup" onClick={() => setMenuOpen(false)} className="text-[15px] font-bold text-center mt-2 mx-2 bg-gradient-to-r from-[#0FA77F] to-[#22c55e] text-white py-3 rounded-xl shadow-[0_4px_16px_rgba(15,167,127,0.3)] hover:scale-[1.02] transition-transform">
                      Sign up for free
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Profile Modal Overlay */}
      <ProfileModal isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
    </div>
  );
}
