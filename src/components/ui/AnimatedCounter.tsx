import { useEffect, useState, useRef } from 'react';

interface Props {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}

export default function AnimatedCounter({ end, duration = 1500, suffix = '', prefix = '' }: Props) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let startTimestamp: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Easing easeOutQuad
      const easeProgress = progress * (2 - progress);
      setCount(Math.floor(easeProgress * end));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          animationFrameId = requestAnimationFrame(step);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, [end, duration]);

  return (
    <span ref={elementRef} className="tabular-nums">
      {prefix}{count}{suffix}
    </span>
  );
}
