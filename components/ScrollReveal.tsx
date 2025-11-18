import React, { useRef, useEffect, useState, cloneElement, Children } from 'react';

interface ScrollRevealProps {
  children: React.ReactElement;
  delay?: number;
  className?: string; // Allow passing additional classNames to the wrapper
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({ children, delay = 0, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  // We need a ref for the actual element we want to observe
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Use isIntersecting and a state guard to prevent re-triggering
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          // Once visible, we can stop observing
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1, // Trigger when 10% of the element is visible
      }
    );

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [isVisible]); // Effect depends on isVisible to avoid re-running

  // We must clone the single child element to attach the ref and add classes/styles
  // Fix: Cast child to React.ReactElement<any> to address type inference issues.
  // This informs TypeScript that child.props can have any properties, resolving
  // errors when accessing `className` and `style`, and also allows `cloneElement`
  // to accept a `ref`.
  const child = Children.only(children) as React.ReactElement<any>;
  
  const childClassName = [
    'reveal',
    isVisible ? 'visible' : '',
    child.props.className || ''
  ].filter(Boolean).join(' ');

  const style = {
    ...child.props.style,
    '--reveal-delay': `${delay}ms`,
  } as React.CSSProperties;

  return cloneElement(child, {
    ref: elementRef,
    className: childClassName,
    style: style,
  });
};

export default ScrollReveal;
