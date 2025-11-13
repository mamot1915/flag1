
import React from 'react';

export const PopperIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" {...props}>
    <path d="M20 80 L40 60 L80 100 L60 100 Z" fill="#FFD700" />
    <path d="M40 60 L20 80 L20 90 L45 65 Z" fill="#F4B400" />
    <circle cx="25" cy="30" r="5" fill="#4285F4" />
    <circle cx="60" cy="20" r="6" fill="#EA4335" />
    <rect x="50" y="40" width="8" height="8" transform="rotate(45 54 44)" fill="#34A853" />
    <path d="M40 10 C 50 20, 60 35, 75 40" stroke="#FFD700" strokeWidth="4" fill="none" />
    <path d="M30 20 C 20 30, 20 45, 35 50" stroke="#EA4335" strokeWidth="4" fill="none" />
    <path d="M50 15 C 60 10, 70 20, 70 30" stroke="#4285F4" strokeWidth="4" fill="none" />
  </svg>
);
