import { useState, useEffect } from 'react';

export function useCancelShadow(config) {
  const {
    background = 'rgba(0, 0, 0, 0.5)',
    zIndex = '100',
    event = () => { }
  } = config || {};
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isVisible) return;

    const shadow = document.createElement('div');
    shadow.style.width = '100vw';
    shadow.style.height = '100vh';
    shadow.style.position = 'fixed';
    shadow.style.top = '0';
    shadow.style.left = '0';
    shadow.style.background = background;
    shadow.style.zIndex = zIndex;

    shadow.onclick = () => {
      setIsVisible(false);
      shadow.style.display = 'none';
      event();
    };
    shadow.ontouchstart = () => {
      setIsVisible(false);
      shadow.style.display = 'none';
      event();
    };

    document.body.appendChild(shadow);

    return () => {
      if (shadow) {
        document.body.removeChild(shadow);
      }
    };
  }, [isVisible, background, zIndex, event]);

  return { 
    trigger: () => setIsVisible(true) 
  };
}