import React, { useEffect, useMemo, useRef, useState } from 'react';

type VideoSliderProps = {
  videos?: string[];
  className?: string;
};

const DEFAULT_VIDEOS = [
  '/cycling.mov',
  '/fencing.mov',
  '/golf.mov',
  '/nautical.mov',
  '/video.mov',
];

const VideoSlider: React.FC<VideoSliderProps> = ({ videos, className }) => {
  const sources = useMemo(() => (videos && videos.length ? videos : DEFAULT_VIDEOS), [videos]);
  const [index, setIndex] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const current = videoRefs.current[index];
    // Pausar todos excepto el actual
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      try {
        if (i === index) {
          v.currentTime = 0;
          const p = v.play();
          if (p && typeof p.then === 'function') p.catch(() => {});
        } else {
          v.pause();
        }
      } catch { void 0 }
    });
    return () => {
      if (current) {
        try { current.pause(); } catch { void 0 }
      }
    };
  }, [index, sources.length]);

  const handleEnded = () => {
    setIndex((prev) => (prev + 1) % sources.length);
  };

  return (
    <div className={"absolute inset-0 z-10 " + (className || '')} aria-hidden>
      <div className="relative w-full h-full">
        {sources.map((src, i) => (
          <video
            key={src + i}
            ref={(el) => { videoRefs.current[i] = el; }}
            className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-700 ${i === index ? 'opacity-100' : 'opacity-0'}`}
            muted
            playsInline
            preload="metadata"
            onEnded={handleEnded}
            controls={false}
            autoPlay={i === index}
          >
            <source src={src} type="video/mp4" />
          </video>
        ))}
      </div>
    </div>
  );
};

export default VideoSlider;