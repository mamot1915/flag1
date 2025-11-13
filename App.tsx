

import React, { useState, useEffect, useRef } from 'react';
import { CountryRow } from './components/CountryRow';
import { HamburgerMenu } from './components/HamburgerMenu';
import { HamburgerIcon } from './components/icons/HamburgerIcon';
import { COUNTRIES, PRELOADED_EMOJIS } from './constants';
import type { Country } from './types';
import { LikeSubscribe } from './components/LikeSubscribe';

type SongState = {
  url: string;
  player: HTMLAudioElement;
};

type BackgroundMusicState = {
  url: string;
  name: string;
};

const App: React.FC = () => {
  const getInitialState = <T,>(key: string, defaultValue: T): T => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch (error) {
      console.error(`Failed to parse ${key} from localStorage`, error);
      return defaultValue;
    }
  };

  const [texts, setTexts] = useState<Record<string, string>>(() => 
    getInitialState('flagChallenge_texts', COUNTRIES.reduce((acc, country: Country) => ({ ...acc, [country.code]: '' }), {}))
  );
  const [scores, setScores] = useState<Record<string, number>>(() =>
    getInitialState('flagChallenge_scores', COUNTRIES.reduce((acc, country: Country) => ({ ...acc, [country.code]: 0 }), {}))
  );
  const [supporters, setSupporters] = useState<Record<string, number>>(() =>
    getInitialState('flagChallenge_supporters', COUNTRIES.reduce((acc, country) => ({ ...acc, [country.code]: 0 }), {}))
  );
  const [winnerName, setWinnerName] = useState<Record<string, string>>(() => 
    getInitialState('flagChallenge_winnerName', COUNTRIES.reduce((acc, country) => ({ ...acc, [country.code]: '' }), {}))
  );
  const [inputColors, setInputColors] = useState<Record<string, string>>(() =>
    getInitialState('flagChallenge_inputColors', COUNTRIES.reduce((acc, country) => ({ ...acc, [country.code]: country.barColor }), {}))
  );
  const [emojis, setEmojis] = useState<string[]>(PRELOADED_EMOJIS);
  const [countryImages, setCountryImages] = useState<Record<string, string | null>>(() =>
    getInitialState('flagChallenge_countryImages', COUNTRIES.reduce((acc, country) => ({ ...acc, [country.code]: null }), {}))
  );
  const [countrySongs, setCountrySongs] = useState<Record<string, SongState | null>>(() => {
    const saved = localStorage.getItem('flagChallenge_countrySongs');
    const initialSongs: Record<string, SongState | null> = 
        COUNTRIES.reduce((acc, country) => ({ ...acc, [country.code]: null }), {});
    if (saved) {
        try {
            const savedUrls: Record<string, { url: string } | null> = JSON.parse(saved);
            for (const code in savedUrls) {
                if (savedUrls[code]?.url) {
                    const player = new Audio(savedUrls[code]!.url);
                    initialSongs[code] = { url: savedUrls[code]!.url, player };
                }
            }
        } catch (error) {
            console.error('Failed to parse country songs from localStorage', error);
        }
    }
    return initialSongs;
  });
  const [playingSong, setPlayingSong] = useState<string | null>(null);
  
  const [remainingTime, setRemainingTime] = useState(() => getInitialState('flagChallenge_remainingTime', 0));
  const [initialDuration, setInitialDuration] = useState(() => getInitialState('flagChallenge_initialDuration', 0));
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const [backgroundMusic, setBackgroundMusic] = useState<(BackgroundMusicState | null)[]>(() => getInitialState('flagChallenge_bgMusic', Array(5).fill(null)));
  const [currentBgTrackIndex, setCurrentBgTrackIndex] = useState<number | null>(() => getInitialState('flagChallenge_currentBgTrackIndex', null));
  const [isBgMusicPlaying, setIsBgMusicPlaying] = useState(false);
  const bgMusicPlayerRef = useRef<HTMLAudioElement | null>(null);

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [playingEmojis, setPlayingEmojis] = useState<Record<string, string | null>>({});

  const [randomlySelectedCountries, setRandomlySelectedCountries] = useState<string[]>(() =>
    getInitialState('flagChallenge_randomlySelectedCountries', [])
  );
  const [animatingCountry, setAnimatingCountry] = useState<string | null>(null);
  const [allCountriesSelected, setAllCountriesSelected] = useState<boolean>(() => getInitialState('flagChallenge_allCountriesSelected', false));
  const [showLikeSubscribe, setShowLikeSubscribe] = useState(false);


  useEffect(() => { localStorage.setItem('flagChallenge_texts', JSON.stringify(texts)); }, [texts]);
  useEffect(() => { localStorage.setItem('flagChallenge_scores', JSON.stringify(scores)); }, [scores]);
  useEffect(() => { localStorage.setItem('flagChallenge_supporters', JSON.stringify(supporters)); }, [supporters]);
  useEffect(() => { localStorage.setItem('flagChallenge_winnerName', JSON.stringify(winnerName)); }, [winnerName]);
  useEffect(() => { localStorage.setItem('flagChallenge_inputColors', JSON.stringify(inputColors)); }, [inputColors]);
  useEffect(() => { localStorage.setItem('flagChallenge_countryImages', JSON.stringify(countryImages)); }, [countryImages]);
  useEffect(() => { localStorage.setItem('flagChallenge_remainingTime', JSON.stringify(remainingTime)); }, [remainingTime]);
  useEffect(() => { localStorage.setItem('flagChallenge_initialDuration', JSON.stringify(initialDuration)); }, [initialDuration]);
  useEffect(() => { localStorage.setItem('flagChallenge_bgMusic', JSON.stringify(backgroundMusic)); }, [backgroundMusic]);
  useEffect(() => { localStorage.setItem('flagChallenge_currentBgTrackIndex', JSON.stringify(currentBgTrackIndex)); }, [currentBgTrackIndex]);
  useEffect(() => { localStorage.setItem('flagChallenge_randomlySelectedCountries', JSON.stringify(randomlySelectedCountries)); }, [randomlySelectedCountries]);
  useEffect(() => { localStorage.setItem('flagChallenge_allCountriesSelected', JSON.stringify(allCountriesSelected)); }, [allCountriesSelected]);
  
  useEffect(() => {
    const songsToSave: Record<string, { url: string } | null> = {};
    for (const code in countrySongs) {
        songsToSave[code] = countrySongs[code] ? { url: countrySongs[code]!.url } : null;
    }
    localStorage.setItem('flagChallenge_countrySongs', JSON.stringify(songsToSave));
  }, [countrySongs]);

  useEffect(() => {
    for (const code in countrySongs) {
      const song = countrySongs[code];
      if (song && !song.player.onended) {
        song.player.onended = () => {
          setPlayingSong(current => (current === code ? null : current));
        };
      }
    }
  }, [countrySongs]);
  
  useEffect(() => {
    let intervalId: number | undefined;
    if (isTimerRunning && remainingTime > 0) {
      intervalId = window.setInterval(() => {
        setRemainingTime(prev => prev - 1);
      }, 1000);
    } else if (remainingTime <= 0) {
      setIsTimerRunning(false);
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isTimerRunning, remainingTime]);

  useEffect(() => {
    if (!bgMusicPlayerRef.current) {
      bgMusicPlayerRef.current = new Audio();
      const player = bgMusicPlayerRef.current;
      player.loop = true;
      
      const onPlay = () => setIsBgMusicPlaying(true);
      const onPause = () => setIsBgMusicPlaying(false);
      player.addEventListener('play', onPlay);
      player.addEventListener('pause', onPause);
      
      return () => {
        player.removeEventListener('play', onPlay);
        player.removeEventListener('pause', onPause);
      }
    }
  }, []);


  const formatTime = (seconds: number) => {
    if (seconds < 0) seconds = 0;
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return [h, m, s]
      .map(v => v.toString().padStart(2, '0'))
      .join(':');
  };

  const handleStartTimer = () => { if (remainingTime > 0) setIsTimerRunning(true); };
  const handleStopTimer = () => setIsTimerRunning(false);
  
  const handleSetTimer = (durationInSeconds: number) => {
    if (durationInSeconds >= 0) {
      setInitialDuration(durationInSeconds);
      setRemainingTime(durationInSeconds);
      setIsTimerRunning(durationInSeconds > 0);
    }
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setRemainingTime(initialDuration);
  };

  const handleTextChange = (countryCode: string, newText: string) => setTexts(prev => ({ ...prev, [countryCode]: newText }));
  const handleScoreChange = (countryCode: string, change: number) => setScores(prev => ({ ...prev, [countryCode]: Math.max(0, prev[countryCode] + change) }));
  const handleSupporterChange = (countryCode: string, change: number) => setSupporters(prev => ({ ...prev, [countryCode]: Math.max(0, prev[countryCode] + change) }));
  const handleWinnerNameChange = (countryCode: string, newName: string) => setWinnerName(prev => ({ ...prev, [countryCode]: newName }));
  const handleColorChange = (countryCode: string, newColor: string) => setInputColors(prev => ({ ...prev, [countryCode]: newColor }));
  
  const handleAddEmoji = (file: File) => {
    if (file && file.type === 'image/gif') {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (base64String && !emojis.includes(base64String)) {
          setEmojis(prev => [base64String, ...prev]);
        }
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please upload a valid GIF file to use as an emoji.');
    }
  };

  const handleApplyEmoji = (countryCode: string) => {
    if (selectedEmoji) {
      setPlayingEmojis(prev => ({...prev, [countryCode]: selectedEmoji}));
      setTimeout(() => {
        setPlayingEmojis(prev => ({...prev, [countryCode]: null}));
      }, 15000);
    }
  };
  
  const handleCountryImageUpload = (countryCode: string, file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => setCountryImages(prev => ({ ...prev, [countryCode]: reader.result as string }));
      reader.readAsDataURL(file);
    } else {
      alert('Please upload a valid image file.');
    }
  };

  const handleSongUpload = (countryCode: string, file: File) => {
    if (file && file.type.startsWith('audio/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const url = reader.result as string;
        const player = new Audio(url);
        
        const currentSong = countrySongs[countryCode];
        if (currentSong) currentSong.player.pause();
        if (playingSong === countryCode) setPlayingSong(null);
        
        setCountrySongs(prev => ({ ...prev, [countryCode]: { url, player } }));
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please upload a valid audio file.');
    }
  };

  const handlePlaySong = (countryCode: string) => {
    const songToPlay = countrySongs[countryCode];
    if (!songToPlay) return;

    for (const code in countrySongs) {
      const song = countrySongs[code];
      if (song && code !== countryCode) {
        song.player.pause();
      }
    }

    if (songToPlay.player.paused) {
      const currentPlaying = countrySongs[playingSong!];
      if (currentPlaying) currentPlaying.player.pause();
      songToPlay.player.play();
      setPlayingSong(countryCode);
    } else {
      songToPlay.player.pause();
      setPlayingSong(null);
    }
  };
  
  const handleBackgroundMusicUpload = (file: File, index: number) => {
    if (file && file.type.startsWith('audio/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
            const newTrack = {
                url: reader.result as string,
                name: file.name
            };
            setBackgroundMusic(prev => {
                const newList = [...prev];
                newList[index] = newTrack;
                return newList;
            });
        };
        reader.readAsDataURL(file);
    } else {
        alert('Please upload a valid audio file.');
    }
  };

  const handleBgMusicNameChange = (index: number, newName: string) => {
    setBackgroundMusic(prev => {
        const newList = [...prev].map((item, i) => {
            if (i === index && item) {
                return { ...item, name: newName };
            }
            return item;
        });
        return newList;
    });
  };

  const handlePlayPauseBgMusic = (index: number) => {
    const track = backgroundMusic[index];
    if (!track || !bgMusicPlayerRef.current) return;

    if (currentBgTrackIndex === index) {
        if (bgMusicPlayerRef.current.paused) {
            bgMusicPlayerRef.current.play().catch(e => console.error("Error playing music", e));
        } else {
            bgMusicPlayerRef.current.pause();
        }
    } else {
        setCurrentBgTrackIndex(index);
        bgMusicPlayerRef.current.src = track.url;
        bgMusicPlayerRef.current.play().catch(e => console.error("Error playing music", e));
    }
  };
  
  const handleRandomScore = () => {
    const allCountryCodes = COUNTRIES.map(c => c.code);
    const availableCountries = allCountryCodes.filter(code => !randomlySelectedCountries.includes(code));

    if (availableCountries.length === 0) {
      setAllCountriesSelected(true);
      return;
    }

    const randomCountryIndex = Math.floor(Math.random() * availableCountries.length);
    const selectedCountryCode = availableCountries[randomCountryIndex];

    const scoresToAdd = [100, 200, 300];
    const randomScoreIndex = Math.floor(Math.random() * scoresToAdd.length);
    const scoreToAdd = scoresToAdd[randomScoreIndex];

    setAnimatingCountry(selectedCountryCode);

    setTimeout(() => {
      handleScoreChange(selectedCountryCode, scoreToAdd);
    }, 3000);

    setTimeout(() => {
      setAnimatingCountry(null);
    }, 4000);

    const newSelectedCountries = [...randomlySelectedCountries, selectedCountryCode];
    setRandomlySelectedCountries(newSelectedCountries);

    if (newSelectedCountries.length === allCountryCodes.length) {
      setAllCountriesSelected(true);
    }
  };

  const handleResetRandomSelection = () => {
    setRandomlySelectedCountries([]);
    setAllCountriesSelected(false);
  };
  
  const handleShowLikeSubscribe = () => {
    setShowLikeSubscribe(true);
    setTimeout(() => {
      setShowLikeSubscribe(false);
    }, 7000);
  };


  const sortedCountries = [...COUNTRIES].sort((a, b) => scores[b.code] - scores[a.code]);

  return (
    <div className="bg-[#2C2C2C] min-h-screen text-white p-2 sm:p-4 md:p-8">
      <div className="fixed top-4 right-4 sm:top-6 sm:right-6 md:top-8 md:right-8 z-30 flex flex-col items-end gap-2">
        <button 
          onClick={() => setIsMenuOpen(true)} 
          className="text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Open menu"
        >
          <HamburgerIcon className="w-8 h-8 sm:w-10 sm:h-10" />
        </button>
      </div>
      <main className="max-w-4xl mx-auto">
        <header className="flex items-center justify-center mb-6 sm:mb-8">
          <div className="flex flex-col items-center">
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-wider">
              Flag Challenge
            </h1>
            <div className="font-black text-3xl sm:text-4xl tracking-wider text-yellow-300">
              {formatTime(remainingTime)}
            </div>
          </div>
        </header>

        <div className="space-y-4 max-w-[34rem] mx-auto">
          {sortedCountries.map((country, index) => (
            <CountryRow
              key={country.code}
              country={country}
              value={texts[country.code]}
              score={scores[country.code]}
              onChange={(e) => handleTextChange(country.code, e.target.value)}
              playingEmojiUrl={playingEmojis[country.code] || null}
              inputColor={inputColors[country.code]}
              countryImageUrl={countryImages[country.code]}
              onCountryImageUpload={(file) => handleCountryImageUpload(country.code, file)}
              supporters={supporters[country.code]}
              winnerName={winnerName[country.code]}
              onWinnerNameChange={(e) => handleWinnerNameChange(country.code, e.target.value)}
              playingSong={playingSong}
              animatingCountry={animatingCountry}
              isLeader={index === 0 && scores[country.code] > 0}
            />
          ))}
        </div>
      </main>
      
      <HamburgerMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        emojis={emojis}
        onAddEmoji={handleAddEmoji}
        selectedEmoji={selectedEmoji}
        onSelectEmoji={setSelectedEmoji}
        countries={COUNTRIES}
        scores={scores}
        onScoreChange={handleScoreChange}
        supporters={supporters}
        onSupporterChange={handleSupporterChange}
        colors={inputColors}
        onColorChange={handleColorChange}
        onApplyEmoji={handleApplyEmoji}
        countrySongs={countrySongs}
        onSongUpload={handleSongUpload}
        onPlaySong={handlePlaySong}
        playingSong={playingSong}
        isTimerRunning={isTimerRunning}
        onStartTimer={handleStartTimer}
        onStopTimer={handleStopTimer}
        onResetTimer={handleResetTimer}
        onSetTimer={handleSetTimer}
        backgroundMusic={backgroundMusic}
        isBgMusicPlaying={isBgMusicPlaying}
        onBackgroundMusicUpload={handleBackgroundMusicUpload}
        currentBgTrackIndex={currentBgTrackIndex}
        onBgMusicNameChange={handleBgMusicNameChange}
        onPlayPauseBgMusic={handlePlayPauseBgMusic}
        // FIX: Corrected typo from 'onRandomScore' to 'handleRandomScore' to pass the correct function as a prop.
        onRandomScore={handleRandomScore}
        allCountriesSelected={allCountriesSelected}
        onResetRandomSelection={handleResetRandomSelection}
        countryImages={countryImages}
        showLikeSubscribe={showLikeSubscribe}
        onShowLikeSubscribe={handleShowLikeSubscribe}
      />
      <LikeSubscribe show={showLikeSubscribe} />
    </div>
  );
};

export default App;