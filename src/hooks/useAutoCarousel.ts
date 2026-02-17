import { useState, useEffect, useRef } from 'react';

interface UseAutoCarouselProps {
  itemCount: number;
  visibleItems: number;
  autoScrollInterval?: number;
  pauseOnHover?: boolean;
}

export const useAutoCarousel = ({
  itemCount,
  visibleItems,
  autoScrollInterval = 4000,
  pauseOnHover = true
}: UseAutoCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const maxIndex = Math.max(0, itemCount - visibleItems);

  const goToNext = () => {
    setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
  };

  const goToPrev = () => {
    setCurrentIndex(prev => (prev <= 0 ? maxIndex : prev - 1));
  };

  const goToIndex = (index: number) => {
    setCurrentIndex(Math.max(0, Math.min(index, maxIndex)));
  };

  useEffect(() => {
    if (isPaused || itemCount <= visibleItems) return;

    intervalRef.current = setInterval(() => {
      setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
    }, autoScrollInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused, autoScrollInterval, itemCount, visibleItems, maxIndex]);

  // Pause/resume handlers
  const handleMouseEnter = () => {
    if (pauseOnHover) {
      setIsPaused(true);
    }
  };

  const handleMouseLeave = () => {
    if (pauseOnHover) {
      setIsPaused(false);
    }
  };

  // Touch handlers for mobile
  const handleTouchStart = () => {
    setIsPaused(true);
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
  };

  return {
    currentIndex,
    goToNext,
    goToPrev,
    goToIndex,
    containerRef,
    handleMouseEnter,
    handleMouseLeave,
    handleTouchStart,
    handleTouchEnd,
    maxIndex
  };
};

export default useAutoCarousel;
