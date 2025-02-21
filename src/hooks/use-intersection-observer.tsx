import { useState, useEffect, useRef } from "react";

export const UseInetersectionObserver = (
  options?: IntersectionObserverInit
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const targetref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);
    if (targetref.current) {
      observer.observe(targetref.current);
    }
    return () => observer.disconnect();
  }, [options]);
  return { targetref, isIntersecting };
};
