import React from 'react';
import type { Country } from '../types';
import { UserIcon } from './icons/UserIcon';
import { CameraIcon } from './icons/CameraIcon';

interface CountryRowProps {
  country: Country;
  value: string;
  score: number;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  playingEmojiUrl: string | null;
  inputColor: string;
  countryImageUrl: string | null;
  onCountryImageUpload: (file: File) => void;
  supporters: number;
  winnerName: string;
  onWinnerNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  playingSong: string | null;
  animatingCountry: string | null;
  isLeader: boolean;
}

export const CountryRow: React.FC<CountryRowProps> = ({ 
  country, 
  value, 
  score,
  onChange, 
  playingEmojiUrl, 
  inputColor,
  countryImageUrl,
  onCountryImageUpload,
  supporters,
  winnerName,
  onWinnerNameChange,
  playingSong,
  animatingCountry,
  isLeader,
}) => {
  const countryImageUploadId = `country-image-upload-${country.code}`;
  const isPlaying = playingSong === country.code;
  const isAnimating = animatingCountry === country.code;

  const borderClasses = isAnimating ? 'random-score-animation' : '';

  const handleCountryImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onCountryImageUpload(file);
    }
    event.target.value = '';
  };

  return (
    <div className="flex items-start gap-2 w-full">
      <div className="relative flex flex-col items-center justify-center gap-1 flex-shrink-0 w-24 sm:w-28">
        {isLeader && (
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-10">
                <span className="text-4xl sm:text-5xl animate-regal-glow block" role="img" aria-label="Crown">👑</span>
            </div>
        )}
        <div className="relative w-full h-14 sm:h-16">
            <label htmlFor={countryImageUploadId} className={`relative w-full h-full flag-animation bg-black/20 rounded-lg overflow-hidden cursor-pointer flex items-center justify-center text-gray-400 hover:bg-black/40 transition-colors ${isPlaying ? 'playing-glow' : ''} ${borderClasses}`}>
                {countryImageUrl ? (
                    <img src={countryImageUrl} alt={country.name} className="w-full h-full object-cover" />
                ) : (
                    <CameraIcon className="w-6 h-6 sm:w-8 sm:h-8" />
                )}
                {playingEmojiUrl && (
                    <img 
                    src={playingEmojiUrl}
                    alt="Animation playing over flag"
                    className="absolute top-0 left-0 w-full h-full object-cover"
                    key={playingEmojiUrl + Date.now()}
                    />
                )}
            </label>
            <input 
              id={countryImageUploadId}
              type="file"
              accept="image/*"
              onChange={handleCountryImageFileChange}
              className="hidden"
            />
        </div>
        <div className="font-anton text-white text-xl sm:text-2xl tracking-wide">
          <span>{score}</span>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <textarea
          value={value}
          onChange={onChange}
          placeholder="..."
          spellCheck="false"
          className={`w-full px-3 py-2 h-14 rounded-xl text-white placeholder-gray-300/60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#2C2C2C] focus:ring-white transition-all duration-300 text-sm sm:text-base font-semibold ${inputColor} cursor-text resize-none hide-scrollbar`}
        />
      </div>

      <div className="flex-shrink-0 flex flex-col items-center justify-center gap-1">
        <div className={`flex items-center justify-center gap-1.5 text-white bg-gray-700 rounded-full px-2 h-10 w-24 sm:w-28 sm:h-12 transition-all duration-300 ${supporters >= 1 ? 'ring-4 ring-blue-400 shadow-lg shadow-blue-400/50' : ''}`}>
          <UserIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300 flex-shrink-0" />
          <span className="font-bold text-base sm:text-lg truncate">{supporters}</span>
        </div>
        <input
          type="text"
          value={winnerName}
          onChange={onWinnerNameChange}
          placeholder="..."
          spellCheck="false"
          className={`w-24 sm:w-28 h-8 sm:h-9 bg-gray-800/80 rounded-full text-white text-center text-xs sm:text-sm placeholder-gray-400 focus:outline-none transition-shadow duration-300 ${winnerName ? 'ring-2 ring-amber-400' : 'focus:ring-2 focus:ring-gray-500'}`}
        />
      </div>
    </div>
  );
};