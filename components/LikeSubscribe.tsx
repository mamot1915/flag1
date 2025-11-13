import React from 'react';
import { LikeIcon } from './icons/LikeIcon';
import { BellIcon } from './icons/BellIcon';

interface LikeSubscribeProps {
  show: boolean;
}

export const LikeSubscribe: React.FC<LikeSubscribeProps> = ({ show }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20">
        <div className="flex items-center justify-center gap-6 sm:gap-10">
          
          <div 
            className="flex flex-col items-center gap-2 animate-twinkle"
            style={{ animationDelay: '0s' }}
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-800 rounded-full flex items-center justify-center border-2 border-blue-400">
              <LikeIcon className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400" />
            </div>
            <span className="font-bold text-white text-sm sm:text-base">LIKE</span>
          </div>

          <div 
            className="flex flex-col items-center gap-2 animate-twinkle"
            style={{ animationDelay: '0.2s' }}
          >
            <div className="px-6 py-3 sm:px-8 sm:py-4 bg-red-600 rounded-full flex items-center justify-center border-2 border-red-400">
              <span className="font-anton text-white text-sm sm:text-base tracking-wider">SUBSCRIBE</span>
            </div>
          </div>
          
          <div 
            className="flex flex-col items-center gap-2 animate-twinkle"
            style={{ animationDelay: '0.4s' }}
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-800 rounded-full flex items-center justify-center border-2 border-yellow-400">
              <BellIcon className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-400" />
            </div>
            <span className="font-bold text-white text-sm sm:text-base">NOTIFY</span>
          </div>

        </div>
      </div>
    </div>
  );
};