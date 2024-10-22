import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Book, PlusCircle, CheckCircle, Combine } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Home className="h-8 w-8" />
            <span className="font-bold text-xl">Rule Engine</span>
          </Link>
          <div className="flex space-x-4">
            <Link to="/rules" className="flex items-center space-x-1 hover:text-blue-200">
              <Book className="h-5 w-5" />
              <span>Rules</span>
            </Link>
            <Link to="/create" className="flex items-center space-x-1 hover:text-blue-200">
              <PlusCircle className="h-5 w-5" />
              <span>Create</span>
            </Link>
            <Link to="/evaluate" className="flex items-center space-x-1 hover:text-blue-200">
              <CheckCircle className="h-5 w-5" />
              <span>Evaluate</span>
            </Link>
            <Link to="/combine" className="flex items-center space-x-1 hover:text-blue-200">
              <Combine className="h-5 w-5" />
              <span>Combine</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;