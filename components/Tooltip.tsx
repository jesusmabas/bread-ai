import React from 'react';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ text, children }) => (
  <div className="relative flex items-center group">
    {children}
    <div className="absolute left-0 bottom-full mb-2 w-64 p-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
      {text}
    </div>
  </div>
);

export default Tooltip;
