import { useEffect, useRef } from 'react';

export const useOnClickOutside = (ref, callback) => {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const handleClick = (e) => {
      // Use isTrusted to check if the event is coming from a real user, or is coming from a script.
      if (ref.current && !ref.current.contains(e.target) && e.isTrusted) {
        callbackRef.current();
      }
    };

    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [ref]);
};
