

import React, { useState, useRef } from 'react';
import { CloseIcon } from './icons/CloseIcon';
import type { Country } from '../types';
import { SELECTABLE_COLORS } from '../constants';
import { PlayIcon } from './icons/PlayIcon';
import { PauseIcon } from './icons/PauseIcon';

type BackgroundMusicState = {
  url: string;
  name: string;
};

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  emojis: string[];
  onAddEmoji: (file: File) => void;
  selectedEmoji: string | null;
  onSelectEmoji: (url: string) => void;
  countries: Country[];
  scores: Record<string, number>;
  onScoreChange: (countryCode: string, change: number) => void;
  supporters: Record<string, number>;
  onSupporterChange: (countryCode: string, change: number) => void;
  colors: Record<string, string>;
  onColorChange: (countryCode: string, color: string) => void;
  onApplyEmoji: (countryCode: string) => void;
  countrySongs: Record<string, { url: string; player: HTMLAudioElement; } | null>;
  onSongUpload: (countryCode: string, file: File) => void;
  onPlaySong: (countryCode: string) => void;
  playingSong: string | null;
  isTimerRunning: boolean;
  onStartTimer: () => void;
  onStopTimer: () => void;
  onResetTimer: () => void;
  onSetTimer: (durationInSeconds: number) => void;
  backgroundMusic: (BackgroundMusicState | null)[];
  isBgMusicPlaying: boolean;
  onBackgroundMusicUpload: (file: File, index: number) => void;
  onBgMusicNameChange: (index: number, newName: string) => void;
  onPlayPauseBgMusic: (index: number) => void;
  currentBgTrackIndex: number | null;
  onRandomScore: () => void;
  allCountriesSelected: boolean;
  onResetRandomSelection: () => void;
  countryImages: Record<string, string | null>;
  showLikeSubscribe: boolean;
  onShowLikeSubscribe: () => void;
}

