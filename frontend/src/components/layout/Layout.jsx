import React from 'react';
import Navbar from './Navbar';
import AiAssistant from '../Assistant/AiAssistant';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-background-dark text-white flex flex-col relative w-full">
      {/* Decorative background blob */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-600/20 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary-500/10 blur-[120px] pointer-events-none" />

      <Navbar />
      <main className="flex-grow container mx-auto px-4 sm:px-6 py-6 sm:py-8 relative z-10 w-full">
        {children}
      </main>
      <AiAssistant />
    </div>
  );
};

export default Layout;
