import React, { createContext, useContext, useCallback, useRef } from 'react';

type SoundType = 'success' | 'click' | 'error' | 'processing' | 'points';

interface SoundContextType {
  play: (type: SoundType) => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

const SOUND_URLS: Record<SoundType, string> = {
  success: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3', // Digital Success
  click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',   // Interface Click
  error: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',   // Error/Thud
  processing: 'https://assets.mixkit.co/active_storage/sfx/2567/2567-preview.mp3', // Subtle hum
  points: 'https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3'    // Digital Point Gain
};

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const audioRefs = useRef<Partial<Record<SoundType, HTMLAudioElement>>>({});

  const play = useCallback((type: SoundType) => {
    // Sound disabled per user request
  }, []);

  return (
    <SoundContext.Provider value={{ play }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) throw new Error('useSound must be used within a SoundProvider');
  return context;
};
