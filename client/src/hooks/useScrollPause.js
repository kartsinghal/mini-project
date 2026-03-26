import { useState, useEffect, useRef } from 'react';

/**
 * Returns `true` while the user is actively scrolling,
 * and `false` again after `delay` ms of scroll silence.
 *
 * Usage:
 *   const isScrolling = useScrollPause(200);
 *   // Pause framer-motion animations when isScrolling === true
 */
export function useScrollPause(delay = 180) {
  const [isScrolling, setIsScrolling] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolling(true);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setIsScrolling(false), delay);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      clearTimeout(timerRef.current);
    };
  }, [delay]);

  return isScrolling;
}
