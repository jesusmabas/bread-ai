import React from 'react';

interface IconProps extends React.HTMLAttributes<HTMLElement> {
  icon: string;
}

export const Icon: React.FC<IconProps> = ({ icon, className = '', ...props }) => {
  return <i className={`${icon} ${className}`} {...props}></i>;
};
