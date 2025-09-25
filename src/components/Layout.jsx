import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import BubbleBackground from './BubbleBackground';

const Layout = ({ children }) => {
  return (
    <div className="w-full min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 relative">
        <Sidebar />
        <main className="flex-1 relative overflow-x-hidden">
          <BubbleBackground />
          <div className="p-4 sm:p-6 md:p-8 lg:px-12 w-full relative z-10">
            {children}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;