export const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ 
  isOpen, 
  onClose, 
  emojis, 
  onAddEmoji,
  selectedEmoji,
  onSelectEmoji,
  countries,
  scores,
  onScoreChange,
  supporters,
  onSupporterChange,
  colors,
  onColorChange,
  onApplyEmoji,
  countrySongs,
  onSongUpload,
  onPlaySong,
  playingSong,
  isTimerRunning,
  onStartTimer,
  onStopTimer,
  onResetTimer,
  onSetTimer,
  backgroundMusic,
  isBgMusicPlaying,
  onBackgroundMusicUpload,
  onBgMusicNameChange,
  onPlayPauseBgMusic,
  currentBgTrackIndex,
  onRandomScore,
  allCountriesSelected,
  onResetRandomSelection,
  countryImages,
  showLikeSubscribe,
  onShowLikeSubscribe,
}) => {
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');

  const pressTimerRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);
  const supporterPressTimerRef = useRef<number | null>(null);
  const supporterIntervalRef = useRef<number | null>(null);

  const handlePressStart = (countryCode: string, change: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (pressTimerRef.current) clearTimeout(pressTimerRef.current);
    onScoreChange(countryCode, change);
    pressTimerRef.current = window.setTimeout(() => {
      intervalRef.current = window.setInterval(() => {
        onScoreChange(countryCode, change);
      }, 100);
    }, 500);
  };

  const handlePressEnd = () => {
    if (pressTimerRef.current) clearTimeout(pressTimerRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    pressTimerRef.current = null;
    intervalRef.current = null;
  };
  
  const handleSupporterPressStart = (countryCode: string, change: number) => {
    if (supporterIntervalRef.current) clearInterval(supporterIntervalRef.current);
    if (supporterPressTimerRef.current) clearTimeout(supporterPressTimerRef.current);
    onSupporterChange(countryCode, change);
    supporterPressTimerRef.current = window.setTimeout(() => {
      supporterIntervalRef.current = window.setInterval(() => {
        onSupporterChange(countryCode, change);
      }, 100);
    }, 500);
  };

  const handleSupporterPressEnd = () => {
    if (supporterPressTimerRef.current) clearTimeout(supporterPressTimerRef.current);
    if (supporterIntervalRef.current) clearInterval(supporterIntervalRef.current);
    supporterPressTimerRef.current = null;
    supporterIntervalRef.current = null;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) onAddEmoji(file);
    event.target.value = '';
  };
  
  const handleSongFileChange = (event: React.ChangeEvent<HTMLInputElement>, countryCode: string) => {
    const file = event.target.files?.[0];
    if(file) onSongUpload(countryCode, file);
    event.target.value = '';
  }
  
  const handleBgMusicFileChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files?.[0];
    if (file) onBackgroundMusicUpload(file, index);
    event.target.value = '';
  };

  const handleSetAndStartTimer = () => {
    const h = parseInt(hours, 10) || 0;
    const m = parseInt(minutes, 10) || 0;
    const s = parseInt(seconds, 10) || 0;
    const totalSeconds = h * 3600 + m * 60 + s;
    if (totalSeconds >= 0) {
      onSetTimer(totalSeconds);
      setHours('');
      setMinutes('');
      setSeconds('');
    } else {
      alert("Please enter valid, positive numbers for the timer.");
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div 
        className="fixed inset-0 z-40"
        onClick={onClose}
        aria-hidden="true"
      ></div>
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-[#1e1e1e] shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } p-4 sm:p-6 flex flex-col`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="menu-title"
      >
        <header className="flex items-center justify-between mb-4">
          <h2 id="menu-title" className="text-2xl sm:text-3xl font-anton text-white uppercase">
            MENU
          </h2>
          <button 
            onClick={onClose} 
            className="text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Close menu"
          >
            <CloseIcon className="w-7 h-7 sm:w-8 sm:h-8" />
          </button>
        </header>
        
        <div className="flex-grow overflow-y-auto pr-2">
          
          <div className="mb-6">
            <h3 className="text-xl font-anton text-gray-300 uppercase mb-3">Timer Controls</h3>
            <div className="grid grid-cols-3 gap-2 mb-3">
               <div>
                <label htmlFor="hours" className="text-xs text-gray-400 block text-center mb-1">Hours</label>
                <input id="hours" type="number" min="0" placeholder="HH" value={hours} onChange={(e) => setHours(e.target.value)} className="w-full bg-gray-700 text-white p-2 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label htmlFor="minutes" className="text-xs text-gray-400 block text-center mb-1">Minutes</label>
                <input id="minutes" type="number" min="0" max="59" placeholder="MM" value={minutes} onChange={(e) => setMinutes(e.target.value)} className="w-full bg-gray-700 text-white p-2 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label htmlFor="seconds" className="text-xs text-gray-400 block text-center mb-1">Seconds</label>
                <input id="seconds" type="number" min="0" max="59" placeholder="SS" value={seconds} onChange={(e) => setSeconds(e.target.value)} className="w-full bg-gray-700 text-white p-2 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>
             <button
                onClick={handleSetAndStartTimer}
                className="w-full mb-3 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-md transition-colors"
              >
                Set & Start Timer
            </button>
            <div className="flex items-center justify-center gap-4">
              <button onClick={onStartTimer} disabled={isTimerRunning} className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition-colors">Start</button>
              <button onClick={onStopTimer} disabled={!isTimerRunning} className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition-colors">Stop</button>
              <button onClick={onResetTimer} className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition-colors">Reset</button>
            </div>
          </div>
          
          <hr className="border-white/10 my-6" />

          <div className="mb-6">
            <h3 className="text-xl font-anton text-gray-300 uppercase mb-3">امتیاز تصادفی</h3>
            <button
              onClick={onRandomScore}
              disabled={allCountriesSelected}
              className="w-full bg-teal-500 hover:bg-teal-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition-colors"
            >
              افزودن امتیاز تصادفی
            </button>
            {allCountriesSelected && (
              <>
                <p className="text-xs text-center text-gray-400 mt-2">
                  به تمام کشورها امتیاز داده شده است. برای شروع مجدد، دکمه زیر را فشار دهید.
                </p>
                <button
                  onClick={onResetRandomSelection}
                  className="w-full mt-2 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded-md transition-colors"
                >
                  مجدد
                </button>
              </>
            )}
          </div>

          <hr className="border-white/10 my-6" />
          
          <div className="mb-6">
            <h3 className="text-xl font-anton text-gray-300 uppercase mb-3">نمایش اعلان</h3>
            <button
              onClick={() => {
                onShowLikeSubscribe();
                onClose();
              }}
              className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
            >
              <span>نمایش اعلان برای ۷ ثانیه</span>
            </button>
          </div>

          <hr className="border-white/10 my-6" />

          <div className="mb-6">
            <h3 className="text-xl font-anton text-gray-300 uppercase mb-3">Background Music</h3>
            <div className="space-y-3">
              {[...Array(5)].map((_, index) => {
                const track = backgroundMusic[index];
                const isPlaying = currentBgTrackIndex === index && isBgMusicPlaying;
                
                return (
                  <div key={index} className="flex items-center gap-2 bg-white/5 p-2 rounded-lg">
                    <span className="text-gray-400 font-bold">{index + 1}.</span>
                    <div className="flex-grow">
                      {track ? (
                        <input
                          type="text"
                          value={track.name}
                          onChange={(e) => onBgMusicNameChange(index, e.target.value)}
                          placeholder="Song name"
                          spellCheck="false"
                          className="w-full bg-transparent text-white text-sm focus:outline-none focus:ring-0 border-0"
                        />
                      ) : (
                        <span className="text-sm text-gray-500">Empty slot</span>
                      )}
                    </div>

                    <label htmlFor={`bg-music-upload-${index}`} className="flex-shrink-0 bg-purple-500 hover:bg-purple-600 text-white font-bold p-2 rounded-md transition-colors cursor-pointer text-center text-xs h-8 flex items-center">
                        {track ? 'Change' : 'Upload'}
                    </label>
                    <input 
                        id={`bg-music-upload-${index}`}
                        type="file"
                        accept="audio/*"
                        onChange={(e) => handleBgMusicFileChange(e, index)}
                        className="hidden"
                    />

                    {track && (
                      <button 
                          onClick={() => onPlayPauseBgMusic(index)}
                          className="w-8 h-8 rounded-full bg-gray-700 hover:bg-green-600 flex items-center justify-center transition-colors flex-shrink-0"
                          aria-label={isPlaying ? `Pause ${track.name}` : `Play ${track.name}`}
                      >
                          {isPlaying ? <PauseIcon className="w-5 h-5 text-white"/> : <PlayIcon className="w-5 h-5 text-white"/>}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>


          <hr className="border-white/10 my-6" />

          <div className="mb-6">
            <h3 className="text-xl font-anton text-gray-300 uppercase mb-3">Country Controls</h3>
            <div className="space-y-4">
              {countries.map(country => {
                const { FlagComponent } = country;
                const currentColor = colors[country.code];
                const song = countrySongs[country.code];
                const countryImageUrl = countryImages[country.code];

                return (
                  <div key={country.code} className="bg-white/5 p-3 rounded-lg">
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        {countryImageUrl ? (
                          <img src={countryImageUrl} alt={country.name} className="w-10 h-7 rounded-sm object-cover" />
                        ) : (
                          <FlagComponent className="w-10 h-7 rounded-sm object-cover" />
                        )}
                        <span className="font-semibold text-sm text-white">{country.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onMouseDown={() => handlePressStart(country.code, -1)}
                          onMouseUp={handlePressEnd}
                          onMouseLeave={handlePressEnd}
                          onTouchStart={() => handlePressStart(country.code, -1)}
                          onTouchEnd={handlePressEnd}
                          className="w-8 h-8 rounded-full bg-gray-700 hover:bg-red-600 text-white font-bold text-xl flex items-center justify-center transition-colors" aria-label={`Decrease score for ${country.name}`}>-</button>
                        <button 
                          onMouseDown={() => handlePressStart(country.code, 1)}
                          onMouseUp={handlePressEnd}
                          onMouseLeave={handlePressEnd}
                          onTouchStart={() => handlePressStart(country.code, 1)}
                          onTouchEnd={handlePressEnd}
                          className="w-8 h-8 rounded-full bg-gray-700 hover:bg-green-600 text-white font-bold text-xl flex items-center justify-center transition-colors" aria-label={`Increase score for ${country.name}`}>+</button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-300">Supporters</span>
                      <div className="flex items-center gap-2">
                        <button 
                          onMouseDown={() => handleSupporterPressStart(country.code, -1)}
                          onMouseUp={handleSupporterPressEnd}
                          onMouseLeave={handleSupporterPressEnd}
                          onTouchStart={() => handleSupporterPressStart(country.code, -1)}
                          onTouchEnd={handleSupporterPressEnd}
                          className="w-8 h-8 rounded-full bg-gray-700 hover:bg-red-600 text-white font-bold text-xl flex items-center justify-center transition-colors" aria-label={`Decrease supporters for ${country.name}`}>-</button>
                        <span className="font-semibold text-white w-10 text-center">{supporters[country.code]}</span>
                        <button 
                          onMouseDown={() => handleSupporterPressStart(country.code, 1)}
                          onMouseUp={handleSupporterPressEnd}
                          onMouseLeave={handleSupporterPressEnd}
                          onTouchStart={() => handleSupporterPressStart(country.code, 1)}
                          onTouchEnd={handleSupporterPressEnd}
                          className="w-8 h-8 rounded-full bg-gray-700 hover:bg-green-600 text-white font-bold text-xl flex items-center justify-center transition-colors" aria-label={`Increase supporters for ${country.name}`}>+</button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      {SELECTABLE_COLORS.map(color => (
                        <button
                          key={color}
                          onClick={() => onColorChange(country.code, color)}
                          className={`w-7 h-7 rounded-full transition-transform hover:scale-110 ${color} ${currentColor === color ? 'ring-2 ring-offset-2 ring-offset-gray-800 ring-white' : ''}`}
                          aria-label={`Set color to ${color}`}
                        />
                      ))}
                    </div>
                     <button
                        onClick={() => onApplyEmoji(country.code)}
                        disabled={!selectedEmoji}
                        className="mt-3 w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition-colors text-center block text-sm"
                      >
                        Apply Emoji
                      </button>
                      <div className="flex items-center gap-2 mt-3">
                        <label htmlFor={`song-upload-${country.code}`} className="flex-grow bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-md transition-colors cursor-pointer text-center block text-sm">
                          Upload Song
                        </label>
                        <input 
                            id={`song-upload-${country.code}`}
                            type="file"
                            accept="audio/*"
                            onChange={(e) => handleSongFileChange(e, country.code)}
                            className="hidden"
                        />
                        {song && (
                            <button 
                                onClick={() => onPlaySong(country.code)}
                                className="w-10 h-10 rounded-full bg-gray-700 hover:bg-green-600 flex items-center justify-center transition-colors flex-shrink-0"
                                aria-label={`Play song for ${country.name}`}
                            >
                                {playingSong === country.code ? <PauseIcon className="w-6 h-6 text-white"/> : <PlayIcon className="w-6 h-6 text-white"/>}
                            </button>
                        )}
                      </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <hr className="border-white/10 my-6" />

          <div>
            <h3 className="text-xl font-anton text-gray-300 uppercase mb-4">ANIMATED EMOJIS</h3>
            <div className="mb-4">
              <label 
                htmlFor="emoji-upload" 
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition-colors cursor-pointer text-center block text-sm"
              >
                Upload New Emoji
              </label>
              <input 
                id="emoji-upload"
                type="file"
                accept="image/gif"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          
            <p className="text-xs font-medium text-gray-400 mb-2">Select an emoji to use</p>
            <div className="grid grid-cols-3 gap-2">
              {emojis.map((emoji) => (
                <div 
                  key={emoji} 
                  onClick={() => onSelectEmoji(emoji)}
                  className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${selectedEmoji === emoji ? 'ring-4 ring-green-500' : 'ring-2 ring-transparent hover:ring-gray-500'}`}
                  role="button"
                  tabIndex={0}
                  aria-label="Select emoji"
                >
                  <img src={emoji} alt="Emoji thumbnail" className="w-full h-full object-cover"/>
                  {selectedEmoji === emoji && (
                    <div className="absolute inset-0 bg-green-500/50 flex items-center justify-center">
                      <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </>
  );
};
