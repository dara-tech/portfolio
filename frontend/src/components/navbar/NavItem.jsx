import React, { memo } from 'react';
import { Link } from 'react-router-dom';

const NavItem = memo(({ item, isActive }) => {
  const Icon = item.icon;
  return (
    <Link
      to={item.path}
      className={`flex items-center px-3 py-2 rounded transition-colors ${
        isActive ? 'bg-primary/10 text-primary' : 'hover:bg-base-200'
      }`}
    >
      <Icon className="w-5 h-5 mr-2" />
      <span className='font-bold '>{item.label}</span>
    </Link>
  );
});

export default NavItem;
