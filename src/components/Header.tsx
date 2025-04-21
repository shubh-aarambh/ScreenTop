import React from 'react';
import { Link } from 'react-router-dom';
import { Film } from 'lucide-react';

const Header = () => {
  return (
    <header className="py-4 border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="container-custom flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Film size={24} className="text-primary" />
          <span className="font-montserrat font-bold text-xl">
            Movie<span className="text-primary">Mind</span>
          </span>
        </Link>
      </div>
    </header>
  );
};

export default Header;
