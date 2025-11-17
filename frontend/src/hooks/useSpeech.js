import { useState, useEffect, useRef, useCallback } from 'react';

export const useSpeech = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [rate, setRate] = useState(1);
  const utteranceRef = useRef(null);
  const textQueueRef = useRef([]);
  const currentIndexRef = useRef(0);

  useEffect(() => {
    // Check if speech synthesis is supported
    if (!window.speechSynthesis) {
      console.error('Speech synthesis not supported');
    }

    return () => {
      // Cleanup on unmount
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = useCallback((texts) => {
    if (!window.speechSynthesis) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    // Convert single text to array
    const textArray = Array.isArray(texts) ? texts : [texts];
    textQueueRef.current = textArray;
    currentIndexRef.current = 0;

    const speakNext = () => {
      if (currentIndexRef.current >= textQueueRef.current.length) {
        setIsPlaying(false);
        setIsPaused(false);
        return;
      }

      const text = textQueueRef.current[currentIndexRef.current];
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set Hindi language
      utterance.lang = 'hi-IN';
      utterance.rate = rate;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => {
        setIsPlaying(true);
        setIsPaused(false);
      };

      utterance.onend = () => {
        currentIndexRef.current += 1;
        speakNext();
      };

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setIsPlaying(false);
        setIsPaused(false);
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    };

    speakNext();
  }, [rate]);

  const pause = useCallback(() => {
    if (window.speechSynthesis && window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  }, []);

  const resume = useCallback(() => {
    if (window.speechSynthesis && isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  }, [isPaused]);

  const stop = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
      currentIndexRef.current = 0;
    }
  }, []);

  const changeRate = useCallback((newRate) => {
    setRate(newRate);
    if (isPlaying && utteranceRef.current) {
      // Restart with new rate
      const currentTexts = textQueueRef.current;
      const currentIndex = currentIndexRef.current;
      stop();
      textQueueRef.current = currentTexts.slice(currentIndex);
      currentIndexRef.current = 0;
      speak(textQueueRef.current);
    }
  }, [isPlaying, speak, stop]);

  return {
    speak,
    pause,
    resume,
    stop,
    isPlaying,
    isPaused,
    rate,
    changeRate
  };
};
