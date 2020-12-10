import React from 'react';

export function useClickOutside(
  ref: React.MutableRefObject<any> | React.MutableRefObject<any>[],
  handler: (event: MouseEvent | TouchEvent) => void
) {
  React.useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const refs = (Array.isArray(ref) ? ref.map((item) => item.current) : [ref.current]).filter((item) => !!item);
      if (!refs.length || refs.some((ref) => ref.contains(event.target))) {
        return;
      }

      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}
