import { useEffect } from 'react';

export function useTimer(seconds, setSeconds) {
  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) setSeconds((seconds) => seconds - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [seconds, setSeconds]);

  return seconds;
}
