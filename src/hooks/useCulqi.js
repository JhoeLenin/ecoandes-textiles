import { useEffect, useRef, useCallback } from 'react';

const CULQI_SCRIPT_URL = 'https://js.culqi.com/checkout-js';

function loadScript() {
  return new Promise((resolve, reject) => {
    if (window.CulqiCheckout) {
      resolve();
      return;
    }
    const existing = document.querySelector(`script[src="${CULQI_SCRIPT_URL}"]`);
    if (existing) {
      existing.addEventListener('load', resolve);
      existing.addEventListener('error', reject);
      return;
    }
    const script = document.createElement('script');
    script.src = CULQI_SCRIPT_URL;
    script.async = true;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

export default function useCulqi({ amount, email, onToken, onError }) {
  const culqiRef = useRef(null);
  const callbacksRef = useRef({ onToken, onError });
  callbacksRef.current = { onToken, onError };

  useEffect(() => {
    let mounted = true;
    loadScript().then(() => {
      if (!mounted || !window.CulqiCheckout) return;
      initCulqi();
    });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (culqiRef.current && amount > 0) {
      culqiRef.current = null;
      initCulqi();
    }
  }, [amount, email]);

  function initCulqi() {
    if (!window.CulqiCheckout || amount <= 0) return;

    const publicKey = import.meta.env.VITE_CULQI_PUBLIC_KEY;
    if (!publicKey || publicKey === 'tu_llave_publica_aqui') return;

    const config = {
      settings: {
        title: 'EcoAndes Textiles',
        currency: 'PEN',
        amount: Math.round(amount * 100),
      },
      client: {
        email: email || '',
      },
      options: {
        lang: 'es',
        installments: false,
        modal: true,
        paymentMethods: {
          tarjeta: true,
          yape: false,
          bancaMovil: false,
          agente: false,
          billetera: false,
          cuotealo: false,
        },
      },
      appearance: {
        theme: 'default',
        hiddenCulqiLogo: true,
        menuType: 'sidebar',
        buttonCardPayText: 'Pagar',
        defaultStyle: {
          bannerColor: '#1a1a1a',
          buttonBackground: '#b8860b',
          menuColor: '#1a1a1a',
          linksColor: '#b8860b',
          buttonTextColor: '#fff',
          priceColor: '#1a1a1a',
        },
      },
    };

    culqiRef.current = new window.CulqiCheckout(publicKey, config);
    culqiRef.current.culqi = () => {
      if (culqiRef.current.token) {
        const token = culqiRef.current.token;
        culqiRef.current.close();
        callbacksRef.current.onToken?.(token);
      } else if (culqiRef.current.error) {
        const error = culqiRef.current.error;
        culqiRef.current.close();
        callbacksRef.current.onError?.(error);
      }
    };
  }

  const open = useCallback(() => {
    if (!culqiRef.current) {
      initCulqi();
    }
    if (culqiRef.current) {
      culqiRef.current.open();
    }
  }, []);

  return { open };
}
