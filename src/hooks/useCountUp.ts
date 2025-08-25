import { useEffect, useState } from 'react';
import useScrollAnimation from './useScrollAnimation';

interface UseCountUpProps {
  end: number;
  duration?: number;
  start?: number;
}

export const useCountUp = ({ end, duration = 2000, start = 0 }: UseCountUpProps) => {
  const [count, setCount] = useState(start);
  const { ref, isVisible } = useScrollAnimation();

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Función de easing para una animación más suave
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(easeOutQuart * (end - start) + start);
      
      setCount(currentCount);
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isVisible, end, duration, start]);

  return { count, ref, isVisible };
};

export default useCountUp;