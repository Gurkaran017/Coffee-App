import React, { createContext, useContext, useRef } from 'react';

type Step = { name: string; order: number };

interface WalkthroughContextType {
  scrollAndHighlightStep: (step: Step) => Promise<void>;
  setScrollHandler: (handler: (step: Step) => Promise<void>) => void;
}

const WalkthroughContext = createContext<WalkthroughContextType | null>(null);

export const WalkthroughProvider = ({ children }: { children: React.ReactNode }) => {
  const handlerRef = useRef<((step: Step) => Promise<void>) | null>(null);

  const scrollAndHighlightStep = async (step: Step): Promise<void> => {
    if (handlerRef.current) {
      await handlerRef.current(step);
    } else {
      console.warn('Scroll handler not set yet.');
      return Promise.resolve();
    }
  };

  const setScrollHandler = (handler: (step: Step) => Promise<void>) => {
    handlerRef.current = handler;
  };

  return (
    <WalkthroughContext.Provider value={{ scrollAndHighlightStep, setScrollHandler }}>
      {children}
    </WalkthroughContext.Provider>
  );
};

export const useWalkthrough = () => {
  const ctx = useContext(WalkthroughContext);
  if (!ctx) throw new Error('Wrap your app in <WalkthroughProvider>');
  return ctx;
};