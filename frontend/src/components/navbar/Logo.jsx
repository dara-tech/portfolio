import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Terminal, Code2 } from 'lucide-react';

const Logo = memo(({ className = "" }) => (
  <Link 
    to="/" 
    className={`group flex items-center gap-2 btn btn-ghost normal-case font-bold hover:scale-105 transition-all duration-300 ${className}`}
  >
    <div className="relative">
      <Terminal className="w-6 h-6 text-primary transform transition-transform group-hover:rotate-12" />
      <Code2 className="w-3 h-3 text-secondary absolute -top-1 -right-1 transform transition-transform group-hover:scale-125" />
    </div>
    <div className="flex items-baseline">
      <span className="text-xl">Portfolio</span>
      <span className="text-xl text-primary font-extrabold transition-colors duration-300 group-hover:text-secondary">.Dara</span>
    </div>
  </Link>
));

export default Logo;
