import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, PenSquare, User as UserIcon, Menu, X, Settings, Bookmark } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../../store/useAuthStore';

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate('/login');
  };

  const isAdmin = user && user.role === 'admin';

  return (
    <nav className="glass-card sticky top-0 z-50 w-full backdrop-blur-md bg-surface-dark/80 px-2 lg:px-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent flex-shrink-0">
            Personal Blog
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {isAdmin && (
              <Link
                to="/create"
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
              >
                <PenSquare size={20} />
                <span>Write</span>
              </Link>
            )}

            {user && isAdmin && <div className="border-l border-gray-700 h-6"></div>}

            {user ? (
              <div className="flex items-center space-x-6 pl-2">
                <Link 
                  to="/profile" 
                  state={{ tab: 'saved' }}
                  className="flex items-center space-x-2 text-sm text-gray-400 hover:text-primary-400 transition-colors"
                  title="Saved Posts"
                >
                  <Bookmark size={20} />
                  <span className="hidden lg:inline">Saved</span>
                </Link>
                <div className="border-l border-gray-700 h-5"></div>
                <Link to="/profile" className="flex items-center space-x-2 text-sm text-gray-400 hover:text-white transition-colors">
                  {user.profileImage ? (
                    <img src={user.profileImage} alt={user.username} className="w-8 h-8 rounded-full border border-gray-600 object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-600 to-indigo-600 flex items-center justify-center text-white font-bold">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="font-medium">{user.username}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-red-400 transition-colors p-2"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-gray-300 hover:text-white p-2 focus:outline-none"
            >
              {mobileOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-surface-dark border-t border-gray-800"
          >
            <div className="px-4 py-4 flex flex-col space-y-4">
              {isAdmin && (
                <Link
                  to="/create"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800"
                >
                  <PenSquare size={20} />
                  <span>Write Post</span>
                </Link>
              )}

              {user ? (
                <>
                  <Link
                    to="/profile"
                    state={{ tab: 'saved' }}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800"
                  >
                    <Bookmark size={20} />
                    <span>Saved Posts</span>
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800"
                  >
                    {user.profileImage ? (
                      <img src={user.profileImage} alt={user.username} className="w-6 h-6 rounded-full border border-gray-600 object-cover" />
                    ) : (
                      <UserIcon size={20} />
                    )}
                    <span>Profile & Settings</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 text-red-400 hover:text-red-300 transition-colors p-2 rounded-lg hover:bg-red-500/10 w-full text-left"
                  >
                    <LogOut size={20} />
                    <span>Log Out</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="block text-gray-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileOpen(false)}
                    className="block bg-primary-600 text-center hover:bg-primary-500 text-white px-4 py-3 rounded-lg transition-colors mt-2"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
